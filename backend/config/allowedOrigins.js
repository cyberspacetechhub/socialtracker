const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:3000', 
    'https://my-social-tracker.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    /^chrome-extension:\/\//
];

module.exports = allowedOrigins;