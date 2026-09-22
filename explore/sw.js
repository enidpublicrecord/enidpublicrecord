const CACHE='epr-explore-v1.5-ga4-correct-20260921';
const SHELL=['/explore/','/explore/index.html','/explore/assets/explore.css','/explore/assets/explore.js','/explore/assets/epr-logo.png','/explore/manifest.webmanifest?v=8','/explore/assets/epr-app-icon-v2-180.png','/explore/assets/epr-app-icon-v2-192.png','/explore/assets/epr-app-icon-v2-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('epr-explore-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==self.location.origin||!u.pathname.startsWith('/explore/'))return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
