const JobApplication = require('../models/JobApplication');
const JobListing = require('../models/JobListing');
const Resume = require('../models/Resume');

exports.applyToJob = async (req, res) => {
    try {
        const candidateId = req.user.id;
        const { jobId, resumeId } = req.body;


        const job = await JobListing.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });


        const resume = await Resume.findOne({ _id: resumeId, candidateId });
        if (!resume) return res.status(403).json({ message: 'Invalid resume' });

        const existing = await JobApplication.findOne({ jobId, candidateId });
        if (existing) return res.status(400).json({ message: 'You already applied to this job' });

        const application = new JobApplication({
            jobId,
            candidateId,
            resumeId
        });

        await application.save();

        res.status(201).json({ message: 'Applied to job successfully', application });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
