(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const cfg = window.INSTALLERLAB_ANALYTICS_CONFIG || {};
  const API_BASE = String(cfg.magicApiUrl || 'https://b4xapp.com/aplicaciones/api').replace(/\/$/, '');
  const API_PROJECT = String(cfg.magicApiProject || 'installerlab').trim();
  const API = `${API_BASE}/api.php`;
  const REQUEST_TIMEOUT_MS = 7000;

  const qs = new URLSearchParams(location.search);
  let trackId = (qs.get('trackId') || qs.get('track') || '').trim().toUpperCase();
  let cache = null;
  let controller = null;
  let requestSerial = 0;

  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const t = () => es() ? {
    loading:'Leyendo Analytics desde MySQL…',
    connected:'MySQL',
    empty:'Sin datos',
    error:'Sin conexión',
    pending:'Selecciona una aplicación',
    noData:'No hay datos para este periodo.',
    unavailable:'No se pudo consultar InstallerLab Analytics.',
    timeout:'El servidor tardó demasiado en responder.',
    tokenMissing:'La conexión de lectura de Analytics todavía no está configurada.',
    prompt:'Introduce el TrackID del proyecto',
    invalid:'Introduce un TrackID válido.',
    history:'Histórico permanente en MySQL',
    events:'eventos',
    banner:'Analytics conectado',
    connect:'Conectar aplicación'
  } : {
    loading:'Reading Analytics from MySQL…',
    connected:'MySQL',
    empty:'No data',
    error:'Connection unavailable',
    pending:'Select an application',
    noData:'No data for this period.',
    unavailable:'InstallerLab Analytics could not be queried.',
    timeout:'The server took too long to respond.',
    tokenMissing:'The Analytics read connection is not configured yet.',
    prompt:'Enter the project TrackID',
    invalid:'Enter a valid TrackID.',
    history:'Permanent history in MySQL',
    events:'events',
    banner:'Analytics connected',
    connect:'Connect application'
  };

  const number = v => Number.isFinite(Number(v)) ? Number(v) : 0;
  const arr = v => Array.isArray(v) ? v : [];
  const lower = v => String(v || '').toLowerCase();
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function readToken() {
    try {
      return String(
        window.INSTALLERLAB_MAGICAPI_READ_TOKEN ||
        window.INSTALLERLAB_ANALYTICS_CONFIG?.magicApiReadToken ||
        localStorage.getItem('installerlab_magicapi_read_token') ||
        ''
      ).trim();
    } catch {
      return '';
    }
  }

  function emptySummary(extra = {}) {
    return {
      ok:true,
      storage_mode:'mysql',
      event_count:0,
      installs:0,
      started:0,
      successful:0,
      failed:0,
      cancelled:0,
      uninstalls:0,
      launches:0,
      active_installs:0,
      unique_installs:0,
      unique_users:0,
      success_rate:0,
      avg_install_duration_ms:0,
      versions:[],
      platforms:[],
      architectures:[],
      windows:[],
      packages:[],
      languages:[],
      errors:[],
      recent_events:[],
      events:[],
      daily:[],
      ...extra
    };
  }

  function publish(data) {
    const value = data && typeof data === 'object' ? data : emptySummary();
    window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY = value;
    window.INSTALLERLAB_ANALYTICS_TRACK_ID = trackId;
    window.dispatchEvent(new CustomEvent('installerlab:analytics-summary', {
      detail:{data:value, trackId}
    }));
  }

  function notice() {
    let node = document.querySelector('.iax-live-notice');
    if (node) return node;
    const workspace = document.querySelector('.iax-workspace');
    if (!workspace) return null;
    node = document.createElement('div');
    node.className = 'iax-live-notice';
    node.setAttribute('role','status');
    workspace.insertBefore(node, workspace.firstElementChild);
    return node;
  }

  function setStatus(state, message = '') {
    const c = t();
    const labels = {
      loading: c.loading,
      connected: c.connected,
      empty: c.empty,
      error: c.error,
      pending: c.pending
    };
    const label = labels[state] || c.pending;

    const backend = document.querySelector('.iax-backend');
    if (backend) backend.innerHTML = `<i></i>${esc(label)}`;

    const side = document.querySelector('.iax-side-status small');
    if (side) side.textContent = label;

    const banner = document.querySelector('.iax-connect-banner strong');
    if (banner && state === 'connected') banner.textContent = c.banner;
    if (banner && state === 'empty') banner.textContent = c.noData;

    document.querySelector('.iax-app')?.classList.toggle(
      'live-connected',
      state === 'connected' || state === 'empty'
    );

    const node = notice();
    if (node) {
      node.className = `iax-live-notice ${state === 'empty' ? 'connected' : state}`;
      node.textContent = message;
      node.hidden = !message;
    }
  }

  function updateTrackUi() {
    const picker = document.querySelector('.iax-picker span');
    if (picker) picker.textContent = trackId ? `TrackID ${trackId}` : t().connect;
    document.querySelectorAll('.iax-picker,.iax-connect-banner button,.iax-side-foot button')
      .forEach(btn => { btn.disabled = false; });
  }

  async function getTable(table, signal) {
    const token = readToken();
    if (!token) {
      const e = new Error(t().tokenMissing);
      e.code = 'READ_TOKEN_MISSING';
      throw e;
    }

    const url = new URL(API);
    url.searchParams.set('project', API_PROJECT);
    url.searchParams.set('table', table);

    let response;
    try {
      response = await fetch(url.toString(), {
        method:'GET',
        headers:{
          'Authorization':`Bearer ${token}`,
          'Accept':'application/json'
        },
        cache:'no-store',
        signal
      });
    } catch (err) {
      const e = new Error(err?.name === 'AbortError' ? t().timeout : t().unavailable);
      e.code = err?.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR';
      throw e;
    }

    const raw = await response.text();
    let json;
    try {
      json = raw ? JSON.parse(raw) : [];
    } catch {
      const e = new Error(t().unavailable);
      e.code = 'INVALID_JSON';
      throw e;
    }

    if (!response.ok) {
      const e = new Error(json?.error || json?.response || `${t().unavailable} HTTP ${response.status}`);
      e.code = `HTTP_${response.status}`;
      throw e;
    }

    if (Array.isArray(json)) return json;
    if (Array.isArray(json?.data)) return json.data;
    return [];
  }

  function periodStart() {
    const index = document.querySelector('.iax-filterbar select')?.selectedIndex || 0;
    if (index === 3) return null;
    const days = index === 2 ? 90 : index === 1 ? 30 : 7;
    return Date.now() - days * 86400000;
  }

  function applyPeriod(events) {
    const start = periodStart();
    if (!start) return events;
    return events.filter(row => {
      const value = Date.parse(row?.event_at || row?.created_at || '');
      return Number.isFinite(value) && value >= start;
    });
  }

  function distribution(events, getter) {
    const map = new Map();
    for (const row of events) {
      const label = String(getter(row) || '').trim();
      if (!label) continue;
      map.set(label, (map.get(label) || 0) + 1);
    }
    return [...map]
      .map(([label,value]) => ({label,value,count:value}))
      .sort((a,b) => b.value - a.value);
  }

  function buildSummary(allEvents) {
    // Analytics events are identified directly by TrackID.  Do not depend on
    // the legacy analytics_projects/project_id relationship: newer events
    // intentionally contain only track_id.
    const trackEvents = arr(allEvents).filter(row =>
      String(row.track_id || '').trim().toUpperCase() === trackId
    );
    const events = applyPeriod(trackEvents).sort((a,b) =>
      Date.parse(b.event_at || b.created_at || 0) - Date.parse(a.event_at || a.created_at || 0)
    );

    const started = events.filter(r => lower(r.event_type) === 'install_started');
    const successful = events.filter(r => lower(r.event_type) === 'install_succeeded');
    const failed = events.filter(r => lower(r.event_type) === 'install_failed' || lower(r.result).includes('fail'));
    const cancelled = events.filter(r => lower(r.event_type).includes('cancel') || lower(r.result).includes('cancel'));
    const uninstalls = events.filter(r => lower(r.event_type).includes('uninstall'));
    const launches = events.filter(r => lower(r.event_type) === 'launch');

    const installIds = new Set(events.map(r => r.install_id).filter(Boolean));
    const successfulIds = new Set(successful.map(r => r.install_id).filter(Boolean));
    const removedIds = new Set(uninstalls.map(r => r.install_id).filter(Boolean));
    let active = [...successfulIds].filter(id => !removedIds.has(id)).length;
    if (!active && successful.length) active = Math.max(0, successful.length - uninstalls.length);

    const durations = successful.map(r => number(r.duration_ms)).filter(v => v > 0);
    const avg = durations.length ? Math.round(durations.reduce((a,b)=>a+b,0) / durations.length) : 0;

    return {
      ...emptySummary(),
      track_id:trackId,
      event_count:events.length,
      installs:started.length,
      started:started.length,
      successful:successful.length,
      failed:failed.length,
      cancelled:cancelled.length,
      uninstalls:uninstalls.length,
      launches:launches.length,
      active_installs:active,
      unique_installs:installIds.size,
      unique_users:installIds.size,
      success_rate:started.length ? Math.round((successful.length / started.length) * 10000) / 100 : 0,
      avg_install_duration_ms:avg,
      versions:distribution(events, r => r.app_version),
      platforms:distribution(events, r => r.architecture),
      architectures:distribution(events, r => r.architecture),
      windows:distribution(events, r => r.windows_version),
      packages:distribution(events, r => r.package_type),
      languages:distribution(events, r => r.language),
      errors:distribution(failed, r => r.error_code || r.stage || 'Install failed'),
      recent_events:events.slice(0,100),
      events:events.slice(0,100),
      daily:[]
    };
  }

  async function load(signal) {
    // MagicAPI v2:
    // GET api.php?project=PROJECT_ALIAS&table=TABLE_NAME
    // Authorization: Bearer TOKEN
    const events = await getTable('analytics_events', signal);
    return buildSummary(events);
  }

  async function refresh() {
    updateTrackUi();

    if (!trackId) {
      cache = emptySummary();
      publish(cache);
      setStatus('pending');
      return;
    }

    controller?.abort();
    const own = new AbortController();
    controller = own;
    const serial = ++requestSerial;
    const timer = setTimeout(() => own.abort(), REQUEST_TIMEOUT_MS);

    setStatus('loading', t().loading);

    try {
      const data = await load(own.signal);
      if (serial !== requestSerial) return;
      cache = data;
      publish(data);
      setStatus(
        data.event_count ? 'connected' : 'empty',
        data.event_count ? `${t().history} · ${data.event_count} ${t().events}` : t().noData
      );
    } catch (err) {
      if (serial !== requestSerial) return;
      console.warn('[InstallerLab Analytics]', err);
      cache = emptySummary({unavailable:true,error_code:err?.code || 'UNKNOWN'});
      publish(cache);
      setStatus('error', err?.message || t().unavailable);
    } finally {
      clearTimeout(timer);
    }
  }

  function chooseTrack() {
    const value = window.prompt(t().prompt, trackId || '');
    if (value === null) return;
    const clean = value.trim().toUpperCase();
    if (!/^IL-TRK-[0-9A-F]{24}$/.test(clean)) {
      setStatus('error', t().invalid);
      return;
    }
    trackId = clean;
    const url = new URL(location.href);
    url.searchParams.set('trackId', clean);
    url.searchParams.delete('track');
    history.pushState({trackId:clean},'',url);
    refresh();
  }

  document.addEventListener('click', event => {
    if (event.target.closest('.iax-picker,.iax-connect-banner button,.iax-side-foot button')) {
      chooseTrack();
      return;
    }
    if (event.target.closest('.iax-sidebar nav button')) {
      setTimeout(() => publish(cache || emptySummary()), 0);
    }
  });

  document.addEventListener('change', event => {
    if (event.target.closest('.iax-filterbar')) refresh();
  });

  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(location.search);
    trackId = (params.get('trackId') || params.get('track') || '').trim().toUpperCase();
    refresh();
  });

  const start = () => requestAnimationFrame(refresh);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
