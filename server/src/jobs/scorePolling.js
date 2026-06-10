const apiAggregator = require('../services/apiAggregator');
const cacheService = require('../services/cacheService');

/**
 * Score polling job — periodically fetches live scores and broadcasts
 * updates to connected clients via Socket.IO
 *
 * Polling interval: 30 seconds for live matches
 */
let pollingInterval = null;
let io = null;

const scorePolling = {
  start(socketIO) {
    io = socketIO;

    // Poll every 30 seconds
    pollingInterval = setInterval(async () => {
      try {
        const liveMatches = await apiAggregator.getLiveScores();

        // Invalidate cache for fresh data
        cacheService.del(cacheService.key('liveScores'));

        if (liveMatches && liveMatches.length > 0) {
          // Broadcast to all clients subscribed to 'live-scores'
          io.to('live-scores').emit('scoreUpdate', {
            matches: liveMatches,
            timestamp: new Date().toISOString(),
          });
          console.log(`[Polling] Broadcast ${liveMatches.length} live matches`);
        }
      } catch (err) {
        console.warn(`[Polling] Error: ${err.message}`);
      }
    }, 30000); // 30 seconds

    console.log('[Polling] Score polling started (30s interval)');
  },

  stop() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
      console.log('[Polling] Score polling stopped');
    }
  },
};

module.exports = scorePolling;
