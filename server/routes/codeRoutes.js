import express from 'express';
import { evaluateCodeSnippet } from '../controllers/codeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', protect, authorize('student'), evaluateCodeSnippet);

export default router;
