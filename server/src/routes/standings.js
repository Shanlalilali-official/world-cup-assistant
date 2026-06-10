const express = require('express');
const router = express.Router();
const apiAggregator = require('../services/apiAggregator');

// GET /api/standings — group stage standings
router.get('/', async (req, res, next) => {
  try {
    const standings = await apiAggregator.getStandings();
    res.json({ standings: standings || [], lastUpdated: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
