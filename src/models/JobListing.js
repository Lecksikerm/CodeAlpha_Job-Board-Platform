const mongoose = require('mongoose');

const JobListingSchema = new mongoose.Schema(
    {
        employerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employer",
            required: true
        },
        title: { type: String, required: true },
        description: { type: String, required: true },
        requirements: [{ type: String }],
        salaryRange: {
            min: { type: Number },
            max: { type: Number }
        },
        jobType: { type: String }, // full-time, part-time, remote, hybrid
        location: { type: String },
        category: { type: String },
        experienceLevel: { type: String }
    },
    { timestamps: true }
);

module.exports = mongoose.model("JobListing", JobListingSchema);
