(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const DEMO_KEY = 'installerlab-analytics-demo';
  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const demoOn = () => { try { return sessionStorage.getItem(DEMO_KEY) === '1'; } catch { return false; } };
  const setDemo = on => { try { sessionStorage.setItem(DEMO_KEY, on ? '1' : '0'); } catch {} location.reload(); };

  const copy = () => es() ? {
    run:'▶ Ejecutar demo',
    exit:'■ Salir del demo',
    app:'InstallerLab Demo App',
    backend:'Modo demo activo'
  } : {
    run:'▶ Run demo',
    exit:'■ Exit demo',
    app:'InstallerLab Demo App',
    backend:'Demo mode active'
  };

  function demoSummary() {
    const now = new Date().toISOString();
    const events = [
      {event_at:now,event_type:'install_succeeded',app_version:'3.5.0',package_type:'Setup EXE',architecture:'x64',windows_version:'Windows 11',language:'en-US',result:'success',install_id:'DEMO-1'},
      {event_at:now,event_type:'install_succeeded',app_version:'3.5.0',package_type:'MSI',architecture:'x64',windows_version:'Windows 11',language:'es-EC',result:'success',install_id:'DEMO-2'},
      {event_at:now,event_type:'install_failed',app_version:'3.5.0',package_type:'Setup EXE',architecture:'x64',windows_version:'Windows 10',language:'en-US',result:'failed',error_code:'1603',install_id:'DEMO-3'},
      {event_at:now,event_type:'launch',app_version:'3.5.0',package_type:'Setup EXE',architecture:'x64',windows_version:'Windows 11',language:'en-US',result:'success',install_id:'DEMO-1'}
    ];
    return {
      ok:true,
      storage_mode:'demo',
      event_count:events.length,
      installs:3,
      started:3,
      successful:2,
      failed:1,
      cancelled:0,
      uninstalls:0,
      launches:1,
      active_installs:2,
      unique_installs:3,
      unique_users:3,
      success_rate:66.67,
      avg_install_duration_ms:24000,
      versions:[{label:'3.5.0',value:4}],
      platforms:[{label:'x64',value:4}],
      architectures:[{label:'x64',value:4}],
      windows:[{label:'Windows 11',value:3},{label:'Windows 10',value:1}],
      packages:[{label:'Setup EXE',value:3},{label:'MSI',value:1}],
      languages:[{label:'en-US',value:3},{label:'es-EC',value:1}],
      errors:[{label:'1603',value:1}],
      recent_events:events,
      events,
      daily:[]
    };
  }

  function publishDemo() {
    if (!demoOn()) return;
    const data = demoSummary();
    window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY = data;
    window.INSTALLERLAB_ANALYTICS_TRACK_ID = 'IL-TRK-DEMO0123456789ABCDEF0123';
    window.dispatchEvent(new CustomEvent('installerlab:analytics-summary', {
      detail:{data,trackId:window.INSTALLERLAB_ANALYTICS_TRACK_ID}
    }));
  }

  function ensureDemoControls() {
    const bar = document.querySelector('.iax-appbar');
    if (!bar) return;
    const c = copy();
    let btn = bar.querySelector('.iax-demo-toggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'iax-demo-toggle';
      btn.addEventListener('click', () => setDemo(!demoOn()));
      bar.appendChild(btn);
    }
    btn.textContent = demoOn() ? c.exit : c.run;
    btn.classList.toggle('active', demoOn());

    if (demoOn()) {
      const picker = document.querySelector('.iax-picker span');
      if (picker) picker.textContent = c.app;
      const backend = document.querySelector('.iax-backend');
      if (backend) backend.innerHTML = `<i></i>${c.backend}`;
      const side = document.querySelector('.iax-side-status small');
      if (side) side.textContent = c.backend;
      document.querySelector('.iax-app')?.classList.add('demo-mode');
      publishDemo();
    }
  }

  document.addEventListener('click', event => {
    if (demoOn() && event.target.closest('.iax-sidebar nav button')) {
      setTimeout(publishDemo, 0);
    }
  });

  const start = () => requestAnimationFrame(() => {
    ensureDemoControls();
    publishDemo();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, {once:true});
  } else {
    start();
  }
})();
