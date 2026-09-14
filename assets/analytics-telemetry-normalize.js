(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const launchAliases = new Set([
    'launch',
    'app_launch',
    'app_launched',
    'application_launch',
    'application_launched',
    'application_started',
    'app_started',
    'start_app',
    'post_install_launch'
  ]);

  function propsOf(row) {
    const raw = row?.properties;
    if (raw && typeof raw === 'object') return raw;
    if (typeof raw === 'string' && raw.trim().startsWith('{')) {
      try { return JSON.parse(raw); } catch {}
    }
    return {};
  }

  function normalize(data) {
    const arrays = [];
    if (Array.isArray(data?.events)) arrays.push(data.events);
    if (Array.isArray(data?.recent_events) && data.recent_events !== data.events) arrays.push(data.recent_events);

    for (const rows of arrays) {
      for (const row of rows) {
        const type = String(row?.event_type || '').trim().toLowerCase();
        const props = propsOf(row);
        const propName = String(props.event_name || props.event || '').trim().toLowerCase();
        if (launchAliases.has(type) || launchAliases.has(propName)) row.event_type = 'launch';
      }
    }
  }

  window.addEventListener('installerlab:analytics-summary', event => normalize(event.detail?.data));
})();