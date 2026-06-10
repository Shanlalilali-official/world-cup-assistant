const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const normalizedApiUrl = configuredApiUrl?.replace(/\/+$/, '');
const API_BASE = configuredApiUrl
  ? `${normalizedApiUrl}${normalizedApiUrl.endsWith('/api') ? '' : '/api'}`
  : '/api';

async function fetchJSON(url) {
  const res = await fetch(`${API_BASE}${url}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  // Scores
  getLiveScores: () => fetchJSON('/scores/live'),
  getTodayMatches: () => fetchJSON('/scores/today'),

  // Schedule
  getSchedule: (date) => {
    const params = date ? `?date=${date}` : '';
    return fetchJSON(`/schedule${params}`);
  },

  // Standings
  getStandings: () => fetchJSON('/standings'),

  // Stats
  getTopScorers: () => fetchJSON('/stats/top-scorers'),
  getPlayerRatings: () => fetchJSON('/stats/player-ratings'),

  // Injuries
  getInjuries: () => fetchJSON('/injuries'),
  getTeamInjuries: (teamCode) => fetchJSON(`/injuries/${teamCode}`),

  // Social
  getTweets: (hashtag) => {
    const params = hashtag ? `?hashtag=${hashtag}` : '';
    return fetchJSON(`/social/tweets${params}`);
  },
  getInstagramPosts: (hashtag) => {
    const params = hashtag ? `?hashtag=${hashtag}` : '';
    return fetchJSON(`/social/instagram${params}`);
  },

  // === NEW: Match Detail ===
  getMatchDetail: (matchId) => fetchJSON(`/matches/${matchId}/detail`),
  getMatchTimeline: (matchId) => fetchJSON(`/matches/${matchId}/timeline`),
  getMatchHighlights: (matchId, homeTeam, awayTeam) => {
    const params = new URLSearchParams({ homeTeam, awayTeam }).toString();
    return fetchJSON(`/matches/${matchId}/highlights?${params}`);
  },

  // === NEW: Predictions ===
  getPredictions: () => fetchJSON('/predictions'),

  // === NEW: News ===
  getNews: ({ summarize = false, lang } = {}) => {
    const params = new URLSearchParams();
    if (summarize) params.set('summarize', 'true');
    if (lang) params.set('lang', lang);
    const query = params.toString();
    return fetchJSON(`/news${query ? `?${query}` : ''}`);
  },

  // === NEW: Weather ===
  getAllWeather: () => fetchJSON('/weather'),
  getCityWeather: (city) => fetchJSON(`/weather/${encodeURIComponent(city)}`),

  // === NEW: Historical ===
  getHistoricalWinners: () => fetchJSON('/historical/winners'),
  getHistoricalRecords: () => fetchJSON('/historical/records'),
  getHistoricalTrivia: () => fetchJSON('/historical/trivia'),
  getCountryHistory: (countryCode) => fetchJSON(`/historical/${countryCode}`),

  // === NEW: Videos ===
  getVideos: (query) => {
    const params = query ? `?q=${encodeURIComponent(query)}` : '';
    return fetchJSON(`/videos${params}`);
  },
};
