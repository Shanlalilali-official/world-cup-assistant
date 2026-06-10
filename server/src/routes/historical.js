const express = require('express');
const router = express.Router();
const historicalService = require('../services/historicalService');

// GET /api/historical/winners — all World Cup winners
router.get('/winners', (req, res) => {
  const winners = historicalService.getWinners();
  res.json({ winners, total: winners.length });
});

// GET /api/historical/records — all-time World Cup records
router.get('/records', (req, res) => {
  const records = historicalService.getRecords();
  res.json(records);
});

// GET /api/historical/trivia — fun facts
router.get('/trivia', (req, res) => {
  const trivia = historicalService.getTrivia();
  res.json({ facts: trivia });
});

// GET /api/historical/:countryCode — country-specific history
router.get('/:countryCode', (req, res) => {
  const { countryCode } = req.params;
  const history = historicalService.getCountryHistory(countryCode);
  res.json(history);
});

module.exports = router;
