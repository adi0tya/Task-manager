/**
 * Create a structured error with a status code
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @returns {Error}
 */
const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = { createError };
