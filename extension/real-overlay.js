// Real data overlay
function createRealOverlay() {
  const platformKey = getPlatformKey();
  const platformName = getPlatformName();
  
  // Default values
  let usage = 0;
  let limit = 60;
  let exceeded = false;
  
  // Get real data
  fetchRealData(platformKey).then(data => {
    if (data) {
      usage = data.usage || 0;
      limit = data.limit || 60;
      exceeded = usage >= limit;
      updateOverlay();
    }
  });
  
  function updateOverlay() {
    const existing = document.getElementById('tracker-widget');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'tracker-widget';
    overlay.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      width: 200px !important;
      background: ${exceeded ? '#ef4444' : '#4f46e5'} !important;
      color: white !important;
      padding: 15px !important;
      border-radius: 10px !important;
      font-family: Arial, sans-serif !important;
      z-index: 999999 !important;
      cursor: move !important;
    `;
    
    overlay.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <div style="font-weight: bold;">${exceeded ? '⚠️' : '📊'} ${platformName}</div>
        <div id="close-btn" style="cursor: pointer; width: 20px; text-align: center;">×</div>
      </div>
      <div style="font-size: 12px;">${usage}m / ${limit}m used</div>
    `;
    
    document.body.appendChild(overlay);
    
    // Add close handler
    overlay.querySelector('#close-btn').addEventListener('click', () => {
      overlay.style.display = 'none';
    });
  }
  
  // Initial render with defaults
  updateOverlay();
}

function getPlatformKey() {
  const hostname = window.location.hostname.replace('www.', '');
  if (hostname.includes('instagram.com')) return 'instagram';
  if (hostname.includes('facebook.com')) return 'facebook';
  return 'unknown';
}

function getPlatformName() {
  const hostname = window.location.hostname.replace('www.', '');
  if (hostname.includes('instagram.com')) return 'Instagram';
  if (hostname.includes('facebook.com')) return 'Facebook';
  return 'Social Media';
}

async function fetchRealData(platform) {
  try {
    const token = await getAuthToken();
    if (!token) return null;
    
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`https://socialtracker-nlnk.onrender.com/api/activity/daily/${today}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        usage: data.usage[platform]?.duration || 0,
        limit: 90 // Default for now, will get from user profile
      };
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
  return null;
}

async function getAuthToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['authToken'], (result) => {
      resolve(result.authToken);
    });
  });
}

// Initialize
const hostname = window.location.hostname.replace('www.', '');
if (hostname.includes('instagram.com') || hostname.includes('facebook.com')) {
  setTimeout(createRealOverlay, 1000);
}