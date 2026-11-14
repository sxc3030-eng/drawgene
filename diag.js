// drawGene — journal local (rien n'est envoyé) : erreurs, messages, actions, pour aider à trouver ce qui accroche
(function(){
const KEY='drawgene-journal',MAX=400,page=location.pathname.split('/').pop()||'index.html';
let J=[];try{J=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){J=[]}
let tSave=null;const flush=()=>{clearTimeout(tSave);tSave=null;try{localStorage.setItem(KEY,JSON.stringify(J.slice(-MAX)))}catch(e){}};const save=now=>{if(now){flush();return}clearTimeout(tSave);tSave=setTimeout(flush,300)};
addEventListener('pagehide',flush);addEventListener('beforeunload',flush);document.addEventListener('visibilitychange',()=>{if(document.hidden)flush()});
function log(type,msg){const s=String(msg).replace(/\s+/g,' ').slice(0,300);const last=J[J.length-1];
  if(last&&last.m==s&&last.y==type){last.n=(last.n||1)+1;last.t=Date.now()}else J.push({t:Date.now(),p:page,y:type,m:s});if(J.length>MAX)J=J.slice(-MAX);save(type!='action')}
window.DGLog={log,
  clear(){J=[];save()},
  text(){const v=(document.querySelector('#top b small')||{}).textContent||'?',gpu=!!navigator.gpu;const head=[`Rapport drawGene ${v} — ${new Date().toLocaleString('fr-CA')}`,
      `Navigateur : ${navigator.userAgent}`,`Écran : ${screen.width}×${screen.height}, fenêtre ${innerWidth}×${innerHeight}, zoom ${Math.round(devicePixelRatio*100)} %`,`Carte graphique WebGPU : ${gpu?'oui':'non'} · Installé : ${matchMedia('(display-mode: standalone)').matches?'oui':'non'}`,
      `Erreurs : ${J.filter(e=>e.y=='ERREUR').length} · Messages : ${J.filter(e=>e.y=='message').length} · Actions : ${J.filter(e=>e.y=='action').length}`,''];
    return head.concat(J.map(e=>`${new Date(e.t).toLocaleString('fr-CA')}  [${e.p}]  ${e.y.toUpperCase()}  ${e.m}${e.n>1?'  (×'+e.n+')':''}`)).join('\n')},
  show(){const old=document.getElementById('dglogw');if(old){old.remove();return}const w=document.createElement('div');w.id='dglogw';
    w.style.cssText='position:fixed;inset:6% 8%;z-index:300;background:#1b1d23;color:#e6e7ea;border:2px solid #ffb020;border-radius:12px;display:flex;flex-direction:column;box-shadow:0 20px 60px #000c;font:13px system-ui';
    w.innerHTML='<div style="display:flex;gap:8px;align-items:center;padding:10px 14px;border-bottom:1px solid #363a44"><b style="flex:1">🩺 Rapport de problème</b><button data-a="dl">⬇ Télécharger le rapport</button><button data-a="cp">📋 Copier</button><button data-a="clr">🧹 Vider</button><button data-a="x">✕</button></div><p style="margin:8px 14px;color:#9aa0ab;font-size:12px">Ce journal reste sur cet ordinateur. Pour faire corriger un problème : <b>Télécharger le rapport</b>, puis envoyez le fichier (courriel, texto) à la personne qui s\'occupe de drawGene.</p><textarea readonly style="flex:1;margin:0 14px 14px;background:#0f1115;color:#cfd3da;border:1px solid #363a44;border-radius:8px;font:11.5px ui-monospace,monospace;padding:8px;resize:none"></textarea>';
    w.querySelectorAll('button').forEach(b=>b.style.cssText='background:#2f333c;border:1px solid #363a44;color:#e6e7ea;border-radius:6px;padding:5px 10px;cursor:pointer;font:inherit');
    const ta=w.querySelector('textarea');ta.value=DGLog.text();
    w.onclick=e=>{const a=e.target.dataset&&e.target.dataset.a;if(!a)return;if(a=='x')w.remove();
      if(a=='dl'){const u=URL.createObjectURL(new Blob(['﻿'+DGLog.text()],{type:'text/plain'}));const l=document.createElement('a');l.href=u;l.download='rapport-drawgene-'+new Date().toISOString().slice(0,16).replace(/[:T]/g,'-')+'.txt';l.click()}
      if(a=='cp'){ta.select();(navigator.clipboard?navigator.clipboard.writeText(ta.value):Promise.reject()).catch(()=>document.execCommand('copy'))}
      if(a=='clr'){DGLog.clear();ta.value=DGLog.text()}};
    document.body.append(w)}};
// erreurs du programme
addEventListener('error',e=>log('ERREUR',(e.message||'erreur')+(e.filename?' @'+e.filename.split('/').pop()+':'+e.lineno:'')));
addEventListener('unhandledrejection',e=>log('ERREUR','promesse : '+((e.reason&&e.reason.message)||e.reason)));
// messages montrés à l'utilisateur (alertes, bandeaux)
const A=window.alert;window.alert=function(m){log('message','alerte : '+m);return A.apply(this,arguments)};
const C=window.confirm;window.confirm=function(m){const r=C.apply(this,arguments);log('message','question : '+m+' → '+(r?'oui':'non'));return r};
// actions : boutons cliqués, touches importantes, annulations répétées (signe que ça accroche)
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#dglogw'))return;const b=e.target.closest&&e.target.closest('button,.it,.tb,.dgit,.dtag');if(!b)return;const t=(b.title||b.textContent||'').trim().replace(/\s+/g,' ').slice(0,60);if(t)log('action','clic « '+t+' »')},true);
let undoBurst=0,undoT=0;document.addEventListener('keydown',e=>{const k=(e.ctrlKey||e.metaKey?'Ctrl+':'')+(e.key.length==1?e.key.toUpperCase():e.key);
  if(/^(Ctrl\+[ZYCVXDAG]|Delete|Escape|Tab|Enter)$/.test(k)){log('action','touche '+k)}
  if(k=='Ctrl+Z'){undoBurst=Date.now()-undoT<4000?undoBurst+1:1;undoT=Date.now();if(undoBurst==5)log('alerte','5 annulations de suite : quelque chose ne marche pas comme prévu ?')}},true);
// texte des bandeaux d'info (#info, #help) : on note ce que le programme dit
const watch=id=>{const el=document.getElementById(id);if(!el)return;let last='';new MutationObserver(()=>{const t=el.textContent.trim();if(t&&t!==last&&/⚠|impossible|introuvable|invalide|verrouill|aucun|erreur|trop/i.test(t)){last=t;log('message',t)}}).observe(el,{childList:true,characterData:true,subtree:true})};
addEventListener('load',()=>{['info','help','sInfo'].forEach(watch);log('ouverture',page+' '+(((document.querySelector('#top b small')||{}).textContent)||''))});
})();
// drawGene — boîte « Un problème ? » : Eugene écrit ce qui ne va pas ; envoyé à SouverainCode avec le journal ci-dessus.
// Sans connexion, le commentaire attend sur cet ordinateur et repart tout seul plus tard.
(function(){
const QK='drawgene-com-attente';
const ai=()=>{try{return JSON.parse(localStorage.getItem('drawgene-ai')||'{}')}catch(e){return{}}};
const file=()=>{try{return JSON.parse(localStorage.getItem(QK)||'[]')}catch(e){return[]}};
const setFile=f=>{try{localStorage.setItem(QK,JSON.stringify(f))}catch(e){}};
async function envoyer(c){const a=ai();if(!a.souvJeton)throw new Error('pas de jeton');
  const r=await fetch((a.souvUrl||'https://souveraincode.ca')+'/api/drawgene/commentaire',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+a.souvJeton},body:JSON.stringify(c)});
  if(!r.ok)throw new Error('serveur '+r.status);return true}
