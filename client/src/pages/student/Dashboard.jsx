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
  ArrowRight,
  Sparkles,
  Code2,
  Building2,
  CheckCircle2,
  Target
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
          <p className="text-red-500 dark:text-red-400 font-bold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const {
    profileCompletion = 0,
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

  const chartColors = ['#10b981', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#06b6d4', '#f59e0b'];

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300 space-y-8">

      {/* Top Welcome Header & Streak Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/90 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              Candidate Portal
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Welcome back, {user?.name || 'Candidate'}! <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse shrink-0" />
          </h1>
          <p className="text-xs text-slate-300 font-medium">Review your corporate placement analytics, ATS match ratings, and AI interview readiness.</p>
        </div>

        {/* DSA Streak capsule */}
        <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 shadow-xl shadow-orange-500/10 relative z-10 shrink-0">
          <Flame className="w-7 h-7 fill-current animate-bounce" />
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-orange-300">DSA Streak</div>
            <div className="text-lg font-black text-white">{dsaStreak} Day{dsaStreak !== 1 && 's'} Active</div>
          </div>
        </div>
      </div>

      {/* Metrics Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Profile Completion */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card-glow rounded-3xl p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 relative overflow-hidden shadow-xl flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Profile Progress</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{profileCompletion}%</h3>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500" style={{ width: `${profileCompletion}%` }} />
            </div>
          </div>
          <Link to="/student/profile" className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 mt-2">
            Complete profile fields <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* DSA Solved */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card-glow rounded-3xl p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 relative overflow-hidden shadow-xl flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 dark:text-blue-400 border border-blue-500/20">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">DSA Solved</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{totalProblemsSolved}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Across 8 DSA categories</p>
          </div>
          <Link to="/student/dsa-tracker" className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-2">
            Log solved problem <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Mock Interviews */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card-glow rounded-3xl p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 relative overflow-hidden shadow-xl flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Mock Practice</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{interviewCount}</h3>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Avg Rating: {avgScore}/10</p>
          </div>
          <Link to="/student/mock-interview" className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-2">
            Start AI simulator <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Resume Score */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card-glow rounded-3xl p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 relative overflow-hidden shadow-xl flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500 dark:text-purple-400 border border-purple-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Resume ATS Match</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{atsScore}/100</h3>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mb-1 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${atsScore}%` }} />
            </div>
          </div>
          <Link to="/student/resume-analyzer" className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 mt-2">
            Scan resume document <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>

      {/* Interactive Quick Tools Launcher Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/student/mock-interview"
          className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-500/50 flex items-center gap-3 transition-all hover:scale-102 group shadow-md"
        >
          <div className="p-2.5 rounded-xl bg-emerald-500 text-white shrink-0 shadow-md">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-emerald-400 transition-colors">AI Interview</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">WebRTC Video Prep</p>
          </div>
        </Link>

        <Link
          to="/student/coding"
          className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-500/50 flex items-center gap-3 transition-all hover:scale-102 group shadow-md"
        >
          <div className="p-2.5 rounded-xl bg-indigo-500 text-white shrink-0 shadow-md">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-indigo-400 transition-colors">Code Sandbox</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Monaco IDE</p>
          </div>
        </Link>

        <Link
          to="/student/resume-builder"
          className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/50 flex items-center gap-3 transition-all hover:scale-102 group shadow-md"
        >
          <div className="p-2.5 rounded-xl bg-purple-500 text-white shrink-0 shadow-md">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-purple-400 transition-colors">Resume Studio</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">AI ATS Builder</p>
          </div>
        </Link>

        <Link
          to="/student/company-prep"
          className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 hover:border-cyan-500/50 flex items-center gap-3 transition-all hover:scale-102 group shadow-md"
        >
          <div className="p-2.5 rounded-xl bg-cyan-500 text-white shrink-0 shadow-md">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">Company Guides</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Google, Microsoft, TCS</p>
          </div>
        </Link>
      </div>

      {/* Middle Grid: Recharts + Placement Recs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recharts Analytics Chart */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center gap-2.5 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">DSA Problem Categories</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Quantitative problem-solving breakdown by data structure</p>
            </div>
          </div>

          <div className="h-64 w-full">
            {chartData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-100/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                <Target className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">No DSA problems logged yet.</p>
                <Link to="/student/dsa-tracker" className="mt-3 px-4 py-2 rounded-xl btn-gradient-saas text-xs font-bold shadow-md">
                  Log First Solved Problem
                </Link>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="solved" radius={[6, 6, 0, 0]} barSize={28}>
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
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400 fill-amber-500/20" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Recommended Actions</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Target review subjects based on missing parameters</p>
              </div>
            </div>

            <div className="space-y-3">
              {recommendedTopics.map((topic, idx) => (
                <div key={idx} className="p-3.5 bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{topic.topic}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{topic.category}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Recommended
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/student/company-prep"
            className="mt-6 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold transition-all text-white cursor-pointer shadow-md"
          >
            Access Company Guides <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity Timeline */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex items-center gap-2.5 mb-6">
          <Clock className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Placement Activities</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Timeline of logged DSA updates and mock evaluations</p>
          </div>
        </div>

        {recentActivity.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100/50 dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-800">
            No recent activity logged yet. Get started by completing a mock interview session or DSA problem!
          </div>
        ) : (
          <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 pl-6 space-y-6">
            {recentActivity.map((act, idx) => (
              <div key={idx} className="relative">
                {/* Timeline node */}
                <div className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full border-2 border-slate-50 dark:border-[#0b0f19] flex items-center justify-center ${
                  act.type === 'interview' ? 'bg-indigo-500' : 'bg-emerald-500'
                }`} />
                <div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{new Date(act.date).toLocaleDateString()}</span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{act.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements & Bookmarks Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Achievements Column */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center gap-2.5 mb-6">
            <Award className="w-5 h-5 text-amber-500 fill-amber-500/20" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Earned Achievements</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Milestone badges unlocked during placement practice</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'First Step', desc: 'CareerOS profile ready', unlocked: true },
              { name: 'ATS Pass', desc: 'ATS Score above 70%', unlocked: atsScore >= 70 },
              { name: 'Elite Speaker', desc: 'Average rating 7.0+', unlocked: avgScore >= 7 },
              { name: 'Code Scholar', desc: 'DSA problems completed', unlocked: totalProblemsSolved >= 2 }
            ].map((ach, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border text-center transition-all ${
                ach.unlocked 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold' 
                  : 'bg-slate-100/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800/60 text-slate-400 opacity-60'
              }`}>
                <span className="text-xs font-black block">{ach.name}</span>
                <span className="text-[9px] mt-1 block leading-normal">{ach.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bookmarks Column */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <Award className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Bookmarked Practice Problems</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Problem topics bookmarked for recruitment reviews</p>
              </div>
            </div>

            <div className="space-y-3">
              {(!user?.bookmarks || user.bookmarks.length === 0) ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6 font-medium bg-slate-100/50 dark:bg-slate-900/20 rounded-2xl">No problems bookmarked. Visit Code Practice to bookmark tasks.</p>
              ) : (
                user.bookmarks.map((b, idx) => (
                  <div key={idx} className="p-3 bg-slate-100/70 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{b}</span>
                    <Link to="/student/coding" className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                      Solve Code ➜
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            to="/student/coding"
            className="mt-6 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold transition-all text-white cursor-pointer shadow-md"
          >
            Open Coding Editor Playground <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
