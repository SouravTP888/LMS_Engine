import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AIAdvisor from './components/AIAdvisor';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import LessonPlayer from './pages/LessonPlayer';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import Leaderboard from './components/Leaderboard';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('landing');
  
  // Navigation states
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#030014] text-white">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
          <div className="absolute h-8 w-8 rounded-full bg-brand-secondary/20 animate-ping" />
        </div>
        <p className="mt-4 text-xs font-mono tracking-widest text-brand-secondary uppercase">
          Initializing Aether Engine...
        </p>
      </div>
    );
  }

  // Routing Guard: Redirect protected tabs if user is not authenticated
  const getProtectedTab = (tab) => {
    if (!user) {
      if (['dashboard', 'track', 'lesson-player', 'admin', 'analytics', 'leaderboard'].includes(tab)) {
        return 'auth';
      }
    } else {
      // If user is admin, restrict student tabs and vice versa
      if (user.role === 'admin' && ['dashboard', 'track', 'lesson-player', 'leaderboard'].includes(tab)) {
        return 'admin';
      }
      if (user.role === 'student' && ['admin', 'analytics'].includes(tab)) {
        return 'dashboard';
      }
    }
    return tab;
  };

  const resolvedTab = getProtectedTab(activeTab);

  const renderActivePage = () => {
    switch (resolvedTab) {
      case 'landing':
        return <LandingPage setActiveTab={setActiveTab} user={user} />;
      case 'auth':
        return <AuthPage setActiveTab={setActiveTab} />;
      case 'dashboard':
        return (
          <Dashboard
            setActiveTab={setActiveTab}
            setSelectedTrackId={setSelectedTrackId}
            setSelectedModule={setSelectedModule}
          />
        );
      case 'lesson-player':
        return (
          <LessonPlayer
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedTrackId={selectedTrackId}
            selectedModule={selectedModule}
            setSelectedModule={setSelectedModule}
          />
        );
      case 'admin':
        return <AdminDashboard />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return <LandingPage setActiveTab={setActiveTab} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-gray-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar activeTab={resolvedTab} setActiveTab={setActiveTab} />

      {/* Main Content Area with Page Transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={resolvedTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {renderActivePage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating AI Chat Advisor (only for student users) */}
      <AIAdvisor />
    </div>
  );
}

export default App;
