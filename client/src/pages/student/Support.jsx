import React, { useState, useEffect } from 'react';
import { HelpCircle, Star, Send, Database, Bell, RotateCcw, Wrench, ShieldCheck, CheckCircle2, AlertCircle, Phone, Mail } from 'lucide-react';
import { reviewAPI, authAPI } from '../../services/api';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/Button';

export const Support = () => {
  const { user } = useAuth();

  // Support coordinates state (Defaulted to devmishraa22@gmail.com)
  const [supportEmail, setSupportEmail] = useState(() => {
    const saved = localStorage.getItem('talentsphere_support_email');
    if (!saved || saved.includes('talentsphere.com') || saved.includes('devsharma')) {
      localStorage.setItem('talentsphere_support_email', 'devmishraa22@gmail.com');
      return 'devmishraa22@gmail.com';
    }
    return saved;
  });
  const [supportPhone, setSupportPhone] = useState(localStorage.getItem('talentsphere_support_phone') || '+91 800-87-HELP');

  // Input states for editing Support info
  const [newEmail, setNewEmail] = useState(supportEmail);
  const [newPhone, setNewPhone] = useState(supportPhone);
  const [coordsSuccess, setCoordsSuccess] = useState('');

  // Support ticket state
  const [ticketCategory, setTicketCategory] = useState('General Query');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState('');

  // Review states
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Dev actions states
  const [devLogs, setDevLogs] = useState([]);
  const [notifySuccess, setNotifySuccess] = useState('');
  const [seedSuccess, setSeedSuccess] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await reviewAPI.list();
      if (res.success) {
        setReviews(res.reviews);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err.message);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!ticketDesc.trim()) return;

    setTicketSuccess('Support ticket created successfully! Dev Mishra and engineering team will review it.');
    setTicketDesc('');
    setTimeout(() => setTicketSuccess(''), 5000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingReview(true);
    setReviewSuccess('');
    setReviewError('');

    try {
      const res = await reviewAPI.create({ rating, comment });
      if (res.success) {
        setReviewSuccess('Thank you for rating CareerOS!');
        setComment('');
        setRating(5);
        fetchReviews(); // Reload list
        setTimeout(() => setReviewSuccess(''), 5000);
      }
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleTriggerNotify = async () => {
    setNotifySuccess('');
    try {
      const res = await authAPI.triggerNotify();
      if (res.success) {
        setNotifySuccess('WebSocket broadcast dispatched! Check your screen header for alerts.');
        setTimeout(() => setNotifySuccess(''), 4000);
      }
    } catch (err) {
      alert('Notification dispatch failed: ' + err.message);
    }
  };

  const handleTriggerSeed = async () => {
    setSeedSuccess('');
    try {
      const res = await authAPI.triggerSeed();
      if (res.success) {
        setSeedSuccess('Database schema seeding triggered. Questions synchronized.');
        setTimeout(() => setSeedSuccess(''), 4000);
      }
    } catch (err) {
      alert('Seeding simulation failed: ' + err.message);
    }
  };

  const handleClearCache = () => {
    localStorage.removeItem('talentsphere_cache_state');
    setDevLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] LocalStorage cache state cleared.`]);
    alert('Browser state caches cleaned.');
  };

  const handleUpdateCoordinates = (e) => {
    e.preventDefault();
    localStorage.setItem('talentsphere_support_email', newEmail.trim());
    localStorage.setItem('talentsphere_support_phone', newPhone.trim());
    setSupportEmail(newEmail.trim());
    setSupportPhone(newPhone.trim());
    setCoordsSuccess('Support coordinates updated successfully!');
    setTimeout(() => setCoordsSuccess(''), 4000);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Title */}
        <div>
          <span className="text-xs font-black text-emerald-500 uppercase tracking-widest block">Candidate Assistance</span>
          <h1 className="text-2xl sm:text-3xl font-black mt-0.5 text-slate-800 dark:text-white">Support & Developer Hub</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Submit help tickets, audit code settings, trigger socket events, and review candidate testimonials.</p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Col 1 & 2: Support Ticket & Developer Options */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Help & Support Ticket */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base font-bold text-slate-800 dark:text-white">Contact Help & Support</h2>
                </div>
                {/* Dynamically Loaded Support Info */}
                <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase font-mono">
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {supportPhone}</span>
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-emerald-400" /> {supportEmail}</span>
                </div>
              </div>

              {ticketSuccess && (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{ticketSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Registered Contact Email</label>
                    <input
                      type="text"
                      disabled
                      value={user?.email || 'devmishraa22@gmail.com'}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-700 dark:text-slate-300 font-mono cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Problem Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="General Query">General Query</option>
                      <option value="Resume Parser Error">Resume Parser Error</option>
                      <option value="Code Terminal Failure">Code Terminal Failure</option>
                      <option value="Mock Interview Loading">Mock Interview Loading</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Explain your issue</label>
                  <textarea
                    required
                    rows={4}
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    placeholder="Describe what occurred, any error messages printed, or support help needed..."
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 resize-none font-mono"
                  />
                </div>

                <Button type="submit" className="px-6 py-3 rounded-xl text-xs font-bold btn-gradient-saas flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" /> Dispatch Support Ticket
                </Button>
              </form>
            </div>

            {/* Developer Console options */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-slate-800 dark:text-white">Dev Mishra's Sandbox Console</h2>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Notify simulation trigger */}
                  <button
                    onClick={handleTriggerNotify}
                    className="p-4 bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/35 rounded-2xl text-left transition-all group cursor-pointer"
                  >
                    <Bell className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-slate-800 dark:text-white">Push WebSocket Alert</div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Dispatches a mock notification from server to preview header toasts.</p>
                  </button>

                  {/* Seed simulation */}
                  <button
                    onClick={handleTriggerSeed}
                    className="p-4 bg-indigo-500/5 border border-indigo-500/10 hover:border-indigo-500/35 rounded-2xl text-left transition-all group cursor-pointer"
                  >
                    <Database className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-slate-800 dark:text-white">Verify DB Seed</div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Forces seeding validations and reviews integrity benchmarks.</p>
                  </button>

                  {/* Clean Cache */}
                  <button
                    onClick={handleClearCache}
                    className="p-4 bg-rose-500/5 border border-rose-500/10 hover:border-rose-500/35 rounded-2xl text-left transition-all group cursor-pointer"
                  >
                    <RotateCcw className="w-5 h-5 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-slate-800 dark:text-white">Flush System Cache</div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Evacuates cached parameters and settings inside LocalStorage.</p>
                  </button>
                </div>

                {notifySuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 rounded-xl font-mono">
                    {notifySuccess}
                  </div>
                )}

                {seedSuccess && (
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-400 rounded-xl font-mono">
                    {seedSuccess}
                  </div>
                )}

                {/* Update support coordinates */}
                <div className="p-5 bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-3">Update Platform Support Contacts</h4>
                  {coordsSuccess && (
                    <div className="mb-3 text-[10px] font-bold text-emerald-400">
                      {coordsSuccess}
                    </div>
                  )}
                  <form onSubmit={handleUpdateCoordinates} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">Support Email</label>
                      <input
                        type="email"
                        required
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">Helpline Phone</label>
                      <input
                        type="text"
                        required
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-white focus:outline-none"
                      />
                    </div>
                    <Button type="submit" className="w-full py-2 rounded-xl text-xs font-bold btn-gradient-saas">
                      Save Coordinates
                    </Button>
                  </form>
                </div>

                {/* Audit panel JSON */}
                <div className="p-4 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">System Diagnostics Payload</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-bold flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5" /> SECURE
                    </span>
                  </div>
                  <pre className="font-mono text-[9px] text-slate-600 dark:text-slate-400 leading-normal max-h-[100px] overflow-y-auto">
                    {JSON.stringify({
                      mongodb: "Connected (talentsphere_db)",
                      developer: "Dev Mishra",
                      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                      environment: "production",
                      role: user?.role || "student",
                      userId: user?._id || "mem_user_student_1",
                      developerLogs: devLogs.length > 0 ? devLogs : ["Audit ready. Logs clear."]
                    }, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

          </div>

          {/* Col 3: Rating & Testimonials Feed */}
          <div className="space-y-8">
            
            {/* Feedback / Rating submission */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Submit App Review</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Share your rating to help place other applicants.</p>
              </div>

              {reviewSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 rounded-xl font-semibold">
                  {reviewSuccess}
                </div>
              )}

              {reviewError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 rounded-xl font-semibold">
                  {reviewError}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                {/* 5 Star Selection */}
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase mb-1.5">Your Rating</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform active:scale-90 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            (hoverRating || rating) >= star
                              ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_4px_rgba(245,158,11,0.2)]'
                              : 'text-slate-300 dark:text-slate-700 fill-transparent'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase mb-1.5">Comments</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you loved, or areas to optimize..."
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  loading={submittingReview}
                  disabled={!comment.trim()}
                  className="w-full py-2.5 rounded-xl text-xs font-black btn-gradient-saas"
                >
                  Post Review
                </Button>
              </form>
            </div>

            {/* Testimonials Feed list */}
            <div className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Candidate Feedback Feed ({reviews.length})</h3>

              <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                {reviews.length === 0 ? (
                  <p className="text-[10px] text-slate-500 text-center py-6 italic">No reviews logged yet. Be the first!</p>
                ) : (
                  reviews.map((rev, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-slate-800 dark:text-white truncate">{rev.userName}</span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                rev.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700 fill-transparent'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-light">{rev.comment}</p>
                      <div className="text-[8px] text-slate-500 text-right">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Support;
