// drawGene — Lia, l'assistante IA intégrée.
// Moteur 1 : intégré (Ministral / Mistral dans le navigateur via WebGPU, téléchargé une fois, puis hors ligne).
// Moteur 2 : Ollama local s'il est présent (plus rapide). Rien ne quitte l'ordinateur.
(function(){
const WEBLLM='https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.85/+esm';
const MODELS={'Ministral-3-3B-Instruct-2512-BF16-q4f16_1-MLC':'Ministral 3B (Mistral) — léger, ≈ 2 Go · conseillé','Mistral-7B-Instruct-v0.3-q4f16_1-MLC':'Mistral 7B — plus intelligent, ≈ 4 Go · PC puissant','Llama-3.2-3B-Instruct-q4f16_1-MLC':'Llama 3.2 3B — léger, ≈ 2 Go'};
const DEF_MODEL='Ministral-3-3B-Instruct-2512-BF16-q4f16_1-MLC';
const css=`.dga{display:flex;flex-direction:column;height:100%;min-height:0;font:13px system-ui;color:#e6e7ea}
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
.dga .sugg{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}.dga .sugg button{max-width:100%;white-space:normal;text-align:left;background:#1b1d23;border:1px solid #7b4dff88;color:#c9a8ff;border-radius:12px;padding:3px 9px;cursor:pointer;font:11.5px system-ui}`;
const KEY='drawgene-ai';
function cfg(){let c={};try{c=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}return{engine:c.engine||'auto',url:c.url||'http://localhost:11434',ollamaModel:c.ollamaModel||c.model||'mistral',webModel:c.webModel||DEF_MODEL,voice:c.voice!==false,ready:!!c.ready}}
function saveCfg(p){try{localStorage.setItem(KEY,JSON.stringify({...cfg(),...p}))}catch(e){}}
const PERSONA=`Tu t'appelles Lia. Tu es l'assistante intégrée de drawGene, un logiciel de dessin technique (plans de maison et pièces mécaniques, 2D et 3D) pensé par Eugene, un technicien québécois. Tu parles à la première personne, au féminin ("je suis prête", "je l'ai ajouté"), avec chaleur et simplicité.
Réponds TOUJOURS en français, en 1 à 3 phrases courtes (tes réponses sont lues à voix haute). Unités internes : millimètres (1 po = 25,4 mm, 1 pi = 304,8 mm, 16 po c/c = 406 mm).
Quand on te demande de créer, modifier, supprimer ou calculer quelque chose dans le dessin, utilise une action au lieu d'expliquer. S'il manque une dimension, choisis une valeur raisonnable et dis-le.
Aide sur drawGene : clic droit = menu (supprimer, copier, annuler) ; Suppr efface ; Ctrl+Z annule ; Ctrl+C/Ctrl+V copier-coller. 2D : outils à gauche, taper une longueur puis Entrée pendant un tracé, glisser dans le vide = sélection par rectangle, cliquer une cote bleue = la modifier et le dessin s'ajuste, calques en onglets, onglet Matériaux = coûts. 3D : Extrusion, Révolution, Trou ; 🪵 Bois ajoute 2x4/2x6/contreplaqué ; flèches colorées pour déplacer ; poignées pour étirer ; étiquettes bleues = cotes ; 🔗 Contrainte ; 📋 Liste de coupe ; ⬚ Zone ; 🔒 verrouiller. Enregistrer met la pièce dans la 📚 Bibliothèque, on la glisse dans un dessin pour assembler.`;
function speakable(t){return t.replace(/```[\s\S]*?```/g,'').replace(/[*_#`>|]/g,'').replace(/×/g,' par ').replace(/Ø/g,'diamètre ').replace(/\bmm\b/g,'millimètres').replace(/m²/g,'mètres carrés').replace(/\bpo\b/g,'pouces').replace(/\bpi\b/g,'pieds').trim()}
function pickVoice(){const V=speechSynthesis.getVoices().filter(v=>/^fr/i.test(v.lang));const fem=/sylvie|caroline|denise|hortense|julie|am[ée]lie|chantal|marie|audrey|female|femme|elsa|brigitte|vivienne|eloise|celine|l[ée]a/i;
  return V.find(v=>/fr-CA/i.test(v.lang)&&fem.test(v.name))||V.find(v=>fem.test(v.name))||V.find(v=>/fr-CA/i.test(v.lang))||V[0]||null}
window.DGAssist={
  mount(app,tools,context){if(!document.getElementById('dgacss')){const s=document.createElement('style');s.id='dgacss';s.textContent=css;document.head.append(s)}
    const box=document.createElement('div');box.className='dga';
    box.innerHTML=`<div class="st"><span class="av">👩</span><span class="who"><b>Lia</b><span class="stt"><span class="dot"></span>…</span></span><button class="vo" title="Voix de Lia (lecture à voix haute)">🔊</button><button class="cf" title="Réglages de Lia">⚙</button><button class="cl" title="Nouvelle conversation">🧹</button></div>
<div class="cfg" hidden></div><div class="log"></div>
<div class="ft"><button class="mic" title="Parler à Lia (micro)">🎤</button><textarea placeholder="Écrivez à Lia… (Entrée pour envoyer)"></textarea><button class="send">➤</button></div>`;
    const $q=s=>box.querySelector(s),log=$q('.log'),ta=$q('textarea'),stt=$q('.stt'),cfgBox=$q('.cfg'),av=$q('.av');
    let hist=[],busy=false,engine=null,web=null,webLoading=null;
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
    async function ollamaOk(){const c=cfg();try{const r=await fetch(c.url+'/api/tags',{signal:AbortSignal.timeout(2500)});const j=await r.json();return(j.models||[]).some(m=>m.name==c.ollamaModel||m.name.split(':')[0]==c.ollamaModel.split(':')[0])}catch(e){return false}}
    async function detect(){const c=cfg();setSt('wait','Je me prépare…');
      if(c.engine!='web'&&await ollamaOk()){engine='ollama';setSt('ok','Prête · '+c.ollamaModel+' (Ollama, sur cet ordinateur)');return}
      if(c.engine=='ollama'){engine=null;setSt('ko','Ollama introuvable');return}
      if(!navigator.gpu){engine=null;setSt('ko','Carte graphique (WebGPU) non disponible');return}
      engine='web';setSt(c.ready?'ok':'wait',c.ready?'Prête · '+(MODELS[c.webModel]||c.webModel).split(' —')[0]+' (intégrée)':'Pas encore activée')}
    async function loadWeb(){if(web)return web;if(webLoading)return webLoading;const c=cfg();
      const wrap=document.createElement('div');wrap.className='help';wrap.innerHTML='<b>Je m\'installe…</b> <span class="pt"></span><div class="bar"><i></i></div>';log.append(wrap);log.scrollTop=log.scrollHeight;
      webLoading=(async()=>{try{navigator.storage&&navigator.storage.persist&&await navigator.storage.persist()}catch(e){}const W=await import(WEBLLM);const e=await W.CreateMLCEngine(c.webModel,{initProgressCallback:r=>{wrap.querySelector('.pt').textContent=(()=>{const t=r.text||'',m=t.match(/(\d+)MB fetched\. (\d+)% completed/);if(m)return 'Téléchargement : '+m[1]+' Mo ('+m[2]+' %)';const k=t.match(/\[(\d+)\/(\d+)\]/);if(/cache/i.test(t)&&k)return 'Chargement '+Math.round(k[1]/k[2]*100)+' %';if(/shader|GPU/i.test(t))return 'Préparation de la carte graphique…';return t.slice(0,60)})();wrap.querySelector('i').style.width=Math.round((r.progress||0)*100)+'%'}});
        web=e;saveCfg({ready:true});wrap.remove();setSt('ok','Prête · '+(MODELS[c.webModel]||c.webModel).split(' —')[0]+' (intégrée)');return e})();
      try{return await webLoading}catch(err){webLoading=null;wrap.remove();if(/quota/i.test(err.message))throw new Error('pas assez d\'espace disque libre (il faut environ '+(((MODELS[c.webModel]||'').split('≈ ')[1]||'').split(' ·')[0]||'quelques Go')+' de libre).');throw err}}
    // ---- écran d'accueil ----
    const SUG=app=='3d'?['Ajoute 8 montants 2x4 aux 16 po','Fais une plaque d\'acier 200 par 100 par 6 avec 4 trous de 10','Combien de planches dois-je acheter ?','Comment je verrouille une pièce ?']
      :['Dessine une pièce de 4 m par 3,5 m','Ajoute une chambre de 12 pi par 10 pi','Combien ça va coûter en matériaux ?','Comment je change une cote ?'];
    function welcome(){log.innerHTML='';const c=cfg(),d=document.createElement('div');d.className='m a';
      d.textContent='Bonjour, je suis Lia, votre assistante. Demandez-moi de dessiner, de calculer ou de vous expliquer quelque chose. Je fonctionne sur votre ordinateur : rien ne part sur internet.';
      const s=document.createElement('div');s.className='sugg';SUG.forEach(x=>{const b=document.createElement('button');b.textContent=x;b.onclick=()=>{ta.value=x;send()};s.append(b)});
      if(engine=='web'&&!c.ready){const h=document.createElement('div');h.className='help';
        h.innerHTML='<b>Activer Lia sur cet ordinateur</b><br>Je dois me télécharger <b>une seule fois</b> (<span class="sz"></span>). Ensuite je fonctionne <b>sans internet</b>, gratuitement.<button class="big">👩 Activer Lia</button>';
        h.querySelector('.sz').textContent=((MODELS[c.webModel]||'').split('≈ ')[1]||'quelques Go').split(' ·')[0];
        h.querySelector('.big').onclick=async()=>{h.remove();try{await loadWeb();const m='Voilà, je suis prête ! Que puis-je faire pour vous ?';add('a',m);say(m)}catch(e){add('err','Je n\'ai pas pu m\'installer : '+e.message)}};log.prepend(h)}
      if(!engine){const h=document.createElement('div');h.className='help';h.style.borderColor='#ffb020';
        h.innerHTML='<b>⚠ Je ne peux pas démarrer sur cet appareil</b><br>J\'ai besoin d\'une carte graphique compatible <b>WebGPU</b> : utilisez <b>Chrome</b> ou <b>Edge</b> à jour sur un ordinateur Windows/Mac récent.<br>Autre option : installer <a href="https://ollama.com/download" target="_blank" rel="noopener">Ollama</a> puis lancer <a href="installer-assistant.bat" download>installer-assistant.bat</a>, et redémarrer. <button class="big rt">🔄 Réessayer</button>';
        h.querySelector('.rt').onclick=()=>detect().then(welcome);log.prepend(h)}
      log.append(d,s)}
    function showCfg(){const c=cfg();cfgBox.hidden=!cfgBox.hidden;if(cfgBox.hidden)return;
      cfgBox.innerHTML=`<label>Cerveau de Lia<select class="en"><option value="auto">Automatique (Ollama si présent, sinon intégré)</option><option value="web">Intégré à drawGene</option><option value="ollama">Ollama (installé à part)</option></select></label>
<label>Modèle intégré<select class="wm"></select></label><label>Modèle Ollama<input class="om"></label><label>Adresse d'Ollama<input class="u"></label><button class="sv">Enregistrer</button>`;
      const wm=cfgBox.querySelector('.wm');Object.entries(MODELS).forEach(([k,v])=>{const o=document.createElement('option');o.value=k;o.textContent=v;wm.append(o)});
      cfgBox.querySelector('.en').value=c.engine;wm.value=c.webModel;cfgBox.querySelector('.om').value=c.ollamaModel;cfgBox.querySelector('.u').value=c.url;
      cfgBox.querySelector('.sv').onclick=()=>{const nw=wm.value;saveCfg({engine:cfgBox.querySelector('.en').value,webModel:nw,ollamaModel:cfgBox.querySelector('.om').value.trim()||'mistral',url:cfgBox.querySelector('.u').value.trim().replace(/\/$/,''),...(nw!=c.webModel?{ready:false}:{})});
        if(nw!=c.webModel){web=null;webLoading=null}cfgBox.hidden=true;detect().then(()=>{if(!hist.length)welcome()})}}
    $q('.cf').onclick=showCfg;$q('.cl').onclick=()=>{hist=[];if('speechSynthesis' in window)speechSynthesis.cancel();welcome()};
    // ---- conversation ----
    const toolDefs=tools.map(t=>({type:'function',function:{name:t.name,description:t.description,parameters:t.parameters}}));
    const toolText=tools.map(t=>`- ${t.name} : ${t.description} Paramètres : ${JSON.stringify(Object.fromEntries(Object.entries(t.parameters.properties||{}).map(([k,v])=>[k,v.enum?v.enum.join('|'):v.type])))}`).join('\n');
    const ACTION_RULE=`\n\nACTIONS DISPONIBLES :\n${toolText}\nPour faire une action, écris UNIQUEMENT un bloc comme ceci, sans autre texte :\n\`\`\`action\n{"outil":"nom_de_l_outil","args":{...}}\n\`\`\`\nJe te donnerai ensuite le RÉSULTAT, puis tu confirmeras en une phrase. Si aucune action n'est nécessaire, réponds simplement.`;
    async function runTool(name,args){const t=tools.find(x=>x.name==name);let res;try{res=t?await t.run(args||{}):'Outil inconnu : '+name}catch(e){res='Erreur : '+e.message}
      add('t','⚙ '+(t?t.label||t.name:name)+(typeof res=='string'&&res.length<140?' → '+res:''));return typeof res=='string'?res:JSON.stringify(res)}
    async function turnOllama(){const c=cfg();for(let round=0;round<6;round++){const bub=add('a','…');
        const r=await fetch(c.url+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:c.ollamaModel,messages:[{role:'system',content:PERSONA+'\n\nÉtat actuel du dessin :\n'+context()},...hist],tools:toolDefs,stream:true,options:{temperature:.2}})});
        if(!r.ok)throw new Error('Ollama a répondu '+r.status+(r.status==403?' (accès refusé : relancez installer-assistant.bat puis redémarrez)':''));
        const rd=r.body.getReader(),dec=new TextDecoder();let buf='',msg={role:'assistant',content:'',tool_calls:[]};
        for(;;){const {value,done}=await rd.read();if(done)break;buf+=dec.decode(value,{stream:true});let i;
          while((i=buf.indexOf('\n'))>=0){const line=buf.slice(0,i).trim();buf=buf.slice(i+1);if(!line)continue;const j=JSON.parse(line);if(j.error)throw new Error(j.error);
            if(j.message){if(j.message.content){msg.content+=j.message.content;bub.textContent=msg.content;log.scrollTop=log.scrollHeight}if(j.message.tool_calls)msg.tool_calls.push(...j.message.tool_calls)}}}
        if(!msg.content)bub.remove();if(!msg.tool_calls.length)delete msg.tool_calls;hist.push(msg);if(!msg.tool_calls){say(msg.content);return}
        for(const tc of msg.tool_calls){const f=tc.function||{};let a=f.arguments||{};if(typeof a=='string'){try{a=JSON.parse(a)}catch(e){a={}}}hist.push({role:'tool',content:await runTool(f.name,a),tool_name:f.name})}}}
    function parseAction(t){const m=t.match(/```(?:action|json)?\s*(\{[\s\S]*?\})\s*```/)||t.match(/(\{\s*"outil"[\s\S]*\})/);if(!m)return null;try{const o=JSON.parse(m[1]);if(o.outil)return{name:o.outil,args:o.args||{},raw:m[0]}}catch(e){}return null}
    async function turnWeb(){const e=await loadWeb();for(let round=0;round<5;round++){const bub=add('a','…');let txt='';
        const msgs=[{role:'system',content:PERSONA+ACTION_RULE+'\n\nÉtat actuel du dessin :\n'+context()},...hist.slice(-10)];
        const st=await e.chat.completions.create({messages:msgs,stream:true,temperature:.2,max_tokens:500});
        for await(const ch of st){const d=ch.choices[0]?.delta?.content||'';if(d){txt+=d;bub.textContent=txt.replace(/```action[\s\S]*$/,'⚙ …');log.scrollTop=log.scrollHeight}}
        hist.push({role:'assistant',content:txt});const act=parseAction(txt);const clean=txt.replace(act?act.raw:'@@','').replace(/```[\s\S]*?```/g,'').trim();
        if(!act){bub.textContent=clean||txt;say(clean||txt);return}
        if(clean)bub.textContent=clean;else bub.remove();const res=await runTool(act.name,act.args);hist.push({role:'user',content:'RÉSULTAT de '+act.name+' : '+res+'\nConfirme en une phrase courte.'})}}
    async function send(){const q=ta.value.trim();if(!q||busy)return;if('speechSynthesis' in window)speechSynthesis.cancel();
      if(!engine){await detect();if(!engine){add('err','Je ne peux pas répondre sur cet appareil. Voir les instructions ci-dessus.');return}}
      ta.value='';busy=true;add('u',q);hist.push({role:'user',content:q});
      try{if(engine=='ollama')await turnOllama();else await turnWeb()}
      catch(e){add('err','⚠ '+(e.name=='TypeError'&&engine=='ollama'?'Impossible de joindre Ollama. Est-il lancé ?':e.message))}
      busy=false;if(hist.length>30)hist=hist.slice(-30)}
    ta.onkeydown=e=>{e.stopPropagation();if(e.key=='Enter'&&!e.shiftKey){e.preventDefault();send()}};$q('.send').onclick=send;
    this.focus=()=>setTimeout(()=>ta.focus(),50);this._test={parseAction,setEngine:(n,w)=>{engine=n;web=w},send:t=>{ta.value=t;return send()}};
    detect().then(welcome);return box}};
})();
