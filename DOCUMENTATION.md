# Social Media Usage Tracker - Comprehensive Documentation

## Project Overview

A full-stack digital wellness application that helps users monitor and control their social media usage through automatic tracking, customizable limits, and real-time notifications. The system combines a React web dashboard with a Chrome browser extension for seamless usage monitoring.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Chrome         │    │  React          │    │  Node.js        │
│  Extension      │◄──►│  Frontend       │◄──►│  Backend        │
│  (Tracking)     │    │  (Dashboard)    │    │  (API/Database) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer (SMTP disabled on Render)
- **Deployment**: Render

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (@tanstack/react-query)
- **Charts**: Chart.js
- **Notifications**: React Hot Toast
- **Deployment**: Vercel

### Browser Extension
- **Manifest**: Chrome Extension Manifest V3
- **Architecture**: Content Scripts + Background Service Worker
- **Tracking**: Real-time DOM monitoring
- **UI**: Draggable overlay with progress indicators

## Data Structure

### Backend Structure
```
backend/
├── config/
│   ├── allowedOrigins.js        # CORS allowed origins
│   ├── config.js                # Environment configuration
│   └── corsOptions.js           # CORS middleware options
├── connections/
│   └── db.js                    # MongoDB connection
├── models/
│   ├── User.js                  # User schema with preferences
│   ├── ActivityLog.js           # Usage tracking data
│   ├── Notification.js          # System notifications
│   └── Recommendation.js        # Digital wellness recommendations
├── services/
│   ├── userService.js           # User business logic
│   ├── activityService.js       # Usage tracking logic
│   ├── emailService.js          # Email utilities
│   └── recommendationService.js # Recommendation generation
├── controllers/
│   ├── userController.js        # User API endpoints
│   ├── activityController.js    # Activity API endpoints
│   ├── notificationController.js# Notification API endpoints
│   └── recommendationController.js # Recommendation API endpoints
├── middlewares/
│   ├── authMiddleware.js        # JWT authentication
│   └── errorHandler.js          # Global error handling
├── routes/
│   ├── userRoutes.js            # User API routes
│   ├── activityRoutes.js        # Activity API routes
│   ├── notificationRoutes.js    # Notification API routes
│   └── recommendationRoutes.js  # Recommendation API routes
├── app.js                       # Express app configuration
└── server.js                    # Server entry point
```

### Frontend Structure
```
frontend/src/
├── assets/                      # Static files
├── components/
│   ├── charts/
│   │   └── UsageChart.jsx       # Usage analytics visualization
│   ├── forms/
│   │   └── ForgotPassword.jsx   # Password reset flow
│   ├── layout/
│   │   ├── Layout.jsx           # Main app layout
│   │   └── Navbar.jsx           # Navigation component
│   ├── Profile/
│   │   └── Profile.jsx          # User profile management
│   ├── ui/
│   │   ├── Loader.jsx           # Loading spinner
│   │   └── Onboarding.jsx       # New user onboarding
│   ├── NotificationStack.jsx    # Toast notification display
│   ├── RecommendationCard.jsx   # Individual recommendation
│   ├── RecommendationPanel.jsx  # Recommendations container
│   ├── PreferencesPanel.jsx     # User preferences settings
│   ├── MonthlyUsageCard.jsx     # Monthly usage statistics
│   └── MotivationalMessage.jsx  # Automatic motivational messages
├── features/
│   ├── auth/
│   │   └── pages/
│   │       ├── LoginPage.jsx    # User authentication
│   │       └── RegisterPage.jsx # User registration
│   ├── dashboard/
│   │   └── DashboardPage.jsx    # Main dashboard
│   ├── limits/
│   │   └── LimitsPage.jsx       # Time limit configuration
│   ├── notifications/
│   │   └── NotificationsPage.jsx# Notification management
│   └── activity/
│       └── ActivityPage.jsx     # Usage history
├── hooks/
│   ├── useAuth.js               # Authentication hook
│   ├── useNotifications.js      # Notification hook
│   └── useRecommendations.js    # Recommendations hook
├── services/
│   ├── api.js                   # Axios instance and API calls
│   ├── queries.js               # React Query definitions
│   ├── notificationService.js   # Notification API calls
│   └── recommendationService.js # Recommendation API calls
├── store/
│   ├── authStore.js             # Authentication state
│   └── activityStore.js         # Activity tracking state
├── utils/
│   └── notifications.js         # Toast notification utilities
├── config/
│   └── api.js                   # API configuration
├── routes/
│   └── ProtectedRoute.jsx       # Route protection
├── App.jsx                      # Root component
└── main.jsx                     # Application entry point
```

