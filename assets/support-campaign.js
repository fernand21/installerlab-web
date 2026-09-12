(() => {
  const BASE = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  const PAYPAL = 'https://paypal.me/OfficeRibbon';
  const isSpanish = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  let queued = false;

  function injectRibbon(){
    if(document.body?.dataset?.page !== 'home') return;
    if(document.querySelector('.support-ribbon')) return;
    const es = isSpanish();
    const bar = document.createElement('aside');
    bar.className = 'support-ribbon';
    bar.setAttribute('aria-label', es ? 'Apoyar InstallerLab' : 'Support InstallerLab');
    bar.innerHTML = `
      <div class="support-ribbon__heart" aria-hidden="true">❤</div>
      <div class="support-ribbon__copy">
        <strong>${es ? 'Ayuda a mantener InstallerLab vivo' : 'Help keep InstallerLab alive'}</strong>
        <span>${es ? 'La mayoría del proyecto es gratuito. Puedes apoyarlo desde solo US$1.' : 'Most of the project is free. You can support it from just US$1.'}</span>
      </div>
      <div class="support-ribbon__actions">
        <a class="support-ribbon__primary" href="${PAYPAL}" target="_blank" rel="noopener noreferrer">${es ? 'Donar desde $1' : 'Donate from $1'}</a>
        <a class="support-ribbon__secondary" href="${BASE}donate/#pro">${es ? 'Licencia PRO' : 'PRO license'}</a>
      </div>`;
    bar.querySelectorAll('a').forEach(a => a.addEventListener('click', () => bar.classList.add('is-celebrating')));
    document.body.appendChild(bar);
    document.body.classList.add('has-support-ribbon');
  }

  function schedule(){
    if(queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; injectRibbon(); });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectRibbon);
  else injectRibbon();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('storage', schedule);
})();
