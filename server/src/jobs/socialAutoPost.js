const config = require('../config');
const apiAggregator = require('../services/apiAggregator');
const socialPublisher = require('../services/socialPublisher');

/**
 * Social auto-post job — checks for recently finished matches
 * and posts results to configured social platforms
 *
 * Runs every 2 minutes
 */
let interval = null;
const postedMatches = new Set(); // Track already-posted matches to avoid duplicates

const socialAutoPost = {
  start() {
    if (!config.autoPost.enabled) {
      console.log('[SocialJob] Auto-post is disabled. Set AUTO_POST_ENABLED=true to enable.');
      return;
    }

    // Check every 2 minutes for newly finished matches
    interval = setInterval(async () => {
      try {
        const todayMatches = await apiAggregator.getTodayMatches();
        if (!todayMatches) return;

        const finishedMatches = todayMatches.filter(
          (m) => m.status === 'FINISHED' || m.status === 'FT'
        );

        for (const match of finishedMatches) {
          if (!postedMatches.has(match.id)) {
            console.log(`[SocialJob] Posting result: ${match.homeTeam.name} vs ${match.awayTeam.name}`);
            await socialPublisher.postMatchResult(match);
            postedMatches.add(match.id);
          }
        }

        // Clean up old IDs (keep set size manageable)
        if (postedMatches.size > 1000) {
          const arr = [...postedMatches];
          postedMatches.clear();
          arr.slice(-500).forEach((id) => postedMatches.add(id));
        }
      } catch (err) {
        console.warn(`[SocialJob] Error: ${err.message}`);
      }
    }, 120000); // 2 minutes

    console.log('[SocialJob] Auto-post checking started (2min interval)');
  },

  stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
      console.log('[SocialJob] Auto-post stopped');
    }
  },
};

module.exports = socialAutoPost;
