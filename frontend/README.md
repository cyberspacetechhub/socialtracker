# Social Tracker Frontend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## ✅ Complete Features

### 🔐 Authentication
- Modern login/register pages with gradient design
- Form validation with React Hook Form
- JWT token management with auto-refresh
- Protected routes and navigation guards
- Password strength validation

### 📊 Dashboard
- Real-time usage overview with React Query
- Beautiful gradient cards for each platform
- Progress indicators with color-coded status
- Interactive usage charts with Recharts
- Total usage statistics and limit warnings

### ⚙️ Limits Management
- Per-platform time limit configuration
- Preset buttons for quick setup
- Recommended limits with health tips
- Real-time form updates with validation
- Visual feedback for limit recommendations

### 📈 Activity History
- Detailed session logs with pagination
- Platform filtering capabilities
- Modern card-based design
- Active session indicators
- Time formatting and duration display

### 🔔 Notifications
- Browser push notification support
- Email notification preferences
- Toggle switches for notification types
- Automatic limit exceeded alerts
- Usage warning notifications at 80%

### 🎨 Modern UI/UX
- Gradient backgrounds and modern design
- Responsive Tailwind CSS styling
- Loading states and error handling
- Toast notifications for user feedback
- Smooth transitions and hover effects
- Mobile-responsive design

## 🛠️ Tech Stack
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern styling
- **React Query** for data fetching and caching
- **Zustand** for lightweight state management
- **React Router** for navigation
- **React Hook Form** for form handling
- **Recharts** for data visualization
- **Heroicons** for consistent icons
- **Headless UI** for accessible components

## 📁 Project Structure
```
src/
├── features/           # Feature-based modules
│   ├── auth/          # Login, signup, session handling
│   ├── dashboard/     # Usage analytics and charts
│   ├── limits/        # Time limit settings
│   ├── notifications/ # Notification preferences
│   └── activity/      # Activity logs and history
├── components/        # Reusable UI components
│   ├── charts/        # Chart components
│   ├── forms/         # Form components
│   └── layout/        # Layout components
├── hooks/             # Custom React hooks
├── services/          # API calls and React Query
├── store/             # Zustand stores
├── utils/             # Utility functions
└── config/            # App configuration
```

## 🚀 Key Improvements Made

1. **React Query Integration**: Replaced manual state management with React Query for better caching and data synchronization

2. **Modern Design**: Complete UI overhaul with gradients, better spacing, and modern components

3. **Form Validation**: Enhanced form validation with better error messages and UX

4. **Notification System**: Full browser notification support with permission handling

5. **Better Data Flow**: Normalized API calls using React Query hooks instead of mixed approaches

6. **Responsive Design**: Mobile-first approach with proper responsive breakpoints

7. **Loading States**: Proper loading indicators and error handling throughout the app

8. **Accessibility**: Better color contrast, focus states, and semantic HTML

The frontend now provides a complete, production-ready experience for social media usage tracking! 🎉