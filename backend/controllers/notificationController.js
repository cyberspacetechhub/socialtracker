const Notification = require('../models/Notification');

class NotificationController {
  async getNotifications(req, res, next) {
    try {
      const notifications = await Notification.find({ 
        userId: req.user._id,
        read: false 
      }).sort({ createdAt: -1 });
      
      res.json({ notifications });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const { notificationId } = req.params;
      await Notification.findByIdAndUpdate(notificationId, { read: true });
      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      await Notification.updateMany(
        { userId: req.user._id, read: false },
        { read: true }
      );
      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      const { notificationId } = req.params;
      await Notification.findByIdAndDelete(notificationId);
      res.json({ message: 'Notification deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();