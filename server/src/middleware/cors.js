const config = require('../config');

const corsMiddleware = {
  origin(origin, callback) {
    // Allow requests with no origin (curl, server-to-server, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Check exact match against configured URLs
    if (config.clientUrls.includes(origin)) {
      callback(null, true);
      return;
    }

    // Also allow any subpath under configured GitHub Pages URLs
    // e.g. https://user.github.io matches https://user.github.io/repo/
    const matched = config.clientUrls.some(
      (url) => origin === url || origin.startsWith(url + '/')
    );
    if (matched) {
      callback(null, true);
      return;
    }

    console.warn(`[CORS] Blocked origin: ${origin}. Allowed: ${config.clientUrls.join(', ')}`);
    callback(null, false);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

module.exports = { corsMiddleware };
