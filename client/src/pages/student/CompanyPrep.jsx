import React, { useEffect, useState } from 'react';
import { Building2, Plus, Send, Award, HelpCircle, User, Briefcase, MapPin, IndianRupee, CheckCircle } from 'lucide-react';
import { companyAPI, jobAPI } from '../../services/api';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/Loader';
import Button from '../../components/Button';

export const CompanyPrep = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Form states
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Apply states
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  const fetchCompanies = async () => {
    try {
      const res = await companyAPI.list();
      if (res.success) {
        setCompanies(res.companies);
        if (res.companies.length > 0) {
          await selectCompany(res.companies[0].companyName);
        }
      }
    } catch (err) {
      console.error('Failed to load company guides:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const selectCompany = async (name) => {
    setDetailsLoading(true);
    setFormSuccess('');
    setFormError('');
    setRole('');
    setContent('');
    try {
      const res = await companyAPI.getDetails(name);
      if (res.success) {
        setSelectedCompany(name);
        setCompanyDetails(res.company);
        setActiveJobs(res.jobs);

        const appliedSet = new Set();
        res.jobs.forEach(j => {
          if (j.applicants && j.applicants.includes(user?._id)) {
            appliedSet.add(j._id);
          }
        });
        setAppliedJobs(appliedSet);
      }
    } catch (err) {
      console.error('Failed to fetch details for company:', err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handlePostExperience = async (e) => {
    e.preventDefault();
    if (!role || !content) return;

    setSubmitting(true);
    setFormError('');
    setFormSuccess('');

    try {
      const res = await companyAPI.addExperience(selectedCompany, { role, content });
      if (res.success) {
        setFormSuccess('Interview experience shared successfully.');
        setCompanyDetails(prev => ({
          ...prev,
          experiences: res.experiences
        }));
        setRole('');
        setContent('');
      }
    } catch (err) {
      setFormError(err.message || 'Failed to submit experience.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyJob = async (jobId) => {
    try {
      const res = await jobAPI.apply(jobId);
      if (res.success) {
        setAppliedJobs(prev => {
          const next = new Set(prev);
          next.add(jobId);
          return next;
        });
        setActiveJobs(prev => prev.map(job => {
          if (job._id === jobId) {
            const apps = Array.isArray(job.applicants) ? [...job.applicants, user._id] : [user._id];
            return { ...job, applicants: apps };
          }
          return job;
        }));
      }
    } catch (err) {
      alert(err.message || 'Application failed.');
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border-b border-slate-200 dark:border-slate-850 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black">Corporate Prep Portal</h1>
          <p className="text-xs text-slate-450 mt-1">Access verified company guides, active placements, and review interview diary archives</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel: Company buttons list */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">Selected Guides</span>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
              {companies.map((comp, idx) => (
                <button
                  key={idx}
                  onClick={() => selectCompany(comp.companyName)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    selectedCompany === comp.companyName
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/15'
                      : 'bg-white/40 border-slate-205 dark:bg-slate-905/40 dark:bg-slate-900/40 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Building2 className="w-5 h-5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">{comp.companyName}</div>
                    <div className={`text-[9px] font-semibold mt-0.5 uppercase ${
                      comp.difficulty === 'Hard' ? 'text-red-400' :
                      comp.difficulty === 'Medium' ? 'text-yellow-450 dark:text-yellow-400' : 'text-green-500 dark:text-green-405'
                    }`}>
                      {comp.difficulty}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel: Detailed guide view */}
          <div className="lg:col-span-3">
            {detailsLoading ? (
              <div className="glass-card rounded-3xl p-16 flex items-center justify-center h-full min-h-[350px]">
                <Loader />
              </div>
            ) : companyDetails ? (
              <div className="space-y-8">
                {/* Header Profile card */}
                <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-3xl -z-10" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-black text-slate-805 dark:text-white">{companyDetails.companyName} Preparation Guide</h2>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] font-semibold text-slate-450 uppercase tracking-wider font-mono">
                        <span className={`px-2.5 py-0.5 font-bold rounded-lg border ${
                          companyDetails.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          companyDetails.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-505 dark:text-yellow-400 border-yellow-500/20' :
                          'bg-green-500/10 text-green-500 border-green-500/20'
                        }`}>
                          {companyDetails.difficulty} Difficulty
                        </span>
                        {companyDetails.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-400" /> {companyDetails.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">Key Skills Sought</h4>
                    <div className="flex flex-wrap gap-2">
                      {companyDetails.requiredSkills.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 text-xs rounded-xl bg-slate-100 dark:bg-slate-850 text-slate-650 dark:text-slate-300 border border-slate-200 dark:border-slate-700/40 font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Job opportunities list */}
                <div>
                  <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                    <Briefcase className="w-5 h-5 text-blue-400" /> Active Job Openings ({activeJobs.length})
                  </h3>

                  {activeJobs.length === 0 ? (
                    <div className="glass-card rounded-2xl p-6 text-center text-xs text-slate-500">
                      No active listings found for this company guide.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeJobs.map((job, idx) => (
                        <div key={idx} className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2">{job.title}</h4>
                            <p className="text-xs text-slate-550 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">{job.description}</p>
                            
                            <div className="space-y-1.5 mb-4 text-[10px] text-slate-500 font-medium">
                              <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}</div>
                              <div className="flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5 text-slate-400" /> {job.salary}</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-4 mt-2">
                            <span className="text-[9px] font-bold text-slate-500">
                              {job.applicants ? job.applicants.length : 0} Candidates Applied
                            </span>

                            {appliedJobs.has(job._id) ? (
                              <span className="text-[10px] font-bold text-green-500 dark:text-green-400 border border-green-500/20 bg-green-500/5 px-3 py-1.5 rounded-lg flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Applied
                              </span>
                            ) : (
                              <button
                                onClick={() => handleApplyJob(job._id)}
                                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors"
                              >
                                Apply Now
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Company FAQs / Q&A */}
                <div>
                  <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-slate-850 dark:text-white">
                    <HelpCircle className="w-5 h-5 text-indigo-400" /> Technical Interview FAQs
                  </h3>

                  {companyDetails.interviewQuestions.length === 0 ? (
                    <div className="glass-card rounded-2xl p-6 text-center text-xs text-slate-500">
                      No interview questions added to this company guide yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {companyDetails.interviewQuestions.map((item, idx) => (
                        <div key={idx} className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                              {item.category || 'Technical'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold">Q{idx + 1}</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white mb-3">"{item.question}"</h4>
                          <div className="p-3 bg-slate-100/50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-850">
                            <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Target Answer Framework:</div>
                            <p className="text-xs text-slate-650 dark:text-slate-400 leading-normal">{item.answer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interview experiences reviews */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left: post form */}
                  <div className="md:col-span-1 glass-card rounded-2xl p-5 h-fit">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider">Post Interview Experience</h3>

                    {formSuccess && (
                      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-[10px] text-green-400 rounded-xl">
                        {formSuccess}
                      </div>
                    )}

                    {formError && (
                      <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 rounded-xl">
                        {formError}
                      </div>
                    )}

                    <form onSubmit={handlePostExperience} className="space-y-4">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Interviewed Role</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. SDE-1 or React Developer"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-805 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Describe Your Experience</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Detail of the rounds, coding questions asked, behavior challenges..."
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-805 dark:text-white focus:outline-none resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        loading={submitting}
                        disabled={!role || !content}
                        className="w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" /> Share Diary
                      </Button>
                    </form>
                  </div>

                  {/* Right: reviews list */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-white mb-2 uppercase tracking-wider">Placement Diaries</h3>
                    {companyDetails.experiences.length === 0 ? (
                      <div className="glass-card rounded-2xl p-6 text-center text-xs text-slate-500">
                        No candidate diaries logged yet. Be the first to share!
                      </div>
                    ) : (
                      companyDetails.experiences.map((exp, idx) => (
                        <div key={idx} className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-850 flex items-center justify-center text-slate-500 dark:text-slate-400">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-800 dark:text-white">{exp.author}</div>
                              <div className="text-[10px] text-slate-500">
                                {exp.role} | {new Date(exp.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-light">{exp.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-16 text-center text-xs text-slate-500">
                No company selected. Choose a guide from the sidebar.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPrep;
