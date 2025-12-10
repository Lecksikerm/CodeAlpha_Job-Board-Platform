require('dotenv').config();
const connectDB = require('./config/db');

const Employer = require('./models/Employer');
const Candidate = require('./models/Candidate');
const JobListing = require('./models/JobListing');
const JobApplication = require('./models/JobApplication');
const Resume = require('./models/Resume');

(async () => {
    await connectDB();

    console.log("Models loaded successfully:");
    console.log({
        Employer: Employer.modelName,
        Candidate: Candidate.modelName,
        JobListing: JobListing.modelName,
        JobApplication: JobApplication.modelName,
        Resume: Resume.modelName
    });

    process.exit(0);
})();
