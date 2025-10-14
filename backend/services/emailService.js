const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      this.transporter = null;
    }
  }

  async sendPasswordResetEmail(email, code) {
    if (!this.transporter) {
      throw new Error('Email service not configured');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
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
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendLimitNotification(email, platform, usage, limit) {
    if (!this.transporter) {
      throw new Error('Email service not configured');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Social Media Limit Exceeded - ${platform}`,
      text: `You've exceeded your daily limit for ${platform}. Usage: ${usage} minutes, Limit: ${limit} minutes.`
    };

    return this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();