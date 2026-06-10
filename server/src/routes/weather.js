const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');

// GET /api/weather — weather for all host cities
router.get('/', async (req, res, next) => {
  try {
    const weather = await weatherService.getAllVenueWeather();
    res.json({ venues: weather, lastUpdated: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
});

// GET /api/weather/:city — weather for a specific host city
router.get('/:city', async (req, res, next) => {
  try {
    const { city } = req.params;
    const weather = await weatherService.getCityWeather(city);
    res.json(weather);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
