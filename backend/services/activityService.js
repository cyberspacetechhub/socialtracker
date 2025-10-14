const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const Notification = require('../models/Notification');
const config = require('../config/config');

class ActivityService {
  async logActivity(userId, platform, url) {
    const today = new Date().toISOString().split('T')[0];
    
    // End any existing active session for this platform
    await this.endActiveSession(userId, platform);
    
    const activity = new ActivityLog({
      userId,
      platform,
      startTime: new Date(),
      url,
      date: today
    });
    
    await activity.save();
    return activity;
  }

  async endActivity(activityId, endTime) {
    const activity = await ActivityLog.findById(activityId);
    if (!activity) throw new Error('Activity not found');
    
    activity.endTime = endTime;
    activity.duration = Math.round((endTime - activity.startTime) / (1000 * 60)); // minutes
    await activity.save();
    
    await this.checkLimits(activity.userId, activity.platform, activity.date);
    return activity;
  }

  async endActiveSession(userId, platform) {
    const today = new Date().toISOString().split('T')[0];
    const activeSession = await ActivityLog.findOne({
      userId,
      platform,
      date: today,
      endTime: null
    });
    
    if (activeSession) {
      return this.endActivity(activeSession._id, new Date());
    }
    return null;
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

  async getWeeklyUsage(userId, startDate, endDate) {
    return ActivityLog.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { platform: '$platform', date: '$date' },
          totalDuration: { $sum: '$duration' }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);
  }

  async checkLimits(userId, platform, date) {
    const user = await User.findById(userId);
    const dailyUsage = await this.getDailyUsage(userId, date);
    
    const currentUsage = dailyUsage[platform]?.duration || 0;
    const limit = user.limits[platform];
    
    if (currentUsage >= limit) {
      await this.sendLimitNotification(user, platform, currentUsage, limit);
    }
  }

  async sendLimitNotification(user, platform, usage, limit) {
    if (!user.notifications.email) return;
    
    try {
      const notification = new Notification({
        userId: user._id,
        type: 'limit_exceeded',
        platform,
        message: `You've exceeded your daily limit for ${platform}. Usage: ${usage} minutes, Limit: ${limit} minutes.`,
        usage,
        limit
      });
      await notification.save();
      console.log(`Notification saved for ${user.email} for ${platform}`);
    } catch (error) {
      console.error('Notification save failed:', error.message);
    }
  }
}

module.exports = new ActivityService();