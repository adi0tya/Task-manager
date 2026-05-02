const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createError } = require('../utils/errorHelper');

/**
 * Verify JWT token and attach user to request
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createError(401, 'Access denied. No token provided.'));
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(createError(401, 'Token expired. Please log in again.'));
      }
      return next(createError(401, 'Invalid token.'));
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(createError(401, 'User no longer exists.'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
