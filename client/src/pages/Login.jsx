import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertTriangle, Key, QrCode, Sparkles, Eye, EyeOff, ShieldCheck, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';
import QRScannerModal from '../components/QRScannerModal';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

export const Login = () => {
  const { login, verifyLoginOtp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpPreview, setOtpPreview] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const handleSubmitCredentials = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please fill in all credentials.');
    }
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.otpRequired) {
        setOtpStep(true);
        setOtpPreview(res.otpPreview || '');
        setSuccessMsg(res.message || `6-Digit OTP code sent to ${email}`);
      } else if (res.success) {
        redirectRole(res.role);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      return setError('Please enter the 6-digit OTP code.');
    }
    setError('');
    setLoading(true);

    try {
      const res = await verifyLoginOtp(email, otp);
      if (res.success) {
        redirectRole(res.role);
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired 6-digit OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const redirectRole = (role) => {
    if (role === 'student') {
      navigate('/student/dashboard');
    } else if (role === 'recruiter') {
      navigate('/recruiter/dashboard');
    } else {
      navigate('/admin/dashboard');
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
            <h2 className="text-2xl font-black text-white">
              {otpStep ? '2-Step Email Verification' : 'Sign In to CareerOS'}
            </h2>
            <p className="text-xs text-slate-400 mt-1.5">
              {otpStep ? `Verify 6-digit security code sent to ${email}` : 'Resume mock interviews, Monaco coding, and placement guides'}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Verification OTP Dispatch Alert</span>
              </div>
              <p>{successMsg}</p>
              {otpPreview && (
                <div className="mt-2 p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Your 6-Digit Email Login OTP</span>
                  <span className="text-xl font-mono font-black text-emerald-300 tracking-widest">{otpPreview}</span>
                </div>
              )}
            </div>
          )}

          {!otpStep ? (
            <>
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

              <form onSubmit={handleSubmitCredentials} className="space-y-4">
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                    <button
                      type="button"
                      onClick={() => setIsForgotOpen(true)}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
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

                {/* Submit Credentials */}
                <Button type="submit" loading={loading} className="w-full py-3 rounded-xl btn-gradient-saas">
                  Continue & Request 2FA OTP
                </Button>
              </form>
            </>
          ) : (
            /* OTP Verification Step */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">6-Digit Email OTP Code</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 849201"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm font-mono tracking-widest text-emerald-300 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <Button type="submit" loading={loading} className="w-full py-3 rounded-xl btn-gradient-saas">
                Verify OTP & Sign In
              </Button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep(false);
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </button>
                <button
                  type="button"
                  onClick={handleSubmitCredentials}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Resend OTP Code
                </button>
              </div>
            </form>
          )}

          {/* Clean Role Registration Options */}
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
              New Candidate or Hiring Manager?
            </span>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/register"
                className="py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-300 text-center transition-all cursor-pointer"
              >
                Register as Student
              </Link>
              <Link
                to="/register"
                className="py-2.5 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-bold text-purple-300 text-center transition-all cursor-pointer"
              >
                Register as Recruiter
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Scanner Modal */}
      <QRScannerModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        onSuccess={handleQrSuccess}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
    </div>
  );
};

export default Login;
