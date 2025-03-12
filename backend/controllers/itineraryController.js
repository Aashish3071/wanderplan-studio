const axios = require('axios');
const STRAPI_URL = process.env.STRAPI_URL;

// Fetch all itineraries
const getItineraries = async (req, res) => {
  try {
    const response = await axios.get(`${STRAPI_URL}/itineraries`, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
    });
    res.json(response.data.data); // Returns [{ id, attributes: { title, dailyPlan, ... } }]
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch itineraries' });
  }
};

// Generate an itinerary (mock AI response)
const generateItinerary = async (req, res) => {
  const { destination, dates, budget, interests } = req.body;
  const itinerary = {
    title: `${destination} Adventure`,
    destinations: [destination],
    dates,
    budget,
    dailyPlan: [
      { day1: { [interests[0] || 'Sightseeing']: { cost: 50, time: '09:00' } } },
      { day2: { [interests[1] || 'Museum']: { cost: 40, time: '10:00' } } }
    ],
    tags: interests || []
  };

  try {
    const response = await axios.post(`${STRAPI_URL}/itineraries`, { data: itinerary }, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
    });
    res.json(response.data.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create itinerary' });
  }
};

// Update itinerary (for collaboration)
const updateItinerary = async (req, res) => {
  const { id } = req.params;
  const { dailyPlan } = req.body;

  try {
    const response = await axios.put(`${STRAPI_URL}/itineraries/${id}`, { data: { dailyPlan } }, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
    });
    res.json(response.data.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update itinerary' });
  }
};

module.exports = { getItineraries, generateItinerary, updateItinerary };