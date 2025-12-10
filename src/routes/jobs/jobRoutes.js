const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const jobController = require('../../controllers/jobController');
const auth = require('../../middleware/auth');

// Create job (Employer only)
router.post(
    '/',
    auth,
    [
        body('title').notEmpty().withMessage('Job title is required'),
        body('description').notEmpty().withMessage('Job description is required'),
        body('location').notEmpty().withMessage('Location is required')
    ],
    jobController.createJob
);

router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.put('/:id', auth, jobController.updateJob);
router.delete('/:id', auth, jobController.deleteJob);



module.exports = router;
