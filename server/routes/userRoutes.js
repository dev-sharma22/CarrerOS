import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getStudentDashboardStats,
  adminGetUsers,
  adminDeleteUser,
  adminGetAnalytics,
  addUserNote,
  deleteUserNote,
  addUserBookmark,
  removeUserBookmark,
  getLeaderboard
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get('/dashboard', protect, authorize('student'), getStudentDashboardStats);
router.get('/leaderboard', protect, authorize('student'), getLeaderboard);

// Notes & Bookmarks Routes
router.post('/notes', protect, addUserNote);
router.delete('/notes/:id', protect, deleteUserNote);
router.post('/bookmarks', protect, addUserBookmark);
router.delete('/bookmarks/:id', protect, removeUserBookmark);

// Admin Routes
router.get('/admin/users', protect, authorize('admin'), adminGetUsers);
router.delete('/admin/users/:id', protect, authorize('admin'), adminDeleteUser);
router.get('/admin/analytics', protect, authorize('admin'), adminGetAnalytics);

export default router;
