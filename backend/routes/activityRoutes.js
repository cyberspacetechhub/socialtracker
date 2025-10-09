const express = require('express');
const activityController = require('../controllers/activityController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/start', authMiddleware, activityController.startSession);
router.put('/end/:activityId', authMiddleware, activityController.endSession);
router.get('/daily/:date', authMiddleware, activityController.getDailyUsage);
router.get('/weekly', authMiddleware, activityController.getWeeklyUsage);
router.get('/history', authMiddleware, activityController.getActivityHistory);

module.exports = router;