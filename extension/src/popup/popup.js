const API_BASE_URL = 'https://socialtracker-nlnk.onrender.com/api';
// const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', async () => {
    const token = await getAuthToken();
    
    if (token) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('mainSection').style.display = 'block';
        loadActiveSessions();
    } else {
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('mainSection').style.display = 'none';
    }
    
    // Add event listeners
    document.getElementById('loginBtn')?.addEventListener('click', login);
    document.getElementById('dashboardBtn')?.addEventListener('click', openDashboard);
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    
    // Handle Enter key in login form
    document.getElementById('password')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            login();
        }
    });
});

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }
    
    try {
        console.log('Attempting login to:', `${API_BASE_URL}/users/login`);
        
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            await chrome.storage.local.set({ authToken: data.token });
            console.log('Login successful, token stored');
            location.reload();
        } else {
            const errorData = await response.json().catch(() => ({ error: 'Login failed' }));
            alert('Login failed: ' + (errorData.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Cannot connect to server. Make sure the backend is running on https://socialtracker-nlnk.onrender.com');
    }
}

async function logout() {
    await chrome.storage.local.remove(['authToken']);
    location.reload();
}

async function loadActiveSessions() {
    chrome.runtime.sendMessage({ action: 'getActiveSessions' }, (response) => {
        const sessions = response?.sessions || [];
        const container = document.getElementById('activeSessions');
        const status = document.getElementById('status');
        
        if (sessions.length > 0) {
            status.textContent = `Tracking ${sessions.length} session(s)`;
            status.className = 'status active';
            
            container.innerHTML = sessions.map(session => `
                <div class="session">
                    <div class="platform">${session.platform}</div>
                    <div class="time">Started: ${new Date(session.startTime).toLocaleTimeString()}</div>
                </div>
            `).join('');
        } else {
            status.textContent = 'Not tracking';
            status.className = 'status inactive';
            container.innerHTML = '';
        }
    });
}

function openDashboard() {
    // chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
    chrome.tabs.create({ url: 'https://my-social-tracker.vercel.app/dashboard'});
};

async function getAuthToken() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['authToken'], (result) => {
            resolve(result.authToken);
        });
    });
}

// Refresh sessions every 5 seconds
setInterval(loadActiveSessions, 5000);