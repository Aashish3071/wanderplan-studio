const express = require('express');
const router = express.Router();
const { getItineraries, generateItinerary, updateItinerary } = require('../controllers/itineraryController');

router.get('/', getItineraries);
router.post('/generate', generateItinerary);
router.put('/:id', updateItinerary);

module.exports = router;