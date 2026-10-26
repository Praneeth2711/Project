const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hostelhub_super_secret_jwt_key_2026');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Student role required.',
  });
};

const isOwner = (req, res, next) => {
  if (req.user && req.user.role === 'owner') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Hostel Owner role required.',
  });
};

module.exports = {
  verifyToken,
  isStudent,
  isOwner,
};
