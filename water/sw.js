const CACHE='epr-water-v1.4.4-migration-20260921';
const SHELL=[
  '/water/','/water/index.html','/water/assets/water-v9.2.1.css','/water/assets/water-v9.2.1.js',
  '/water/manifest.webmanifest?v=9.2.2-prod','/water/assets/epr-logo.png',
  '/water/assets/epr-app-icon-v2-180.png','/water/assets/epr-app-icon-v2-192.png','/water/assets/epr-app-icon-v2-512.png'
];
const DATA=[
  '/data/water/rights.public.json','/data/water/storage.public.json','/data/water/use.public.json',
  '/data/water/system.public.json','/data/water/sources.public.json'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.filter(k=>k.startsWith('epr-water-')&&!k.startsWith('epr-water-test-')&&k!==CACHE).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim()));
});
async function networkFirst(request){
  const cache=await caches.open(CACHE);
  try{
    const r=await fetch(request,{cache:'no-store'});
    if(r.ok) cache.put(request,r.clone());
    return r;
  }catch(e){
    const cached=await cache.match(request);
    if(cached) return cached;
    throw e;
  }
}
self.addEventListener('fetch',event=>{
  const u=new URL(event.request.url);
  if(u.origin!==self.location.origin)return;
  const water=u.pathname.startsWith('/water/');
  const data=u.pathname.startsWith('/data/water/');
  if(!water&&!data)return;
  if(data){
    event.respondWith(networkFirst(event.request).catch(()=>new Response(JSON.stringify({error:'offline-data-unavailable'}),{status:503,headers:{'Content-Type':'application/json'}})));
    return;
  }
  const fresh=event.request.mode==='navigate'||/\.(?:css|js|html)$/.test(u.pathname);
  if(fresh){ event.respondWith(networkFirst(event.request)); return; }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
