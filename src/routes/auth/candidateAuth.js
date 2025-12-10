const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');

router.post('/register', authController.registerCandidate);
router.post('/login', authController.loginCandidate);

module.exports = router;
