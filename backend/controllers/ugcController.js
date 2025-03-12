const axios = require('axios');
const STRAPI_URL = process.env.STRAPI_URL;

// Submit UGC
const submitUGC = async (req, res) => {
  const { title, content, tags } = req.body;
  const ugc = {
    title,
    content,
    status: 'Pending',
    tags: tags || [],
    author: 'anonymous' // Placeholder; add auth later
  };

  try {
    const response = await axios.post(`${STRAPI_URL}/ugcs`, { data: ugc }, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
    });
    res.json(response.data.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit UGC' });
  }
};

// Get approved UGC
const getApprovedUGC = async (req, res) => {
  try {
    const response = await axios.get(`${STRAPI_URL}/ugcs?filters[status][$eq]=Approved`, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
    });
    res.json(response.data.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch UGC' });
  }
};

module.exports = { submitUGC, getApprovedUGC };