async function vider(){const f=file();if(!f.length)return;const reste=[];for(const c of f){try{await envoyer(c)}catch(e){reste.push(c)}}setFile(reste);majBadge()}
let btn=null;function majBadge(){if(!btn)return;const n=file().length;btn.textContent=n?'💬 Un problème ? ('+n+' en attente)':'💬 Un problème ?'}
function ouvrir(){if(document.getElementById('dgcom')){document.getElementById('dgcom').remove();return}
  const w=document.createElement('div');w.id='dgcom';
  w.style.cssText='position:fixed;right:12px;top:52px;z-index:310;width:min(380px,calc(100vw - 24px));background:#1b1d23;color:#e6e7ea;border:2px solid #ffb020;border-radius:12px;box-shadow:0 14px 40px #000c;font:14px system-ui;padding:12px;display:grid;gap:8px';
  w.innerHTML='<b style="font-size:15px">💬 Qu\'est-ce qui ne marche pas ?</b><span style="color:#9aa0ab;font-size:12.5px">Écrivez-le comme vous le diriez : ce que vous vouliez faire et ce qui s\'est passé. On va le réparer.</span><textarea rows="5" style="background:#0f1115;color:#e6e7ea;border:1px solid #363a44;border-radius:8px;padding:8px;font:inherit;resize:vertical" placeholder="Ex. : je n\'arrive pas à coller deux planches ensemble en 3D"></textarea><div style="display:flex;gap:8px"><button data-a="ok" style="flex:1;background:#ffb020;color:#1b1d23;border:0;border-radius:8px;padding:9px;font:600 14px system-ui;cursor:pointer">Envoyer</button><button data-a="x" style="background:#2f333c;color:#e6e7ea;border:1px solid #363a44;border-radius:8px;padding:9px 14px;cursor:pointer">Fermer</button></div><span class="mm" style="font-size:12.5px"></span>';
  const ta=w.querySelector('textarea'),mm=w.querySelector('.mm');ta.addEventListener('keydown',e=>e.stopPropagation());
  w.onclick=async e=>{const a=e.target.dataset&&e.target.dataset.a;if(a=='x')w.remove();if(a!='ok')return;const t=ta.value.trim();if(!t){ta.focus();return}
    const c={texte:t,page:location.pathname.split('/').pop()||'index.html',version:((document.querySelector('#top b small')||{}).textContent||''),journal:DGLog.text().split('\n').slice(-150).join('\n'),quand:new Date().toISOString()};
    DGLog.log('message','commentaire : '+t);e.target.disabled=true;mm.textContent='Envoi…';
    try{await envoyer(c);mm.style.color='#3dff8b';mm.textContent='✔ Merci ! C\'est envoyé, on s\'en occupe.';ta.value='';setTimeout(()=>w.remove(),2500)}
    catch(err){setFile([...file(),c]);majBadge();mm.style.color='#ffb020';mm.textContent='✔ Noté sur cet ordinateur. Il partira tout seul dès que la connexion sera prête.';ta.value='';setTimeout(()=>w.remove(),3500)}
    e.target.disabled=false};
  document.body.append(w);ta.focus()}
addEventListener('load',()=>{btn=document.createElement('button');btn.id='dgcomB';
  btn.style.cssText='position:fixed;left:12px;bottom:12px;z-index:305;background:#ffb020;color:#1b1d23;border:0;border-radius:20px;padding:7px 14px;font:600 13px system-ui;cursor:pointer;box-shadow:0 4px 14px #0008';
  btn.onclick=ouvrir;const top=document.getElementById('top');if(top){btn.style.cssText='margin-left:auto;background:#ffb020;color:#1b1d23;border:0;border-radius:16px;padding:5px 12px;font:600 13px system-ui;cursor:pointer;white-space:nowrap';top.append(btn)}else document.body.append(btn);majBadge();vider();setInterval(vider,5*60*1000);addEventListener('online',vider)});
window.DGCom={ouvrir,vider,file};
})();
