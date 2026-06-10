const cacheService = require('./cacheService');

/**
 * Historical World Cup data — embedded static data
 * Covers all tournaments 1930–2022 with records, stats, and trivia
 */
const historicalService = {
  /**
   * Get all historical World Cup winners
   */
  getWinners() {
    const cacheKey = cacheService.key('historical', 'winners');
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    const winners = [
      { year: 1930, winner: 'Uruguay', runnerUp: 'Argentina', host: 'Uruguay', score: '4-2' },
      { year: 1934, winner: 'Italy', runnerUp: 'Czechoslovakia', host: 'Italy', score: '2-1 (aet)' },
      { year: 1938, winner: 'Italy', runnerUp: 'Hungary', host: 'France', score: '4-2' },
      { year: 1950, winner: 'Uruguay', runnerUp: 'Brazil', host: 'Brazil', score: '2-1' },
      { year: 1954, winner: 'West Germany', runnerUp: 'Hungary', host: 'Switzerland', score: '3-2' },
      { year: 1958, winner: 'Brazil', runnerUp: 'Sweden', host: 'Sweden', score: '5-2' },
      { year: 1962, winner: 'Brazil', runnerUp: 'Czechoslovakia', host: 'Chile', score: '3-1' },
      { year: 1966, winner: 'England', runnerUp: 'West Germany', host: 'England', score: '4-2 (aet)' },
      { year: 1970, winner: 'Brazil', runnerUp: 'Italy', host: 'Mexico', score: '4-1' },
      { year: 1974, winner: 'West Germany', runnerUp: 'Netherlands', host: 'West Germany', score: '2-1' },
      { year: 1978, winner: 'Argentina', runnerUp: 'Netherlands', host: 'Argentina', score: '3-1 (aet)' },
      { year: 1982, winner: 'Italy', runnerUp: 'West Germany', host: 'Spain', score: '3-1' },
      { year: 1986, winner: 'Argentina', runnerUp: 'West Germany', host: 'Mexico', score: '3-2' },
      { year: 1990, winner: 'West Germany', runnerUp: 'Argentina', host: 'Italy', score: '1-0' },
      { year: 1994, winner: 'Brazil', runnerUp: 'Italy', host: 'USA', score: '0-0 (3-2 pens)' },
      { year: 1998, winner: 'France', runnerUp: 'Brazil', host: 'France', score: '3-0' },
      { year: 2002, winner: 'Brazil', runnerUp: 'Germany', host: 'Korea/Japan', score: '2-0' },
      { year: 2006, winner: 'Italy', runnerUp: 'France', host: 'Germany', score: '1-1 (5-3 pens)' },
      { year: 2010, winner: 'Spain', runnerUp: 'Netherlands', host: 'South Africa', score: '1-0 (aet)' },
      { year: 2014, winner: 'Germany', runnerUp: 'Argentina', host: 'Brazil', score: '1-0 (aet)' },
      { year: 2018, winner: 'France', runnerUp: 'Croatia', host: 'Russia', score: '4-2' },
      { year: 2022, winner: 'Argentina', runnerUp: 'France', host: 'Qatar', score: '3-3 (4-2 pens)' },
    ];

    cacheService.set(cacheKey, winners, 'finishedMatch');
    return winners;
  },

  /**
   * Get all-time World Cup records
   */
  getRecords() {
    return {
      mostTitles: { team: 'Brazil', count: 5, years: [1958, 1962, 1970, 1994, 2002] },
      mostGoalsPlayer: { player: 'Miroslav Klose', goals: 16, nation: 'Germany' },
      mostGoalsTournament: { player: 'Just Fontaine', goals: 13, year: 1958, nation: 'France' },
      mostMatches: { player: 'Lionel Messi', matches: 26, nation: 'Argentina' },
      biggestWin: { match: 'Hungary 9-0 South Korea', year: 1954 },
      mostGoalsMatch: { score: 'Austria 7-5 Switzerland', year: 1954, total: 12 },
      fastestGoal: { player: 'Hakan Şükür', time: '11 seconds', year: 2002, nation: 'Turkey' },
      oldestPlayer: { player: 'Essam El-Hadary', age: 45, year: 2018, nation: 'Egypt' },
      youngestPlayer: { player: 'Pelé', age: 17, year: 1958, nation: 'Brazil' },
      mostAttendance: { match: 'Brazil vs Uruguay', attendance: 199854, year: 1950 },
      totalTournaments: 22,
      totalGoals: 2720,
      totalMatches: 964,
    };
  },

  /**
   * Get country-specific World Cup history
   */
  getCountryHistory(countryCode) {
    const countryData = {
      BRA: {
        name: 'Brazil',
        appearances: 22,
        titles: 5,
        bestResult: 'Champion (1958, 1962, 1970, 1994, 2002)',
        totalWins: 76,
        totalGoals: 237,
        topScorer: 'Pelé (12 goals)',
      },
      GER: {
        name: 'Germany',
        appearances: 20,
        titles: 4,
        bestResult: 'Champion (1954, 1974, 1990, 2014)',
        totalWins: 68,
        totalGoals: 232,
        topScorer: 'Miroslav Klose (16 goals)',
      },
      ARG: {
        name: 'Argentina',
        appearances: 18,
        titles: 3,
        bestResult: 'Champion (1978, 1986, 2022)',
        totalWins: 47,
        totalGoals: 152,
        topScorer: 'Lionel Messi (13 goals)',
      },
      FRA: {
        name: 'France',
        appearances: 16,
        titles: 2,
        bestResult: 'Champion (1998, 2018)',
        totalWins: 37,
        totalGoals: 128,
        topScorer: 'Just Fontaine (13 goals)',
      },
      ITA: {
        name: 'Italy',
        appearances: 18,
        titles: 4,
        bestResult: 'Champion (1934, 1938, 1982, 2006)',
        totalWins: 45,
        totalGoals: 128,
        topScorer: 'Paolo Rossi (9 goals)',
      },
      ESP: {
        name: 'Spain',
        appearances: 16,
        titles: 1,
        bestResult: 'Champion (2010)',
        totalWins: 31,
        totalGoals: 100,
        topScorer: 'David Villa (9 goals)',
      },
      ENG: {
        name: 'England',
        appearances: 16,
        titles: 1,
        bestResult: 'Champion (1966)',
        totalWins: 29,
        totalGoals: 91,
        topScorer: 'Gary Lineker (10 goals)',
      },
      URU: {
        name: 'Uruguay',
        appearances: 14,
        titles: 2,
        bestResult: 'Champion (1930, 1950)',
        totalWins: 24,
        totalGoals: 88,
        topScorer: 'Óscar Míguez (8 goals)',
      },
      NED: {
        name: 'Netherlands',
        appearances: 11,
        titles: 0,
        bestResult: 'Runner-up (1974, 1978, 2010)',
        totalWins: 30,
        totalGoals: 96,
        topScorer: 'Johnny Rep (7 goals)',
      },
      POR: {
        name: 'Portugal',
        appearances: 8,
        titles: 0,
        bestResult: 'Third place (1966)',
        totalWins: 16,
        totalGoals: 54,
        topScorer: 'Eusébio (9 goals)',
      },
      BEL: {
        name: 'Belgium',
        appearances: 14,
        titles: 0,
        bestResult: 'Third place (2018)',
        totalWins: 21,
        totalGoals: 69,
        topScorer: 'Romelu Lukaku (5 goals)',
      },
      CRO: {
        name: 'Croatia',
        appearances: 6,
        titles: 0,
        bestResult: 'Runner-up (2018)',
        totalWins: 13,
        totalGoals: 43,
        topScorer: 'Davor Šuker (6 goals)',
      },
      MEX: {
        name: 'Mexico',
        appearances: 17,
        titles: 0,
        bestResult: 'Quarter-finals (1970, 1986)',
        totalWins: 17,
        totalGoals: 62,
        topScorer: 'Javier Hernández (4 goals)',
      },
      USA: {
        name: 'United States',
        appearances: 11,
        titles: 0,
        bestResult: 'Third place (1930)',
        totalWins: 9,
        totalGoals: 40,
        topScorer: 'Landon Donovan (5 goals)',
      },
      JPN: {
        name: 'Japan',
        appearances: 7,
        titles: 0,
        bestResult: 'Round of 16 (2002, 2010, 2018, 2022)',
        totalWins: 7,
        totalGoals: 25,
        topScorer: 'Keisuke Honda (4 goals)',
      },
      KOR: {
        name: 'South Korea',
        appearances: 11,
        titles: 0,
        bestResult: 'Fourth place (2002)',
        totalWins: 7,
        totalGoals: 34,
        topScorer: 'Son Heung-min (3 goals)',
      },
    };

    return countryData[countryCode?.toUpperCase()] || {
      name: countryCode,
      appearances: '—',
      titles: 0,
      bestResult: '—',
      totalWins: '—',
      totalGoals: '—',
      topScorer: '—',
    };
  },

  /**
   * Get fun facts and trivia
   */
  getTrivia() {
    return [
      { fact: 'The 2026 World Cup is the first to feature 48 teams, up from 32.', icon: '📈' },
      { fact: 'The first World Cup was held in Uruguay in 1930 with only 13 teams.', icon: '🏆' },
      { fact: 'Brazil is the only country to have played in every World Cup tournament.', icon: '🇧🇷' },
      { fact: 'The World Cup trophy weighs 6.175 kg and is made of 18-carat gold.', icon: '👑' },
      { fact: 'The fastest World Cup goal was scored by Hakan Şükür in 11 seconds (2002).', icon: '⚡' },
      { fact: 'In 2026, 16 host cities across 3 countries will stage matches.', icon: '🏟️' },
      { fact: 'The 2026 World Cup will feature 104 matches, up from 64 in 2022.', icon: '📊' },
      { fact: 'No country has won the World Cup three times in a row.', icon: '🔄' },
      { fact: '4 nations make their World Cup debut in 2026: Cape Verde, Curaçao, Jordan, Uzbekistan.', icon: '🆕' },
      { fact: 'Estadio Azteca will become the first stadium to host World Cup matches in three tournaments.', icon: '🏛️' },
    ];
  },
};

module.exports = historicalService;
