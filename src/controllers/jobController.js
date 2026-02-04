const JobListing = require('../models/JobListing');
const Employer = require('../models/Employer');
const parseSalaryRange = require('../utils/parseSalary');

exports.createJob = async (req, res) => {
    try {
        const employerId = req.user.id;
        const employer = await Employer.findById(employerId);

        if (!employer) return res.status(403).json({ message: 'Only employers can post jobs' });

        const { title, description, location, jobType, salaryRange: salaryStr } = req.body;
        const salaryRange = parseSalaryRange(salaryStr);

        const job = new JobListing({
            employerId,
            title,
            description,
            location,
            jobType,
            salaryRange,
            requirements: req.body.requirements || []
        });

        await job.save();
        res.status(201).json({ message: 'Job created successfully', job });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filters = {};
        if (req.query.keyword) {
            filters.title = { $regex: req.query.keyword, $options: 'i' };
        }
        if (req.query.location) {
            filters.location = { $regex: req.query.location, $options: 'i' };
        }
        if (req.query.jobType) {
            filters.jobType = req.query.jobType;
        }

        const totalJobs = await JobListing.countDocuments(filters);

        const jobs = await JobListing.find(filters)
            .populate('employerId', 'companyName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            page,
            limit,
            totalJobs,
            totalPages: Math.ceil(totalJobs / limit),
            jobs
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getJobById = async (req, res) => {
    try {
        const job = await JobListing.findById(req.params.id).populate('employerId', 'companyName email');
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyJobs = async (req, res) => {
    try {
        const employerId = req.user.id;

        console.log('Fetching jobs for employer:', employerId);

        const jobs = await JobListing.find({ employerId })
            .sort({ createdAt: -1 });

        console.log(`Found ${jobs.length} jobs`);

        res.json({
            jobs,
            count: jobs.length
        });

    } catch (err) {
        console.error('Error in getMyJobs:', err);
        res.status(500).json({
            message: 'Server error',
            error: err.message
        });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const employerId = req.user.id;
        const jobId = req.params.id;

        console.log('Update attempt:', { employerId, jobId });

        const job = await JobListing.findById(jobId);
        if (!job) {
            console.log('Job not found');
            return res.status(404).json({ message: 'Job not found' });
        }

        console.log('Comparing IDs:', {
            jobEmployerId: job.employerId.toString(),
            requestUserId: employerId.toString()
        });

        if (job.employerId.toString() !== employerId.toString()) {
            console.log('Unauthorized: IDs do not match');
            return res.status(403).json({ message: 'Unauthorized: Cannot update this job' });
        }

        const { title, description, location, jobType, salaryRange, requirements } = req.body;

        if (title) job.title = title;
        if (description) job.description = description;
        if (location) job.location = location;
        if (jobType) job.jobType = jobType;
        if (salaryRange) job.salaryRange = parseSalaryRange(salaryRange);
        if (requirements) job.requirements = requirements;

        await job.save();
        console.log('Job updated successfully');

        res.json({ message: 'Job updated successfully', job });
    } catch (err) {
        console.error('Update job error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const employerId = req.user.id;
        const jobId = req.params.id;

        const job = await JobListing.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        
        if (job.employerId.toString() !== employerId.toString()) {
            return res.status(403).json({ message: 'Unauthorized: Cannot delete this job' });
        }

        await job.deleteOne();
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        console.error('Delete job error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


