import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertTriangle, Key, QrCode, Sparkles, Eye, EyeOff } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';
import QRScannerModal from '../components/QRScannerModal';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please fill in all credentials.');
    }
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.role === 'student') {
          navigate('/student/dashboard');
        } else if (res.role === 'recruiter') {
          navigate('/recruiter/dashboard');
        } else {
          navigate('/admin/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQrSuccess = (res) => {
    // Save authentication state and redirect
    localStorage.setItem('talentsphere_token', res.token);
    if (res.refreshToken) {
      localStorage.setItem('talentsphere_refresh_token', res.refreshToken);
    }
    window.location.href = '/student/dashboard';
  };

  const fillTestCreds = (role) => {
    if (role === 'student') {
      setEmail('student@talentsphere.com');
      setPassword('studentpassword123');
    } else if (role === 'recruiter') {
      setEmail('recruiter@talentsphere.com');
      setPassword('recruiterpassword123');
    } else {
      setEmail('admin@talentsphere.com');
      setPassword('adminpassword123');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#090d16] px-4 py-12 relative overflow-hidden">
      {/* Background radial blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 bg-slate-900/60 backdrop-blur-xl space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white">Sign In to CareerOS</h2>
            <p className="text-xs text-slate-400 mt-1.5">Resume mock interviews, Monaco coding, and placement guides</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* QR Scan Quick Login Banner */}
          <button
            type="button"
            onClick={() => setIsQrOpen(true)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-300 hover:border-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/5 group"
          >
            <QrCode className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Scan Student QR Pass to Login</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-500 uppercase">Or Email & Password</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. devmishraa22@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-11 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" loading={loading} className="w-full py-3 rounded-xl btn-gradient-saas">
              Sign In
            </Button>
          </form>

          {/* Test Account Helper Links */}
          <div className="border-t border-slate-800 pt-4">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
              Quick Test Accounts
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => fillTestCreds('student')}
                className="py-1.5 px-2 rounded-lg bg-slate-800/40 hover:bg-slate-850 border border-slate-700/30 text-[10px] font-semibold text-slate-300 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Key className="w-3 h-3 text-emerald-400" /> Student
              </button>
              <button
                onClick={() => fillTestCreds('recruiter')}
                className="py-1.5 px-2 rounded-lg bg-slate-800/40 hover:bg-slate-850 border border-slate-700/30 text-[10px] font-semibold text-slate-300 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Key className="w-3 h-3 text-purple-400" /> Recruiter
              </button>
              <button
                onClick={() => fillTestCreds('admin')}
                className="py-1.5 px-2 rounded-lg bg-slate-800/40 hover:bg-slate-850 border border-slate-700/30 text-[10px] font-semibold text-slate-300 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Key className="w-3 h-3 text-cyan-400" /> Admin
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* QR Code Scanner Modal */}
      <QRScannerModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        onSuccess={handleQrSuccess}
      />
    </div>
  );
};

export default Login;
