const apiAggregator = require('../services/apiAggregator');

/**
 * Cache warmer — pre-fetches commonly-accessed data to keep cache fresh
 * Runs every 5 minutes for standings, every 10 for stats
 */
let standingsInterval = null;
let statsInterval = null;

const cacheWarmer = {
  start() {
    // Warm standings cache every 5 minutes
    standingsInterval = setInterval(async () => {
      try {
        await apiAggregator.getStandings();
        console.log('[CacheWarmer] Standings cache warmed');
      } catch (err) {
        console.warn(`[CacheWarmer] Standings warm failed: ${err.message}`);
      }
    }, 300000); // 5 minutes

    // Warm top scorers cache every 10 minutes
    statsInterval = setInterval(async () => {
      try {
        await apiAggregator.getTopScorers();
        console.log('[CacheWarmer] Stats cache warmed');
      } catch (err) {
        console.warn(`[CacheWarmer] Stats warm failed: ${err.message}`);
      }
    }, 600000); // 10 minutes

    console.log('[CacheWarmer] Cache warming started');
  },

  stop() {
    if (standingsInterval) clearInterval(standingsInterval);
    if (statsInterval) clearInterval(statsInterval);
  },
};

module.exports = cacheWarmer;
