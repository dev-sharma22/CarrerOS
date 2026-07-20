import React, { useState } from 'react';
import { X, Mail, KeyRound, Lock, Eye, EyeOff, AlertTriangle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { authAPI } from '../services/api';
import Button from './Button';

export const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpPreview, setOtpPreview] = useState('');

  if (!isOpen) return null;

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      return setError('Please enter your registered email address.');
    }
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.forgotPassword(email);
      if (res.success) {
        setOtpPreview(res.otpPreview || '');
        setSuccessMsg(res.message || 'OTP code generated successfully.');
        setStep(2);
      }
    } catch (err) {
      setError(err.message || 'Failed to request password reset OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      return setError('Please fill in all reset fields.');
    }

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match. Please re-check.');
    }

    if (newPassword.length < 6) {
      return setError('New password must be at least 6 characters long.');
    }

    setError('');
    setLoading(true);

    try {
      const res = await authAPI.resetPassword({ email, otp, newPassword });
      if (res.success) {
        setSuccessMsg('Password reset successfully! You can now log in with your new password.');
        setTimeout(() => {
          handleClose();
        }, 2500);
      }
    } catch (err) {
      setError(err.message || 'Password reset failed. Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMsg('');
    setOtpPreview('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-card rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-slate-800 bg-slate-900/90 text-white relative shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Reset Password</h3>
            <p className="text-xs text-slate-400">
              {step === 1 ? 'Step 1 of 2: Verify registered email' : 'Step 2 of 2: Enter OTP & new password'}
            </p>
          </div>
        </div>

        {/* Banners */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Notification Alert</span>
            </div>
            <p>{successMsg}</p>
            {otpPreview && (
              <div className="mt-2 p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Your 6-Digit Reset OTP</span>
                <span className="text-xl font-mono font-black text-emerald-300 tracking-widest">{otpPreview}</span>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Request OTP */}
        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Registered Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. devmishraa22@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full py-3 rounded-xl btn-gradient-saas flex items-center justify-center gap-2">
              <span>Send 6-Digit Reset Code</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        ) : (
          /* Step 2: Enter OTP & New Password */
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">6-Digit Reset OTP Code</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 583921"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm font-mono tracking-widest text-emerald-300 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-11 pr-11 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full py-3 rounded-xl btn-gradient-saas">
              Update Password & Sign In
            </Button>
          </form>
        )}

      </div>
    </div>
  );
};

export default ForgotPasswordModal;
