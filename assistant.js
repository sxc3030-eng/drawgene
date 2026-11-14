// drawGene — Claude, l'assistant IA intégré (API Anthropic, clé gardée sur cet ordinateur).
// Moteur 3 : Claude (Anthropic) avec une clé API gardée SEULEMENT sur cet ordinateur — lit aussi les PDF / images de plans (Inventor, AutoCAD).
(function(){
const css=`.dgp.float:has(.dga){min-width:340px;min-height:420px}.dgdock .dgp:has(.dga){min-height:300px}
.dga [hidden]{display:none!important}
.dga{display:flex;flex-direction:column;height:100%;min-height:0;font:13px system-ui;color:#e6e7ea}
.dga .st{display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid #363a44;font-size:11px;color:#9aa0ab}
.dga .av{width:30px;height:30px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:17px;background:radial-gradient(circle at 30% 30%,#ff9ad5,#7b4dff);box-shadow:0 0 0 2px #22252c,0 0 0 3px #b07bff}
.dga .av.talk{animation:dgapulse .8s ease-in-out infinite alternate}@keyframes dgapulse{to{box-shadow:0 0 0 2px #22252c,0 0 0 7px #b07bff66}}
.dga .who{display:flex;flex-direction:column;min-width:0;flex:1}.dga .who b{color:#fff;font-size:13px}.dga .stt{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dga .dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#888;margin-right:4px}.dga .dot.ok{background:#3dff8b}.dga .dot.ko{background:#ff5050}.dga .dot.wait{background:#ffb020}
.dga .st button,.dga .ft button{background:#2f333c;border:1px solid #363a44;color:#e6e7ea;border-radius:6px;padding:3px 7px;cursor:pointer;font:inherit}.dga button.on{background:#7b4dff;border-color:#7b4dff}
.dga .log{flex:1;min-height:0;overflow-y:auto;padding:8px;display:flex;flex-direction:column;gap:8px}
.dga .m{padding:7px 10px;border-radius:10px;max-width:92%;white-space:pre-wrap;line-height:1.45;word-wrap:break-word}
.dga .u{align-self:flex-end;background:#3d8bff;color:#fff;border-bottom-right-radius:3px}
.dga .a{align-self:flex-start;background:#2d2540;border:1px solid #5b3fa0;border-bottom-left-radius:3px}.dga .a::before{content:'Lia';display:block;font-size:10px;font-weight:700;color:#c9a8ff;margin-bottom:2px;letter-spacing:.05em}
.dga .t{align-self:flex-start;font-size:11px;color:#9ec5ff;background:#3d8bff1a;border:1px dashed #3d8bff66;padding:3px 8px;border-radius:6px}
.dga .err{align-self:stretch;background:#5a202033;border:1px solid #ff505066;color:#ffb0b0}
.dga .ft{display:flex;gap:6px;padding:8px;border-top:1px solid #363a44}.dga textarea{flex:1;resize:none;height:54px;background:#1b1d23;border:1px solid #363a44;border-radius:8px;color:#e6e7ea;padding:6px;font:inherit}
.dga .send{background:#7b4dff!important;border-color:#7b4dff!important;color:#fff!important;font-weight:600}
.dga .cfg{padding:8px;border-bottom:1px solid #363a44;display:grid;gap:6px;font-size:12px}.dga .cfg input,.dga .cfg select{width:100%;background:#1b1d23;border:1px solid #363a44;border-radius:6px;color:#e6e7ea;padding:4px 6px;font:inherit}
.dga .help{font-size:11.5px;line-height:1.5;color:#cfd3da;background:#1b1d23;border:1px solid #363a44;border-radius:8px;padding:8px}.dga .help a{color:#c9a8ff}
.dga .big{display:block;width:100%;margin-top:8px;background:#7b4dff;border:0;color:#fff;border-radius:8px;padding:9px;font:600 13px system-ui;cursor:pointer}
.dga .bar{height:8px;background:#1b1d23;border-radius:4px;overflow:hidden;margin-top:6px}.dga .bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#7b4dff,#ff9ad5);transition:width .3s}
.dga .att{display:flex;flex-wrap:wrap;gap:4px;padding:0 8px}.dga .att span{background:#3d8bff22;border:1px solid #3d8bff66;border-radius:10px;padding:2px 8px;font-size:11px;cursor:pointer}
.dga .sugg{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}.dga .sugg button{max-width:100%;white-space:normal;text-align:left;background:#1b1d23;border:1px solid #7b4dff88;color:#c9a8ff;border-radius:12px;padding:3px 9px;cursor:pointer;font:11.5px system-ui}`;
const KEY='drawgene-ai';
function cfg(){let c={};try{c=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}return{souvUrl:c.souvUrl||'https://souveraincode.ca',souvJeton:c.souvJeton||'',souvIA:c.souvIA||'routeur',claudeKey:c.claudeKey||'',claudeModel:c.claudeModel||'claude-opus-5-5',voice:c.voice!==false}}
function saveCfg(p){try{localStorage.setItem(KEY,JSON.stringify({...cfg(),...p}))}catch(e){}}
// lien de branchement : …/plan.html#cle=sk-ant-… → la clé est enregistrée sur cet ordinateur puis effacée de l'adresse (le # n'est jamais envoyé au serveur)
try{const m=location.hash.match(/(?:^#|&)cle=(sk-ant-[A-Za-z0-9_\-]+)/),j=location.hash.match(/(?:^#|&)souv=([A-Za-z0-9_\-]{24,})/),u=location.hash.match(/(?:^#|&)srv=(https:\/\/[A-Za-z0-9.\-]+)/);if(j)saveCfg({souvJeton:j[1],...(u?{souvUrl:u[1]}:{})});if(m||j){if(m)saveCfg({claudeKey:m[1]});history.replaceState(null,'',location.pathname+location.search);addEventListener('load',()=>setTimeout(()=>alert('✔ Lia est branchée sur cet ordinateur.'),300))}}catch(e){}
const PERSONA=`Tu t'appelles Lia. Tu es l'assistante intégrée de drawGene, un logiciel de dessin technique (plans de maison et pièces mécaniques, 2D et 3D) pensé par Eugene, un technicien québécois. Tu parles à la première personne, au féminin (« je suis prête », « je l'ai ajouté »), avec chaleur et simplicité.
Réponds TOUJOURS en français, en 1 à 3 phrases courtes (tes réponses sont lues à voix haute). Unités internes : millimètres (1 po = 25,4 mm, 1 pi = 304,8 mm, 16 po c/c = 406 mm).
Quand on te demande de créer, modifier, supprimer ou calculer quelque chose dans le dessin, fais-le avec une action. Si la personne veut apprendre (« comment », « montre-moi », « où est »), utilise l'action montrer pour faire clignoter le bon bouton, puis explique en une phrase. S'il manque une dimension, choisis une valeur raisonnable et dis-le.
Aide sur drawGene : clic droit = menu (supprimer, copier, annuler) ; Suppr efface ; Ctrl+Z annule ; Ctrl+C/Ctrl+V copier-coller. 2D : outils à gauche, taper une longueur puis Entrée pendant un tracé, glisser dans le vide = sélection par rectangle, cliquer une cote bleue = la modifier et le dessin s'ajuste, calques en onglets, onglet Matériaux = coûts. 3D : Extrusion, Révolution, Trou ; 🪵 Bois ajoute 2x4/2x6/contreplaqué ; flèches colorées pour déplacer ; poignées pour étirer ; étiquettes bleues = cotes ; 🔗 Contrainte ; 📋 Liste de coupe ; ⬚ Zone ; 🔒 verrouiller. COUPES D'ANGLE : panneau de la planche, champs ✂ Coupe début/fin (°, ou pente 6/12) ; deux pièces sélectionnées (Ctrl+clic) + clic droit = Couper en onglet ou Couper contre ; les angles apparaissent dans la liste de coupe. Rotation à n'importe quel angle (champ Rotation, accepte 6/12). SUGGESTIONS : quand une série se répète (montants, chevrons, copies), la pièce suivante apparaît en rose ; Tab l'ajoute, Échap l'ignore ; en 2D, après 2 murs, Tab ferme le rectangle. SI ÇA ACCROCHE : ⋯ Plus → 🩺 Rapport de problème → Télécharger le rapport, puis l'envoyer à la personne qui s'occupe de drawGene. Pour ASSEMBLER : on attrape une pièce avec la souris et on l'approche d'une autre, elle s'aligne et se colle toute seule (aimant 🧲, touche Alt = sans aimant) ; clic droit « Sélectionner les pièces collées » pour déplacer un ensemble. Bouton 🎓 Simple / 🛠 Expert pour afficher plus ou moins d'outils. Enregistrer met la pièce dans la 📚 Bibliothèque, on la glisse dans un dessin pour assembler.`;
function speakable(t){return t.replace(/```[\s\S]*?```/g,'').replace(/[*_#`>|]/g,'').replace(/×/g,' par ').replace(/Ø/g,'diamètre ').replace(/\bmm\b/g,'millimètres').replace(/m²/g,'mètres carrés').replace(/\bpo\b/g,'pouces').replace(/\bpi\b/g,'pieds').trim()}
function pickVoice(){const V=speechSynthesis.getVoices().filter(v=>/^fr/i.test(v.lang));const fem=/sylvie|caroline|denise|hortense|julie|am[ée]lie|chantal|marie|audrey|female|femme|elsa|brigitte|vivienne|eloise|celine|l[ée]a|ariane|sylvie/i;
  return V.find(v=>/fr-CA/i.test(v.lang)&&fem.test(v.name))||V.find(v=>fem.test(v.name))||V.find(v=>/fr-CA/i.test(v.lang))||V[0]||null}
window.DGAssist={
  mount(app,tools,context,guide){guide=guide||{};
    if(Object.keys(guide).length)tools=[...tools,{name:'montrer',label:'Montrer',description:'Montre à l\'utilisateur où se trouve un bouton ou un outil en le faisant clignoter (à utiliser quand il veut apprendre ou dit « montre-moi »).',parameters:{type:'object',properties:{element:{type:'string',enum:Object.keys(guide)}},required:['element']},
      run:x=>{const g=guide[x.element];if(!g)return'élément inconnu';const el=typeof g=='function'?g():document.querySelector(g);return DGMenu.flash(el)?'le bouton « '+x.element+' » clignote à l\'écran':'élément introuvable'}}];if(!document.getElementById('dgacss')){const s=document.createElement('style');s.id='dgacss';s.textContent=css;document.head.append(s)}
    const box=document.createElement('div');box.className='dga';
    box.innerHTML=`<div class="st"><span class="av">👩</span><span class="who"><b>Lia</b><span class="stt"><span class="dot"></span>…</span></span><button class="vo" title="Voix de Lia (lecture à voix haute)">🔊</button><button class="cf" title="Réglages de Lia">⚙</button><button class="cl" title="Nouvelle conversation">🧹</button></div>
<div class="iasel" hidden style="padding:4px 8px;border-bottom:1px solid #363a44;font-size:11.5px;color:#9aa0ab;display:flex;gap:6px;align-items:center">Parler à <select style="flex:1;background:#1b1d23;border:1px solid #363a44;border-radius:6px;color:#e6e7ea;padding:2px 4px;font:inherit"></select></div><div class="cfg" hidden></div><div class="log"></div>
<div class="att"></div><div class="ft"><input type="file" class="fi" hidden multiple accept=".pdf,image/*,.csv,.txt,.xls,.xlsx"><button class="clip" title="Joindre un plan (PDF Inventor, photo, capture, liste de cotes)">📎</button><button class="mic" title="Parler à Lia (micro)">🎤</button><textarea placeholder="Écrivez à Lia… (Entrée pour envoyer)"></textarea><button class="send">➤</button></div>`;
    const $q=s=>box.querySelector(s),log=$q('.log'),ta=$q('textarea'),stt=$q('.stt'),cfgBox=$q('.cfg'),av=$q('.av');
    let hist=[],chist=[],pend=[],busy=false,engine=null;
    const setSt=(cls,txt)=>{stt.innerHTML='<span class="dot '+cls+'"></span>';stt.append(txt)};
    const add=(cls,txt)=>{const d=document.createElement('div');d.className='m '+cls;d.textContent=txt;log.append(d);log.scrollTop=log.scrollHeight;return d};
    // ---- voix ----
    const vb=$q('.vo');const upV=()=>{vb.classList.toggle('on',cfg().voice);vb.textContent=cfg().voice?'🔊':'🔇'};upV();
    vb.onclick=()=>{saveCfg({voice:!cfg().voice});if(!cfg().voice&&'speechSynthesis' in window)speechSynthesis.cancel();upV()};
    function say(t){if(!cfg().voice||!('speechSynthesis' in window))return;const txt=speakable(t);if(!txt)return;const S=speechSynthesis;S.cancel();
      const parts=txt.match(/[^.!?\n]+[.!?]*/g)||[txt];let k=0;
      const next=()=>{if(k>=parts.length){av.classList.remove('talk');return}const p=parts[k++].trim();if(!p){next();return}
        const u=new SpeechSynthesisUtterance(p);u.lang='fr-CA';const v=pickVoice();if(v){u.voice=v;u.lang=v.lang}u.rate=1.02;
        u.onstart=()=>av.classList.add('talk');u.onend=next;u.onerror=e=>{av.classList.remove('talk');if(e.error!='interrupted'&&e.error!='canceled')DGLog&&DGLog.log('message','voix : '+e.error)};S.speak(u)};
      setTimeout(()=>{if(S.paused)S.resume();next()},60)}
    if('speechSynthesis' in window){speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=()=>speechSynthesis.getVoices()}
    // ---- micro ----
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition,mb=$q('.mic');
    if(!SR)mb.remove();else mb.onclick=()=>{const r=new SR();r.lang='fr-CA';r.interimResults=true;mb.classList.add('on');if('speechSynthesis' in window)speechSynthesis.cancel();
      r.onresult=e=>{ta.value=[...e.results].map(x=>x[0].transcript).join('');if(e.results[e.results.length-1].isFinal){mb.classList.remove('on');send()}};
      r.onerror=e=>{mb.classList.remove('on');add('err',e.error=='not-allowed'?'Le micro est bloqué : autorisez-le dans la barre d\'adresse.':'Micro indisponible ('+e.error+'). La reconnaissance vocale demande internet.')};r.onend=()=>mb.classList.remove('on');r.start()};
    // ---- choix du moteur ----
    const nomEng=()=>engine=='souverain'?'SouverainCode':'Claude';
    let iaListe=[];const iaBox=box.querySelector('.iasel'),iaSel=iaBox.querySelector('select');
    const iaNom=()=>{const x=iaListe.find(i=>i.id==cfg().souvIA);return x?x.label.split(' — ')[0].replace(/^IA principale.*/,'IA principale'):'SouverainCode'};
    iaSel.onchange=()=>{saveCfg({souvIA:iaSel.value});setSt('ok','Prête · '+iaNom());const x=iaListe.find(i=>i.id==iaSel.value);if(x)add('t','🔀 Vous parlez maintenant à '+x.label+(x.description?' — '+x.description:''))};
    async function chargerIA(){const c=cfg();try{const r=await fetch(c.souvUrl+'/api/drawgene/etat',{headers:{authorization:'Bearer '+c.souvJeton}});if(!r.ok)return;const j=await r.json();iaListe=j.ia||[];
      iaSel.innerHTML='';iaListe.forEach(i=>{const o=document.createElement('option');o.value=i.id;o.textContent=i.label;o.title=i.description||'';iaSel.append(o)});if(!iaListe.some(i=>i.id==c.souvIA))saveCfg({souvIA:'routeur'});iaSel.value=cfg().souvIA;iaBox.hidden=iaListe.length<2;setSt('ok','Prête · '+iaNom())}catch(e){}}
    async function detect(){const c=cfg();iaBox.hidden=true;if(c.souvJeton){engine='souverain';setSt('ok','Prête · SouverainCode');chargerIA();}else if(c.claudeKey){engine='claude';setSt('ok','Prête · Claude');}else{engine=null;setSt('wait','À brancher (⚙)')}}
    // ---- écran d'accueil ----
    const SUG=app=='3d'?['Ajoute 8 montants 2x4 aux 16 po','Fais une plaque d\'acier 200 par 100 par 6 avec 4 trous de 10','Combien de planches dois-je acheter ?','Comment je verrouille une pièce ?']
      :['Dessine une pièce de 4 m par 3,5 m','Ajoute une chambre de 12 pi par 10 pi','Combien ça va coûter en matériaux ?','Comment je change une cote ?'];
    let saluee=false;box.addEventListener('pointerdown',()=>{if(!saluee&&engine){saluee=true;say('Bonjour, je suis Lia ! Que voulez-vous faire ?')}},{once:false});
    function welcome(){log.innerHTML='';const c=cfg(),d=document.createElement('div');d.className='m a';
      d.textContent='Bonjour, je suis Lia ! Que voulez-vous faire ? Je peux le faire pour vous, ou vous montrer comment. Donnez-moi aussi un plan Inventor en PDF ou une photo avec 📎 : je lis les cotes et je le redessine.';
      const s=document.createElement('div');s.className='sugg';SUG.forEach(x=>{const b=document.createElement('button');b.textContent=x;b.onclick=()=>{ta.value=x;send()};s.append(b)});
      if(!engine){const h=document.createElement('div');h.className='help';
        h.innerHTML='<b>🔌 Brancher Lia (une seule fois)</b><br>Tapez le <b>code à 6 chiffres</b> qu\'on vous a donné :<input class="k" inputmode="numeric" autocomplete="off" placeholder="ex. 482913" style="width:100%;margin-top:6px;background:#0f1115;border:1px solid #363a44;border-radius:6px;color:#e6e7ea;padding:8px;font:600 18px ui-monospace,monospace;letter-spacing:.2em;text-align:center"><button class="big">🔌 Brancher</button><div class="rm" style="margin-top:6px"></div>';
        const kk=h.querySelector('.k'),rm=h.querySelector('.rm');kk.onkeydown=e=>{e.stopPropagation();if(e.key=='Enter')h.querySelector('.big').click()};
        h.querySelector('.big').onclick=async()=>{const k=kk.value.trim();if(k.length>=24){saveCfg({souvJeton:k});detect().then(welcome);return}
          const code=k.replace(/\D/g,'');if(code.length<6){rm.textContent='Le code a 6 chiffres.';return}rm.textContent='Je me branche…';
          try{const r=await fetch(cfg().souvUrl+'/api/drawgene/jumeler',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({code})});const j=await r.json().catch(()=>({}));
            if(!r.ok){rm.textContent='⚠ '+(j.message||'Erreur '+r.status);return}saveCfg({souvJeton:j.jeton});await detect();welcome();const m='Voilà, je suis branchée ! Que puis-je faire pour vous ?';add('a',m);say(m)}
          catch(e){rm.textContent='⚠ Pas de connexion internet ?'}};log.append(h)}
      log.append(d,s)}
    function showCfg(){const c=cfg();cfgBox.hidden=!cfgBox.hidden;if(cfgBox.hidden)return;
      cfgBox.innerHTML=`<b>SouverainCode (ton serveur)</b><label>Adresse<input class="su"></label><label>Jeton drawGene (reste sur cet ordinateur)<input class="sj" type="password"></label><button class="ts">🔎 Vérifier la connexion</button>
<details><summary>Claude (optionnel, clé API Anthropic)</summary><label>Clé API Claude<input class="ck" type="password" placeholder="sk-ant-…"></label><label>Modèle Claude<select class="cm"><option value="claude-opus-5-5">Claude Opus 5.5</option><option value="claude-sonnet-5-5">Claude Sonnet 5.5</option><option value="claude-haiku-5-5">Claude Haiku 5.5</option></select></label></details>
<button class="tv">🔊 Tester la voix de Lia</button><button class="sv">Enregistrer</button>
<div class="help"><b>📧 Brancher un autre ordinateur</b><br>Envoie un lien : la personne clique dessus et Lia est branchée chez elle.<label style="display:block;margin-top:6px">Courriel<input class="em" type="email" placeholder="papa@exemple.com"></label><button class="big ml">📧 Envoyer le lien par courriel</button><button class="big cp" style="background:#2f333c">📋 Copier le lien</button></div><button class="lc">📋 Voir les problèmes signalés</button>`;
      const v=x=>cfgBox.querySelector(x);v('.tv').onclick=()=>{if(!('speechSynthesis' in window)){alert('Ce navigateur ne sait pas parler. Utilisez Chrome ou Edge.');return}if(!cfg().voice)saveCfg({voice:true}),upV();const vv=pickVoice();say('Bonjour, je suis Lia. Vous m\'entendez bien ?');if(!vv)setTimeout(()=>add('err','Aucune voix française installée. Windows : Paramètres → Heure et langue → Voix → ajouter Français (Canada).'),400)};v('.su').value=c.souvUrl;v('.sj').value=c.souvJeton;v('.ck').value=c.claudeKey;v('.cm').value=c.claudeModel;
      v('.lc').onclick=async()=>{try{const r=await fetch(v('.su').value.trim().replace(/\/$/,'')+'/api/drawgene/commentaires',{headers:{authorization:'Bearer '+v('.sj').value.trim()}});if(!r.ok)throw new Error('erreur '+r.status);const j=await r.json();
        const w=document.createElement('div');w.style.cssText='position:fixed;inset:6% 8%;z-index:320;background:#1b1d23;color:#e6e7ea;border:2px solid #ffb020;border-radius:12px;overflow:auto;padding:14px;font:13px system-ui';
        w.innerHTML='<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px"><b style="flex:1">📋 Problèmes signalés ('+j.commentaires.length+')</b><button>✕</button></div>';w.querySelector('button').onclick=()=>w.remove();
        j.commentaires.forEach(c=>{const d=document.createElement('details');d.style.cssText='border-top:1px solid #363a44;padding:8px 0';const sm=document.createElement('summary');sm.textContent=new Date(c.recu).toLocaleString('fr-CA')+' · '+c.page+' · '+c.texte;const pre=document.createElement('pre');pre.style.cssText='white-space:pre-wrap;font:11px ui-monospace,monospace;color:#9aa0ab';pre.textContent=c.journal;d.append(sm,pre);w.append(d)});
        if(!j.commentaires.length)w.append('Aucun problème signalé pour l\'instant.');document.body.append(w)}catch(e){alert('Impossible de lire les problèmes : '+e.message)}};
      v('.ts').onclick=async()=>{const b=v('.ts');b.textContent='…';try{const r=await fetch(v('.su').value.trim().replace(/\/$/,'')+'/api/drawgene/etat',{headers:{authorization:'Bearer '+v('.sj').value.trim()}});b.textContent=r.ok?'✔ Connecté':r.status==401?'✖ Jeton refusé':r.status==503?'✖ Pas encore activé sur le serveur':'✖ Erreur '+r.status}catch(e){b.textContent='✖ Serveur injoignable'}};
      const lien=()=>{const j=v('.sj').value.trim(),k=v('.ck').value.trim(),u=v('.su').value.trim().replace(/\/$/,'');if(j.length<24&&!/^sk-ant-/.test(k)){alert('Entrez d\'abord le jeton SouverainCode.');return null}
        return location.origin+location.pathname.replace(/[^/]*$/,'')+'plan.html#'+(j.length>=24?'souv='+j+(u!='https://souveraincode.ca'?'&srv='+u:''):'cle='+k)};
      v('.ml').onclick=()=>{const l=lien();if(!l)return;const to=v('.em').value.trim();
        location.href='mailto:'+encodeURIComponent(to)+'?subject='+encodeURIComponent('drawGene : brancher Lia sur ton ordinateur')+'&body='+encodeURIComponent('Bonjour,\n\nSur ton ordinateur, ouvre ce lien une seule fois (avec Chrome ou Edge) :\n\n'+l+'\n\nTu verras « Lia est branchée sur cet ordinateur ». C\'est tout ! Ensuite clique sur 👩 Lia dans drawGene.\n\nAprès, tu peux effacer ce courriel.')};
      v('.cp').onclick=()=>{const l=lien();if(!l)return;(navigator.clipboard?navigator.clipboard.writeText(l):Promise.reject()).then(()=>alert('Lien copié. Collez-le dans un courriel ou un texto.'),()=>prompt('Copiez ce lien :',l))};
      v('.sv').onclick=()=>{saveCfg({souvUrl:v('.su').value.trim().replace(/\/$/,'')||'https://souveraincode.ca',souvJeton:v('.sj').value.trim(),claudeKey:v('.ck').value.trim(),claudeModel:v('.cm').value});cfgBox.hidden=true;detect().then(()=>{if(!hist.length)welcome()})}}
    $q('.cf').onclick=showCfg;$q('.cl').onclick=()=>{hist=[];chist=[];shist=[];pend=[];showAtt();if('speechSynthesis' in window)speechSynthesis.cancel();welcome()};
    // ---- conversation ----
    async function runTool(name,args){const t=tools.find(x=>x.name==name);let res;try{res=t?await t.run(args||{}):'Outil inconnu : '+name}catch(e){res='Erreur : '+e.message}
      add('t','⚙ '+(t?t.label||t.name:name)+(typeof res=='string'&&res.length<140?' → '+res:''));return typeof res=='string'?res:JSON.stringify(res)}
    // ---- Claude (API Anthropic) ----
    const ctools=tools.map(t=>({name:t.name,description:t.description,input_schema:t.parameters}));
    const CLAUDE_RULE=`\n\nTu peux enchaîner plusieurs actions de suite (une pièce à la fois) sans demander la permission. Quand on te donne un plan (PDF Inventor/AutoCAD, photo, capture, tableau de cotes) : 1) relève TOUTES les cotes utiles et dis en une phrase ce que tu as compris ; 2) redessine-le avec les actions, cotes en millimètres ; 3) dis ce qui manquait ou ce que tu as supposé. Ici tu peux répondre en plusieurs phrases si c'est un plan.`;
    function claudeErr(st,j){const m=(j&&j.error&&j.error.message)||'';if(st==401)return'Clé Claude refusée : vérifiez-la dans ⚙.';if(st==429)return'Trop de demandes à Claude : attendez une minute.';if(st==529||st>=500)return'Claude est surchargé : réessayez dans un instant.';if(/credit|balance|billing/i.test(m))return'Plus de crédit sur le compte Claude (console.anthropic.com → Billing).';return'Claude : '+(m||'erreur '+st)}
    async function turnClaude(){const c=cfg();
      for(let round=0;round<15;round++){const bub=add('a','…');
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':c.claudeKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true','anthropic-beta':'server-side-fallback-2026-07-01'},
          body:JSON.stringify({model:c.claudeModel,max_tokens:16000,fallbacks:'default',output_config:{effort:'medium'},system:PERSONA+CLAUDE_RULE+'\n\nÉtat actuel du dessin :\n'+context(),tools:ctools,messages:chist})});
        const j=await r.json().catch(()=>({}));if(!r.ok){bub.remove();chist=[];throw new Error(claudeErr(r.status,j))}
        if(j.stop_reason=='refusal'){bub.remove();chist=[];throw new Error('Claude a refusé cette demande. Reformulez-la.')}
        chist.push({role:'assistant',content:j.content});
        const txt=(j.content||[]).filter(b=>b.type=='text').map(b=>b.text).join('\n').trim();if(txt)bub.textContent=txt;else bub.remove();
        const uses=(j.content||[]).filter(b=>b.type=='tool_use');
        if(j.stop_reason!='tool_use'||!uses.length){say(txt);return}
        const res=[];for(const u of uses)res.push({type:'tool_result',tool_use_id:u.id,content:await runTool(u.name,u.input)});chist.push({role:'user',content:res})}}
    const attBox=$q('.att'),fi=$q('.fi');
    function showAtt(){attBox.innerHTML='';pend.forEach((a,i)=>{const s=document.createElement('span');s.textContent='📎 '+a.name+' ✕';s.title='Retirer';s.onclick=()=>{pend.splice(i,1);showAtt()};attBox.append(s)})}
    const b64=f=>new Promise((ok,ko)=>{const r=new FileReader();r.onload=()=>ok(String(r.result).split(',')[1]);r.onerror=ko;r.readAsDataURL(f)});
    // pièces jointes gardées en format neutre, converties selon le moteur au moment de l'envoi
    async function addFile(f){if(f.size>30e6){add('err',f.name+' : trop gros (max 30 Mo).');return}
      if(f.type=='application/pdf'||/\.pdf$/i.test(f.name))pend.push({name:f.name,kind:'pdf',f,data:await b64(f)});
      else if(/^image\/(png|jpeg|gif|webp)$/.test(f.type))pend.push({name:f.name,kind:'img',mime:f.type,data:await b64(f)});
      else if(/\.(csv|txt)$/i.test(f.name))pend.push({name:f.name,kind:'txt',text:(await f.text()).slice(0,200000)});
      else{add('err',f.name+' : format non lu. Dans Inventor : Fichier → Exporter → PDF (ou faites une capture d\'écran). Pour Excel : enregistrer en CSV.');return}showAtt()}
    const blocClaude=a=>a.kind=='pdf'?{type:'document',source:{type:'base64',media_type:'application/pdf',data:a.data}}:a.kind=='img'?{type:'image',source:{type:'base64',media_type:a.mime,data:a.data}}:{type:'text',text:'Fichier « '+a.name+' » :\n'+a.text};
    // PDF -> images (pdf.js), pour les modèles qui ne lisent que des images
    let pdfjs=null;async function pdfImages(a,max=4){if(!pdfjs){await new Promise((ok,ko)=>{const sc=document.createElement('script');sc.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';sc.onload=ok;sc.onerror=()=>ko(new Error('lecteur PDF introuvable (internet ?)'));document.head.append(sc)});
        pdfjs=window.pdfjsLib;pdfjs.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'}
      const doc=await pdfjs.getDocument({data:Uint8Array.from(atob(a.data),c=>c.charCodeAt(0))}).promise,out=[];
      for(let n=1;n<=Math.min(doc.numPages,max);n++){const pg=await doc.getPage(n),v0=pg.getViewport({scale:1}),sc=Math.min(3,1800/Math.max(v0.width,v0.height)),vp=pg.getViewport({scale:sc});
        const cv=document.createElement('canvas');cv.width=vp.width;cv.height=vp.height;const cx=cv.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,cv.width,cv.height);await pg.render({canvasContext:cx,viewport:vp}).promise;out.push(cv.toDataURL('image/jpeg',.85))}
      if(doc.numPages>max)add('t','📄 '+a.name+' : '+max+' premières pages envoyées sur '+doc.numPages);return out}
    async function blocsOpenAI(list){const o=[];for(const a of list){if(a.kind=='txt')o.push({type:'text',text:'Fichier « '+a.name+' » :\n'+a.text});else if(a.kind=='img')o.push({type:'image_url',image_url:{url:'data:'+a.mime+';base64,'+a.data}});else(await pdfImages(a)).forEach(u=>o.push({type:'image_url',image_url:{url:u}}))}return o}
    // ---- SouverainCode (routeur LLM, format OpenAI) ----
    let shist=[];const otools=tools.map(t=>({type:'function',function:{name:t.name,description:t.description,parameters:t.parameters}}));
    function souvErr(st,j){if(st==401)return'Jeton refusé par SouverainCode : vérifiez-le dans ⚙.';if(st==503)return'L\'accès drawGene n\'est pas encore activé sur le serveur SouverainCode.';if(st==429)return'Trop de demandes : attendez une minute.';if(st==504||st==502)return'Le serveur IA de SouverainCode ne répond pas. Réessayez dans un instant.';return'SouverainCode : '+((j&&j.message)||'erreur '+st)}
    async function turnSouv(){const c=cfg();
      for(let round=0;round<12;round++){const bub=add('a','…');
        const r=await fetch(c.souvUrl+'/api/drawgene/chat',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+c.souvJeton},body:JSON.stringify({ia:c.souvIA,messages:[{role:'system',content:PERSONA+CLAUDE_RULE+'\n\nÉtat actuel du dessin :\n'+context()},...shist],tools:otools})});
        const j=await r.json().catch(()=>({}));if(!r.ok){bub.remove();throw new Error(souvErr(r.status,j))}
        const m=(j.choices&&j.choices[0]&&j.choices[0].message)||{role:'assistant',content:''};const msg={role:'assistant',content:m.content||''};if(m.tool_calls&&m.tool_calls.length)msg.tool_calls=m.tool_calls;shist.push(msg);
        const txt=String(m.content||'').trim();if(txt)bub.textContent=txt;else bub.remove();
        if(!msg.tool_calls){say(txt);return}
        for(const tc of msg.tool_calls){const f=tc.function||{};let a=f.arguments||{};if(typeof a=='string'){try{a=JSON.parse(a)}catch(e){a={}}}shist.push({role:'tool',tool_call_id:tc.id,content:await runTool(f.name,a)})}}}
    $q('.clip').onclick=()=>{if(!engine){add('err','Branchez d\'abord Lia (⚙).');return}fi.click()};
    fi.onchange=async()=>{for(const f of fi.files)await addFile(f);fi.value='';ta.focus()};
    box.addEventListener('dragover',e=>e.preventDefault());box.addEventListener('drop',async e=>{if(!e.dataTransfer.files.length||!engine)return;e.preventDefault();e.stopPropagation();for(const f of e.dataTransfer.files)await addFile(f)});
    async function send(){let q=ta.value.trim();if(pend.length&&!q)q='Redessine ce plan dans drawGene avec toutes ses cotes.';if(!q||busy)return;if('speechSynthesis' in window)speechSynthesis.cancel();
      if(!engine){await detect();if(!engine){add('err','Branchez d\'abord Lia (encadré ci-dessus ou ⚙).');return}}
      ta.value='';busy=true;add('u',q+(pend.length?'\n📎 '+pend.map(a=>a.name).join(', '):''));hist.push({role:'user',content:q});
      const pj=pend;pend=[];showAtt();
      try{if(engine=='souverain'){shist.push({role:'user',content:pj.length?[...await blocsOpenAI(pj),{type:'text',text:q}]:q});await turnSouv()}
        else{chist.push({role:'user',content:[...pj.map(blocClaude),{type:'text',text:q}]});await turnClaude()}}
      catch(e){add('err','⚠ '+(e.name=='TypeError'?'Impossible de joindre '+nomEng()+' (internet ?).':e.message))}
      busy=false;if(hist.length>30)hist=hist.slice(-30);
      if(shist.length>40){let i=shist.length-30;while(i<shist.length&&shist[i].role!='user')i++;shist=shist.slice(i)}
      if(chist.length>40){let i=chist.length-30;while(i<chist.length&&!(chist[i].role=='user'&&chist[i].content.some(b=>b.type=='text')))i++;chist=chist.slice(i)}}
    ta.onkeydown=e=>{e.stopPropagation();if(e.key=='Enter'&&!e.shiftKey){e.preventDefault();send()}};$q('.send').onclick=send;
    this.focus=()=>setTimeout(()=>ta.focus(),50);this._test={chist:()=>chist,shist:()=>shist,addFile,send:t=>{ta.value=t;return send()}};
    detect().then(welcome);return box}};
})();
