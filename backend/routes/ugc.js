const express = require('express');
const router = express.Router();
const { submitUGC, getApprovedUGC } = require('../controllers/ugcController');

router.post('/submit', submitUGC);
router.get('/approved', getApprovedUGC);

module.exports = router;