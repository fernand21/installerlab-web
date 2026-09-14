(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const targets = [
    '.iax-backend',
    '.iax-side-status small',
    '.iax-live-notice',
    '.iax-real-chip',
    '.iax-connect-banner strong'
  ];

  function cloudLabel(text) {
    return String(text || '')
      .replace(/MySQL/gi, 'Cloud')
      .replace(/Permanent history in Cloud/gi, 'Cloud history')
      .replace(/Histórico permanente en Cloud/gi, 'Histórico en Cloud')
      .replace(/Reading Analytics from Cloud/gi, 'Syncing Analytics from Cloud')
      .replace(/Leyendo Analytics desde Cloud/gi, 'Sincronizando Analytics desde Cloud');
  }

  function scrubNode(node) {
    if (!node || !node.textContent) return;
    const next = cloudLabel(node.textContent);
    if (next !== node.textContent) node.textContent = next;
  }

  function scrub() {
    for (const selector of targets) {
      document.querySelectorAll(selector).forEach(scrubNode);
    }
  }

  const observer = new MutationObserver(() => scrub());

  function start() {
    scrub();
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  window.addEventListener('installerlab:analytics-summary', () => setTimeout(scrub, 0));
})();
