# Job Board Platform

A full-featured job board system for Employers, Candidates, and Admins with real-time notifications and reporting.

Table of Contents

Project Overview

Features

Tech Stack

Getting Started

Environment Variables

API Endpoints

Socket.IO Notifications

Admin Panel

Future Enhancements

License

Project Overview

The Job Board Platform is a backend system designed to manage job postings, candidate applications, and real-time notifications.
It allows:

Employers to post, update, delete, and manage jobs

Candidates to upload resumes and apply to jobs

Admins to manage users and view reports

Real-time notifications to employers when new applications arrive

Features
For Employers:

Create, update, delete job listings

View applications for their jobs

Receive real-time notifications when candidates apply

For Candidates:

Upload resumes (.pdf, .doc, .docx)

Apply to jobs

Track application status

For Admin:

View all users (Employers & Candidates)

Generate reports: total jobs, total applications, applications by status

Other Features:

Pagination and search filters for jobs

JWT-based authentication and role-based authorization

Real-time notifications via Socket.IO

Tech Stack
Layer	Technology
Backend	Node.js, Express.js
Database	MongoDB, Mongoose
Authentication	JWT (JSON Web Tokens)
File Uploads	Multer with Cloudinary
Real-Time	Socket.IO
Deployment	Render / Optional: Vercel, Netlify for frontend
Getting Started
Clone the Repository
git clone [github.com:Lecksikerm/CodeAlpha_Job-Board-Platform.git](https://github.com/Lecksikerm/CodeAlpha_Job-Board-Platform)
cd job-board-platform

Install Dependencies
npm install

Start the Server
npm run dev

Environment Variables

Create a .env file in the project root:

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.vbizevy.mongodb.net/job-board-db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=********

----

* Deployment Link 
https://job-board-platform-3s4b.onrender.com

----


API Endpoints
Auth

POST /api/auth/employer/register – Register employer

POST /api/auth/employer/login – Employer login

POST /api/auth/candidate/register – Candidate register

POST /api/auth/candidate/login – Candidate login

Jobs

POST /api/jobs – Create job (Employer)

GET /api/jobs – List jobs (Pagination & filters)

GET /api/jobs/:id – Job details

PUT /api/jobs/:id – Update job (Employer)

DELETE /api/jobs/:id – Delete job (Employer)

Resumes

POST /api/resumes – Upload resume (Candidate)

Applications

POST /api/applications – Apply to job (Candidate)

PUT /api/applications/:id/status – Update application status (Employer)

GET /api/applications/track – Track user applications

Admin

GET /api/admin/users – Get all users (Admin only)

GET /api/admin/reports – Get reports (Admin only)

Socket.IO Notifications

Real-time notifications are sent to employers when candidates apply to their jobs.

Frontend Example:

<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
<script>
const socket = io('https://job-board-platform-3s4b.onrender.com');
const employerId = '<EMPLOYER_ID>';
socket.emit('join', employerId);

socket.on('new_notification', (data) => {
    console.log('New Notification:', data);
    alert(`New application: ${data.message}`);
});
</script>

Admin Panel

Admins can:

View all employers and candidates

Generate reports on jobs and applications

Access role-based functionality (only isAdmin = true)

Future Enhancements

Frontend dashboard (React/Next.js) for Employers, Candidates, and Admins

Email notifications for new applications

File type validation and virus scanning for uploads

Advanced reporting and charts for admins

License

This project is open-source under the MIT License.
