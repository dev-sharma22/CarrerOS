import express from 'express';
import { getDSAProgress, solveProblem, deleteProblem } from '../controllers/dsaController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/progress', protect, authorize('student'), getDSAProgress);
router.post('/solve', protect, authorize('student'), solveProblem);
router.delete('/solve', protect, authorize('student'), deleteProblem);

export default router;
