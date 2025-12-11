const Employer = require('../models/Employer');
const Candidate = require('../models/Candidate');
const JobListing = require('../models/JobListing');
const JobApplication = require('../models/JobApplication');

exports.getUsers = async (req, res) => {
    try {
        if (!req.user.isAdmin) return res.status(403).json({ message: 'Unauthorized' });

        const employers = await Employer.find().select('-password');
        const candidates = await Candidate.find().select('-password');

        res.json({ employers, candidates });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getReports = async (req, res) => {
    try {
        if (!req.user.isAdmin) return res.status(403).json({ message: 'Unauthorized' });

        const totalJobs = await JobListing.countDocuments();
        const totalApplications = await JobApplication.countDocuments();
        const applicationsByStatus = await JobApplication.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        res.json({
            totalJobs,
            totalApplications,
            applicationsByStatus
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
