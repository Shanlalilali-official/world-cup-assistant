# World Cup Assistant — Project Work Record

## Project Status

- **Started**: 2026-06-09
- **Tournament**: 2026 FIFA World Cup (June 11 – July 19, 2026)
- **Current Phase**: All phases complete ✅ (expanded with 6 new data sources)
- **Last Updated**: 2026-06-09
- **Frontend pages**: 11 pages (Dashboard, Schedule, Standings, Stats, Injuries, Social, Match Detail, Videos, News, History, Predictions)
- **Backend routes**: 13 route files, 20+ API endpoints
- **Data sources**: 8 APIs (SportScore, Football-Data.org, Zafronix, BSD, Highlightly, YouTube, OpenWeatherMap, RSS News)

## Architecture

- **Frontend**: React 19 + Vite + Tailwind CSS, deployed on GitHub Pages
- **Backend**: Node.js + Express, deployed on Vercel (free tier)
- **Real-time**: Socket.IO for live score push, polling fallback
- **i18n**: react-i18next (zh + en)
- **Primary API**: SportScore (free, no key required)
- **Backup APIs**: Football-Data.org, Zafronix WC API

## Project Structure

```
world-cup-assistant/
├── client/          # React frontend
├── server/          # Express backend
├── .github/         # CI/CD workflows
├── CLAUDE.md        # This file
└── README.md
```

## Key Decisions

1. **Free APIs only** — no budget for paid APIs. SportScore is the primary source.
2. **React SPA + separate backend** — not SSR. Frontend on GitHub Pages, backend on Vercel.
3. **Social auto-post is opt-in** — disabled by default via AUTO_POST_ENABLED env var.
4. **Cache aggressively** — free APIs have rate limits. node-cache with typed TTLs.
5. **Bilingual default** — Chinese first (zh as default language), English as fallback.

## Known Issues

- [ ] SportScore API base URL needs to be confirmed (currently a placeholder)
- [ ] X API v2 free tier search may not work without Elevated Access
- [ ] Instagram hashtag search requires Facebook App Review — embed fallback used
- [ ] WebSocket port (3001) must be exposed in Vercel config or replaced with polling

## Environment Variables Needed

See `server/.env.example` for all required variables. Critical ones:
- `FOOTBALL_DATA_API_KEY` — for backup API
- `TWITTER_API_KEY` + secrets — for social features
- `AUTO_POST_ENABLED` — set to 'true' to enable auto-posting

## Next Steps (for other agents/devices)

1. **Run `npm install`** in both `server/` and `client/` directories
2. **Verify SportScore API** — check the actual base URL and endpoints
3. **Test backend**: `cd server && npm run dev`
4. **Test frontend**: `cd client && npm run dev`
5. **Set up GitHub secrets** for deployment (VITE_API_URL, VERCEL_TOKEN, etc.)
6. **Create GitHub repo** and push for CI/CD
7. **Add real injury data** if SportScore API doesn't provide it

## File Inventory

### Server (22 files)
- `server/src/index.js` — Express entry, Socket.IO setup
- `server/src/config/index.js` — All configuration
- `server/src/services/apiAggregator.js` — Multi-source data aggregation + failover
- `server/src/services/cacheService.js` — In-memory cache with typed TTLs
- `server/src/services/sportScoreService.js` — Primary free API wrapper
- `server/src/services/footballDataService.js` — Secondary API wrapper
- `server/src/services/wcApiService.js` — World Cup history API
- `server/src/services/injuryService.js` — Injury data aggregation
- `server/src/services/socialFetcher.js` — X/Instagram content fetching
- `server/src/services/socialPublisher.js` — Auto-post to X/Instagram
- `server/src/routes/` — 7 route files (health, scores, schedule, standings, stats, injuries, social)
- `server/src/middleware/` — cors, rateLimiter, errorHandler
- `server/src/jobs/` — scorePolling, socialAutoPost, cacheWarmer

### Client (30+ files)
- All React components, hooks, services, i18n, and utilities
- See plan file for full structure

## Reference Links

- [SportScore MCP](https://github.com/Backspace-me/sportscore-mcp) — free sports API
- [Football-Data.org](https://www.football-data.org/) — free tier football API
- [Zafronix WC API](https://github.com/zafronix/wc-mcp) — World Cup data
- [X API v2](https://developer.twitter.com/) — social media API
- [2026 World Cup Groups](https://sports.yahoo.com/soccer/article/2026-world-cup-viewers-guide-format-new-rules-how-to-watch-and-everything-you-need-to-know-before-kickoff-183000031.html)
