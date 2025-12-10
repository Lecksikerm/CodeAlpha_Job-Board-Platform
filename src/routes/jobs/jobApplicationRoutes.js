const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jobApplicationController = require('../../controllers/jobApplicationController');


router.post('/', auth, jobApplicationController.applyToJob);

module.exports = router;
