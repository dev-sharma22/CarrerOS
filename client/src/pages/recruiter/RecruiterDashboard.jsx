import React, { useEffect, useState } from 'react';
import { Briefcase, Users, FileText, Trash2, MapPin, IndianRupee, ExternalLink, Sparkles, CheckCircle2, Calendar } from 'lucide-react';
import { jobAPI } from '../../services/api';
import Loader from '../../components/Loader';

export const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Scheduling states
  const [schedulingCandidate, setSchedulingCandidate] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const fetchRecruiterJobs = async () => {
    try {
      const res = await jobAPI.getRecruiterJobs();
      if (res.success) {
        setJobs(res.jobs);
        if (res.jobs.length > 0 && !selectedJob) {
          setSelectedJob(res.jobs[0]);
        } else if (res.jobs.length > 0 && selectedJob) {
          const updated = res.jobs.find(j => j._id === selectedJob._id);
          setSelectedJob(updated || res.jobs[0]);
        } else {
          setSelectedJob(null);
        }
      }
    } catch (err) {
      console.error('Failed to fetch recruiter jobs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job vacancy listing?')) return;

    try {
      const res = await jobAPI.delete(id);
      if (res.success) {
        await fetchRecruiterJobs();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete job posting.');
    }
  };

  const handleShortlist = async (candidate) => {
    try {
      const res = await jobAPI.notifyCandidate(
        selectedJob._id,
        candidate._id,
        'Application Shortlisted',
        `Your application for "${selectedJob.title}" at "${selectedJob.companyName}" has been shortlisted! Our hiring team will contact you shortly.`,
        'success'
      );
      if (res.success) {
        alert(`Candidate ${candidate.name} successfully shortlisted and notified!`);
      }
    } catch (err) {
      alert(err.message || 'Failed to dispatch shortlist notification.');
    }
  };

  const handleConfirmSchedule = async (e, candidate) => {
    e.preventDefault();
    if (!scheduleDate || !scheduleTime) return;

    try {
      const res = await jobAPI.notifyCandidate(
        selectedJob._id,
        candidate._id,
        'Interview Scheduled',
        `An interview has been scheduled for "${selectedJob.title}" on ${scheduleDate} at ${scheduleTime}. Please be prepared!`,
        'info'
      );
      if (res.success) {
        alert(`Placement interview scheduled for ${candidate.name}! Candidate notified.`);
        setSchedulingCandidate(null);
        setScheduleDate('');
        setScheduleTime('');
      }
    } catch (err) {
      alert(err.message || 'Failed to schedule slot.');
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <span className="text-xs font-black text-emerald-500 uppercase tracking-widest block">Recruiter OS Workspace</span>
          <h1 className="text-2xl sm:text-3xl font-black mt-0.5 text-slate-800 dark:text-white">Job & Candidate Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review active job postings, screen applicant skill profiles, and shortlist candidates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel: job list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Openings</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400">
                {jobs.length} Active
              </span>
            </div>

            {jobs.length === 0 ? (
              <div className="glass-card rounded-3xl p-6 text-center text-xs text-slate-500 border border-slate-200 dark:border-slate-800">
                You haven't posted any jobs yet. Visit the job creation page to add one.
              </div>
            ) : (
              jobs.map((job, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedJob(job)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer relative ${
                    selectedJob?._id === job._id
                      ? 'btn-gradient-saas text-white shadow-xl shadow-emerald-500/20'
                      : 'glass-card border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xs sm:text-sm font-bold line-clamp-1">{job.title}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteJob(job._id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] opacity-80 mt-1">{job.companyName} | {job.location}</p>

                  <div className="flex items-center justify-between mt-4 text-[10px] font-bold">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>{job.applicants ? job.applicants.length : 0} Applicant{job.applicants?.length !== 1 && 's'}</span>
                    </div>
                    <span className="font-mono">{job.salary}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Panel: Applicants screening */}
          <div className="lg:col-span-2">
            {selectedJob ? (
              <div className="space-y-6">
                {/* Description details card */}
                <div className="glass-card-glow rounded-3xl p-6 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h2 className="text-lg font-black text-slate-800 dark:text-white">{selectedJob.title}</h2>
                    <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Open Position
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">{selectedJob.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500 border-t border-slate-200 dark:border-slate-800/60 pt-4">
                    <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-400" /> {selectedJob.location}</div>
                    <div className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4 text-emerald-400" /> {selectedJob.salary}</div>
                  </div>
                </div>

                {/* Candidate Applications */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-400" /> Candidate Applications ({selectedJob.applicants ? selectedJob.applicants.length : 0})
                    </h3>
                  </div>

                  {(!selectedJob.applicants || selectedJob.applicants.length === 0) ? (
                    <div className="glass-card rounded-3xl p-12 text-center text-xs text-slate-500 border border-slate-200 dark:border-slate-800">
                      No student applications received for this vacancy yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedJob.applicants.map((candidate, idx) => (
                        <div key={idx} className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <h4 className="text-sm font-black text-slate-800 dark:text-white">{candidate.name}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{candidate.email}</p>
                            </div>

                            {candidate.resumeURL && (
                              <a
                                href={`http://localhost:5000${candidate.resumeURL}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-xs font-bold text-emerald-400 flex items-center gap-1.5 shrink-0 transition-colors"
                              >
                                <FileText className="w-4 h-4 text-emerald-400" /> View Resume PDF <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>

                          {/* Candidate Skills tags */}
                          {candidate.skills && candidate.skills.length > 0 && (
                            <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                              <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Technical Skills</h5>
                              <div className="flex flex-wrap gap-1.5">
                                {candidate.skills.map((s, sIdx) => (
                                  <span key={sIdx} className="px-2.5 py-1 text-[10px] font-bold rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Recruiter Action Buttons */}
                          <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
                            <button
                              onClick={() => handleShortlist(candidate)}
                              className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Shortlist Candidate
                            </button>
                            <button
                              onClick={() => setSchedulingCandidate(candidate._id === schedulingCandidate ? null : candidate._id)}
                              className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Calendar className="w-4 h-4" />
                              {schedulingCandidate === candidate._id ? 'Cancel scheduling' : 'Schedule Interview'}
                            </button>
                          </div>

                          {/* Inline Interview Scheduler Form */}
                          {schedulingCandidate === candidate._id && (
                            <form onSubmit={(e) => handleConfirmSchedule(e, candidate)} className="p-4 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                              <span className="text-[10px] font-bold text-slate-500 uppercase block">Schedule Time Slot</span>
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="date"
                                  required
                                  value={scheduleDate}
                                  onChange={(e) => setScheduleDate(e.target.value)}
                                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                                />
                                <input
                                  type="time"
                                  required
                                  value={scheduleTime}
                                  onChange={(e) => setScheduleTime(e.target.value)}
                                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                                />
                              </div>
                              <button
                                type="submit"
                                className="w-full py-2.5 btn-gradient-saas text-white rounded-xl text-xs font-bold cursor-pointer"
                              >
                                Send Invitation
                              </button>
                            </form>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-16 text-center text-xs text-slate-500 border border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center h-full min-h-[300px]">
                <Briefcase className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">Select Job Opening</h3>
                <p className="text-xs text-slate-400">Choose a job listing from the workspace to begin screening applicants</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
