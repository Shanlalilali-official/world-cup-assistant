const express = require('express');
const router = express.Router();
const apiAggregator = require('../services/apiAggregator');

// GET /api/schedule?date=2026-06-11 — matches by date
router.get('/', async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const matches = await apiAggregator.getMatchesByDate(date);
    res.json({ date, matches: matches || [], count: matches?.length || 0 });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
