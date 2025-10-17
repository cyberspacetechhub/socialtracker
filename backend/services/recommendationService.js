const Recommendation = require('../models/Recommendation');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');

class RecommendationService {
  async generateRecommendations(userId) {
    const user = await User.findById(userId);
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's usage
    const dailyUsage = await this.getDailyUsage(userId, today);
    
    const recommendations = [];
    
    // Check for excessive usage
    for (const [platform, usage] of Object.entries(dailyUsage)) {
      const limit = user.limits[platform] || 60;
      const percentage = (usage.duration / limit) * 100;
      
      if (percentage > 80) {
        recommendations.push({
          userId,
          type: 'break_suggestion',
          title: `Take a Break from ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
          message: `You've used ${usage.duration} minutes of your ${limit} minute limit. Consider taking a 10-minute walk or doing some stretches.`,
          platform
        });
      }
    }
    
    // Add motivational messages
    const totalUsage = Object.values(dailyUsage).reduce((sum, usage) => sum + usage.duration, 0);
    if (totalUsage < 120) { // Less than 2 hours total
      recommendations.push({
        userId,
        type: 'motivational',
        title: 'Great Job! 🎉',
        message: 'You\'re maintaining healthy social media habits today. Keep up the excellent work!'
      });
    }
    
    // Add wellness tips
    recommendations.push({
      userId,
      type: 'wellness_tip',
      title: 'Digital Wellness Tip',
      message: 'Try the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain.'
    });
    
    // Save recommendations
    for (const rec of recommendations) {
      const existing = await Recommendation.findOne({
        userId: rec.userId,
        type: rec.type,
        platform: rec.platform,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });
      
      if (!existing) {
        await new Recommendation(rec).save();
      }
    }
  }
  
  async getDailyUsage(userId, date) {
    const activities = await ActivityLog.aggregate([
      { $match: { userId: userId, date } },
      {
        $group: {
          _id: '$platform',
          totalDuration: { $sum: '$duration' },
          sessionCount: { $sum: 1 }
        }
      }
    ]);
    
    return activities.reduce((acc, item) => {
      acc[item._id] = {
        duration: item.totalDuration,
        sessions: item.sessionCount
      };
      return acc;
    }, {});
  }
  
  async getRecommendations(userId) {
    return Recommendation.find({ userId, read: false })
      .sort({ createdAt: -1 })
      .limit(10);
  }
}

module.exports = new RecommendationService();