### Extension Structure
```
extension/
├── src/
│   ├── background/              # Service worker scripts
│   ├── content/                 # Content scripts for tracking
│   └── popup/                   # Extension popup interface
├── manifest.json                # Extension configuration
├── working-overlay.js           # Main tracking overlay
└── icon.png                     # Extension icon
```

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  limits: {
    facebook: Number (default: 60),
    twitter: Number (default: 60),
    instagram: Number (default: 60),
    tiktok: Number (default: 60),
    linkedin: Number (default: 60),
    youtube: Number (default: 60)
  },
  notifications: {
    email: Boolean (default: true),
    browser: Boolean (default: true)
  },
  preferences: {
    studySchedule: {
      enabled: Boolean (default: false),
      startTime: String (default: '09:00'),
      endTime: String (default: '17:00'),
      days: [String] (default: weekdays)
    },
    reminders: {
      breakReminders: Boolean (default: true),
      dailyGoals: Boolean (default: true),
      weeklyReports: Boolean (default: true)
    },
    motivationalMessages: Boolean (default: true)
  },
  resetCode: String,
  resetCodeExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### ActivityLog Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  platform: String (facebook|twitter|instagram|tiktok|linkedin|youtube),
  startTime: Date,
  endTime: Date,
  duration: Number (minutes),
  url: String,
  date: String (YYYY-MM-DD),
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: String (limit_exceeded|warning|info),
  platform: String,
  message: String,
  usage: Number,
  limit: Number,
  read: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Recommendation Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: String (break|productivity|wellness),
  title: String,
  message: String,
  priority: Number (1-5),
  read: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/verify-reset-code` - Verify reset code
- `POST /api/users/reset-password` - Reset password

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password
- `PUT /api/users/limits` - Update time limits
- `PUT /api/users/notifications` - Update notification settings
- `PUT /api/users/preferences` - Update user preferences

### Activity Tracking
- `POST /api/activity/start` - Start tracking session
- `PUT /api/activity/end/:activityId` - End tracking session
- `GET /api/activity/daily/:date` - Get daily usage
- `GET /api/activity/weekly` - Get weekly usage
- `GET /api/activity/monthly/:year/:month` - Get monthly usage
- `GET /api/activity/history` - Get activity history
- `DELETE /api/activity/clear` - Clear all activity data

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

### Recommendations
- `GET /api/recommendations` - Get user recommendations
- `PUT /api/recommendations/:id/read` - Mark recommendation as read
- `DELETE /api/recommendations/:id` - Delete recommendation

## Key Features

### 1. Automatic Tracking
- Chrome extension monitors social media usage in real-time
- Tracks time spent on Facebook, Instagram, Twitter, TikTok, LinkedIn, YouTube
- Draggable overlay shows current session time and daily progress
- Automatic session management with start/end tracking

### 2. Smart Limits & Controls
- Customizable daily time limits per platform
- Visual progress indicators with color-coded status
- "Take a Break" feature that closes tabs when limits exceeded
- Study schedule blocking during specified hours

### 3. User Preferences
- **Study Schedule**: Set time blocks when social media is restricted
- **Reminders**: Configure break reminders, daily goals, weekly reports
- **Motivational Messages**: Enable/disable automatic encouraging messages

### 4. Analytics & Insights
- Daily usage breakdown by platform
- Weekly and monthly usage trends
- Session count and average usage statistics
- Visual charts and progress tracking

### 5. Notification System
- Database-stored notifications (email disabled on Render)
- Toast notifications for limit exceeded alerts
- Stacked notification display with dismiss functionality
- Real-time browser notifications

### 6. Digital Wellness
- Automatic recommendation generation based on usage patterns
- Motivational messages displayed every 10 minutes
- Break suggestions and productivity tips
- Weekly usage reports and insights

## Data Flow

### Extension → Backend
1. Extension detects social media site visit
2. Sends `POST /api/activity/start` with platform and URL
3. Tracks time spent on site
4. Sends `PUT /api/activity/end/:id` when user leaves

### Frontend ← Backend
1. Dashboard fetches usage data via React Query
2. Real-time updates every 30 seconds
3. Displays analytics, recommendations, and notifications
4. User interactions update preferences and limits

### Notification Flow
1. Activity service checks limits after each session
2. Creates notification in database if limit exceeded
3. Generates recommendations for digital wellness
4. Frontend displays notifications as toast messages

## Deployment

### Backend (Render)
- Environment variables: `MONGODB_URI`, `JWT_SECRET`, `EMAIL_*`
- SMTP blocked, using database notifications instead
- CORS configured for Vercel frontend

### Frontend (Vercel)
- Environment variable: `VITE_API_URL`
- Static site deployment with SPA routing
- Optimized build with Vite

### Extension
- Load unpacked in Chrome Developer Mode
- Manifest V3 with required permissions
- Content scripts inject tracking overlay

## Security Features

- JWT-based authentication with 7-day expiration
- Password hashing with bcrypt (12 rounds)
- CORS protection with allowed origins
- Input validation and sanitization
- Protected routes with authentication middleware
- Password reset with time-limited codes

## Performance Optimizations

- React Query for efficient data caching and synchronization
- Debounced API calls to prevent excessive requests
- Lazy loading of components and routes
- Optimized MongoDB queries with aggregation pipelines
- Real-time updates with configurable intervals

This comprehensive system provides users with complete control over their social media usage while promoting healthier digital habits through automated tracking, intelligent recommendations, and customizable intervention tools.