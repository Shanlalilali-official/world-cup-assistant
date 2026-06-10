const express = require('express');
const router = express.Router();
const youtubeService = require('../services/youtubeService');

// GET /api/videos — search World Cup videos
router.get('/', async (req, res, next) => {
  try {
    const query = req.query.q || 'FIFA World Cup 2026';
    const videos = await youtubeService.searchWorldCup(query);
    res.json({ videos, query });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
