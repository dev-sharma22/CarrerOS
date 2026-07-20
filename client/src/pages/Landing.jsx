import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Terminal, Code2, ShieldCheck, Flame, Briefcase, Sparkles, CheckCircle2, ArrowRight, Zap, Star } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const Landing = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Bot,
      title: 'AI Mock Interviews & Video Streaming',
      desc: 'Simulate live technical and HR interviews with real WebRTC video streaming, mic volume level meter, instant AI scoring, and STAR framework analysis.'
    },
    {
      icon: Terminal,
      title: 'Monaco Code Sandbox',
      desc: 'Interactive multi-language compiler for JavaScript, Python, C++, Java, and SQL with automated execution benchmarks and Big-O diagnostic feedback.'
    },
    {
      icon: Code2,
      title: '100+ DSA & Dedicated SQL Roster',
      desc: 'Master 100+ algorithmic structures and 20+ dedicated SQL database queries with difficulty filters and daily streak progress tracking.'
    },
    {
      icon: Briefcase,
      title: '25+ Corporate Company Guides',
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 mb-6 animate-float">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" /> The Modern Tech Career Operating System
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight mb-6">
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
              className="px-8 py-4 rounded-2xl btn-gradient-saas font-bold text-sm shadow-xl shadow-emerald-500/20 flex items-center gap-2 group"
            >
              Launch CareerOS Workspace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="px-8 py-4 rounded-2xl btn-gradient-saas font-bold text-sm shadow-xl shadow-emerald-500/20 flex items-center gap-2 group"
              >
                Get Started Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-800 dark:text-white hover:border-emerald-500/50 transition-all"
              >
                Sign In to Account
              </Link>
            </>
          )}
        </div>

        {/* Key Metrics Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {stats.map((s, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-4 text-center border border-slate-200 dark:border-slate-800/60">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">{s.val}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Grid Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-slate-200/40 dark:border-slate-800/40">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2">Engine Architecture</span>
          <h2 className="text-2xl sm:text-4xl font-black">Built for Tier-1 Recruitment Excellence</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2">
            Everything you need to clear screening rounds, master data structures, and secure high-paying SDE offers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-card rounded-3xl p-6 relative overflow-hidden group border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="p-3 w-12 h-12 bg-emerald-500/10 rounded-2xl text-emerald-400 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold mb-2.5 text-slate-900 dark:text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-[10px] font-bold text-emerald-400">
                  <span>Explore module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature comparison highlights */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="glass-card-glow rounded-3xl p-8 border border-slate-200 dark:border-slate-800 bg-slate-900/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2">Why CareerOS?</span>
              <h3 className="text-2xl font-black text-white mb-4">Commercial Grade Tech Prep</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Unlike traditional static problem lists, CareerOS provides interactive WebRTC video streaming mock interviews, real-time AudioContext frequency visualization, and SQL-specific compilation sandboxes.
              </p>
              <div className="space-y-2.5">
                {[
                  'WebRTC video streaming with picture-in-picture mode',
                  '25+ curated company guides with verified interview questions',
                  '100+ DSA & dedicated SQL queries sandbox',
                  'Instant Gemini AI scoring & STAR feedback framework'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-950/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 font-mono">Live Demo Session</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">ONLINE</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                <div className="text-slate-500">// CareerOS WebRTC Simulator initialized</div>
                <div><span className="text-emerald-400">✔</span> Camera Stream: Active (720p 60fps)</div>
                <div><span className="text-emerald-400">✔</span> Audio Analyser: 48kHz Stereo</div>
                <div><span className="text-indigo-400">▶</span> AI Diagnostic: STAR logic score 9.2/10</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/80 backdrop-blur-xl py-12 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-slate-200/50 dark:border-slate-800/50 pb-8">
            {/* Brand Logo & Name */}
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
                Commercial placement & AI career simulator platform for engineering candidates.
              </p>
            </div>

            {/* Developer Details & Contact */}
            <div className="md:col-span-2 glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/80 bg-slate-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block">Lead Platform Engineer</span>
                <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Dev Sharma</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">Lead Developer</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Architect & Creator of CareerOS AI placement platform</p>
              </div>

              <a
                href="mailto:Devmishraa22@gmail.com"
                className="px-4 py-2.5 rounded-xl btn-gradient-saas text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Devmishraa22@gmail.com</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 CareerOS Platform. Designed & Engineered by Dev Sharma.</p>
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Encrypted WebRTC & JWT Security Protection</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
