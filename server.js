const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON request bodies
app.use(express.json());

// Serve all static files from the project root (including index.html, images, sw.js, manifest.json, etc.)
app.use(express.static(__dirname));

// Example minimal API route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Political Dating backend is running' });
});

app.listen(PORT, () => {
  console.log(`Political Dating server running at http://localhost:${PORT}`);
});

