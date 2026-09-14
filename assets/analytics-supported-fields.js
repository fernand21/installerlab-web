(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  // InstallerLab currently exposes analytics switches for Install, Uninstall,
  // Errors and Environment. Launch tracking is not part of the current FSS
  // analytics contract, so the web dashboard must not advertise it.
  const launchTypes = new Set([
    'launch','app_launch','app_launched','application_launch',
    'application_launched','application_started','app_started',
    'start_app','post_install_launch'
  ]);

  const launchLabels = new Set(['launches', 'ejecuciones']);

  function propertiesOf(row) {
    const raw = row?.properties;
    if (raw && typeof raw === 'object') return raw;
    if (typeof raw === 'string' && raw.trim().startsWith('{')) {
      try { return JSON.parse(raw); } catch {}
    }
    return {};
  }

  function isLaunch(row) {
    const type = String(row?.event_type || '').trim().toLowerCase();
    const props = propertiesOf(row);
    const propName = String(props.event_name || props.event || '').trim().toLowerCase();
    return launchTypes.has(type) || launchTypes.has(propName);
  }

  function stripUnsupported(data) {
    if (!data || typeof data !== 'object') return data;

    if (Array.isArray(data.events)) data.events = data.events.filter(row => !isLaunch(row));
    if (Array.isArray(data.recent_events)) data.recent_events = data.recent_events.filter(row => !isLaunch(row));

    data.launches = 0;
    data.event_count = Array.isArray(data.events) ? data.events.length : Number(data.event_count || 0);
    return data;
  }

  function pruneUi() {
    document.querySelectorAll('.iax-sidebar nav button').forEach(btn => {
      const target = String(btn.dataset.target || '').toLowerCase();
      const text = String(btn.textContent || '').trim().toLowerCase();
      if (target === 'launch' || text === 'launch & usage' || text === 'ejecuciones y uso') btn.remove();
    });

    document.querySelectorAll('.iax-real-kpi').forEach(card => {
      const label = String(card.querySelector('span')?.textContent || '').trim().toLowerCase();
      if (launchLabels.has(label)) card.remove();
    });

    // Remove the unsupported launch series from activity charts.
    document.querySelectorAll('svg [stroke="#9c7cff"], svg [fill="#9c7cff"]')
      .forEach(node => node.remove());
    document.querySelectorAll('.iax-line-legend span').forEach(item => {
      if (launchLabels.has(String(item.textContent || '').trim().toLowerCase())) item.remove();
    });
  }

  window.addEventListener('installerlab:analytics-summary', event => {
    stripUnsupported(event.detail?.data);
    requestAnimationFrame(pruneUi);
  });

  document.addEventListener('click', () => setTimeout(pruneUi, 0));
  document.addEventListener('change', () => setTimeout(pruneUi, 0));

  const boot = () => {
    stripUnsupported(window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY);
    requestAnimationFrame(() => requestAnimationFrame(pruneUi));
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();
