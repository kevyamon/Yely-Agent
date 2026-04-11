//public/sw.js
const CACHE_NAME = 'yely-agent-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Interception réseau basique requise par les navigateurs pour valider l'installation PWA
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});