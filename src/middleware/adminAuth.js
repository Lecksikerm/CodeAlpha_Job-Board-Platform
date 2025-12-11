const Employer = require('../models/Employer');

const adminAuth = async (req, res, next) => {
    try {
       
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const employer = await Employer.findById(req.user.id);
        if (!employer || !employer.isAdmin) {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }

        next();
    } catch (err) {
        console.error('Admin auth error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = adminAuth;
