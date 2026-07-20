import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { memoryDb } from '../utils/memoryDb.js';
import { sendPasswordResetEmail, sendLoginOtpEmail } from '../services/emailService.js';

// Access token expires in 1 hour
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'talentsphere_secure_jwt_token_secret_99881122', {
    expiresIn: '1h'
  });
};

// Refresh token expires in 7 days
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'talentsphere_secure_refresh_token_secret_88776655', {
    expiresIn: '7d'
  });
};

// Helper for generating unique QR Code identity token
const generateQrToken = (userId) => `CAREEROS_QR_PASS_${userId}`;

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    let emailExists;
    if (global.isMongoConnected) {
      emailExists = await User.findOne({ email: normalizedEmail });
    } else {
      emailExists = await memoryDb.findUserByEmail(normalizedEmail);
    }

    if (emailExists) {
      return res.status(400).json({ success: false, message: 'Account already exists with this email address.' });
    }

    let user;
    if (global.isMongoConnected) {
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: role || 'student'
      });
    } else {
      user = await memoryDb.createUser({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: role || 'student'
      });
    }

    const finalAccessToken = generateAccessToken(user._id);
    const finalRefreshToken = generateRefreshToken(user._id);
    const qrToken = generateQrToken(user._id);

    // Save final refresh token and QR token using findByIdAndUpdate to prevent double-hashing password
    if (global.isMongoConnected) {
      await User.findByIdAndUpdate(user._id, {
        refreshToken: finalRefreshToken,
        qrCodeToken: qrToken
      });
    } else {
      await memoryDb.updateUserById(user._id, { refreshToken: finalRefreshToken, qrCodeToken: qrToken });
    }

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      qrToken,
      token: finalAccessToken,
      refreshToken: finalRefreshToken
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// In-Memory Brute Force Lockout Tracker
const failedAttemptsMap = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// @desc    Authenticate user & get tokens
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const clientKey = `${req.ip}_${normalizedEmail}`;
  const attemptInfo = failedAttemptsMap.get(clientKey) || { count: 0, lockUntil: 0 };

  // Check if locked out
  if (attemptInfo.lockUntil > Date.now()) {
    const remainingSeconds = Math.ceil((attemptInfo.lockUntil - Date.now()) / 1000);
    return res.status(429).json({
      success: false,
      message: `Security Lockout: Account locked due to multiple failed login attempts. Try again in ${remainingSeconds} seconds.`
    });
  }

  try {
    let user;
    let isMatch = false;

    if (global.isMongoConnected) {
      user = await User.findOne({ email: normalizedEmail });
      if (user) {
        isMatch = await user.comparePassword(password);
      }
    } else {
      user = await memoryDb.findUserByEmail(normalizedEmail);
      if (user) {
        isMatch = await bcrypt.compare(password, user.password);
      }
    }

    if (user && isMatch) {
      // Clear failed attempts on success
      failedAttemptsMap.delete(clientKey);

      // Generate 6-digit Login OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      if (global.isMongoConnected) {
        user.loginOTP = otp;
        user.loginOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();
      } else {
        await memoryDb.saveLoginOtp(normalizedEmail, otp);
      }

      // Dispatch 2FA OTP Email to target recipient's specific Gmail address
      await sendLoginOtpEmail(normalizedEmail, otp);

      return res.json({
        success: true,
        otpRequired: true,
        email: user.email,
        message: `Credentials verified. 6-Digit Login OTP dispatched to ${user.email}`,
        otpPreview: otp
      });
    } else {
      // Increment failed attempt counter
      attemptInfo.count += 1;
      if (attemptInfo.count >= MAX_FAILED_ATTEMPTS) {
        attemptInfo.lockUntil = Date.now() + LOCKOUT_DURATION_MS;
      }
      failedAttemptsMap.set(clientKey, attemptInfo);

      res.status(401).json({
        success: false,
        message: attemptInfo.count >= MAX_FAILED_ATTEMPTS
          ? `Too many failed attempts. Account temporarily locked for 5 minutes.`
          : `Invalid email or password. (${MAX_FAILED_ATTEMPTS - attemptInfo.count} attempts remaining)`
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify 6-digit Login OTP and complete Sign-In
// @route   POST /api/auth/verify-login-otp
// @access  Public
export const verifyLoginOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Please provide email and 6-digit OTP code' });
  }

  try {
    let user;
    if (global.isMongoConnected) {
      user = await User.findOne({
        email,
        loginOTP: otp,
        loginOTPExpires: { $gt: Date.now() }
      });

      if (user) {
        user.loginOTP = '';
        user.loginOTPExpires = null;
        await user.save();
      }
    } else {
      user = await memoryDb.verifyLoginOtp(email, otp);
    }

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired 6-digit OTP code. Please try again.' });
    }

    const finalAccessToken = generateAccessToken(user._id);
    const finalRefreshToken = generateRefreshToken(user._id);
    const qrToken = generateQrToken(user._id);

    if (global.isMongoConnected) {
      user.refreshToken = finalRefreshToken;
      user.qrCodeToken = qrToken;
      await user.save();
    } else {
      await memoryDb.updateUserById(user._id, { refreshToken: finalRefreshToken, qrCodeToken: qrToken });
    }

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      qrToken,
      token: finalAccessToken,
      refreshToken: finalRefreshToken
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user using scanned QR Code token
// @route   POST /api/auth/qr-login
// @access  Public
export const qrLoginUser = async (req, res) => {
  const { qrToken } = req.body;

  if (!qrToken) {
    return res.status(400).json({ success: false, message: 'QR Code Token is required for scanning.' });
  }

  try {
    // Extract userId from QR token: CAREEROS_QR_PASS_<userId>
    let userId = qrToken.replace('CAREEROS_QR_PASS_', '');

    let user;
    if (global.isMongoConnected) {
      user = await User.findById(userId);
    } else {
      user = await memoryDb.findUserById(userId);
      // Fallback: search by qrCodeToken
      if (!user) {
        user = (await memoryDb.getUsersList()).find(u => u.qrCodeToken === qrToken);
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Unrecognized CareerOS Student QR Pass.' });
    }

    const finalAccessToken = generateAccessToken(user._id);
    const finalRefreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      qrToken: `CAREEROS_QR_PASS_${user._id}`,
      token: finalAccessToken,
      refreshToken: finalRefreshToken
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'QR Authentication failed: ' + error.message });
  }
};

// @desc    Refresh access token using refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ success: false, message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'talentsphere_secure_refresh_token_secret_88776655');
    
    let user;
    if (global.isMongoConnected) {
      user = await User.findById(decoded.id);
    } else {
      user = await memoryDb.findUserById(decoded.id);
    }

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user._id);
    res.json({
      success: true,
      token: newAccessToken
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Refresh token expired or invalid' });
  }
};

