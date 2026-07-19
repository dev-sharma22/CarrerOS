import express from 'express';
import { uploadAndAnalyzeResume, getResumeAnalysis } from '../controllers/resumeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/analyze', protect, authorize('student'), upload.single('resume'), uploadAndAnalyzeResume);
router.get('/analysis', protect, authorize('student'), getResumeAnalysis);

export default router;
