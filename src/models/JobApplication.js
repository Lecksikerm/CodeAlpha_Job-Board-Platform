const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobListing",
            required: true
        },
        candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candidate",
            required: true
        },
        resumeURL: { type: String },
        coverLetter: { type: String },
        status: {
            type: String,
            default: "applied",
            enum: ["applied", "reviewed", "shortlisted", "accepted", "rejected"]
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("JobApplication", JobApplicationSchema);
