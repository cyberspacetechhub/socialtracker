# Social Tracker Backend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
- Update MongoDB URI
- Set JWT secret
- Configure email settings for notifications

3. Start the server:
```bash
npm run dev  # Development
npm start    # Production
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (auth required)
- `PUT /api/users/limits` - Update time limits (auth required)
- `PUT /api/users/notifications` - Update notification settings (auth required)

### Activity Tracking
- `POST /api/activity/start` - Start tracking session (auth required)
- `PUT /api/activity/end/:activityId` - End tracking session (auth required)
- `GET /api/activity/daily/:date` - Get daily usage stats (auth required)
- `GET /api/activity/weekly` - Get weekly usage stats (auth required)
- `GET /api/activity/history` - Get activity history (auth required)

### Health Check
- `GET /api/health` - Server health status

## Supported Platforms
- Facebook
- Twitter/X
- Instagram
- TikTok
- LinkedIn
- YouTube

## Features
- JWT authentication
- Rate limiting
- Email notifications for limit exceeded
- Daily/weekly usage analytics
- Activity session tracking
- User preference management