import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, Code2, Terminal, Video, FileText, X, ArrowRight, Sparkles } from 'lucide-react';
import { PROBLEMS } from '../pages/student/dsaProblems';

const PLATFORM_TOOLS = [
  { name: 'AI Mock Interviews', path: '/student/mock-interview', icon: Video, category: 'Tool' },
  { name: 'Resume ATS Analyzer', path: '/student/resume-analyzer', icon: FileText, category: 'Tool' },
  { name: 'Code Sandbox Compiler', path: '/student/coding', icon: Terminal, category: 'Tool' },
  { name: 'DSA Progress Tracker', path: '/student/dsa-tracker', icon: Code2, category: 'Tool' },
  { name: 'Corporate Company Guides', path: '/student/company-prep', icon: Building2, category: 'Tool' }
];

const COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Stripe', 'Uber', 'Airbnb',
  'Snowflake', 'Databricks', 'Atlassian', 'Nvidia', 'Tesla', 'SpaceX', 'Palantir', 'Salesforce',
  'Adobe', 'Cisco', 'Oracle', 'Intel', 'TCS', 'Infosys', 'Accenture', 'Wipro'
];

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIdx(0);
    }
  }, [isOpen]);

  // Filter search items
  const filteredTools = PLATFORM_TOOLS.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));
  const filteredCompanies = COMPANIES.filter(c => c.toLowerCase().includes(query.toLowerCase())).map(c => ({
    name: `${c} Corporate Guide`,
    path: `/student/company-prep`,
    icon: Building2,
    category: 'Company'
  }));
  const filteredProblems = PROBLEMS.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8).map(p => ({
    name: `${p.name} (${p.difficulty})`,
    path: '/student/coding',
    icon: Code2,
    category: p.isSql ? 'SQL Query' : 'DSA Problem'
  }));

  const allResults = [...filteredTools, ...filteredCompanies, ...filteredProblems];

  const handleSelect = (item) => {
    if (item) {
      navigate(item.path);
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(prev => Math.min(prev + 1, allResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && allResults[selectedIdx]) {
      e.preventDefault();
      handleSelect(allResults[selectedIdx]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/70 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-2xl glass-card rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden bg-white/95 dark:bg-slate-950/95 flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search 25+ companies, 100+ problems, or platform tools..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0); }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-1 flex-1">
          {allResults.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No results found for "{query}". Try searching "Google", "Two Sum", or "AI Interview".
            </div>
          ) : (
            allResults.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIdx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIdx(idx)}
                  className={`flex items-center justify-between p-3 rounded-2xl text-xs font-semibold cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 border border-emerald-500/40 text-emerald-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {item.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-5 py-2.5 bg-slate-100/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">↵</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Esc</kbd> Close</span>
          </div>
          <span className="text-emerald-400 flex items-center gap-1 font-sans font-bold">
            <Sparkles className="w-3 h-3" /> CareerOS Search
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
