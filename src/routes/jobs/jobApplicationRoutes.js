const express = require('express');
const router = express.Router();
const authCandidate = require('../../middleware/authCandidate');
const jobApplicationController = require('../../controllers/jobApplicationController');


router.post('/', authCandidate, jobApplicationController.applyToJob);

module.exports = router;
