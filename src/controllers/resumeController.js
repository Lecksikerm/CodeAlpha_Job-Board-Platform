const Resume = require('../models/Resume');
const path = require('path');

exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const resume = new Resume({
            candidateId: req.user.id,
            fileUrl: req.file.path,
            originalName: req.file.originalname
        });

        await resume.save();
        res.status(201).json({ message: 'Resume uploaded successfully', resume });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
