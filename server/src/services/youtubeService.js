const axios = require('axios');
const cacheService = require('./cacheService');

/**
 * YouTube Data API v3 — free tier (10,000 units/day)
 * Used to search for World Cup match highlights and related videos
 *
 * Get API key at: https://console.cloud.google.com/apis/credentials
 */
const youtubeService = {
  client: axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3',
    timeout: 8000,
  }),

  apiKey: process.env.YOUTUBE_API_KEY || '',

  isEnabled() {
    return !!this.apiKey;
  },

  /**
   * Search for World Cup match highlights
   */
  async searchHighlights(team1, team2, matchDate) {
    const cacheKey = cacheService.key('youtube', `${team1}-${team2}`);
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    if (!this.isEnabled()) {
      return this.getFallbackHighlights(team1, team2);
    }

    try {
      const query = `${team1} ${team2} World Cup 2026 highlights`;
      const { data } = await this.client.get('/search', {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: 5,
          key: this.apiKey,
          order: 'relevance',
          videoEmbeddable: true,
        },
      });

      const videos = (data.items || []).map((item) => ({
        id: item.id?.videoId,
        title: item.snippet?.title,
        description: item.snippet?.description?.substring(0, 200),
        thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
        channelTitle: item.snippet?.channelTitle,
        publishedAt: item.snippet?.publishedAt,
        embedUrl: `https://www.youtube.com/embed/${item.id?.videoId}`,
      }));

      cacheService.set(cacheKey, videos, 'socialFeed');
      return videos;
    } catch (err) {
      console.warn('[YouTube] Search failed:', err.message);
      return this.getFallbackHighlights(team1, team2);
    }
  },

  /**
   * Search general World Cup content
   */
  async searchWorldCup(query = 'FIFA World Cup 2026') {
    const cacheKey = cacheService.key('youtube', query);
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    if (!this.isEnabled()) return [];

    try {
      const { data } = await this.client.get('/search', {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: 10,
          key: this.apiKey,
          order: 'date',
          videoEmbeddable: true,
        },
      });

      const videos = (data.items || []).map((item) => ({
        id: item.id?.videoId,
        title: item.snippet?.title,
        thumbnail: item.snippet?.thumbnails?.medium?.url,
        channelTitle: item.snippet?.channelTitle,
        publishedAt: item.snippet?.publishedAt,
        embedUrl: `https://www.youtube.com/embed/${item.id?.videoId}`,
      }));

      cacheService.set(cacheKey, videos, 'socialFeed');
      return videos;
    } catch {
      return [];
    }
  },

  /**
   * Fallback: curated official FIFA YouTube channel links
   */
  getFallbackHighlights(team1, team2) {
    return [
      {
        id: 'fifa-official',
        title: `FIFA World Cup 2026 Official Highlights`,
        description: 'Visit the official FIFA YouTube channel for match highlights.',
        thumbnail: '',
        channelTitle: 'FIFA',
        embedUrl: 'https://www.youtube.com/embed/videoseries?list=PLCGIzmTE4d0hvpHIwI6FJWQJMGul4CWJk',
        isFallback: true,
      },
    ];
  },
};

module.exports = youtubeService;
