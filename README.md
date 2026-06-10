# 2026 世界杯观赛助手 | World Cup Assistant

中英双语的 2026 FIFA World Cup 观赛助手：赛程、即时比分、积分榜、统计、伤病、新闻、视频、历史数据和预测集中在一个 React + Express 应用里。

## Features

- Live scores with polling fallback and optional Socket.IO push
- Full schedule and match cards
- Group standings and team translations
- Stats, injuries, social feed, videos, news, history, and predictions
- Chinese-first UI with English fallback
- Static fallback data when external APIs are unavailable

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Realtime | Socket.IO optional push, polling fallback |
| i18n | react-i18next |
| Frontend deploy | GitHub Pages |
| Backend deploy | Vercel |
| Data sources | SportScore, Football-Data.org, Zafronix, BSD, Highlightly, YouTube, OpenWeatherMap, RSS |

## Project Structure

```text
world-cup-assistant/
├── client/              # React frontend
├── server/              # Express backend
├── .github/workflows/   # GitHub Actions deployment
├── AGENTS.md            # Project work record
├── CONTRIBUTING.md      # Handoff and contribution notes
└── README.md
```

## Local Development

Prerequisites:

- Node.js 20 LTS or newer
- npm 9 or newer

Install dependencies:

```bash
npm install
cd server && npm install
cd ../client && npm install
```

Create local environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

For local development, `client/.env` can leave `VITE_API_URL` empty because Vite proxies `/api` to `http://localhost:3001`.

Run backend:

```bash
cd server
npm run dev
```

Run frontend in another terminal:

```bash
cd client
npm run dev
```

Open:

```text
http://localhost:5173/world-cup-assistant/
```

Windows PowerShell note: if `npm` is blocked by execution policy, use `npm.cmd`, for example `npm.cmd run dev`.

## Environment Variables

Server variables live in `server/.env`:

```env
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5173,https://your-name.github.io
SPORTSCORE_API_BASE=https://sportscore.com
FOOTBALL_DATA_API_KEY=your_key_here
AUTO_POST_ENABLED=false
AI_SUMMARY_LANG=zh
```

Frontend variables live in `client/.env`:

```env
VITE_API_URL=https://your-vercel-api.vercel.app
VITE_SOCKET_URL=
```

Use real keys only in local `.env` files or deployment secrets. Do not commit secrets.

## Build and Checks

```bash
npm run build
node -c server/src/index.js
node -c server/src/routes/news.js
node -c server/src/services/translateService.js
```

## Deployment

### Frontend: GitHub Pages

The workflow `.github/workflows/deploy-client.yml` builds `client/` and publishes `client/dist` to `gh-pages`.

Repository secret required:

- `VITE_API_URL`: deployed backend origin, for example `https://your-api.vercel.app`

### Backend: Vercel

The workflow `.github/workflows/deploy-server.yml` deploys `server/` to Vercel.

Repository secrets required:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Vercel environment variables to set:

- `CLIENT_URLS`
- `FOOTBALL_DATA_API_KEY` if using Football-Data backup
- Optional: `YOUTUBE_API_KEY`, `OPENWEATHER_API_KEY`, `AI_API_KEY`, X/Instagram keys

### Realtime Notes

The frontend can work without production WebSocket support because it polls for updates. If you want live push in production, deploy a persistent Socket.IO server and set `VITE_SOCKET_URL`.

## Uploading to GitHub

From a machine with Git and GitHub CLI installed:

```bash
git init
git add .
git commit -m "Prepare World Cup assistant for handoff"
git branch -M main
git remote add origin https://github.com/<owner>/<repo>.git
git push -u origin main
```

Do not add `node_modules/`, `client/dist/`, `.env`, or log files. They are covered by `.gitignore`.

## Known Limitations

- Some social APIs require elevated access or app review.
- RSS translation quality depends on free translation availability unless `AI_API_KEY` is configured.
- Socket.IO live push needs a persistent Node host; Vercel serverless should rely on polling fallback.

## License

MIT
