// Hand-written service worker for the legacy portal (no Workbox/build step,
// so it stays readable and has no dependency on the main app's PWA setup).
//
// Registered from a page inside this directory, so its scope defaults to
// /RSIChecklist/legacy-portal/ - a more specific scope than the main app's
// root-scoped service worker, meaning it (not the main app's SW) controls
// every page here, and therefore every fetch those pages make (including
// PDF requests to ../guidelines/, even though that path is outside this
// directory - scope controls which pages are controlled, not which fetch
// targets can be intercepted).
//
// Strategy: precache the small app shell on install (guaranteed to
// succeed), then cache-first with runtime fill-in for everything else
// (PDFs), so a guideline becomes available offline the first time it's
// opened. PDFs are NOT bulk-precached - the paediatric set alone is ~40MB
// with one ~30MB file, and an all-or-nothing cache.addAll() install would
// be slow/fragile on old hardware.

var CACHE_NAME = 'legacy-portal-v1';

var SHELL_ASSETS = [
  'index.html',
  'adult.html',
  'paediatric.html',
  'style.css',
  'search.js',
  'manifest.json',
  '../icons/icon-192.png',
  '../icons/icon-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(SHELL_ASSETS);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) { return key !== CACHE_NAME; })
            .map(function (key) { return caches.delete(key); })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) {
        return cached;
      }

      return fetch(event.request).then(function (response) {
        if (response && response.ok) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, copy);
          });
        }
        return response;
      }).catch(function () {
        return cached;
      });
    })
  );
});
