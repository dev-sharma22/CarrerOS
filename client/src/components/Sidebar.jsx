import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Video,
  Code2,
  Building2,
  History,
  UserCog,
  Briefcase,
  Users,
  PieChart,
  Terminal,
  HelpCircle,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const Sidebar = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const role = user.role;

  const menuItems = {
    student: [
      { path: '/student/dashboard', name: 'Dashboard', icon: LayoutDashboard },
      { path: '/student/resume-analyzer', name: 'Resume Analyzer', icon: FileText },
      { path: '/student/resume-builder', name: 'AI Resume Builder', icon: FileText, badge: 'New' },
      { path: '/student/mock-interview', name: 'AI Mock Interviews', icon: Video, badge: 'Live' },
      { path: '/student/dsa-tracker', name: 'DSA Progress', icon: Code2 },
      { path: '/student/coding', name: 'Code Sandbox', icon: Terminal },
      { path: '/student/company-prep', name: 'Company Guides', icon: Building2, badge: '25+' },
      { path: '/student/history', name: 'Past Reports', icon: History },
      { path: '/student/leaderboard', name: 'Leaderboard', icon: Trophy },
      { path: '/student/support', name: 'Support & Feedback', icon: HelpCircle },
      { path: '/student/profile', name: 'Settings', icon: UserCog }
    ],
    recruiter: [
      { path: '/recruiter/dashboard', name: 'Job Manager', icon: LayoutDashboard },
      { path: '/recruiter/create-job', name: 'Create Opening', icon: Briefcase },
      { path: '/recruiter/create-company', name: 'Add Company Guide', icon: Building2 },
      { path: '/recruiter/profile', name: 'Settings', icon: UserCog }
    ],
    admin: [
      { path: '/admin/dashboard', name: 'Analytics Panel', icon: PieChart },
      { path: '/admin/users', name: 'User Moderation', icon: Users }
    ]
  };

  const currentMenu = menuItems[role] || [];

  return (
    <aside
      className={`transition-all duration-300 shrink-0 bg-slate-900/30 dark:bg-slate-950/40 border-r border-slate-200/60 dark:border-slate-800/60 p-3 md:h-[calc(100vh-4rem)] md:sticky md:top-16 flex flex-col justify-between ${
        collapsed ? 'w-16' : 'w-full md:w-60'
      }`}
    >
      <div className="space-y-4">
        {/* Workspace title & collapse button */}
        <div className="flex items-center justify-between px-2 py-1">
          {!collapsed && (
            <span className="text-[10px] font-extrabold tracking-widest text-indigo-400 uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> {role} OS Workspace
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer ml-auto"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {currentMenu.map((item, idx) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={idx}
                to={item.path}
                title={collapsed ? item.name : ''}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 relative group cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/80 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                {!collapsed && <span className="truncate">{item.name}</span>}
                {!collapsed && item.badge && (
                  <span className="ml-auto px-1.5 py-0.5 text-[9px] font-black rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status & Logout */}
      <div className="space-y-2">
        {!collapsed && (
          <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 hidden md:block">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">CareerOS v2.5 Live</span>
            </div>
            <p className="text-[9px] text-slate-400 leading-tight">AI Engine & Video Streaming operational</p>
          </div>
        )}

        {/* Quick Sign Out Action */}
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/30 transition-all cursor-pointer ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Sign Out of Session"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
