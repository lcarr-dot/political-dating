const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON request bodies (large limit for base64 images)
app.use(express.json({ limit: '5mb' }));

// In-memory gallery of perfect match drawings (id, image dataURL, createdAt)
const galleryStore = [];

// Serve all static files from the project root (including index.html, images, sw.js, manifest.json, etc.)
app.use(express.static(__dirname));

// Example minimal API route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Political Dating backend is running' });
});

// Gallery: get all drawings
app.get('/api/gallery', (req, res) => {
  res.json({ images: galleryStore });
});

// Gallery: add a drawing (body: { image: dataURL })
app.post('/api/gallery', (req, res) => {
  const { image } = req.body;
  if (!image || typeof image !== 'string' || !image.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Invalid image (expect data URL)' });
  }
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
  galleryStore.push({ id, image, createdAt: Date.now() });
  res.status(201).json({ id });
});

app.listen(PORT, () => {
  console.log(`Political Dating server running at http://localhost:${PORT}`);
});

