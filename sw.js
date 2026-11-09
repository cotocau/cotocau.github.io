// Funcionamiento sin conexión. Cambia VERSION en cada actualización de la app.
const VERSION='oficial-cau-2026-11-09-3', MINE=k=>!k.startsWith('pruebas-');
const SHELL=['./','./index.html','./classic.webp','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/apple-touch-icon.png','./voz/1/acabat.mp3','./voz/1/accepte.mp3','./voz/1/bac.mp3','./voz/1/baclimpia.mp3','./voz/1/bones.mp3','./voz/1/denit.mp3','./voz/1/envit.mp3','./voz/1/falta.mp3','./voz/1/jotambe.mp3','./voz/1/jotambe2.mp3','./voz/1/juguem.mp3','./voz/1/lavull.mp3','./voz/1/limpia.mp3','./voz/1/novull.mp3','./voz/1/passe.mp3','./voz/1/pertu.mp3','./voz/1/rebac.mp3','./voz/1/sv.mp3','./voz/1/torne.mp3','./voz/1/vinga.mp3','./voz/1/xac.mp3','./voz/1/xic.mp3','./voz/2/acabat.mp3','./voz/2/accepte.mp3','./voz/2/bac.mp3','./voz/2/baclimpia.mp3','./voz/2/bones.mp3','./voz/2/denit.mp3','./voz/2/envit.mp3','./voz/2/falta.mp3','./voz/2/jotambe.mp3','./voz/2/jotambe2.mp3','./voz/2/juguem.mp3','./voz/2/lavull.mp3','./voz/2/limpia.mp3','./voz/2/novull.mp3','./voz/2/passe.mp3','./voz/2/pertu.mp3','./voz/2/rebac.mp3','./voz/2/sv.mp3','./voz/2/torne.mp3','./voz/2/vinga.mp3','./voz/2/xac.mp3','./voz/2/xic.mp3','./voz/3/acabat.mp3','./voz/3/accepte.mp3','./voz/3/bac.mp3','./voz/3/baclimpia.mp3','./voz/3/bones.mp3','./voz/3/denit.mp3','./voz/3/envit.mp3','./voz/3/falta.mp3','./voz/3/jotambe.mp3','./voz/3/jotambe2.mp3','./voz/3/juguem.mp3','./voz/3/lavull.mp3','./voz/3/limpia.mp3','./voz/3/novull.mp3','./voz/3/passe.mp3','./voz/3/pertu.mp3','./voz/3/rebac.mp3','./voz/3/sv.mp3','./voz/3/torne.mp3','./voz/3/vinga.mp3','./voz/3/xac.mp3','./voz/3/xic.mp3','./voz/4/acabat.mp3','./voz/4/accepte.mp3','./voz/4/bac.mp3','./voz/4/baclimpia.mp3','./voz/4/bones.mp3','./voz/4/denit.mp3','./voz/4/envit.mp3','./voz/4/falta.mp3','./voz/4/jotambe.mp3','./voz/4/jotambe2.mp3','./voz/4/juguem.mp3','./voz/4/lavull.mp3','./voz/4/limpia.mp3','./voz/4/novull.mp3','./voz/4/passe.mp3','./voz/4/pertu.mp3','./voz/4/rebac.mp3','./voz/4/sv.mp3','./voz/4/torne.mp3','./voz/4/vinga.mp3','./voz/4/xac.mp3','./voz/4/xic.mp3','./sfx/recoger.mp3','./sfx/roce.mp3','./sfx/tapete.mp3','./sfx/toque.mp3'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
// cada versión (oficial y pruebas) borra solo sus copias viejas, nunca las de la otra
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION&&MINE(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin===location.origin&&url.pathname.startsWith('/pruebas/'))return;   // la versión de pruebas tiene su propio service worker
  // La app: primero la red (para recibir actualizaciones) y, sin conexión, la copia guardada.
  if(req.mode==='navigate'){
    e.respondWith(fetch(req.url,{cache:'no-store'}).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put('./index.html',cp));return r;})
      .catch(()=>caches.open(VERSION).then(c=>c.match('./index.html'))));return;}
  // Tipografías y archivos propios: la copia guardada y, si no existe, la red.
  if(url.origin===location.origin||url.hostname.endsWith('fonts.googleapis.com')||url.hostname.endsWith('fonts.gstatic.com')){
    e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok||r.type==='opaque'){const cp=r.clone();caches.open(VERSION).then(c=>c.put(req,cp));}return r;})));}
});
