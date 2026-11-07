// drawGene — unités partagées (2D et 3D) : mm, cm, m, pouces, pieds-pouces
(function(){
const LIST={mm:'mm',cm:'cm',m:'m',in:'pouces',po:'pieds-pouces'},KEY='drawgene-unit';
const frac=(x,den=16)=>{let n=Math.round(x*den),w=Math.floor(n/den),f=n%den,d=den;while(f&&f%2==0){f/=2;d/=2}return{w,f,d}};
const U={LIST,
  get(){try{return localStorage.getItem(KEY)||'mm'}catch(e){return'mm'}},
  set(u){try{localStorage.setItem(KEY,u)}catch(e){}},
  fmt(mm,u,dec){if(mm==null||isNaN(mm))return'';u=u||U.get();const neg=mm<0?'-':'';mm=Math.abs(mm);
    if(u=='m')return neg+(mm/1000).toFixed(3)+' m';if(u=='cm')return neg+(Math.round(mm)/10).toFixed(1).replace(/\.0$/,'')+' cm';
    if(u=='in'){const {w,f,d}=frac(mm/25.4);return neg+w+(f?' '+f+'/'+d:'')+'"'}
    if(u=='po'){const i=mm/25.4,ft=Math.floor(i/12);let {w,f,d}=frac(i-ft*12);let F=ft;if(w==12){F++;w=0}return neg+(F?F+"' ":'')+w+(f?' '+f+'/'+d:'')+'"'}
    return neg+(dec?Math.round(mm*10)/10:Math.round(mm))+' mm'},
  parse(s,u){u=u||U.get();s=String(s).trim().replace(/,/g,'.').replace(/\s+/g,' ');if(!s)return NaN;let m;
    m=s.match(/^(-?\d+(?:\.\d+)?)\s*'(?:\s*(\d+(?:\.\d+)?))?(?:\s+(\d+)\/(\d+))?\s*"?$/);if(m)return(+m[1]*12+(+m[2]||0)+(m[3]?m[3]/m[4]:0))*25.4;
    m=s.match(/^(-?\d+(?:\.\d+)?)(?:\s+(\d+)\/(\d+))?\s*(mm|cm|m|po|pouces?|"|in)?$/i);if(!m){m=s.match(/^(\d+)\/(\d+)\s*(po|"|in)?$/);if(m)return m[1]/m[2]*25.4;return NaN}
    const v=+m[1]+(m[2]?m[2]/m[3]:0),k=(m[4]||'').toLowerCase();
    if(k=='mm')return v;if(k=='cm')return v*10;if(k=='m')return v*1000;if(k)return v*25.4;
    return u=='m'?v*1000:u=='cm'?v*10:(u=='in'||u=='po')?v*25.4:v},
  imperial(u){u=u||U.get();return u=='in'||u=='po'},
  options(sel){return Object.entries(LIST).map(([k,l])=>`<option value="${k}" ${k==sel?'selected':''}>${l}</option>`).join('')}};
window.DGUnits=U;
})();
