(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const demoOn = () => { try { return sessionStorage.getItem('installerlab-analytics-demo') === '1'; } catch { return false; } };
  const params = () => new URLSearchParams(location.search);
  const trackId = () => params().get('trackId') || params().get('track') || '';
  const cfg = () => window.INSTALLERLAB_ANALYTICS_CONFIG || {};
  const clean = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x20-\x7E]/g,' ');
  const escPdf = s => clean(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');

  const t = () => es() ? {
    button:'Informe PDF', generating:'Generando PDF...', noData:'Conecta una aplicacion mediante TrackID o activa el modo demo.', error:'No se pudo generar el informe PDF.',
    report:'INFORME DE ANALITICA DE DESPLIEGUE', subtitle:'InstallerLab Analytics', demo:'DATOS DEMO', live:'DATOS EN VIVO',
    generated:'Generado', period:'Periodo', track:'TrackID', app:'Aplicacion', summary:'Resumen ejecutivo', installs:'Instalaciones', success:'Correctas', failed:'Fallidas',
    uninstalls:'Desinstalaciones', active:'Instalaciones activas', launches:'Ejecuciones', rate:'Tasa de exito', versions:'Adopcion por version', windows:'Windows', platform:'Arquitectura',
    recent:'Actividad reciente', date:'Fecha', version:'Version', package:'Paquete', event:'Evento', result:'Resultado', system:'Sistema', methodology:'Metodologia y alcance',
    method:'Este informe resume los eventos tecnicos de InstallerLab Analytics para el TrackID y periodo seleccionados. TrackID identifica un flujo de analitica del proyecto y no representa una licencia, usuario o equipo.',
    privacy:'Privacidad', privacyText:'InstallerLab Analytics no necesita nombre, correo, HWID, Machine Code ni claves de licencia para producir estas estadisticas.',
    demoNote:'Los valores DEMO son ficticios y sirven exclusivamente para mostrar el funcionamiento del dashboard.', footer:'InstallerLab Analytics - installerlab.website', all:'Todo el historial'
  } : {
    button:'PDF Report', generating:'Generating PDF...', noData:'Connect an application with a TrackID or enable demo mode.', error:'The PDF report could not be generated.',
    report:'DEPLOYMENT ANALYTICS REPORT', subtitle:'InstallerLab Analytics', demo:'DEMO DATA', live:'LIVE DATA',
    generated:'Generated', period:'Period', track:'TrackID', app:'Application', summary:'Executive summary', installs:'Installs', success:'Successful', failed:'Failed',
    uninstalls:'Uninstalls', active:'Active installs', launches:'Launches', rate:'Success rate', versions:'Version adoption', windows:'Windows', platform:'Architecture',
    recent:'Recent activity', date:'Date', version:'Version', package:'Package', event:'Event', result:'Result', system:'System', methodology:'Methodology & scope',
    method:'This report summarizes technical InstallerLab Analytics events for the selected TrackID and period. TrackID identifies a project analytics stream and is not a license, user or device identifier.',
    privacy:'Privacy', privacyText:'InstallerLab Analytics does not require names, email addresses, HWID, Machine Code or license keys to produce these statistics.',
    demoNote:'DEMO values are fictional and exist only to demonstrate how the dashboard works.', footer:'InstallerLab Analytics - installerlab.website', all:'All time'
  };

  function periodInfo(){
    const select = document.querySelector('.iax-filterbar select');
    const index = select?.selectedIndex || 0;
    const label = select?.selectedOptions?.[0]?.textContent?.trim() || (es() ? 'Ultimos 7 dias' : 'Last 7 days');
    if(index === 3) return {label, from:null};
    const days = index === 2 ? 90 : index === 1 ? 30 : 7;
    return {label, from:new Date(Date.now()-days*86400000).toISOString()};
  }

  async function fetchLive(){
    const id = trackId(), c = cfg();
    if(!id || !c.url || !c.publishableKey) return null;
    const endpoint = String(c.url).replace(/\/$/,'') + '/rest/v1/rpc/analytics_summary';
    const range = periodInfo();
    const payload = {p_track_id:id,p_to:new Date().toISOString()};
    if(range.from) payload.p_from = range.from;
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(),8000);
    try{
      const r = await fetch(endpoint,{method:'POST',headers:{apikey:String(c.publishableKey),Authorization:`Bearer ${String(c.publishableKey)}`,'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
      if(!r.ok) throw new Error(`Supabase RPC ${r.status}`);
      return await r.json();
    } finally { clearTimeout(timeout); }
  }

  function demoSummary(){
    const now=Date.now();
    const ev=(h,v,p,type,result,win,arch)=>({event_at:new Date(now-h*3600000).toISOString(),app_version:v,package_type:p,event_type:type,result,system:{windows_version:win,architecture:arch}});
    return {installs:1284,successful:1217,failed:43,uninstalls:24,active_installs:1046,launches:8932,
      versions:[{label:'v3.1.0',installs:873},{label:'v3.0.0',installs:295},{label:'v2.9',installs:90},{label:'Older',installs:26}],
      windows:[{label:'Windows 11',value:925},{label:'Windows 10',value:321},{label:'Windows Server',value:26},{label:'Other',value:12}],
      platforms:[{label:'x64',value:1168},{label:'ARM64',value:77},{label:'x86',value:39}],
      recent_events:[ev(1,'3.1.0','Bundle','install_completed','Successful','Windows 11','x64'),ev(3,'3.1.0','MSI','install_completed','Successful','Windows 11','x64'),ev(5,'3.1.0','Setup EXE','install_failed','Failed','Windows 10','x64'),ev(8,'3.0.0','MSI','uninstall_completed','Successful','Windows 11','x64'),ev(12,'3.1.0','Bundle','launch','Successful','Windows 11','ARM64')]};
  }

  class PDF {
    constructor(){this.W=595.28;this.H=841.89;this.pages=[[]];}
    get p(){return this.pages[this.pages.length-1];}
    page(){this.pages.push([]);return this;}
    rgb(c){return c.map(v=>(v/255).toFixed(3)).join(' ');}
    rect(x,y,w,h,fill,stroke=null,r=0){const yy=this.H-y-h; if(fill)this.p.push(`${this.rgb(fill)} rg`); if(stroke)this.p.push(`${this.rgb(stroke)} RG`); this.p.push(`${x.toFixed(2)} ${yy.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${fill&&stroke?'B':fill?'f':'S'}`);return this;}
    line(x1,y1,x2,y2,color=[220,228,236],width=1){this.p.push(`${this.rgb(color)} RG ${width} w ${x1.toFixed(2)} ${(this.H-y1).toFixed(2)} m ${x2.toFixed(2)} ${(this.H-y2).toFixed(2)} l S`);return this;}
    text(x,y,s,size=10,bold=false,color=[30,48,66],align='left'){s=escPdf(s);const approx=s.length*size*.52;let xx=x;if(align==='right')xx=x-approx;if(align==='center')xx=x-approx/2;this.p.push(`${this.rgb(color)} rg BT /${bold?'F2':'F1'} ${size} Tf 1 0 0 1 ${xx.toFixed(2)} ${(this.H-y).toFixed(2)} Tm (${s}) Tj ET`);return this;}
    wrap(x,y,text,maxWidth,size=9,bold=false,color=[80,98,116],lineH=13){const words=clean(text).split(/\s+/);let line='',yy=y;const maxChars=Math.max(10,Math.floor(maxWidth/(size*.52)));for(const w of words){const test=line?line+' '+w:w;if(test.length>maxChars&&line){this.text(x,yy,line,size,bold,color);yy+=lineH;line=w;}else line=test;}if(line)this.text(x,yy,line,size,bold,color);return yy+lineH;}
    blob(){
      const objs=[]; const add=s=>{objs.push(s);return objs.length;};
      add('<< /Type /Catalog /Pages 2 0 R >>'); add('');
      const f1=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
      const f2=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
      const kids=[];
      for(const commands of this.pages){const stream=commands.join('\n');const content=add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);const page=add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${this.W} ${this.H}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> /Contents ${content} 0 R >>`);kids.push(`${page} 0 R`);}
      objs[1]=`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${kids.length} >>`;
      let out='%PDF-1.4\n'; const offsets=[0];
      for(let i=0;i<objs.length;i++){offsets.push(out.length);out+=`${i+1} 0 obj\n${objs[i]}\nendobj\n`;}
      const xref=out.length; out+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n`; for(let i=1;i<offsets.length;i++)out+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';
      out+=`trailer\n<< /Size ${objs.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
      return new Blob([out],{type:'application/pdf'});
    }
  }

  const palette={navy:[10,31,55],blue:[48,131,220],cyan:[78,170,242],green:[31,157,119],red:[204,73,73],amber:[196,133,35],text:[29,46,64],muted:[95,113,130],line:[222,229,236],paper:[247,250,253],white:[255,255,255]};

  function metric(pdf,x,y,w,label,value,color){pdf.rect(x,y,w,58,[248,251,253],palette.line);pdf.rect(x,y,4,58,color);pdf.text(x+12,y+19,label,8,true,palette.muted);pdf.text(x+12,y+43,String(value),19,true,color);}
  function section(pdf,y,title){pdf.text(46,y,title,14,true,palette.navy);pdf.line(46,y+8,165,y+8,palette.cyan,2);return y+26;}
  function distribution(pdf,x,y,w,title,rows){pdf.rect(x,y,w,132,[250,252,254],palette.line);pdf.text(x+12,y+20,title,10,true,palette.text);const a=(Array.isArray(rows)?rows:[]).slice(0,4).map(r=>({label:r.label||'Unknown',value:Number(r.value??r.installs??0)}));const total=a.reduce((s,r)=>s+r.value,0)||1;a.forEach((r,i)=>{const yy=y+43+i*20,pct=r.value/total;pdf.text(x+12,yy,r.label,8,false,palette.muted);pdf.rect(x+95,yy-8,w-145,7,[231,237,243]);pdf.rect(x+95,yy-8,(w-145)*pct,7,palette.blue);pdf.text(x+w-12,yy,`${(pct*100).toFixed(1)}%`,8,true,palette.text,'right');});}
  function fmtDate(v){try{return new Date(v).toLocaleString(es()?'es-EC':'en-US');}catch{return String(v||'-');}}
  function eventName(v){const s=String(v||'');if(es()){if(s.includes('uninstall'))return'Desinstalacion';if(s==='launch')return'Ejecucion';if(s.includes('failed'))return'Instalacion fallida';return'Instalacion';}if(s.includes('uninstall'))return'Uninstall';if(s==='launch')return'Launch';if(s.includes('failed'))return'Install failed';return'Install';}

  function buildPdf(data,isDemo){
    const tx=t(),pdf=new PDF(),range=periodInfo(),id=isDemo?'IL-TRK-DEMO0123456789ABCDEF0123':trackId();
    const installs=Number(data.installs||0),success=Number(data.successful||0),failed=Number(data.failed||0),uninstalls=Number(data.uninstalls||0),active=Number(data.active_installs||0),launches=Number(data.launches||0),rate=installs?`${((success/installs)*100).toFixed(1)}%`:'0%';
    pdf.rect(0,0,pdf.W,115,palette.navy);pdf.rect(0,112,pdf.W,3,palette.blue);pdf.text(46,43,tx.report,11,true,[125,194,255]);pdf.text(46,72,tx.subtitle,24,true,palette.white);pdf.text(46,94,isDemo?tx.demo:tx.live,9,true,isDemo?[255,213,145]:[132,235,200]);
    pdf.text(46,142,`${tx.track}: ${id}`,9,false,palette.muted);pdf.text(46,160,`${tx.period}: ${range.label}`,9,false,palette.muted);pdf.text(330,142,`${tx.generated}: ${new Date().toLocaleString(es()?'es-EC':'en-US')}`,9,false,palette.muted);
    let y=section(pdf,202,tx.summary);metric(pdf,46,y,155,tx.installs,installs,palette.blue);metric(pdf,220,y,155,tx.success,success,palette.green);metric(pdf,394,y,155,tx.failed,failed,palette.red);y+=76;metric(pdf,46,y,155,tx.uninstalls,uninstalls,palette.amber);metric(pdf,220,y,155,tx.active,active,palette.blue);metric(pdf,394,y,155,tx.launches,launches,palette.green);y+=88;pdf.rect(46,y,503,54,[244,249,253],palette.line);pdf.text(62,y+21,tx.rate,9,true,palette.muted);pdf.text(62,y+43,rate,20,true,palette.green);y+=83;distribution(pdf,46,y,155,tx.versions,data.versions);distribution(pdf,220,y,155,tx.windows,data.windows);distribution(pdf,394,y,155,tx.platform,data.platforms);
    pdf.page();pdf.rect(0,0,pdf.W,65,palette.navy);pdf.text(46,39,tx.recent,18,true,palette.white);const cols=[46,154,220,290,370,445],headers=[tx.date,tx.version,tx.package,tx.event,tx.result,tx.system];headers.forEach((h,i)=>pdf.text(cols[i],90,h,7,true,palette.muted));pdf.line(46,98,549,98,palette.line,1);let ry=116;const events=(Array.isArray(data.recent_events)?data.recent_events:[]).slice(0,14);for(const row of events){if(ry>520)break;const sys=row.system||{};const vals=[fmtDate(row.event_at),row.app_version||'-',row.package_type||'-',eventName(row.event_type),row.result||'-',[sys.windows_version,sys.architecture].filter(Boolean).join(' ')||'-'];vals.forEach((v,i)=>pdf.text(cols[i],ry,String(v).slice(0,i===0?18:22),7.5,false,palette.text));pdf.line(46,ry+9,549,ry+9,[235,240,244],.5);ry+=25;}
    let my=Math.max(ry+30,565);my=section(pdf,my,tx.methodology);my=pdf.wrap(46,my,tx.method,503,9,false,palette.muted,14);if(isDemo)my=pdf.wrap(46,my+6,tx.demoNote,503,9,true,palette.amber,14);my=section(pdf,my+20,tx.privacy);pdf.wrap(46,my,tx.privacyText,503,9,false,palette.muted,14);
    pdf.pages.forEach((page,i)=>{page.push(`${pdf.rgb(palette.line)} RG .5 w 46 36 m 549 36 l S`);page.push(`${pdf.rgb(palette.muted)} rg BT /F1 7 Tf 1 0 0 1 46 20 Tm (${escPdf(tx.footer)}) Tj ET`);page.push(`${pdf.rgb(palette.muted)} rg BT /F1 7 Tf 1 0 0 1 520 20 Tm (${i+1} / ${pdf.pages.length}) Tj ET`);});
    return pdf.blob();
  }

  async function generate(button){
    const tx=t(),isDemo=demoOn();if(!isDemo&&!trackId()){alert(tx.noData);return;}button.disabled=true;button.textContent=tx.generating;
    try{const data=isDemo?demoSummary():await fetchLive();if(!data)throw new Error('No data');const blob=buildPdf(data,isDemo);const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;const stamp=new Date().toISOString().slice(0,10);a.download=`InstallerLab_Analytics_${isDemo?'Demo':'Report'}_${stamp}.pdf`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);}catch(err){console.warn('[InstallerLab Analytics native PDF]',err);alert(tx.error);}finally{button.disabled=false;button.textContent=t().button;}
  }

  function ensureButton(){const bar=document.querySelector('.iax-appbar');if(!bar)return;let b=bar.querySelector('.iax-report-pdf');if(!b){b=document.createElement('button');b.type='button';b.className='iax-report-pdf';const demo=bar.querySelector('.iax-demo-toggle');if(demo)demo.insertAdjacentElement('afterend',b);else bar.appendChild(b);b.addEventListener('click',()=>generate(b));}b.textContent=t().button;}
  const root=document.getElementById('app');if(root)new MutationObserver(()=>requestAnimationFrame(ensureButton)).observe(root,{childList:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureButton,{once:true});else ensureButton();
})();
