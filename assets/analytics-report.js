(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const demoOn = () => { try { return sessionStorage.getItem('installerlab-analytics-demo') === '1'; } catch { return false; } };
  const q = new URLSearchParams(location.search);
  const trackId = () => q.get('trackId') || q.get('track') || '';
  const config = () => window.INSTALLERLAB_ANALYTICS_CONFIG || {};

  const tx = () => es() ? {
    button:'Informe PDF', generating:'Generando PDF...', title:'Informe de Analítica de Despliegue', subtitle:'InstallerLab Analytics',
    report:'INFORME ANALYTICS', demo:'DATOS DEMO', live:'DATOS EN VIVO', generated:'Generado', period:'Periodo', source:'Fuente', track:'TrackID', application:'Aplicación',
    summary:'Resumen ejecutivo', installs:'Instalaciones', success:'Correctas', failed:'Fallidas', uninstalls:'Desinstalaciones', active:'Instalaciones activas', launches:'Ejecuciones', rate:'Tasa de éxito',
    versions:'Adopción por versión', windows:'Distribución de Windows', platforms:'Arquitectura / plataforma', recent:'Actividad reciente',
    date:'Fecha', version:'Versión', package:'Paquete', event:'Evento', result:'Resultado', system:'Sistema',
    methodology:'Metodología y alcance', method1:'El informe resume los eventos de InstallerLab Analytics para el TrackID y periodo seleccionados.',
    method2:'TrackID identifica un flujo de analítica del proyecto; no representa una licencia, un usuario ni un equipo.',
    method3:'Los valores del modo DEMO son ficticios y se incluyen únicamente para explorar el funcionamiento del dashboard.',
    privacy:'Privacidad', privacyText:'InstallerLab Analytics está diseñado para trabajar con datos técnicos de despliegue. No requiere nombre, correo, HWID, Machine Code ni claves de licencia para generar estas estadísticas.',
    noData:'No hay datos suficientes para generar el informe. Conecta una aplicación mediante TrackID o activa el modo demo.',
    pdfMissing:'No se pudo cargar el generador PDF. Recarga la página e inténtalo nuevamente.',
    fetchError:'No se pudieron cargar los datos del backend para el informe.',
    footer:'InstallerLab Analytics - installerlab.website', connected:'Aplicación conectada', allTime:'Todo el historial'
  } : {
    button:'PDF Report', generating:'Generating PDF...', title:'Deployment Analytics Report', subtitle:'InstallerLab Analytics',
    report:'ANALYTICS REPORT', demo:'DEMO DATA', live:'LIVE DATA', generated:'Generated', period:'Period', source:'Source', track:'TrackID', application:'Application',
    summary:'Executive summary', installs:'Installs', success:'Successful', failed:'Failed', uninstalls:'Uninstalls', active:'Active installs', launches:'Launches', rate:'Success rate',
    versions:'Version adoption', windows:'Windows distribution', platforms:'Architecture / platform', recent:'Recent activity',
    date:'Date', version:'Version', package:'Package', event:'Event', result:'Result', system:'System',
    methodology:'Methodology & scope', method1:'This report summarizes InstallerLab Analytics events for the selected TrackID and period.',
    method2:'TrackID identifies a project analytics stream; it is not a license, user or device identifier.',
    method3:'DEMO mode values are fictional and are included only to demonstrate how the dashboard works.',
    privacy:'Privacy', privacyText:'InstallerLab Analytics is designed around technical deployment data. Names, email addresses, HWID, Machine Code and license keys are not required to produce these statistics.',
    noData:'There is not enough data to generate the report. Connect an application with a TrackID or enable demo mode.',
    pdfMissing:'The PDF generator could not be loaded. Reload the page and try again.',
    fetchError:'Backend data could not be loaded for the report.',
    footer:'InstallerLab Analytics - installerlab.website', connected:'Connected application', allTime:'All time'
  };

  function periodInfo() {
    const select = document.querySelector('.iax-filterbar select');
    const index = select?.selectedIndex || 0;
    const label = select?.selectedOptions?.[0]?.textContent?.trim() || (es() ? 'Últimos 7 días' : 'Last 7 days');
    if (index === 3) return { label, from:null };
    const days = index === 2 ? 90 : index === 1 ? 30 : 7;
    return { label, from:new Date(Date.now() - days * 86400000).toISOString() };
  }

  async function fetchLiveSummary() {
    const id = trackId();
    const cfg = config();
    if (!id || !cfg.url || !cfg.publishableKey) return null;
    const endpoint = String(cfg.url).replace(/\/$/, '') + '/rest/v1/rpc/analytics_summary';
    const range = periodInfo();
    const payload = { p_track_id:id, p_to:new Date().toISOString() };
    if (range.from) payload.p_from = range.from;
    const response = await fetch(endpoint, {
      method:'POST',
      headers:{ apikey:String(cfg.publishableKey), Authorization:`Bearer ${String(cfg.publishableKey)}`, 'Content-Type':'application/json' },
      body:JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`Supabase RPC ${response.status}`);
    return response.json();
  }

  function demoSummary() {
    const now = Date.now();
    const ev = (hours, version, pkg, type, result, win, arch) => ({
      event_at:new Date(now - hours*3600000).toISOString(), app_version:version, package_type:pkg, event_type:type, result,
      system:{windows_version:win, architecture:arch}
    });
    return {
      installs:1284, successful:1217, failed:43, uninstalls:24, active_installs:1046, launches:8932,
      versions:[{label:'v3.1.0',installs:873},{label:'v3.0.0',installs:295},{label:'v2.9',installs:90},{label:'Older',installs:26}],
      windows:[{label:'Windows 11',value:925},{label:'Windows 10',value:321},{label:'Windows Server',value:26},{label:'Other',value:12}],
      platforms:[{label:'x64',value:1168},{label:'ARM64',value:77},{label:'x86',value:39}],
      recent_events:[
        ev(1,'3.1.0','Bundle','install_completed','Successful','Windows 11','x64'),
        ev(3,'3.1.0','MSI','install_completed','Successful','Windows 11','x64'),
        ev(5,'3.1.0','Setup EXE','install_failed','Failed','Windows 10','x64'),
        ev(8,'3.0.0','MSI','uninstall_completed','Successful','Windows 11','x64'),
        ev(12,'3.1.0','Bundle','launch','Successful','Windows 11','ARM64')
      ]
    };
  }

  function normalizeDistribution(rows) {
    const list = Array.isArray(rows) ? rows : [];
    const normalized = list.map(r => ({ label:String(r.label || 'Unknown'), value:Number(r.value ?? r.installs ?? 0) }));
    const total = normalized.reduce((a,b)=>a+b.value,0) || 1;
    return normalized.slice(0,6).map(r => ({...r, pct:(r.value/total)*100}));
  }

  function fmtDate(value) {
    if (!value) return '-';
    try { return new Date(value).toLocaleString(es() ? 'es-EC' : 'en-US'); } catch { return String(value); }
  }

  function eventLabel(type) {
    const s = String(type || '');
    if (es()) {
      if (s.includes('uninstall')) return 'Desinstalación';
      if (s === 'launch') return 'Ejecución';
      if (s.includes('failed')) return 'Instalación fallida';
      return 'Instalación';
    }
    if (s.includes('uninstall')) return 'Uninstall';
    if (s === 'launch') return 'Launch';
    if (s.includes('failed')) return 'Install failed';
    return 'Install';
  }

  function color(doc, kind='text') {
    const c = {
      navy:[10,31,55], blue:[48,131,220], cyan:[78,170,242], text:[29,46,64], muted:[100,116,133], line:[221,228,235],
      green:[31,157,119], red:[204,73,73], amber:[196,133,35], paper:[247,250,253], white:[255,255,255]
    }[kind] || [29,46,64];
    doc.setTextColor(...c);
    return c;
  }

  function metricCard(doc, x, y, w, label, value, kind='blue') {
    const bg = kind === 'green' ? [236,249,244] : kind === 'red' ? [253,239,239] : kind === 'amber' ? [253,247,235] : [239,247,255];
    const accent = kind === 'green' ? [31,157,119] : kind === 'red' ? [204,73,73] : kind === 'amber' ? [196,133,35] : [48,131,220];
    doc.setFillColor(...bg); doc.roundedRect(x,y,w,25,3,3,'F');
    doc.setFillColor(...accent); doc.roundedRect(x,y,2.2,25,1,1,'F');
    doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(96,113,131); doc.text(label,x+7,y+8);
    doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.setTextColor(...accent); doc.text(String(value),x+7,y+19);
  }

  function sectionTitle(doc, y, title) {
    doc.setFont('helvetica','bold'); doc.setFontSize(14); doc.setTextColor(10,31,55); doc.text(title,16,y);
    doc.setDrawColor(78,170,242); doc.setLineWidth(.8); doc.line(16,y+3,55,y+3);
    return y+11;
  }

  function drawDistribution(doc, x, y, w, title, rows) {
    doc.setFillColor(250,252,254); doc.setDrawColor(225,232,239); doc.roundedRect(x,y,w,58,3,3,'FD');
    doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(35,53,72); doc.text(title,x+6,y+8);
    const data = normalizeDistribution(rows);
    data.slice(0,4).forEach((r,i)=>{
      const yy = y+16+i*9;
      doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(78,95,112); doc.text(r.label,x+6,yy);
      doc.setFillColor(232,238,244); doc.roundedRect(x+39,yy-3.2,w-57,3.4,1.5,1.5,'F');
      doc.setFillColor(48,131,220); doc.roundedRect(x+39,yy-3.2,(w-57)*Math.max(.02,r.pct/100),3.4,1.5,1.5,'F');
      doc.setFont('helvetica','bold'); doc.setTextColor(56,74,91); doc.text(`${r.pct.toFixed(1)}%`,x+w-16,yy,{align:'right'});
    });
  }

  async function loadLogo() {
    try {
      const response = await fetch('../assets/icon.png', {cache:'force-cache'});
      if (!response.ok) return null;
      const blob = await response.blob();
      return await new Promise(resolve => { const reader = new FileReader(); reader.onload=()=>resolve(reader.result); reader.onerror=()=>resolve(null); reader.readAsDataURL(blob); });
    } catch { return null; }
  }

  function addFooter(doc, page, total, t) {
    const h = doc.internal.pageSize.getHeight(), w = doc.internal.pageSize.getWidth();
    doc.setDrawColor(225,232,239); doc.setLineWidth(.3); doc.line(16,h-13,w-16,h-13);
    doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(112,128,144); doc.text(t.footer,16,h-8);
    doc.text(`${page} / ${total}`,w-16,h-8,{align:'right'});
  }

  async function generateReport() {
    const t = tx();
    if (!window.jspdf?.jsPDF) { alert(t.pdfMissing); return; }
    const isDemo = demoOn();
    if (!isDemo && !trackId()) { alert(t.noData); return; }

    const button = document.querySelector('.iax-report-pdf');
    if (button) { button.disabled=true; button.textContent=t.generating; }

    try {
      let data;
      try { data = isDemo ? demoSummary() : await fetchLiveSummary(); }
      catch (err) { console.warn('[InstallerLab Analytics PDF]',err); alert(t.fetchError); return; }
      if (!data) { alert(t.noData); return; }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true});
      const logo = await loadLogo();
      const range = periodInfo();
      const appName = isDemo ? 'InstallerLab Demo App' : t.connected;
      const id = isDemo ? 'IL-TRK-DEMO0123456789ABCDEF0123' : trackId();
      const generated = new Date().toLocaleString(es() ? 'es-EC' : 'en-US');
      const installs = Number(data.installs || 0), successful=Number(data.successful || 0), failed=Number(data.failed || 0), uninstalls=Number(data.uninstalls || 0), active=Number(data.active_installs || 0), launches=Number(data.launches || 0);
      const rate = installs ? `${((successful/installs)*100).toFixed(1)}%` : '0%';

      // Cover / executive summary
      doc.setFillColor(10,31,55); doc.rect(0,0,210,53,'F');
      doc.setFillColor(48,131,220); doc.rect(0,51,210,2,'F');
      if (logo) { try { doc.addImage(logo,'PNG',16,12,25,25); } catch {} }
      doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(125,194,255); doc.text(t.report,49,17);
      doc.setFontSize(23); doc.setTextColor(255,255,255); doc.text(t.title,49,28);
      doc.setFont('helvetica','normal'); doc.setFontSize(10); doc.setTextColor(198,218,237); doc.text(t.subtitle,49,36);
      doc.setFillColor(isDemo?196:31,isDemo?133:157,isDemo?35:119); doc.roundedRect(163,14,31,9,2,2,'F');
      doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(255,255,255); doc.text(isDemo?t.demo:t.live,178.5,20,{align:'center'});

      doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(92,109,126);
      doc.text(`${t.application}: ${appName}`,16,65); doc.text(`${t.track}: ${id}`,16,72);
      doc.text(`${t.period}: ${range.label}`,110,65); doc.text(`${t.generated}: ${generated}`,110,72);

      let y = sectionTitle(doc,88,t.summary);
      metricCard(doc,16,y,55,t.installs,installs,'blue'); metricCard(doc,77,y,55,t.success,successful,'green'); metricCard(doc,138,y,55,t.failed,failed,'red');
      y += 31;
      metricCard(doc,16,y,55,t.uninstalls,uninstalls,'amber'); metricCard(doc,77,y,55,t.active,active,'blue'); metricCard(doc,138,y,55,t.launches,launches,'green');
      y += 36;
      doc.setFillColor(247,250,253); doc.setDrawColor(224,232,239); doc.roundedRect(16,y,177,24,3,3,'FD');
      doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor(61,80,99); doc.text(t.rate,23,y+8);
      doc.setFontSize(18); doc.setTextColor(31,157,119); doc.text(rate,23,y+19);
      doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(105,121,137);
      const insight = es() ? `De ${installs} instalaciones registradas, ${successful} finalizaron correctamente y ${failed} reportaron fallo.` : `Of ${installs} recorded installs, ${successful} completed successfully and ${failed} reported a failure.`;
      const wrapped = doc.splitTextToSize(insight,118); doc.text(wrapped,66,y+10);

      y += 34;
      y = sectionTitle(doc,y,t.versions);
      drawDistribution(doc,16,y,55,t.versions,data.versions); drawDistribution(doc,77,y,55,t.windows,data.windows); drawDistribution(doc,138,y,55,t.platforms,data.platforms);

      // Activity page
      doc.addPage();
      doc.setFillColor(10,31,55); doc.rect(0,0,210,20,'F');
      doc.setFont('helvetica','bold'); doc.setFontSize(13); doc.setTextColor(255,255,255); doc.text(t.recent,16,13);
      doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(110,126,142); doc.text(`${t.track}: ${id}`,16,29); doc.text(`${t.period}: ${range.label}`,110,29);
      const rows = (Array.isArray(data.recent_events)?data.recent_events:[]).slice(0,35).map(r=>{
        const sys = r.system || {};
        return [fmtDate(r.event_at), r.app_version||'-', r.package_type||'-', eventLabel(r.event_type), r.result||'-', [sys.windows_version,sys.architecture].filter(Boolean).join(' ')||'-'];
      });
      if (doc.autoTable) {
        doc.autoTable({
          startY:36,
          head:[[t.date,t.version,t.package,t.event,t.result,t.system]],
          body:rows.length?rows:[[t.noData,'-','-','-','-','-']],
          theme:'grid',
          styles:{font:'helvetica',fontSize:7.2,cellPadding:2.4,textColor:[54,70,86],lineColor:[224,231,238],lineWidth:.15},
          headStyles:{fillColor:[18,50,84],textColor:[255,255,255],fontStyle:'bold'},
          alternateRowStyles:{fillColor:[248,250,252]},
          margin:{left:16,right:16,bottom:20},
          columnStyles:{0:{cellWidth:31},1:{cellWidth:18},2:{cellWidth:22},3:{cellWidth:28},4:{cellWidth:24},5:{cellWidth:44}}
        });
      }

      // Methodology / privacy page
      doc.addPage();
      doc.setFillColor(10,31,55); doc.rect(0,0,210,20,'F');
      doc.setFont('helvetica','bold'); doc.setFontSize(13); doc.setTextColor(255,255,255); doc.text(t.methodology,16,13);
      let my=34;
      const bullets=[t.method1,t.method2]; if(isDemo) bullets.push(t.method3);
      bullets.forEach((line,i)=>{
        doc.setFillColor(48,131,220); doc.circle(19,my-1.8,1.3,'F');
        doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(61,79,97); const w=doc.splitTextToSize(line,166); doc.text(w,24,my); my += w.length*5.2+7;
      });
      my += 5;
      my = sectionTitle(doc,my,t.privacy);
      doc.setFillColor(247,250,253); doc.setDrawColor(224,232,239); doc.roundedRect(16,my,177,43,3,3,'FD');
      doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(67,85,103); doc.text(doc.splitTextToSize(t.privacyText,162),23,my+11);
      doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(48,131,220); doc.text('installerlab.website/analytics/',23,my+34);

      const total = doc.getNumberOfPages();
      for(let p=1;p<=total;p++){ doc.setPage(p); addFooter(doc,p,total,t); }

      const safe = (appName || 'Application').replace(/[^A-Za-z0-9_-]+/g,'_').replace(/^_+|_+$/g,'').slice(0,45) || 'Application';
      const stamp = new Date().toISOString().slice(0,10);
      doc.save(`InstallerLab_Analytics_${safe}_${stamp}.pdf`);
    } finally {
      if (button) { button.disabled=false; button.textContent=tx().button; }
    }
  }

  function ensureButton() {
    const bar = document.querySelector('.iax-appbar');
    if (!bar) return;
    let btn = bar.querySelector('.iax-report-pdf');
    if (!btn) {
      btn = document.createElement('button');
      btn.type='button'; btn.className='iax-report-pdf';
      const demo = bar.querySelector('.iax-demo-toggle');
      if (demo) demo.insertAdjacentElement('afterend',btn); else bar.appendChild(btn);
      btn.addEventListener('click',generateReport);
    }
    btn.textContent = tx().button;
  }

  const observer = new MutationObserver(()=>requestAnimationFrame(ensureButton));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',ensureButton); else ensureButton();
})();
