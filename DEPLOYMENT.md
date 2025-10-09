# Deployment Guide

## 🚀 Backend Deployment

### Option 1: Vercel (Recommended)
1. **Prepare Backend:**
   ```bash
   cd backend
   npm install
   ```

2. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `EMAIL_HOST`: smtp.gmail.com
   - `EMAIL_PORT`: 587
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: Your Gmail app password

### Option 2: Render
1. **Create Render Account**: https://render.com
2. **Connect GitHub Repository**
3. **Create Web Service:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node
4. **Add Environment Variables** (same as above)

## 🌐 Frontend Deployment

### Option 1: Vercel
1. **Prepare Frontend:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Update API URL:**
   - Set `VITE_API_URL` to your deployed backend URL

### Option 2: Netlify
1. **Build Frontend:**
   ```bash
   npm run build
   ```
2. **Deploy dist folder to Netlify**
3. **Set Environment Variables:**
   - `VITE_API_URL`: Your backend URL

## 🔧 Extension Distribution

### Option 1: Chrome Web Store (Recommended)
1. **Prepare Extension:**
   - Update `manifest.json` with production URLs
   - Create extension icons (16x16, 48x48, 128x128)
   - Test thoroughly

2. **Submit to Chrome Web Store:**
   - Create Chrome Developer account ($5 fee)
   - Upload extension zip file
   - Fill out store listing
   - Wait for review (1-3 days)

### Option 2: Direct Distribution
1. **Create Extension Package:**
   
   **Windows (PowerShell):**
   ```powershell
   cd extension
   Compress-Archive -Path * -DestinationPath social-tracker-extension.zip
   ```
   
   **Windows (File Explorer):**
   - Navigate to extension folder
   - Select all files (Ctrl+A)
   - Right-click → Send to → Compressed folder
   
   **Mac/Linux:**
   ```bash
   cd extension
   zip -r social-tracker-extension.zip .
   ```

2. **Distribute ZIP file** to users for manual installation

## 📋 Pre-Deployment Checklist

### Backend
- [ ] Environment variables configured
- [ ] MongoDB connection working
- [ ] Email notifications configured
- [ ] CORS settings updated for production URLs
- [ ] Rate limiting configured
- [ ] Error handling implemented

### Frontend  
- [ ] API URLs updated to production
- [ ] Build process working
- [ ] Authentication flow tested
- [ ] All features functional

### Extension
- [ ] Manifest permissions correct
- [ ] Content scripts working on all platforms
- [ ] Background script functioning
- [ ] Popup interface complete
- [ ] Icons and branding added

## 🔒 Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files
   - Use strong JWT secrets
   - Secure MongoDB credentials

2. **CORS Configuration:**
   - Only allow trusted domains
   - Update for production URLs

3. **Extension Security:**
   - Minimal permissions requested
   - Secure API communication
   - No sensitive data in extension code

## 📊 Monitoring & Analytics

1. **Backend Monitoring:**
   - Set up error tracking (Sentry)
   - Monitor API performance
   - Database connection health

2. **Frontend Analytics:**
   - User engagement tracking
   - Error monitoring
   - Performance metrics

3. **Extension Usage:**
   - Track installation rates
   - Monitor user feedback
   - Update based on usage patterns

## 🚀 Go Live Steps

1. **Deploy Backend** → Test API endpoints
2. **Deploy Frontend** → Test full user flow  
3. **Update Extension** → Point to production APIs
4. **Submit to Chrome Store** → Wait for approval
5. **Launch Marketing** → Announce to users

Your Social Tracker is now ready for production! 🎉