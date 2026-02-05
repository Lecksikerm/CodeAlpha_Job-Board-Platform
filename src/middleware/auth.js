const jwt = require('jsonwebtoken');
const Employer = require('../models/Employer');
const Candidate = require('../models/Candidate');

module.exports = async function (req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        
        console.log('Token decoded:', decoded);

        let user = null;
        let role = decoded.role;

        // Try to find user based on role in token
        if (role === 'employer') {
            user = await Employer.findById(decoded.id);
        } else if (role === 'candidate') {
            user = await Candidate.findById(decoded.id);
        }

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        
        req.user = { 
            id: user._id.toString(),  
            isAdmin: user.isAdmin || false,
            role: role
        };

        
        console.log('req.user set:', req.user);

        next();
    } catch (err) {
        console.error('Auth error:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

