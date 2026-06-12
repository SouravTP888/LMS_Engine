import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, BookOpen, Star, Plus, Trash, CheckCircle, Search, Settings, Flame } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const AdminDashboard = () => {
  const { token, API_URL } = useAuth();
  
  const [students, setStudents] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('students');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Track Form state
  const [trackTitle, setTrackTitle] = useState('');
  const [trackDesc, setTrackDesc] = useState('');
  const [trackDiff, setTrackDiff] = useState('Beginner');
  const [modules, setModules] = useState([
    { title: 'Foundations', description: 'Intro module', order: 1, difficulty: 'Beginner', duration: '2 hours', lessons: [{ title: 'Intro Lesson', videoURL: 'https://www.youtube.com/embed/qz0aGYMCip0', duration: '10 mins' }] }
  ]);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  const fetchAdminData = async () => {
    try {
      // 1. Fetch Students
      const studentRes = await fetch(`${API_URL}/progress/leaderboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const studentData = await studentRes.json();
      if (studentData.success) {
        setStudents(studentData.leaderboard || []);
      }

      // 2. Fetch Tracks
      const trackRes = await fetch(`${API_URL}/tracks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const trackData = await trackRes.json();
      if (trackData.success) {
        setTracks(trackData.tracks || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  const handleAddModule = () => {
    setModules(prev => [
      ...prev,
      {
        title: '',
        description: '',
        order: prev.length + 1,
        difficulty: 'Beginner',
        duration: '1 hour',
        lessons: [{ title: '', videoURL: '', duration: '' }]
      }
    ]);
  };

  const handleModuleChange = (index, field, value) => {
    const updated = [...modules];
    updated[index][field] = value;
    setModules(updated);
  };

  const handleLessonChange = (mIndex, lIndex, field, value) => {
    const updated = [...modules];
    updated[mIndex].lessons[lIndex][field] = value;
    setModules(updated);
  };

  const handleAddLesson = (mIndex) => {
    const updated = [...modules];
    updated[mIndex].lessons.push({ title: '', videoURL: '', duration: '' });
    setModules(updated);
  };

  const handleCreateTrack = async (e) => {
    e.preventDefault();
    setFormSuccess('');
    setFormError('');

    if (!trackTitle || !trackDesc) {
      setFormError('Please enter track title and description.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/tracks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: trackTitle,
          description: trackDesc,
          difficulty: trackDiff,
          modules
        })
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess(`Track '${trackTitle}' created successfully!`);
        setTrackTitle('');
        setTrackDesc('');
        setModules([
          { title: 'Foundations', description: 'Intro module', order: 1, difficulty: 'Beginner', duration: '2 hours', lessons: [{ title: 'Intro Lesson', videoURL: 'https://www.youtube.com/embed/qz0aGYMCip0', duration: '10 mins' }] }
        ]);
        fetchAdminData();
      } else {
        setFormError(data.message || 'Failed to create track.');
      }
    } catch (err) {
      console.error(err);
      setFormError('Server error creating track.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
        <p className="text-sm text-brand-textMuted">Syncing administrative directory...</p>
      </div>
    );
  }

  // Filter students based on search
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.careerGoal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <GlassCard hoverEffect={false} className="border border-brand-cardBorder/60 p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">Total Students</p>
            <h3 className="text-2xl font-black text-white mt-1">{students.length + 120}</h3>
            <span className="text-[9px] text-green-400 font-bold mt-0.5 block">↑ 12% vs last month</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Users className="h-6 w-6" />
          </div>
        </GlassCard>

        <GlassCard hoverEffect={false} className="border border-brand-cardBorder/60 p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">Active Learners</p>
            <h3 className="text-2xl font-black text-white mt-1">{students.length + 84}</h3>
            <span className="text-[9px] text-brand-secondary font-bold mt-0.5 block">Daily active sync active</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Flame className="h-6 w-6 animate-pulse" />
          </div>
        </GlassCard>

        <GlassCard hoverEffect={false} className="border border-brand-cardBorder/60 p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">Avg Completion Rate</p>
            <h3 className="text-2xl font-black text-white mt-1">68.4%</h3>
            <span className="text-[9px] text-green-400 font-bold mt-0.5 block">↑ 4.1% vs last syllabus</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <CheckCircle className="h-6 w-6" />
          </div>
        </GlassCard>

        <GlassCard hoverEffect={false} className="border border-brand-cardBorder/60 p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">Most Popular Track</p>
            <h3 className="text-sm font-black text-white mt-1 uppercase max-w-[150px] truncate">Full Stack Developer</h3>
            <span className="text-[9px] text-brand-textMuted mt-0.5 block">Enrolled users: 62%</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
            <BookOpen className="h-6 w-6" />
          </div>
        </GlassCard>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-cardBorder mb-6">
        <button
          onClick={() => setActiveSubTab('students')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeSubTab === 'students' 
              ? 'border-brand-secondary text-brand-secondary bg-brand-secondary/5' 
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Manage Students
        </button>
        <button
          onClick={() => setActiveSubTab('tracks')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeSubTab === 'tracks' 
              ? 'border-brand-secondary text-brand-secondary bg-brand-secondary/5' 
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Create Learning Tracks
        </button>
      </div>

      {/* Subtab Content */}
      {activeSubTab === 'students' ? (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex items-center justify-between bg-[#0c0728]/35 border border-brand-cardBorder/60 p-3 rounded-xl">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search students by name or track goal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-brand-cardBorder/60 py-2 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary"
              />
            </div>
            <span className="text-[10px] text-brand-textMuted uppercase font-bold pr-2">
              Viewing {filteredStudents.length} entries
            </span>
          </div>

          {/* Registry Table */}
          <GlassCard hoverEffect={false} className="border border-brand-cardBorder/60 p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-cardBorder bg-[#0c0728]/45 text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Course Goal</th>
                    <th className="px-6 py-4 text-center">Active Streak</th>
                    <th className="px-6 py-4 text-center">Badges Count</th>
                    <th className="px-6 py-4 text-right">XP Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cardBorder/40 text-xs text-gray-300">
                  {filteredStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-brand-cardBorder/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{std.name}</td>
                      <td className="px-6 py-4 text-brand-secondary font-bold">{std.careerGoal}</td>
                      <td className="px-6 py-4 text-center text-orange-400 font-bold">🔥 {std.streak} days</td>
                      <td className="px-6 py-4 text-center">
                        <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold text-gray-300">
                          {std.badgesCount} Badges
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-purple-400">{std.xp} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      ) : (
        <GlassCard hoverEffect={false} className="border border-brand-cardBorder/60 bg-[#0c0728]/45 max-w-3xl mx-auto">
          {formSuccess && (
            <div className="mb-4 rounded-xl border border-green-500/25 bg-green-500/5 px-4 py-2.5 text-xs text-green-400">
              {formSuccess}
            </div>
          )}
          {formError && (
            <div className="mb-4 rounded-xl border border-red-500/25 bg-red-500/5 px-4 py-2.5 text-xs text-red-400">
              {formError}
            </div>
          )}

          <form onSubmit={handleCreateTrack} className="space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-brand-cardBorder/40">
              New Course Track Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">Track Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cloud Architect Track"
                  value={trackTitle}
                  onChange={(e) => setTrackTitle(e.target.value)}
                  className="w-full rounded-xl bg-black/40 border border-brand-cardBorder/60 p-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">Difficulty Rating</label>
                <select
                  value={trackDiff}
                  onChange={(e) => setTrackDiff(e.target.value)}
                  className="w-full rounded-xl bg-black/40 border border-brand-cardBorder/60 p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">Track Description</label>
              <textarea
                placeholder="Enter description of target outcomes..."
                value={trackDesc}
                onChange={(e) => setTrackDesc(e.target.value)}
                className="w-full min-h-[80px] rounded-xl bg-black/40 border border-brand-cardBorder/60 p-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Modules editor */}
            <div className="space-y-4 pt-4 border-t border-brand-cardBorder/35">
              <div className="flex justify-between items-center">
                <h5 className="text-xs font-bold uppercase text-white tracking-wide">Modules Timeline</h5>
                <button
                  type="button"
                  onClick={handleAddModule}
                  className="flex items-center gap-1.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-brand-primary/25 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Module
                </button>
              </div>

              <div className="space-y-4">
                {modules.map((mod, mIdx) => (
                  <div key={mIdx} className="bg-black/30 border border-brand-cardBorder/50 p-4 rounded-xl space-y-3">
                    <span className="text-[9px] font-bold text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/20 px-2 py-0.5 rounded">
                      Module #{mIdx + 1}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Module Title"
                        value={mod.title}
                        onChange={(e) => handleModuleChange(mIdx, 'title', e.target.value)}
                        className="rounded-lg bg-black/40 border border-brand-cardBorder/60 p-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Study Duration (e.g. 5 hours)"
                        value={mod.duration}
                        onChange={(e) => handleModuleChange(mIdx, 'duration', e.target.value)}
                        className="rounded-lg bg-black/40 border border-brand-cardBorder/60 p-2 text-xs text-white"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Module Description"
                      value={mod.description}
                      onChange={(e) => handleModuleChange(mIdx, 'description', e.target.value)}
                      className="w-full rounded-lg bg-black/40 border border-brand-cardBorder/60 p-2 text-xs text-white"
                    />

                    {/* Lessons inside module */}
                    <div className="space-y-2 pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">Lessons</p>
                      {mod.lessons.map((les, lIdx) => (
                        <div key={lIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Lesson Title"
                            value={les.title}
                            onChange={(e) => handleLessonChange(mIdx, lIdx, 'title', e.target.value)}
                            className="rounded-lg bg-black/40 border border-brand-cardBorder/60 p-2 text-[10px] text-white"
                          />
                          <input
                            type="text"
                            placeholder="Video embed URL"
                            value={les.videoURL}
                            onChange={(e) => handleLessonChange(mIdx, lIdx, 'videoURL', e.target.value)}
                            className="rounded-lg bg-black/40 border border-brand-cardBorder/60 p-2 text-[10px] text-white"
                          />
                          <input
                            type="text"
                            placeholder="Duration (e.g. 15 mins)"
                            value={les.duration}
                            onChange={(e) => handleLessonChange(mIdx, lIdx, 'duration', e.target.value)}
                            className="rounded-lg bg-black/40 border border-brand-cardBorder/60 p-2 text-[10px] text-white"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddLesson(mIdx)}
                        className="text-[10px] font-bold text-brand-secondary hover:underline cursor-pointer"
                      >
                        + Add another lesson in Module #{mIdx + 1}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-brand-primary to-purple-600 py-3 text-xs font-bold text-white shadow btn-glow-purple cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Save Track configuration
            </button>
          </form>
        </GlassCard>
      )}
    </div>
  );
};

export default AdminDashboard;
