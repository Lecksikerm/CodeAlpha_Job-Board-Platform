const jwt = require('jsonwebtoken');
const Candidate = require('../models/Candidate');

module.exports = async function (req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const candidate = await Candidate.findById(decoded.id);
        if (!candidate) return res.status(401).json({ message: 'User not found' });

        req.user = {
            id: candidate._id,
            role: 'candidate'
        };

        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
