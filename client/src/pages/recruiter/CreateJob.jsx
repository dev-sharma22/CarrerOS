import React, { useState } from 'react';
import { Briefcase, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { jobAPI } from '../../services/api';
import Button from '../../components/Button';

export const CreateJob = () => {
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('Remote');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [requirementsInput, setRequirementsInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !companyName || !description) {
      return setError('Title, companyName, and description fields are required.');
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    // Parse requirements comma-separated values
    const requirements = requirementsInput
      .split(',')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    try {
      const res = await jobAPI.create({
        title,
        companyName,
        location,
        salary,
        description,
        requirements
      });

      if (res.success) {
        setSuccessMsg('Job posting registered successfully.');
        setTitle('');
        setCompanyName('');
        setLocation('Remote');
        setSalary('');
        setDescription('');
        setRequirementsInput('');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit job posting. Verify connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black">Post a Job Opening</h1>
          <p className="text-xs text-slate-400 mt-1">Publish software engineering vacancies to placement candidates on TalentSphere</p>
        </div>

        {successMsg && (
          <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Job Title */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineer SDE-1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Company Guide Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google or Microsoft"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Job Location</label>
                <input
                  type="text"
                  placeholder="e.g. Remote, or Bangalore, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Salary package */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Salary Estimate</label>
                <input
                  type="text"
                  placeholder="e.g. ₹15,00,000 / annum"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Description details */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Job Description</label>
              <textarea
                required
                rows={5}
                placeholder="Explain the job description details, role deliverables, and SDE project outlines..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* Candidate requirements */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Requirements (Comma Separated)</label>
              <input
                type="text"
                placeholder="React.js, Node.js, DSA skills, C++"
                value={requirementsInput}
                onChange={(e) => setRequirementsInput(e.target.value)}
                className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Submit Trigger */}
            <Button type="submit" loading={loading} className="w-full py-3.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
              <Send className="w-4 h-4" /> Publish Job Opening
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
