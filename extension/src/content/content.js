// Content script for additional tracking features
let isActive = true;
let lastActivity = Date.now();

// Track user activity on the page
document.addEventListener('mousemove', updateActivity);
document.addEventListener('keypress', updateActivity);
document.addEventListener('scroll', updateActivity);
document.addEventListener('click', updateActivity);

// Track page visibility
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, notify background script
    chrome.runtime.sendMessage({ action: 'pageHidden' }).catch(() => {});
  } else {
    // Page is visible, notify background script
    chrome.runtime.sendMessage({ action: 'pageVisible' }).catch(() => {});
  }
});

function updateActivity() {
  lastActivity = Date.now();
  if (!isActive) {
    isActive = true;
    chrome.runtime.sendMessage({ action: 'userActive' }).catch(() => {});
  }
}

// Check for inactivity every 30 seconds
setInterval(() => {
  if (Date.now() - lastActivity > 30000 && isActive) {
    isActive = false;
    chrome.runtime.sendMessage({ action: 'userInactive' }).catch(() => {});
  }
}, 30000);

// Notify background script that content script is loaded
chrome.runtime.sendMessage({ action: 'contentLoaded', url: window.location.href }).catch(() => {});