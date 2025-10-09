const API_BASE_URL = 'https://socialtracker-nlnk.onrender.com/api';

const PLATFORM_DOMAINS = {
  'facebook.com': 'facebook',
  'twitter.com': 'twitter',
  'x.com': 'twitter',
  'instagram.com': 'instagram',
  'tiktok.com': 'tiktok',
  'linkedin.com': 'linkedin',
  'youtube.com': 'youtube'
};

let activeSessions = new Map();

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log('Tab updated:', tabId, changeInfo.status, tab.url);
  
  if (changeInfo.status === 'complete' && tab.url) {
    const token = await getAuthToken();
    if (token) {
      handleTabChange(tabId, tab.url);
    } else {
      console.log('No auth token, skipping tracking');
    }
  }
});

// Listen for tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const token = await getAuthToken();
  if (!token) return;
  
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url) {
    console.log('Tab activated:', tab.url);
    handleTabChange(activeInfo.tabId, tab.url);
  }
});

// Listen for tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  endSession(tabId);
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // All windows lost focus
    pauseAllSessions();
  } else {
    // Window gained focus
    chrome.tabs.query({ active: true, windowId }, (tabs) => {
      if (tabs[0]) {
        handleTabChange(tabs[0].id, tabs[0].url);
      }
    });
  }
});

function handleTabChange(tabId, url) {
  console.log('Handling tab change:', tabId, url);
  
  const platform = getPlatformFromUrl(url);
  console.log('Detected platform:', platform);
  
  // End previous session for this tab
  endSession(tabId);
  
  // Start new session if on supported platform
  if (platform) {
    console.log(`Starting tracking for ${platform}`);
    startSession(tabId, platform, url);
  } else {
    console.log('Not a tracked platform');
  }
}

function getPlatformFromUrl(url) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    console.log('Checking hostname:', hostname);
    
    // Check if hostname matches any platform domain
    for (const [domain, platform] of Object.entries(PLATFORM_DOMAINS)) {
      if (hostname === domain || hostname.endsWith('.' + domain)) {
        console.log(`Matched platform: ${platform} for domain: ${domain}`);
        return platform;
      }
    }
    
    console.log('No platform match found');
    return null;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return null;
  }
}

async function startSession(tabId, platform, url) {
  try {
    const token = await getAuthToken();
    if (!token) {
      console.log('No auth token found, skipping session start');
      return;
    }

    console.log(`Starting session for ${platform} on tab ${tabId}`);
    
    // Get user limits
    const userResponse = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    let limit = 60; // Default
    if (userResponse.ok) {
      const userData = await userResponse.json();
      limit = userData.user.limits[platform] || 60;
    }
    
    const response = await fetch(`${API_BASE_URL}/activity/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ platform, url })
    });

    if (response.ok) {
      const data = await response.json();
      activeSessions.set(tabId, {
        activityId: data.activity._id,
        platform,
        startTime: new Date(),
        limit
      });
      
      console.log(`Session started: ${data.activity._id}`);
      
      // Update badge
      chrome.action.setBadgeText({ text: '●', tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#4ade80' });
      
      // Send message to content script to show overlay
      chrome.tabs.sendMessage(tabId, {
        action: 'startTracking',
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        limit: limit
      }).catch(() => {});
      
    } else {
      console.error('Failed to start session:', response.status, await response.text());
    }
  } catch (error) {
    console.error('Failed to start session:', error);
  }
}

async function endSession(tabId) {
  const session = activeSessions.get(tabId);
  if (!session) return;

  try {
    const token = await getAuthToken();
    if (!token) return;

    await fetch(`${API_BASE_URL}/activity/end/${session.activityId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ endTime: new Date().toISOString() })
    });

    activeSessions.delete(tabId);
    chrome.action.setBadgeText({ text: '', tabId });
    
    // Send message to content script to hide overlay
    chrome.tabs.sendMessage(tabId, {
      action: 'stopTracking'
    }).catch(() => {});
    
  } catch (error) {
    console.error('Failed to end session:', error);
  }
}

function pauseAllSessions() {
  // In a real implementation, you might want to pause rather than end
  activeSessions.forEach((session, tabId) => {
    endSession(tabId);
  });
}

async function getAuthToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['authToken'], (result) => {
      resolve(result.authToken);
    });
  });
}

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getActiveSessions') {
    sendResponse({ sessions: Array.from(activeSessions.values()) });
  }
  
  if (request.action === 'fetchUsageData') {
    fetchUsageDataFromAPI(request.platform).then(data => {
      sendResponse({ success: true, data });
    }).catch(() => {
      sendResponse({ success: false });
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'takeBreak') {
    handleTakeBreak(sender.tab.id);
    sendResponse({ success: true });
  }
  
  if (request.action === 'pageHidden' && sender.tab) {
    // Pause session when page is hidden
    const session = activeSessions.get(sender.tab.id);
    if (session) {
      session.pausedAt = new Date();
    }
  }
  
  if (request.action === 'pageVisible' && sender.tab) {
    // Resume session when page is visible
    const session = activeSessions.get(sender.tab.id);
    if (session && session.pausedAt) {
      delete session.pausedAt;
    }
  }
});

async function fetchUsageDataFromAPI(platform) {
  const token = await getAuthToken();
  if (!token) throw new Error('No auth token');
  
  const today = new Date().toISOString().split('T')[0];
  const response = await fetch(`${API_BASE_URL}/activity/daily/${today}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) throw new Error('API request failed');
  return await response.json();
}

async function handleTakeBreak(tabId) {
  try {
    // End current session
    await endSession(tabId);
    
    // Open dashboard in new tab
    chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
    
    // Close the social media tab
    chrome.tabs.remove(tabId);
  } catch (error) {
    console.error('Failed to handle take break:', error);
  }
}

// Check for limit violations every minute
setInterval(async () => {
  for (const [tabId, session] of activeSessions) {
    const duration = Math.round((new Date() - session.startTime) / (1000 * 60));
    if (duration > 0 && duration % 5 === 0) { // Check every 5 minutes
      await checkAndNotifyLimits(session.platform, duration);
    }
  }
}, 60000);

async function checkAndNotifyLimits(platform, currentUsage) {
  try {
    const token = await getAuthToken();
    if (!token) return;

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const data = await response.json();
      const limit = data.user.limits[platform] || 60;
      
      if (currentUsage >= limit) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: 'Time Limit Exceeded!',
          message: `You've exceeded your ${limit} minute limit on ${platform}`
        });
      }
    }
  } catch (error) {
    console.error('Failed to check limits:', error);
  }
}