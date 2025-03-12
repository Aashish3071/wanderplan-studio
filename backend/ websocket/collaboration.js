const axios = require('axios');
const STRAPI_URL = process.env.STRAPI_URL;

const setupWebSocket = (wss) => {
  wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
      const { itineraryId, update } = JSON.parse(message);
      try {
        await axios.put(
          `${STRAPI_URL}/itineraries/${itineraryId}`,
          { data: { dailyPlan: update } },
          { headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } }
        );
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ itineraryId, update }));
          }
        });
      } catch (error) {
        console.error('Failed to update itinerary via WebSocket:', error);
      }
    });
  });
};

module.exports = setupWebSocket;