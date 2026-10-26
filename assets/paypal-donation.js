(() => {
  const PAYPAL = 'https://paypal.me/OfficeRibbon';
  const PAYPAL_PRO = 'https://paypal.me/OfficeRibbon/10USD';
  const isSpanish = () => (localStorage.getItem('il-lang') || 'es').toLowerCase() === 'es';
  let queued = false;

  function applyPayPal(){
    document.querySelectorAll('[data-support-contact]').forEach(a => {
      a.href = PAYPAL;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.title = isSpanish() ? 'Donar con PayPal' : 'Support with PayPal';
    });
    document.querySelectorAll('[data-pro-contact]').forEach(a => {
      a.href = PAYPAL_PRO;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.title = isSpanish() ? 'Obtener PRO desde US$10' : 'Get PRO from US$10';
    });

    const note = document.querySelector('.donate-manual-note');
    if (note) {
      note.textContent = isSpanish()
        ? 'Puedes hacer un aporte libre o elegir PRO desde US$10. Después del pago conserva el comprobante y usa el formulario de abajo para solicitar tu certificado o activación PRO.'
        : 'You can make a free-form contribution or choose PRO from US$10. After payment, keep the receipt and use the form below to request your certificate or PRO activation.';
    }
  }

  document.addEventListener('click', e => {
    const pro = e.target.closest?.('[data-pro-contact]');
    const support = e.target.closest?.('[data-support-contact]');
    if (!pro && !support) return;
    e.preventDefault();
    e.stopImmediatePropagation();

    if (pro) {
      const amount = document.getElementById('supporter-amount');
      const kind = document.getElementById('supporter-kind');
      const machine = document.getElementById('supporter-machine');
      if (amount) amount.value = '10';
      if (kind) kind.value = 'pro';
      if (machine) machine.required = true;
      window.open(PAYPAL_PRO, '_blank', 'noopener,noreferrer');
      return;
    }

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
