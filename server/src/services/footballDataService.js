const axios = require('axios');
const config = require('../config');

// Football-Data.org API — free tier (10 req/min), major leagues
// Backup data source when SportScore is unavailable
const footballDataService = {
  client: axios.create({
    baseURL: config.apis.footballData.baseUrl,
    timeout: 10000,
    headers: {
      'X-Auth-Token': config.apis.footballData.apiKey,
    },
  }),

  isEnabled() {
    return !!config.apis.footballData.apiKey;
  },

  async getMatches() {
    if (!this.isEnabled()) return [];
    const { data } = await this.client.get('/matches', {
      params: { competitions: 'FWC' }, // FIFA World Cup
    });
    return this.normalizeMatches(data.matches || []);
  },

  async getStandings() {
    if (!this.isEnabled()) return [];
    const { data } = await this.client.get('/competitions/FWC/standings');
    return data;
  },

  async getTopScorers() {
    if (!this.isEnabled()) return [];
    const { data } = await this.client.get('/competitions/FWC/scorers');
    return data;
  },

  normalizeMatches(matches) {
    return matches.map((m) => ({
      id: m.id,
      status: m.status,
      startTime: m.utcDate,
      homeTeam: {
        name: m.homeTeam?.name || '',
        code: m.homeTeam?.tla || '',
        score: m.score?.fullTime?.home ?? 0,
      },
      awayTeam: {
        name: m.awayTeam?.name || '',
        code: m.awayTeam?.tla || '',
        score: m.score?.fullTime?.away ?? 0,
      },
      venue: m.venue || '',
      group: m.group || m.stage || '',
      minute: m.minute || null,
    }));
  },
};

module.exports = footballDataService;
