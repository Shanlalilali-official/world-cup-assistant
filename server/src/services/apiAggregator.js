const sportScoreService = require('./sportScoreService');
const footballDataService = require('./footballDataService');
const wcApiService = require('./wcApiService');
const staticDataService = require('./staticDataService');
const cacheService = require('./cacheService');

/**
 * API Aggregator — tries primary source first, falls back to secondary,
 * then to embedded static data. Results are cached.
 *
 * Priority: SportScore → Football-Data.org → Static data (always available)
 */
const apiAggregator = {
  /**
   * Try multiple sources, returning the first successful non-empty result.
   * Static fallback is ALWAYS tried last and guaranteed to return data.
   */
  async trySources(fetchers, cacheKey, cacheType) {
    // Check cache first
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    for (const fetcher of fetchers) {
      try {
        const result = await fetcher();
        if (result && (Array.isArray(result) ? result.length > 0 : true)) {
          cacheService.set(cacheKey, result, cacheType);
          return result;
        }
      } catch (err) {
        console.warn(`[Aggregator] Source failed: ${err.message}`);
        continue;
      }
    }

    return null;
  },

  // ---- Match Data ----

  async getLiveScores() {
    return this.trySources(
      [
        () => sportScoreService.getLiveScores(),
        () => footballDataService.getMatches().then((ms) => ms.filter((m) => m.status === 'IN_PLAY' || m.status === 'LIVE')),
        () => [], // No live matches before kickoff is normal
      ],
      cacheService.key('liveScores'),
      'liveMatch'
    );
  },

  async getTodayMatches() {
    return this.trySources(
      [
        () => sportScoreService.getTodayMatches(),
        () => footballDataService.getMatches(),
        () => staticDataService.getTodayMatches(), // ← Static full schedule fallback
      ],
      cacheService.key('todayMatches'),
      'liveMatch'
    );
  },

  async getMatchesByDate(date) {
    return this.trySources(
      [
        () => sportScoreService.getMatchesByDate(date),
        () => footballDataService.getMatches().then((ms) => ms.filter((m) => m.startTime?.startsWith(date))),
        () => staticDataService.getMatchesByDate(date), // ← Static schedule fallback
      ],
      cacheService.key('matchesByDate', date),
      'finishedMatch'
    );
  },

  // ---- Standings ----

  async getStandings() {
    return this.trySources(
      [
        () => sportScoreService.getStandings(),
        () => footballDataService.getStandings(),
        () => staticDataService.getStandings(), // ← Static empty standings fallback
      ],
      cacheService.key('standings'),
      'standings'
    );
  },

  // ---- Stats ----

  async getTopScorers() {
    return this.trySources(
      [
        () => sportScoreService.getTopScorers(),
        () => footballDataService.getTopScorers(),
        () => staticDataService.getTopScorers(), // ← Empty placeholder
      ],
      cacheService.key('topScorers'),
      'topScorers'
    );
  },

  async getPlayerRatings() {
    return this.trySources(
      [
        () => sportScoreService.getPlayerRatings(),
        () => [],
      ],
      cacheService.key('playerRatings'),
      'topScorers'
    );
  },

  // ---- Injuries ----

  async getInjuries() {
    return this.trySources(
      [() => sportScoreService.getInjuries()],
      cacheService.key('injuries'),
      'injuries'
    );
  },

  // ---- Teams ----

  async getTeams() {
    return this.trySources(
      [
        () => wcApiService.getTeams(),
        () => staticDataService.getTeams(),
      ],
      cacheService.key('teams'),
      'finishedMatch'
    );
  },

  async getTeamsByGroup(groupName) {
    try {
      const teams = await this.getTeams();
      if (Array.isArray(teams)) {
        return teams.filter((t) => t.group === groupName);
      }
      // If teams is an object (from staticDataService), convert
      return staticDataService.getGroupTeams(groupName);
    } catch {
      return staticDataService.getGroupTeams(groupName);
    }
  },

  // ---- Stadiums ----

  async getStadiums() {
    return this.trySources(
      [
        () => wcApiService.getStadiums(),
        () => staticDataService.getVenues(),
      ],
      cacheService.key('stadiums'),
      'finishedMatch'
    );
  },

  // ---- Groups ----

  async getGroups() {
    return staticDataService.getGroups();
  },

  // ---- Full Schedule ----

  async getFullSchedule() {
    return this.trySources(
      [
        () => staticDataService.getFullSchedule(),
      ],
      cacheService.key('fullSchedule'),
      'finishedMatch'
    );
  },

  // ---- Match Detail (by ID) ----

  async getMatchById(id) {
    return this.trySources(
      [
        () => staticDataService.getMatchById(id),
      ],
      cacheService.key('matchDetail', id),
      'finishedMatch'
    );
  },
};

module.exports = apiAggregator;
