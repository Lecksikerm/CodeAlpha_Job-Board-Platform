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

app.use(cors({
    origin: "*",          
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// Serve static test files (notification test)
app.use(express.static('src/public'));

// API Routes
app.use('/api/health', healthRoute);
app.use('/api/auth/employer', employerAuthRoutes);
app.use('/api/auth/candidate', candidateAuthRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/applications', jobApplicationRoutes);
app.use('/api/applications', applicationStatusRoutes);
app.use('/api/applications', applicationTrackingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
    res.send("Job Board Platform API is running successfully");
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

    // Employer joins specific room
    socket.on('join', (employerId) => {
        socket.join(employerId);
        console.log(`Employer ${employerId} joined notifications`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Expose io to controllers
app.set('io', io);


// Start Server
(async () => {
    await connectDB();

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})();





