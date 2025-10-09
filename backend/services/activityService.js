const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const config = require('../config/config');

class ActivityService {
  constructor() {
    if (config.email.user && config.email.pass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.email.user,
          pass: config.email.pass
        },
        timeout: 10000
      });
      console.log('Activity email transporter configured for:', config.email.user);
    } else {
      console.log('Email configuration missing for activity service');
      this.transporter = null;
    }
  }

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
    if (!user.notifications.email || !this.transporter) return;
    
    const mailOptions = {
      from: config.email.user,
      to: user.email,
      subject: `Social Media Limit Exceeded - ${platform}`,
      text: `You've exceeded your daily limit for ${platform}. Usage: ${usage} minutes, Limit: ${limit} minutes.`
    };
    
    try {
      await Promise.race([
        this.transporter.sendMail(mailOptions),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email timeout')), 15000)
        )
      ]);
      console.log(`Email notification sent to ${user.email} for ${platform}`);
    } catch (error) {
      console.error('Email notification failed:', error.message);
    }
  }
}

module.exports = new ActivityService();