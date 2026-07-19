import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { memoryDb } from '../utils/memoryDb.js';

// @desc    Protect routes - Verify JWT Token
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'talentsphere_secure_jwt_token_secret_99881122');

      // Fetch user based on active database mode
      if (global.isMongoConnected) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const memoryUser = await memoryDb.findUserById(decoded.id);
        if (memoryUser) {
          const { password, ...userWithoutPassword } = memoryUser;
          req.user = userWithoutPassword;
        }
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Authentication Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// @desc    Authorize specific user roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource`
      });
    }
    next();
  };
};
