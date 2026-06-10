const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const config = require('./config');
const { errorHandler } = require('./middleware/errorHandler');
const { corsMiddleware } = require('./middleware/cors');
const { globalRateLimiter } = require('./middleware/rateLimiter');

// Route imports
const healthRoutes = require('./routes/health');
const scoresRoutes = require('./routes/scores');
const scheduleRoutes = require('./routes/schedule');
const standingsRoutes = require('./routes/standings');
const statsRoutes = require('./routes/stats');
const injuriesRoutes = require('./routes/injuries');
const socialRoutes = require('./routes/social');
const matchDetailRoutes = require('./routes/matchDetail');
const predictionsRoutes = require('./routes/predictions');
const newsRoutes = require('./routes/news');
const weatherRoutes = require('./routes/weather');
const historicalRoutes = require('./routes/historical');
const videosRoutes = require('./routes/videos');

const app = express();
const server = http.createServer(app);

// Socket.IO for real-time score push
const io = new Server(server, {
  cors: {
    origin: config.clientUrls,
    methods: ['GET'],
  },
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors(corsMiddleware));
app.use(express.json());
app.use(globalRateLimiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/standings', standingsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/injuries', injuriesRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/matches', matchDetailRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/historical', historicalRoutes);
app.use('/api/videos', videosRoutes);

// Error handler
app.use(errorHandler);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('subscribe', (channel) => {
    socket.join(channel);
    console.log(`${socket.id} subscribed to ${channel}`);
  });

  socket.on('unsubscribe', (channel) => {
    socket.leave(channel);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start background jobs (only if not in test mode)
if (config.nodeEnv !== 'test') {
  try {
    require('./jobs/scorePolling').start(io);
    require('./jobs/socialAutoPost').start();
    require('./jobs/cacheWarmer').start();
  } catch (err) {
    console.warn('Background jobs could not be started:', err.message);
  }
}

server.listen(config.port, () => {
  console.log(`World Cup Assistant API running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});

module.exports = app; // for testing
