require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const healthRoute = require('./routes/health');

const employerAuthRoutes = require('./routes/auth/employerAuth');
const candidateAuthRoutes = require('./routes/auth/candidateAuth');
const jobRoutes = require('./routes/jobs/jobRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const jobApplicationRoutes = require('./routes/jobs/jobApplicationRoutes');
const applicationStatusRoutes = require('./routes/jobs/applicationStatusRoutes');
const applicationTrackingRoutes = require('./routes/applications/applicationTrackingRoutes');
const notificationRoutes = require('./routes/notifications/notificationRoutes');
const adminRoutes = require('./routes/admin/adminRoutes');
const employerApplicationRoutes = require('./routes/employer/employerApplicationRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

app.set('trust proxy', true);

// CORS
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://joblead.netlify.app',
        'https://www.joblead.netlify.app'
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Logger
app.use(morgan('dev'));

// Test Cloudinary config
const cloudinary = require('cloudinary').v2;
console.log('Cloudinary config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
    api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING'
});

// DEBUG: Log resume route registration
console.log('About to register /api/resumes');
app.use('/api/resumes', (req, res, next) => {
    console.log('Resume route accessed:', req.method, req.path);
    console.log('Content-Type:', req.headers['content-type']);
    next();
}, resumeRoutes);
console.log('/api/resumes registered');

// JSON parser AFTER resume routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Other routes
app.use('/api/health', healthRoute);
app.use('/api/auth/employer', employerAuthRoutes);
app.use('/api/auth/candidate', candidateAuthRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', jobApplicationRoutes);
app.use('/api/applications', applicationStatusRoutes);
app.use('/api/applications', applicationTrackingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/employer/applications', employerApplicationRoutes);

// Static files
app.use(express.static('src/public'));

app.get('/', (req, res) => {
    res.send("Job Board Platform API is running successfully");
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err.message);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error'
    });
});

// Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://joblead.netlify.app',
            'https://www.joblead.netlify.app'
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined`);
    });
});

app.set('io', io);


// Start
(async () => {
    try {
        await connectDB();
        console.log('Database connected');
        server.listen(PORT, () => console.log(`Server on port ${PORT}`));
    } catch (err) {
        console.error('Failed to start:', err);
        process.exit(1);
    }
})();





