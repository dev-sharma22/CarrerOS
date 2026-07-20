import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, User as UserIcon, Bell, Search, Sparkles } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import SearchModal from './SearchModal';
import NotificationPanel from './NotificationPanel';

export const Navbar = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    setTimeout(() => {
      window.location.href = '/login';
    }, 150);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/75 dark:bg-slate-950/75 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Brand Logo - CareerOS */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-5 h-5 text-emerald-200 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                  Career<span className="text-emerald-500 dark:text-emerald-400">OS</span>
                </span>
              </div>
            </Link>

            {/* Interactive Search Bar Trigger */}
            {user && (
              <div
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs w-72 cursor-pointer hover:border-emerald-500/50 transition-all group"
              >
                <Search className="w-3.5 h-3.5 group-hover:text-emerald-400 transition-colors" />
                <span>Search 25+ companies, 100+ problems...</span>
                <kbd className="ml-auto px-1.5 py-0.5 text-[9px] font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-500">⌘K</kbd>
              </div>
            )}

            {/* Action Center */}
            <div className="flex items-center gap-3 relative">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                title="Toggle theme"
              >
                {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
              </button>

              {user ? (
                <div className="flex items-center gap-3">
                  {/* Notification Bell with Panel */}
                  <div className="relative">
                    <button
                      onClick={() => setIsNotifyOpen(prev => !prev)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors relative cursor-pointer"
                      title="Notifications"
                    >
                      <Bell className="w-4.5 h-4.5" />
                      {unreadCount > 0 && (
                        <>
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500" />
                        </>
                      )}
                    </button>

                    {/* Dropdown Notification Drawer */}
                    <NotificationPanel
                      isOpen={isNotifyOpen}
                      onClose={() => setIsNotifyOpen(false)}
                      onCountChange={setUnreadCount}
                    />
                  </div>

                  {/* User Info Capsule */}
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{user.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400">
                      {user.role}
                    </span>
                  </div>

                  {/* Avatar Icon */}
                  {/* Avatar Icon / Custom Profile Image */}
                  <Link
                    to={user.role === 'student' ? '/student/profile' : '/recruiter/profile'}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition-colors overflow-hidden"
                  >
                    {localStorage.getItem('talentsphere_user_avatar') ? (
                      <img
                        src={localStorage.getItem('talentsphere_user_avatar')}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-4.5 h-4.5" />
                    )}
                  </Link>

                  {/* Logout Trigger */}
                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-xl border border-red-500/10 hover:border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-xs font-bold rounded-xl btn-gradient-saas shadow-md shadow-emerald-500/20"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Global Command Palette Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
