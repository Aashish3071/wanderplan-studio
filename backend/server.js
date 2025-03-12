
require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const itineraryRoutes = require('./routes/itineraries');
const budgetRoutes = require('./routes/budgets');
const insightsRoutes = require('./routes/insights');
const communityRoutes = require('./routes/community');
const ugcRoutes = require('./routes/ugc');
const weatherRoutes = require('./routes/weather');
const setupWebSocket = require('./websocket/collaboration');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/community-trips', communityRoutes);
app.use('/api/ugc', ugcRoutes);
app.use('/api/weather', weatherRoutes);

// WebSocket setup
setupWebSocket(wss);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
