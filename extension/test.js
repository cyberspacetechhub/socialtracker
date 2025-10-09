console.log('TEST SCRIPT LOADED ON:', window.location.href);

// Create test overlay immediately
const testDiv = document.createElement('div');
testDiv.id = 'test-overlay';
testDiv.style.cssText = `
  position: fixed !important;
  top: 10px !important;
  right: 10px !important;
  background: red !important;
  color: white !important;
  padding: 10px !important;
  z-index: 999999 !important;
  font-size: 16px !important;
`;
testDiv.textContent = 'EXTENSION WORKING';

document.body.appendChild(testDiv);
console.log('Test overlay created');