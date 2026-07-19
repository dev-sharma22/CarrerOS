# TalentSphere - AI-Powered Interview Preparation Platform

TalentSphere is a full-stack production-ready software placement engine built on the MERN stack. The platform empowers students to prepare for software engineering placements using customized mock interview simulations, resume ATS screen optimization, coding tracker dashboards, and corporate guide diaries.

The application has been unified to run on a single port—where the Express backend server dynamically resolves REST APIs and serves the compiled React client SPA.

---

## 🚀 Key Features

### 👨‍🎓 Student Workspace
- **Gemini AI Mock Interviews**: Interactive, role-based coding and technical terminal simulations with immediate score parameters and STAR-framework reviews.
- **ATS Resume Analyzer**: PDF parser calculating ATS match scores, extracting professional skills, and outputting formatting recommendations.
- **DSA Progress Tracker**: Check off algorithms across 8 structures (including Trees, Graph, and Dynamic Programming) with flame-streak tracking.
- **Corporate Prep Guides**: Consult verified placement guides, interview questions, and placement review diaries for companies like Google, Microsoft, and Amazon.
- **Placements & Vacancies**: Browse recruiter job vacancies and apply directly with synced candidate profiles.

### 💼 Recruiter Workspace
- **Job Creation forms**: Publish new software engineer role descriptions, locations, salary brackets, and criteria.
- **Candidate Screening**: Screener dashboards showing candidate lists, CGPA, graduation years, and resume PDF downloads.

### 🛡️ Admin Portal
- **Metrics Panel**: High-level platform statistics tracking user registrations, jobs, average interview ratings, and Gemini API health.
- **Moderation Table**: Audit registered accounts and revoke access permissions.

---

## 🛠️ Technology Stack Blueprints

- **Frontend Core**: React.js (Vite), Tailwind CSS v4, React Router DOM, Axios, Context API.
- **Analytics Visualization**: Recharts (dynamic DSA bar charts, user pie graphs).
- **Backend Services**: Node.js, Express.js, JWT Auth with Role-Based Access Control (RBAC), Multer.
- **Database Engine**: MongoDB + Mongoose (with automated memory-fallback drivers).
- **AI Integrations**: Google Gemini AI API (`@google/generative-ai` SDK) with robust rule-based local simulation fail-safes.

---

## 🔑 Demo & Test Logins

To quickly review the workspaces without creating new accounts, use these seeded credentials:

| Account Type | Email Address | Password | Workspace |
| :--- | :--- | :--- | :--- |
| **Placement Student** | `student@talentsphere.com` | `studentpassword123` | Student Dashboard & Simulators |
| **Recruiter / Partner** | `recruiter@talentsphere.com` | `recruiterpassword123` | Recruiter Dashboard & Job manager |
| **System Administrator** | `admin@talentsphere.com` | `adminpassword123` | Moderation & Site Analytics |

---

## 📥 Setup & Running Locally

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** running locally (if MongoDB is not detected, the app automatically runs in temporary **Memory Mode** where all operations execute in-memory).

### 2. Seeding the Database
Before booting the server, run the seed script inside the `server/` directory to load default profiles and company guides:
```bash
cd server
npm install
npm run seed
```

### 3. Running the Unified Web App
From the `server/` directory, boot up the backend:
```bash
npm run start
```
The server will boot on port `5000` (e.g. `http://localhost:5000`). Since the frontend client bundle has been compiled and merged, navigating to **`http://localhost:5000`** in your browser loads the full functional website!

### 4. Running Client and Server Independently (Development Mode)
If you wish to make changes with hot-reloading:
- **Server**: Run `npm run dev` in `server/` (runs on port `5000`).
- **Client**: In a separate terminal, navigate to `client/` and run `npm run dev` (runs on port `5173`). The Axios API base path will automatically adapt to route cross-port requests.
