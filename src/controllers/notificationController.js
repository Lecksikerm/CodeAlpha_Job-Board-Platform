const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const employerId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const notifications = await Notification.find({ employer: employerId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Notification.countDocuments({ employer: employerId });

        return res.status(200).json({
            status: 'success',
            total,
            page,
            results: notifications.length,
            notifications
        });

    } catch (err) {
        console.error('Error getting notifications:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;

        const updated = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        return res.status(200).json({
            status: 'success',
            notification: updated
        });

    } catch (err) {
        console.error('Error marking notification as read:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

