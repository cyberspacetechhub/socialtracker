const recommendationService = require('../services/recommendationService');
const Recommendation = require('../models/Recommendation');

class RecommendationController {
  async getRecommendations(req, res, next) {
    try {
      const recommendations = await recommendationService.getRecommendations(req.user._id);
      res.json({ recommendations });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const { recommendationId } = req.params;
      await Recommendation.findByIdAndUpdate(recommendationId, { read: true });
      res.json({ message: 'Recommendation marked as read' });
    } catch (error) {
      next(error);
    }
  }

  async generateRecommendations(req, res, next) {
    try {
      await recommendationService.generateRecommendations(req.user._id);
      res.json({ message: 'Recommendations generated' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecommendationController();