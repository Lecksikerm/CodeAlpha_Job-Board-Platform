const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const resumeController = require('../controllers/resumeController');

router.post('/', auth, upload.single('resume'), resumeController.uploadResume);

module.exports = router;
