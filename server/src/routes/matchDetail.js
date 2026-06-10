const express = require('express');
const router = express.Router();
const bsdService = require('../services/bsdService');
const highlightlyService = require('../services/highlightlyService');
const youtubeService = require('../services/youtubeService');
const weatherService = require('../services/weatherService');

// GET /api/matches/:id/detail — full match detail with stats
router.get('/:id/detail', async (req, res, next) => {
  try {
    const { id } = req.params;
    const detail = await bsdService.getMatchDetail(id);
    if (!detail) {
      return res.status(404).json({ error: 'Match not found' });
    }
    res.json(detail);
  } catch (err) {
    next(err);
  }
});

// GET /api/matches/:id/timeline — match events timeline
router.get('/:id/timeline', async (req, res, next) => {
  try {
    const { id } = req.params;
    const timeline = await highlightlyService.getMatchTimeline(id);
    res.json({ matchId: id, events: timeline });
  } catch (err) {
    next(err);
  }
});

// GET /api/matches/:id/highlights — video highlights for a match
router.get('/:id/highlights', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { homeTeam, awayTeam } = req.query;
    const highlights = await youtubeService.searchHighlights(
      homeTeam || '',
      awayTeam || '',
      ''
    );
    res.json({ matchId: id, videos: highlights });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
