import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Brain, Zap, Target, Award, CheckCircle, ChevronRight, Play } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const LandingPage = ({ setActiveTab, user }) => {
  const handleCTA = () => {
    if (user) {
      if (user.role === 'admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('dashboard');
      }
    } else {
      setActiveTab('auth');
    }
  };

  const tracksPreview = [
    {
      title: "Full Stack Developer",
      modulesCount: 7,
      duration: "39 hours",
      color: "from-blue-500 to-purple-600",
      skills: ["React", "Express", "MongoDB", "Node.js", "Tailwind CSS"]
    },
    {
      title: "AI Engineer",
      modulesCount: 5,
      duration: "47 hours",
      color: "from-purple-500 to-pink-500",
      skills: ["Python", "PyTorch", "Transformers", "Generative AI", "RAG"]
    },
    {
      title: "Data Analyst",
      modulesCount: 5,
      duration: "29 hours",
      color: "from-cyan-500 to-blue-500",
      skills: ["Excel", "SQL queries", "Pandas Analytics", "Power BI", "Seaborn"]
    }
  ];

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Gradients */}
      <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-brand-primary/10 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-48 right-1/4 h-80 w-80 rounded-full bg-brand-secondary/10 blur-[120px] pointer-events-none animate-pulse-slow [animation-delay:2s]" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Sparkle Tag */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-4 py-1.5 border border-brand-primary/20 text-purple-400 text-xs font-semibold mb-6 shadow-md"
        >
          <Sparkles className="h-3.5 w-3.5 fill-brand-primary/20 animate-spin-slow" />
          <span>Next-Generation AI LMS Engine</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-4xl mx-auto font-sans leading-tight"
        >
          AI-Powered Learning Paths <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary via-purple-400 to-pink-500 font-black">
            That Adapt To You
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-brand-textMuted max-w-2xl mx-auto leading-relaxed"
        >
          AetherLMS is an intelligent education automation platform. We automatically map learning tracks, handle sequential module unlocks, award digital certifications, and recommend topics using adaptive feedback.
        </motion.p>

        {/* Hero CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={handleCTA}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-primary to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-xl btn-glow-purple hover:scale-105 transition-all cursor-pointer"
          >
            {user ? 'Go to Dashboard' : 'Start Learning Free'}
            <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href="#tracks"
            className="rounded-xl border border-brand-cardBorder bg-brand-cardBorder/35 px-6 py-3 text-sm font-semibold text-gray-300 hover:bg-brand-cardBorder/60 hover:text-white transition-all"
          >
            Explore Tracks
          </a>
        </motion.div>

        {/* Floating Cards Demo inside Hero */}
        <div className="relative mt-20 max-w-5xl mx-auto">
          {/* Main Visual Board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="rounded-2xl border border-brand-cardBorder bg-brand-card/30 p-2 shadow-2xl backdrop-blur-md"
          >
            <div className="rounded-xl overflow-hidden border border-brand-cardBorder/60 bg-black/40 p-4 sm:p-6 text-left">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="text-[10px] font-mono text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/20 px-2 py-0.5 rounded">
                  AETHER_BOT_ACTIVE
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard hoverEffect={false} className="bg-brand-card/40 border-brand-primary/20">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold tracking-wider text-purple-400 uppercase">Interactive Journey</span>
                    <Brain className="h-4 w-4 text-purple-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Full Stack developer</h4>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-3">
                    <div className="bg-gradient-to-r from-brand-primary to-brand-secondary h-full w-[78%]" />
                  </div>
                  <span className="text-[10px] text-brand-textMuted mt-1 block">Progress status: 78%</span>
                </GlassCard>

                <GlassCard hoverEffect={false} className="bg-brand-card/40 border-brand-secondary/20">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold tracking-wider text-cyan-400 uppercase">Automation Engine</span>
                    <Zap className="h-4 w-4 text-cyan-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">React Fundamentals</h4>
                  <span className="inline-block rounded-full bg-green-500/10 px-2 py-0.5 text-[9px] font-bold text-green-400 border border-green-500/20 mt-2">
                    ✓ Completed
                  </span>
                </GlassCard>

                <GlassCard hoverEffect={false} className="bg-brand-card/40 border-brand-secondary/20 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold tracking-wider text-orange-400 uppercase">Next unlock</span>
                    <Award className="h-4 w-4 text-orange-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Backend Development</h4>
                  <span className="inline-block rounded-full bg-purple-500/10 px-2 py-0.5 text-[9px] font-bold text-purple-400 border border-purple-500/20 mt-2">
                    🔓 Unlocked Automatically
                  </span>
                </GlassCard>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Predefined Tracks Display */}
      <div id="tracks" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-t border-brand-cardBorder/35 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Adaptive Pre-loaded Learning Tracks
          </h2>
          <p className="mt-2 text-sm text-brand-textMuted max-w-lg mx-auto">
            Choose a target career goal and watch AetherLMS lock and unlock modules as you progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tracksPreview.map((track, idx) => (
            <motion.div
              key={track.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <GlassCard hoverEffect={true} className="flex flex-col h-full bg-gradient-to-b from-[#0e0730]/60 to-[#040113]/80 border-brand-cardBorder">
                <div className={`h-1.5 w-1/3 rounded-full bg-gradient-to-r ${track.color} mb-4`} />
                <h3 className="text-xl font-bold text-white mb-2">{track.title}</h3>
                <div className="flex justify-between items-center text-xs text-brand-textMuted mb-4">
                  <span>{track.modulesCount} Core Modules</span>
                  <span>{track.duration} Study Time</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {track.skills.map(skill => (
                    <span key={skill} className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
                <button
                  onClick={handleCTA}
                  className="mt-auto w-full flex items-center justify-center gap-1 py-2.5 text-xs font-bold text-white rounded-xl bg-brand-primary/10 border border-brand-primary/20 hover:bg-brand-primary/30 transition-all cursor-pointer"
                >
                  Enroll track
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature grid */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-brand-cardBorder/35 relative z-10 bg-black/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Brain className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">Interactive Advisor</h4>
            <p className="text-xs text-brand-textMuted leading-relaxed">
              Floating chatbot answers topics and suggests modules depending on completed milestones.
            </p>
          </div>

          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">Auto Sequential Lock</h4>
            <p className="text-xs text-brand-textMuted leading-relaxed">
              Maintains clean syllabus pacing. The next module unlocks immediately once the prior achieves 100% completion.
            </p>
          </div>

          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Target className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">XP & Badges</h4>
            <p className="text-xs text-brand-textMuted leading-relaxed">
              Gain study XP by completing lessons. Earn achievements like "First Step" or "Fast Learner" as streaks grow.
            </p>
          </div>

          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
              <Award className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">Print Certificates</h4>
            <p className="text-xs text-brand-textMuted leading-relaxed">
              Obtain a visually stunning completion certificate when reaching 100% progress on your learning track.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 border-t border-brand-cardBorder/35 relative z-10 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-textMuted">
        <p>&copy; 2026 AetherLMS Inc. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span>&bull;</span>
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
          <span>&bull;</span>
          <span className="hover:text-white cursor-pointer">Support API</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
