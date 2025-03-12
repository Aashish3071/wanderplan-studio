const axios = require('axios');
const STRAPI_URL = process.env.STRAPI_URL;

// Fetch and calculate budget
const getBudget = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`${STRAPI_URL}/itineraries/${id}`, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
    });
    const itinerary = response.data.data.attributes;
    let total = 0;
    itinerary.dailyPlan.forEach((day) => {
      Object.values(day).forEach((activity) => {
        total += activity.cost || 0;
      });
    });
    const remaining = itinerary.budget - total;
    res.json({ total, remaining, overBudget: remaining < 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch budget' });
  }
};

module.exports = { getBudget };