// @desc    Request Password Reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide registered email address' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    let user;
    if (global.isMongoConnected) {
      user = await User.findOne({ email: normalizedEmail });
    } else {
      user = await memoryDb.findUserByEmail(normalizedEmail);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account registered with this email address.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (global.isMongoConnected) {
      user.resetPasswordOTP = otp;
      user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();
    } else {
      await memoryDb.saveResetOtp(normalizedEmail, otp);
    }

    // Dispatch Password Reset OTP Email to target recipient's specific Gmail address
    await sendPasswordResetEmail(normalizedEmail, otp);

    res.status(200).json({
      success: true,
      message: `Password reset OTP code dispatched to ${normalizedEmail}.`,
      otpPreview: otp // Preview OTP for instant verification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: 'Please fill in all fields (email, OTP, new password)' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
  }

  try {
    let success = false;

    if (global.isMongoConnected) {
      const user = await User.findOne({
        email,
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (user) {
        user.password = newPassword; // Pre-save hook will hash it
        user.resetPasswordOTP = '';
        user.resetPasswordExpires = null;
        await user.save();
        success = true;
      }
    } else {
      success = await memoryDb.resetPasswordWithOtp(email, otp, newPassword);
    }

    if (!success) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code. Please request a new OTP.' });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now sign in with your new password.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
