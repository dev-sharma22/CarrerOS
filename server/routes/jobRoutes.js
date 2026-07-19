import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  applyForJob,
  getRecruiterJobs,
  deleteJob,
  notifyCandidate
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('recruiter'), createJob)
  .get(getJobs);

router.get('/recruiter', protect, authorize('recruiter'), getRecruiterJobs);

router.route('/:id')
  .get(getJobById)
  .delete(protect, deleteJob);

router.post('/:id/apply', protect, authorize('student'), applyForJob);
router.post('/:id/applicants/:candidateId/notify', protect, authorize('recruiter'), notifyCandidate);

export default router;
