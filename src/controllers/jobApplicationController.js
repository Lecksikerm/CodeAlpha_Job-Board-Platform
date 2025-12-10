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

exports.updateApplicationStatus = async (req, res) => {
    try {
        const employerId = req.user.id;
        const applicationId = req.params.id;
        const { status } = req.body;

        const allowedStatuses = [
            "applied", "reviewed", "shortlisted", "accepted", "rejected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const application = await JobApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if this employer owns the job
        const job = await JobListing.findById(application.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found for this application' });
        }

        if (job.employerId.toString() !== employerId) {
            return res.status(403).json({
                message: 'Unauthorized: You can only update applications for your own job postings'
            });
        }

        application.status = status;
        await application.save();

        res.json({
            message: 'Application status updated successfully',
            application
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

