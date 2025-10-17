const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.put('/password', authMiddleware, userController.changePassword);
router.put('/limits', authMiddleware, userController.updateLimits);
router.put('/notifications', authMiddleware, userController.updateNotifications);
router.put('/preferences', authMiddleware, userController.updatePreferences);
router.post('/forgot-password', userController.forgotPassword);
router.post('/verify-reset-code', userController.verifyResetCode);
router.post('/reset-password', userController.resetPassword);

module.exports = router;