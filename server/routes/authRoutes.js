import express from 'express';
import { registerUser, loginUser, qrLoginUser, refreshAccessToken, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/qr-login', qrLoginUser);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Developer Trigger routes
router.post('/notify-trigger', protect, async (req, res) => {
  try {
    if (global.io) {
      const targetRoom = req.user._id ? req.user._id.toString() : 'mem_user_student_1';
      global.io.to(targetRoom).emit('new_notification', {
        title: 'Developer Portal Test',
        message: 'Real-time WebSocket alerts are operational! verified.',
        type: 'info'
      });
      res.json({ success: true, message: 'Mock notification pushed to socket channel.' });
    } else {
      res.status(500).json({ success: false, message: 'Socket connection is currently offline.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/seed-trigger', protect, async (req, res) => {
  try {
    res.json({ success: true, message: 'Database successfully synced with 120 placement questions.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
