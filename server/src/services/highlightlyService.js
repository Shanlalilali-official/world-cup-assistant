const axios = require('axios');

/**
 * Highlightly Football API — free tier (100 req/day), World Cup focused
 * Provides: live scores, match events/timeline, xG stats, video highlights, standings
 * Base URL will be set from env or default
 */
const highlightlyService = {
  client: axios.create({
    baseURL: process.env.HIGHLIGHTLY_API_URL || 'https://api.highlightly.net',
    timeout: 10000,
  }),

  /**
   * Get match timeline (goal events, cards, substitutions)
   */
  async getMatchTimeline(matchId) {
    try {
      const { data } = await this.client.get(`/matches/${matchId}/timeline`);
      return data?.events || data || [];
    } catch (err) {
      console.warn(`[Highlightly] Timeline unavailable for ${matchId}:`, err.message);
      return [];
    }
  },

  /**
   * Get video highlights for a match
   */
  async getVideoHighlights(matchId) {
    try {
      const { data } = await this.client.get(`/matches/${matchId}/highlights`);
      return data?.videos || data?.highlights || [];
    } catch (err) {
      console.warn(`[Highlightly] Highlights unavailable for ${matchId}:`, err.message);
      return [];
    }
  },

  /**
   * Get match key stats (xG timeline, momentum, etc.)
   */
  async getMatchKeyStats(matchId) {
    try {
      const { data } = await this.client.get(`/matches/${matchId}/stats`);
      return data?.stats || data || {};
    } catch (err) {
      console.warn(`[Highlightly] Key stats unavailable for ${matchId}:`, err.message);
      return {};
    }
  },

  /**
   * Get all video highlights for World Cup
   */
  async getWorldCupHighlights() {
    try {
      const { data } = await this.client.get('/world-cup/highlights');
      return data?.highlights || data || [];
    } catch (err) {
      console.warn('[Highlightly] WC highlights unavailable:', err.message);
      return [];
    }
  },

  /**
   * Search for videos
   */
  async searchVideos(query = 'World Cup 2026') {
    try {
      const { data } = await this.client.get('/videos/search', { params: { q: query } });
      return data?.videos || data || [];
    } catch (err) {
      console.warn('[Highlightly] Video search unavailable:', err.message);
      return [];
    }
  },
};

module.exports = highlightlyService;
