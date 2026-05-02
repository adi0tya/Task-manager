const { createError } = require('../utils/errorHelper');

/**
 * Restrict access to specific roles
 * Usage: roleMiddleware('admin') or roleMiddleware('admin', 'user')
 */
const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(createError(401, 'Authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        createError(403, `Access denied. Required role: ${roles.join(' or ')}.`)
      );
    }

    next();
  };
};

module.exports = roleMiddleware;
