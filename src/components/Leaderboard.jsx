import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, Flame, Star, Award, Search, User } from 'lucide-react';
import GlassCard from './GlassCard';

const Leaderboard = () => {
  const { token } = useAuth();
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/progress/leaderboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setBoard(data.leaderboard);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [token]);

  if (loading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
        <p className="text-sm text-brand-textMuted">Syncing ranks...</p>
      </div>
    );
  }

  // Split board into podium (top 3) and remaining list (ranks 4+)
  const podium = board.slice(0, 3);
  const list = board.slice(3);

  // Re-order podium as 2, 1, 3 for visual rendering
  const sortedPodium = [];
  if (podium[1]) sortedPodium.push({ ...podium[1], pos: 2 });
  if (podium[0]) sortedPodium.push({ ...podium[0], pos: 1 });
  if (podium[2]) sortedPodium.push({ ...podium[2], pos: 3 });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Title Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-300 to-brand-secondary">
          Global Learning Leaderboard
        </h2>
        <p className="mt-3 max-w-xl mx-auto text-sm text-brand-textMuted">
          Compete with students globally. Earn XP points by completing lessons, keeping your learning streak active, and unlocking badges.
        </p>
      </div>

      {/* Visual Podium Section */}
      {podium.length > 0 && (
        <div className="flex items-end justify-center gap-3 sm:gap-6 mb-12 mt-16">
          {sortedPodium.map((user) => (
            <div key={user.id} className="flex flex-col items-center">
              {/* Profile Icon and Rank */}
              <div className="relative mb-3 flex flex-col items-center">
                <div className={`flex items-center justify-center rounded-2xl border ${
                  user.pos === 1 
                    ? 'h-16 w-16 bg-yellow-500/10 border-yellow-500/30' 
                    : user.pos === 2 
                    ? 'h-14 w-14 bg-slate-300/10 border-slate-300/30' 
                    : 'h-12 w-12 bg-amber-600/10 border-amber-600/30'
                }`}>
                  <User className={`h-6 w-6 ${
                    user.pos === 1 
                      ? 'text-yellow-400' 
                      : user.pos === 2 
                      ? 'text-slate-300' 
                      : 'text-amber-500'
                  }`} />
                </div>
                <div className={`absolute -top-3 right-1/2 translate-x-1/2 flex items-center justify-center rounded-full h-6 w-6 border text-xs font-bold ${
                  user.pos === 1 
                    ? 'bg-yellow-500 border-yellow-400 text-[#030014]' 
                    : user.pos === 2 
                    ? 'bg-slate-300 border-slate-200 text-[#030014]' 
                    : 'bg-amber-600 border-amber-500 text-white'
                }`}>
                  {user.pos}
                </div>
              </div>

              {/* Podium Block */}
              <div className={`flex flex-col items-center justify-center w-28 sm:w-36 rounded-t-2xl border-t border-x px-3 pb-4 pt-6 ${
                user.pos === 1 
                  ? 'h-40 bg-gradient-to-t from-yellow-500/5 to-yellow-500/15 border-yellow-500/30 shadow-lg shadow-yellow-500/5' 
                  : user.pos === 2 
                  ? 'h-32 bg-gradient-to-t from-slate-400/5 to-slate-400/15 border-slate-400/20 shadow-md shadow-slate-400/5' 
                  : 'h-24 bg-gradient-to-t from-amber-600/5 to-amber-600/15 border-amber-600/20 shadow-sm'
              }`}>
                <p className="text-xs font-bold text-white text-center truncate w-full">{user.name}</p>
                <p className="text-[9px] text-brand-textMuted text-center truncate w-full mb-2">{user.careerGoal}</p>
                
                <span className="text-xs font-black text-white flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-current text-purple-400" />
                  {user.xp} XP
                </span>
                
                <span className="text-[9px] text-orange-400 font-semibold mt-1">
                  🔥 {user.streak} streak
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard Table List (Ranks 4+) */}
      <GlassCard hoverEffect={false} className="border border-brand-cardBorder/60 p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-cardBorder bg-[#0c0728]/45 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-textMuted">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Track Goal</th>
                <th className="px-6 py-4 text-center">Streak</th>
                <th className="px-6 py-4 text-right">XP Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-cardBorder/40 text-xs sm:text-sm">
              {list.length === 0 && podium.length <= 3 && board.length <= 3 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-brand-textMuted">
                    No further ranks cataloged. Complete lessons to reach the top!
                  </td>
                </tr>
              ) : (
                list.map((user) => (
                  <tr key={user.id} className="hover:bg-brand-cardBorder/25 transition-colors">
                    <td className="px-6 py-4 font-bold text-purple-400">#{user.rank}</td>
                    <td className="px-6 py-4 font-bold text-white">{user.name}</td>
                    <td className="px-6 py-4 text-brand-textMuted text-xs">{user.careerGoal}</td>
                    <td className="px-6 py-4 text-center text-orange-400 font-bold">🔥 {user.streak}</td>
                    <td className="px-6 py-4 text-right font-black text-brand-secondary">{user.xp} XP</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default Leaderboard;
