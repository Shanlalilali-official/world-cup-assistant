const express = require('express');
const router = express.Router();
const cacheService = require('../services/cacheService');

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cache: cacheService.getStats(),
  });
});

module.exports = router;
