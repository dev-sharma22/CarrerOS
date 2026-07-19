// API configuration
export const API_BASE_URL = window.location.origin.includes('5173') ? 'http://localhost:5000/api' : '/api';

// Platform roles
export const ROLES = {
  STUDENT: 'student',
  RECRUITER: 'recruiter',
  ADMIN: 'admin'
};

// DSA tracker topics list
export const DSA_TOPICS = [
  'Arrays',
  'Strings',
  'Linked List',
  'Stack',
  'Queue',
  'Trees',
  'Graph',
  'Dynamic Programming'
];

// Developer roles list for interview generator
export const INTERVIEW_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Java Developer'
];

// Difficulty levels list
export const DIFFICULTY_LEVELS = [
  'Easy',
  'Medium',
  'Hard'
];

// Experience levels list
export const EXPERIENCE_LEVELS = [
  'Entry-Level (0-1 yrs)',
  'Associate (1-3 yrs)',
  'Mid-Senior (3-5 yrs)'
];
