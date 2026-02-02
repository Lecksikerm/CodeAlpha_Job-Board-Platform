const Resume = require('../models/Resume');

// Upload resume
exports.uploadResume = async (req, res) => {
    try {
        console.log('=== UPLOAD CONTROLLER ===');
        console.log('1. User ID:', req.user?.id);
        console.log('2. Content-Type:', req.headers['content-type']);
        console.log('3. req.file exists:', !!req.file);
        console.log('4. req.body:', req.body);

        if (!req.file) {
            console.log('ERROR: req.file is undefined!');
            console.log('req.files (array):', req.files);
            return res.status(400).json({
                message: 'No file uploaded',
                debug: {
                    contentType: req.headers['content-type'],
                    hasFile: !!req.file,
                    bodyKeys: Object.keys(req.body)
                }
            });
        }

        console.log('5. File details:', {
            path: req.file.path,
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        const resume = new Resume({
            candidateId: req.user.id,
            fileURL: req.file.path,
            fileName: req.file.originalname,
            fileType: req.file.mimetype
        });

        await resume.save();
        console.log('6. Resume saved:', resume._id);

        return res.status(201).json({
            message: 'Resume uploaded successfully',
            resume
        });

    } catch (err) {
        console.error('Upload controller error:', err);
        res.status(500).json({
            message: 'Server error: ' + err.message,
            stack: err.stack
        });
    }
};

// Get all resumes
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

