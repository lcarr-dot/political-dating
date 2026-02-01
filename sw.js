const CACHE_NAME = 'political-dating-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/averaeg repbulican 2.jpeg',
  '/averaeg republican 3.jpeg',
  '/averaeg republican 4.jpeg',
  '/average democrat 1.jpeg',
  '/average democrat 2.jpeg',
  '/average democrat 3.jpeg',
  '/average democrat 4.jpeg',
  '/average repbulican 1.jpeg',
  '/barron trump.jpeg',
  '/biden_face_crop.png',
  '/hunter biden.jpeg',
  '/images-2.jpeg',
  '/images-3.jpeg',
  '/licensed-image.jpeg',
  '/The-meaning-of-the-colors-red-white-and-blue-on-the-American-flag.jpg',
  '/ChatGPT Image Jan 31, 2026 at 05_40_22 PM.png',
  '/ChatGPT Image Jan 31, 2026 at 06_52_34 PM.png',
  '/ChatGPT Image Jan 31, 2026 at 06_52_51 PM.png'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Cache failed:', err);
      })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        });
      })
  );
});
