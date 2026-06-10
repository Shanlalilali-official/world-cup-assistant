const config = require('../config');
const cacheService = require('./cacheService');

/**
 * Social media content fetcher
 * Fetches World Cup-related posts from X (Twitter) and Instagram
 *
 * Free-tier limitations:
 * - X API v2 free: read-only, 100 req/month for search
 * - If API keys are not configured, falls back to returning embed instructions
 */
const socialFetcher = {
  /**
   * Fetch World Cup-related tweets
   * Uses X API v2 search when configured, otherwise returns embed info
   */
  async getTweets(hashtag = 'FIFAWorldCup') {
    const cacheKey = cacheService.key('tweets', hashtag);
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    if (!config.social.twitter.enabled) {
      return this.getTwitterFallback(hashtag);
    }

    try {
      const { TwitterApi } = require('twitter-api-v2');
      const client = new TwitterApi({
        appKey: config.social.twitter.appKey,
        appSecret: config.social.twitter.appSecret,
        accessToken: config.social.twitter.accessToken,
        accessSecret: config.social.twitter.accessSecret,
      });

      const result = await client.v2.search(`#${hashtag} -is:retweet`, {
        max_results: 20,
        'tweet.fields': ['created_at', 'author_id', 'public_metrics'],
        'user.fields': ['name', 'username', 'profile_image_url'],
        expansions: ['author_id'],
      });

      const tweets = this.normalizeTweets(result);
      cacheService.set(cacheKey, tweets, 'socialFeed');
      return tweets;
    } catch (err) {
      console.warn('[Social] X API error:', err.message);
      return this.getTwitterFallback(hashtag);
    }
  },

  /**
   * Get Instagram posts for World Cup hashtags
   * Instagram Graph API requires Facebook App review for hashtag search
   * In practice, free users get embed fallback
   */
  async getInstagramPosts(hashtag = 'FIFAWorldCup') {
    const cacheKey = cacheService.key('instagram', hashtag);
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    // Instagram hashtag search requires a verified business account
    // Return embed fallback for free tier
    const fallback = {
      source: 'instagram-embed',
      embedUrl: `https://www.instagram.com/explore/tags/${hashtag}/`,
      posts: [],
      note: 'Instagram embed widget available in frontend',
    };

    cacheService.set(cacheKey, fallback, 'socialFeed');
    return fallback;
  },

  /**
   * Fallback when X API is not configured — returns instructions for embedded timeline
   */
  getTwitterFallback(hashtag) {
    return {
      source: 'twitter-embed',
      embedHtml: `<a class="twitter-timeline" href="https://twitter.com/hashtag/${hashtag}" data-theme="dark" data-height="600">#${hashtag} Tweets</a>`,
      posts: [],
      note: 'X API not configured — using embedded timeline. Set TWITTER_API_KEY to enable API search.',
    };
  },

  normalizeTweets(result) {
    const users = {};
    if (result.includes?.users) {
      result.includes.users.forEach((u) => {
        users[u.id] = u;
      });
    }

    return {
      source: 'twitter-api',
      posts: (result.data || []).map((t) => ({
        id: t.id,
        text: t.text,
        createdAt: t.created_at,
        author: users[t.author_id]
          ? {
              name: users[t.author_id].name,
              username: users[t.author_id].username,
              avatar: users[t.author_id].profile_image_url,
            }
          : { name: 'Unknown', username: '', avatar: '' },
        metrics: t.public_metrics || {},
      })),
    };
  },
};

module.exports = socialFetcher;
