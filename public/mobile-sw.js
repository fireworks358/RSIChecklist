// Minimal service worker – required for PWA installability.
// No caching is implemented; all requests go straight to the network.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
