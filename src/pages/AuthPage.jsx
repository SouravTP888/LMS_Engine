import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, Target, ChevronRight, Activity } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { motion } from 'framer-motion';

const AuthPage = ({ setActiveTab }) => {
  const { login, register, error, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [careerGoal, setCareerGoal] = useState('Full Stack Developer');
  const [interestsText, setInterestsText] = useState('React, JavaScript, AI');

  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (isLogin) {
      if (!email || !password) {
        setValidationError('Please enter email and password.');
        return;
      }
      const success = await login(email, password);
      if (success) {
        setActiveTab('dashboard');
      }
    } else {
      if (!name || !email || !password) {
        setValidationError('Please enter name, email, and password.');
        return;
      }
      const interests = interestsText.split(',').map(s => s.trim()).filter(Boolean);
      const success = await register({
        name,
        email,
        password,
        role,
        skillLevel,
        careerGoal,
        interests
      });
      if (success) {
        setActiveTab('dashboard');
      }
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Background blur flares */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-brand-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-brand-secondary/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <GlassCard hoverEffect={false} className="border border-brand-cardBorder/60 bg-[#0c0728]/55">
          {/* Tabs */}
          <div className="flex h-12 rounded-xl bg-black/40 p-1 mb-8 border border-brand-cardBorder/40">
            <button
              onClick={() => { setIsLogin(true); setValidationError(''); }}
              className={`flex-1 text-xs font-bold rounded-lg transition-all ${isLogin ? 'bg-gradient-to-r from-brand-primary to-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setValidationError(''); }}
              className={`flex-1 text-xs font-bold rounded-lg transition-all ${!isLogin ? 'bg-gradient-to-r from-brand-primary to-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              Register Account
            </button>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white tracking-wide">
              {isLogin ? 'Welcome back, Learner' : 'Initialize Your Journey'}
            </h3>
            <p className="text-xs text-brand-textMuted mt-1">
              {isLogin ? 'Enter credentials to load progress logs.' : 'Define your path goals to generate tracks.'}
            </p>
          </div>

          {/* Validation or API errors */}
          {(validationError || error) && (
            <div className="mb-4 rounded-xl border border-red-500/25 bg-red-500/5 px-4 py-2.5 text-xs text-red-400">
              {validationError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Register Only) */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sourav T P"
                    className="w-full rounded-xl bg-black/30 border border-brand-cardBorder/60 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@lms.com"
                  className="w-full rounded-xl bg-black/30 border border-brand-cardBorder/60 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-black/30 border border-brand-cardBorder/60 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </div>

            {/* Register specific selection fields */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pt-2 border-t border-brand-cardBorder/35"
              >
                {/* Role selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">Profile Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-xl bg-black/40 border border-brand-cardBorder/60 p-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
                    >
                      <option value="student" className="bg-[#0c0728]">Student User</option>
                      <option value="admin" className="bg-[#0c0728]">System Admin</option>
                    </select>
                  </div>

                  {/* Skill level */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">Current Skill</label>
                    <select
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(e.target.value)}
                      className="w-full rounded-xl bg-black/40 border border-brand-cardBorder/60 p-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
                    >
                      <option value="Beginner" className="bg-[#0c0728]">Beginner</option>
                      <option value="Intermediate" className="bg-[#0c0728]">Intermediate</option>
                      <option value="Advanced" className="bg-[#0c0728]">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Target Career Track */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">Career Goal</label>
                  <select
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    className="w-full rounded-xl bg-black/40 border border-brand-cardBorder/60 p-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
                  >
                    <option value="Full Stack Developer" className="bg-[#0c0728]">Full Stack Developer Track</option>
                    <option value="AI Engineer" className="bg-[#0c0728]">AI Engineer Track</option>
                    <option value="Data Analyst" className="bg-[#0c0728]">Data Analyst Track</option>
                  </select>
                </div>

                {/* Interests */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">Topic Interests (comma separated)</label>
                  <input
                    type="text"
                    value={interestsText}
                    onChange={(e) => setInterestsText(e.target.value)}
                    className="w-full rounded-xl bg-black/30 border border-brand-cardBorder/60 p-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-primary to-purple-600 py-3 text-xs font-bold text-white shadow-lg btn-glow-purple disabled:opacity-50 transition-all cursor-pointer"
            >
              <span>{loading ? 'Processing transaction...' : isLogin ? 'Authenticate Access' : 'Build Learning Path'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>

          {/* Help Tips */}
          <div className="mt-6 border-t border-brand-cardBorder/35 pt-4 text-center">
            <p className="text-[10px] text-brand-textMuted">
              Demo Credentials: <br />
              Student: <span className="font-bold text-brand-secondary">student@lms.com</span> / <span className="font-bold text-brand-secondary">Password123</span> <br />
              Admin: <span className="font-bold text-purple-400">admin@lms.com</span> / <span className="font-bold text-purple-400">Password123</span>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AuthPage;
