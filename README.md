# Social Media Usage Tracker

A comprehensive full-stack application that helps users monitor and control their social media usage with automatic tracking, customizable limits, and real-time notifications.

## Overview

Social Media Usage Tracker is a complete digital wellness solution designed to help users build healthier relationships with social media platforms. The application combines a modern web dashboard with a Chrome browser extension to provide seamless, automatic tracking of time spent on Facebook, Instagram, Twitter, TikTok, LinkedIn, and YouTube.

## Key Features

**Automatic Tracking**: Browser extension automatically detects and tracks usage across major social media platforms without requiring manual input. Real-time overlay shows current session time and daily limits.

**Smart Limits & Controls**: Users can set customizable daily time limits for each platform with visual progress indicators. The "Take a Break" feature actively closes social media tabs and redirects users to the dashboard when limits are exceeded.

**User Management**: Secure authentication system with JWT tokens, profile management, and password reset functionality via email verification with 6-digit codes.

**Modern Interface**: Responsive React dashboard with mobile-first design, interactive charts for usage analytics, and intuitive navigation. Features include onboarding flow for new users and bottom navigation for mobile devices.

**Notifications**: Email alerts when daily limits are exceeded and browser notifications for usage milestones and weekly reports.

## Tech Stack

**Backend**: Node.js, Express.js, MongoDB, JWT authentication, Nodemailer
**Frontend**: React 18, Tailwind CSS, Zustand state management, Chart.js analytics
**Extension**: Chrome Extension Manifest V3 with content scripts and background service worker

## Installation

1. Clone repository and install dependencies for backend and frontend
2. Configure MongoDB URI and email credentials in environment variables
3. Load unpacked Chrome extension from `/extension` folder
4. Run backend (`npm run dev`) and frontend (`npm run dev`) servers

Perfect for individuals seeking to build healthier digital habits with comprehensive usage insights and automated intervention tools.