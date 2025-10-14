const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['limit_exceeded'],
    required: true
  },
  platform: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  usage: {
    type: Number,
    required: true
  },
  limit: {
    type: Number,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);