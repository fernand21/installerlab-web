(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const demoOn = () => { try { return sessionStorage.getItem('installerlab-analytics-demo') === '1'; } catch { return false; } };
  const clean = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x20-\x7E]/g, ' ');
  const esc = value => clean(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

  const tx = () => es() ? {
    button:'Informe PDF', generating:'Generando...', title:'INFORME DE ANALITICA', subtitle:'InstallerLab Analytics',
    generated:'Generado', source:'Fuente', live:'Datos en vivo', demo:'Datos demo', disconnected:'Sin conexion', track:'TrackID', application:'Aplicacion',
    period:'Periodo', view:'Vista', filters:'Filtros', metrics:'Resumen', distributions:'Distribuciones', detail:'Detalle', privacy:'Privacidad',
    privacyText:'InstallerLab Analytics utiliza datos tecnicos de despliegue. TrackID identifica el flujo de analitica del proyecto y no una licencia, usuario o equipo.',
    noData:'No hay datos visibles para incluir en el informe.', footer:'InstallerLab Analytics - installerlab.website'
  } : {
    button:'PDF Report', generating:'Generating...', title:'ANALYTICS REPORT', subtitle:'InstallerLab Analytics',
    generated:'Generated', source:'Source', live:'Live data', demo:'Demo data', disconnected:'Not connected', track:'TrackID', application:'Application',
    period:'Period', view:'View', filters:'Filters', metrics:'Summary', distributions:'Distributions', detail:'Detail', privacy:'Privacy',
    privacyText:'InstallerLab Analytics uses technical deployment data. TrackID identifies the project analytics stream, not a license, user or device.',
    noData:'There is no visible data to include in the report.', footer:'InstallerLab Analytics - installerlab.website'
  };

  function snapshot() {
    const q = new URLSearchParams(location.search);
    const track = q.get('trackId') || q.get('track') || '';
    const appName = document.querySelector('.iax-picker span')?.textContent?.trim() || (es() ? 'Aplicacion' : 'Application');
    const viewTitle = document.querySelector('.iax-view-head h1')?.textContent?.trim() || '';
    const source = demoOn() ? tx().demo : document.querySelector('.iax-app')?.classList.contains('live-connected') ? tx().live : tx().disconnected;
    const selects = [...document.querySelectorAll('.iax-filterbar select')];
    const filterLabels = [...document.querySelectorAll('.iax-filterbar label')].map(x => x.textContent.trim());
    const filters = selects.map((s,i) => ({label:filterLabels[i] || `Filter ${i+1}`, value:s.selectedOptions?.[0]?.textContent?.trim() || ''}));
    const metrics = [...document.querySelectorAll('.iax-view .iax-kpi')].map(card => ({
      label:card.querySelector('span')?.textContent?.trim() || '',
      value:card.querySelector('strong')?.textContent?.trim() || '-'
    })).filter(x => x.label);
    const distributions = [...document.querySelectorAll('.iax-view .iax-bars')].map(bars => {
      const widget = bars.closest('.iax-widget');
      return {
        title:widget?.querySelector('.iax-widget-head h3')?.textContent?.trim() || '',
        rows:[...bars.querySelectorAll('.iax-bar-row')].map(row => ({
          label:row.querySelector('span')?.textContent?.trim() || '-',
          value:row.querySelector('em')?.textContent?.trim() || '-'
        })).filter(x => x.label !== '-' || x.value !== '-')
      };
    }).filter(x => x.rows.length);
    const table = document.querySelector('.iax-view .iax-table');
    const headers = table ? [...table.querySelectorAll('thead th')].map(x => x.textContent.trim()) : [];
    const rows = table ? [...table.querySelectorAll('tbody tr')].map(tr => [...tr.querySelectorAll('td')].map(td => td.textContent.trim())).filter(r => r.length > 1).slice(0,24) : [];
    return {track,appName,viewTitle,source,filters,metrics,distributions,headers,rows};
  }

  class Pdf {
    constructor(){this.W=595.28;this.H=841.89;this.pages=[[]];}
    get p(){return this.pages[this.pages.length-1];}
    page(){this.pages.push([]);return this;}
    rgb(c){return c.map(v=>(v/255).toFixed(3)).join(' ');}
    rect(x,y,w,h,fill,stroke=null){const yy=this.H-y-h;if(fill)this.p.push(`${this.rgb(fill)} rg`);if(stroke)this.p.push(`${this.rgb(stroke)} RG`);this.p.push(`${x.toFixed(2)} ${yy.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${fill&&stroke?'B':fill?'f':'S'}`);return this;}
    line(x1,y1,x2,y2,color=[220,228,236],width=.7){this.p.push(`${this.rgb(color)} RG ${width} w ${x1.toFixed(2)} ${(this.H-y1).toFixed(2)} m ${x2.toFixed(2)} ${(this.H-y2).toFixed(2)} l S`);return this;}
    text(x,y,s,size=10,bold=false,color=[30,48,66],align='left'){s=esc(s);const approx=s.length*size*.50;let xx=x;if(align==='right')xx=x-approx;if(align==='center')xx=x-approx/2;this.p.push(`${this.rgb(color)} rg BT /${bold?'F2':'F1'} ${size} Tf 1 0 0 1 ${xx.toFixed(2)} ${(this.H-y).toFixed(2)} Tm (${s}) Tj ET`);return this;}
    wrap(x,y,s,maxWidth,size=9,bold=false,color=[80,98,116],lh=13){const words=clean(s).split(/\s+/);const max=Math.max(12,Math.floor(maxWidth/(size*.5)));let line='',yy=y;for(const word of words){const next=line?`${line} ${word}`:word;if(next.length>max&&line){this.text(x,yy,line,size,bold,color);yy+=lh;line=word;}else line=next;}if(line)this.text(x,yy,line,size,bold,color);return yy+lh;}
    blob(){
      const objs=[];const add=s=>{objs.push(s);return objs.length;};
      add('<< /Type /Catalog /Pages 2 0 R >>');add('');
      const f1=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
      const f2=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
      const kids=[];
      for(const cmds of this.pages){const stream=cmds.join('\n');const content=add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);const page=add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${this.W} ${this.H}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> /Contents ${content} 0 R >>`);kids.push(`${page} 0 R`);}
      objs[1]=`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${kids.length} >>`;
      let out='%PDF-1.4\n';const offsets=[0];
      for(let i=0;i<objs.length;i++){offsets.push(out.length);out+=`${i+1} 0 obj\n${objs[i]}\nendobj\n`;}
      const xref=out.length;out+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n`;
      for(let i=1;i<offsets.length;i++)out+=`${String(offsets[i]).padStart(10,'0')} 00000 n \n`;
      out+=`trailer\n<< /Size ${objs.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
      return new Blob([out],{type:'application/pdf'});
    }
  }

  const C={navy:[10,31,55],blue:[48,131,220],green:[31,157,119],red:[204,73,73],amber:[196,133,35],text:[31,48,66],muted:[93,111,129],line:[222,229,236],paper:[247,250,253],white:[255,255,255]};
  function section(pdf,y,title){pdf.text(46,y,title,13,true,C.navy);pdf.line(46,y+7,160,y+7,C.blue,1.5);return y+24;}

  function build(data){
    const t=tx(),pdf=new Pdf();
    pdf.rect(0,0,pdf.W,105,C.navy);pdf.rect(0,102,pdf.W,3,C.blue);
    pdf.text(46,42,t.title,12,true,[125,194,255]);pdf.text(46,72,t.subtitle,24,true,C.white);pdf.text(46,92,data.source,9,true,demoOn()?[255,210,135]:C.green);
    pdf.text(46,134,`${t.application}: ${data.appName}`,9,false,C.muted);pdf.text(46,151,`${t.track}: ${data.track || '-'}`,9,false,C.muted);
    pdf.text(320,134,`${t.generated}: ${new Date().toLocaleString(es()?'es-EC':'en-US')}`,8.5,false,C.muted);pdf.text(320,151,`${t.view}: ${data.viewTitle || '-'}`,8.5,false,C.muted);
    let y=184;
    y=section(pdf,y,t.filters);
    data.filters.forEach((f,i)=>{const x=46+(i%2)*255, yy=y+Math.floor(i/2)*26;pdf.text(x,yy,f.label,7.5,true,C.muted);pdf.text(x,yy+13,f.value,9,false,C.text);});
    y+=Math.ceil(Math.max(1,data.filters.length)/2)*26+18;
    y=section(pdf,y,t.metrics);
    const metrics=data.metrics.length?data.metrics:[{label:t.noData,value:'-'}];
    metrics.slice(0,9).forEach((m,i)=>{const col=i%3,row=Math.floor(i/3),x=46+col*170,yy=y+row*64;pdf.rect(x,yy,155,50,C.paper,C.line);pdf.text(x+10,yy+17,m.label,7.5,true,C.muted);pdf.text(x+10,yy+38,m.value,17,true,m.value==='-'?C.muted:C.blue);});
    y+=Math.ceil(metrics.slice(0,9).length/3)*64+15;
    if(data.distributions.length && y<650){y=section(pdf,y,t.distributions);data.distributions.slice(0,3).forEach((d,i)=>{const x=46+i*170;pdf.rect(x,y,155,92,C.paper,C.line);pdf.text(x+9,y+16,d.title||t.distributions,8.5,true,C.text);d.rows.slice(0,4).forEach((r,j)=>{pdf.text(x+9,y+35+j*13,String(r.label).slice(0,18),7.5,false,C.muted);pdf.text(x+145,y+35+j*13,String(r.value),7.5,true,C.text,'right');});});y+=110;}
    if(data.rows.length){pdf.page();pdf.rect(0,0,pdf.W,64,C.navy);pdf.text(46,39,t.detail,18,true,C.white);let yy=88;const heads=data.headers.slice(0,6);const widths=[105,65,80,80,75,95];let x=46;heads.forEach((h,i)=>{pdf.text(x,yy,String(h).slice(0,15),7,true,C.muted);x+=widths[i]||70;});pdf.line(46,yy+8,549,yy+8,C.line);yy+=24;for(const row of data.rows.slice(0,22)){x=46;row.slice(0,6).forEach((v,i)=>{pdf.text(x,yy,String(v).slice(0,i===0?20:18),7.2,false,C.text);x+=widths[i]||70;});pdf.line(46,yy+8,549,yy+8,[236,240,244],.45);yy+=25;if(yy>710)break;}}
    let page=pdf.pages.length-1;pdf.pages.forEach((commands,i)=>{commands.push(`${pdf.rgb(C.line)} RG .5 w 46 36 m 549 36 l S`);commands.push(`${pdf.rgb(C.muted)} rg BT /F1 7 Tf 1 0 0 1 46 20 Tm (${esc(t.footer)}) Tj ET`);commands.push(`${pdf.rgb(C.muted)} rg BT /F1 7 Tf 1 0 0 1 520 20 Tm (${i+1} / ${pdf.pages.length}) Tj ET`);});
    if(page===0){y=Math.min(y,700);y=section(pdf,y,t.privacy);pdf.wrap(46,y,t.privacyText,503,8.5,false,C.muted,13);}
    return pdf.blob();
  }

  function downloadReport(button){
    const t=tx();
    button.disabled=true;button.textContent=t.generating;
    try{
      const data=snapshot();
      const blob=build(data);
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url;a.download=`InstallerLab_Analytics_${new Date().toISOString().slice(0,10)}.pdf`;
      document.body.appendChild(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),5000);
    }catch(error){console.warn('[InstallerLab Analytics PDF]',error);alert(t.noData);}
    finally{button.disabled=false;button.textContent=t.button;}
  }

  function ensureButton(){
    const bar=document.querySelector('.iax-appbar');if(!bar)return false;
    let b=bar.querySelector('.iax-report-pdf');
    if(!b){b=document.createElement('button');b.type='button';b.className='iax-report-pdf';const demo=bar.querySelector('.iax-demo-toggle');if(demo)demo.insertAdjacentElement('afterend',b);else bar.appendChild(b);b.addEventListener('click',()=>downloadReport(b));}
    b.textContent=tx().button;return true;
  }

  let tries=0;
  const timer=setInterval(()=>{tries++;if(ensureButton()||tries>20)clearInterval(timer);},100);
  if(document.readyState!=='loading')ensureButton();else document.addEventListener('DOMContentLoaded',ensureButton,{once:true});
})();
