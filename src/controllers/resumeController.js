const Resume = require('../models/Resume');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const resume = new Resume({
            candidateId: req.user.id,
            fileURL: req.file.path, 
            fileName: req.file.originalname,
            fileType: req.file.mimetype
        });

        await resume.save();
        return res.status(201).json({ message: 'Resume uploaded successfully', resume });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

