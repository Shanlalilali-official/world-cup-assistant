const errorHandler = (err, req, res, _next) => {
  console.error(`[Error] ${err.message}`, err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: true,
    message: statusCode === 500 ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
