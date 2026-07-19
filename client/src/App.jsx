import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import ResumeAnalyzer from './pages/student/ResumeAnalyzer';
import ResumeBuilder from './pages/student/ResumeBuilder';
import AIInterview from './pages/student/AIInterview';
import DSATracker from './pages/student/DSATracker';
import CompanyPrep from './pages/student/CompanyPrep';
import InterviewHistory from './pages/student/InterviewHistory';
import CodeWorkspace from './pages/student/CodeWorkspace';
import StudentSupport from './pages/student/Support';
import StudentLeaderboard from './pages/student/Leaderboard';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import CreateJob from './pages/recruiter/CreateJob';
import CreateCompany from './pages/recruiter/CreateCompany';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserModeration from './pages/admin/UserModeration';

// Workspace Layout component (combines Navbar + Sidebar + Outlet page content)
const WorkspaceLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-transparent text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <div className="flex flex-col md:flex-row flex-grow">
        <Sidebar />
        <main className="flex-grow overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// General Site Layout component for public landing/login pages (only Navbar)
const SiteLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-transparent text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes with Navbar only */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected STUDENT routes inside Sidebar Workspace */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<WorkspaceLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/student/resume-analyzer" element={<ResumeAnalyzer />} />
              <Route path="/student/resume-builder" element={<ResumeBuilder />} />
              <Route path="/student/mock-interview" element={<AIInterview />} />
              <Route path="/student/mock-interview/:id" element={<AIInterview />} />
              <Route path="/student/dsa-tracker" element={<DSATracker />} />
              <Route path="/student/company-prep" element={<CompanyPrep />} />
              <Route path="/student/history" element={<InterviewHistory />} />
              <Route path="/student/coding" element={<CodeWorkspace />} />
              <Route path="/student/support" element={<StudentSupport />} />
              <Route path="/student/leaderboard" element={<StudentLeaderboard />} />
            </Route>
          </Route>

          {/* Protected RECRUITER routes inside Sidebar Workspace */}
          <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
            <Route element={<WorkspaceLayout />}>
              <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
              <Route path="/recruiter/create-job" element={<CreateJob />} />
              <Route path="/recruiter/create-company" element={<CreateCompany />} />
              <Route path="/recruiter/profile" element={<StudentProfile />} />
            </Route>
          </Route>

          {/* Protected ADMIN routes inside Sidebar Workspace */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<WorkspaceLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserModeration />} />
            </Route>
          </Route>

          {/* Route redirect fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
