const mongoose = require('mongoose');

const EmployerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        companyName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        companyWebsite: { type: String },
        industry: { type: String },
        location: { type: String },
        role: { type: String, default: "employer" },
        isAdmin: { type: Boolean, default: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Employer", EmployerSchema);
