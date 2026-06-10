const express = require('express');
const router = express.Router();
const apiAggregator = require('../services/apiAggregator');

// GET /api/scores/live — currently in-progress matches
router.get('/live', async (req, res, next) => {
  try {
    const matches = await apiAggregator.getLiveScores();
    res.json({ matches: matches || [], count: matches?.length || 0 });
  } catch (err) {
    next(err);
  }
});

// GET /api/scores/today — all matches scheduled today
router.get('/today', async (req, res, next) => {
  try {
    const matches = await apiAggregator.getTodayMatches();
    res.json({ matches: matches || [], count: matches?.length || 0 });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
