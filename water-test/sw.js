
const CACHE='epr-water-test-v1.4.3-readable-type-20260921';
const SHELL=[
  '/water-test/','/water-test/index.html','/water-test/assets/water.css','/water-test/assets/water.js',
  '/water-test/manifest.webmanifest?v=9-test','/water-test/assets/epr-logo.png','/water-test/assets/epr-app-icon-v2-180.png','/water-test/assets/epr-app-icon-v2-192.png','/water-test/assets/epr-app-icon-v2-512.png'
];
const DATA=[
  '/data/water/rights.public.json','/data/water/storage.public.json','/data/water/use.public.json',
  '/data/water/system.public.json','/data/water/sources.public.json'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('epr-water-test-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const u=new URL(event.request.url);
  if(u.origin!==self.location.origin)return;
  const water=u.pathname.startsWith('/water-test/');
  const data=u.pathname.startsWith('/data/water/');
  if(!water&&!data)return;
  if(data){
    event.respondWith(fetch(event.request).then(r=>{
      if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));}
      return r;
    }).catch(()=>caches.match(event.request).then(r=>r||new Response(JSON.stringify({error:'offline-data-unavailable'}),{status:503,headers:{'Content-Type':'application/json'}}))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
