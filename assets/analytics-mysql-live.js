(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const API_ENDPOINT = 'https://b4xapp.com/aplicaciones/installerlab/api.php';
  const cfg = window.INSTALLERLAB_ANALYTICS_CONFIG || {};
  const READ_TOKEN = String(cfg.magicApiReadToken || window.INSTALLERLAB_MAGICAPI_READ_TOKEN || '').trim();
  const REQUEST_TIMEOUT_MS = 7000;

  const params = new URLSearchParams(location.search);
  let trackId = (params.get('trackId') || params.get('track') || '').trim().toUpperCase();
  let controller = null;
  let serial = 0;
  let cache = null;
  let cacheKey = '';
  let cacheAt = 0;

  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const copy = () => es() ? {
    connected:'MySQL', loading:'Cargando…', pending:'Selecciona una aplicación', empty:'Sin datos', error:'Sin conexión',
    loadingText:'Leyendo Analytics desde MySQL…', noData:'No hay datos para este periodo.',
    unavailable:'No se pudo consultar InstallerLab Analytics.', timeout:'El servidor tardó demasiado en responder.',
    tokenMissing:'La conexión de lectura de Analytics todavía no está configurada.',
    prompt:'Introduce el TrackID del proyecto', invalid:'Introduce un TrackID válido.',
    history:'Histórico permanente en MySQL', events:'eventos', connect:'Conectar aplicación', banner:'Analytics conectado'
  } : {
    connected:'MySQL', loading:'Loading…', pending:'Select an application', empty:'No data', error:'Connection unavailable',
    loadingText:'Reading Analytics from MySQL…', noData:'No data for this period.',
    unavailable:'InstallerLab Analytics could not be queried.', timeout:'The server took too long to respond.',
    tokenMissing:'The Analytics read connection is not configured yet.',
    prompt:'Enter the project TrackID', invalid:'Enter a valid TrackID.',
    history:'Permanent history in MySQL', events:'events', connect:'Connect application', banner:'Analytics connected'
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const array = value => Array.isArray(value) ? value : [];
  const number = value => Number.isFinite(Number(value)) ? Number(value) : 0;
  const lower = value => String(value || '').toLowerCase();

  function emptySummary(extra = {}) {
    return {
      ok:true, storage_mode:'mysql', event_count:0,
      installs:0, started:0, successful:0, failed:0, cancelled:0,
      uninstalls:0, launches:0, active_installs:0, unique_installs:0,
      success_rate:0, avg_install_duration_ms:0,
      versions:[], platforms:[], windows:[], packages:[], languages:[], errors:[],
      recent_events:[], daily:[], ...extra
    };
  }

  function notice() {
    let node = document.querySelector('.iax-live-notice');
    if (node) return node;
    const workspace = document.querySelector('.iax-workspace');
    if (!workspace) return null;
    node = document.createElement('div');
    node.className = 'iax-live-notice';
    node.setAttribute('role', 'status');
    workspace.insertBefore(node, workspace.firstElementChild);
    return node;
  }

  function setStatus(state, message = '') {
    const t = copy();
    const labels = {connected:t.connected, loading:t.loading, empty:t.empty, error:t.error, pending:t.pending};
    const label = labels[state] || t.pending;
    const backend = document.querySelector('.iax-backend');
    if (backend) backend.innerHTML = `<i></i>${esc(label)}`;
    const side = document.querySelector('.iax-side-status small');
    if (side && side.textContent !== label) side.textContent = label;
    const title = document.querySelector('.iax-app-title span');
    if (title && (state === 'connected' || state === 'empty')) title.textContent = 'MYSQL';
    const banner = document.querySelector('.iax-connect-banner strong');
    if (banner && (state === 'connected' || state === 'empty')) banner.textContent = state === 'connected' ? t.banner : t.noData;
    document.querySelector('.iax-app')?.classList.toggle('live-connected', state === 'connected' || state === 'empty');
    const node = notice();
    if (node) {
      node.className = `iax-live-notice ${state === 'empty' ? 'connected' : state}`;
      if (node.textContent !== message) node.textContent = message;
      node.hidden = !message;
    }
  }

  function periodStart() {
    const index = document.querySelector('.iax-filterbar select')?.selectedIndex || 0;
    if (index === 3) return null;
    const days = index === 2 ? 90 : index === 1 ? 30 : 7;
    return Date.now() - days * 86400000;
  }

  function filteredByPeriod(events) {
    const start = periodStart();
    if (!start) return events;
    return events.filter(row => {
      const n = Date.parse(row?.event_at || row?.created_at || '');
      return Number.isFinite(n) && n >= start;
    });
  }

  function dist(events, getter) {
    const m = new Map();
    for (const row of events) {
      const label = String(getter(row) || '').trim();
      if (!label) continue;
      m.set(label, (m.get(label) || 0) + 1);
    }
    return [...m].map(([label, value]) => ({label, value, count:value})).sort((a,b) => b.value - a.value);
  }

  function buildSummary(allEvents, daily) {
    const events = filteredByPeriod(array(allEvents)).sort((a,b) => Date.parse(b.event_at || b.created_at || 0) - Date.parse(a.event_at || a.created_at || 0));
    const installStarted = events.filter(r => lower(r.event_type) === 'install_started');
    const installSucceeded = events.filter(r => lower(r.event_type) === 'install_succeeded');
    const installFailed = events.filter(r => lower(r.event_type) === 'install_failed' || lower(r.result).includes('fail'));
    const cancelled = events.filter(r => lower(r.event_type).includes('cancel') || lower(r.result).includes('cancel'));
    const uninstalls = events.filter(r => lower(r.event_type).includes('uninstall'));
    const launches = events.filter(r => lower(r.event_type) === 'launch');
    const ids = new Set(events.map(r => r.install_id).filter(Boolean));
    const successfulIds = new Set(installSucceeded.map(r => r.install_id).filter(Boolean));
    const removedIds = new Set(uninstalls.map(r => r.install_id).filter(Boolean));
    let active = [...successfulIds].filter(id => !removedIds.has(id)).length;
    if (!active && installSucceeded.length) active = Math.max(0, installSucceeded.length - uninstalls.length);
    const durations = installSucceeded.map(r => number(r.duration_ms)).filter(n => n > 0);
    const avg = durations.length ? Math.round(durations.reduce((a,b)=>a+b,0) / durations.length) : 0;
    const errors = dist(installFailed, r => r.error_code || r.stage || 'Install failed');

    return {
      ok:true, storage_mode:'mysql', event_count:events.length,
      installs:installStarted.length,
      started:installStarted.length,
      successful:installSucceeded.length,
      failed:installFailed.length,
      cancelled:cancelled.length,
      uninstalls:uninstalls.length,
      launches:launches.length,
      active_installs:active,
      unique_installs:ids.size,
      unique_users:ids.size,
      success_rate:installStarted.length ? Math.round((installSucceeded.length / installStarted.length) * 10000) / 100 : 0,
      avg_install_duration_ms:avg,
      versions:dist(events, r => r.app_version),
      platforms:dist(events, r => r.architecture),
      architectures:dist(events, r => r.architecture),
      windows:dist(events, r => r.windows_version),
      packages:dist(events, r => r.package_type),
      languages:dist(events, r => r.language),
      errors,
      recent_events:events.slice(0, 100),
      events:events.slice(0, 100),
      daily:array(daily)
    };
  }

  async function apiGet(table, column = '', value = '', signal) {
    if (!READ_TOKEN) {
      const e = new Error(copy().tokenMissing);
      e.code = 'READ_TOKEN_MISSING';
      throw e;
    }
    const url = new URL(API_ENDPOINT);
    url.searchParams.set('table', table);
    if (column) url.searchParams.set('column', column);
    if (value !== '') url.searchParams.set('value', String(value));
    let response;
    try {
      response = await fetch(url.toString(), {
        method:'GET',
        headers:{'Authorization':`Bearer ${READ_TOKEN}`,'Accept':'application/json'},
        cache:'no-store', signal
      });
    } catch (err) {
      const e = new Error(err?.name === 'AbortError' ? copy().timeout : copy().unavailable);
      e.code = err?.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR';
      throw e;
    }
    const raw = await response.text();
    let data;
    try { data = raw ? JSON.parse(raw) : []; }
    catch {
      const e = new Error(copy().unavailable);
      e.code = 'INVALID_JSON';
      throw e;
    }
    if (!response.ok) {
      const e = new Error(data?.error || data?.response || `${copy().unavailable} HTTP ${response.status}`);
      e.code = `HTTP_${response.status}`;
      throw e;
    }
    return Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
  }

  async function loadSummary(signal) {
    const projects = await apiGet('analytics_projects', 'track_id', trackId, signal);
    const project = projects.find(row => String(row.track_id || '').toUpperCase() === trackId) || projects[0];
    if (!project?.id) return emptySummary({project:null});
    const [events, daily] = await Promise.all([
      apiGet('analytics_events', 'project_id', project.id, signal),
      apiGet('analytics_daily', 'project_id', project.id, signal).catch(() => [])
    ]);
    return {...buildSummary(events, daily), project};
  }

  function publish(data) {
    const value = data && typeof data === 'object' ? data : emptySummary();
    window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY = value;
    window.INSTALLERLAB_ANALYTICS_TRACK_ID = trackId;
    window.dispatchEvent(new CustomEvent('installerlab:analytics-summary', {detail:{data:value, trackId}}));
  }

  function cacheId() {
    return `${trackId}|${document.querySelector('.iax-filterbar select')?.selectedIndex || 0}`;
  }

  async function refresh(force = false) {
    wire();
    if (!trackId) {
      publish(emptySummary());
      setStatus('pending');
      return;
    }
    const key = cacheId();
    if (!force && cache && cacheKey === key && Date.now() - cacheAt < 30000) {
      publish(cache);
      setStatus(cache.event_count ? 'connected' : 'empty', cache.event_count ? `${copy().history} · ${cache.event_count} ${copy().events}` : copy().noData);
      return;
    }
    controller?.abort();
    const own = new AbortController();
    controller = own;
    const seq = ++serial;
    const timer = setTimeout(() => own.abort(), REQUEST_TIMEOUT_MS);
    setStatus('loading', copy().loadingText);
    try {
      const data = await loadSummary(own.signal);
      if (seq !== serial) return;
      cache = data; cacheKey = key; cacheAt = Date.now();
      publish(data);
      setStatus(data.event_count ? 'connected' : 'empty', data.event_count ? `${copy().history} · ${data.event_count} ${copy().events}` : copy().noData);
    } catch (err) {
      if (seq !== serial) return;
      console.warn('[InstallerLab Analytics]', err);
      cache = null;
      publish(emptySummary({unavailable:true, error_code:err?.code || 'UNKNOWN'}));
      setStatus('error', err?.message || copy().unavailable);
    } finally {
      clearTimeout(timer);
    }
  }

  function choose() {
    const t = copy();
    const value = window.prompt(t.prompt, trackId || '');
    if (value === null) return;
    const clean = value.trim().toUpperCase();
    if (!/^IL-TRK-[0-9A-F]{24}$/.test(clean)) {
      setStatus('error', t.invalid);
      return;
    }
    trackId = clean;
    cache = null;
    const url = new URL(location.href);
    url.searchParams.set('trackId', clean);
    url.searchParams.delete('track');
    history.pushState({trackId:clean}, '', url);
    wire();
    refresh(true);
  }

  function wire() {
    const picker = document.querySelector('.iax-picker span');
    const wanted = trackId ? `TrackID ${trackId}` : copy().connect;
    if (picker && picker.textContent !== wanted) picker.textContent = wanted;
    document.querySelectorAll('.iax-picker,.iax-connect-banner button,.iax-side-foot button').forEach(btn => { btn.disabled = false; });
  }

  document.addEventListener('click', event => {
    if (event.target.closest('.iax-picker,.iax-connect-banner button,.iax-side-foot button')) choose();
    if (event.target.closest('.iax-sidebar nav button')) setTimeout(() => publish(cache || emptySummary()), 0);
  });

  document.addEventListener('change', event => {
    if (event.target.closest('.iax-filterbar')) { cache = null; refresh(true); }
  });

  window.addEventListener('popstate', () => {
    const p = new URLSearchParams(location.search);
    trackId = (p.get('trackId') || p.get('track') || '').trim().toUpperCase();
    cache = null;
    refresh(true);
  });

  function start() {
    requestAnimationFrame(() => { wire(); refresh(false); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
