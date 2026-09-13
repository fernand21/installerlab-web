(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const config = window.INSTALLERLAB_ANALYTICS_CONFIG || {};
  const endpoint = String(config.url || '').replace(/\/$/, '') + '/rest/v1/rpc/analytics_summary';
  const key = String(config.publishableKey || '');
  const query = new URLSearchParams(location.search);
  let trackId = query.get('trackId') || query.get('track') || '';
  let lastView = '';
  let requestSerial = 0;
  let notice = null;
  if (trackId) { try { sessionStorage.setItem('installerlab-analytics-demo', '0'); } catch {} }

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const copy = () => es() ? {
    connect:'Conectar aplicación', connected:'Backend conectado', pending:'Backend no conectado', live:'SUPABASE · EN VIVO', bannerConnected:'Analytics conectado', bannerText:'Los eventos en vivo se están leyendo para este TrackID.',
    prompt:'Introduce el TrackID del proyecto', invalid:'Introduce un TrackID válido para consultar Analytics.',
    loading:'Cargando datos reales…', error:'No se pudieron cargar los datos de Analytics.', noData:'Sin eventos para este TrackID.',
    success:'Correctas', eventUninstall:'Desinstalación', eventLaunch:'Ejecución', eventCustom:'Personalizado',
    app:'Aplicación conectada', track:'TrackID'
  } : {
    connect:'Connect application', connected:'Backend connected', pending:'Backend not connected', live:'SUPABASE · LIVE', bannerConnected:'Analytics connected', bannerText:'Live events are being read for this TrackID.',
    prompt:'Enter the project TrackID', invalid:'Enter a valid TrackID to query Analytics.',
    loading:'Loading live data…', error:'Analytics data could not be loaded.', noData:'No events for this TrackID.',
    success:'Successful', eventUninstall:'Uninstall', eventLaunch:'Launch', eventCustom:'Custom',
    app:'Connected application', track:'TrackID'
  };

  const activeView = () => document.querySelector('.iax-view')?.dataset?.view || 'overview';
  const app = () => document.querySelector('.iax-app');
  const setNodeText = (node, value) => { if (node && node.textContent !== String(value)) node.textContent = value; };

  function ensureNotice() {
    const workspace = document.querySelector('.iax-workspace');
    if (!workspace) return null;
    if (!notice || !workspace.contains(notice)) {
      notice = document.createElement('div');
      notice.className = 'iax-live-notice';
      notice.setAttribute('role', 'status');
      workspace.insertBefore(notice, workspace.firstElementChild);
    }
    return notice;
  }

  function setStatus(state, message) {
    const t = copy();
    const backend = document.querySelector('.iax-backend');
    const side = document.querySelector('.iax-side-status small');
    const label = state === 'connected' ? t.connected : state === 'loading' ? t.loading : t.pending;
    if (backend) {
      const html = `<i></i>${esc(label)}`;
      if (backend.innerHTML !== html) backend.innerHTML = html;
    }
    setNodeText(side, label);
    setNodeText(document.querySelector('.iax-app-title span'), state === 'connected' ? t.live : state === 'loading' ? t.loading : 'INTERFACE READY · BACKEND PENDING');
    if (state === 'connected') {
      const banner = document.querySelector('.iax-connect-banner');
      setNodeText(banner?.querySelector('strong'), t.bannerConnected);
      setNodeText(banner?.querySelector('p'), t.bannerText);
    }
    app()?.classList.toggle('live-connected', state === 'connected');
    app()?.classList.toggle('live-loading', state === 'loading');
    document.querySelectorAll('.iax-connect-banner button').forEach(button => setNodeText(button, state === 'connected' ? t.connected : t.connect));
    const n = ensureNotice();
    if (n) {
      n.className = `iax-live-notice ${state}`;
      setNodeText(n, message || '');
      n.hidden = !message;
    }
  }

  function promptTrack() {
    const t = copy();
    const value = window.prompt(t.prompt, trackId || '');
    if (value === null) return;
    const clean = value.trim();
    if (!/^[A-Za-z0-9._:-]{8,80}$/.test(clean)) { setStatus('error', t.invalid); return; }
    const url = new URL(location.href);
    url.searchParams.set('trackId', clean);
    url.searchParams.delete('track');
    location.assign(url.toString());
  }

  function wireConnectButtons() {
    document.querySelectorAll('.iax-connect-banner button, .iax-side-foot button, .iax-picker').forEach(button => {
      if (button.dataset.liveWired !== '1') {
        button.dataset.liveWired = '1';
        button.addEventListener('click', promptTrack);
      }
      button.disabled = false;
    });
    const picker = document.querySelector('.iax-picker span');
    if (picker) setNodeText(picker, trackId ? `${copy().track} ${trackId}` : copy().connect);
  }

  function rangeForPeriod() {
    const index = document.querySelector('.iax-filterbar select')?.selectedIndex || 0;
    if (index === 3) return null;
    return new Date(Date.now() - (index === 2 ? 90 : index === 1 ? 30 : 7) * 86400000).toISOString();
  }

  async function fetchSummary() {
    if (!trackId || !key || !config.url) return null;
    const payload = { p_track_id: trackId, p_to: new Date().toISOString() };
    const from = rangeForPeriod();
    if (from) payload.p_from = from;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`Supabase RPC ${response.status}`);
    return response.json();
  }

  function setKpis(values) {
    document.querySelectorAll('.iax-view .iax-kpi strong').forEach((node, index) => {
      if (values[index] !== undefined) { setNodeText(node, values[index]); node.classList.add('iax-live-value'); }
    });
  }

  function setBars(node, rows, useInstalls) {
    if (!node) return;
    const values = (Array.isArray(rows) ? rows : []).slice(0, 4);
    const max = Math.max(1, ...values.map(row => Number(row.value ?? row.installs ?? 0)));
    node.querySelectorAll('.iax-bar-row').forEach((row, index) => {
      const item = values[index], span = row.querySelector('span'), em = row.querySelector('em'), fill = row.querySelector('b');
      if (!item) { setNodeText(span, '—'); setNodeText(em, '—'); if (fill) fill.style.width = '0%'; return; }
      const amount = Number(item.value ?? item.installs ?? 0);
      setNodeText(span, item.label || 'Unknown'); setNodeText(em, String(useInstalls ? Number(item.installs || 0) : amount));
      if (fill) fill.style.width = `${Math.round((amount / max) * 100)}%`;
    });
  }

  function eventLabel(type) {
    const t = copy();
    return type === 'uninstall_completed' ? t.eventUninstall : type === 'launch' ? t.eventLaunch : type === 'custom' ? t.eventCustom : (es() ? 'Instalación' : 'Install');
  }

  function renderRecent(rows) {
    const table = document.querySelector('.iax-view[data-view="overview"] .iax-table');
    const tbody = table?.querySelector('tbody');
    if (!tbody) return;
    const list = Array.isArray(rows) ? rows : [];
    if (!list.length) { tbody.innerHTML = `<tr><td colspan="6"><div class="iax-table-empty">${esc(copy().noData)}</div></td></tr>`; return; }
    tbody.innerHTML = list.slice(0, 50).map(row => {
      const system = row.system || {};
      const systemText = [system.windows_version, system.architecture].filter(Boolean).join(' ') || '—';
      const date = row.event_at ? new Date(row.event_at).toLocaleString() : '—';
      return `<tr><td>${esc(date)}</td><td>${esc(row.app_version || '—')}</td><td>${esc(row.package_type || '—')}</td><td>${esc(eventLabel(row.event_type))}</td><td>${esc(row.result || '—')}</td><td>${esc(systemText)}</td></tr>`;
    }).join('');
  }

  function applySummary(data) {
    const d = data || {}, installs = Number(d.installs || 0), successful = Number(d.successful || 0), failed = Number(d.failed || 0), uninstalls = Number(d.uninstalls || 0), launches = Number(d.launches || 0), active = Number(d.active_installs || 0);
    const view = activeView();
    const values = { overview:[installs,successful,failed,uninstalls,active,launches], activity:[installs,successful,failed,0,uninstalls], users:[active,0,active,uninstalls,active], requirements:[0,0,0], errors:[failed,installs ? `${((failed/installs)*100).toFixed(2)}%` : '0%',0], uninstall:[uninstalls,0], launch:[active,launches,active ? (launches/active).toFixed(1) : '0',launches ? 'Recent' : '—'] };
    setKpis(values[view] || []);
    if (view === 'overview') {
      const bars = document.querySelectorAll('.iax-view[data-view="overview"] .iax-bars');
      setBars(bars[0], d.versions, true); setBars(bars[1], d.windows, false); setBars(bars[2], d.platforms, false); renderRecent(d.recent_events);
    }
    document.querySelectorAll('.iax-live-pill').forEach(node => setNodeText(node, installs || (d.recent_events || []).length ? 'LIVE' : copy().noData));
    const readOnly = document.querySelectorAll('.iax-view[data-view="settings"] .iax-readonly');
    setNodeText(readOnly[0], trackId ? copy().app : copy().pending); setNodeText(readOnly[1], trackId || '—'); setNodeText(readOnly[2], `${successful} ${copy().success}`);
  }

  async function refresh() {
    wireConnectButtons();
    if (!trackId) { setStatus('pending'); return; }
    const serial = ++requestSerial;
    setStatus('loading', copy().loading);
    try { const data = await fetchSummary(); if (serial !== requestSerial) return; setStatus('connected'); applySummary(data); }
    catch (error) { if (serial !== requestSerial) return; console.warn('[InstallerLab Analytics]', error); setStatus('error', copy().error); }
  }

  function observeView() {
    const view = activeView();
    if (view !== lastView) { lastView = view; if (trackId) setTimeout(refresh, 0); }
    wireConnectButtons();
  }
  const observer = new MutationObserver(observeView);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('change', event => { if (event.target.closest('.iax-filterbar')) refresh(); });
  window.addEventListener('storage', refresh);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh); else refresh();
})();
