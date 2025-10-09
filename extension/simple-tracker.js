console.log('🚀 Simple tracker loading...');

// Force create overlay immediately
function forceCreateOverlay() {
  console.log('🛠️ Force creating overlay...');
  
  // Remove any existing
  const existing = document.querySelector('#social-tracker-widget');
  if (existing) existing.remove();
  
  // Create with maximum CSS specificity and !important
  const overlay = document.createElement('div');
  overlay.id = 'social-tracker-widget';
  overlay.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    width: 220px !important;
    height: auto !important;
    background: #ef4444 !important;
    color: white !important;
    padding: 16px !important;
    border-radius: 12px !important;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    z-index: 2147483647 !important;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5) !important;
    border: 2px solid rgba(255,255,255,0.3) !important;
    cursor: move !important;
    user-select: none !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    transform: none !important;
    animation: pulse 2s infinite !important;
  `;
  
  overlay.innerHTML = `
    <div style="display: flex !important; align-items: center !important; justify-content: space-between !important;">
      <div>
        <div style="font-weight: 700 !important; margin-bottom: 6px !important; font-size: 16px !important;">
          ⚠️ LIMIT EXCEEDED!
        </div>
        <div style="font-size: 13px !important; opacity: 0.9 !important;">
          44m / 5m used today
        </div>
      </div>
      <button id="close-tracker-btn" style="
        background: rgba(255,255,255,0.3) !important;
        border: none !important;
        color: white !important;
        width: 28px !important;
        height: 28px !important;
        border-radius: 50% !important;
        cursor: pointer !important;
        font-size: 18px !important;
        font-weight: bold !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      ">×</button>
    </div>
    <div style="
      width: 100% !important;
      height: 6px !important;
      background: rgba(255,255,255,0.3) !important;
      border-radius: 3px !important;
      margin-top: 12px !important;
      overflow: hidden !important;
    ">
      <div style="
        height: 100% !important;
        background: #fca5a5 !important;
        width: 100% !important;
        border-radius: 3px !important;
      "></div>
    </div>
    <div style="
      margin-top: 12px !important;
      padding: 10px !important;
      background: rgba(255,255,255,0.15) !important;
      border-radius: 8px !important;
      font-size: 12px !important;
      text-align: center !important;
      font-weight: 600 !important;
    ">
      🛑 Take a break! You've used 880% of your limit.
    </div>
  `;
  
  // Add pulse animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { transform: scale(1) !important; }
      50% { transform: scale(1.05) !important; }
    }
  `;
  document.head.appendChild(style);
  
  // Force append to body
  document.body.appendChild(overlay);
  
  console.log('✅ Overlay created and appended');
  console.log('Overlay element:', overlay);
  console.log('Overlay in DOM:', document.getElementById('social-tracker-widget'));
  
  // Add close button event listener
  const closeBtn = document.getElementById('close-tracker-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      overlay.style.display = 'none';
      console.log('Overlay closed');
    });
  }
  
  // Make it draggable
  makeDraggable(overlay);
  
  return overlay;
}

function makeDraggable(element) {
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  
  element.addEventListener('mousedown', (e) => {
    // Don't drag if clicking the close button
    if (e.target.id === 'close-tracker-btn' || e.target.tagName === 'BUTTON') return;
    
    isDragging = true;
    const rect = element.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    
    element.style.cursor = 'grabbing !important';
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;
    
    const maxX = window.innerWidth - element.offsetWidth;
    const maxY = window.innerHeight - element.offsetHeight;
    
    element.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
    element.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    element.style.right = 'auto';
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      element.style.cursor = 'move !important';
    }
  });
}

// Check if on Facebook
const hostname = window.location.hostname;
console.log('Current hostname:', hostname);

if (hostname.includes('facebook.com')) {
  console.log('✅ Facebook detected, creating overlay...');
  
  // Try multiple times to ensure it works
  setTimeout(forceCreateOverlay, 500);
  setTimeout(forceCreateOverlay, 1500);
  setTimeout(forceCreateOverlay, 3000);
  
  // Also try when page fully loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceCreateOverlay);
  }
  
  window.addEventListener('load', forceCreateOverlay);
} else {
  console.log('❌ Not Facebook, skipping overlay');
}