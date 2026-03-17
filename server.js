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

// AI-generated perfect match description from party + radical score
function generatePerfectMatchDescription(party, radicalScore) {
  const score = Number(radicalScore) || 420;
  const isRep = (party || '').toLowerCase() === 'republican';

  const repIntros = [
    'Your perfect match is a true patriot who',
    'You\'re looking for someone who',
    'The one for you is the kind of person who',
    'Your ideal partner'
  ];
  const demIntros = [
    'Your perfect match is a progressive soul who',
    'You\'re drawn to someone who',
    'The one for you is the kind of person who',
    'Your ideal partner'
  ];

  const repTraits = {
    67: ['values family and tradition', 'likes a good cookout and the flag', 'keeps it classic and steady', 'believes in hard work and faith'],
    420: ['is down to debate policy then grab a beer', 'knows every meme and every talking point', 'has strong opinions and a sense of humor', 'mixes principle with a little chaos'],
    667: ['never backs down from a fight', 'has a flag in the truck and fire in the heart', 'speaks up and stands up', 'is all-in for the cause'],
    669: ['is maximum based', 'would run through a wall for what they believe', 'is the main character of the movement', 'has a radical score to match yours']
  };
  const demTraits = {
    67: ['cares about community and fairness', 'likes good coffee and good vibes', 'keeps it real and kind', 'believes in lifting people up'],
    420: ['is down to protest then brunch', 'knows every policy and every meme', 'has strong values and a great playlist', 'mixes activism with a good time'],
    667: ['never stays quiet when it matters', 'has posters on the wall and fire in the heart', 'shows up and speaks out', 'is all-in for the cause'],
    669: ['is maximum radical', 'would organize a march in their sleep', 'is the main character of the movement', 'has a radical score to match yours']
  };

  const scoreTier = score <= 100 ? 67 : score <= 500 ? 420 : score <= 668 ? 667 : 669;
  const traits = isRep ? repTraits[scoreTier] : demTraits[scoreTier];
  const intros = isRep ? repIntros : demIntros;

  const intro = intros[Math.floor(Math.random() * intros.length)];
  const trait1 = traits[Math.floor(Math.random() * traits.length)];
  const trait2 = traits.filter(t => t !== trait1)[Math.floor(Math.random() * (traits.length - 1))] || traits[0];
  return `${intro} ${trait1} and ${trait2}. With a radical score of ${score}, they\'re built for you.`;
}

app.post('/api/describe-perfect-match', (req, res) => {
  const { party, radicalScore } = req.body || {};
  const description = generatePerfectMatchDescription(party, radicalScore);
  res.json({ description });
});

app.listen(PORT, () => {
  console.log(`Political Dating server running at http://localhost:${PORT}`);
});

