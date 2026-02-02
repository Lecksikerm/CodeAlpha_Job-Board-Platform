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

const app = express();

const PORT = process.env.PORT || 5000;

app.set('trust proxy', true);

// CORS first
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

// Logger
app.use(morgan('dev'));

// Test Cloudinary config on startup
const cloudinary = require('cloudinary').v2;
console.log('Cloudinary config check:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
    api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING'
});

app.use('/api/resumes', resumeRoutes);

// Now add JSON body parser for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Other API Routes
app.use('/api/health', healthRoute);
app.use('/api/auth/employer', employerAuthRoutes);
app.use('/api/auth/candidate', candidateAuthRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', jobApplicationRoutes);
app.use('/api/applications', applicationStatusRoutes);
app.use('/api/applications', applicationTrackingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files
app.use(express.static('src/public'));

// Health check
app.get('/', (req, res) => {
    res.send("Job Board Platform API is running successfully");
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// HTTP Server + Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// SOCKET.IO — Real-time communication
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Expose io to controllers
app.set('io', io);

// Start Server
(async () => {
    try {
        await connectDB();
        console.log('Database connected successfully');

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
})();





