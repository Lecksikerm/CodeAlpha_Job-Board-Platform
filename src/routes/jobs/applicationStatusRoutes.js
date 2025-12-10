const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jobApplicationController = require('../../controllers/jobApplicationController');

router.put('/:id/status', auth, jobApplicationController.updateApplicationStatus);

module.exports = router;
