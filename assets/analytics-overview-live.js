(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const num = value => Number.isFinite(Number(value)) ? Number(value) : 0;

  function renderOverview(data) {
    const view = document.querySelector('.iax-view[data-view="overview"]');
    if (!view || !data) return;

    const values = [
      num(data.installs),
      num(data.successful),
      num(data.failed),
      num(data.uninstalls),
      num(data.active_installs),
      num(data.launches)
    ];

    view.querySelectorAll('.iax-kpi strong').forEach((node, index) => {
      if (values[index] === undefined) return;
      node.textContent = String(values[index]);
      node.classList.add('iax-live-value');
    });
  }

  function apply(detail) {
    const data = detail?.data || window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY;
    renderOverview(data);
  }

  window.addEventListener('installerlab:analytics-summary', event => {
    requestAnimationFrame(() => apply(event.detail));
  });

  document.addEventListener('click', event => {
    if (event.target.closest('.iax-sidebar nav button')) {
      setTimeout(() => apply({data: window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY}), 0);
    }
  });

  document.addEventListener('change', event => {
    if (event.target.closest('.iax-filterbar')) {
      setTimeout(() => apply({data: window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY}), 0);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => apply({data: window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY}), {once:true});
  } else {
    apply({data: window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY});
  }
})();