const axios = require('axios');
const STRAPI_URL = process.env.STRAPI_URL;

// Fetch approved community trips
const getCommunityTrips = async (req, res) => {
  try {
    const response = await axios.get(`${STRAPI_URL}/community-trips?filters[status][$eq]=Approved`, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
    });
    res.json(response.data.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch community trips' });
  }
};

// Submit a community trip
const submitCommunityTrip = async (req, res) => {
  const { title, content, tags } = req.body;
  const trip = {
    title,
    content,
    status: 'Pending',
    tags: tags || [],
    author: 'anonymous' // Placeholder; add auth later
  };

  try {
    const response = await axios.post(`${STRAPI_URL}/community-trips`, { data: trip }, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
    });
    res.json(response.data.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit community trip' });
  }
};

module.exports = { getCommunityTrips, submitCommunityTrip };