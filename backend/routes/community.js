const express = require('express');
const router = express.Router();
const { getCommunityTrips, submitCommunityTrip } = require('../controllers/communityController');

router.get('/', getCommunityTrips);
router.post('/', submitCommunityTrip);

module.exports = router;