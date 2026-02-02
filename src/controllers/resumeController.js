const Resume = require('../models/Resume');

// Upload resume (Cloudinary handles the upload via multer middleware)
exports.uploadResume = async (req, res) => {
    try {
        console.log('Upload request from user:', req.user?.id);
        console.log('File received:', req.file ? 'YES' : 'NO');

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('File details:', {
            path: req.file.path,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype
        });

        const resume = new Resume({
            candidateId: req.user.id,
            fileURL: req.file.path,
            fileName: req.file.originalname,
            fileType: req.file.mimetype
        });

        await resume.save();
        console.log('Resume saved with ID:', resume._id);

        return res.status(201).json({
            message: 'Resume uploaded successfully',
            resume
        });

    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};

// Get all resumes for logged-in candidate
exports.getMyResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ candidateId: req.user.id })
            .sort({ createdAt: -1 });

        console.log(`Found ${resumes.length} resumes for user ${req.user.id}`);
        res.json(resumes);
    } catch (err) {
        console.error('Get resumes error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete resume
exports.deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            candidateId: req.user.id
        });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        await resume.deleteOne();
        res.json({ message: 'Resume deleted successfully' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

