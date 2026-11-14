// drawGene — Claude, l'assistant IA intégré (API Anthropic, clé gardée sur cet ordinateur).
// Moteur 3 : Claude (Anthropic) avec une clé API gardée SEULEMENT sur cet ordinateur — lit aussi les PDF / images de plans (Inventor, AutoCAD).
(function(){
const css=`.dgp.float:has(.dga){min-width:340px;min-height:420px}.dgdock .dgp:has(.dga){min-height:300px}
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
.dga .a{align-self:flex-start;background:#2d2540;border:1px solid #5b3fa0;border-bottom-left-radius:3px}.dga .a::before{content:'Claude';display:block;font-size:10px;font-weight:700;color:#c9a8ff;margin-bottom:2px;letter-spacing:.05em}
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
function cfg(){let c={};try{c=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}return{claudeKey:c.claudeKey||'',claudeModel:c.claudeModel||'claude-opus-5-5',voice:c.voice!==false}}
function saveCfg(p){try{localStorage.setItem(KEY,JSON.stringify({...cfg(),...p}))}catch(e){}}
const PERSONA=`Tu es Claude, l'assistant intégré de drawGene, un logiciel de dessin technique (plans de maison et pièces mécaniques, 2D et 3D) pensé par Eugene, un technicien québécois. Tu parles à la première personne, avec chaleur et simplicité.
Réponds TOUJOURS en français, en 1 à 3 phrases courtes (tes réponses sont lues à voix haute). Unités internes : millimètres (1 po = 25,4 mm, 1 pi = 304,8 mm, 16 po c/c = 406 mm).
Quand on te demande de créer, modifier, supprimer ou calculer quelque chose dans le dessin, fais-le avec une action. Si la personne veut apprendre (« comment », « montre-moi », « où est »), utilise l'action montrer pour faire clignoter le bon bouton, puis explique en une phrase. S'il manque une dimension, choisis une valeur raisonnable et dis-le.
Aide sur drawGene : clic droit = menu (supprimer, copier, annuler) ; Suppr efface ; Ctrl+Z annule ; Ctrl+C/Ctrl+V copier-coller. 2D : outils à gauche, taper une longueur puis Entrée pendant un tracé, glisser dans le vide = sélection par rectangle, cliquer une cote bleue = la modifier et le dessin s'ajuste, calques en onglets, onglet Matériaux = coûts. 3D : Extrusion, Révolution, Trou ; 🪵 Bois ajoute 2x4/2x6/contreplaqué ; flèches colorées pour déplacer ; poignées pour étirer ; étiquettes bleues = cotes ; 🔗 Contrainte ; 📋 Liste de coupe ; ⬚ Zone ; 🔒 verrouiller. COUPES D'ANGLE : panneau de la planche, champs ✂ Coupe début/fin (°, ou pente 6/12) ; deux pièces sélectionnées (Ctrl+clic) + clic droit = Couper en onglet ou Couper contre ; les angles apparaissent dans la liste de coupe. Rotation à n'importe quel angle (champ Rotation, accepte 6/12). SUGGESTIONS : quand une série se répète (montants, chevrons, copies), la pièce suivante apparaît en rose ; Tab l'ajoute, Échap l'ignore ; en 2D, après 2 murs, Tab ferme le rectangle. SI ÇA ACCROCHE : ⋯ Plus → 🩺 Rapport de problème → Télécharger le rapport, puis l'envoyer à la personne qui s'occupe de drawGene. Pour ASSEMBLER : on attrape une pièce avec la souris et on l'approche d'une autre, elle s'aligne et se colle toute seule (aimant 🧲, touche Alt = sans aimant) ; clic droit « Sélectionner les pièces collées » pour déplacer un ensemble. Bouton 🎓 Simple / 🛠 Expert pour afficher plus ou moins d'outils. Enregistrer met la pièce dans la 📚 Bibliothèque, on la glisse dans un dessin pour assembler.`;
function speakable(t){return t.replace(/```[\s\S]*?```/g,'').replace(/[*_#`>|]/g,'').replace(/×/g,' par ').replace(/Ø/g,'diamètre ').replace(/\bmm\b/g,'millimètres').replace(/m²/g,'mètres carrés').replace(/\bpo\b/g,'pouces').replace(/\bpi\b/g,'pieds').trim()}
function pickVoice(){const V=speechSynthesis.getVoices().filter(v=>/^fr/i.test(v.lang));const fem=/antoine|jean|claude|henri|paul|thomas|guillaume|denis|jérôme|jerome|mathieu|r[ée]my|male\b|homme/i;
  return V.find(v=>/fr-CA/i.test(v.lang)&&fem.test(v.name))||V.find(v=>fem.test(v.name))||V.find(v=>/fr-CA/i.test(v.lang))||V[0]||null}
window.DGAssist={
  mount(app,tools,context,guide){guide=guide||{};
    if(Object.keys(guide).length)tools=[...tools,{name:'montrer',label:'Montrer',description:'Montre à l\'utilisateur où se trouve un bouton ou un outil en le faisant clignoter (à utiliser quand il veut apprendre ou dit « montre-moi »).',parameters:{type:'object',properties:{element:{type:'string',enum:Object.keys(guide)}},required:['element']},
      run:x=>{const g=guide[x.element];if(!g)return'élément inconnu';const el=typeof g=='function'?g():document.querySelector(g);return DGMenu.flash(el)?'le bouton « '+x.element+' » clignote à l\'écran':'élément introuvable'}}];if(!document.getElementById('dgacss')){const s=document.createElement('style');s.id='dgacss';s.textContent=css;document.head.append(s)}
    const box=document.createElement('div');box.className='dga';
    box.innerHTML=`<div class="st"><span class="av">✳</span><span class="who"><b>Claude</b><span class="stt"><span class="dot"></span>…</span></span><button class="vo" title="Voix de Claude (lecture à voix haute)">🔊</button><button class="cf" title="Réglages de Claude">⚙</button><button class="cl" title="Nouvelle conversation">🧹</button></div>
<div class="cfg" hidden></div><div class="log"></div>
<div class="att"></div><div class="ft"><input type="file" class="fi" hidden multiple accept=".pdf,image/*,.csv,.txt,.xls,.xlsx"><button class="clip" title="Joindre un plan (PDF Inventor, photo, capture, liste de cotes) — avec Claude">📎</button><button class="mic" title="Parler à Claude (micro)">🎤</button><textarea placeholder="Écrivez à Claude… (Entrée pour envoyer)"></textarea><button class="send">➤</button></div>`;
    const $q=s=>box.querySelector(s),log=$q('.log'),ta=$q('textarea'),stt=$q('.stt'),cfgBox=$q('.cfg'),av=$q('.av');
    let hist=[],chist=[],pend=[],busy=false,engine=null;
    const setSt=(cls,txt)=>{stt.innerHTML='<span class="dot '+cls+'"></span>';stt.append(txt)};
    const add=(cls,txt)=>{const d=document.createElement('div');d.className='m '+cls;d.textContent=txt;log.append(d);log.scrollTop=log.scrollHeight;return d};
    // ---- voix ----
    const vb=$q('.vo');const upV=()=>{vb.classList.toggle('on',cfg().voice);vb.textContent=cfg().voice?'🔊':'🔇'};upV();
    vb.onclick=()=>{saveCfg({voice:!cfg().voice});if(!cfg().voice&&'speechSynthesis' in window)speechSynthesis.cancel();upV()};
    function say(t){if(!cfg().voice||!('speechSynthesis' in window))return;const s=speakable(t);if(!s)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s);u.lang='fr-CA';const v=pickVoice();if(v)u.voice=v;u.rate=1.02;
      u.onstart=()=>av.classList.add('talk');u.onend=u.onerror=()=>av.classList.remove('talk');speechSynthesis.speak(u)}
    // ---- micro ----
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition,mb=$q('.mic');
    if(!SR)mb.remove();else mb.onclick=()=>{const r=new SR();r.lang='fr-CA';r.interimResults=true;mb.classList.add('on');if('speechSynthesis' in window)speechSynthesis.cancel();
      r.onresult=e=>{ta.value=[...e.results].map(x=>x[0].transcript).join('');if(e.results[e.results.length-1].isFinal){mb.classList.remove('on');send()}};
      r.onerror=e=>{mb.classList.remove('on');add('err',e.error=='not-allowed'?'Le micro est bloqué : autorisez-le dans la barre d\'adresse.':'Micro indisponible ('+e.error+'). La reconnaissance vocale demande internet.')};r.onend=()=>mb.classList.remove('on');r.start()};
    // ---- choix du moteur ----
    async function detect(){const c=cfg();if(c.claudeKey){engine='claude';setSt('ok','Prêt · '+(c.claudeModel.includes('opus')?'Claude Opus':c.claudeModel.includes('sonnet')?'Claude Sonnet':'Claude Haiku'));}else{engine=null;setSt('wait','Clé Claude à brancher')}}
    // ---- écran d'accueil ----
    const SUG=app=='3d'?['Ajoute 8 montants 2x4 aux 16 po','Fais une plaque d\'acier 200 par 100 par 6 avec 4 trous de 10','Combien de planches dois-je acheter ?','Comment je verrouille une pièce ?']
      :['Dessine une pièce de 4 m par 3,5 m','Ajoute une chambre de 12 pi par 10 pi','Combien ça va coûter en matériaux ?','Comment je change une cote ?'];
    function welcome(){log.innerHTML='';const c=cfg(),d=document.createElement('div');d.className='m a';
      d.textContent='Bonjour, je suis Claude ! Que voulez-vous faire ? Je peux le faire pour vous, ou vous montrer comment. Donnez-moi aussi un plan Inventor en PDF ou une photo avec 📎 : je lis les cotes et je le redessine.';
      const s=document.createElement('div');s.className='sugg';SUG.forEach(x=>{const b=document.createElement('button');b.textContent=x;b.onclick=()=>{ta.value=x;send()};s.append(b)});
      if(!engine){const h=document.createElement('div');h.className='help';
        h.innerHTML='<b>🔑 Brancher Claude (une seule fois)</b><br>Collez la clé API Anthropic (commence par <code>sk-ant-</code>). Elle reste sur cet ordinateur seulement.<input class="k" type="password" placeholder="sk-ant-…" style="width:100%;margin-top:6px;background:#0f1115;border:1px solid #363a44;border-radius:6px;color:#e6e7ea;padding:5px"><button class="big">🔑 Brancher Claude</button>';
        h.querySelector('.big').onclick=()=>{const k=h.querySelector('.k').value.trim();if(!/^sk-ant-/.test(k)){alert('La clé doit commencer par sk-ant-');return}saveCfg({claudeKey:k});detect().then(welcome)};log.append(h)}
      log.append(d,s)}
    function showCfg(){const c=cfg();cfgBox.hidden=!cfgBox.hidden;if(cfgBox.hidden)return;
      cfgBox.innerHTML=`<label>Clé API Claude (reste sur cet ordinateur)<input class="ck" type="password" placeholder="sk-ant-…"></label><label>Modèle Claude<select class="cm"><option value="claude-opus-5-5">Claude Opus 5.5 — le meilleur pour lire les plans</option><option value="claude-sonnet-5-5">Claude Sonnet 5.5 — plus économique</option><option value="claude-haiku-5-5">Claude Haiku 5.5 — très économique</option></select></label>
<button class="sv">Enregistrer</button>`;
      cfgBox.querySelector('.ck').value=c.claudeKey;cfgBox.querySelector('.cm').value=c.claudeModel;
      cfgBox.querySelector('.sv').onclick=()=>{saveCfg({claudeKey:cfgBox.querySelector('.ck').value.trim(),claudeModel:cfgBox.querySelector('.cm').value});cfgBox.hidden=true;detect().then(()=>{if(!hist.length)welcome()})}}
    $q('.cf').onclick=showCfg;$q('.cl').onclick=()=>{hist=[];chist=[];pend=[];showAtt();if('speechSynthesis' in window)speechSynthesis.cancel();welcome()};
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
    async function addFile(f){if(f.size>30e6){add('err',f.name+' : trop gros (max 30 Mo).');return}
      if(f.type=='application/pdf'||/\.pdf$/i.test(f.name))pend.push({name:f.name,block:{type:'document',source:{type:'base64',media_type:'application/pdf',data:await b64(f)}}});
      else if(/^image\/(png|jpeg|gif|webp)$/.test(f.type))pend.push({name:f.name,block:{type:'image',source:{type:'base64',media_type:f.type,data:await b64(f)}}});
      else if(/\.(csv|txt)$/i.test(f.name))pend.push({name:f.name,block:{type:'text',text:'Fichier « '+f.name+' » :\n'+(await f.text()).slice(0,200000)}});
      else{add('err',f.name+' : format non lu. Dans Inventor : Fichier → Exporter → PDF (ou faites une capture d\'écran). Pour Excel : enregistrer en CSV.');return}showAtt()}
    $q('.clip').onclick=()=>{if(engine!='claude'){add('err','Pour lire un plan, branchez d\'abord Claude (clé API dans ⚙).');return}fi.click()};
    fi.onchange=async()=>{for(const f of fi.files)await addFile(f);fi.value='';ta.focus()};
    box.addEventListener('dragover',e=>e.preventDefault());box.addEventListener('drop',async e=>{if(!e.dataTransfer.files.length||engine!='claude')return;e.preventDefault();e.stopPropagation();for(const f of e.dataTransfer.files)await addFile(f)});
    async function send(){let q=ta.value.trim();if(pend.length&&!q)q='Redessine ce plan dans drawGene avec toutes ses cotes.';if(!q||busy)return;if('speechSynthesis' in window)speechSynthesis.cancel();
      if(!engine){await detect();if(!engine){add('err','Collez d\'abord la clé Claude (encadré ci-dessus ou ⚙).');return}}
      ta.value='';busy=true;add('u',q+(pend.length&&engine=='claude'?'\n📎 '+pend.map(a=>a.name).join(', '):''));hist.push({role:'user',content:q});
      if(engine=='claude'){chist.push({role:'user',content:[...pend.map(a=>a.block),{type:'text',text:q}]});pend=[];showAtt()}
      try{await turnClaude()}
      catch(e){add('err','⚠ '+(e.name=='TypeError'?'Pas d\'internet : Claude a besoin d\'internet.':e.message))}
      busy=false;if(hist.length>30)hist=hist.slice(-30);
      if(chist.length>40){let i=chist.length-30;while(i<chist.length&&!(chist[i].role=='user'&&chist[i].content.some(b=>b.type=='text')))i++;chist=chist.slice(i)}}
    ta.onkeydown=e=>{e.stopPropagation();if(e.key=='Enter'&&!e.shiftKey){e.preventDefault();send()}};$q('.send').onclick=send;
    this.focus=()=>setTimeout(()=>ta.focus(),50);this._test={chist:()=>chist,addFile,send:t=>{ta.value=t;return send()}};
    detect().then(welcome);return box}};
})();
