const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const applicationTrackingController = require('../../controllers/applicationTrackingController');


router.get('/my', auth, applicationTrackingController.getMyApplications);

module.exports = router;
