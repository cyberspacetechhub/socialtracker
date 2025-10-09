const activityService = require('../services/activityService');
const ActivityLog = require('../models/ActivityLog');
const mongoose = require('mongoose');

class ActivityController {
  async startSession(req, res, next) {
    try {
      const { platform, url } = req.body;
      
      if (!platform) {
        return res.status(400).json({ error: 'Platform is required' });
      }
      
      const activity = await activityService.logActivity(req.user._id, platform, url);
      res.status(201).json({ activity });
    } catch (error) {
      next(error);
    }
  }

  async endSession(req, res, next) {
    try {
      const { activityId } = req.params;
      const { endTime } = req.body;
      
      if (!mongoose.Types.ObjectId.isValid(activityId)) {
        return res.status(400).json({ error: 'Invalid activity ID' });
      }
      
      const activity = await activityService.endActivity(activityId, new Date(endTime));
      res.json({ activity });
    } catch (error) {
      next(error);
    }
  }

  async getDailyUsage(req, res, next) {
    try {
      const { date } = req.params;
      const usage = await activityService.getDailyUsage(req.user._id, date);
      res.json({ usage });
    } catch (error) {
      next(error);
    }
  }

  async getWeeklyUsage(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
      }
      
      const usage = await activityService.getWeeklyUsage(req.user._id, startDate, endDate);
      res.json({ usage });
    } catch (error) {
      next(error);
    }
  }

  async getActivityHistory(req, res, next) {
    try {
      const { page = 1, limit = 50, platform, date } = req.query;
      
      const query = { userId: req.user._id };
      if (platform) query.platform = platform;
      if (date) query.date = date;
      
      const activities = await ActivityLog.find(query)
        .sort({ startTime: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      
      const total = await ActivityLog.countDocuments(query);
      
      res.json({
        activities,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      });
    } catch (error) {
      next(error);
    }
  }

  async clearActivity(req, res, next) {
    try {
      await ActivityLog.deleteMany({ userId: req.user._id });
      res.json({ message: 'All activity data cleared successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ActivityController();