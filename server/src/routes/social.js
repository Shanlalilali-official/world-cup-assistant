const express = require('express');
const router = express.Router();
const socialFetcher = require('../services/socialFetcher');
const socialPublisher = require('../services/socialPublisher');

// GET /api/social/tweets?hashtag=FIFAWorldCup
router.get('/tweets', async (req, res, next) => {
  try {
    const hashtag = req.query.hashtag || 'FIFAWorldCup';
    const tweets = await socialFetcher.getTweets(hashtag);
    res.json(tweets);
  } catch (err) {
    next(err);
  }
});

// GET /api/social/instagram?hashtag=FIFAWorldCup
router.get('/instagram', async (req, res, next) => {
  try {
    const hashtag = req.query.hashtag || 'FIFAWorldCup';
    const posts = await socialFetcher.getInstagramPosts(hashtag);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// POST /api/social/post-match — manually trigger a match result post
router.post('/post-match', async (req, res, next) => {
  try {
    const { match } = req.body;
    if (!match) {
      return res.status(400).json({ error: 'Match data required' });
    }
    const results = await socialPublisher.postMatchResult(match);
    res.json({ results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
