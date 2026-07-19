import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import {
  Flame,
  Award,
  Video,
  FileText,
  User,
  Zap,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import Loader from '../../components/Loader';
import useAuth from '../../hooks/useAuth';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await authAPI.getDashboardStats();
        if (res.success) {
          setStats(res.stats);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <Loader fullPage />;

  if (error) {
    return (
      <div className="p-8 text-center bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="max-w-md p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
          <p className="text-red-400 font-bold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-800 rounded-xl font-semibold text-xs hover:bg-slate-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const {
    profileCompletion = 25,
    interviewCount = 0,
    avgScore = 0,
    totalProblemsSolved = 0,
    dsaStreak = 0,
    dsaBreakdown = [],
    atsScore = 0,
    recommendedTopics = [],
    recentActivity = []
  } = stats || {};

  // Formatted data for Recharts
  const chartData = dsaBreakdown.map(item => ({
    name: item.topic,
    solved: item.solved,
    amt: 15 // Max preset limit
  }));

  const chartColors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#10b981', '#f59e0b'];

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-350">

      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">Placement Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">Review your corporate readiness parameters and mock interview trends</p>
        </div>

        {/* DSA Streak capsule */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shadow-lg shadow-orange-500/5">
          <Flame className="w-5 h-5 fill-current animate-pulse" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">DSA Streak</div>
            <div className="text-sm font-black">{dsaStreak} Day{dsaStreak !== 1 && 's'}</div>
          </div>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Profile Completion */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-2xl p-5 relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400">Completion</span>
          </div>
          <h3 className="text-3xl font-black mb-2">{profileCompletion}%</h3>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${profileCompletion}%` }} />
          </div>
          <Link to="/student/profile" className="text-[10px] font-semibold text-blue-400 hover:underline flex items-center gap-1">
            Edit profile fields <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>

        {/* DSA Solved */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-2xl p-5 relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400">DSA Solved</span>
          </div>
          <h3 className="text-3xl font-black mb-2">{totalProblemsSolved}</h3>
          <p className="text-xs text-slate-400 leading-normal">Across 8 core categories</p>
          <Link to="/student/dsa-tracker" className="text-[10px] font-semibold text-green-450 hover:underline flex items-center gap-1 mt-2.5">
            Log another solved problem <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>

        {/* Mock Interviews */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-2xl p-5 relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400">Interviews</span>
          </div>
          <h3 className="text-3xl font-black mb-1">{interviewCount}</h3>
          <p className="text-xs font-bold text-indigo-400">Avg Rating: {avgScore}/10</p>
          <Link to="/student/mock-interview" className="text-[10px] font-semibold text-indigo-400 hover:underline flex items-center gap-1 mt-2.5">
            Start new AI simulator <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>

        {/* Resume Score */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-2xl p-5 relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400">Resume Match</span>
          </div>
          <h3 className="text-3xl font-black mb-2">{atsScore}/100</h3>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1">
            <div className="bg-purple-505 h-1.5 rounded-full bg-purple-500" style={{ width: `${atsScore}%` }} />
          </div>
          <Link to="/student/resume-analyzer" className="text-[10px] font-semibold text-purple-400 hover:underline flex items-center gap-1">
            Upload new resume document <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>

      {/* Middle Grid: Recharts + Placement Recs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recharts Analytics Chart */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-base font-bold">DSA Problem Categories</h3>
              <p className="text-[10px] text-slate-400">Quantitative problem-solving progress by data structure</p>
            </div>
          </div>

          <div className="h-64 w-full">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No problems logged. Visit the DSA Tracker to begin check-offs.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131c2e', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="solved" radius={[4, 4, 0, 0]} barSize={28}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recommended Placement Prep */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-yellow-400" />
              <div>
                <h3 className="text-base font-bold">AI Recommended Actions</h3>
                <p className="text-[10px] text-slate-400">Target review subjects based on missing profile parameters</p>
              </div>
            </div>

            <div className="space-y-4">
              {recommendedTopics.map((topic, idx) => (
                <div key={idx} className="p-3 bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-white">{topic.topic}</h4>
                    <p className="text-[10px] text-slate-400">{topic.category}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Recommended
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/student/company-prep"
            className="mt-6 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-bold transition-all text-slate-200"
          >
            Access Company Guides <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity Timeline */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-base font-bold">Recent Activities</h3>
            <p className="text-[10px] text-slate-400">Timeline of logged DSA updates and mock evaluations</p>
          </div>
        </div>

        {recentActivity.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No recent activity detected. Get started by solving a DSA problem!</p>
        ) : (
          <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 pl-6 space-y-6">
            {recentActivity.map((act, idx) => (
              <div key={idx} className="relative">
                {/* Timeline node */}
                <div className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full border-2 border-slate-50 dark:border-[#0b0f19] flex items-center justify-center ${
                  act.type === 'interview' ? 'bg-indigo-500' : 'bg-green-500'
                }`} />
                <div>
                  <span className="text-[10px] text-slate-500">{new Date(act.date).toLocaleDateString()}</span>
                  <h4 className="text-xs font-bold text-white mt-0.5">{act.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements & Bookmarks Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Achievements Column */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-yellow-450 dark:text-yellow-450 fill-yellow-450/10 text-yellow-400" />
            <div>
              <h3 className="text-base font-bold">Earned Achievements</h3>
              <p className="text-[10px] text-slate-400">Milestone badges unlocked during placement mock practices</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'First Step', desc: 'TalentSphere profile ready', unlocked: true },
              { name: 'ATS Pass', desc: 'ATS Score above 70%', unlocked: atsScore >= 70 },
              { name: 'Elite Speaker', desc: 'Average rating 7.0+', unlocked: avgScore >= 7 },
              { name: 'Code Scholar', desc: 'DSA problems completed', unlocked: totalProblemsSolved >= 2 }
            ].map((ach, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border text-center transition-all ${
                ach.unlocked 
                  ? 'bg-blue-500/5 border-blue-500/20 text-blue-600 dark:text-blue-400' 
                  : 'bg-slate-100/50 dark:bg-slate-900/10 border-slate-200 dark:border-slate-800/40 text-slate-450 opacity-60'
              }`}>
                <span className="text-xs font-black block">{ach.name}</span>
                <span className="text-[9px] mt-1 block leading-normal">{ach.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bookmarks Column */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-indigo-500" />
              <div>
                <h3 className="text-base font-bold">Bookmarked Practice Problems</h3>
                <p className="text-[10px] text-slate-400">Problem topics bookmarked for recruitment reviews</p>
              </div>
            </div>

            <div className="space-y-3">
              {(!user?.bookmarks || user.bookmarks.length === 0) ? (
                <p className="text-xs text-slate-500 text-center py-6 font-medium">No problems bookmarked. Visit Code Practice to bookmark tasks.</p>
              ) : (
                user.bookmarks.map((b, idx) => (
                  <div key={idx} className="p-3 bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{b}</span>
                    <Link to="/student/coding" className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 hover:underline">
                      Solve Code ➜
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            to="/student/coding"
            className="mt-6 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-bold transition-all text-slate-200"
          >
            Open Coding Editor Playground <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>

  );
};

export default Dashboard;
