import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import logger from './utils/logger.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import dsaRoutes from './routes/dsaRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import codeRoutes from './routes/codeRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io Real-Time Notifications setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

io.on('connection', (socket) => {
  logger.info(`Socket client connected: ${socket.id}`);

  socket.on('register_user', (userId) => {
    socket.join(userId);
    logger.info(`Socket client associated user to channel: ${userId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket client disconnected: ${socket.id}`);
  });
});

global.io = io; // Expose Socket globally

// Security & Rate Limiting Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Allows loading Monaco Editor scripts from CDN
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 300, // limit each IP to 300 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', apiLimiter);

app.use(cors({ origin: '*' }));

// Enforce 10mb JSON payload size limits for profile picture uploads & data structures
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Prevent NoSQL query injection attacks (stripping properties beginning with $)
const sanitizeNoSQL = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (key.startsWith('$')) {
        delete obj[key];
      } else {
        sanitizeNoSQL(obj[key]);
      }
    }
  }
};

// HTTP Parameter Pollution (HPP) Sanitization Middleware
app.use((req, res, next) => {
  sanitizeNoSQL(req.body);
  sanitizeNoSQL(req.query);
  sanitizeNoSQL(req.params);

  // Prevent HPP by picking first element if array parameter passed unexpectedly
  if (req.query) {
    for (const k in req.query) {
      if (Array.isArray(req.query[k])) {
        req.query[k] = req.query[k][0];
      }
    }
  }
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

// Health & Uptime Ping Endpoints
app.get('/ping', (req, res) => res.status(200).send('pong'));
app.get('/api/health', (req, res) => res.status(200).json({ success: true, status: 'operational', timestamp: new Date() }));

// Setup Static Folder for Resume uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/reviews', reviewRoutes);

// Serve frontend static files
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Catch-all route to serve the React SPA
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Static client assets not found. Please run "npm run build" in the client directory first.');
    }
  });
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`TalentSphere server booted on port ${PORT} (${global.isMongoConnected ? 'MongoDB Mode' : 'Memory Mode'})`);

  // Automatic Render Self-Ping Keep-Alive (Prevents Cloud Service Sleep)
  const renderUrl = process.env.RENDER_EXTERNAL_URL;
  if (renderUrl) {
    const TEN_MINUTES = 10 * 60 * 1000;
    setInterval(() => {
      fetch(`${renderUrl}/ping`)
        .then(() => logger.info(`Render Keep-Alive ping dispatched to ${renderUrl}/ping`))
        .catch((err) => logger.error(`Render Keep-Alive ping error: ${err.message}`));
    }, TEN_MINUTES);
  }
});
