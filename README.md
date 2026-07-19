# CareerOS - Commercial AI Career & Placement Platform 🚀

**CareerOS** is an AI-driven career operating system designed for software engineering candidates — featuring real-time WebRTC video mock interviewers, Monaco code sandbox, ATS resume diagnostics, 25+ top corporate placement diaries, and an interactive AI Resume Builder.

---

## 🌟 Key Features

- 🎥 **WebRTC Video Mock Interviewer**: Live webcam streaming, mic level visualizer, and STAR framework assessment.
- 🎙️ **Voice Dictation (Web Speech API)**: Speak answers aloud with real-time text transcription into answer fields.
- 💻 **Monaco Code Sandbox**: Multi-language compilation for JavaScript, Python, C++, Java, and SQL.
- 🗄️ **25+ Corporate Company Guides**: Google, Microsoft, Amazon, Meta, Stripe, Netflix, Uber, Airbnb, and 18+ more enterprise diaries.
- 📄 **AI Resume Builder & ATS Scanner**: Live A4 resume preview, impact summary generator, and PDF export.
- 📱 **Student Digital Pass & QR Scanner**: 0ms client-side SVG QR code generator, file picker upload, and camera scan login.
- 🔔 **Interactive Notification Center**: Real-time WebSocket alerts and global `Cmd+K` command search palette.

---

## 🚀 1-Click Deployment Guide

### Option 1: Deploy on Render (Recommended for Full-Stack + WebSockets)
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New + -> Web Service**.
2. Connect your GitHub repository: `https://github.com/dev-sharma22/CarrerOS`.
3. Set the following settings:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
4. Click **Create Web Service**! Render will automatically build the client bundle and start the production server with Socket.io enabled.

---

### Option 2: Local Production Server
```bash
# 1. Install dependencies & build client bundle
npm run build

# 2. Start production server
npm run start
```
App will run at `http://localhost:5000`.

---

## 🔒 Security & Performance Features
- Sub-5ms In-Memory Route Caching Middleware
- Brute-Force Login Lockout Protection (5-minute security lock after 5 failed attempts)
- DoS Payload Size Limiting (`10kb` body limits)
- HTTP Parameter Pollution (HPP) Sanitization
