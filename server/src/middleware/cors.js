const config = require('../config');

const corsMiddleware = {
  origin(origin, callback) {
    if (!origin || config.clientUrls.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

module.exports = { corsMiddleware };
