(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const TOKEN_KEY = 'installerlab_magicapi_read_token';
  const DEMO_KEY = 'installerlab-analytics-demo';
  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const demoOn = () => { try { return sessionStorage.getItem(DEMO_KEY) === '1'; } catch { return false; } };
  const setDemo = on => { try { sessionStorage.setItem(DEMO_KEY, on ? '1' : '0'); } catch {} location.reload(); };
  const readToken = () => { try { return String(localStorage.getItem(TOKEN_KEY) || '').trim(); } catch { return ''; } };

  const copy = () => es() ? {
    run:'▶ Ejecutar demo', exit:'■ Salir del demo', app:'InstallerLab Demo App', backend:'Modo demo activo',
    dialog:'Conectar Analytics', help:'Introduce el token MagicApi con permiso READ. Se guardará únicamente en este navegador.',
    connect:'Conectar', cancel:'Cancelar', invalid:'Introduce un token MagicApi válido.'
  } : {
    run:'▶ Run demo', exit:'■ Exit demo', app:'InstallerLab Demo App', backend:'Demo mode active',
    dialog:'Connect Analytics', help:'Enter the MagicApi token with READ permission. It will be stored only in this browser.',
    connect:'Connect', cancel:'Cancel', invalid:'Enter a valid MagicApi token.'
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
      ok:true, storage_mode:'demo', event_count:events.length,
      installs:3, started:3, successful:2, failed:1, cancelled:0,
      uninstalls:0, launches:1, active_installs:2, unique_installs:3, unique_users:3,
      success_rate:66.67, avg_install_duration_ms:24000,
      versions:[{label:'3.5.0',value:4}], platforms:[{label:'x64',value:4}], architectures:[{label:'x64',value:4}],
      windows:[{label:'Windows 11',value:3},{label:'Windows 10',value:1}],
      packages:[{label:'Setup EXE',value:3},{label:'MSI',value:1}],
      languages:[{label:'en-US',value:3},{label:'es-EC',value:1}],
      errors:[{label:'1603',value:1}], recent_events:events, events, daily:[]
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

  function showTokenDialog() {
    if (document.getElementById('il-magic-token-dialog')) return;
    const c = copy();
    const overlay = document.createElement('div');
    overlay.id = 'il-magic-token-dialog';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(2,10,22,.72);display:grid;place-items:center;padding:20px;backdrop-filter:blur(4px)';
    const box = document.createElement('div');
    box.style.cssText = 'width:min(520px,100%);background:#0b223b;border:1px solid #28547a;border-radius:16px;padding:22px;box-shadow:0 20px 70px rgba(0,0,0,.45);color:#e8f4ff;font-family:inherit';
    const title = document.createElement('h3'); title.textContent = c.dialog; title.style.cssText = 'margin:0 0 8px;font-size:1.25rem';
    const help = document.createElement('p'); help.textContent = c.help; help.style.cssText = 'margin:0 0 16px;color:#9fc8ec;line-height:1.45';
    const input = document.createElement('input'); input.type = 'password'; input.autocomplete = 'off'; input.placeholder = 'magic_…'; input.style.cssText = 'width:100%;box-sizing:border-box;padding:12px 14px;border-radius:10px;border:1px solid #2f5c83;background:#071a2d;color:#fff;font:inherit;outline:none';
    const error = document.createElement('div'); error.style.cssText = 'min-height:20px;margin-top:8px;color:#ffaaaa;font-size:.86rem';
    const actions = document.createElement('div'); actions.style.cssText = 'display:flex;justify-content:flex-end;gap:10px;margin-top:16px';
    const cancel = document.createElement('button'); cancel.type = 'button'; cancel.textContent = c.cancel; cancel.style.cssText = 'padding:10px 16px;border-radius:9px;border:1px solid #315b80;background:#102b46;color:#d9ecff;cursor:pointer';
    const connect = document.createElement('button'); connect.type = 'button'; connect.textContent = c.connect; connect.style.cssText = 'padding:10px 16px;border-radius:9px;border:0;background:#39a9ff;color:#03111e;font-weight:700;cursor:pointer';
    const close = () => overlay.remove();
    cancel.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    const save = () => {
      const token = input.value.trim();
      if (!/^magic_[A-Za-z0-9_-]{20,}$/.test(token)) { error.textContent = c.invalid; input.focus(); return; }
      try { localStorage.setItem(TOKEN_KEY, token); } catch { error.textContent = c.invalid; return; }
      close();
      location.reload();
    };
    connect.addEventListener('click', save);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') save(); });
    actions.append(cancel, connect);
    box.append(title, help, input, error, actions);
    overlay.append(box);
    document.body.append(overlay);
    setTimeout(() => input.focus(), 0);
  }

  document.addEventListener('click', event => {
    if (demoOn()) return;
    const trigger = event.target.closest('.iax-picker,.iax-connect-banner button,.iax-side-foot button');
    if (!trigger || readToken()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showTokenDialog();
  }, true);

  document.addEventListener('click', event => {
    if (demoOn() && event.target.closest('.iax-sidebar nav button')) setTimeout(publishDemo, 0);
  });

  document.addEventListener('change', event => {
    if (event.target.closest('.lang')) setTimeout(() => { ensureDemoControls(); publishDemo(); }, 0);
  });

  const start = () => requestAnimationFrame(() => { ensureDemoControls(); publishDemo(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
