require('dotenv').config();

const clientUrls = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: clientUrls[0],
  clientUrls,

  // API Keys
  apis: {
    sportScore: {
      baseUrl: process.env.SPORTSCORE_API_BASE || process.env.SPORTSCORE_API_URL || 'https://sportscore.com',
      // SportScore is free and doesn't require an API key
    },
    footballData: {
      baseUrl: process.env.FOOTBALL_DATA_URL || 'https://api.football-data.org/v4',
      apiKey: process.env.FOOTBALL_DATA_API_KEY || '',
    },
    wcApi: {
      baseUrl: process.env.WC_API_URL || 'https://world-cup-api.zafronix.com',
      apiKey: process.env.WC_API_KEY || '',
    },
    bsd: {
      baseUrl: process.env.BSD_API_URL || 'https://sports.bzzoiro.com/api',
    },
    highlightly: {
      baseUrl: process.env.HIGHLIGHTLY_API_URL || 'https://api.highlightly.net',
    },
  },

  // Social Media API Keys
  social: {
    twitter: {
      appKey: process.env.TWITTER_API_KEY || '',
      appSecret: process.env.TWITTER_API_SECRET || '',
      accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
      accessSecret: process.env.TWITTER_ACCESS_SECRET || '',
      enabled: process.env.TWITTER_ENABLED === 'true',
    },
    instagram: {
      accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
      enabled: process.env.INSTAGRAM_ENABLED === 'true',
    },
  },

  // Auto-posting configuration
  autoPost: {
    enabled: process.env.AUTO_POST_ENABLED === 'true',
    postOnFinalWhistle: process.env.POST_FINAL_WHISTLE !== 'false', // default true
    postDailySummary: process.env.POST_DAILY_SUMMARY === 'true',
    dailySummaryHour: parseInt(process.env.DAILY_SUMMARY_HOUR || '8', 10), // UTC hour
  },

  // Cache TTL (seconds)
  cache: {
    liveMatch: 30,
    finishedMatch: 300,
    standings: 300,
    topScorers: 600,
    injuries: 1800,
    socialFeed: 120,
  },
};

module.exports = config;
