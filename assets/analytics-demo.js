(() => {
  let applying = false;
  const isES = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const demoOn = () => { try { return sessionStorage.getItem('installerlab-analytics-demo') === '1'; } catch { return false; } };
  const setDemo = on => { try { sessionStorage.setItem('installerlab-analytics-demo', on ? '1' : '0'); } catch {} location.reload(); };

  const text = es => es ? {
    run:'▶ Ejecutar demo', exit:'■ Salir del demo', app:'InstallerLab Demo App', backend:'Modo demo activo',
    banner:'DATOS DEMO', bannerText:'Estás viendo datos ficticios para explorar el dashboard. No representan instalaciones reales ni se guardan en el backend.',
    ok:'Correcta', fail:'Fallida', uninstall:'Desinstalación', install:'Instalación', today:'Hoy', active:'Activo', enabled:'Habilitado',
    sampleTrack:'IL-TRK-DEMO0123456789ABCDEF0123'
  } : {
    run:'▶ Run demo', exit:'■ Exit demo', app:'InstallerLab Demo App', backend:'Demo mode active',
    banner:'DEMO DATA', bannerText:'You are viewing fictional data to explore the dashboard. It does not represent real installations and is not stored in the backend.',
    ok:'Successful', fail:'Failed', uninstall:'Uninstall', install:'Install', today:'Today', active:'Active', enabled:'Enabled',
    sampleTrack:'IL-TRK-DEMO0123456789ABCDEF0123'
  };

  const viewMetrics = {
    overview:['1,284','1,217','43','24','1,046','8,932'],
    activity:['1,284','1,217','43','24','24'],
    users:['1,046','312','987','59','1,046'],
    requirements:['38','12','50'],
    errors:['43','3.35%','12'],
    uninstall:['24','9'],
    launch:['1,046','8,932','8.5','Today']
  };

  const distSets = {
    default:[['v3.1.0','68%'],['v3.0.0','23%'],['v2.9','7%'],['Older','2%']],
    os:[['Windows 11','72%'],['Windows 10','25%'],['Windows Server','2%'],['Other','1%']],
    arch:[['x64','91%'],['ARM64','6%'],['x86','3%'],['Other','0%']],
    errors:[['0x80070643','31%'],['1603','26%'],['Access denied','18%'],['Other','25%']],
    reasons:[['No longer needed','42%'],['Testing complete','24%'],['Upgrade / reinstall','19%'],['Other','15%']]
  };

  function ensureControls(){
    const app = document.querySelector('.iax-app');
    const bar = document.querySelector('.iax-appbar');
    if(!app || !bar) return false;
    const t = text(isES());
    let btn = bar.querySelector('.iax-demo-toggle');
    if(!btn){
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'iax-demo-toggle';
      bar.appendChild(btn);
      btn.addEventListener('click', () => setDemo(!demoOn()));
    }
    btn.textContent = demoOn() ? t.exit : t.run;
    btn.classList.toggle('active', demoOn());

    const workspace = document.querySelector('.iax-workspace');
    if(workspace && !workspace.querySelector('.iax-demo-banner')){
      const banner = document.createElement('div');
      banner.className = 'iax-demo-banner';
      banner.innerHTML = `<strong>${t.banner}</strong><span>${t.bannerText}</span>`;
      const connect = workspace.querySelector('.iax-connect-banner');
      workspace.insertBefore(banner, connect || workspace.firstChild);
    }
    return true;
  }

  function setKpis(view){
    const values = viewMetrics[view] || [];
    document.querySelectorAll('.iax-view .iax-kpi strong').forEach((el,i)=>{
      if(values[i] !== undefined){ el.textContent = values[i]; el.classList.add('iax-demo-value'); }
    });
  }

  function setBars(view){
    const widgets = [...document.querySelectorAll('.iax-view .iax-bars')];
    widgets.forEach((bars,wi)=>{
      let set = distSets.default;
      if(view==='overview' && wi===1) set=distSets.os;
      if(view==='overview' && wi===2) set=distSets.arch;
      if(view==='errors') set=distSets.errors;
      if(view==='uninstall') set=distSets.reasons;
      [...bars.querySelectorAll('.iax-bar-row')].forEach((row,i)=>{
        if(!set[i]) return;
        const span=row.querySelector('span'), em=row.querySelector('em'), b=row.querySelector('b');
        if(span) span.textContent=set[i][0];
        if(em) em.textContent=set[i][1];
        if(b) b.style.width=set[i][1];
      });
    });
  }

  function rowsFor(view, es){
    const t=text(es);
    if(view==='overview') return [
      ['12 Sep 20:42','3.1.0','Bundle',t.install,t.ok,'Windows 11 x64'],
      ['12 Sep 19:18','3.1.0','MSI',t.install,t.ok,'Windows 11 x64'],
      ['12 Sep 18:55','3.1.0','Setup EXE',t.install,t.fail,'Windows 10 x64'],
      ['12 Sep 17:31','3.0.0','MSI',t.uninstall,t.ok,'Windows 11 x64']
    ];
    if(view==='activity') return [
      ['12 Sep 20:42','3.1.0','Bundle',t.ok,'00:31','x64','Windows 11','en-US'],
      ['12 Sep 19:18','3.1.0','MSI',t.ok,'00:18','x64','Windows 11','es-EC'],
      ['12 Sep 18:55','3.1.0','Setup EXE',t.fail,'00:09','x64','Windows 10','en-US'],
      ['12 Sep 15:04','3.0.0','MSI',t.ok,'00:22','ARM64','Windows 11','en-US']
    ];
    if(view==='requirements') return [
      ['.NET Desktop Runtime','8.0','21','12 Sep 18:55'],['WebView2 Runtime','Evergreen','11','12 Sep 13:20'],['Disk space','500 MB','6','11 Sep 22:08']
    ];
    if(view==='errors') return [
      ['0x80070643','MSI install','3.1.0','Bundle','13','12 Sep 18:55'],['1603','Finalize','3.1.0','MSI','11','12 Sep 14:08'],['5','File copy','3.0.0','Setup EXE','8','11 Sep 21:15']
    ];
    if(view==='versions') return [
      ['3.1.0','873','711','184','21','12 Sep 20:42'],['3.0.0','295','241','96','15','12 Sep 17:31'],['2.9','90','71','32','5','10 Sep 08:44']
    ];
    return [];
  }

  function setTable(view){
    const table=document.querySelector('.iax-view .iax-table');
    if(!table) return;
    const rows=rowsFor(view,isES()); if(!rows.length) return;
    const tbody=table.querySelector('tbody'); if(!tbody) return;
    tbody.innerHTML=rows.map(r=>`<tr>${r.map((c,i)=>`<td>${i===4 && (String(c).includes('Successful')||String(c).includes('Correcta'))?`<span class="iax-demo-chip">${c}</span>`:c}</td>`).join('')}</tr>`).join('');
  }

  function setEnvironment(){
    const vals=['Windows 11 · 72%','x64 · 91%','16 GB · 44%','Intel / AMD · 83%','1920×1080 · 61%','MSI 5.0 · 96%','en-US · 48%','125% · 37%'];
    document.querySelectorAll('.iax-view[data-view="environment"] .iax-feature>span').forEach((el,i)=>{el.textContent=vals[i]||'—';el.classList.add('iax-demo-value');});
  }

  function setProperties(){
    const vals=['3 values','6 options','12 values','8 products','5 features','3 types'];
    document.querySelectorAll('.iax-view[data-view="properties"] .iax-feature>span').forEach((el,i)=>{el.textContent=vals[i]||'—';el.classList.add('iax-demo-value');});
  }

  function setSettings(t){
    const view=document.querySelector('.iax-view[data-view="settings"]'); if(!view)return;
    const readonly=[...view.querySelectorAll('.iax-readonly')];
    if(readonly[0]) readonly[0].textContent=t.app;
    if(readonly[1]) readonly[1].textContent=t.sampleTrack;
    if(readonly[2]) readonly[2].textContent=t.active;
    view.querySelectorAll('.iax-setting-row b').forEach(el=>{el.textContent=t.enabled;el.classList.add('iax-demo-value');});
  }

  function applyDemo(){
    if(applying) return;
    applying=true;
    try{
      if(!ensureControls()) return;
      const app=document.querySelector('.iax-app');
      const on=demoOn(); app.classList.toggle('demo-mode',on);
      if(!on) return;
      const t=text(isES());
      const picker=document.querySelector('.iax-picker span'); if(picker) picker.textContent=t.app;
      const backend=document.querySelector('.iax-backend'); if(backend) backend.innerHTML=`<i></i>${t.backend}`;
      const sideSmall=document.querySelector('.iax-side-status small'); if(sideSmall) sideSmall.textContent=t.backend;
      const view=document.querySelector('.iax-view')?.dataset?.view || 'overview';
      setKpis(view); setBars(view); setTable(view); setEnvironment(); setProperties(); setSettings(t);
      document.querySelectorAll('.iax-live-pill').forEach(x=>x.textContent=t.banner);
    } finally { applying=false; }
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(applyDemo));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',applyDemo); else applyDemo();
  window.addEventListener('storage',applyDemo);
})();
