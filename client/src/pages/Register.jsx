import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User as UserIcon, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      return setError('Please fill in all registration fields.');
    }
    setError('');
    setLoading(true);

    try {
      const res = await register(name, email, password, role);
      if (res.success) {
        // Save auth state for seamless auto-login
        localStorage.setItem('talentsphere_token', res.token);
        if (res.refreshToken) {
          localStorage.setItem('talentsphere_refresh_token', res.refreshToken);
        }
        
        if (res.role === 'student' || role === 'student') {
          window.location.href = '/student/dashboard';
        } else if (res.role === 'recruiter' || role === 'recruiter') {
          window.location.href = '/recruiter/dashboard';
        } else {
          window.location.href = '/admin/dashboard';
        }
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Try using a different email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#090d16] text-slate-900 dark:text-white px-4 py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 bg-slate-900/60 backdrop-blur-xl space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white">Create CareerOS Account</h2>
            <p className="text-xs text-slate-400 mt-1.5">Register to access AI video interviews, ATS diagnostics, and placement guides</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. candidate@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field with Eye Toggle */}
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

            {/* Workspace Select */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Your Path</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-800 dark:text-slate-300 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="student">Student / Placement Candidate</option>
                <option value="recruiter">Recruiter / Employer Partner</option>
              </select>
            </div>

            {/* Submit */}
            <Button type="submit" loading={loading} className="w-full py-3 rounded-xl btn-gradient-saas">
              Create Account
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
