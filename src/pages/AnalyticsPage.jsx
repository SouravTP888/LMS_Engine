import React from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line 
} from 'recharts';
import GlassCard from '../components/GlassCard';
import { TrendingUp, Award, Users, BookOpen } from 'lucide-react';

const AnalyticsPage = () => {
  // 1. Student Growth Data (AreaChart)
  const growthData = [
    { name: 'Jan', students: 10 },
    { name: 'Feb', students: 25 },
    { name: 'Mar', students: 45 },
    { name: 'Apr', students: 80 },
    { name: 'May', students: 110 },
    { name: 'Jun', students: 145 },
  ];

  // 2. Track Popularity Data (PieChart)
  const popularityData = [
    { name: 'Full Stack Track', value: 45 },
    { name: 'AI Engineer Track', value: 35 },
    { name: 'Data Analyst Track', value: 20 },
  ];
  const COLORS = ['#7c3aed', '#06b6d4', '#ec4899'];

  // 3. Completion Rates per module (BarChart)
  const completionData = [
    { module: 'Module 1', rate: 94 },
    { module: 'Module 2', rate: 85 },
    { module: 'Module 3', rate: 71 },
    { module: 'Module 4', rate: 60 },
    { module: 'Module 5', rate: 48 },
    { module: 'Module 6', rate: 35 },
  ];

  // 4. Dropout Analysis (LineChart)
  const dropoutData = [
    { name: 'Module 1', rate: 2 },
    { name: 'Module 2', rate: 5 },
    { name: 'Module 3', rate: 12 },
    { name: 'Module 4', rate: 18 },
    { name: 'Module 5', rate: 22 },
    { name: 'Module 6', rate: 28 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white">System Diagnostics & Analytics</h2>
        <p className="text-xs text-brand-textMuted mt-1">Realtime feedback logs on student completions, dropouts, and course allocations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Growth Chart */}
        <GlassCard hoverEffect={false} className="border border-brand-cardBorder/60 p-6 flex flex-col h-[360px]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4.5 w-4.5 text-brand-secondary" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Student Intake Growth</h4>
          </div>
          <div className="flex-1 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30, 19, 74, 0.2)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c0728', border: '1px solid #1e134a', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="students" stroke="#7c3aed" strokeWidth={2} fillOpacity={1} fill="url(#colorStudents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Popularity Pie */}
        <GlassCard hoverEffect={false} className="border border-brand-cardBorder/60 p-6 flex flex-col h-[360px]">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4.5 w-4.5 text-purple-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Track Allocation Ratio</h4>
          </div>
          <div className="flex-1 text-xs flex flex-col sm:flex-row items-center justify-center">
            <div className="h-full w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={popularityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {popularityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0c0728', border: '1px solid #1e134a', borderRadius: '12px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Legend */}
            <div className="flex flex-col gap-2 mt-4 sm:mt-0">
              {popularityData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="font-semibold text-white">{entry.name}</span>
                  <span className="text-brand-textMuted">({entry.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Completion Rates */}
        <GlassCard hoverEffect={false} className="border border-brand-cardBorder/60 p-6 flex flex-col h-[360px]">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-4.5 w-4.5 text-yellow-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Module Completion Rates (%)</h4>
          </div>
          <div className="flex-1 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30, 19, 74, 0.2)" />
                <XAxis dataKey="module" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0c0728', border: '1px solid #1e134a', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="rate" fill="#06b6d4" radius={[6, 6, 0, 0]}>
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.rate > 70 ? '#06b6d4' : '#7c3aed'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Dropout Analysis */}
        <GlassCard hoverEffect={false} className="border border-brand-cardBorder/60 p-6 flex flex-col h-[360px]">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-4.5 w-4.5 text-pink-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Syllabus Dropout/Churn Trend (%)</h4>
          </div>
          <div className="flex-1 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dropoutData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30, 19, 74, 0.2)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0c0728', border: '1px solid #1e134a', borderRadius: '12px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="rate" stroke="#ec4899" strokeWidth={3} dot={{ stroke: '#ec4899', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};

export default AnalyticsPage;
