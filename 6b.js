// Import the Express module
const express = require('express');

// Create an instance of the Express application
const app = express();

// Define the port the server will listen on
const PORT = 3000;

/**
 * 1. Home Route: '/'
 * This route handles the root URL.
 */
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Multi-Route Express Site</h1>
    <p>Visit <a href="/about">/about</a> or <a href="/api/data">/api/data</a></p>
  `);
});

/**
 * 2. About Route: '/about'
 * This route provides information about the site.
 */
app.get('/about', (req, res) => {
  res.send(`
    <h2>About This Application</h2>
    <p>This is a demonstration of how to implement multiple distinct routes using the Express.js framework.</p>
  `);
});

/**
 * 3. API Route: '/api/data'
 * This route simulates a simple API endpoint by sending JSON data.
 */
app.get('/api/data', (req, res) => {
  res.json({
    status: 'success',
    endpoint: '/api/data',
    message: 'Data successfully retrieved from the server route.',
    users: 5
  });
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running at: http://localhost:${PORT}`);
  console.log('📌 Available routes:');
  console.log(`- Home:   http://localhost:${PORT}/`);
  console.log(`- About:  http://localhost:${PORT}/about`);
  console.log(`- API:    http://localhost:${PORT}/api/data\n`);
});