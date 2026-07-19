import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Users, Video, Briefcase, FileCheck, ShieldAlert, Award, Sparkles, Database, CheckCircle2 } from 'lucide-react';
import { adminAPI, authAPI } from '../../services/api';
import Loader from '../../components/Loader';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [triggerMsg, setTriggerMsg] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adminAPI.getAnalytics();
        if (res.success) {
          setStats(res.analytics);
        }
      } catch (err) {
        setError(err.message || 'Failed to load platform analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleSeedDatabase = async () => {
    try {
      const res = await authAPI.triggerSeed();
      setTriggerMsg(res.message || 'Database questions synced successfully!');
      setTimeout(() => setTriggerMsg(''), 4000);
    } catch (_) {}
  };

  if (loading) return <Loader fullPage />;

  if (error) {
    return (
      <div className="p-8 text-center bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="max-w-md p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
          <p className="text-red-400 font-bold">{error}</p>
        </div>
      </div>
    );
  }

  const {
    totalUsers = 0,
    totalStudents = 0,
    totalRecruiters = 0,
    totalJobs = 0,
    totalInterviews = 0,
    avgScore = 0,
    avgATS = 0
  } = stats || {};

  const dataPie = [
    { name: 'Students', value: totalStudents },
    { name: 'Recruiters', value: totalRecruiters },
    { name: 'Admins', value: Math.max(0, totalUsers - totalStudents - totalRecruiters) }
  ];

  const colors = ['#10b981', '#6366f1', '#06b6d4'];

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest block">System Governance</span>
            <h1 className="text-2xl sm:text-3xl font-black mt-0.5 text-slate-800 dark:text-white">Platform Analytics & Control</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Monitor registrations, vacancy postings, AI ratings, and database health</p>
          </div>

          <button
            onClick={handleSeedDatabase}
            className="px-4 py-2.5 rounded-2xl btn-gradient-saas font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Database className="w-4 h-4" /> Sync Database Questions
          </button>
        </div>

        {triggerMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {triggerMsg}
          </div>
        )}

        {/* Counter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Registered Users</span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{totalUsers}</h3>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Vacancies</span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{totalJobs}</h3>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mock Interviews Run</span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{totalInterviews}</h3>
            </div>
          </div>
        </div>

        {/* Middle row: Averages + PieChart */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 glass-card-glow rounded-3xl p-6 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Account Role Distribution</h4>
              <p className="text-[10px] text-slate-500">Distribution of platform user roles</p>
            </div>

            <div className="h-44 w-full flex items-center justify-center my-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {dataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-1 text-center">
              {dataPie.map((item, idx) => (
                <div key={idx}>
                  <span className="block text-[10px] font-bold text-slate-500">{item.name}</span>
                  <span className="text-xs font-black" style={{ color: colors[idx] }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Evaluation Engine Metrics</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                <FileCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Average Resume Match</span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{avgATS}/100</h3>
                <p className="text-[10px] text-slate-500 mt-1">Calculated across ATS scans</p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-center">
                <Award className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Average Interview Rating</span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{avgScore}/10</h3>
                <p className="text-[10px] text-slate-500 mt-1">Evaluated by Gemini AI</p>
              </div>
            </div>

            <div className="p-4 bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Gemini AI Engine Status</span>
              </div>
              <span className="text-[10px] font-black text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 uppercase">
                Active & Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
