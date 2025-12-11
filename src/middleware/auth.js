const jwt = require('jsonwebtoken');
const Employer = require('../models/Employer');

module.exports = async function (req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch full employer info from DB
        const employer = await Employer.findById(decoded.id);
        if (!employer) return res.status(401).json({ message: 'User not found' });

        req.user = { 
            id: employer._id,
            isAdmin: employer.isAdmin,
            role: employer.role
        };

        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

