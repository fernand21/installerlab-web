(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const eventsOf = data => Array.isArray(data?.events)
    ? data.events
    : Array.isArray(data?.recent_events) ? data.recent_events : [];

  const unique = values => [...new Set(values.map(v => String(v || '').trim()).filter(Boolean))]
    .sort((a,b) => a.localeCompare(b, undefined, {numeric:true, sensitivity:'base'}));

  function fill(select, values) {
    if (!select) return;
    const previous = select.selectedIndex > 0 ? select.value : '';
    const allLabel = select.options[0]?.textContent || 'All';
    const opts = unique(values);
    select.innerHTML = `<option value="">${allLabel}</option>` + opts.map(v => `<option value="${v.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}">${v.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</option>`).join('');
    if (previous && opts.includes(previous)) select.value = previous;
  }

  function populate(data) {
    const events = eventsOf(data);
    const selects = [...document.querySelectorAll('.iax-filterbar select')];
    if (selects.length < 4) return;

    fill(selects[1], events.map(r => r?.app_version));
    fill(selects[2], events.map(r => r?.package_type));
    fill(selects[3], events.map(r => r?.architecture));
  }

  window.addEventListener('installerlab:analytics-summary', event => populate(event.detail?.data));

  const boot = () => {
    if (window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY) {
      populate(window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();