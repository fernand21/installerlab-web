(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  let loading = false;
  let reportLoaded = false;
  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const buttonText = () => es() ? 'Informe PDF' : 'PDF Report';
  const loadingText = () => es() ? 'Cargando PDF…' : 'Loading PDF…';

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const absolute = new URL(src, location.href).href;
      const existing = [...document.scripts].find(s => s.src === absolute);
      if (existing) {
        if (existing.dataset.loaded === '1') return resolve();
        existing.addEventListener('load', resolve, { once:true });
        existing.addEventListener('error', reject, { once:true });
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.addEventListener('load', () => { script.dataset.loaded = '1'; resolve(); }, { once:true });
      script.addEventListener('error', reject, { once:true });
      document.head.appendChild(script);
    });
  }

  async function loadReport(button) {
    if (loading || reportLoaded) return;
    loading = true;
    button.disabled = true;
    button.textContent = loadingText();
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.4/jspdf.plugin.autotable.min.js');
      button.remove();
      await loadScript('../assets/analytics-report.js?v=20260913-6');
      reportLoaded = true;
      requestAnimationFrame(() => document.querySelector('.iax-report-pdf')?.click());
    } catch (error) {
      console.warn('[InstallerLab Analytics PDF]', error);
      loading = false;
      ensureButton();
      alert(es() ? 'No se pudo cargar el generador PDF.' : 'The PDF generator could not be loaded.');
    }
  }

  function ensureButton() {
    if (reportLoaded) return;
    const bar = document.querySelector('.iax-appbar');
    if (!bar) return;
    let button = bar.querySelector('.iax-report-pdf');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'iax-report-pdf';
      const demo = bar.querySelector('.iax-demo-toggle');
      if (demo) demo.insertAdjacentElement('afterend', button); else bar.appendChild(button);
      button.addEventListener('click', () => loadReport(button), { once:true });
    }
    if (!loading && button.textContent !== buttonText()) button.textContent = buttonText();
  }

  const appRoot = document.getElementById('app');
  if (appRoot) new MutationObserver(() => requestAnimationFrame(ensureButton)).observe(appRoot, { childList:true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureButton, { once:true });
  else ensureButton();
})();
