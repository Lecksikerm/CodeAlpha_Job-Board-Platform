const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/adminAuth');
const { getUsers, getReports } = require('../../controllers/adminController');

router.get('/users', auth, adminAuth, getUsers);
router.get('/reports', auth, adminAuth, getReports);

module.exports = router;
