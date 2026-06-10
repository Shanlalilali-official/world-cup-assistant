const axios = require('axios');
const config = require('../config');

// Zafronix World Cup API — free tier (1000 req/day)
// Provides rich historical + current World Cup data
// Falls back to static/embedded data when unavailable
const wcApiService = {
  client: axios.create({
    baseURL: config.apis.wcApi.baseUrl,
    timeout: 10000,
    headers: {
      'x-api-key': config.apis.wcApi.apiKey,
    },
  }),

  isEnabled() {
    return !!config.apis.wcApi.apiKey;
  },

  async getTournaments() {
    if (!this.isEnabled()) return [];
    const { data } = await this.client.get('/tournaments');
    return data;
  },

  async getTeams() {
    if (!this.isEnabled()) return [];
    const { data } = await this.client.get('/teams');
    return data;
  },

  async getMatches() {
    if (!this.isEnabled()) return [];
    const { data } = await this.client.get('/matches', {
      params: { tournament: '2026' },
    });
    return data;
  },

  async getStadiums() {
    if (!this.isEnabled()) return [];
    const { data } = await this.client.get('/stadiums');
    return data;
  },
};

module.exports = wcApiService;
