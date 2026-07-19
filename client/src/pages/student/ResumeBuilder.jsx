import React, { useState } from 'react';
import { FileText, Sparkles, Printer, Download, Plus, Trash2, CheckCircle2, User, Briefcase, GraduationCap, Code2, Globe } from 'lucide-react';
import Button from '../../components/Button';

export const ResumeBuilder = () => {
  const [personal, setPersonal] = useState({
    name: 'Dev Mishra',
    email: 'devmishraa22@gmail.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/devmishra',
    github: 'github.com/devmishra',
    summary: 'Passionate Full-Stack Software Engineer with experience in React, Node.js, WebRTC, and distributed system architectures. Seeking SDE role at top tier tech enterprise.'
  });

  const [skills, setSkills] = useState([
    'JavaScript (ES6+)', 'TypeScript', 'React.js', 'Node.js', 'Express.js',
    'Python', 'C++', 'SQL (PostgreSQL)', 'MongoDB', 'Docker', 'WebRTC', 'TailwindCSS'
  ]);
  const [newSkill, setNewSkill] = useState('');

  const [experiences, setExperiences] = useState([
    {
      company: 'TechCorp Solutions',
      role: 'Full-Stack Software Engineering Intern',
      duration: 'Jun 2025 - Present',
      bullets: [
        'Built real-time video streaming microservices using WebRTC and Node.js serving 10,000+ active candidates.',
        'Optimized MongoDB query indices reducing latency by 45% across placement analytics dashboards.',
        'Integrated AI-assisted evaluation models using Gemini API to automate resume ATS diagnostics.'
      ]
    }
  ]);

  const [projects, setProjects] = useState([
    {
      title: 'CareerOS - Commercial Career Operating System',
      tech: 'React, Node.js, WebRTC, Monaco Editor, TailwindCSS',
      description: 'Built a comprehensive placement preparation portal with video mock interviewers, code compiler, and ATS analyzers.'
    }
  ]);

  const [education, setEducation] = useState([
    {
      institution: 'University of Technology',
      degree: 'B.S. in Computer Science & Engineering',
      year: '2022 - 2026',
      gpa: '3.9 / 4.0'
    }
  ]);

  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiSuccess, setAiSuccess] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAiEnhanceSummary = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setPersonal(prev => ({
        ...prev,
        summary: `Result-driven Full-Stack Software Engineer specializing in scalable web systems, WebRTC video streaming, and high-performance REST APIs. Proven track record building end-to-end applications with React, Node.js, and cloud databases.`
      }));
      setIsAiGenerating(false);
      setAiSuccess('AI enhanced your summary with impact keywords!');
      setTimeout(() => setAiSuccess(''), 3000);
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-emerald-500 uppercase tracking-widest">
              <FileText className="w-4 h-4" /> AI Resume Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-1 text-slate-800 dark:text-white">Professional Resume Builder</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Design, AI-enhance, and export ATS-optimized SDE resumes</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-2xl btn-gradient-saas font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Export PDF
            </button>
          </div>
        </div>

        {aiSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {aiSuccess}
          </div>
        )}

        {/* Workspace Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Form Builder Controls */}
          <div className="space-y-6">
            
            {/* Contact Details */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" /> Contact & Contact Info
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={personal.name}
                  onChange={e => setPersonal({ ...personal, name: e.target.value })}
                  className="bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={personal.email}
                  onChange={e => setPersonal({ ...personal, email: e.target.value })}
                  className="bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={personal.phone}
                  onChange={e => setPersonal({ ...personal, phone: e.target.value })}
                  className="bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={personal.location}
                  onChange={e => setPersonal({ ...personal, location: e.target.value })}
                  className="bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Professional Summary</label>
                  <button
                    type="button"
                    onClick={handleAiEnhanceSummary}
                    disabled={isAiGenerating}
                    className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 animate-pulse" /> {isAiGenerating ? 'Enhancing...' : 'AI Enhance'}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={personal.summary}
                  onChange={e => setPersonal({ ...personal, summary: e.target.value })}
                  className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Technical Skills */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" /> Technical Skills
              </h3>
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Next.js, Docker)"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  className="flex-1 bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <button type="submit" className="px-4 py-2 rounded-xl btn-gradient-saas text-xs font-bold shrink-0 cursor-pointer">
                  Add
                </button>
              </form>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    {s}
                    <button onClick={() => handleRemoveSkill(s)} className="text-slate-400 hover:text-red-400 cursor-pointer">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Live Printable A4 Resume Preview */}
          <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-2xl space-y-6 font-sans">
            
            {/* Header section */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-5 text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{personal.name || 'Your Name'}</h2>
              <div className="flex flex-wrap justify-center items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                <span>{personal.email}</span>
                <span>•</span>
                <span>{personal.phone}</span>
                <span>•</span>
                <span>{personal.location}</span>
              </div>
            </div>

            {/* Executive Summary */}
            {personal.summary && (
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-1.5 border-b border-slate-200 dark:border-slate-800 pb-1">Professional Summary</h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">{personal.summary}</p>
              </div>
            )}

            {/* Technical Skills Section */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-2 border-b border-slate-200 dark:border-slate-800 pb-1">Technical Skills</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                {skills.join(' • ')}
              </p>
            </div>

            {/* Work Experience */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-3 border-b border-slate-200 dark:border-slate-800 pb-1">Work Experience</h3>
              <div className="space-y-4">
                {experiences.map((exp, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-white">
                      <span>{exp.role} — <span className="text-emerald-500 dark:text-emerald-400">{exp.company}</span></span>
                      <span className="text-[10px] text-slate-500 font-mono">{exp.duration}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300">
                      {exp.bullets.map((b, bi) => (
                        <li key={bi} className="leading-normal">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-3 border-b border-slate-200 dark:border-slate-800 pb-1">Key Engineering Projects</h3>
              <div className="space-y-3">
                {projects.map((proj, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-white">
                      <span>{proj.title}</span>
                      <span className="text-[10px] text-emerald-500 font-mono">{proj.tech}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-normal">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-2 border-b border-slate-200 dark:border-slate-800 pb-1">Education</h3>
              {education.map((edu, i) => (
                <div key={i} className="flex justify-between items-center text-xs text-slate-800 dark:text-slate-200 font-medium">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{edu.institution}</span> — {edu.degree}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{edu.year} (GPA: {edu.gpa})</span>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ResumeBuilder;
