const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', auth, recommendationController.getRecommendations);
router.put('/:recommendationId/read', auth, recommendationController.markAsRead);
router.post('/generate', auth, recommendationController.generateRecommendations);

module.exports = router;