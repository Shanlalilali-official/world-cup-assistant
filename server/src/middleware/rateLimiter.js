const rateLimit = require('express-rate-limit');

const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests',
    message: 'Please try again later.',
  },
});

module.exports = { globalRateLimiter };
