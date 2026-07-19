import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('talentsphere_dark_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [socket, setSocket] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Fetch profile on initial load if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('talentsphere_token');
      if (token) {
        try {
          const res = await authAPI.getProfile();
          if (res.success) {
            setUser(res.user);
          } else {
            localStorage.removeItem('talentsphere_token');
          }
        } catch (error) {
          console.error('Failed to load profile on boot:', error.message);
          localStorage.removeItem('talentsphere_token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Theme Sync on load/change
  useEffect(() => {
    localStorage.setItem('talentsphere_dark_mode', JSON.stringify(darkMode));
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.style.backgroundColor = '#0b0f19'; // Keep background consistent
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f8fafc';
    }
  }, [darkMode]);

  // Real-time socket notification bindings
  useEffect(() => {
    if (user) {
      const socketUrl = window.location.origin.includes('5173') ? 'http://localhost:5000' : window.location.origin;
      const newSocket = io(socketUrl);
      setSocket(newSocket);

      newSocket.emit('register_user', user._id);

      newSocket.on('notification', (data) => {
        showToast(data.title, data.desc, data.type);
      });

      return () => newSocket.disconnect();
    }
  }, [user]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const showToast = (title, desc, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, desc, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await authAPI.login({ email, password });
      if (res.success) {
        localStorage.setItem('talentsphere_token', res.token);
        // Load full user object details
        const profileRes = await authAPI.getProfile();
        if (profileRes.success) {
          setUser(profileRes.user);
        } else {
          setUser({ _id: res._id, name: res.name, email: res.email, role: res.role });
        }
        showToast('Login Successful', `Welcome back, ${res.name || 'User'}!`, 'success');
        return res;
      }
    } catch (error) {
      setLoading(false);
      showToast('Login Failed', error.message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    try {
      setLoading(true);
      const res = await authAPI.register({ name, email, password, role });
      if (res.success) {
        localStorage.setItem('talentsphere_token', res.token);
        const profileRes = await authAPI.getProfile();
        if (profileRes.success) {
          setUser(profileRes.user);
        } else {
          setUser({ _id: res._id, name: res.name, email: res.email, role: res.role });
        }
        showToast('Registration Successful', 'Welcome to TalentSphere!', 'success');
        return res;
      }
    } catch (error) {
      setLoading(false);
      showToast('Registration Failed', error.message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('talentsphere_token');
    localStorage.removeItem('talentsphere_refresh_token');
    localStorage.removeItem('talentsphere_user_avatar');
    if (socket) {
      try { socket.disconnect(); } catch (_) {}
    }
    setSocket(null);
    setUser(null);
    showToast('Logged Out', 'Successfully signed out of CareerOS.', 'info');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authAPI.updateProfile(profileData);
      if (res.success) {
        setUser(res.user);
        showToast('Profile Updated', 'Your profile details were saved.', 'success');
        return res;
      }
    } catch (error) {
      showToast('Update Failed', error.message, 'error');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    darkMode,
    login,
    register,
    logout,
    updateProfile,
    toggleDarkMode,
    showToast
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      
      {/* Toast Notification Container Overlay */}
      <div className="fixed bottom-5 right-5 z-[9999] space-y-3 w-80 max-w-full pointer-events-none">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className={`p-4 rounded-2xl border shadow-2xl pointer-events-auto flex flex-col transition-all duration-300 transform translate-y-0 ${
              t.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-400' :
              t.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-400' :
              'bg-blue-500/10 border-blue-500/20 text-blue-800 dark:text-blue-400'
            } backdrop-blur-md`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {t.type === 'success' ? 'Success' : t.type === 'error' ? 'Error' : 'Notification'}
              </span>
              <button 
                onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
                className="text-[10px] opacity-60 hover:opacity-100 font-bold ml-4"
              >
                ✕
              </button>
            </div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white mt-1.5">{t.title}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">{t.desc}</p>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
};
