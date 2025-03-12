
const axios = require('axios');
const STRAPI_URL = process.env.STRAPI_URL;
const API_TOKEN = process.env.STRAPI_API_TOKEN;
const WebSocket = require('ws');

const setupWebSocket = (wss) => {
  wss.on('connection', (ws) => {
    console.log('Client connected to collaboration WebSocket');
    
    // Send a welcome message
    ws.send(JSON.stringify({ type: 'connection', message: 'Connected to WanderPlan collaboration service' }));
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        console.log('Received message:', data);
        
        if (data.type === 'itinerary-update') {
          // Handle itinerary update
          const { itineraryId, update } = data;
          
          try {
            await axios.put(
              `${STRAPI_URL}/itineraries/${itineraryId}`,
              { data: { dailyPlan: update } },
              { headers: { Authorization: `Bearer ${API_TOKEN}` } }
            );
            
            // Broadcast the update to all connected clients
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ 
                  type: 'itinerary-updated',
                  itineraryId, 
                  update,
                  timestamp: new Date().toISOString()
                }));
              }
            });
          } catch (error) {
            console.error('Failed to update itinerary via WebSocket:', error);
            ws.send(JSON.stringify({ 
              type: 'error', 
              message: 'Failed to update itinerary', 
              details: error.message 
            }));
          }
        } else if (data.type === 'join-room') {
          // Handle joining a collaboration room
          const { roomId, userId } = data;
          ws.roomId = roomId;
          ws.userId = userId;
          
          // Notify others in the room
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client.roomId === roomId && client !== ws) {
              client.send(JSON.stringify({ 
                type: 'user-joined', 
                roomId, 
                userId,
                timestamp: new Date().toISOString()
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message processing error:', error);
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Failed to process message', 
          details: error.message 
        }));
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
      // Notify others if they were in a room
      if (ws.roomId) {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN && client.roomId === ws.roomId && client !== ws) {
            client.send(JSON.stringify({ 
              type: 'user-left', 
              roomId: ws.roomId, 
              userId: ws.userId,
              timestamp: new Date().toISOString()
            }));
          }
        });
      }
    });
  });
};

module.exports = setupWebSocket;
