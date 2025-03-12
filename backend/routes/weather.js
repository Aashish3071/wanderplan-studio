
const express = require('express');
const router = express.Router();
const { getWeather, updateWeather } = require('../controllers/weatherController');

router.get('/:city', getWeather);
router.post('/update', updateWeather);

module.exports = router;
