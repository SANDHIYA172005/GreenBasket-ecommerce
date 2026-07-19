/**
 * Centralized error-handling middleware.
 * Catches any error thrown or passed via next(err) and returns a structured JSON response.
 */
function errorHandler(err, _req, res, _next) {
  console.error('❌ Server Error:', err.message || err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
}

module.exports = errorHandler;
