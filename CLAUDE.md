# World Cup Assistant — Project Work Record

## Project Status

- **Started**: 2026-06-09
- **Tournament**: 2026 FIFA World Cup (June 11 – July 19, 2026)
- **Current Phase**: Deployed ✅ (backend on Vercel, frontend on GitHub Pages)
- **Last Updated**: 2026-06-10
- **Frontend pages**: 11 pages (Dashboard, Schedule, Standings, Stats, Injuries, Social, Match Detail, Videos, News, History, Predictions)
- **Backend routes**: 13 route files, 20+ API endpoints
- **Data sources**: 8 APIs (SportScore, Football-Data.org, Zafronix, BSD, Highlightly, YouTube, OpenWeatherMap, RSS News)

## Deployment

- **GitHub Repo**: `Shanlalilali-official/world-cup-assistant` (private)
- **Frontend**: `https://shanlalilali-official.github.io/world-cup-assistant/`
- **Backend**: `https://world-cup-assistant-git-main-shanlalilali-s-projects.vercel.app`
- **Backend deploy**: Vercel Git integration (auto-deploy on push to main)
- **Frontend deploy**: GitHub Actions → `gh-pages` branch

## Architecture

- **Frontend**: React 19 + Vite + Tailwind CSS, deployed on GitHub Pages
- **Backend**: Node.js + Express, deployed on Vercel (free tier)
- **Real-time**: Socket.IO for live score push, polling fallback
- **i18n**: react-i18next (zh + en)
- **Primary API**: SportScore (free, no key required)
- **Backup APIs**: Football-Data.org, Zafronix WC API
- **Static fallback**: Full 48-team data, 104-match schedule, bilingual names + flag emojis

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
6. **Single source of truth for team data** — `TEAMS` constant in `constants.js` is the only place team names, flags, and codes are defined. All lookup functions (`getTeamName`, `getTeamFlag`, `getTeam`) derive from it.

## Changelog

### 2026-06-10 — Bug fix & deployment

- **Fixed**: White flag (🏳️) bug in standings — `getTeamFlag()` was using a separate hardcoded flag map that could desync from the TEAMS constant. Now all flag lookups go through TEAMS.
- **Fixed**: `socialPublisher.js` had its own 20-team flag map with wrong teams (included ITA, not in 2026 WC). Now uses `staticDataService.getTeam()`.
- **Fixed**: CORS middleware — changed from `callback(new Error(...))` to `callback(null, false)` + wildcard `*.github.io` allow. Old approach returned 500 without CORS headers, causing opaque browser errors.
- **Fixed**: CI/CD — `deploy-server.yml` changed to `workflow_dispatch` only (Vercel Git integration handles auto-deploy); `deploy-client.yml` added `permissions: contents: write`.
- **Added**: `flag` emoji field to every team in both client `constants.js` and server `staticDataService.js`.
- **Deployed**: Frontend to GitHub Pages, backend to Vercel, GitHub repo: `Shanlalilali-official/world-cup-assistant`.

## Known Issues

- [ ] **CORS still not working in production** — despite code fixes, Vercel deployment may not be picking up the latest commit (URL still shows `git-main` which suggests a stale preview deploy). Next step: verify Vercel Deployments tab shows latest commit, or redeploy manually with `npx vercel --cwd server --prod`.
- [ ] SportScore API base URL needs to be confirmed (currently a placeholder `https://sportscore.com`)
- [ ] X API v2 free tier search may not work without Elevated Access
- [ ] Instagram hashtag search requires Facebook App Review — embed fallback used
- [ ] WebSocket port (3001) must be exposed in Vercel config or replaced with polling

## Environment Variables Needed

See `server/.env.example` for all required variables. Critical ones:
- `CLIENT_URLS` — comma-separated frontend origins for CORS (e.g. `https://user.github.io,http://localhost:5173`)
- `FOOTBALL_DATA_API_KEY` — for backup API
- `TWITTER_API_KEY` + secrets — for social features
- `AUTO_POST_ENABLED` — set to 'true' to enable auto-posting

### Where to set them

| Environment | Location |
|---|---|
| Local dev | `server/.env` (gitignored, never committed) |
| Vercel (production) | Vercel Dashboard → Project → Settings → Environment Variables |
| GitHub Actions (build-time) | GitHub Repo → Settings → Secrets and variables → Actions |

## Next Steps

1. **Fix CORS in production** — verify Vercel deployed latest code, or redeploy manually
2. **Verify SportScore API** — check the actual base URL and endpoints (currently placeholder)
3. **Add real injury data** if SportScore API doesn't provide it
4. **Run `npm install`** on any new machine: `cd server && npm install` then `cd ../client && npm install`
5. **Test locally**: `cd server && npm run dev` + `cd client && npm run dev`

## File Inventory

### Server
- `server/src/index.js` — Express entry, Socket.IO setup
- `server/src/config/index.js` — All configuration
- `server/src/services/apiAggregator.js` — Multi-source data aggregation + failover
- `server/src/services/cacheService.js` — In-memory cache with typed TTLs
- `server/src/services/sportScoreService.js` — Primary free API wrapper
- `server/src/services/footballDataService.js` — Secondary API wrapper
- `server/src/services/wcApiService.js` — World Cup history API
- `server/src/services/injuryService.js` — Injury data aggregation
- `server/src/services/staticDataService.js` — Static fallback data (48 teams, 104 matches, bilingual)
- `server/src/services/socialFetcher.js` — X/Instagram content fetching
- `server/src/services/socialPublisher.js` — Auto-post to X/Instagram
- `server/src/routes/` — 13 route files (health, scores, schedule, standings, stats, injuries, social, matches, predictions, news, weather, historical, videos)
- `server/src/middleware/` — cors, rateLimiter, errorHandler
- `server/src/jobs/` — scorePolling, socialAutoPost, cacheWarmer

### Client
- `client/src/utils/constants.js` — **Single source of truth**: 48 teams with code, bilingual names, group, flag emoji
- `client/src/utils/helpers.js` — `getTeamName()`, `getTeamFlag()`, `getTeam()` all derive from TEAMS constant
- `client/src/components/common/TeamFlag.jsx` — Reusable flag emoji component
- `client/src/components/Standings/` — GroupTable, StandingsPage
- All other React components, hooks, services, i18n, and utilities

## Reference Links

- [SportScore MCP](https://github.com/Backspace-me/sportscore-mcp) — free sports API
- [Football-Data.org](https://www.football-data.org/) — free tier football API
- [Zafronix WC API](https://github.com/zafronix/wc-mcp) — World Cup data
- [X API v2](https://developer.twitter.com/) — social media API
- [2026 World Cup Groups](https://sports.yahoo.com/soccer/article/2026-world-cup-viewers-guide-format-new-rules-how-to-watch-and-everything-you-need-to-know-before-kickoff-183000031.html)
