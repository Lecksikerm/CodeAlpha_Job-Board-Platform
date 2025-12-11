const express = require('express');
const router = express.Router();
const authCandidate = require('../../middleware/authCandidate');
const applicationTrackingController = require('../../controllers/applicationTrackingController');


router.get('/my', authCandidate, applicationTrackingController.getMyApplications);

module.exports = router;
