import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

import connectDB from '../server/config/db.js';
import logger from '../server/utils/logger.js';
import { notFound, errorHandler } from '../server/middleware/errorMiddleware.js';

// Route Imports
import authRoutes from '../server/routes/authRoutes.js';
import userRoutes from '../server/routes/userRoutes.js';
import resumeRoutes from '../server/routes/resumeRoutes.js';
import interviewRoutes from '../server/routes/interviewRoutes.js';
import dsaRoutes from '../server/routes/dsaRoutes.js';
import companyRoutes from '../server/routes/companyRoutes.js';
import jobRoutes from '../server/routes/jobRoutes.js';
import codeRoutes from '../server/routes/codeRoutes.js';
import reviewRoutes from '../server/routes/reviewRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

app.use(notFound);
app.use(errorHandler);

export default app;
