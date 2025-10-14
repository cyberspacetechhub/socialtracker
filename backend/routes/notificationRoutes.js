const express = require('express');
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', auth, notificationController.getNotifications);
router.put('/:notificationId/read', auth, notificationController.markAsRead);
router.delete('/:notificationId', auth, notificationController.deleteNotification);
router.put('/mark-all-read', auth, notificationController.markAllAsRead);

module.exports = router;