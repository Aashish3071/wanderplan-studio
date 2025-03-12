const axios = require('axios');
const STRAPI_URL = process.env.STRAPI_URL;

// Fetch insights
const getInsights = async (req, res) => {
  try {
    const response = await axios.get(`${STRAPI_URL}/local-insights`, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
    });
    res.json(response.data.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
};

// Update weather (hourly)
const updateWeather = async () => {
  const cities = ['Dubai', 'Bali', 'Paris', 'NYC', 'Tokyo'];
  for (const city of cities) {
    try {
      const weather = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`
      );
      const insight = {
        city,
        category: 'Weather',
        content: `Current temp: ${weather.data.current.temp_c}°C`,
        source: 'API',
        lastUpdated: new Date().toISOString()
      };
      await axios.post(`${STRAPI_URL}/local-insights`, { data: insight }, {
        headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
      });
    } catch (error) {
      console.error(`Failed to update weather for ${city}:`, error);
    }
  }
};

setInterval(updateWeather, 60 * 60 * 1000);

module.exports = { getInsights, updateWeather };