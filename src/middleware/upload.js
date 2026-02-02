const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'resumes',
        allowed_formats: ['pdf', 'doc', 'docx'],
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, 
        files: 1
    },
    fileFilter: (req, file, cb) => {
        console.log('Multer received file:', file.originalname, file.mimetype);
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type: ${file.mimetype}. Only PDF and Word allowed.`), false);
        }
    }
});

module.exports = upload;



