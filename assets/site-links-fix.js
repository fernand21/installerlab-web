(() => {
  const PAYPAL = 'https://paypal.me/OfficeRibbon';
  const PROJECT_BASE = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  const INTERNAL = new Set(['features','docs','b4j','download','donate','faq','support','about','changelog']);
  let scheduled = false;

  function projectUrl(path = '') {
    return PROJECT_BASE + path.replace(/^\/+/, '');
  }

  function fixInternalUrl(el, attr) {
    const raw = el.getAttribute(attr);
    if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('javascript:')) return;
    let url;
    try { url = new URL(raw, location.href); } catch { return; }
    if (url.origin !== location.origin) return;

    if (attr === 'href') {
      if (url.pathname === '/' && PROJECT_BASE !== '/') {
        el.setAttribute(attr, projectUrl() + url.search + url.hash);
        return;
      }
      const first = url.pathname.split('/').filter(Boolean)[0] || '';
      if (PROJECT_BASE !== '/' && INTERNAL.has(first) && !url.pathname.startsWith(PROJECT_BASE)) {
        el.setAttribute(attr, projectUrl(url.pathname.slice(1)) + url.search + url.hash);
      }
      const resolved = new URL(el.getAttribute(attr), location.href);
      if (resolved.pathname.endsWith('/docs/') && resolved.hash === '#msi') {
        el.setAttribute(attr, resolved.pathname + resolved.search + '#exe-msi');
      }
    } else if (attr === 'src') {
      if (PROJECT_BASE !== '/' && url.pathname.startsWith('/assets/') && !url.pathname.startsWith(PROJECT_BASE)) {
        el.setAttribute(attr, projectUrl(url.pathname.slice(1)) + url.search + url.hash);
      }
    }
  }

  function renderDonationPage() {
    if (document.body.dataset.page !== 'donate') return;
    const main = document.querySelector('main.content');
    if (!main || main.querySelector('#paypal-support-card')) return;
    const lang = (localStorage.getItem('il-lang') || 'es').toLowerCase();
    const es = lang !== 'en';
    main.innerHTML = es ? `
      <div id="paypal-support-card" style="max-width:860px;margin:auto">
        <div class="notice" style="margin-bottom:22px"><strong>InstallerLab es gratuito.</strong> La activación PRO es una forma opcional de apoyar el desarrollo del proyecto.</div>
        <h2>Apoya InstallerLab desde US$10</h2>
        <p>Una contribución de <strong>US$10 o más</strong> ayuda a mantener y mejorar InstallerLab. Como agradecimiento, la activación PRO desbloquea la <strong>creación de Portables</strong> y los <strong>21 temas PRO</strong>. Los 11 temas gratuitos y las funciones base de InstallerLab siguen disponibles sin pagar.</p>
        <p style="margin:24px 0"><a class="button primary" href="${PAYPAL}" target="_blank" rel="noopener noreferrer">Donar con PayPal →</a></p>
        <ol>
          <li>Realiza una contribución de US$10 o más mediante PayPal.</li>
          <li>Abre InstallerLab y copia tu <strong>Machine Code</strong>.</li>
          <li>Envía el comprobante y el Machine Code al correo indicado en la sección de soporte.</li>
          <li>La activación se verifica manualmente y normalmente se responde en aproximadamente 24 horas.</li>
        </ol>
        <div class="notice"><strong>No es una compra obligatoria.</strong> La licencia PRO es un beneficio para quienes apoyan el proyecto; InstallerLab sigue siendo gratuito.</div>
      </div>` : `
      <div id="paypal-support-card" style="max-width:860px;margin:auto">
        <div class="notice" style="margin-bottom:22px"><strong>InstallerLab is free.</strong> PRO activation is an optional way to support continued development.</div>
        <h2>Support InstallerLab from US$10</h2>
        <p>A contribution of <strong>US$10 or more</strong> helps maintain and improve InstallerLab. As a thank-you, PRO activation unlocks <strong>Portable creation</strong> and the <strong>21 PRO themes</strong>. The 11 free themes and InstallerLab's core features remain available without payment.</p>
        <p style="margin:24px 0"><a class="button primary" href="${PAYPAL}" target="_blank" rel="noopener noreferrer">Support with PayPal →</a></p>
        <ol>
          <li>Contribute US$10 or more through PayPal.</li>
          <li>Open InstallerLab and copy your <strong>Machine Code</strong>.</li>
          <li>Send the receipt and Machine Code to the email shown in the Support section.</li>
          <li>Activation is manually verified and is normally answered within about 24 hours.</li>
        </ol>
        <div class="notice"><strong>This is not a required purchase.</strong> PRO is a supporter benefit; InstallerLab remains free.</div>
      </div>`;
  }

  function fixPage() {
    document.querySelectorAll('a[href]').forEach(a => fixInternalUrl(a, 'href'));
    document.querySelectorAll('img[src]').forEach(img => fixInternalUrl(img, 'src'));

    const donateTop = [...document.querySelectorAll('.header .links a')].find(a => {
      try {
        const u = new URL(a.href, location.href);
        return u.pathname.endsWith('/donate/') || a.textContent.trim().toLowerCase() === 'donate';
      } catch { return false; }
    });
    if (donateTop) {
      donateTop.href = PAYPAL;
      donateTop.target = '_blank';
      donateTop.rel = 'noopener noreferrer';
      donateTop.textContent = (localStorage.getItem('il-lang') || 'es').toLowerCase() === 'en' ? 'Donate' : 'Donar';
      donateTop.title = 'PayPal.me/OfficeRibbon';
    }

    const footerDonate = [...document.querySelectorAll('.footer a')].find(a => /donate|pro/i.test(a.textContent));
    if (footerDonate) footerDonate.href = projectUrl('donate/');

    renderDonationPage();
  }

  function scheduleFix() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      fixPage();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fixPage);
  else fixPage();

  new MutationObserver(scheduleFix).observe(document.documentElement, { childList: true, subtree: true });
})();
