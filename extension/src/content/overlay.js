// Persistent overlay for tracking display
class TrackingOverlay {
  constructor() {
    this.overlay = null;
    this.startTime = null;
    this.platform = null;
    this.limit = 60; // Default 60 minutes
    this.isLimitExceeded = false;
    this.updateInterval = null;
  }

  create(platform, limit) {
    console.log('Creating overlay for:', platform, 'with limit:', limit);
    
    this.platform = platform;
    this.limit = limit;
    this.startTime = new Date();
    
    // Remove existing overlay
    this.remove();
    
    // Create overlay container
    this.overlay = document.createElement('div');
    this.overlay.id = 'social-tracker-overlay';
    this.overlay.style.cssText = 'all: initial; font-family: system-ui;';
    this.overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 16px;
        border-radius: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 999999;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        min-width: 200px;
        transition: all 0.3s ease;
      " id="tracker-badge">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-weight: 600; margin-bottom: 4px;">📊 ${platform}</div>
            <div id="time-display" style="font-size: 12px; opacity: 0.9;">0m / ${limit}m</div>
          </div>
          <button id="close-tracker" style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 12px;
          ">×</button>
        </div>
        <div id="progress-bar" style="
          width: 100%;
          height: 4px;
          background: rgba(255,255,255,0.3);
          border-radius: 2px;
          margin-top: 8px;
          overflow: hidden;
        ">
          <div id="progress-fill" style="
            height: 100%;
            background: #4ade80;
            width: 0%;
            transition: all 0.3s ease;
            border-radius: 2px;
          "></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.overlay);
    
    // Add event listeners
    document.getElementById('close-tracker').addEventListener('click', () => {
      this.minimize();
    });
    
    // Start updating
    this.startUpdating();
  }

  startUpdating() {
    this.updateInterval = setInterval(() => {
      this.updateDisplay();
    }, 1000); // Update every second
  }

  updateDisplay() {
    if (!this.overlay || !this.startTime) return;
    
    const elapsed = Math.floor((new Date() - this.startTime) / (1000 * 60)); // minutes
    const percentage = Math.min((elapsed / this.limit) * 100, 100);
    
    const timeDisplay = document.getElementById('time-display');
    const progressFill = document.getElementById('progress-fill');
    const badge = document.getElementById('tracker-badge');
    
    if (timeDisplay) {
      timeDisplay.textContent = `${elapsed}m / ${this.limit}m`;
    }
    
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
      
      // Change color based on usage
      if (percentage >= 100) {
        progressFill.style.background = '#ef4444'; // Red
        if (!this.isLimitExceeded) {
          this.showLimitExceeded();
        }
      } else if (percentage >= 80) {
        progressFill.style.background = '#f59e0b'; // Orange
      } else {
        progressFill.style.background = '#4ade80'; // Green
      }
    }
  }

  showLimitExceeded() {
    this.isLimitExceeded = true;
    const badge = document.getElementById('tracker-badge');
    
    if (badge) {
      badge.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      badge.style.animation = 'pulse 2s infinite';
      
      // Add pulse animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `;
      document.head.appendChild(style);
      
      // Show limit exceeded message
      const timeDisplay = document.getElementById('time-display');
      if (timeDisplay) {
        timeDisplay.innerHTML = `
          <div style="color: #fecaca;">⚠️ Limit Exceeded!</div>
          <div style="font-size: 11px; margin-top: 2px;">Take a break</div>
        `;
      }
    }
  }

  minimize() {
    if (this.overlay) {
      const badge = document.getElementById('tracker-badge');
      badge.style.transform = 'scale(0.8)';
      badge.style.opacity = '0.7';
      
      setTimeout(() => {
        badge.style.width = '60px';
        badge.style.height = '60px';
        badge.innerHTML = `
          <div style="text-align: center; font-size: 12px;">
            <div>📊</div>
            <div style="font-size: 10px;">${Math.floor((new Date() - this.startTime) / (1000 * 60))}m</div>
          </div>
        `;
        
        badge.addEventListener('click', () => {
          this.restore();
        });
      }, 300);
    }
  }

  restore() {
    if (this.overlay) {
      this.remove();
      this.create(this.platform, this.limit);
    }
  }

  remove() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

// Global overlay instance
window.trackingOverlay = new TrackingOverlay();

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    if (message.action === 'startTracking') {
      console.log('Starting overlay for:', message.platform);
      window.trackingOverlay.create(message.platform, message.limit);
    } else if (message.action === 'stopTracking') {
      console.log('Stopping overlay');
      window.trackingOverlay.remove();
    }
  } catch (error) {
    console.error('Overlay error:', error);
  }
});

// Initialize overlay when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeOverlay);
} else {
  initializeOverlay();
}

function initializeOverlay() {
  console.log('Overlay script loaded on:', window.location.hostname);
  
  // Check if we're on a tracked platform
  const hostname = window.location.hostname.replace('www.', '');
  const platforms = {
    'facebook.com': 'Facebook',
    'twitter.com': 'Twitter',
    'x.com': 'Twitter',
    'instagram.com': 'Instagram',
    'tiktok.com': 'TikTok',
    'linkedin.com': 'LinkedIn',
    'youtube.com': 'YouTube'
  };
  
  const platform = platforms[hostname];
  if (platform) {
    console.log('Detected platform:', platform);
    // Auto-start overlay with default limit (will be updated by background script)
    setTimeout(() => {
      window.trackingOverlay.create(platform, 60);
    }, 1000);
  }
}