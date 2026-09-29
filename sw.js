const C='mischrechner-v3';
const FILES=['./','index.html','manifest.json','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
// Network first: with internet always the newest version, offline the cached one.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const timeout=new Promise((_,rej)=>setTimeout(rej,4000));
  e.respondWith(Promise.race([fetch(e.request,{cache:'no-cache'}),timeout]).then(res=>{
    if(res.ok&&e.request.url.startsWith(self.location.origin)){const cl=res.clone();caches.open(C).then(c=>c.put(e.request,cl));}
    return res;
  }).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});
