// drawGene : détecte une nouvelle version et propose de l'installer en un clic
(function(){const APPV=10;
function force(){const go=()=>location.replace(location.pathname+'?maj='+Date.now());
  Promise.all([window.caches?caches.keys().then(k=>Promise.all(k.map(x=>caches.delete(x)))):0,navigator.serviceWorker?navigator.serviceWorker.getRegistrations().then(r=>Promise.all(r.map(x=>x.unregister()))):0]).then(go,go)}
function banner(){if(document.getElementById('dgupd'))return;const b=document.createElement('div');b.id='dgupd';
  b.style.cssText='position:fixed;left:50%;top:54px;transform:translateX(-50%);z-index:999;background:#ffb020;color:#000;padding:10px 16px;border-radius:10px;font:600 14px system-ui;box-shadow:0 6px 24px #0009;display:flex;gap:12px;align-items:center';
  b.innerHTML='🔄 Nouvelle version de drawGene disponible <button style="background:#000;color:#fff;border:0;border-radius:7px;padding:6px 12px;font:inherit;cursor:pointer">Mettre à jour</button>';
  b.querySelector('button').onclick=force;document.body.append(b)}
function check(){if(!navigator.onLine)return;fetch('version.txt?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.text():'0').then(v=>{if(+v>APPV)banner()}).catch(()=>{})}
window.DGUpdate={force,check,version:APPV};addEventListener('load',check);document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});setInterval(check,30*60*1000)})();
