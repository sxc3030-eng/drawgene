// drawGene — fenêtres amovibles : ancrer à gauche / à droite, flotter, redimensionner, réduire, fermer
(function(){
const css=`.dgdock{display:flex;flex-direction:column;flex:none;position:relative;background:#1b1d23;min-width:0;overflow:hidden}
.dgdock.left{border-right:1px solid #363a44}.dgdock.right{border-left:1px solid #363a44}.dgdock:empty{display:none}
.dgsplit{position:absolute;top:0;bottom:0;width:6px;cursor:ew-resize;z-index:3}.dgdock.left .dgsplit{right:-3px}.dgdock.right .dgsplit{left:-3px}.dgsplit:hover{background:#3d8bff66}
.dgp{display:flex;flex-direction:column;min-height:0;background:#22252c;overflow:hidden}
.dgdock .dgp{flex:1 1 0;border-bottom:1px solid #363a44}.dgdock .dgp.min{flex:none!important}
.dgp.float{position:fixed;z-index:50;border:1px solid #3d8bff;border-radius:10px;box-shadow:0 10px 30px #000a;resize:both;min-width:120px;min-height:60px}
.dgp.float.min{resize:none;height:auto!important;min-height:0}
.dgph{display:flex;align-items:center;gap:2px;height:26px;flex:none;padding:0 4px 0 8px;background:#2a2e37;border-bottom:1px solid #363a44;cursor:grab;user-select:none;touch-action:none;font:600 11px system-ui;color:#cfd3da;text-transform:uppercase;letter-spacing:.04em}
.dgph .ttl{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dgph button{background:none;border:0;color:#9aa0ab;cursor:pointer;padding:0 3px;font:13px system-ui;line-height:1;border-radius:4px;flex:none}.dgph button:hover{background:#3d8bff44;color:#fff}
.dgp.narrow .ttl,.dgp.narrow .xb{display:none}.dgp.narrow .dgph{padding:0 2px;justify-content:center}
.dgpb{flex:1;min-height:0;overflow:auto;position:relative;display:flex;flex-direction:column}
.dgp.min .dgpb{display:none}
.dgpb>*{position:static!important;transform:none!important;width:auto!important;max-width:none!important;flex:1 1 auto;min-height:0;border:0!important;height:auto!important}
.dgvs{height:5px;flex:none;cursor:ns-resize;margin-top:-3px;position:relative;z-index:2}.dgvs:hover{background:#3d8bff66}
.dghint{position:fixed;top:0;bottom:0;width:70px;background:#3d8bff33;border:2px dashed #3d8bff;z-index:60;pointer-events:none;display:none}
.dgmenu{position:fixed;z-index:70;background:#22252c;border:1px solid #3d8bff;border-radius:8px;padding:6px;box-shadow:0 8px 24px #000a;font:13px system-ui;color:#e6e7ea;min-width:200px}
.dgmenu label{display:flex;gap:8px;align-items:center;padding:5px 6px;border-radius:5px;cursor:pointer}.dgmenu label:hover{background:#2f333c}
.dgmenu button{width:100%;margin-top:6px;background:#2f333c;border:1px solid #363a44;color:#e6e7ea;border-radius:6px;padding:5px;cursor:pointer}
@media(max-width:760px){.dgdock{position:absolute!important;top:0;bottom:0;z-index:20;transition:transform .2s;width:85%!important}.dgdock.left{left:0;transform:translateX(-102%)}.dgdock.right{right:0;transform:translateX(102%)}.dgdock.open{transform:none}}`;
const DGPanels={
  init(app,main,center,defs){
    if(!document.getElementById('dgpcss')){const s=document.createElement('style');s.id='dgpcss';s.textContent=css;document.head.append(s)}
    const KEY='dgpanels-'+app;let st={};try{st=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
    const docks={left:document.createElement('div'),right:document.createElement('div')};
    docks.left.className='dgdock left';docks.right.className='dgdock right';main.insertBefore(docks.left,main.firstChild);main.append(docks.right);
    const dockW={left:(st._dw&&st._dw.left)||null,right:(st._dw&&st._dw.right)||null};
    const P={};let z=50;
    const hintL=document.createElement('div'),hintR=document.createElement('div');hintL.className=hintR.className='dghint';hintL.style.left='0';hintR.style.right='0';document.body.append(hintL,hintR);
    const save=()=>{const o={_dw:dockW};Object.values(P).forEach(p=>o[p.id]={mode:p.mode,x:p.x,y:p.y,w:p.w,h:p.h,min:p.min,hidden:p.hidden,order:p.order,weight:p.weight});try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}};
    const fire=()=>{requestAnimationFrame(()=>dispatchEvent(new Event('resize')))};
    defs.forEach((d,i)=>{const s=st[d.id]||{};const p={id:d.id,title:d.title,el:d.el,def:d,mode:s.mode||d.dock||'right',x:s.x??d.x??120,y:s.y??d.y??80,w:s.w||d.w||280,h:s.h||d.h||360,min:!!(s.min??d.min),hidden:!!s.hidden,order:s.order??i,weight:s.weight||d.weight||1};
      const w=document.createElement('div');w.className='dgp';w.innerHTML=`<div class="dgph" title="Glisser pour déplacer · vers un bord pour ancrer"><span class="ttl"></span><button class="mb" title="Réduire">–</button><button class="lb" title="Ancrer à gauche">◧</button><button class="fb" title="Fenêtre flottante">⧉</button><button class="rb" title="Ancrer à droite">◨</button><button class="xb" title="Fermer (réouvrir avec 🪟 Fenêtres)">✕</button></div><div class="dgpb"></div>`;
      w.querySelector('.ttl').textContent=d.title;w.querySelector('.dgpb').append(d.el);p.win=w;P[d.id]=p;
      const hd=w.querySelector('.dgph');
      w.querySelector('.mb').onclick=e=>{e.stopPropagation();p.min=!p.min;layout()};
      w.querySelector('.lb').onclick=e=>{e.stopPropagation();dockTo(p,'left')};w.querySelector('.rb').onclick=e=>{e.stopPropagation();dockTo(p,'right')};
      w.querySelector('.fb').onclick=e=>{e.stopPropagation();if(p.mode=='float')return;const r=w.getBoundingClientRect();p.mode='float';p.x=Math.max(10,r.left-40);p.y=Math.max(50,r.top+20);p.w=Math.max(200,r.width);p.h=Math.max(150,Math.min(r.height,innerHeight-120));layout()};
      w.querySelector('.xb').onclick=e=>{e.stopPropagation();p.hidden=true;layout()};
      hd.addEventListener('dblclick',()=>{p.min=!p.min;layout()});
      w.addEventListener('pointerdown',()=>{if(p.mode=='float')w.style.zIndex=++z});
      hd.addEventListener('pointerdown',e=>{if(e.target.tagName=='BUTTON')return;e.preventDefault();const sx=e.clientX,sy=e.clientY;let moved=false,ox=0,oy=0;
        const mv=ev=>{if(!moved&&Math.hypot(ev.clientX-sx,ev.clientY-sy)<6)return;
          if(!moved){moved=true;const r=w.getBoundingClientRect();if(p.mode!='float'){p.mode='float';p.w=Math.max(220,r.width);p.h=Math.max(160,Math.min(r.height,innerHeight*.6));p.x=ev.clientX-p.w/2;p.y=ev.clientY-12;layout()}ox=ev.clientX-p.x;oy=ev.clientY-p.y;w.style.zIndex=++z}
          p.x=Math.min(innerWidth-60,Math.max(-p.w+60,ev.clientX-ox));p.y=Math.min(innerHeight-30,Math.max(0,ev.clientY-oy));w.style.left=p.x+'px';w.style.top=p.y+'px';
          hintL.style.display=ev.clientX<50?'block':'none';hintR.style.display=ev.clientX>innerWidth-50?'block':'none'};
        const up=ev=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);hintL.style.display=hintR.style.display='none';if(!moved)return;
          if(ev.clientX<50)dockTo(p,'left');else if(ev.clientX>innerWidth-50)dockTo(p,'right');else{save();}};
        addEventListener('pointermove',mv);addEventListener('pointerup',up)});
      new ResizeObserver(()=>{if(p.mode=='float'&&!p.min&&w.offsetWidth){p.w=w.offsetWidth;p.h=w.offsetHeight;w.classList.toggle('narrow',p.w<130);clearTimeout(p.t);p.t=setTimeout(()=>{save();fire()},200)}}).observe(w)});
    function dockTo(p,side){p.mode=side;p.order=Math.max(0,...Object.values(P).filter(q=>q.mode==side&&q!==p).map(q=>q.order+1));if(!dockW[side])dockW[side]=p.w;layout()}
    function layout(){Object.values(docks).forEach(d=>d.innerHTML='');
      ['left','right'].forEach(side=>{const L=Object.values(P).filter(p=>p.mode==side&&!p.hidden).sort((a,b)=>a.order-b.order),d=docks[side];
        if(!L.length){d.style.width='0';return}const W=dockW[side]||Math.max(...L.map(p=>p.def.w||280));dockW[side]=W;d.style.width=W+'px';
        L.forEach((p,i)=>{const w=p.win;w.className='dgp'+(p.min?' min':'')+(W<130?' narrow':'');w.style.cssText='';w.style.flex=p.min?'none':p.weight+' 1 0';
          if(i>0){const vs=document.createElement('div');vs.className='dgvs';d.append(vs);const a=L[i-1],b=p;
            vs.onpointerdown=e=>{e.preventDefault();const sy=e.clientY,ha=a.win.offsetHeight,hb=b.win.offsetHeight,wa=a.weight,wb=b.weight;
              const mv=ev=>{const dy=ev.clientY-sy,na=Math.max(40,ha+dy),nb=Math.max(40,hb-dy),t=wa+wb;a.weight=t*na/(na+nb);b.weight=t*nb/(na+nb);a.win.style.flex=a.weight+' 1 0';b.win.style.flex=b.weight+' 1 0'};
              const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);save();fire()};addEventListener('pointermove',mv);addEventListener('pointerup',up)}}
          d.append(w)});
        const sp=document.createElement('div');sp.className='dgsplit';sp.title='Glisser pour élargir';d.append(sp);
        sp.onpointerdown=e=>{e.preventDefault();const sx=e.clientX,w0=dockW[side];const mv=ev=>{const dx=ev.clientX-sx;dockW[side]=Math.max(56,Math.min(innerWidth*.6,w0+(side=='left'?dx:-dx)));d.style.width=dockW[side]+'px';d.querySelectorAll('.dgp').forEach(x=>x.classList.toggle('narrow',dockW[side]<130));fire()};
          const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);save();fire()};addEventListener('pointermove',mv);addEventListener('pointerup',up)}});
      Object.values(P).filter(p=>p.mode=='float'&&!p.hidden).forEach(p=>{const w=p.win;w.className='dgp float'+(p.min?' min':'')+(p.w<130?' narrow':'');
        if(!p.min){p.h=Math.min(p.h,innerHeight-60);p.y=Math.min(p.y,innerHeight-p.h-6)}w.style.cssText=`left:${Math.min(Math.max(0,p.x),innerWidth-80)}px;top:${Math.min(Math.max(0,p.y),innerHeight-40)}px;width:${p.w}px;${p.min?'':'height:'+p.h+'px;'}z-index:${++z}`;if(w.parentNode!==document.body)document.body.append(w)});
      Object.values(P).filter(p=>p.hidden).forEach(p=>{p.win.className='dgp';p.win.style.cssText='display:none';if(p.win.parentNode!==document.body)document.body.append(p.win)});save();fire()}
    layout();
    const api={layout,
      menu(btn){const old=document.querySelector('.dgmenu');if(old){old.remove();return}const m=document.createElement('div');m.className='dgmenu';const r=btn.getBoundingClientRect();
        m.style.left=Math.min(r.left,innerWidth-220)+'px';m.style.top=(r.bottom+4)+'px';m.innerHTML='<div style="padding:4px 6px;color:#9aa0ab;font-size:11px;text-transform:uppercase">Fenêtres</div>';
        Object.values(P).forEach(p=>{const l=document.createElement('label');l.innerHTML='<input type="checkbox"> <span></span>';l.querySelector('span').textContent=p.title;l.querySelector('input').checked=!p.hidden;
          l.querySelector('input').onchange=e=>{p.hidden=!e.target.checked;if(!p.hidden)p.min=false;layout()};m.append(l)});
        const rs=document.createElement('button');rs.textContent='↺ Disposition par défaut';rs.onclick=()=>{try{localStorage.removeItem(KEY)}catch(e){}location.reload()};m.append(rs);
        document.body.append(m);setTimeout(()=>addEventListener('pointerdown',function f(e){if(!m.contains(e.target)&&e.target!==btn){m.remove();removeEventListener('pointerdown',f)}}),0)},
      toggleDock(side){docks[side].classList.toggle('open')},panels:P,docks};
    addEventListener('resize',()=>{Object.values(P).forEach(p=>{if(p.mode=='float'&&p.win.isConnected){p.win.style.left=Math.min(p.x,innerWidth-80)+'px';p.win.style.top=Math.min(p.y,innerHeight-40)+'px'}})});
    return api}
};
window.DGPanels=DGPanels;
})();
