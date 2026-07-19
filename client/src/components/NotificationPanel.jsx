import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Sparkles, AlertCircle, X, Trash2, Building2, Code2, Video } from 'lucide-react';
import { authAPI } from '../services/api';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'AI Mock Interview Evaluated',
    message: 'Your Frontend Developer technical assessment scored 8.5/10 with STAR analysis.',
    time: '10m ago',
    read: false,
    icon: Video,
    color: 'text-emerald-400'
  },
  {
    id: 2,
    title: '25+ Corporate Guides Synced',
    message: 'Google, Stripe, Microsoft, and Meta placement questions and interview breakdown updated.',
    time: '1h ago',
    read: false,
    icon: Building2,
    color: 'text-indigo-400'
  },
  {
    id: 3,
    title: 'DSA Streak Milestone Achieved',
    message: 'You have logged 5 consecutive daily problem solutions on CareerOS!',
    time: '1d ago',
    read: true,
    icon: Code2,
    color: 'text-amber-400'
  }
];

export const NotificationPanel = ({ isOpen, onClose, onCountChange }) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length;
    if (onCountChange) onCountChange(unreadCount);
  }, [notifications, onCountChange]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleRemove = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleTriggerDevNotify = async () => {
    try {
      await authAPI.triggerNotify();
      setNotifications(prev => [
        {
          id: Date.now(),
          title: 'WebSocket Live Alert',
          message: 'Real-time WebSocket connection to CareerOS server confirmed active!',
          time: 'Just now',
          read: false,
          icon: Sparkles,
          color: 'text-cyan-400'
        },
        ...prev
      ]);
    } catch (_) {}
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 z-50 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden bg-white/95 dark:bg-slate-950/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-white">Notifications</h3>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-400">
            {notifications.filter(n => !n.read).length} new
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No notifications available.
          </div>
        ) : (
          notifications.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all relative group flex items-start gap-3 ${
                  !item.read
                    ? 'bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 border-emerald-500/30'
                    : 'bg-slate-900/30 border-slate-800/60 opacity-80'
                }`}
              >
                <div className={`p-2 rounded-xl bg-slate-900 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">{item.title}</h4>
                    <span className="text-[9px] text-slate-400 shrink-0">{item.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">{item.message}</p>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer trigger */}
      <div className="p-2.5 bg-slate-100/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-center">
        <button
          onClick={handleTriggerDevNotify}
          className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center justify-center gap-1.5 w-full cursor-pointer"
        >
          <Sparkles className="w-3 h-3" /> Test WebSocket Live Alert
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;
