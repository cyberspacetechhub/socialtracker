const app = require('./app');
const connectDB = require('./connections/db');
const config = require('./config/config');

// Connect to database
connectDB();

// Start server
const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = server;