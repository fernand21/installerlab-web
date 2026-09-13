(() => {
  'use strict';

  let loadingPromise = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = [...document.scripts].find(s => s.src === src);
      if (existing) {
        if (existing.dataset.loaded === '1') return resolve();
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.referrerPolicy = 'no-referrer';
      script.addEventListener('load', () => { script.dataset.loaded = '1'; resolve(); }, { once: true });
      script.addEventListener('error', reject, { once: true });
      document.head.appendChild(script);
    });
  }

  async function ensurePdfLibraries() {
    if (window.jspdf?.jsPDF && window.jspdf?.jsPDF?.API?.autoTable) return;
    if (!loadingPromise) {
      loadingPromise = (async () => {
        if (!window.jspdf?.jsPDF) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        }
        if (!window.jspdf?.jsPDF?.API?.autoTable) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.4/jspdf.plugin.autotable.min.js');
        }
      })().catch(err => {
        loadingPromise = null;
        throw err;
      });
    }
    return loadingPromise;
  }

  document.addEventListener('click', async event => {
    const button = event.target.closest?.('.iax-report-pdf');
    if (!button || button.dataset.pdfReadyReplay === '1') return;
    if (window.jspdf?.jsPDF && window.jspdf?.jsPDF?.API?.autoTable) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es' ? 'Cargando PDF…' : 'Loading PDF…';

    try {
      await ensurePdfLibraries();
      button.dataset.pdfReadyReplay = '1';
      button.disabled = false;
      button.textContent = originalText;
      button.click();
      delete button.dataset.pdfReadyReplay;
    } catch (error) {
      console.warn('[InstallerLab Analytics PDF loader]', error);
      button.disabled = false;
      button.textContent = originalText;
      alert((localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es'
        ? 'No se pudo cargar el generador PDF. Verifica tu conexión e inténtalo nuevamente.'
        : 'The PDF generator could not be loaded. Check your connection and try again.');
    }
  }, true);
})();
