// drawGene — assistant IA local (Ollama + Mistral), rien ne quitte l'ordinateur
(function(){
const css=`.dga{display:flex;flex-direction:column;height:100%;min-height:0;font:13px system-ui;color:#e6e7ea}
.dga .st{display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid #363a44;font-size:11px;color:#9aa0ab}
.dga .dot{width:8px;height:8px;border-radius:50%;background:#888;flex:none}.dga .dot.ok{background:#3dff8b}.dga .dot.ko{background:#ff5050}
.dga .st button,.dga .ft button{background:#2f333c;border:1px solid #363a44;color:#e6e7ea;border-radius:6px;padding:2px 8px;cursor:pointer;font:inherit}
.dga .log{flex:1;min-height:0;overflow-y:auto;padding:8px;display:flex;flex-direction:column;gap:8px}
.dga .m{padding:7px 10px;border-radius:10px;max-width:92%;white-space:pre-wrap;line-height:1.45;word-wrap:break-word}
.dga .u{align-self:flex-end;background:#3d8bff;color:#fff;border-bottom-right-radius:3px}.dga .a{align-self:flex-start;background:#2a2e37;border-bottom-left-radius:3px}
.dga .t{align-self:flex-start;font-size:11px;color:#9ec5ff;background:#3d8bff1a;border:1px dashed #3d8bff66;padding:3px 8px;border-radius:6px}
.dga .err{align-self:stretch;background:#5a202033;border:1px solid #ff505066;color:#ffb0b0}
.dga .ft{display:flex;gap:6px;padding:8px;border-top:1px solid #363a44}.dga textarea{flex:1;resize:none;height:54px;background:#1b1d23;border:1px solid #363a44;border-radius:8px;color:#e6e7ea;padding:6px;font:inherit}
.dga .send{background:#3d8bff!important;border-color:#3d8bff!important;color:#fff!important;font-weight:600}
.dga .cfg{padding:8px;border-bottom:1px solid #363a44;display:grid;gap:6px;font-size:12px}.dga .cfg input,.dga .cfg select{width:100%;background:#1b1d23;border:1px solid #363a44;border-radius:6px;color:#e6e7ea;padding:4px 6px;font:inherit}
.dga .help{font-size:11.5px;line-height:1.5;color:#cfd3da;background:#1b1d23;border:1px solid #363a44;border-radius:8px;padding:8px}.dga .help a{color:#9ec5ff}.dga code{background:#000;padding:0 4px;border-radius:3px}
.dga .sugg{display:flex;flex-wrap:wrap;gap:4px}.dga .sugg button{max-width:100%;white-space:normal;text-align:left;background:#1b1d23;border:1px solid #3d8bff66;color:#9ec5ff;border-radius:12px;padding:3px 9px;cursor:pointer;font:11.5px system-ui}`;
const KEY='drawgene-ai';
function cfg(){let c={};try{c=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}return{url:c.url||'http://localhost:11434',model:c.model||'mistral'}}
function saveCfg(c){try{localStorage.setItem(KEY,JSON.stringify(c))}catch(e){}}
const BASE=`Tu es l'assistant intégré de drawGene, un logiciel de dessin technique (plans de maison et pièces mécaniques, 2D et 3D) utilisé par un technicien québécois.
Réponds TOUJOURS en français, simplement et brièvement. Les unités internes sont des millimètres (1 po = 25,4 mm, 1 pi = 304,8 mm, 16 po c/c = 406 mm).
Quand l'utilisateur demande de créer, modifier, supprimer ou calculer quelque chose dans le dessin, utilise les outils fournis au lieu d'expliquer. Après une action, confirme en une phrase.
Si une information manque (une dimension), choisis une valeur raisonnable et dis-le.
Aide à l'utilisation de drawGene :
- Clic droit : menu (supprimer, copier, annuler…). Suppr efface. Ctrl+Z annule, Ctrl+Y rétablit. Ctrl+C / Ctrl+V copier-coller.
- 2D : outils à gauche (Mur, Porte, Fenêtre, Pièce, Ligne, Rect., Cercle, Cote, Texte, Mesure). Pendant un tracé, taper une longueur puis Entrée. Glisser dans le vide = sélection par rectangle. Clic sur une cote bleue = la modifier, le dessin s'ajuste. Calques en onglets en haut. Onglet Matériaux = liste de matériaux et coûts.
- 3D : Extrusion, Révolution, Trou, Enlèvement. 🪵 Bois ajoute 2x4, 2x6, contreplaqué. Flèches colorées pour déplacer, poignées pour étirer, étiquettes bleues pour changer les cotes. 🔗 Contrainte pour coller deux faces. 📋 Liste de coupe calcule les planches à acheter. ⬚ Zone pour sélectionner plusieurs pièces. 🔒 pour verrouiller.
- Enregistrer met la pièce dans la 📚 Bibliothèque ; on la glisse dans un dessin pour l'assembler. Fichiers .drawgene. Import STEP/IGES/STL/OBJ/DXF.`;
window.DGAssist={
  mount(app,tools,context){this.focus=()=>setTimeout(()=>{const t=document.querySelector('.dga textarea');t&&t.focus()},50);if(!document.getElementById('dgacss')){const s=document.createElement('style');s.id='dgacss';s.textContent=css;document.head.append(s)}
    const box=document.createElement('div');box.className='dga';
    box.innerHTML=`<div class="st"><span class="dot"></span><span class="stt">Vérification…</span><span style="flex:1"></span><button class="cf" title="Réglages de l'assistant">⚙</button><button class="cl" title="Nouvelle conversation">🧹</button></div>
<div class="cfg" hidden></div><div class="log"></div>
<div class="ft"><textarea placeholder="Demandez quelque chose… (Entrée pour envoyer)"></textarea><button class="send">➤</button></div>`;
    const log=box.querySelector('.log'),ta=box.querySelector('textarea'),dot=box.querySelector('.dot'),stt=box.querySelector('.stt'),cfgBox=box.querySelector('.cfg');
    let hist=[],busy=false,online=false;
    const add=(cls,txt)=>{const d=document.createElement('div');d.className='m '+cls;d.textContent=txt;log.append(d);log.scrollTop=log.scrollHeight;return d};
    const SUG=app=='3d'?['Ajoute 8 montants 2x4 aux 16 po','Fais une plaque d\'acier 200 × 100 × 6 avec 4 trous de 10','Combien de planches dois-je acheter ?','Comment je verrouille une pièce ?']
      :['Dessine une pièce de 4 m × 3,5 m','Ajoute une chambre de 12 pi × 10 pi à droite','Combien ça va coûter en matériaux ?','Comment je change une cote ?'];
    function welcome(){log.innerHTML='';const d=document.createElement('div');d.className='help';
      d.innerHTML='<b>🤖 Assistant local (Mistral)</b><br>Il fonctionne <b>sur cet ordinateur</b>, sans internet, gratuitement. Rien n\'est envoyé ailleurs.<br>Exemples :<div class="sugg"></div>';
      SUG.forEach(s=>{const b=document.createElement('button');b.textContent=s;b.onclick=()=>{ta.value=s;send()};d.querySelector('.sugg').append(b)});if(!online)setupHelp();log.append(d)}
    function setupHelp(){const d=document.createElement('div');d.className='help';d.style.borderColor='#ffb020';
      d.innerHTML=`<b>⚠ Assistant pas encore installé sur cet ordinateur</b><br>Installation unique (Windows) :<br>
1. Installer <b>Ollama</b> : <a href="https://ollama.com/download" target="_blank" rel="noopener">ollama.com/download</a><br>
2. Télécharger et lancer <a href="installer-assistant.bat" download>installer-assistant.bat</a> (double-clic). Il télécharge Mistral (≈ 4 Go) et autorise drawGene.<br>
3. Redémarrer l'ordinateur, puis rouvrir drawGene.<br>
Si Chrome/Edge demande d'« accéder aux appareils du réseau local », cliquer <b>Autoriser</b>.<br>
<i>Il faut au moins 8 Go de mémoire vive (16 Go conseillé).</i> <button class="rt">🔄 Revérifier</button>`;
      d.querySelector('.rt').onclick=check;log.append(d)}
    async function check(){const c=cfg();dot.className='dot';stt.textContent='Vérification…';
      try{const r=await fetch(c.url+'/api/tags',{signal:AbortSignal.timeout(4000)});const j=await r.json();const names=(j.models||[]).map(m=>m.name);
        const has=names.some(n=>n==c.model||n.split(':')[0]==c.model.split(':')[0]);online=true;
        if(has){dot.className='dot ok';stt.textContent='Prêt · '+c.model+' (local)'}else{dot.className='dot ko';stt.textContent='Modèle « '+c.model+' » absent'+(names.length?' · dispo : '+names.slice(0,3).join(', '):'');online=false}}
      catch(e){online=false;dot.className='dot ko';stt.textContent='Ollama non détecté sur cet ordinateur'}
      if(!hist.length)welcome()}
    function showCfg(){const c=cfg();cfgBox.hidden=!cfgBox.hidden;if(cfgBox.hidden)return;
      cfgBox.innerHTML=`<label>Adresse d'Ollama<input class="u"></label><label>Modèle<input class="mo" list="dgamodels"></label><datalist id="dgamodels"><option>mistral</option><option>mistral-nemo</option><option>mistral-small</option><option>ministral</option><option>llama3.2</option><option>qwen2.5</option></datalist><button class="sv">Enregistrer</button>`;
      cfgBox.querySelector('.u').value=c.url;cfgBox.querySelector('.mo').value=c.model;
      cfgBox.querySelector('.sv').onclick=()=>{saveCfg({url:cfgBox.querySelector('.u').value.trim().replace(/\/$/,''),model:cfgBox.querySelector('.mo').value.trim()||'mistral'});cfgBox.hidden=true;check()}}
    box.querySelector('.cf').onclick=showCfg;box.querySelector('.cl').onclick=()=>{hist=[];welcome()};
    const toolDefs=tools.map(t=>({type:'function',function:{name:t.name,description:t.description,parameters:t.parameters}}));
    async function chat(onText){const c=cfg();const sys={role:'system',content:BASE+'\n\nÉtat actuel du dessin :\n'+context()};
      const r=await fetch(c.url+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:c.model,messages:[sys,...hist],tools:toolDefs,stream:true,options:{temperature:.2}})});
      if(!r.ok)throw new Error('Ollama a répondu '+r.status+(r.status==403?' (accès refusé : relancez installer-assistant.bat puis redémarrez)':''));
      const rd=r.body.getReader(),dec=new TextDecoder();let buf='',msg={role:'assistant',content:'',tool_calls:[]};
      for(;;){const {value,done}=await rd.read();if(done)break;buf+=dec.decode(value,{stream:true});let i;
        while((i=buf.indexOf('\n'))>=0){const line=buf.slice(0,i).trim();buf=buf.slice(i+1);if(!line)continue;const j=JSON.parse(line);if(j.error)throw new Error(j.error);
          if(j.message){if(j.message.content){msg.content+=j.message.content;onText(msg.content)}if(j.message.tool_calls)msg.tool_calls.push(...j.message.tool_calls)}}}
      if(!msg.tool_calls.length)delete msg.tool_calls;return msg}
    async function send(){const q=ta.value.trim();if(!q||busy)return;if(!online){await check();if(!online){add('err','L\'assistant n\'est pas disponible. Suivez les étapes d\'installation ci-dessus.');return}}
      ta.value='';busy=true;add('u',q);hist.push({role:'user',content:q});
      try{for(let round=0;round<6;round++){const bub=add('a','…');const msg=await chat(t=>{bub.textContent=t;log.scrollTop=log.scrollHeight});
          if(!msg.content)bub.remove();hist.push(msg);if(!msg.tool_calls)break;
          for(const tc of msg.tool_calls){const f=tc.function||{},t=tools.find(x=>x.name==f.name);let args=f.arguments||{};if(typeof args=='string'){try{args=JSON.parse(args)}catch(e){args={}}}
            let res;try{res=t?await t.run(args):'Outil inconnu : '+f.name}catch(e){res='Erreur : '+e.message}
            add('t','⚙ '+(t?t.label||t.name:f.name)+(typeof res=='string'&&res.length<140?' → '+res:''));hist.push({role:'tool',content:typeof res=='string'?res:JSON.stringify(res),tool_name:f.name})}}}
      catch(e){add('err','⚠ '+(e.name=='TypeError'?'Impossible de joindre Ollama. Est-il lancé ? (icône du lama près de l\'horloge)':e.message))}
      busy=false;if(hist.length>30)hist=hist.slice(-30)}
    ta.onkeydown=e=>{e.stopPropagation();if(e.key=='Enter'&&!e.shiftKey){e.preventDefault();send()}};box.querySelector('.send').onclick=send;
    check();return box}};
})();
