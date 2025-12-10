require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const connectDB = require('./config/db');
const healthRoute = require('./routes/health');

const employerAuthRoutes = require('./routes/auth/employerAuth');
const candidateAuthRoutes = require('./routes/auth/candidateAuth');
const jobRoutes = require('./routes/jobs/jobRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const jobApplicationRoutes = require('./routes/jobs/jobApplicationRoutes');
const applicationStatusRoutes = require('./routes/jobs/applicationStatusRoutes');



const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.use('/api/health', healthRoute);

// Auth Routes
app.use('/api/auth/employer', employerAuthRoutes);
app.use('/api/auth/candidate', candidateAuthRoutes);

// Job Routes
app.use('/api/jobs', jobRoutes);

// Resume Routes
app.use('/api/resumes', resumeRoutes);

// Job Application Routes
app.use('/api/applications', jobApplicationRoutes);

// Job Application Status Routes
app.use('/api/applications', applicationStatusRoutes);

// Root Route
app.get('/', (req, res) => res.send('Job Board Platform is running'));

const PORT = process.env.PORT || 5000;

(async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
})();

