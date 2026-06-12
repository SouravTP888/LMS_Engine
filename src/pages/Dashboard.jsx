import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Brain, Flame, Award, BookOpen, Clock, Lock, Unlock, CheckCircle, ChevronRight, HelpCircle, Trophy } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import CertificateModal from '../components/CertificateModal';

const Dashboard = ({ setActiveTab, setSelectedTrackId, setSelectedModule }) => {
  const { token, user, assignTrack } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showCertificate, setShowCertificate] = useState(false);

  // Onboarding Wizard state
  const [careerGoal, setCareerGoal] = useState(user?.careerGoal || 'Full Stack Developer');
  const [skillLevel, setSkillLevel] = useState(user?.skillLevel || 'Beginner');
  const [interests, setInterests] = useState('');
  const [onboardLoading, setOnboardLoading] = useState(false);

  const fetchProgress = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/progress', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const resData = await res.json();
      if (resData.success) {
        setData(resData);
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [token]);

  const handleOnboard = async (e) => {
    e.preventDefault();
    setOnboardLoading(true);
    try {
      const parsedInterests = interests.split(',').map(s => s.trim()).filter(Boolean);
      const res = await assignTrack(careerGoal, skillLevel, parsedInterests);
      if (res.success) {
        // Reload progress
        await fetchProgress();
      }
    } catch (err) {
      console.error('Onboard error:', err);
    } finally {
      setOnboardLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
        <p className="text-sm text-brand-textMuted">Calibrating learning logs...</p>
      </div>
    );
  }

  // 1. Wizard View (No track assigned)
  if (!data || !data.track) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 border border-brand-primary/30 text-brand-secondary mb-4">
            <Brain className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-white">Generate Your Learning Track</h2>
          <p className="text-xs text-brand-textMuted mt-1">
            Specify your targets. Our automation service will assign a personalized, sequential curriculum.
          </p>
        </div>

        <GlassCard hoverEffect={false} className="border border-brand-cardBorder bg-[#0c0728]/50">
          <form onSubmit={handleOnboard} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">Target Career Goal</label>
              <select
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-brand-cardBorder/60 p-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              >
                <option value="Full Stack Developer">Full Stack Developer Track</option>
                <option value="AI Engineer">AI Engineer Track</option>
                <option value="Data Analyst">Data Analyst Track</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">Starting Skill Level</label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-brand-cardBorder/60 p-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              >
                <option value="Beginner">Beginner (Start at foundations)</option>
                <option value="Intermediate">Intermediate (Skip basic modules)</option>
                <option value="Advanced">Advanced (Accelerated syllabus)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">Areas of Interest (comma separated)</label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="React, CSS, Machine Learning, Analytics"
                className="w-full rounded-xl bg-black/30 border border-brand-cardBorder/60 p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <button
              type="submit"
              disabled={onboardLoading}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-primary to-purple-600 py-3 text-xs font-bold text-white shadow-lg btn-glow-purple disabled:opacity-50 hover:brightness-110 cursor-pointer"
            >
              <span>{onboardLoading ? 'Matching algorithm...' : 'Generate Adaptive Track'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>
        </GlassCard>
      </div>
    );
  }

  // 2. Active Dashboard View
  const track = data.track;
  const progress = data.progress;

  // Determine current active module and next unlock module
  const sortedModules = [...track.modules].sort((a, b) => a.order - b.order);
  const activeModule = sortedModules.find(m => m.status === 'UNLOCKED') || sortedModules.find(m => m.status === 'LOCKED') || sortedModules[sortedModules.length - 1];
  const nextUnlockModule = sortedModules.find(m => m.status === 'LOCKED');

  // Simple Greeting based on local hours
  const hours = new Date().getHours();
  let greeting = "Good Day";
  if (hours < 12) greeting = "Good Morning";
  else if (hours < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  const handleModuleClick = (module) => {
    if (module.status === 'LOCKED') return; // Cannot access locked modules
    setSelectedModule(module);
    setSelectedTrackId(track._id);
    setActiveTab('lesson-player');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative">
      {/* Welcome & Achievements Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Personalized Welcome Card */}
        <GlassCard hoverEffect={false} className="lg:col-span-2 border border-brand-cardBorder/60 bg-gradient-to-r from-[#0c0728]/60 to-black/40 flex flex-col justify-between p-8 relative overflow-hidden">
          <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
            <Brain className="h-48 w-48 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white sm:text-3xl">
              {greeting}, {user.name} 👋
            </h2>
            <p className="text-xs text-brand-secondary tracking-wider font-bold mt-2 uppercase">
              Current Journey: {track.title}
            </p>
            <p className="text-xs text-brand-textMuted mt-4 max-w-md leading-relaxed">
              Your profile is synced at the **{user.skillLevel}** difficulty level. Keep completing sequential lessons to progress through modules automatically.
            </p>
          </div>
          
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => handleModuleClick(activeModule)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-primary to-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg btn-glow-purple hover:scale-[1.02] cursor-pointer"
            >
              Resume Learning
              <ChevronRight className="h-4 w-4" />
            </button>
            {track.overallPercentage === 100 && (
              <button
                onClick={() => setShowCertificate(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-[#030014] shadow hover:scale-[1.02] cursor-pointer"
              >
                <Award className="h-4 w-4" />
                View Certificate
              </button>
            )}
          </div>
        </GlassCard>

        {/* Progress Circular Display */}
        <GlassCard hoverEffect={false} className="border border-brand-cardBorder/60 flex flex-col items-center justify-center p-6 text-center">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-4">Overall Completion</h4>
          
          <div className="relative flex items-center justify-center h-32 w-32 mb-4">
            {/* SVG Circle Progress */}
            <svg className="absolute transform -rotate-90 h-full w-full">
              <circle
                cx="64"
                cy="64"
                r="52"
                strokeWidth="8"
                fill="transparent"
                className="circle-progress-bg"
              />
              <circle
                cx="64"
                cy="64"
                r="52"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={326.7}
                strokeDashoffset={326.7 - (326.7 * track.overallPercentage) / 100}
                strokeLinecap="round"
                className="stroke-brand-secondary transition-all duration-500"
              />
            </svg>
            <div className="text-center z-10">
              <span className="text-3xl font-black text-white glow-cyan">{track.overallPercentage}%</span>
              <p className="text-[9px] text-brand-textMuted uppercase mt-0.5">Track Done</p>
            </div>
          </div>
          
          <div className="flex gap-4 text-xs text-brand-textMuted">
            <span className="flex items-center gap-1 text-white font-semibold">
              <BookOpen className="h-3.5 w-3.5 text-brand-secondary" />
              {track.completedLessonsCount} / {track.totalLessons} Lessons
            </span>
          </div>
        </GlassCard>

      </div>

      {/* Module Overview & Badges Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sequential Module Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brand-secondary" />
            Curriculum Map
          </h3>
          
          {sortedModules.map((module) => {
            const isCompleted = module.status === 'COMPLETED';
            const isUnlocked = module.status === 'UNLOCKED';
            const isLocked = module.status === 'LOCKED';
            
            return (
              <GlassCard
                key={module._id}
                onClick={() => handleModuleClick(module)}
                hoverEffect={!isLocked}
                className={`border transition-all ${
                  isCompleted 
                    ? 'border-green-500/20 bg-green-950/5' 
                    : isUnlocked 
                    ? 'border-brand-primary/30 bg-brand-primary/5 shadow-md shadow-brand-primary/5' 
                    : 'border-brand-cardBorder/40 bg-black/20 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/20 px-2 py-0.5 rounded">
                        Module {module.order}
                      </span>
                      <span className="text-xs text-brand-textMuted">&bull; {module.duration}</span>
                      <span className="text-xs text-brand-textMuted">&bull; {module.difficulty}</span>
                    </div>
                    <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                      {module.title}
                      {isCompleted && <CheckCircle className="h-4 w-4 text-green-400 fill-green-400/10" />}
                    </h4>
                    <p className="text-xs text-brand-textMuted mt-1 max-w-xl">{module.description}</p>
                  </div>

                  {/* Right Status Panel */}
                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      {isCompleted ? (
                        <span className="text-xs font-bold text-green-400">100% Done</span>
                      ) : isUnlocked ? (
                        <div>
                          <span className="text-xs font-bold text-brand-primary">In Progress</span>
                          <span className="block text-[10px] text-brand-textMuted">{module.completionPercentage}% Complete</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Locked
                        </span>
                      )}
                    </div>
                    {isUnlocked && (
                      <div className="h-8 w-8 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary animate-pulse">
                        <Unlock className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Sidebar Status (Stats & Badges) */}
        <div className="space-y-6">
          {/* Smart Next Up Recommendation */}
          <GlassCard hoverEffect={false} className="border border-brand-cardBorder/60 bg-gradient-to-br from-[#0c0728]/45 to-black/30">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-secondary mb-3 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 fill-brand-secondary/20" />
              Smart Recommendation
            </h4>
            {activeModule ? (
              <div>
                <p className="text-xs text-gray-300">
                  Based on your pace, complete the unlocked module:
                </p>
                <h5 className="text-sm font-bold text-white mt-2 mb-1">{activeModule.title}</h5>
                <p className="text-[11px] text-brand-textMuted leading-relaxed">
                  Completing this module will instantly unlock the next syllabus stage: **{nextUnlockModule ? nextUnlockModule.title : 'Full Track Mastered'}**.
                </p>
              </div>
            ) : (
              <p className="text-xs text-brand-textMuted">You have completed all tracks!</p>
            )}
          </GlassCard>

          {/* Achievements & Badges List */}
          <GlassCard hoverEffect={false} className="border border-brand-cardBorder/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-4 flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Earned Badges
            </h4>
            <div className="flex flex-col gap-3">
              {user.badges && user.badges.length > 0 ? (
                user.badges.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-brand-cardBorder/35 border border-brand-cardBorder/60 p-2.5 rounded-xl">
                    <div className="h-8 w-8 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                      <Award className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{badge}</p>
                      <p className="text-[9px] text-brand-textMuted uppercase mt-0.5">Unlocked Badge</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-brand-textMuted">No badges unlocked yet.</p>
              )}
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Render Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          trackId={track._id}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
