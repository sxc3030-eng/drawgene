// drawGene — menu clic droit
(function(){
const css=`.dgcm{position:fixed;z-index:200;min-width:210px;background:#22252c;border:1px solid #3d8bff;border-radius:8px;padding:4px;box-shadow:0 10px 30px #000b;font:13px system-ui;color:#e6e7ea;user-select:none}
.dgcm .it{display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:5px;cursor:pointer;white-space:nowrap}
.dgcm .it:hover{background:#3d8bff;color:#fff}.dgcm .it.dis{opacity:.4;pointer-events:none}.dgcm .it.danger:hover{background:#c0392b}
.dgcm .ic{width:18px;text-align:center}.dgcm .lb{flex:1}.dgcm .k{color:#9aa0ab;font-size:11px}.dgcm .it:hover .k{color:#fff}
.dgcm .sep{height:1px;background:#363a44;margin:4px 6px}.dgcm .hd{padding:4px 10px;color:#9aa0ab;font-size:11px;text-transform:uppercase;letter-spacing:.04em;max-width:260px;overflow:hidden;text-overflow:ellipsis}`;
let cur=null;
function close(){if(cur){cur.remove();cur=null}}
window.DGMenu={close,
  show(x,y,items){close();if(!document.getElementById('dgcmcss')){const s=document.createElement('style');s.id='dgcmcss';s.textContent=css;document.head.append(s)}
    const m=document.createElement('div');m.className='dgcm';
    items.filter(Boolean).forEach(it=>{if(it==='-'){m.append(Object.assign(document.createElement('div'),{className:'sep'}));return}
      if(it.head){const h=document.createElement('div');h.className='hd';h.textContent=it.head;m.append(h);return}
      const d=document.createElement('div');d.className='it'+(it.disabled?' dis':'')+(it.danger?' danger':'');
      d.innerHTML='<span class="ic"></span><span class="lb"></span><span class="k"></span>';d.querySelector('.ic').textContent=it.icon||'';d.querySelector('.lb').textContent=it.label;d.querySelector('.k').textContent=it.key||'';
      d.onclick=()=>{close();it.action&&it.action()};m.append(d)});
    document.body.append(m);const r=m.getBoundingClientRect();m.style.left=Math.max(4,Math.min(x,innerWidth-r.width-4))+'px';m.style.top=Math.max(4,Math.min(y,innerHeight-r.height-4))+'px';cur=m;
    setTimeout(()=>{const f=e=>{if(cur&&!cur.contains(e.target)){close();removeEventListener('pointerdown',f,true)}};addEventListener('pointerdown',f,true)},0)}};
addEventListener('keydown',e=>{if(e.key=='Escape')close()},true);addEventListener('blur',close);
})();
