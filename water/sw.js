
const CACHE='epr-water-v1.0-20260920';
const SHELL=[
  '/water/','/water/index.html','/water/assets/water.css','/water/assets/water.js',
  '/water/manifest.webmanifest','/water/assets/icon-180.png','/water/assets/icon-192.png','/water/assets/icon-512.png'
];
const DATA=[
  '/data/water/rights.public.json','/data/water/storage.public.json','/data/water/use.public.json',
  '/data/water/system.public.json','/data/water/sources.public.json'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('epr-water-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const u=new URL(event.request.url);
  if(u.origin!==self.location.origin)return;
  const water=u.pathname.startsWith('/water/');
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
