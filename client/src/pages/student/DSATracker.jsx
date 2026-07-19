import React, { useEffect, useState } from 'react';
import { Flame, CheckCircle, Plus, Trash2, Award, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { dsaAPI } from '../../services/api';
import { DSA_TOPICS, DIFFICULTY_LEVELS } from '../../utils/constants';
import Loader from '../../components/Loader';
import Button from '../../components/Button';

export const DSATracker = () => {
  const [data, setData] = useState({ progress: [], streak: 0, totalSolved: 0 });
  const [loading, setLoading] = useState(true);
  const [expandedTopic, setExpandedTopic] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form input states
  const [problemName, setProblemName] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [error, setError] = useState('');

  const fetchProgress = async () => {
    try {
      const res = await dsaAPI.getProgress();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load DSA progress records:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleToggleExpand = (topic) => {
    setExpandedTopic(expandedTopic === topic ? '' : topic);
    setProblemName('');
    setError('');
  };

  const handleSolveSubmit = async (e, topic) => {
    e.preventDefault();
    if (!problemName.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await dsaAPI.solve({ topic, problemName, difficulty });
      if (res.success) {
        // Refresh local data
        await fetchProgress();
        setProblemName('');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit solved problem.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProblem = async (topic, problemId) => {
    if (!window.confirm('Are you sure you want to remove this solved problem record?')) return;
    try {
      const res = await dsaAPI.delete(topic, problemId);
      if (res.success) {
        await fetchProgress();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete problem log.');
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header with Streak */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">DSA Progress Tracker</h1>
            <p className="text-xs text-slate-400 mt-1">Log solved LeetCode and placement questions to increase your scoring</p>
          </div>

          <div className="flex gap-4">
            {/* Total Solved */}
            <div className="px-5 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Solved</span>
              <span className="text-2xl font-black text-blue-400 mt-0.5">{data.totalSolved}</span>
            </div>

            {/* Streak flame */}
            <div className="px-5 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-3 text-orange-400 shadow-lg shadow-orange-500/5">
              <Flame className="w-8 h-8 fill-current animate-bounce" />
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Daily Streak</div>
                <div className="text-xl font-black">{data.streak} Day{data.streak !== 1 && 's'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 8 Categories layout */}
        <div className="space-y-4">
          {DSA_TOPICS.map((topic, index) => {
            const progressRecord = data.progress.find(p => p.topic === topic);
            const solvedProblems = progressRecord ? progressRecord.solvedProblems : [];
            const progressPercent = progressRecord ? progressRecord.progress : 0;
            const isExpanded = expandedTopic === topic;

            return (
              <div
                key={index}
                className={`glass-card rounded-2xl border transition-all duration-300 ${
                  isExpanded ? 'border-blue-500/40 bg-slate-900/40 shadow-lg shadow-blue-500/5' : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header panel */}
                <div
                  onClick={() => handleToggleExpand(topic)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex-grow">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-bold text-white">{topic}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-450 border border-blue-500/20">
                        {solvedProblems.length} Solved
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3 mt-3 max-w-md">
                      <div className="w-full bg-slate-800 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 shrink-0">{progressPercent}%</span>
                    </div>
                  </div>

                  <div className="text-slate-500">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-200 dark:border-slate-800 p-5 space-y-6">
                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-semibold text-red-400">
                        {error}
                      </div>
                    )}

                    {/* Log solved form */}
                    <form onSubmit={(e) => handleSolveSubmit(e, topic)} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Problem Name / Link</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 3Sum closest or Leetcode 15"
                          value={problemName}
                          onChange={(e) => setProblemName(e.target.value)}
                          className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Difficulty</label>
                        <select
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                          className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
                        >
                          {DIFFICULTY_LEVELS.map((diff, idx) => (
                            <option key={idx} value={diff}>{diff}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-3">
                        <Button
                          type="submit"
                          loading={submitting}
                          disabled={!problemName.trim()}
                          className="w-full py-2.5 rounded-xl text-xs font-bold"
                        >
                          Log as Solved
                        </Button>
                      </div>
                    </form>

                    {/* List of solved questions */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Solved Problems Log</h4>
                      {solvedProblems.length === 0 ? (
                        <p className="text-xs text-slate-500 py-3">No problems logged under this category yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 gap-2">
                          {solvedProblems.map((prob, idx) => {
                            const dateStr = new Date(prob.solvedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            });

                            const getBadgeColor = (diff) => {
                              if (diff === 'Easy') return 'bg-green-500/10 text-green-400 border-green-500/20';
                              if (diff === 'Medium') return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
                              return 'bg-red-500/10 text-red-400 border-red-500/20';
                            };

                            return (
                              <div
                                key={idx}
                                className="p-3 bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-4"
                              >
                                <div className="flex items-center gap-3">
                                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                  <div>
                                    <span className="text-xs font-bold text-white line-clamp-1">{prob.name}</span>
                                    <span className="text-[9px] text-slate-500 flex items-center gap-1 mt-0.5">
                                      <Calendar className="w-3 h-3" /> Solved on {dateStr}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded border ${getBadgeColor(prob.difficulty)}`}>
                                    {prob.difficulty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProblem(topic, prob._id)}
                                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800/40 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DSATracker;
