const express = require('express');
const router = express.Router();
const bsdService = require('../services/bsdService');

// GET /api/predictions — ML match predictions
router.get('/', async (req, res, next) => {
  try {
    const predictions = await bsdService.getPredictions();
    res.json({ predictions, lastUpdated: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
