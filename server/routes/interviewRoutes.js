import express from 'express';
import {
  startMockInterview,
  submitAnswer,
  getInterviewHistory,
  getInterviewById
} from '../controllers/interviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start', protect, authorize('student'), startMockInterview);
router.post('/:id/submit', protect, authorize('student'), submitAnswer);
router.get('/history', protect, authorize('student'), getInterviewHistory);
router.get('/:id', protect, getInterviewById);

export default router;
