const express = require('express');
const router = express.Router();
const injuryService = require('../services/injuryService');

// GET /api/injuries — all current injuries
router.get('/', async (req, res, next) => {
  try {
    const injuries = await injuryService.getInjuries();
    res.json(injuries);
  } catch (err) {
    next(err);
  }
});

// GET /api/injuries/:teamCode — team-specific injuries
router.get('/:teamCode', async (req, res, next) => {
  try {
    const { teamCode } = req.params;
    const injuries = await injuryService.getTeamInjuries(teamCode.toUpperCase());
    res.json({ team: teamCode.toUpperCase(), injuries, count: injuries.length });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
