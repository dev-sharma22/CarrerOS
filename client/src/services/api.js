import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach token if logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('talentsphere_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error messages
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Server error occurred. Please try again.';
    console.error('API Error Response:', message);
    return Promise.reject(new Error(message));
  }
);

// ----------------------------------------------------
// API ENDPOINTS HANDLERS
// ----------------------------------------------------

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  verifyLoginOtp: (data) => api.post('/auth/verify-login-otp', data),
  register: (data) => api.post('/auth/register', data),
  qrLogin: (qrToken) => api.post('/auth/qr-login', { qrToken }),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getDashboardStats: () => api.get('/users/dashboard'),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  
  // Notes
  addNote: (data) => api.post('/users/notes', data),
  deleteNote: (id) => api.delete(`/users/notes/${id}`),
  
  // Bookmarks
  addBookmark: (itemId) => api.post('/users/bookmarks', { itemId }),
  deleteBookmark: (id) => api.delete(`/users/bookmarks/${id}`),

  // Dev Triggers
  triggerNotify: () => api.post('/auth/notify-trigger'),
  triggerSeed: () => api.post('/auth/seed-trigger'),
  getLeaderboard: () => api.get('/users/leaderboard')
};

export const resumeAPI = {
  analyze: (formData) => api.post('/resume/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getAnalysis: () => api.get('/resume/analysis')
};

export const interviewAPI = {
  start: (data) => api.post('/interviews/start', data),
  submit: (id, questionIndex, answer) => api.post(`/interviews/${id}/submit`, { questionIndex, answer }),
  getHistory: () => api.get('/interviews/history'),
  getById: (id) => api.get(`/interviews/${id}`)
};

export const dsaAPI = {
  getProgress: () => api.get('/dsa/progress'),
  solve: (data) => api.post('/dsa/solve', data),
  delete: (topic, problemId) => api.delete('/dsa/solve', { data: { topic, problemId } })
};

export const companyAPI = {
  list: () => api.get('/companies'),
  getDetails: (name) => api.get(`/companies/${name}`),
  addExperience: (name, data) => api.post(`/companies/${name}/experience`, data),
  create: (data) => api.post('/companies', data),
  delete: (name) => api.delete(`/companies/${name}`)
};

export const jobAPI = {
  list: (search = '') => api.get(`/jobs${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  create: (data) => api.post('/jobs', data),
  getById: (id) => api.get(`/jobs/${id}`),
  apply: (id) => api.post(`/jobs/${id}/apply`),
  getRecruiterJobs: () => api.get('/jobs/recruiter'),
  delete: (id) => api.delete(`/jobs/${id}`),
  notifyCandidate: (jobId, candidateId, title, desc, type) => api.post(`/jobs/${jobId}/applicants/${candidateId}/notify`, { title, desc, type })
};

export const adminAPI = {
  getUsers: () => api.get('/users/admin/users'),
  deleteUser: (id) => api.delete(`/users/admin/users/${id}`),
  getAnalytics: () => api.get('/users/admin/analytics')
};

export const codeAPI = {
  analyze: (data) => api.post('/code/analyze', data)
};

export const reviewAPI = {
  list: () => api.get('/reviews'),
  create: (data) => api.post('/reviews', data)
};

export default api;
