import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Play, CheckCircle, Clock, FileText, Bookmark, BookOpen, MessageSquare, ChevronLeft } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const LessonPlayer = ({ activeTab, setActiveTab, selectedTrackId, selectedModule, setSelectedModule }) => {
  const { token, completeLesson } = useAuth();
  
  const [lessonsList, setLessonsList] = useState(selectedModule?.lessons || []);
  const [activeLesson, setActiveLesson] = useState(selectedModule?.lessons?.[0] || null);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  
  const [notes, setNotes] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('notes');
  const [completionMessage, setCompletionMessage] = useState('');

  // Fetch current user completed lessons on load
  useEffect(() => {
    const fetchCurrentProgress = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/progress', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success && data.progress) {
          setCompletedLessonIds(data.progress.completedLessons || []);
          
          // Re-fetch module details to sync unlocked states
          if (data.track) {
            const currentModInSync = data.track.modules.find(m => m._id === selectedModule._id);
            if (currentModInSync) {
              setSelectedModule(currentModInSync);
              setLessonsList(currentModInSync.lessons || []);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching progress for player:', err);
      }
    };
    
    if (selectedModule) {
      fetchCurrentProgress();
    }
  }, [selectedModule, token]);

  if (!selectedModule || !activeLesson) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3 p-6 text-center">
        <BookOpen className="h-12 w-12 text-brand-textMuted" />
        <h3 className="text-lg font-bold text-white font-sans">No Active Lesson Loaded</h3>
        <p className="text-xs text-brand-textMuted max-w-sm">Please return to the Dashboard to select a module and lesson sequence.</p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="mt-2 rounded-xl bg-brand-primary px-4 py-2 text-xs font-bold text-white shadow-lg btn-glow-purple"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleLessonSelect = (lesson) => {
    setActiveLesson(lesson);
    setNotes(localStorage.getItem(`notes_${lesson._id}`) || '');
    setCompletionMessage('');
  };

  const handleMarkComplete = async () => {
    try {
      setCompletionMessage('');
      const response = await completeLesson(activeLesson._id, selectedTrackId);
      
      if (response.success) {
        setCompletedLessonIds(response.progress.completedLessons || []);
        setCompletionMessage(`Success! +50 XP rewarded.`);
        
        // Refresh local module data
        const syncedMod = response.track.modules.find(m => m._id === selectedModule._id);
        if (syncedMod) {
          setSelectedModule(syncedMod);
          setLessonsList(syncedMod.lessons || []);
        }

        // Auto transition to next lesson if available in current module
        const activeIdx = lessonsList.findIndex(l => l._id === activeLesson._id);
        if (activeIdx !== -1 && activeIdx < lessonsList.length - 1) {
          setTimeout(() => {
            handleLessonSelect(lessonsList[activeIdx + 1]);
          }, 1500);
        }
      }
    } catch (err) {
      console.error('Error marking lesson complete:', err);
      setCompletionMessage('Failed to complete lesson.');
    }
  };

  const saveNotes = () => {
    localStorage.setItem(`notes_${activeLesson._id}`, notes);
    alert('Notes saved locally!');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back to dashboard breadcrumb */}
      <button 
        onClick={() => setActiveTab('dashboard')}
        className="flex items-center gap-1 text-xs font-bold text-brand-secondary hover:underline mb-6 cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Curriculum Map
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Lessons Navigator */}
        <div className="order-2 lg:order-1 space-y-4">
          <GlassCard hoverEffect={false} className="border border-brand-cardBorder/60 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-textMuted mb-3">Syllabus Breakdown</h4>
            <div className="bg-[#030014]/50 border border-brand-cardBorder/40 rounded-xl p-3 mb-4">
              <span className="text-[10px] font-bold text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/20 px-2 py-0.5 rounded">
                Module {selectedModule.order}
              </span>
              <h5 className="text-sm font-bold text-white mt-2">{selectedModule.title}</h5>
              <p className="text-[10px] text-brand-textMuted leading-relaxed mt-1">{selectedModule.description}</p>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {lessonsList.map((lesson, idx) => {
                const isCompleted = completedLessonIds.includes(lesson._id.toString());
                const isActive = lesson._id === activeLesson._id;

                return (
                  <div
                    key={lesson._id}
                    onClick={() => handleLessonSelect(lesson)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isActive 
                        ? 'border-brand-primary bg-brand-primary/10' 
                        : isCompleted
                        ? 'border-green-500/20 bg-green-500/5 hover:bg-green-500/10'
                        : 'border-brand-cardBorder hover:bg-brand-cardBorder/25'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                        isActive 
                          ? 'bg-brand-primary text-white' 
                          : isCompleted 
                          ? 'bg-green-500/10 text-green-400' 
                          : 'bg-white/5 text-gray-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className={`text-xs font-bold text-left ${isActive ? 'text-white' : 'text-gray-300'}`}>
                          {lesson.title}
                        </p>
                        <span className="text-[9px] text-brand-textMuted block text-left mt-0.5">{lesson.duration}</span>
                      </div>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="h-4 w-4 text-green-400 fill-green-400/10 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Video Player & Tabs */}
        <div className="order-1 lg:order-2 lg:col-span-2 space-y-6">
          {/* Visual video panel */}
          <div className="rounded-2xl border border-brand-cardBorder/60 bg-black/60 overflow-hidden shadow-2xl relative">
            <div className="aspect-video w-full">
              {/* Check if video URL is a YouTube link */}
              {activeLesson.videoURL.includes('youtube.com/embed') ? (
                <iframe
                  src={activeLesson.videoURL}
                  title={activeLesson.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full bg-[#0c0728] flex flex-col items-center justify-center p-6 text-center">
                  <Play className="h-16 w-16 text-brand-primary animate-pulse" />
                  <h4 className="text-white font-bold mt-4">Simulated Stream Session</h4>
                  <p className="text-xs text-brand-textMuted max-w-sm mt-1">{activeLesson.videoURL}</p>
                </div>
              )}
            </div>

            {/* Video Controls / Info */}
            <div className="p-5 border-t border-brand-cardBorder bg-[#0c0728]/35 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">{activeLesson.title}</h3>
                <span className="text-[10px] text-brand-textMuted flex items-center gap-1 mt-1 uppercase font-semibold">
                  <Clock className="h-3 w-3 text-brand-secondary" /> Duration: {activeLesson.duration}
                </span>
              </div>

              {/* Complete Lesson Action */}
              <div className="flex flex-col items-end gap-1">
                <button
                  onClick={handleMarkComplete}
                  disabled={completedLessonIds.includes(activeLesson._id.toString())}
                  className={`flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow transition-all cursor-pointer ${
                    completedLessonIds.includes(activeLesson._id.toString())
                      ? 'bg-green-500/20 border border-green-500/30 text-green-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-brand-primary to-purple-600 btn-glow-purple hover:scale-[1.02]'
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  {completedLessonIds.includes(activeLesson._id.toString()) 
                    ? 'Lesson Completed' 
                    : 'Mark as Completed'}
                </button>
                {completionMessage && (
                  <span className="text-[10px] text-brand-secondary font-bold animate-pulse">{completionMessage}</span>
                )}
              </div>
            </div>
          </div>

          {/* Under-player details panel */}
          <GlassCard hoverEffect={false} className="border border-brand-cardBorder/60 p-0 overflow-hidden">
            {/* Tabs Headers */}
            <div className="flex border-b border-brand-cardBorder bg-black/25">
              <button
                onClick={() => setActiveSubTab('notes')}
                className={`flex items-center gap-1 px-5 py-3.5 text-xs font-bold border-b-2 transition-all ${
                  activeSubTab === 'notes' 
                    ? 'border-brand-secondary text-brand-secondary bg-brand-secondary/5' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <FileText className="h-4 w-4" /> Workspace Notes
              </button>
              <button
                onClick={() => setActiveSubTab('resources')}
                className={`flex items-center gap-1 px-5 py-3.5 text-xs font-bold border-b-2 transition-all ${
                  activeSubTab === 'resources' 
                    ? 'border-brand-secondary text-brand-secondary bg-brand-secondary/5' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Bookmark className="h-4 w-4" /> Reference Resources
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6">
              {activeSubTab === 'notes' ? (
                <div className="space-y-4">
                  <p className="text-xs text-brand-textMuted">
                    Write notes for **{activeLesson.title}**. Notes are saved in local cache logs.
                  </p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter study summaries, code snippets, or ideas here..."
                    className="w-full min-h-[120px] rounded-xl bg-black/40 border border-brand-cardBorder/60 p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary"
                  />
                  <div className="text-right">
                    <button
                      onClick={saveNotes}
                      className="rounded-xl bg-brand-primary/10 border border-brand-primary/20 hover:bg-brand-primary/30 px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-xs text-brand-textMuted leading-relaxed">
                  <h5 className="font-bold text-white text-sm">Recommended Study Exercises:</h5>
                  <ul className="list-disc pl-4 space-y-1.5 mt-2">
                    <li>Watch the lecture thoroughly and reproduce the examples locally on your code editor.</li>
                    <li>Spend 15 minutes reviewing the official documentation of the technology discussed.</li>
                    <li>Incorporate these principles into a mini sandbox script inside your workspace.</li>
                  </ul>
                  <h5 className="font-bold text-white text-sm mt-4">Related External Links:</h5>
                  <div className="flex gap-4 mt-2">
                    <span className="text-brand-secondary hover:underline cursor-pointer">Official Documentation</span>
                    <span>&bull;</span>
                    <span className="text-brand-secondary hover:underline cursor-pointer">GitHub Starter Sandbox</span>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default LessonPlayer;
