const JobApplication = require('../models/JobApplication');
const JobListing = require('../models/JobListing');

exports.getMyApplications = async (req, res) => {
    try {
        const userId = req.user.id;

        let applications = await JobApplication.find({ candidateId: userId })
            .populate('jobId', 'title companyName location jobType')
            .sort({ createdAt: -1 });

        applications = applications.map(app => ({
            ...app.toObject(),
            job: app.jobId
        }));

        return res.status(200).json({
            status: 'success',
            results: applications.length,
            applications
        });

    } catch (err) {
        console.error('Error getting user applications:', err);
        return res.status(500).json({
            status: 'error',
            message: 'Server error fetching applications'
        });
    }
};

