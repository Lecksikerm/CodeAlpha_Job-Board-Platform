const express = require('express');
const router = express.Router();
const authCandidate = require('../middleware/authCandidate');
const upload = require('../middleware/upload');
const resumeController = require('../controllers/resumeController');

// Middleware to handle multer errors
const handleMulterError = (error, req, res, next) => {
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    next();
};

router.post('/', authCandidate, upload.single('resume'), handleMulterError, resumeController.uploadResume);

module.exports = router;

