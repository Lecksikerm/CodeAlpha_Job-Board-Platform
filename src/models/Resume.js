const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema(
    {
        candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candidate",
            required: true
        },
        fileName: { type: String },
        fileType: { type: String },
        fileURL: { type: String },
        uploadedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Resume", ResumeSchema);
