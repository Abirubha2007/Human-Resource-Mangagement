// Centralized Error Handling Middleware
const errorMiddleware = (err, req, res, next) => {
  console.error('❌ Express Server Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: 'Operation failed',
    error: message
  });
};

module.exports = errorMiddleware;
