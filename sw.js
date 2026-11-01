// drawGene : fonctionne hors-ligne après la première visite
const V='drawgene-v7',APP=['./','index.html','plan.html','modele3d.html','peinture.html','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','lib.js','update.js','panels.js',
 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js','https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/TransformControls.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>Promise.all(APP.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!='GET')return;const local=new URL(e.request.url).origin==location.origin;
  e.respondWith(local?fetch(e.request,{cache:'no-cache'}).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}))
    :caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}return r})))});
