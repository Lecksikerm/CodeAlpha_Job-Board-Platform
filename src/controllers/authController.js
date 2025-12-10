const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Employer = require('../models/Employer');
const Candidate = require('../models/Candidate');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

module.exports = {
    registerEmployer: async (req, res) => {
        try {
            const { name, companyName, email, password } = req.body;

            if (!name || !companyName || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const existing = await Employer.findOne({ email });
            if (existing) {
                return res.status(400).json({ message: "Employer already exists" });
            }

            const hashed = await bcrypt.hash(password, 10);

            const employer = await Employer.create({
                name,
                companyName,
                email,
                password: hashed
            });

            return res.status(201).json({
                message: "Employer registered successfully",
                token: generateToken(employer)
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    registerCandidate: async (req, res) => {
        try {
            const { fullName, email, password } = req.body;

            if (!fullName || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const existing = await Candidate.findOne({ email });
            if (existing) {
                return res.status(400).json({ message: "Candidate already exists" });
            }

            const hashed = await bcrypt.hash(password, 10);

            const candidate = await Candidate.create({
                fullName,
                email,
                password: hashed
            });

            return res.status(201).json({
                message: "Candidate registered successfully",
                token: generateToken(candidate)
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    loginEmployer: async (req, res) => {
        try {
            const { email, password } = req.body;

            const employer = await Employer.findOne({ email });
            if (!employer) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const match = await bcrypt.compare(password, employer.password);
            if (!match) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            return res.json({
                message: "Login successful",
                token: generateToken(employer)
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    loginCandidate: async (req, res) => {
        try {
            const { email, password } = req.body;

            const candidate = await Candidate.findOne({ email });
            if (!candidate) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const match = await bcrypt.compare(password, candidate.password);
            if (!match) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            return res.json({
                message: "Login successful",
                token: generateToken(candidate)
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
