const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true
  },
  limits: {
    facebook: { type: Number, default: 60 }, // minutes per day
    twitter: { type: Number, default: 60 },
    instagram: { type: Number, default: 60 },
    tiktok: { type: Number, default: 60 },
    linkedin: { type: Number, default: 60 },
    youtube: { type: Number, default: 60 }
  },
  notifications: {
    email: { type: Boolean, default: true },
    browser: { type: Boolean, default: true }
  },
  resetCode: String,
  resetCodeExpires: Date
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);