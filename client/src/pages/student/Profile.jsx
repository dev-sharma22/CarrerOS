import React, { useState, useRef } from 'react';
import { User, Award, BookOpen, Plus, Trash2, CheckCircle2, Camera, Upload } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/Button';
import StudentQRCode from '../../components/StudentQRCode';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const isRecruiter = user?.role === 'recruiter';
  const avatarInputRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || localStorage.getItem('talentsphere_user_avatar') || '');
  const [skills, setSkills] = useState(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [education, setEducation] = useState(user?.education || []);

  // Education Form state
  const [school, setSchool] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [grade, setGrade] = useState('');

  // Socials state
  const [github, setGithub] = useState(user?.socialLinks?.github || '');
  const [linkedin, setLinkedin] = useState(user?.socialLinks?.linkedin || '');
  const [leetcode, setLeetcode] = useState(user?.socialLinks?.leetcode || '');
  const [codeforces, setCodeforces] = useState(user?.socialLinks?.codeforces || '');
  const [portfolio, setPortfolio] = useState(user?.socialLinks?.portfolio || '');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!school || !degree) return;

    const newEdu = {
      school,
      degree,
      fieldOfStudy,
      startYear,
      endYear,
      grade
    };

    setEducation([...education, newEdu]);

    // Clear form
    setSchool('');
    setDegree('');
    setFieldOfStudy('');
    setStartYear('');
    setEndYear('');
    setGrade('');
  };

  const handleRemoveEducation = (indexToRemove) => {
    setEducation(education.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const payload = isRecruiter ? { name } : {
        name,
        skills,
        education,
        socialLinks: {
          github,
          linkedin,
          leetcode,
          codeforces,
          portfolio
        }
      };

      const res = await updateProfile(payload);
      if (res.success) {
        setMessage('Profile updated successfully.');
      }
    } catch (err) {
      setError(err.message || 'Failed to save profile configurations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black">Profile Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Configure your personal account details and credentials</p>
        </div>

        {message && (
          <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400">
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left panel: Info */}
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-6 text-center space-y-3 relative group">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const dataUrl = ev.target?.result;
                      if (dataUrl) {
                        setAvatar(dataUrl);
                        localStorage.setItem('talentsphere_user_avatar', dataUrl);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              <div className="relative w-24 h-24 mx-auto">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile Avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <User className="w-12 h-12" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-emerald-500 text-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
                  title="Upload profile picture from files or gallery"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-800 dark:text-white">{name || 'User'}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{email}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                  {user?.role} Account
                </span>
              </div>
            </div>

            {/* Student Unique QR Pass */}
            {user?.role === 'student' && (
              <StudentQRCode
                qrToken={user?.qrToken || `CAREEROS_QR_PASS_${user?._id || 'student_1'}`}
                userName={name}
                userEmail={email}
              />
            )}

            {/* Save trigger */}
            <Button onClick={handleSaveProfile} loading={loading} className="w-full py-3 rounded-xl">
              Save Profile Changes
            </Button>
          </div>

          {/* Right panel: Forms */}
          <div className="md:col-span-2 space-y-6">
            {/* General Info */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" /> Account Settings
              </h3>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-855 rounded-xl py-3 px-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {!isRecruiter && (
              <>
                {/* Social & Algorithmic Links */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" /> Social & Coding Profiles
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">GitHub Profile Link</label>
                      <input
                        type="url"
                        placeholder="https://github.com/your-profile"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">LinkedIn Profile Link</label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/your-profile"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">LeetCode Username or Link</label>
                      <input
                        type="text"
                        placeholder="https://leetcode.com/your-username"
                        value={leetcode}
                        onChange={(e) => setLeetcode(e.target.value)}
                        className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Codeforces Handle</label>
                      <input
                        type="text"
                        placeholder="your-codeforces-handle"
                        value={codeforces}
                        onChange={(e) => setCodeforces(e.target.value)}
                        className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Portfolio or Personal Link</label>
                      <input
                        type="url"
                        placeholder="https://your-portfolio.me"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-400" /> Professional Skills
                  </h3>
                  <form onSubmit={handleAddSkill} className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="e.g. React.js, Python, AWS"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="flex-grow bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl py-2.5 px-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="submit"
                      className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-2">
                    {skills.length === 0 ? (
                      <p className="text-xs text-slate-500">No skills logged yet. Type one above to start listing.</p>
                    ) : (
                      skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-indigo-400/60 hover:text-red-400 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Education */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-400" /> Academic Credentials
                  </h3>

                  <div className="space-y-4 mb-6">
                    {education.length === 0 ? (
                      <p className="text-xs text-slate-500">No universities or degrees logged yet.</p>
                    ) : (
                      education.map((edu, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start justify-between gap-4"
                        >
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white">{edu.school}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              Class of {edu.endYear || 'N/A'} {edu.grade ? `| Grade: ${edu.grade}` : ''}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveEducation(idx)}
                            className="p-2 text-slate-550 hover:text-red-400 hover:bg-slate-800/40 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleAddEducation} className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Add Graduation Criteria</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">School / University</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Stanford University"
                          value={school}
                          onChange={(e) => setSchool(e.target.value)}
                          className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Degree</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Bachelor of Science"
                          value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                          className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Field of Study</label>
                        <input
                          type="text"
                          placeholder="e.g. Computer Science"
                          value={fieldOfStudy}
                          onChange={(e) => setFieldOfStudy(e.target.value)}
                          className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Grade / CGPA</label>
                        <input
                          type="text"
                          placeholder="e.g. 3.9 GPA or 9.5 CGPA"
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                          className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Start Year</label>
                        <input
                          type="text"
                          placeholder="e.g. 2023"
                          value={startYear}
                          onChange={(e) => setStartYear(e.target.value)}
                          className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">End Year (Graduation)</label>
                        <input
                          type="text"
                          placeholder="e.g. 2027"
                          value={endYear}
                          onChange={(e) => setEndYear(e.target.value)}
                          className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-250 text-xs font-bold rounded-xl transition-all border border-slate-700/30 cursor-pointer"
                    >
                      Log Degree entry
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
