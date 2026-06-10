# Contributing / Handoff Guide

This project is a React + Express app split into `client/` and `server/`.

## Local Setup

1. Install Node.js 20 LTS or newer.
2. Install dependencies:

```bash
npm install
cd server && npm install
cd ../client && npm install
```

3. Copy environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

4. For local development, `client/.env` can leave `VITE_API_URL` empty or omit it.
5. Start the apps in two terminals:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

On Windows PowerShell, use `npm.cmd run dev` if `npm` is blocked by execution policy.

## Validation Before Pushing

Run these checks before committing:

```bash
npm run build
node -c server/src/index.js
node -c server/src/routes/news.js
node -c server/src/services/translateService.js
```

## Git Hygiene

Do not commit:

- `node_modules/`
- `client/dist/`
- `.env`, `.env.local`, `.env.production`
- `*.log`

If generated files were accidentally added, untrack them before committing:

```bash
git rm -r --cached node_modules client/node_modules server/node_modules client/dist
```

## Deployment Notes

Frontend:

- GitHub Pages builds from `client/`.
- Set repository secret `VITE_API_URL` to the deployed backend origin, for example `https://your-api.vercel.app`.

Backend:

- Vercel deploys from `server/`.
- Required secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
- Backend environment should include `CLIENT_URLS`, for example:

```env
CLIENT_URLS=http://localhost:5173,https://your-name.github.io
```

Live scores:

- The frontend polls as a fallback.
- Socket.IO live push needs a persistent Node host and `VITE_SOCKET_URL`; ordinary Vercel serverless functions are not ideal for long-lived sockets.
