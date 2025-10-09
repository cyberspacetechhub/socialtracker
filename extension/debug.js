// IMMEDIATE DEBUG SCRIPT
console.log('🔥 DEBUG SCRIPT LOADED IMMEDIATELY');
console.log('URL:', window.location.href);
console.log('Time:', new Date().toISOString());

// Create immediate test element
const testEl = document.createElement('div');
testEl.style.cssText = `
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  background: lime !important;
  color: black !important;
  padding: 10px !important;
  z-index: 999999 !important;
  font-size: 20px !important;
  font-weight: bold !important;
`;
testEl.textContent = 'CONTENT SCRIPT WORKING!';
document.documentElement.appendChild(testEl);

console.log('🟢 Test element created and added to DOM');