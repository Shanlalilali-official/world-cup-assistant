const axios = require('axios');
const config = require('../config');

// SportScore API — completely free, no API key required, CORS open
// Provides: live scores, match details, standings, top scorers, player stats
const sportScoreService = {
  client: axios.create({
    baseURL: config.apis.sportScore.baseUrl,
    timeout: 10000,
  }),

  widgetParams(extra = {}) {
    return { sport: 'football', src: 'world-cup-assistant', ...extra };
  },

  /**
   * Get live / in-progress match scores
   */
  async getLiveScores() {
    const { data } = await this.client.get('/api/widget/matches/', {
      params: this.widgetParams({ limit: 50 }),
    });
    return this.filterWorldCupMatches(this.normalizeMatches(data)).filter((m) => this.isLiveStatus(m.status));
  },

  /**
   * Get today's matches
   */
  async getTodayMatches() {
    const today = new Date().toISOString().split('T')[0];
    return this.getMatchesByDate(today);
  },

  /**
   * Get matches by date
   * @param {string} date - YYYY-MM-DD format
   */
  async getMatchesByDate(date) {
    const { data } = await this.client.get('/api/widget/matches/', {
      params: this.widgetParams({ limit: 50 }),
    });
    return this.filterWorldCupMatches(this.normalizeMatches(data)).filter((m) => m.startTime?.startsWith(date));
  },

  /**
   * Get match detail by ID
   * @param {string} matchId
   */
  async getMatchDetail(matchId) {
    const { data } = await this.client.get('/api/widget/match/', {
      params: this.widgetParams({ slug: matchId }),
    });
    return this.normalizeMatchDetail(data);
  },

  /**
   * Get tournament standings (group tables)
   */
  async getStandings() {
    const { data } = await this.client.get('/api/widget/standings/', {
      params: this.widgetParams({ slug: 'fifa-world-cup' }),
    });
    return this.normalizeStandings(data);
  },

  /**
   * Get top scorers
   */
  async getTopScorers() {
    const { data } = await this.client.get('/api/widget/topscorers/', {
      params: this.widgetParams({ slug: 'fifa-world-cup', limit: 50 }),
    });
    return this.normalizeTopScorers(data);
  },

  /**
   * Get player ratings
   */
  async getPlayerRatings() {
    return [];
  },

  /**
   * Get injury news
   */
  async getInjuries() {
    return []; // SportScore does not expose a dedicated injuries endpoint.
  },

  // Normalize match data to our standard format
  normalizeMatches(data) {
    const matches = data?.matches || data?.data || data || [];
    return matches.map((m) => ({
      id: m.slug || m.id || m.match_id,
      status: (m.status || m.status_name || 'SCHEDULED').toUpperCase(),
      startTime: m.start_time || m.startTime || m.kickoff || m.date || m.utcDate,
      homeTeam: {
        name: m.home_team?.name || m.homeTeam?.name || m.homeTeam || m.home?.name || m.home,
        code: m.home_team?.code || m.homeTeam?.code || m.home_code || m.home?.code || '',
        score: m.home_score ?? m.homeTeam?.score ?? m.homeScore ?? m.home?.score ?? 0,
      },
      awayTeam: {
        name: m.away_team?.name || m.awayTeam?.name || m.awayTeam || m.away?.name || m.away,
        code: m.away_team?.code || m.awayTeam?.code || m.away_code || m.away?.code || '',
        score: m.away_score ?? m.awayTeam?.score ?? m.awayScore ?? m.away?.score ?? 0,
      },
      venue: m.venue || m.stadium || '',
      group: m.group || m.stage || m.round || '',
      minute: m.minute || m.elapsed || null,
      competition: m.competition?.name || m.league?.name || m.tournament?.name || m.competition || '',
    }));
  },

  normalizeStandings(data) {
    const tables = data?.standings || data?.tables || data?.data || [];
    if (!Array.isArray(tables)) return [];

    return tables.map((table, groupIndex) => {
      const teams = table.teams || table.rows || table.table || [];
      return {
        name: table.name || table.group || `Group ${String.fromCharCode(65 + groupIndex)}`,
        group: table.group || table.name || String.fromCharCode(65 + groupIndex),
        teams: teams.map((team, idx) => ({
          code: team.team?.code || team.code || team.tla || '',
          name: team.team?.name || team.name || '',
          played: team.played ?? team.playedGames ?? team.matches ?? 0,
          won: team.won ?? team.wins ?? 0,
          drawn: team.drawn ?? team.draws ?? 0,
          lost: team.lost ?? team.losses ?? 0,
          goalsFor: team.goalsFor ?? team.gf ?? 0,
          goalsAgainst: team.goalsAgainst ?? team.ga ?? 0,
          goalDiff: team.goalDiff ?? team.goalDifference ?? team.gd ?? 0,
          points: team.points ?? team.pts ?? 0,
          position: team.position ?? idx + 1,
        })),
      };
    }).filter((group) => group.teams.length > 0);
  },

  normalizeTopScorers(data) {
    const scorers = data?.scorers || data?.topscorers || data?.players || data?.data || [];
    if (!Array.isArray(scorers)) return [];

    return scorers.map((s) => ({
      id: s.id || s.player?.id || s.slug || s.player?.slug,
      player: s.player?.name || s.name || s.player,
      team: s.team?.name || s.team_name || s.team,
      teamCode: s.team?.code || s.team_code || '',
      goals: s.goals ?? s.value ?? s.total ?? 0,
      assists: s.assists ?? 0,
      matches: s.matches ?? s.appearances ?? 0,
    }));
  },

  normalizeMatchDetail(data) {
    const m = data?.match || data;
    return {
      id: m.id || m.match_id,
      status: m.status || 'scheduled',
      startTime: m.start_time || m.kickoff || m.date,
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
      venue: m.venue || m.stadium,
      group: m.group || m.stage,
      minute: m.minute || m.elapsed,
      events: m.events || [],
      stats: m.stats || m.statistics || {},
    };
  },

  isLiveStatus(status) {
    return ['LIVE', 'IN_PLAY', 'HALFTIME', 'HT'].includes(status);
  },

  filterWorldCupMatches(matches) {
    return matches.filter((match) => {
      const haystack = [
        match.competition,
        match.group,
        match.stage,
        match.venue,
      ].filter(Boolean).join(' ').toLowerCase();

      return haystack.includes('world cup') || haystack.includes('fifa world cup') || haystack.includes('group ');
    });
  },
};

module.exports = sportScoreService;
