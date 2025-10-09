const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['facebook', 'twitter', 'instagram', 'tiktok', 'linkedin', 'youtube']
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  url: {
    type: String
  },
  date: {
    type: String, // YYYY-MM-DD format for easy querying
    required: true
  }
}, {
  timestamps: true
});

activityLogSchema.index({ userId: 1, date: 1, platform: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);