import React from 'react';
import { Calendar, Layers, Terminal, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const InterviewCard = ({ interview }) => {
  if (!interview) return null;

  const {
    _id,
    role,
    difficulty,
    experienceLevel,
    score = 0,
    date,
    questions = [],
    answers = []
  } = interview;

  // Formatted Date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const getScoreColor = (sc) => {
    if (sc >= 8) return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (sc >= 6) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  const answeredCount = answers.filter(ans => (ans || '').trim() !== '').length;
  const isCompleted = answeredCount === questions.length;

  return (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-4 mb-3">
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {difficulty}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {formattedDate}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-800 dark:text-white line-clamp-1 mb-1">{role}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" /> {experienceLevel}
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mb-4">
          <span className="flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" /> {questions.length} questions
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span>{isCompleted ? 'Completed' : `${answeredCount}/${questions.length} answered`}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mt-2">
        <div className={`px-3 py-1 rounded-xl text-sm font-bold border ${getScoreColor(score)}`}>
          Score: {isCompleted ? `${score}/10` : 'In Progress'}
        </div>

        <Link
          to={`/student/mock-interview/${_id}`}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center"
        >
          <ArrowUpRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default InterviewCard;
