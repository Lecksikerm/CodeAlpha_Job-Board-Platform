const JobApplication = require('../models/JobApplication');
const JobListing = require('../models/JobListing');
const Resume = require('../models/Resume');
const Notification = require('../models/Notification');


// APPLY TO JOB
exports.applyToJob = async (req, res) => {
    try {
        const candidateId = req.user.id;
        const { jobId, resumeId } = req.body;

        // Get Socket.IO instance from app
        const io = req.app.get('io');

        // Validate job
        const job = await JobListing.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Validate resume belongs to candidate
        const resume = await Resume.findOne({ _id: resumeId, candidateId });
        if (!resume) return res.status(403).json({ message: 'Invalid resume' });

        // Prevent double application
        const existing = await JobApplication.findOne({ jobId, candidateId });
        if (existing) return res.status(400).json({ message: 'You already applied to this job' });

        // Create job application
        const application = new JobApplication({
            jobId,
            candidateId,
            resumeId
        });

        await application.save();

        // CREATE NOTIFICATION IN DATABASE
        const notification = await Notification.create({
            employer: job.employerId,
            message: `A new candidate applied for your job: ${job.title}`,
            jobId,
            candidateId
        });

        // SEND REAL-TIME NOTIFICATION
        // Employer receives it in room = employerId
        io.to(job.employerId.toString()).emit('new_notification', {
            message: `New application for ${job.title}`,
            jobId,
            candidateId,
            notification
        });

        return res.status(201).json({
            message: 'Applied to job successfully',
            application,
            notification
        });

    } catch (err) {
        console.error('Error applying to job:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// UPDATE APPLICATION STATUS (Employer only)
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

        // Check if employer owns the job
        const job = await JobListing.findById(application.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found for this application' });
        }

        if (job.employerId.toString() !== employerId && !req.user.isAdmin) {
            return res.status(403).json({
                message: 'Unauthorized: You can only update applications for your own job postings or you must be an admin'
            });
        }

        application.status = status;
        await application.save();

        return res.json({
            message: 'Application status updated successfully',
            application
        });

    } catch (err) {
        console.error('Error updating application status:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


