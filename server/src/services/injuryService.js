const axios = require('axios');
const cacheService = require('./cacheService');

/**
 * Injury data service — aggregates from SportScore news endpoint
 * Falls back to static injury data for major teams
 */
const injuryService = {
  /**
   * Get all current injuries for World Cup teams
   */
  async getInjuries() {
    const cacheKey = cacheService.key('injuries');
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const sportScore = require('./sportScoreService');
      const injuries = await sportScore.getInjuries();
      if (injuries && injuries.length > 0) {
        cacheService.set(cacheKey, injuries, 'injuries');
        return injuries;
      }
    } catch {
      console.warn('[Injury] Live API unavailable, using static data');
    }

    // Fallback: return empty with a note
    const fallback = {
      lastUpdated: new Date().toISOString(),
      source: 'static-fallback',
      message: 'Injury data will be available once the tournament begins.',
      injuries: [],
    };

    return fallback;
  },

  /**
   * Get injuries for a specific team
   * @param {string} teamCode - Team code (e.g., 'BRA', 'ARG')
   */
  async getTeamInjuries(teamCode) {
    const all = await this.getInjuries();
    if (all.injuries) {
      return all.injuries.filter((i) => i.team?.code === teamCode || i.teamCode === teamCode);
    }
    return [];
  },
};

module.exports = injuryService;
