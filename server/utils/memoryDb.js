import bcrypt from 'bcryptjs';
import { googleQuestions, microsoftQuestions, amazonQuestions, tcsQuestions, infosysQuestions, accentureQuestions } from './companyQuestions.js';
import { EXPANDED_COMPANIES } from './expandedCompanies.js';

// Centralized In-Memory Database
const db = {
  users: [],
  resumes: [],
  interviews: [],
  dsaProgress: [],
  companies: [],
  jobs: [],
  reviews: []
};

// Seed initial memory database data
const seedMemoryDb = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = async (pwd) => await bcrypt.hash(pwd, salt);

  // 1. Users
  db.users = [
    {
      _id: 'mem_user_admin_1',
      name: 'System Administrator',
      email: 'admin@talentsphere.com',
      password: await hashPassword('adminpassword123'),
      role: 'admin',
      skills: [],
      education: [],
      resumeURL: '',
      createdAt: new Date()
    },
    {
      _id: 'mem_user_recruiter_1',
      name: 'Pooja Sharma (Google HR)',
      email: 'recruiter@talentsphere.com',
      password: await hashPassword('recruiterpassword123'),
      role: 'recruiter',
      skills: [],
      education: [],
      resumeURL: '',
      createdAt: new Date()
    },
    {
      _id: 'mem_user_student_1',
      name: 'Dev Mishra',
      email: 'student@talentsphere.com',
      password: await hashPassword('studentpassword123'),
      role: 'student',
      skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git'],
      education: [
        {
          _id: 'mem_edu_1',
          school: 'State Institute of Engineering',
          degree: 'Bachelor of Technology',
          fieldOfStudy: 'Computer Science and Engineering',
          startYear: '2023',
          endYear: '2027',
          grade: '9.2 CGPA'
        }
      ],
      resumeURL: '',
      createdAt: new Date()
    },
    {
      _id: 'mem_user_student_dev',
      name: 'Dev Mishra',
      email: 'devmishraa22@gmail.com',
      password: await hashPassword('studentpassword123'),
      role: 'student',
      skills: ['JavaScript', 'React', 'Node.js', 'WebRTC', 'SQL'],
      education: [
        {
          _id: 'mem_edu_dev',
          school: 'State Institute of Engineering',
          degree: 'Bachelor of Technology',
          fieldOfStudy: 'Computer Science and Engineering',
          startYear: '2023',
          endYear: '2027',
          grade: '9.5 CGPA'
        }
      ],
      resumeURL: '',
      createdAt: new Date()
    }
  ];

  // 2. Companies
  db.companies = EXPANDED_COMPANIES;

  // 3. Jobs
  db.jobs = [
    {
      _id: 'mem_job_1',
      title: 'Frontend Software Development Engineer (SDE-1)',
      companyName: 'Google',
      location: 'Bangalore, India (Hybrid)',
      salary: '₹18,000,000 - ₹24,000,000 / year',
      description: 'Looking for a passionate React engineer with strong data structures & WebRTC knowledge.',
      requirements: ['JavaScript (ES6+)', 'React.js', 'HTML/CSS', 'Data Structures & Algorithms'],
      applicants: [
        {
          _id: 'mem_user_student_1',
          name: 'Dev Mishra',
          email: 'student@talentsphere.com',
          skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git'],
          resumeURL: ''
        }
      ],
      postedBy: 'mem_user_recruiter_1',
      createdAt: new Date()
    },
    {
      _id: 'mem_job_2',
      title: 'Backend Systems Engineer - Node.js & Distributed Systems',
      companyName: 'Microsoft',
      location: 'Hyderabad, India (On-site)',
      salary: '₹20,000,000 - ₹28,000,000 / year',
      description: 'Join the Azure Cloud Core team building microservices and high-throughput databases.',
      requirements: ['Node.js', 'Express', 'MongoDB', 'System Design', 'SQL'],
      applicants: [],
      postedBy: 'mem_user_recruiter_1',
      createdAt: new Date()
    }
  ];

  // 4. Sample Interviews
  db.interviews = [
    {
      _id: 'mem_int_1',
      user: 'mem_user_student_1',
      role: 'Software Development Engineer (SDE)',
      experienceLevel: 'Entry-Level / Fresher (0-2 Yrs)',
      difficulty: 'Medium',
      questions: [
        'Explain how Virtual DOM works in React and how reconciliation optimizes DOM rendering.',
        'Implement an algorithm to detect a cycle in a Directed Graph using DFS.'
      ],
      answers: [
        'Virtual DOM is a lightweight JS representation of real DOM. React compares Virtual DOM trees using diffing algorithm and updates only changed nodes.',
        'We can use 3 colors (White, Gray, Black) or recursion stack tracking to detect cycles during DFS traversal.'
      ],
      feedback: [
        {
          question: 'Explain how Virtual DOM works in React...',
          answer: 'Virtual DOM is a lightweight JS representation...',
          score: 9,
          comments: 'Excellent explanation of diffing algorithm and batch reconciliation!'
        },
        {
          question: 'Implement an algorithm to detect a cycle in a Directed Graph...',
          answer: 'We can use 3 colors...',
          score: 8.5,
          comments: 'Great graph traversal logic. Mentioning space complexity O(V) would make it perfect.'
        }
      ],
      score: 8.8,
      overallFeedback: 'Outstanding technical performance! Strong grasp of React internals and graph theory algorithms.',
      completed: true,
      createdAt: new Date(Date.now() - 86400000)
    }
  ];

  // 5. DSA Progress
  db.dsaProgress = [
    {
      user: 'mem_user_student_1',
      topic: 'Arrays',
      problemId: 'two-sum',
      completedAt: new Date()
    },
    {
      user: 'mem_user_student_1',
      topic: 'Strings',
      problemId: 'valid-anagram',
      completedAt: new Date()
    }
  ];

  // 6. Reviews
  db.reviews = [
    {
      _id: 'mem_rev_1',
      user: {
        _id: 'mem_user_student_1',
        name: 'Dev Mishra'
      },
      rating: 5,
      comment: 'CareerOS helped me clear technical screening rounds at Google! The WebRTC video simulator and SQL compiler are game changers.',
      createdAt: new Date()
    }
  ];
};

