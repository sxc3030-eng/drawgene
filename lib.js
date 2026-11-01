// drawGene — bibliothèque de pièces partagée (2D et 3D), glisser-déposer
(function(){
const KEY='drawgene-lib';
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
function store(l){try{localStorage.setItem(KEY,JSON.stringify(l));return true}catch(e){alert('Bibliothèque pleine : supprimez des pièces inutilisées ou exportez la bibliothèque.');return false}}
const listeners=[];
const DGLib={
  list:load,
  add(item){const l=load();const i=l.findIndex(x=>x.kind==item.kind&&x.name.toLowerCase()==item.name.toLowerCase());
    const it={id:i>=0?l[i].id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),date:new Date().toISOString(),...item};
    if(i>=0)l[i]=it;else l.unshift(it);store(l);listeners.forEach(f=>f());return it},
  remove(id){store(load().filter(x=>x.id!=id));listeners.forEach(f=>f())},
  get(id){return load().find(x=>x.id==id)},
  onChange(f){listeners.push(f)},
  exportAll(){const a=document.createElement('a');a.download='bibliotheque.drawgenelib';a.href=URL.createObjectURL(new Blob([JSON.stringify(load())],{type:'application/json'}));a.click()},
  importAll(text){const inc=JSON.parse(text);if(!Array.isArray(inc))throw new Error('Fichier de bibliothèque invalide');const l=load();
    inc.forEach(it=>{if(!l.some(x=>x.id==it.id))l.push(it)});store(l);listeners.forEach(f=>f());return inc.length},
  // Panneau en bas à droite. kind: '2d' ou '3d'. dropTarget: élément où l'on dépose. onDrop(item,x,y)
  mount(host,kind,dropTarget,onDrop,opts={}){
    const css=`.dglib{position:absolute;right:8px;bottom:8px;width:270px;max-width:calc(100% - 16px);max-height:48%;display:flex;flex-direction:column;background:#22252cf2;border:1px solid #3d8bff;border-radius:10px;z-index:6;box-shadow:0 6px 24px #0008;font:12px system-ui;color:#e6e7ea}
.dglib.min{max-height:none}.dglib.emb{position:static;width:auto;max-width:none;max-height:none;height:100%;border:0;border-radius:0;box-shadow:none;background:transparent}.dglib.emb header{display:none}.dglib.emb .dgb{flex:1;min-height:0}.dglib.emb.min .dgb{display:flex}.dglib.min .dgb{display:none}
.dglib header{display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid #363a44;cursor:pointer;user-select:none}
.dglib header b{flex:1;font-size:13px}.dglib header button,.dglib .dgb button{background:#2f333c;border:1px solid #363a44;color:#e6e7ea;border-radius:6px;padding:2px 7px;cursor:pointer;font:inherit}
.dgb{display:flex;flex-direction:column;min-height:0}.dgb input{box-sizing:border-box;width:calc(100% - 16px);margin:6px 8px;padding:4px 6px;background:#1b1d23;border:1px solid #363a44;border-radius:6px;color:#e6e7ea;font:inherit}
.dggrid{overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(76px,1fr));gap:6px;padding:0 8px 8px}
.dgit{position:relative;background:#1b1d23;border:1px solid #363a44;border-radius:7px;padding:3px;cursor:grab;touch-action:none;user-select:none;text-align:center}
.dgit:hover{border-color:#3d8bff}.dgit img{width:100%;aspect-ratio:4/3;object-fit:contain;display:block;background:#15171c;border-radius:4px;pointer-events:none}
.dgit span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;pointer-events:none}
.dgit .x{position:absolute;top:1px;right:1px;padding:0 4px;font-size:10px;display:none;background:#5a2020;border:0;color:#fff;border-radius:4px;cursor:pointer}.dgit:hover .x{display:block}
.dgit .bd{position:absolute;top:2px;left:2px;background:#ffb020;color:#000;font-size:9px;padding:0 3px;border-radius:3px;z-index:1}
.dgempty{padding:10px;color:#9aa0ab;line-height:1.4}
.dgghost{position:fixed;z-index:99;pointer-events:none;width:90px;opacity:.85;border:2px solid #3dff8b;border-radius:8px;background:#15171c;transform:translate(-50%,-50%)}`;
    if(!document.getElementById('dglibcss')){const s=document.createElement('style');s.id='dglibcss';s.textContent=css;document.head.append(s)}
    const box=document.createElement('div');box.className='dglib'+(opts.embedded?' emb':'');
    let collapsed=false;try{collapsed=localStorage.getItem('dglib-min-'+kind)=='1'}catch(e){}
    box.innerHTML=`<header><b>📚 Bibliothèque</b><span class="cnt"></span><button class="tg" title="Réduire / agrandir">▾</button></header>
<div class="dgb"><input class="q" placeholder="Rechercher une pièce…"><div class="dggrid"></div>
<div style="display:flex;gap:6px;padding:0 8px 8px"><button class="ex">Exporter</button><button class="im">Importer</button><input type="file" class="imf" accept=".drawgenelib,.json" hidden style="display:none"></div></div>`;
    host.append(box);
    const grid=box.querySelector('.dggrid'),q=box.querySelector('.q');
    const setMin=v=>{collapsed=v;box.classList.toggle('min',v);box.querySelector('.tg').textContent=v?'▴':'▾';try{localStorage.setItem('dglib-min-'+kind,v?'1':'0')}catch(e){}};
    setMin(collapsed);box.querySelector('header').onclick=()=>setMin(!collapsed);
    box.querySelector('.ex').onclick=()=>DGLib.exportAll();box.querySelector('.im').onclick=()=>box.querySelector('.imf').click();
    box.querySelector('.imf').onchange=e=>{const f=e.target.files[0];if(f)f.text().then(t=>{try{alert(DGLib.importAll(t)+' pièce(s) importée(s)')}catch(x){alert(x.message)}});e.target.value=''};
    function render(){const items=load().filter(x=>x.kind==kind&&(!q.value||x.name.toLowerCase().includes(q.value.toLowerCase())));
      box.querySelector('.cnt').textContent=items.length?'('+items.length+')':'';
      grid.innerHTML=items.length?'':`<div class="dgempty" style="grid-column:1/-1">Vide. Cliquez <b>Enregistrer</b> : la pièce apparaît ici.<br>Ensuite, glissez-la dans le dessin pour l'assembler.</div>`;
      items.forEach(it=>{const d=document.createElement('div');d.className='dgit';d.title=it.name+'\nGlisser dans le dessin pour l\'ajouter';
        d.innerHTML=`${it.sub=='asm'?'<b class="bd">ASM</b>':''}<img alt=""><span></span><button class="x" title="Retirer de la bibliothèque">✕</button>`;d.querySelector('span').textContent=it.name;if(/^data:image\//.test(it.thumb||''))d.querySelector('img').src=it.thumb;
        d.querySelector('.x').onpointerdown=e=>e.stopPropagation();
        d.querySelector('.x').onclick=e=>{e.stopPropagation();if(confirm('Retirer « '+it.name+' » de la bibliothèque ?'))DGLib.remove(it.id)};
        d.onpointerdown=e=>startDrag(e,it,d);grid.append(d)})}
    function startDrag(e,it,el){e.preventDefault();const sx=e.clientX,sy=e.clientY;let ghost=null,moved=false;
      const mv=ev=>{if(!moved&&Math.hypot(ev.clientX-sx,ev.clientY-sy)<6)return;moved=true;
        if(!ghost){ghost=document.createElement('img');ghost.className='dgghost';if(/^data:image\//.test(it.thumb||''))ghost.src=it.thumb;document.body.append(ghost)}ghost.style.left=ev.clientX+'px';ghost.style.top=ev.clientY+'px'};
      const up=ev=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);if(ghost)ghost.remove();
        const r=dropTarget.getBoundingClientRect();
        if(!moved){onDrop(it,r.left+r.width/2,r.top+r.height/2);return}
        const over=document.elementFromPoint(ev.clientX,ev.clientY);if(over&&(over==dropTarget||dropTarget.contains(over))&&!box.contains(over))onDrop(it,ev.clientX,ev.clientY)};
      addEventListener('pointermove',mv);addEventListener('pointerup',up);addEventListener('pointercancel',up)}
    q.oninput=render;DGLib.onChange(render);addEventListener('storage',e=>{if(e.key==KEY)render()});render();return box}
};
window.DGLib=DGLib;
})();
