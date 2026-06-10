const express = require('express');
const router = express.Router();
const apiAggregator = require('../services/apiAggregator');

// GET /api/stats/top-scorers
router.get('/top-scorers', async (req, res, next) => {
  try {
    const scorers = await apiAggregator.getTopScorers();
    res.json({ scorers: scorers || [], lastUpdated: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
});

// GET /api/stats/player-ratings
router.get('/player-ratings', async (req, res, next) => {
  try {
    const ratings = await apiAggregator.getPlayerRatings();
    res.json({ ratings: ratings || [], lastUpdated: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
