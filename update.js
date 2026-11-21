// drawGene : mise à jour AUTOMATIQUE. Au démarrage, la nouvelle version s'installe tout de suite.
// Pendant le travail, elle s'installe dès qu'on ne touche à rien pendant 1 minute (ou qu'on change de fenêtre) ; le dessin est enregistré avant.
(function(){const APPV=33;
function force(){try{typeof save=='function'&&save()}catch(e){}const go=()=>location.replace(location.pathname+'?maj='+Date.now());
  Promise.all([window.caches?caches.keys().then(k=>Promise.all(k.map(x=>caches.delete(x)))):0,navigator.serviceWorker?navigator.serviceWorker.getRegistrations().then(r=>Promise.all(r.map(x=>x.unregister()))):0]).then(go,go)}
let attente=false,dernier=Date.now();['pointerdown','pointermove','keydown','wheel'].forEach(t=>addEventListener(t,()=>dernier=Date.now(),true));
function note(){if(document.getElementById('dgupd'))return;const b=document.createElement('div');b.id='dgupd';
  b.style.cssText='position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:999;background:#ffb020;color:#000;padding:6px 14px;border-radius:10px;font:600 12.5px system-ui;box-shadow:0 6px 24px #0009;pointer-events:none';
  b.textContent='🔄 Nouvelle version prête : elle s\'installera toute seule dès que vous faites une pause';document.body.append(b)}
function bientot(){if(attente)return;attente=true;note();
  const t=setInterval(()=>{const occupe=document.querySelector('.dga textarea:focus,#dgcom textarea')||(window.DGAssist&&document.querySelector('.dga .m.a:last-child')&&document.querySelector('.dga .m.a:last-child').textContent=='…');
    if(document.hidden||(!occupe&&Date.now()-dernier>60000)){clearInterval(t);force()}},5000)}
function check(premier){if(!navigator.onLine)return;fetch('version.txt?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.text():'0').then(v=>{if(+v>APPV){if(premier&&!/maj=/.test(location.search))force();else bientot()}}).catch(()=>{})}
window.DGUpdate={force,check,version:APPV};addEventListener('load',()=>check(true));document.addEventListener('visibilitychange',()=>{if(document.hidden&&attente)force();else if(!document.hidden)check()});setInterval(()=>check(),10*60*1000)})();
