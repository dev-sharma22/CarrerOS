# 🛠️ CareerOS - Tech Stack & Architecture Documentation

Official technical documentation detailing the architecture, technology stack, libraries, APIs, database models, security features, and cloud deployment setup for **CareerOS** (Commercial AI Placement & Career Operating System).

---

## 🏗️ Architectural Overview

CareerOS is built as a **Full-Stack Single-Page Application (SPA)** powered by a Node.js REST API with WebSockets for real-time notifications and real-time WebRTC media streaming for AI mock interviews.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Frontend (React + Vite)                          │
│  - TailwindCSS Glassmorphism UI   - Monaco Code Editor Sandbox              │
│  - WebRTC Video & Web Speech API   - Recharts Analytics                     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / WebSockets (Socket.io)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                           Backend (Node.js + Express)                       │
│  - JWT & 2FA Email OTP Auth        - Rate Limiting & HPP Security           │
│  - Gemini AI Engine (gemini-1.5)   - Nodemailer Gmail SMTP Service          │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Database Layer
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                  Hybrid Database Storage Layer (MongoDB / Memory)           │
│  - Mongoose ODM (MongoDB Atlas)    - In-Memory DB Fallback (memoryDb.js)    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 1. Frontend Technology Stack

| Component / Layer | Technology / Library | Purpose & Usage |
|---|---|---|
| **Core Framework** | **React 18** | UI component rendering, state management, and lifecycle hooks |
| **Build System** | **Vite 8** | High-performance HMR dev server and optimized production bundle builder |
| **Styling & Design System** | **TailwindCSS** | Utility-first CSS, custom dark mode, smooth gradients, glassmorphic cards |
| **Routing** | **React Router DOM v7** | Client-side routing, protected role routes (`student`, `recruiter`, `admin`) |
| **Code Editor Engine** | **`@monaco-editor/react`** | Embedded VS Code editor for JavaScript, Python, C++, Java, and SQL sandbox |
| **Real-Time Video & Mic** | **WebRTC & Web Audio API** | Live webcam streaming via `getUserMedia()` and real-time audio volume analyzer |
| **Voice Dictation** | **Web Speech API** | Hands-free speech-to-text dictation into answer fields |
| **Icons & Micro-Interactions** | **`lucide-react` & `framer-motion`** | Modern UI vector icons and smooth page/card entrance animations |
| **Analytics & Data Visualization** | **Recharts** | Quantitative placement analytics and DSA topic problem breakdown bar charts |
| **Digital QR Pass** | **Custom Client SVG & Canvas** | 0ms client-side SVG QR token generator with PNG image & SVG vector export |

---

## ⚙️ 2. Backend Technology Stack

| Component / Layer | Technology / Library | Purpose & Usage |
|---|---|---|
| **Runtime Environment** | **Node.js (ES Modules)** | Asynchronous non-blocking event-driven backend runtime |
| **Web Framework** | **Express.js** | Modular REST API routing, middleware pipeline, and static file serving |
| **Real-Time Notifications** | **Socket.io** | WebSocket engine for instant live candidate/recruiter notification broadcasts |
| **Authentication & Tokens** | **`jsonwebtoken` (JWT)** | Dual token architecture: 1-hour Access Tokens & 7-day Refresh Tokens |
| **Password Security** | **`bcryptjs`** | Salted password hashing (10 salt rounds) |
| **Email SMTP Service** | **Nodemailer** | Gmail SMTP dispatch for 2-Factor Login verification & Password Reset 6-digit OTPs |
| **Artificial Intelligence** | **`@google/generative-ai`** | Google Gemini 1.5 Flash API for ATS resume scoring, STAR interview evaluation, and Big-O code complexity diagnostics |
| **Security & Rate Limiting** | **`express-rate-limit`** | IP brute-force lockout protection (5-min lock after 5 failed logins) & DoS throttling |
| **Data Sanitization** | **Custom NoSQL & HPP Middleware** | Strips `$` operators to block NoSQL injection & sanitizes duplicate query params |

---

## 🗄️ 3. Database & Data Storage Layer

- **Primary Database**: **MongoDB Atlas** managed via **Mongoose ODM**.
- **Hybrid In-Memory Fallback (`memoryDb.js`)**: Built-in memory database that activates automatically if `MONGO_URI` is unconfigured, allowing 100% full feature execution offline or without database setups.
- **Key Schemas & Collections**:
  - `User`: Accounts (Student, Recruiter, Admin), hashed passwords, 2FA OTP tokens, skills, education, resume links, bookmarks.
  - `Job`: Vacancies, requirements, salary range, location, applied candidate IDs.
  - `Interview`: Mock session questions, candidate answers, score metrics (1-10), STAR framework evaluation.
  - `DSAProgress`: Solved algorithmic problem logs, topic breakdown, streak tracking.

---

## 🚀 4. DevOps, Deployment & Infrastructure

- **Cloud Platform**: **Render Web Service** (`render.yaml` zero-config 24/7 cloud hosting).
- **Static Asset Serving**: Express server automatically serves the compiled Vite client production bundle (`client/dist`).
- **24/7 Zero-Sleep Keep-Alive**: Automated server-side `setInterval` self-pinging loop (`/ping` endpoint every 10 mins) ensuring the Render cloud container never sleeps.
- **Version Control**: GitHub (**[https://github.com/dev-sharma22/CarrerOS](https://github.com/dev-sharma22/CarrerOS)**).

---

## 📜 Project Developer
- **Lead Architect**: **DEV** (*Dev Sharma*)
- **Degree**: B.Tech in Computer Science & Technology
- **Contact**: `Devmishraa22@gmail.com`
