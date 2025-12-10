const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phoneNumber: { type: String },
        skills: [{ type: String }],
        experience: { type: String },
        resumeURL: { type: String },
        role: { type: String, default: "candidate" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Candidate", CandidateSchema);
