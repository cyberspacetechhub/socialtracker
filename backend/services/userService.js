const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const config = require('../config/config');

class UserService {
  constructor() {
    if (config.email.user && config.email.pass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.email.user,
          pass: config.email.pass
        }
      });
    } else {
      this.transporter = null;
    }
  }

  async createUser(userData) {
    const user = new User(userData);
    await user.save();
    return this.generateUserResponse(user);
  }

  async authenticateUser(email, password) {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }
    return this.generateUserResponse(user);
  }

  async getUserById(id) {
    return User.findById(id).select('-password');
  }

  async updateUserLimits(userId, limits) {
    return User.findByIdAndUpdate(
      userId,
      { $set: { limits } },
      { new: true }
    ).select('-password');
  }

  async updateNotificationSettings(userId, notifications) {
    return User.findByIdAndUpdate(
      userId,
      { $set: { notifications } },
      { new: true }
    ).select('-password');
  }

  async updateProfile(userId, profileData) {
    return User.findByIdAndUpdate(
      userId,
      { $set: profileData },
      { new: true }
    ).select('-password');
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    if (!(await user.comparePassword(currentPassword))) {
      throw new Error('Invalid current password');
    }
    user.password = newPassword;
    await user.save();
  }

  async sendPasswordResetCode(email) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    
    const resetCode = crypto.randomInt(100000, 999999).toString();
    user.resetCode = resetCode;
    user.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();
    
    // For development/testing - log the code if email fails
    try {
      await this.sendResetEmail(email, resetCode);
    } catch (error) {
      console.log('Email failed, reset code for', email, ':', resetCode);
      // Don't throw error, allow the process to continue
    }
  }

  async verifyResetCode(email, code) {
    const user = await User.findOne({ 
      email, 
      resetCode: code,
      resetCodeExpires: { $gt: new Date() }
    });
    return !!user;
  }

  async resetPassword(email, code, newPassword) {
    const user = await User.findOne({ 
      email, 
      resetCode: code,
      resetCodeExpires: { $gt: new Date() }
    });
    if (!user) throw new Error('Invalid or expired reset code');
    
    user.password = newPassword;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();
  }

  async sendResetEmail(email, code) {
    if (!this.transporter) {
      console.log('Email not configured, reset code:', code);
      return;
    }
    
    await this.transporter.sendMail({
      from: config.email.user,
      to: email,
      subject: 'Password Reset Code - Social Tracker',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Password Reset Request</h2>
          <p>Your password reset code is:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #1f2937; letter-spacing: 4px;">${code}</span>
          </div>
          <p style="color: #6b7280;">This code will expire in 10 minutes.</p>
          <p style="color: #6b7280; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    });
  }

  generateUserResponse(user) {
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '7d' });
    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        limits: user.limits,
        notifications: user.notifications
      }
    };
  }
}

module.exports = new UserService();