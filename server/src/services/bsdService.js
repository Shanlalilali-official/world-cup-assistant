const axios = require('axios');
const config = require('../config');

/**
 * Bzzoiro Sports Data (BSD) — completely free, no rate limits, no credit card
 * Provides: live scores, xG, player stats, cards, possession
 * Unique: built-in CatBoost ML match predictions (1X2 + confidence)
 * Base URL: https://sports.bzzoiro.com/api (to be confirmed)
 */
const bsdService = {
  client: axios.create({
    baseURL: config.apis.bsd?.baseUrl || 'https://sports.bzzoiro.com/api',
    timeout: 10000,
  }),

  /**
   * Get live matches with xG and detailed stats
   */
  async getLiveMatches() {
    try {
      const { data } = await this.client.get('/matches/live');
      return this.normalizeMatches(data);
    } catch (err) {
      console.warn('[BSD] Live matches unavailable:', err.message);
      return [];
    }
  },

  /**
   * Get match with full statistics (xG, possession, shots, cards, etc.)
   */
  async getMatchDetail(matchId) {
    try {
      const { data } = await this.client.get(`/matches/${matchId}`);
      return this.normalizeMatchDetail(data);
    } catch (err) {
      console.warn(`[BSD] Match detail unavailable for ${matchId}:`, err.message);
      return null;
    }
  },

  /**
   * Get ML predictions for upcoming matches
   */
  async getPredictions() {
    try {
      const { data } = await this.client.get('/predictions');
      return data?.predictions || data || [];
    } catch (err) {
      console.warn('[BSD] Predictions unavailable:', err.message);
      return [];
    }
  },

  /**
   * Get team statistics
   */
  async getTeamStats(teamId) {
    try {
      const { data } = await this.client.get(`/teams/${teamId}/stats`);
      return data;
    } catch (err) {
      console.warn(`[BSD] Team stats unavailable for ${teamId}:`, err.message);
      return null;
    }
  },

  normalizeMatches(data) {
    const matches = data?.matches || data?.data || data || [];
    return matches.map((m) => ({
      id: m.id || m.match_id,
      status: m.status,
      startTime: m.start_time || m.date,
      homeTeam: {
        name: m.home_team?.name || m.homeTeam,
        code: m.home_team?.code || m.home_code,
        score: m.home_score ?? m.homeScore ?? 0,
      },
      awayTeam: {
        name: m.away_team?.name || m.awayTeam,
        code: m.away_team?.code || m.away_code,
        score: m.away_score ?? m.awayScore ?? 0,
      },
      minute: m.minute || m.elapsed,
      // BSD-specific enrichment
      stats: {
        xG: m.xg || m.expected_goals,
        possession: m.possession,
        shots: m.shots,
        shotsOnTarget: m.shots_on_target,
        corners: m.corners,
        fouls: m.fouls,
        cards: m.cards,
      },
      prediction: m.prediction || m.ml_prediction,
    }));
  },

  normalizeMatchDetail(data) {
    const m = data?.match || data;
    return {
      id: m.id,
      status: m.status,
      startTime: m.start_time || m.date,
      homeTeam: {
        name: m.home_team?.name,
        code: m.home_team?.code,
        score: m.home_score ?? 0,
        lineup: m.home_lineup || [],
        formation: m.home_formation,
      },
      awayTeam: {
        name: m.away_team?.name,
        code: m.away_team?.code,
        score: m.away_score ?? 0,
        lineup: m.away_lineup || [],
        formation: m.away_formation,
      },
      minute: m.minute,
      venue: m.venue || m.stadium,
      referee: m.referee,
      attendance: m.attendance,
      stats: {
        xG: { home: m.xg_home ?? 0, away: m.xg_away ?? 0 },
        possession: { home: m.possession_home ?? 50, away: m.possession_away ?? 50 },
        shots: { home: m.shots_home ?? 0, away: m.shots_away ?? 0 },
        shotsOnTarget: { home: m.shots_on_target_home ?? 0, away: m.shots_on_target_away ?? 0 },
        corners: { home: m.corners_home ?? 0, away: m.corners_away ?? 0 },
        fouls: { home: m.fouls_home ?? 0, away: m.fouls_away ?? 0 },
        yellowCards: { home: m.yellow_cards_home ?? 0, away: m.yellow_cards_away ?? 0 },
        redCards: { home: m.red_cards_home ?? 0, away: m.red_cards_away ?? 0 },
        passes: { home: m.passes_home ?? 0, away: m.passes_away ?? 0 },
        passAccuracy: { home: m.pass_accuracy_home ?? 0, away: m.pass_accuracy_away ?? 0 },
      },
      events: m.events || [],
      prediction: m.prediction || null,
    };
  },
};

module.exports = bsdService;
