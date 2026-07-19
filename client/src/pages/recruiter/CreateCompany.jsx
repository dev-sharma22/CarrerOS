import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, Send, HelpCircle, CheckCircle2, AlertCircle, Trash } from 'lucide-react';
import { companyAPI } from '../../services/api';
import Button from '../../components/Button';

export const CreateCompany = () => {
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [logo, setLogo] = useState('briefcase');
  const [difficulty, setDifficulty] = useState('Medium');
  const [skillsInput, setSkillsInput] = useState('');

  // Active guides list
  const [companiesList, setCompaniesList] = useState([]);

  // Questions array state
  const [questions, setQuestions] = useState([]);
  const [qText, setQText] = useState('');
  const [qAnswer, setQAnswer] = useState('');
  const [qCategory, setQCategory] = useState('Technical');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const fetchActiveCompanies = async () => {
    try {
      const res = await companyAPI.list();
      if (res.success) {
        setCompaniesList(res.companies);
      }
    } catch (err) {
      console.error('Failed to load company guides:', err.message);
    }
  };

  useEffect(() => {
    fetchActiveCompanies();
  }, []);

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!qText.trim() || !qAnswer.trim()) return;

    setQuestions([...questions, {
      question: qText.trim(),
      answer: qAnswer.trim(),
      category: qCategory
    }]);

    setQText('');
    setQAnswer('');
    setQCategory('Technical');
  };

  const handleRemoveQuestion = (idxToRemove) => {
    setQuestions(questions.filter((_, idx) => idx !== idxToRemove));
  };

  const handleDeleteCompany = async (name) => {
    if (!window.confirm(`Are you sure you want to delete the company guide for "${name}"?`)) return;

    try {
      const res = await companyAPI.delete(name);
      if (res.success) {
        setSuccessMsg(`IT Company guide "${name}" deleted successfully.`);
        fetchActiveCompanies();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete company guide.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) {
      return setError('Company Name is required.');
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    const requiredSkills = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    try {
      const res = await companyAPI.create({
        companyName: companyName.trim(),
        logo,
        difficulty,
        location: location.trim(),
        requiredSkills,
        interviewQuestions: questions
      });

      if (res.success) {
        setSuccessMsg(`IT Company "${companyName}" added successfully to guides directory!`);
        setCompanyName('');
        setLocation('');
        setLogo('briefcase');
        setDifficulty('Medium');
        setSkillsInput('');
        setQuestions([]);
        fetchActiveCompanies();
      }
    } catch (err) {
      setError(err.message || 'Failed to onboard company guide.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <span className="text-xs font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block">Recruitment Directory</span>
          <h1 className="text-2xl sm:text-3xl font-black mt-0.5">Onboard IT Company Guide</h1>
          <p className="text-xs text-slate-400 mt-1">Publish a new employer profile, key skills sought, and target Q&A libraries to candidates.</p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Company Details Form (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-2">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Netflix, Meta or Wipro"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-2">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm text-inherit focus:outline-none"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Location */}
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-2">Company Location / Headquarters</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cupertino, CA or Bangalore, India"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Logo Indicator */}
                  <div>
                    <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-2">Logo Icon</label>
                    <select
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm text-inherit focus:outline-none"
                    >
                      <option value="briefcase">Briefcase</option>
                      <option value="building">Building</option>
                      <option value="globe">Globe</option>
                      <option value="monitor">Monitor</option>
                      <option value="award">Award</option>
                      <option value="chrome">Chrome</option>
                    </select>
                  </div>

                  {/* Required Skills */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-2">Required Skills (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. React.js, Python, SQL, System Design"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Submit All */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={!companyName.trim() || questions.length === 0}
                    className="w-full py-3.5 rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Building2 className="w-4 h-4" /> Onboard Company Guide ({questions.length} Q&As Added)
                  </Button>
                  {questions.length === 0 && (
                    <span className="text-[10px] text-red-400 text-center block mt-2">
                      Please add at least 1 interview question in the right panel before onboarding.
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Q&A Builder (Col 3) */}
          <div className="space-y-6">
            
            {/* Add Q&A Form */}
            <div className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold">Add Interview Question</h3>
              </div>

              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-455 uppercase mb-1.5">Question Category</label>
                  <select
                    value={qCategory}
                    onChange={(e) => setQCategory(e.target.value)}
                    className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-inherit focus:outline-none"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Coding">Coding</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-455 uppercase mb-1.5">Question Text</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Explain SQL vs NoSQL"
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-455 uppercase mb-1.5">Target Answer</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide details on key architectural metrics..."
                    value={qAnswer}
                    onChange={(e) => setQAnswer(e.target.value)}
                    className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!qText.trim() || !qAnswer.trim()}
                  className="w-full py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add to Onboarding List
                </Button>
              </form>
            </div>

            {/* Added Q&A list review */}
            <div className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Questions List ({questions.length})</h4>
              
              <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                {questions.length === 0 ? (
                  <p className="text-[10px] text-slate-500 italic text-center py-4">No questions added yet.</p>
                ) : (
                  questions.map((q, idx) => (
                    <div key={idx} className="p-3 bg-slate-100/30 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-850 rounded-xl flex items-start justify-between gap-3 relative group">
                      <div>
                        <div className="text-[8px] font-bold uppercase tracking-wider text-indigo-400 mb-1">{q.category}</div>
                        <h5 className="text-[11px] font-bold text-slate-855 dark:text-white leading-tight">"{q.question}"</h5>
                      </div>
                      <button
                        onClick={() => handleRemoveQuestion(idx)}
                        className="text-slate-450 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Bottom panel: Corporate guides manager */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold">Manage Onboarded IT Guides</h3>
            <p className="text-xs text-slate-400 mt-1">Review existing company profiles in directory database and remove outdated guides.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {companiesList.map((comp, idx) => (
              <div key={idx} className="p-4 bg-slate-900/10 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-850 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-slate-850 dark:text-white">{comp.companyName}</span>
                    <span className={`px-2 py-0.5 text-[8px] font-bold rounded-lg border uppercase ${
                      comp.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      comp.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                      'bg-green-500/10 text-green-400 border-green-500/20'
                    }`}>
                      {comp.difficulty}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {comp.requiredSkills.slice(0, 3).map((skill, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 text-[9px] rounded-lg bg-slate-800 text-slate-350 font-bold border border-slate-700/30">
                        {skill}
                      </span>
                    ))}
                    {comp.requiredSkills.length > 3 && (
                      <span className="text-[9px] text-slate-500 font-bold mt-0.5">+{comp.requiredSkills.length - 3}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteCompany(comp.companyName)}
                  className="w-full py-2 bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-500 hover:text-white text-rose-450 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash className="w-3.5 h-3.5" /> Remove Company Guide
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateCompany;
