import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Terminal, Code2, ShieldCheck, Flame, Briefcase, Sparkles, CheckCircle2, ArrowRight, Zap, Star, Mail, GraduationCap, LifeBuoy, Send, X, HelpCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { authAPI } from '../services/api';

export const Landing = () => {
  const { user } = useAuth();
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Technical Issue');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketEmail, setTicketEmail] = useState(user?.email || '');
  const [ticketName, setTicketName] = useState(user?.name || '');
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState('');
  const [ticketError, setTicketError] = useState('');

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    setTicketLoading(true);
    setTicketError('');
    setTicketSuccess('');

    try {
      const res = await authAPI.submitSupportTicket({
        subject: ticketSubject,
        category: ticketCategory,
        message: ticketMessage,
        email: user?.email || ticketEmail,
        name: user?.name || ticketName
      });

      if (res.success) {
        setTicketSuccess(res.message || `Support Ticket ${res.ticketId} created successfully!`);
        setTicketSubject('');
        setTicketMessage('');
        setTimeout(() => {
          setTicketSuccess('');
          setShowTicketModal(false);
        }, 3000);
      }
    } catch (err) {
      setTicketError(err.message || 'Failed to submit support ticket.');
    } finally {
      setTicketLoading(false);
    }
  };

  const features = [
    {
      icon: Bot,
      title: 'AI Mock Interviews & WebRTC Streaming',
      desc: 'Simulate live technical and HR interviews with real WebRTC video streaming, mic volume level meter, instant AI scoring, and STAR framework analysis.'
    },
    {
      icon: Terminal,
      title: 'Monaco Multi-Language Code Sandbox',
      desc: 'Interactive compiler for JavaScript, Python, C++, Java, and SQL with automated execution benchmarks and Big-O diagnostic feedback.'
    },
    {
      icon: Code2,
      title: '100+ DSA & Dedicated SQL Roster',
      desc: 'Master 100+ algorithmic structures and 20+ dedicated SQL database queries with difficulty filters and daily streak progress tracking.'
    },
    {
      icon: Briefcase,
      title: '25+ Corporate Enterprise Guides',
      desc: 'Access verified recruitment diaries, salary benchmarks, team locations, and technical question guides for 25+ top tech enterprises like Google, Microsoft, Meta, and Stripe.'
    }
  ];

  const stats = [
    { label: 'Corporate Guides', val: '25+' },
    { label: 'Question Bank', val: '100+' },
    { label: 'Video Streaming', val: 'WebRTC' },
    { label: 'Latency Benchmark', val: '< 100ms' }
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-transparent text-slate-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Ambient background glowing radial elements */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-500 dark:text-emerald-400 mb-6 animate-float">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" /> The Modern Tech Career Operating System
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight mb-6 text-slate-900 dark:text-white">
          Accelerate Your Tech Placement with <br className="hidden sm:inline" />
          <span className="text-gradient">CareerOS</span>
        </h1>

        <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed font-normal">
          CareerOS is the ultimate AI-driven career operating system for software engineering candidates — featuring real-time WebRTC video mock interviewers, Monaco code sandbox, ATS resume diagnostics, and 25+ top corporate placement diaries.
        </p>

        {/* Hero CTA buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-16">
          {user ? (
            <Link
              to={
                user.role === 'student'
                  ? '/student/dashboard'
                  : user.role === 'recruiter'
                  ? '/recruiter/dashboard'
                  : '/admin/dashboard'
              }
              className="px-8 py-4 rounded-2xl btn-gradient-saas font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
            >
              <span>Go to Workspace Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/register?role=student"
                className="px-8 py-4 rounded-2xl btn-gradient-saas font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
              >
                <span>Register as Student</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register?role=recruiter"
                className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-800 transition-all cursor-pointer shadow-lg"
              >
                Register as Recruiter
              </Link>
            </>
          )}

          <button
            onClick={() => setShowTicketModal(true)}
            className="px-6 py-4 rounded-2xl bg-slate-900/10 dark:bg-slate-800/80 hover:bg-slate-900/20 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-300 dark:border-slate-700 flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <LifeBuoy className="w-4.5 h-4.5 text-emerald-400" />
            <span>Send Support Ticket</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-20">
          {stats.map((s, idx) => (
            <div key={idx} className="glass-card-glow rounded-2xl p-5 border border-slate-200 dark:border-slate-800 text-center shadow-lg">
              <div className="text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400 mb-1">{s.val}</div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-20">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="glass-card-glow rounded-3xl p-8 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 shadow-xl hover:border-emerald-500/50 transition-all duration-300 group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Developer Footer Banner */}
        <footer className="mt-16 border-t border-slate-200/60 dark:border-slate-800/80 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-slate-200/50 dark:border-slate-800/50 pb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 text-white shadow-md shadow-emerald-500/20">
                  <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
                </div>
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Career<span className="text-emerald-500 dark:text-emerald-400">OS</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Commercial placement &amp; AI career simulator platform for engineering candidates.
              </p>
            </div>

            {/* Ultra-Sleek & High-Contrast DEV Profile Banner */}
            <div className="md:col-span-2 rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/40 shadow-xl shadow-emerald-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden group hover:border-emerald-400/80 transition-all duration-300 text-left">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />

              <div className="flex items-center gap-3.5 relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
                  <Code2 className="w-5.5 h-5.5 text-white" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-slate-900 dark:text-white tracking-wider">
                      DEV
                    </h4>
                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-cyan-300 px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-cyan-500/10 border border-emerald-500/30 dark:border-cyan-500/30">
                      Lead Architect
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-500 dark:text-cyan-400 shrink-0" />
                    <span>B.Tech in Computer Science &amp; Technology</span>
                  </div>
                </div>
              </div>

              <a
                href="mailto:Devmishraa22@gmail.com"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white text-xs font-black shadow-md shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2 shrink-0 cursor-pointer relative z-10 border border-emerald-300/30"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-100 animate-pulse" />
                <span className="tracking-wide">Devmishraa22@gmail.com</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-6">
            <p>© 2026 CareerOS Platform. Designed &amp; Engineered by <strong className="text-slate-900 dark:text-white font-black tracking-wider">DEV</strong>.</p>
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Encrypted WebRTC &amp; JWT Security Protection</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Support Ticket Trigger Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card-glow rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-2xl relative">
            <button
              onClick={() => setShowTicketModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Submit Support Ticket</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Our engineering &amp; placement team will assist you</p>
              </div>
            </div>

            {ticketSuccess && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> {ticketSuccess}
              </div>
            )}

            {ticketError && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400">
                {ticketError}
              </div>
            )}

            <form onSubmit={handleSupportSubmit} className="mt-5 space-y-4">
              {!user && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      required
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={ticketEmail}
                      onChange={(e) => setTicketEmail(e.target.value)}
                      required
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                  Issue Category
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Technical Issue">Technical Issue / Bug</option>
                  <option value="Company Application">Company Application Problem</option>
                  <option value="Interview Feedback">Interview Feedback &amp; AI Evaluation</option>
                  <option value="Account & Login">Account, Login &amp; OTP</option>
                  <option value="General Query">General Query</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                  Subject / Summary
                </label>
                <input
                  type="text"
                  placeholder="Brief summary of issue..."
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  required
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                  Detailed Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe what issue occurred..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  required
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ticketLoading}
                  className="px-5 py-2.5 rounded-xl btn-gradient-saas text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{ticketLoading ? 'Sending Ticket...' : 'Submit Support Ticket'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Landing;
