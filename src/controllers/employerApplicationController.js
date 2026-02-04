const JobApplication = require('../models/JobApplication');
const JobListing = require('../models/JobListing');

// Get all applications for employer's jobs
exports.getEmployerApplications = async (req, res) => {
    try {
        const employerId = req.user.id;

        // Get all jobs posted by this employer
        const jobs = await JobListing.find({ employerId }).select('_id title');
        const jobIds = jobs.map(job => job._id);

        // Get all applications for these jobs
        const applications = await JobApplication.find({ jobId: { $in: jobIds } })
            .populate('jobId', 'title location jobType')
            .populate('candidateId', 'fullName email')
            .sort({ createdAt: -1 });

        // Group by job
        const groupedByJob = jobs.map(job => ({
            jobId: job._id,
            jobTitle: job.title,
            applications: applications
                .filter(app => app.jobId._id.toString() === job._id.toString())
                .map(app => ({
                    _id: app._id,
                    candidate: app.candidateId,
                    resumeURL: app.resumeURL, 
                    coverLetter: app.coverLetter,
                    status: app.status,
                    appliedAt: app.createdAt
                }))
        }));

        res.json({
            totalApplications: applications.length,
            jobs: groupedByJob
        });

    } catch (err) {
        console.error('Error getting employer applications:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single application details
exports.getApplicationDetails = async (req, res) => {
    try {
        const employerId = req.user.id;
        const applicationId = req.params.id;

        const application = await JobApplication.findById(applicationId)
            .populate('jobId')
            .populate('candidateId', 'fullName email phoneNumber');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Verify employer owns the job
        if (application.jobId.employerId.toString() !== employerId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.json(application);

    } catch (err) {
        console.error('Error getting application details:', err);
        res.status(500).json({ message: 'Server error' });
    }
};