// vercel.js
// This file serves as an adapter for Vercel serverless functions
const { createServer } = require('http');
const app = require('./dist/server').default;

// Create a server instance for Vercel
const server = createServer(app);

// Export the server as a handler for Vercel
module.exports = server;