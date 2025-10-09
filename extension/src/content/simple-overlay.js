// Simple overlay implementation
console.log('Simple overlay script loaded');

// Create overlay immediately
function createTrackingOverlay() {
  // Remove existing overlay
  const existing = document.getElementById('social-tracker-overlay');
  if (existing) existing.remove();
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'social-tracker-overlay';
  overlay.innerHTML = `
    <div style="
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      background: #4f46e5 !important;
      color: white !important;
      padding: 12px 16px !important;
      border-radius: 8px !important;
      font-family: system-ui !important;
      font-size: 14px !important;
      z-index: 999999 !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
      min-width: 180px !important;
    ">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">📊 Tracking Active</div>
          <div id="timer-display" style="font-size: 12px;">0:00</div>
        </div>
        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
          background: rgba(255,255,255,0.2) !important;
          border: none !important;
          color: white !important;
          width: 20px !important;
          height: 20px !important;
          border-radius: 50% !important;
          cursor: pointer !important;
          font-size: 14px !important;
        ">×</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  console.log('Overlay created successfully');
  
  // Start timer
  let startTime = Date.now();
  setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
      timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

// Check if we're on a social media site
const hostname = window.location.hostname.replace('www.', '');
const socialSites = ['facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'tiktok.com', 'linkedin.com', 'youtube.com'];

if (socialSites.includes(hostname)) {
  console.log('Social media site detected:', hostname);
  
  // Wait for page to load then create overlay
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(createTrackingOverlay, 1000);
    });
  } else {
    setTimeout(createTrackingOverlay, 1000);
  }
}