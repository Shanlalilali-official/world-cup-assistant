const config = require('../config');
const { getTeam } = require('./staticDataService');

/**
 * Social media auto-publisher
 * Posts match results and updates to X (Twitter) and Instagram
 *
 * Publishing is DISABLED by default — set AUTO_POST_ENABLED=true in .env
 */
const socialPublisher = {
  /**
   * Post a match result to configured social platforms
   * @param {Object} match - Match data with scores
   */
  async postMatchResult(match) {
    if (!config.autoPost.enabled) {
      console.log('[SocialPublisher] Auto-post is disabled. Skipping.');
      return { posted: false, reason: 'auto-post-disabled' };
    }

    const results = [];

    if (config.autoPost.postOnFinalWhistle) {
      if (config.social.twitter.enabled) {
        const result = await this.postToTwitter(match);
        results.push({ platform: 'twitter', ...result });
      }

      if (config.social.instagram.enabled) {
        const result = await this.postToInstagram(match);
        results.push({ platform: 'instagram', ...result });
      }
    }

    return results;
  },

  /**
   * Post to X (Twitter)
   */
  async postToTwitter(match) {
    try {
      const { TwitterApi } = require('twitter-api-v2');
      const client = new TwitterApi({
        appKey: config.social.twitter.appKey,
        appSecret: config.social.twitter.appSecret,
        accessToken: config.social.twitter.accessToken,
        accessSecret: config.social.twitter.accessSecret,
      });

      const tweet = this.formatMatchTweet(match);
      const result = await client.v2.tweet(tweet);
      console.log(`[SocialPublisher] Posted to X: ${result.data.id}`);
      return { success: true, id: result.data.id };
    } catch (err) {
      console.error(`[SocialPublisher] X post failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  },

  /**
   * Post to Instagram
   * Note: Instagram Graph API requires a business/creator account
   * and doesn't support direct text posting — media is required.
   * This is a simplified placeholder.
   */
  async postToInstagram(match) {
    try {
      // Instagram content publishing requires:
      // 1. Facebook Page connected to Instagram Business account
      // 2. Media container creation → publish
      // For now, log what would be posted
      const caption = this.formatMatchCaption(match);
      console.log(`[SocialPublisher] Instagram post ready (manual): ${caption.substring(0, 80)}...`);
      return { success: false, error: 'Instagram auto-post requires media container API', caption };
    } catch (err) {
      console.error(`[SocialPublisher] Instagram post failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  },

  /**
   * Format a match result as a tweet
   * Gets flag emojis from staticDataService (single source of truth)
   */
  formatMatchTweet(match) {
    const { homeTeam, awayTeam } = match;
    const homeTeamData = getTeam(homeTeam.code);
    const awayTeamData = getTeam(awayTeam.code);
    const homeFlag = homeTeamData?.flag || '';
    const awayFlag = awayTeamData?.flag || '';

    let tweet = `🏆 FIFA World Cup 2026\n`;
    tweet += `${homeFlag} ${homeTeam.name} ${homeTeam.score} - ${awayTeam.score} ${awayTeam.name} ${awayFlag}\n`;

    if (match.group) {
      tweet += `📋 ${match.group}\n`;
    }
    tweet += `\n#FIFAWorldCup #WorldCup2026`;

    return tweet;
  },

  /**
   * Format match result as Instagram caption (longer format)
   */
  formatMatchCaption(match) {
    const { homeTeam, awayTeam } = match;
    let caption = `🏆 FIFA World Cup 2026\n\n`;
    caption += `${homeTeam.name} ${homeTeam.score} - ${awayTeam.score} ${awayTeam.name}\n\n`;

    if (match.venue) {
      caption += `📍 ${match.venue}\n`;
    }
    if (match.group) {
      caption += `📋 ${match.group}\n`;
    }
    caption += `\n#FIFAWorldCup #WorldCup2026 #Football`;

    return caption;
  },
};

module.exports = socialPublisher;
