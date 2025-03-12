
const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

// Get weather data for a city
router.get('/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const weatherApiKey = process.env.WEATHER_API_KEY;
    
    if (!weatherApiKey || weatherApiKey === 'your-weatherapi-key-here') {
      return res.status(500).json({ error: 'Weather API key not configured' });
    }
    
    const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${city}&days=5&aqi=no&alerts=no`);
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router;
