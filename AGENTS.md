# World Cup Assistant — Project Work Record

## Project Status

- **Started**: 2026-06-09
- **Tournament**: 2026 FIFA World Cup (June 11 – July 19, 2026)
- **Current Phase**: All phases complete ✅ (expanded with 6 new data sources)
- **Last Updated**: 2026-06-09
- **Latest Fix Pass**: 2026-06-09 — fixed standings unknown names, localized History/News Chinese content, improved Dashboard visualization
- **Handoff Prep**: 2026-06-09 — added frontend env example, contribution guide, and refreshed README for GitHub/other-device development
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
├── AGENTS.md        # This file
└── README.md
```

## Key Decisions

1. **Free APIs only** — no budget for paid APIs. SportScore is the primary source.
2. **React SPA + separate backend** — not SSR. Frontend on GitHub Pages, backend on Vercel.
3. **Social auto-post is opt-in** — disabled by default via AUTO_POST_ENABLED env var.
4. **Cache aggressively** — free APIs have rate limits. node-cache with typed TTLs.
5. **Bilingual default** — Chinese first (zh as default language), English as fallback.
6. **Production API URLs are explicit** — GitHub Pages must set `VITE_API_URL`; local dev keeps `/api` proxy.
7. **WebSocket is optional in production** — client only auto-connects locally unless `VITE_SOCKET_URL` is configured.

## Recent Fixes (2026-06-09)

- Fixed standings rendering `Unknown` for teams when upstream data has a team name but no recognized code.
- Confirmed SportScore default base as `https://sportscore.com` and updated wrapper calls to `/api/widget/*` endpoints.
- Removed a real-looking Football-Data API key from `server/.env.example`; example files now use placeholders only.
- Improved Dashboard visualization with a command-center hero, tournament progress, next-match card, host-city cards, and updated match cards.
- Localized History page values that were still English in Chinese mode: winners, hosts, records, country-history phrases, and trivia.
- Changed News page so Chinese mode requests translated/Chinese summaries by default; static fallback news now includes Chinese titles and descriptions.
- Added translation fallback text for RSS summaries when free translation is unavailable.
- Added `client/.env.example` with `VITE_API_URL` and optional `VITE_SOCKET_URL`.
- Added `CONTRIBUTING.md` with setup, validation, Git hygiene, and deployment notes.
- Rewrote `README.md` to document local development, environment variables, GitHub Pages/Vercel deployment, and upload commands.

## Known Issues

- [ ] X API v2 free tier search may not work without Elevated Access
- [ ] Instagram hashtag search requires Facebook App Review — embed fallback used
- [ ] Socket.IO requires a persistent server if production live push is needed; otherwise polling fallback is used
- [ ] Live RSS translation quality depends on free translate availability unless `AI_API_KEY` is configured

## Environment Variables Needed

See `server/.env.example` for all required variables. Critical ones:
- `FOOTBALL_DATA_API_KEY` — for backup API
- `TWITTER_API_KEY` + secrets — for social features
- `AUTO_POST_ENABLED` — set to 'true' to enable auto-posting

## Next Steps (for other agents/devices)

1. **Run `npm install`** in both `server/` and `client/` directories
2. **Set production frontend API URL** — configure `VITE_API_URL` to the deployed Vercel API origin
3. **Test backend**: `cd server && npm run dev`
4. **Test frontend**: `cd client && npm run dev`
5. **Set up GitHub secrets** for deployment (VITE_API_URL, VERCEL_TOKEN, etc.)
6. **Create GitHub repo** and push for CI/CD
7. **Add real injury data** if SportScore API doesn't provide it
8. **Optional live push** — deploy a persistent Socket.IO server and set `VITE_SOCKET_URL`, or rely on polling
9. **Upload to GitHub** — initialize Git on a machine with `git` and `gh` available, then push to the target repository

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
