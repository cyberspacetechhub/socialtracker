console.log('=== OVERLAY SCRIPT LOADED ===');
console.log('URL:', window.location.href);
console.log('Hostname:', window.location.hostname);
console.log('Document ready state:', document.readyState);

class DraggableTracker {
  constructor() {
    this.startTime = Date.now();
    this.limit = 5; // 5 minutes for testing
    this.currentUsage = 44; // Start with 44 minutes already used
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.create();
  }

  create() {
    console.log('🛠️ Creating overlay...');
    
    // Remove existing
    const existing = document.getElementById('tracker-overlay');
    if (existing) {
      console.log('Removing existing overlay');
      existing.remove();
    }

    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.id = 'tracker-overlay';
    console.log('Overlay element created:', this.overlay);
    this.overlay.innerHTML = `
      <div id="tracker-widget" style="
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        background: ${this.currentUsage >= this.limit ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #4f46e5, #7c3aed)'} !important;
        color: white !important;
        padding: 12px 16px !important;
        border-radius: 12px !important;
        font-family: system-ui !important;
        font-size: 14px !important;
        z-index: 999999 !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important;
        cursor: move !important;
        user-select: none !important;
        min-width: 200px !important;
        ${this.currentUsage >= this.limit ? 'animation: pulse 2s infinite;' : ''}
      ">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-weight: 600; margin-bottom: 4px;">
              ${this.currentUsage >= this.limit ? '⚠️ Limit Exceeded!' : '📊 Facebook'}
            </div>
            <div id="usage-display" style="font-size: 12px; opacity: 0.9;">
              ${this.currentUsage}m / ${this.limit}m
            </div>
          </div>
          <button id="close-btn" style="
            background: rgba(255,255,255,0.2) !important;
            border: none !important;
            color: white !important;
            width: 24px !important;
            height: 24px !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            font-size: 16px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin-left: 12px !important;
          ">×</button>
        </div>
        <div style="
          width: 100% !important;
          height: 4px !important;
          background: rgba(255,255,255,0.3) !important;
          border-radius: 2px !important;
          margin-top: 8px !important;
          overflow: hidden !important;
        ">
          <div id="progress-bar" style="
            height: 100% !important;
            background: ${this.currentUsage >= this.limit ? '#fca5a5' : '#4ade80'} !important;
            width: ${Math.min((this.currentUsage / this.limit) * 100, 100)}% !important;
            transition: all 0.3s ease !important;
            border-radius: 2px !important;
          "></div>
        </div>
        ${this.currentUsage >= this.limit ? `
          <div style="
            margin-top: 8px !important;
            padding: 8px !important;
            background: rgba(255,255,255,0.1) !important;
            border-radius: 6px !important;
            font-size: 12px !important;
            text-align: center !important;
          ">
            Take a break! You've exceeded your daily limit.
          </div>
        ` : ''}
      </div>
    `;

    // Add pulse animation for exceeded limit
    if (this.currentUsage >= this.limit) {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `;
      document.head.appendChild(style);
    }

    console.log('Appending overlay to body...');
    document.body.appendChild(this.overlay);
    console.log('✅ Overlay appended to DOM');
    
    // Verify it's in the DOM
    const check = document.getElementById('tracker-overlay');
    console.log('Overlay in DOM check:', check ? '✅ Found' : '❌ Not found');

    // Add event listeners
    this.addEventListeners();
    this.startTimer();
  }

  addEventListeners() {
    const widget = document.getElementById('tracker-widget');
    const closeBtn = document.getElementById('close-btn');

    // Close button
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.minimize();
    });

    // Drag functionality
    widget.addEventListener('mousedown', (e) => {
      if (e.target === closeBtn) return;
      
      this.isDragging = true;
      const rect = widget.getBoundingClientRect();
      this.dragOffset.x = e.clientX - rect.left;
      this.dragOffset.y = e.clientY - rect.top;
      
      widget.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      
      const widget = document.getElementById('tracker-widget');
      if (!widget) return;
      
      const x = e.clientX - this.dragOffset.x;
      const y = e.clientY - this.dragOffset.y;
      
      // Keep within viewport
      const maxX = window.innerWidth - widget.offsetWidth;
      const maxY = window.innerHeight - widget.offsetHeight;
      
      widget.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
      widget.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
      widget.style.right = 'auto';
    });

    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        const widget = document.getElementById('tracker-widget');
        if (widget) {
          widget.style.cursor = 'move';
        }
      }
    });
  }

  startTimer() {
    setInterval(() => {
      this.updateDisplay();
    }, 1000);
  }

  updateDisplay() {
    const sessionTime = Math.floor((Date.now() - this.startTime) / (1000 * 60));
    const totalUsage = this.currentUsage + sessionTime;
    
    const usageDisplay = document.getElementById('usage-display');
    const progressBar = document.getElementById('progress-bar');
    
    if (usageDisplay) {
      usageDisplay.textContent = `${totalUsage}m / ${this.limit}m`;
    }
    
    if (progressBar) {
      const percentage = Math.min((totalUsage / this.limit) * 100, 100);
      progressBar.style.width = `${percentage}%`;
      
      if (totalUsage >= this.limit) {
        progressBar.style.background = '#fca5a5';
        if (totalUsage === this.limit) {
          this.showLimitExceeded();
        }
      }
    }
  }

  showLimitExceeded() {
    // Recreate with exceeded styling
    this.currentUsage = this.limit;
    this.create();
  }

  minimize() {
    const widget = document.getElementById('tracker-widget');
    if (widget) {
      widget.style.width = '60px';
      widget.style.height = '60px';
      widget.innerHTML = `
        <div style="text-align: center; font-size: 12px; padding: 8px;">
          <div>📊</div>
          <div style="font-size: 10px;">${this.currentUsage}m</div>
        </div>
      `;
      
      widget.addEventListener('click', () => {
        this.create();
      });
    }
  }
}

// Initialize on social media sites
const hostname = window.location.hostname.replace('www.', '');
const socialSites = ['facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'tiktok.com', 'linkedin.com', 'youtube.com'];

console.log('Checking hostname:', hostname);
console.log('Social sites:', socialSites);
console.log('Is social site?', socialSites.includes(hostname));

if (socialSites.includes(hostname)) {
  console.log('✅ SOCIAL SITE DETECTED:', hostname);
  console.log('Document ready state:', document.readyState);
  
  // Force immediate creation for testing
  console.log('Creating tracker immediately...');
  try {
    new DraggableTracker();
    console.log('✅ Tracker created successfully');
  } catch (error) {
    console.error('❌ Error creating tracker:', error);
  }
} else {
  console.log('❌ Not a social site, skipping tracker');
}