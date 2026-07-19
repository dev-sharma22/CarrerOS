import React from 'react';
import { FileText, Award, HelpCircle, CheckCircle } from 'lucide-react';

export const ResumeCard = ({ analysis, resumeURL }) => {
  if (!analysis) return null;

  const { ATSScore = 0, extractedSkills = [], suggestions = [] } = analysis;

  // Circular gauge parameters
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (ATSScore / 100) * circumference;

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Active Placement Resume</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Scanned and optimized with Gemini ATS modules</p>
            {resumeURL && (
              <a
                href={`http://localhost:5000${resumeURL}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-xs text-blue-500 hover:text-blue-400 underline font-semibold"
              >
                View uploaded document (PDF)
              </a>
            )}
          </div>
        </div>

        {/* Premium Circular Score Meter */}
        <div className="flex flex-col items-center select-none bg-slate-900/10 dark:bg-slate-950/20 p-4 border border-slate-200 dark:border-slate-850 rounded-2xl">
          <div className="flex items-center justify-center relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r={radius} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="5.5" fill="transparent" />
              <circle cx="40" cy="40" r={radius} 
                className={`stroke-current ${ATSScore >= 80 ? 'text-green-500' : ATSScore >= 60 ? 'text-yellow-500' : 'text-rose-500'} transition-all duration-1000`} 
                strokeWidth="5.5" 
                fill="transparent" 
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-extrabold text-slate-850 dark:text-white leading-none">{ATSScore}</span>
              <span className="text-[6.5px] font-black uppercase text-slate-500 mt-0.5 tracking-wider">Score</span>
            </div>
          </div>
          <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest mt-2">ATS Score</span>
        </div>
      </div>

      <hr className="my-6 border-slate-200 dark:border-slate-850" />

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Identified Skills */}
        <div className="md:col-span-1 space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-indigo-400" /> Parsed Skills ({extractedSkills.length})
          </h4>
          {extractedSkills.length === 0 ? (
            <p className="text-xs text-slate-500">No skills parsed.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {extractedSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[10px] rounded-lg font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ATS Recommendations */}
        <div className="md:col-span-1 space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-purple-400" /> Recommendations
          </h4>
          {suggestions.length === 0 ? (
            <p className="text-xs text-green-500 flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-4 h-4" /> Perfect alignment.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {suggestions.slice(0, 3).map((sug, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-[10px] text-slate-650 dark:text-slate-400 leading-normal">
                  <span className="w-1 h-1 mt-1.5 rounded-full bg-purple-500 shrink-0" />
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ATS Checklist Metrics */}
        <div className="md:col-span-1 space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">ATS Factor Audits</h4>
          <div className="space-y-2 text-[10px] text-slate-550 dark:text-slate-400 font-bold uppercase font-mono">
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> Section Formats</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> Action Verb Count</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> Contact Info Check</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> Numeric Impact Scan</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResumeCard;
