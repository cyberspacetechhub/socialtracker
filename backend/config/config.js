require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/socialtracker',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  supportedPlatforms: ['facebook', 'twitter', 'instagram', 'tiktok', 'linkedin', 'youtube']
};