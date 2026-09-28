const CACHE='epr-parks-a6';
const CORE=['./','index.html','manifest.webmanifest','icon-192.svg','icon-512.svg'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)))});
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==CACHE&&k.startsWith('epr-parks-'))await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put('index.html',copy));return resp}).catch(()=>caches.match('index.html')));
    return;
  }
  if(new URL(r.url).origin===self.location.origin){
    e.respondWith(caches.match(r).then(cached=>cached||fetch(r).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(r,copy));return resp})));
  }
});