seedMemoryDb();

// Memory Database Data Access Helpers
export const memoryDb = {
  // User Operations
  findUserByEmail: async (email) => {
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  findUserById: async (id) => {
    return db.users.find(u => u._id.toString() === id.toString());
  },
  createUser: async (userData) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newUser = {
      _id: `mem_user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'student',
      skills: [],
      education: [],
      resumeURL: '',
      qrCodeToken: `CAREEROS_QR_PASS_mem_user_${Date.now()}`,
      createdAt: new Date()
    };
    db.users.push(newUser);
    return newUser;
  },
  updateUserById: async (id, updateData) => {
    const index = db.users.findIndex(u => u._id.toString() === id.toString());
    if (index !== -1) {
      db.users[index] = { ...db.users[index], ...updateData };
      return db.users[index];
    }
    return null;
  },
  deleteUserById: async (id) => {
    const index = db.users.findIndex(u => u._id.toString() === id.toString());
    if (index !== -1) {
      db.users.splice(index, 1);
      return true;
    }
    return false;
  },
  getUsersList: async () => db.users,

  // Company Operations
  getCompanies: async () => db.companies,
  getCompaniesList: async () => db.companies,
  getCompanyByName: async (name) => db.companies.find(c => (c.name || c.companyName || '').toLowerCase() === name.toLowerCase()),
  findCompanyByName: async (name) => db.companies.find(c => (c.name || c.companyName || '').toLowerCase() === name.toLowerCase()),
  createCompany: async (companyData) => {
    const newCompany = { _id: `mem_comp_${Date.now()}`, ...companyData };
    db.companies.push(newCompany);
    return newCompany;
  },
  deleteCompanyByName: async (name) => {
    const idx = db.companies.findIndex(c => (c.name || c.companyName || '').toLowerCase() === name.toLowerCase());
    if (idx !== -1) {
      db.companies.splice(idx, 1);
      return true;
    }
    return false;
  },
  addExperienceToCompany: async (companyName, experienceData) => {
    const comp = db.companies.find(c => (c.name || c.companyName || '').toLowerCase() === companyName.toLowerCase());
    if (comp) {
      if (!comp.userExperiences) comp.userExperiences = [];
      comp.userExperiences.push(experienceData);
      return comp;
    }
    return null;
  },

  // Job Operations
  getJobs: async (searchQuery = '') => {
    if (!searchQuery) return db.jobs;
    const q = searchQuery.toLowerCase();
    return db.jobs.filter(j => j.title.toLowerCase().includes(q) || j.companyName.toLowerCase().includes(q) || j.location.toLowerCase().includes(q));
  },
  getJobsList: async () => db.jobs,
  getJobById: async (id) => db.jobs.find(j => j._id.toString() === id.toString()),
  getJobsByRecruiter: async (recruiterId) => db.jobs.filter(j => j.postedBy.toString() === recruiterId.toString()),
  createJob: async (jobData) => {
    const newJob = { _id: `mem_job_${Date.now()}`, applicants: [], createdAt: new Date(), ...jobData };
    db.jobs.push(newJob);
    return newJob;
  },
  applyToJob: async (jobId, applicantUser) => {
    const job = db.jobs.find(j => j._id.toString() === jobId.toString());
    if (job) {
      const alreadyApplied = job.applicants.some(a => a._id.toString() === applicantUser._id.toString());
      if (!alreadyApplied) {
        job.applicants.push({
          _id: applicantUser._id,
          name: applicantUser.name,
          email: applicantUser.email,
          skills: applicantUser.skills || [],
          education: applicantUser.education || [],
          resumeURL: applicantUser.resumeURL || ''
        });
      }
      return job;
    }
    return null;
  },
  deleteJobById: async (id) => {
    const idx = db.jobs.findIndex(j => j._id.toString() === id.toString());
    if (idx !== -1) {
      db.jobs.splice(idx, 1);
      return true;
    }
    return false;
  },

  // Interview Operations
  createInterview: async (interviewData) => {
    const newInterview = { _id: `mem_int_${Date.now()}`, createdAt: new Date(), ...interviewData };
    db.interviews.push(newInterview);
    return newInterview;
  },
  getInterviewById: async (id) => db.interviews.find(i => i._id.toString() === id.toString()),
  getInterviewsByUser: async (userId) => db.interviews.filter(i => (i.user || i.userId || '').toString() === userId.toString()),
  findInterviewsByUserId: async (userId) => db.interviews.filter(i => (i.user || i.userId || '').toString() === userId.toString()),
  updateInterviewById: async (id, updateData) => {
    const idx = db.interviews.findIndex(i => i._id.toString() === id.toString());
    if (idx !== -1) {
      db.interviews[idx] = { ...db.interviews[idx], ...updateData };
      return db.interviews[idx];
    }
    return null;
  },

  // DSA Operations
  getDsaProgressByUser: async (userId) => db.dsaProgress.filter(d => (d.user || d.userId || '').toString() === userId.toString()),
  findDsaProgressByUserId: async (userId) => db.dsaProgress.filter(d => (d.user || d.userId || '').toString() === userId.toString()),
  saveDsaSolve: async (userId, topic, problemId) => {
    const existing = db.dsaProgress.find(d => (d.user || d.userId || '').toString() === userId.toString() && d.topic === topic && d.problemId === problemId);
    if (!existing) {
      const newSolve = { user: userId, topic, problemId, completedAt: new Date() };
      db.dsaProgress.push(newSolve);
      return newSolve;
    }
    return existing;
  },
  deleteDsaSolve: async (userId, topic, problemId) => {
    const idx = db.dsaProgress.findIndex(d => (d.user || d.userId || '').toString() === userId.toString() && d.topic === topic && d.problemId === problemId);
    if (idx !== -1) {
      db.dsaProgress.splice(idx, 1);
      return true;
    }
    return false;
  },

  // Resume Operations
  findResumeByUserId: async (userId) => db.resumes.find(r => (r.userId || r.user || '').toString() === userId.toString()),
  getResumesByUser: async (userId) => db.resumes.filter(r => (r.userId || r.user || '').toString() === userId.toString()),
  saveResume: async (userId, resumeData) => {
    const existingIdx = db.resumes.findIndex(r => (r.userId || r.user || '').toString() === userId.toString());
    if (existingIdx !== -1) {
      db.resumes[existingIdx] = { ...db.resumes[existingIdx], ...resumeData };
      return db.resumes[existingIdx];
    } else {
      const newResume = { _id: `mem_res_${Date.now()}`, userId, ...resumeData, createdAt: new Date() };
      db.resumes.push(newResume);
      return newResume;
    }
  },

  // Review Operations
  getReviews: async () => db.reviews,
  createReview: async (reviewData) => {
    const newRev = { _id: `mem_rev_${Date.now()}`, createdAt: new Date(), ...reviewData };
    db.reviews.push(newRev);
    return newRev;
  },
  db
};
