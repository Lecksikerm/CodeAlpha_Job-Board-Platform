const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const notifications = await Notification.find({ employer: userId })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            notifications,
            unreadCount: notifications.filter(n => !n.isRead).length
        });

    } catch (err) {
        console.error('Error getting notifications:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, employer: req.user.id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json(notification);

    } catch (err) {
        console.error('Error marking notification as read:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

