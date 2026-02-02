const express = require('express');
const router = express.Router();
const authCandidate = require('../middleware/authCandidate');
const upload = require('../middleware/upload');
const resumeController = require('../controllers/resumeController');

// POST /api/resumes - Upload new resume
router.post(
    '/',
    authCandidate,
    upload.single('resume'),
    resumeController.uploadResume
);

// GET /api/resumes/my - Get all resumes for logged-in candidate
router.get('/my', authCandidate, resumeController.getMyResumes);

// DELETE /api/resumes/:id - Delete a resume
router.delete('/:id', authCandidate, resumeController.deleteResume);

module.exports = router;

