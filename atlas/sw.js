const CACHE = 'epr-atlas-shell-a24-4-2-1';
const SHELL = [
  '/atlas/',
  '/atlas/index.html',
  '/atlas/manifest.webmanifest',
  '/atlas/icon-192.png',
  '/atlas/icon-512.png',
  '/atlas/icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key.startsWith('epr-atlas-shell-') && key !== CACHE)
        .map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never cache the PMTiles/vector-basemap Worker or other cross-origin map data.
  if (url.origin !== self.location.origin) return;

  // Keep the live Atlas HTML fresh while preserving an offline shell fallback.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(cache => cache.put('/atlas/index.html', copy));
        return resp;
      }).catch(() => caches.match('/atlas/index.html'))
    );
    return;
  }

  // Cache only the small local PWA shell assets.
  if (url.pathname.startsWith('/atlas/')) {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(cache => cache.put(req, copy));
        return resp;
      }))
    );
  }
});
