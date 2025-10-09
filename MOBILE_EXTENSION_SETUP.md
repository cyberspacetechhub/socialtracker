# Mobile Browser Extension Setup Guide

## Important Note
**Chrome extensions are NOT supported on mobile browsers (iOS Safari, Android Chrome mobile app).** Extensions only work on desktop browsers. However, you can still use the web dashboard on mobile.

## Alternative Solutions for Mobile

### Option 1: Use Web Dashboard Only
1. **Open your mobile browser** (Safari, Chrome, Firefox)
2. **Navigate to** your deployed frontend URL
3. **Login** with your account
4. **Add to Home Screen** for app-like experience:
   - **iOS Safari**: Tap Share → Add to Home Screen
   - **Android Chrome**: Tap Menu → Add to Home Screen

### Option 2: Desktop Browser on Mobile (Limited)
Some Android devices support desktop browser modes:

1. **Install Kiwi Browser** (Android only)
   - Download from Google Play Store
   - Supports Chrome extensions on mobile

2. **Load Extension in Kiwi Browser**:
   - Open Kiwi Browser
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select your extension folder

### Option 3: Manual Tracking (Recommended for Mobile)
Since automatic tracking isn't available on mobile:

1. **Use the web dashboard** to set limits
2. **Manually log usage** through the dashboard
3. **Set phone reminders** for time limits
4. **Use built-in screen time controls**:
   - **iOS**: Settings → Screen Time
   - **Android**: Settings → Digital Wellbeing

## Web Dashboard Features on Mobile
✅ **Available on Mobile**:
- View usage statistics
- Set daily limits
- Profile management
- Activity history
- Password reset
- Responsive mobile design

❌ **Not Available on Mobile**:
- Automatic usage tracking
- Real-time overlay
- "Take a Break" functionality
- Browser notifications

## Recommended Mobile Workflow
1. **Set limits** on desktop with extension
2. **Check progress** on mobile dashboard
3. **Use phone's built-in controls** for enforcement
4. **Review weekly reports** on dashboard

## Future Mobile Support
Consider developing a native mobile app for full functionality:
- React Native app
- Automatic tracking via app usage APIs
- Push notifications
- Background monitoring

The web dashboard provides the core functionality for mobile users while the extension handles automatic tracking on desktop browsers.