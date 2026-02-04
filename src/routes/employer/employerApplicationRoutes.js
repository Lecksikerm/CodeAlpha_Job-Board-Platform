const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const employerApplicationController = require('../../controllers/employerApplicationController');

router.get('/', auth, employerApplicationController.getEmployerApplications);
router.get('/:id', auth, employerApplicationController.getApplicationDetails);

module.exports = router;