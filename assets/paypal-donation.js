(() => {
  const PAYPAL = 'https://paypal.me/OfficeRibbon';
  const isSpanish = () => (localStorage.getItem('il-lang') || 'es').toLowerCase() === 'es';
  let queued = false;

  function applyPayPal(){
    document.querySelectorAll('[data-support-contact]').forEach(a => {
      a.href = PAYPAL;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.title = isSpanish() ? 'Donar con PayPal' : 'Support with PayPal';
    });

    const note = document.querySelector('.donate-manual-note');
    if (note) {
      note.textContent = isSpanish()
        ? 'Los aportes se realizan mediante PayPal. Después de donar, conserva el comprobante y usa el formulario de abajo para solicitar tu certificado permanente y, si aplica, tu activación PRO.'
        : 'Contributions are made through PayPal. After donating, keep your receipt and use the form below to request your permanent certificate and, when applicable, your PRO activation.';
    }
  }

  document.addEventListener('click', e => {
    const a = e.target.closest?.('[data-support-contact]');
    if (!a) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    window.open(PAYPAL, '_blank', 'noopener,noreferrer');
  }, true);

  function schedule(){
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      applyPayPal();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyPayPal);
  else applyPayPal();

  new MutationObserver(schedule).observe(document.documentElement, {childList:true, subtree:true});
  window.addEventListener('storage', schedule);
})();
