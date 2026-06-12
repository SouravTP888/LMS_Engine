import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Flame, Award, Shield, LogOut, Menu, X, Brain } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-brand-cardBorder/60 bg-[#030014]/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="font-sans text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-300 to-brand-secondary">
              AetherLMS
            </span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-6">
            {!user ? (
              <>
                <button onClick={() => setActiveTab('landing')} className={`text-sm font-medium transition-colors ${activeTab === 'landing' ? 'text-brand-secondary' : 'text-gray-300 hover:text-white'}`}>Home</button>
                <button onClick={() => setActiveTab('auth')} className="rounded-xl bg-gradient-to-r from-brand-primary to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg btn-glow-purple hover:scale-105 transition-all">
                  Sign In
                </button>
              </>
            ) : (
              <>
                {user.role === 'student' ? (
                  <>
                    <button onClick={() => setActiveTab('dashboard')} className={`text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'text-brand-secondary' : 'text-gray-300 hover:text-white'}`}>Dashboard</button>
                    <button onClick={() => setActiveTab('track')} className={`text-sm font-medium transition-colors ${activeTab === 'track' ? 'text-brand-secondary' : 'text-gray-300 hover:text-white'}`}>My Track</button>
                    <button onClick={() => setActiveTab('leaderboard')} className={`text-sm font-medium transition-colors ${activeTab === 'leaderboard' ? 'text-brand-secondary' : 'text-gray-300 hover:text-white'}`}>Leaderboard</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setActiveTab('admin')} className={`text-sm font-medium transition-colors ${activeTab === 'admin' ? 'text-brand-secondary' : 'text-gray-300 hover:text-white'}`}>Admin Console</button>
                    <button onClick={() => setActiveTab('analytics')} className={`text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'text-brand-secondary' : 'text-gray-300 hover:text-white'}`}>System Analytics</button>
                  </>
                )}

                {/* Badges/Gamification Info */}
                <div className="flex items-center gap-4 border-l border-brand-cardBorder/60 pl-6">
                  {/* Streak */}
                  <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1 border border-orange-500/20 text-orange-400 text-xs font-semibold">
                    <Flame className="h-3.5 w-3.5 fill-orange-500/30" />
                    <span>{user.streak || 0} Streak</span>
                  </div>
                  {/* XP */}
                  <div className="flex items-center gap-1 rounded-full bg-brand-primary/10 px-3 py-1 border border-brand-primary/20 text-purple-400 text-xs font-semibold">
                    <Award className="h-3.5 w-3.5" />
                    <span>{user.xp || 0} XP</span>
                  </div>
                  {/* Role */}
                  {user.role === 'admin' && (
                    <div className="flex items-center gap-1 rounded-full bg-brand-secondary/10 px-3 py-1 border border-brand-secondary/20 text-brand-secondary text-xs font-semibold">
                      <Shield className="h-3.5 w-3.5" />
                      <span>Admin</span>
                    </div>
                  )}

                  {/* Profile info & Logout */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs font-bold text-white max-w-[120px] truncate">{user.name}</p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{user.email}</p>
                    </div>
                    <button 
                      onClick={logout} 
                      className="rounded-xl border border-red-500/30 bg-red-500/5 p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-xl p-2 text-gray-400 hover:bg-brand-cardBorder/30 hover:text-white"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-brand-cardBorder/60 bg-[#030014] px-4 pb-4 pt-2 space-y-2">
          {!user ? (
            <>
              <button onClick={() => { setActiveTab('landing'); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-white">Home</button>
              <button onClick={() => { setActiveTab('auth'); setMobileOpen(false); }} className="block w-full rounded-xl bg-gradient-to-r from-brand-primary to-purple-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-lg">
                Sign In
              </button>
            </>
          ) : (
            <>
              {user.role === 'student' ? (
                <>
                  <button onClick={() => { setActiveTab('dashboard'); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-white">Dashboard</button>
                  <button onClick={() => { setActiveTab('track'); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-white">My Track</button>
                  <button onClick={() => { setActiveTab('leaderboard'); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-white">Leaderboard</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setActiveTab('admin'); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-white">Admin Console</button>
                  <button onClick={() => { setActiveTab('analytics'); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-white">System Analytics</button>
                </>
              )}
              
              <div className="border-t border-brand-cardBorder/60 pt-4 space-y-2">
                <div className="flex justify-between text-xs px-3">
                  <span className="text-orange-400 font-bold">🔥 {user.streak || 0} Streak</span>
                  <span className="text-purple-400 font-bold">🏆 {user.xp || 0} XP</span>
                </div>
                <div className="px-3">
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 py-2 text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
