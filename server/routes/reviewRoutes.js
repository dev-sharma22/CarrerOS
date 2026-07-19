import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Review from '../models/Review.js';
import { memoryDb } from '../utils/memoryDb.js';

const router = express.Router();

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const reviews = await Review.find().sort({ createdAt: -1 });
      res.json({ success: true, reviews });
    } else {
      const reviews = await memoryDb.listReviews();
      res.json({ success: true, reviews: [...reviews].reverse() });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Add a new review
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || !comment) {
    return res.status(400).json({ success: false, message: 'Rating and comment are required.' });
  }

  try {
    if (global.isMongoConnected) {
      const review = await Review.create({
        user: req.user._id,
        userName: req.user.name,
        rating: Number(rating),
        comment
      });
      res.status(201).json({ success: true, review });
    } else {
      const review = await memoryDb.createReview({
        user: req.user._id,
        userName: req.user.name,
        rating: Number(rating),
        comment
      });
      res.status(201).json({ success: true, review });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
