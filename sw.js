const C='finapp-v1.4';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.add('./')).catch(()=>{}));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(r=>{
      if(r&&r.ok&&new URL(e.request.url).origin===self.location.origin){
        const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));
      }
      return r;
    }).catch(()=>caches.match(e.request).then(m=>m||caches.match('./')))
  );
});
