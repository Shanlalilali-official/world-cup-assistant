const config = require('../config');

const corsMiddleware = {
  origin(origin, callback) {
    // Allow requests with no origin (curl, server-to-server, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Allow any GitHub Pages domain (username.github.io)
    if (origin.includes('github.io')) {
      callback(null, true);
      return;
    }

    // Allow localhost for development
    if (origin.includes('localhost')) {
      callback(null, true);
      return;
    }

    // Check configured URLs as fallback
    if (config.clientUrls.includes(origin)) {
      callback(null, true);
      return;
    }

    console.warn(`[CORS] Blocked origin: ${origin}`);
    callback(null, false);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

module.exports = { corsMiddleware };
