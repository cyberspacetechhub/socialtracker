// Social Media Usage Tracker Overlay
function createWorkingOverlay() {
  const platformName = getPlatformName();
  const platformKey = getPlatformKey();
  
  function getPlatformName() {
    const hostname = window.location.hostname.replace('www.', '');
    if (hostname.includes('facebook.com')) return 'Facebook';
    if (hostname.includes('instagram.com')) return 'Instagram';
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'Twitter';
    if (hostname.includes('tiktok.com')) return 'TikTok';
    if (hostname.includes('linkedin.com')) return 'LinkedIn';
    if (hostname.includes('youtube.com')) return 'YouTube';
    return 'Social Media';
  }
  
  function getPlatformKey() {
    const hostname = window.location.hostname.replace('www.', '');
    if (hostname.includes('facebook.com')) return 'facebook';
    if (hostname.includes('instagram.com')) return 'instagram';
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
    if (hostname.includes('tiktok.com')) return 'tiktok';
    if (hostname.includes('linkedin.com')) return 'linkedin';
    if (hostname.includes('youtube.com')) return 'youtube';
    return 'unknown';
  }
  
  // Get real usage data
  let currentUsage = 0;
  let dailyLimit = 60;
  let isLimitExceeded = false;
  
  // Fetch real data from backend
  fetchRealUsageData(platformKey).then(data => {
    if (data) {
      currentUsage = data.usage || 0;
      dailyLimit = data.limit || 60;
      isLimitExceeded = currentUsage >= dailyLimit;
      // Recreate overlay with real data
      const existing = document.getElementById('tracker-widget');
      if (existing) existing.remove();
      createOverlayWithData();
    }
  });
  
  function createOverlayWithData() {
  // Remove existing
  const existing = document.getElementById('tracker-widget');
  if (existing) existing.remove();
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'tracker-widget';
  overlay.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    width: 200px !important;
    background: ${isLimitExceeded ? '#ef4444' : '#4f46e5'} !important;
    color: white !important;
    padding: 15px !important;
    border-radius: 10px !important;
    font-family: Arial, sans-serif !important;
    font-size: 14px !important;
    z-index: 999999 !important;
    box-shadow: 0 5px 20px rgba(0,0,0,0.4) !important;
    cursor: move !important;
    user-select: none !important;
  `;
  
  overlay.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <div style="font-weight: bold;">${isLimitExceeded ? '⚠️' : '📊'} ${platformName}</div>
      <div id="close-btn" style="
        background: rgba(255,255,255,0.3);
        border: none;
        color: white;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 14px;
        text-align: center;
        line-height: 18px;
      ">×</div>
    </div>
    <div style="font-size: 12px; margin-bottom: 8px;">${currentUsage}m / ${dailyLimit}m used today</div>
    <div style="
      width: 100%;
      height: 4px;
      background: rgba(255,255,255,0.3);
      border-radius: 2px;
    ">
      <div style="
        height: 100%;
        background: ${currentUsage >= dailyLimit ? '#ef4444' : currentUsage > dailyLimit * 0.8 ? '#f59e0b' : '#10b981'};
        width: ${Math.min((currentUsage / dailyLimit) * 100, 100)}%;
        border-radius: 2px;
        transition: all 0.3s ease;
      "></div>
    </div>
    <div id="take-break-btn" style="
      margin-top: 8px;
      padding: 8px;
      background: rgba(255,255,255,0.1);
      border-radius: 5px;
      font-size: 11px;
      text-align: center;
      cursor: pointer;
      transition: background 0.2s;
    " onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">Take a break!</div>
  `;
  
  document.body.appendChild(overlay);
  
  // Add minimize/restore functionality
  let isMinimized = false;
  
  function minimizeOverlay(e) {
    e.stopPropagation();
    
    overlay.style.width = '50px';
    overlay.style.height = '50px';
    overlay.style.padding = '8px';
    overlay.innerHTML = `
      <div style="text-align: center; font-size: 12px; cursor: pointer;" id="mini-widget">
        <div>📊</div>
        <div style="font-size: 10px;">${currentUsage}m</div>
      </div>
    `;
    isMinimized = true;
  }
  
  function restoreOverlay(e) {
    e.stopPropagation();
    if (!isMinimized) return;
    
    overlay.style.width = '200px';
    overlay.style.height = 'auto';
    overlay.style.padding = '15px';
    
    overlay.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div style="font-weight: bold;">⚠️ ${platformName} Limit!</div>
        <div id="close-btn" style="
          background: rgba(255,255,255,0.3);
          border: none;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 14px;
          text-align: center;
          line-height: 18px;
        ">×</div>
      </div>
      <div style="font-size: 12px; margin-bottom: 8px;">${currentUsage}m / ${dailyLimit}m used today</div>
      <div style="
        width: 100%;
        height: 4px;
        background: rgba(255,255,255,0.3);
        border-radius: 2px;
      ">
        <div style="
          height: 100%;
          background: ${currentUsage >= dailyLimit ? '#ef4444' : currentUsage > dailyLimit * 0.8 ? '#f59e0b' : '#10b981'};
          width: ${Math.min((currentUsage / dailyLimit) * 100, 100)}%;
          border-radius: 2px;
          transition: all 0.3s ease;
        "></div>
      </div>
      <div id="take-break-btn" style="
        margin-top: 8px;
        padding: 8px;
        background: rgba(255,255,255,0.1);
        border-radius: 5px;
        font-size: 11px;
        text-align: center;
        cursor: pointer;
        transition: background 0.2s;
      " onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">Take a break!</div>
    `;
    
    isMinimized = false;
    
    // Re-add close functionality
    const newCloseBtn = overlay.querySelector('#close-btn');
    newCloseBtn.addEventListener('click', minimizeOverlay);
  }
  
  // Handle clicks on overlay
  overlay.addEventListener('click', (e) => {
    if (e.target.id === 'close-btn') {
      minimizeOverlay(e);
    } else if (e.target.id === 'take-break-btn') {
      takeBreak(e);
    } else if (isMinimized) {
      restoreOverlay(e);
    }
  });
  
  function takeBreak(e) {
    e.stopPropagation();
    chrome.runtime.sendMessage({
      action: 'takeBreak',
      platform: platformKey
    });
  }
  
  const closeBtn = overlay.querySelector('#close-btn');
  closeBtn.addEventListener('click', minimizeOverlay);
  
  // Add drag functionality
  let isDragging = false;
  let startX, startY, initialX, initialY;
  
  overlay.addEventListener('mousedown', (e) => {
    if (e.target.id === 'close-btn') return;
    
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = overlay.offsetLeft;
    initialY = overlay.offsetTop;
    
    overlay.style.cursor = 'grabbing';
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    overlay.style.left = (initialX + deltaX) + 'px';
    overlay.style.top = (initialY + deltaY) + 'px';
    overlay.style.right = 'auto';
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      overlay.style.cursor = 'move';
    }
  });
  
  return overlay;
  }
}

// Check if on social media and create overlay
const hostname = window.location.hostname.replace('www.', '');
const socialSites = ['facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'tiktok.com', 'linkedin.com', 'youtube.com'];

const isSocialSite = socialSites.some(site => hostname.includes(site));

async function fetchRealUsageData(platform) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({
      action: 'fetchUsageData',
      platform: platform
    }, (response) => {
      if (response && response.success) {
        resolve({
          usage: response.data.usage[platform]?.duration || 0,
          limit: response.data.limits[platform] || 60
        });
      } else {
        resolve(null);
      }
    });
  });
}

async function getAuthToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['authToken'], (result) => {
      resolve(result.authToken);
    });
  });
}

if (isSocialSite) {
  setTimeout(() => {
    createWorkingOverlay();
  }, 1000);
}