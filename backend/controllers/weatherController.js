
const axios = require('axios');
const STRAPI_URL = process.env.STRAPI_URL;
const API_TOKEN = process.env.STRAPI_API_TOKEN;

// Get weather data for a specific city
const getWeather = async (req, res) => {
  const { city } = req.params;
  
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/local-insights?filters[city][$eq]=${city}&filters[category][$eq]=Weather&sort=lastUpdated:desc&pagination[limit]=1`,
      {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      }
    );
    
    if (response.data.data && response.data.data.length > 0) {
      res.json(response.data.data[0]);
    } else {
      // If no weather data exists, try to fetch from the API
      try {
        await updateCityWeather(city);
        const newResponse = await axios.get(
          `${STRAPI_URL}/api/local-insights?filters[city][$eq]=${city}&filters[category][$eq]=Weather&sort=lastUpdated:desc&pagination[limit]=1`,
          {
            headers: { Authorization: `Bearer ${API_TOKEN}` }
          }
        );
        if (newResponse.data.data && newResponse.data.data.length > 0) {
          res.json(newResponse.data.data[0]);
        } else {
          res.status(404).json({ error: 'Weather data not available for this city' });
        }
      } catch (error) {
        res.status(404).json({ error: 'Weather data not available for this city' });
      }
    }
  } catch (error) {
    console.error(`Failed to fetch weather for ${city}:`, error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};

// Update weather data (can be triggered manually or by a scheduled task)
const updateWeather = async (req, res) => {
  const { cities } = req.body;
  
  if (!cities || !Array.isArray(cities) || cities.length === 0) {
    return res.status(400).json({ error: 'Please provide an array of cities' });
  }
  
  try {
    const results = [];
    for (const city of cities) {
      try {
        const weatherData = await updateCityWeather(city);
        results.push({ city, success: true, data: weatherData });
      } catch (error) {
        results.push({ city, success: false, error: error.message });
      }
    }
    res.json({ results });
  } catch (error) {
    console.error('Failed to update weather:', error);
    res.status(500).json({ error: 'Failed to update weather data' });
  }
};

// Helper function to update weather for a specific city
const updateCityWeather = async (city) => {
  if (!process.env.WEATHER_API_KEY) {
    throw new Error('Weather API key is not configured');
  }
  
  try {
    const weather = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`
    );
    
    const insight = {
      data: {
        city,
        category: 'Weather',
        content: `Current temp: ${weather.data.current.temp_c}°C, Condition: ${weather.data.current.condition.text}`,
        source: 'WeatherAPI',
        lastUpdated: new Date().toISOString()
      }
    };
    
    const response = await axios.post(`${STRAPI_URL}/api/local-insights`, insight, {
      headers: { 
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Failed to update weather for ${city}:`, error);
    throw new Error(`Failed to update weather for ${city}`);
  }
};

// Set up periodic weather updates (every hour)
const scheduledUpdate = async () => {
  try {
    const cities = ['Dubai', 'Bali', 'Paris', 'NYC', 'Tokyo', 'London', 'Sydney', 'Rome'];
    for (const city of cities) {
      try {
        await updateCityWeather(city);
        console.log(`Updated weather for ${city}`);
      } catch (error) {
        console.error(`Failed to update weather for ${city}:`, error);
      }
    }
  } catch (error) {
    console.error('Failed to perform scheduled weather update:', error);
  }
};

// Run the update once when the server starts
setTimeout(() => {
  scheduledUpdate().catch(console.error);
}, 10000); // Wait 10 seconds after server start

// Then schedule it to run every hour
setInterval(scheduledUpdate, 60 * 60 * 1000);

module.exports = { getWeather, updateWeather };
