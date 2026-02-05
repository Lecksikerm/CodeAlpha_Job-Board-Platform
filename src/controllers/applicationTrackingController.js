const JobApplication = require('../models/JobApplication');
const JobListing = require('../models/JobListing');

exports.getMyApplications = async (req, res) => {
    try {
        const userId = req.user.id;

        const applications = await JobApplication.find({ candidateId: userId })
            .populate({
                path: 'jobId',
                select: 'title companyName location jobType description salary createdAt',
                populate: {
                    path: 'employerId',
                    select: 'companyName logo'
                }
            })
            .sort({ createdAt: -1 });

        const formattedApplications = applications.map(app => ({
            _id: app._id,
            status: app.status,
            coverLetter: app.coverLetter,
            resumeURL: app.resumeURL,
            appliedAt: app.createdAt,
            job: {
                _id: app.jobId?._id,
                title: app.jobId?.title,
                company: app.jobId?.companyName || app.jobId?.employerId?.companyName || 'Unknown Company',
                location: app.jobId?.location,
                type: app.jobId?.jobType,
                description: app.jobId?.description,
                salary: app.jobId?.salary,
                postedAt: app.jobId?.createdAt
            }
        }));

        return res.status(200).json({
            status: 'success',
            results: applications.length,
            applications: formattedApplications
        });

    } catch (err) {
        console.error('Error getting user applications:', err);
        return res.status(500).json({
            status: 'error',
            message: 'Server error fetching applications'
        });
    }
};

exports.getApplicationById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const application = await JobApplication.findOne({
            _id: id,
            candidateId: userId
        }).populate({
            path: 'jobId',
            select: 'title companyName location jobType description salary createdAt'
        });

        if (!application) {
            return res.status(404).json({
                status: 'error',
                message: 'Application not found'
            });
        }

        const formattedApplication = {
            _id: application._id,
            status: application.status,
            coverLetter: application.coverLetter,
            resumeURL: application.resumeURL,
            appliedAt: application.createdAt,
            job: {
                _id: application.jobId?._id,
                title: application.jobId?.title,
                company: application.jobId?.companyName,
                location: application.jobId?.location,
                type: application.jobId?.jobType,
                description: application.jobId?.description,
                salary: application.jobId?.salary,
                postedAt: application.jobId?.createdAt
            }
        };

        return res.status(200).json({
            status: 'success',
            application: formattedApplication
        });

    } catch (err) {
        console.error('Error getting application:', err);
        return res.status(500).json({
            status: 'error',
            message: 'Server error fetching application'
        });
    }
};

