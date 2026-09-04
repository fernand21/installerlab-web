(() => {
  const PAYPAL = 'https://paypal.me/OfficeRibbon';
  const SUPPORT_EMAIL = 'farevalo210@gmail.com';
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

  function buildActivationMail(form, es) {
    const data = new FormData(form);
    const value = name => String(data.get(name) || '').trim();
    const subject = es ? 'Solicitud de activación PRO - InstallerLab' : 'InstallerLab PRO activation request';
    const body = es
      ? [
          'Hola,',
          '',
          'Deseo solicitar la activación PRO de InstallerLab.',
          '',
          'Nombre: ' + value('name'),
          'Correo de contacto: ' + value('email'),
          'Machine Code: ' + value('machine'),
          'Referencia / transacción PayPal: ' + (value('transaction') || 'No indicada'),
          'Importe enviado: ' + (value('amount') || 'US$10 o más'),
          '',
          'Notas:',
          value('notes') || 'Sin notas adicionales.',
          '',
          'IMPORTANTE: adjunto el comprobante de PayPal a este correo.',
          'Entiendo que esta activación PRO corresponde a una sola máquina / un solo Machine Code.',
          '',
          'Gracias.'
        ].join('\n')
      : [
          'Hello,',
          '',
          'I would like to request InstallerLab PRO activation.',
          '',
          'Name: ' + value('name'),
          'Contact email: ' + value('email'),
          'Machine Code: ' + value('machine'),
          'PayPal transaction / reference: ' + (value('transaction') || 'Not provided'),
          'Amount sent: ' + (value('amount') || 'US$10 or more'),
          '',
          'Notes:',
          value('notes') || 'No additional notes.',
          '',
          'IMPORTANT: I am attaching the PayPal receipt to this email.',
          'I understand this PRO activation is for one machine / one Machine Code only.',
          '',
          'Thank you.'
        ].join('\n');
    return { subject, body };
  }

  function wireDonationForm(es) {
    const form = document.getElementById('activation-request-form');
    if (!form || form.dataset.wired === '1') return;
    form.dataset.wired = '1';

    const copy = document.getElementById('copy-support-email');
    if (copy) {
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(SUPPORT_EMAIL);
          copy.textContent = es ? 'Copiado ✓' : 'Copied ✓';
          setTimeout(() => { copy.textContent = es ? 'Copiar correo' : 'Copy email'; }, 1400);
        } catch {
          location.href = 'mailto:' + SUPPORT_EMAIL;
        }
      });
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const mail = buildActivationMail(form, es);
      const status = document.getElementById('activation-form-status');
      try { await navigator.clipboard.writeText(mail.body); } catch {}
      if (status) {
        status.textContent = es
          ? 'Se abrirá tu aplicación de correo. Antes de enviarlo, adjunta el comprobante de PayPal.'
          : 'Your email app will open. Before sending, attach your PayPal receipt.';
      }
      const href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(mail.body)}`;
      setTimeout(() => { location.href = href; }, 120);
    });
  }

  function renderDonationPage() {
    if (document.body.dataset.page !== 'donate') return;
    const main = document.querySelector('main.content');
    if (!main || main.querySelector('#paypal-support-card')) return;
    const es = (localStorage.getItem('il-lang') || 'es').toLowerCase() !== 'en';

    main.innerHTML = es ? `
      <div id="paypal-support-card" class="donate-page">
        <section class="donate-hero">
          <div class="donate-card">
            <span class="donate-badge">InstallerLab sigue siendo gratuito</span>
            <h2>Apoya InstallerLab desde US$10</h2>
            <p>La activación PRO es una forma opcional de apoyar el desarrollo. Una contribución de <strong>US$10 o más</strong> desbloquea la <strong>creación de Portables</strong> y los <strong>21 temas PRO</strong>. Las funciones base y los 11 temas gratuitos continúan disponibles sin pagar.</p>
            <div class="donate-actions">
              <a class="button primary" href="${PAYPAL}" target="_blank" rel="noopener noreferrer">Donar con PayPal →</a>
              <a class="button" href="#activation-request-form">Ya doné: solicitar activación</a>
            </div>
          </div>
          <aside class="license-card">
            <h3>🔐 Licencia para una sola máquina</h3>
            <p>La activación PRO se genera para <strong>un único Machine Code</strong> y corresponde a <strong>una sola computadora</strong>.</p>
            <div class="license-machine"><span class="icon">💻</span><div><strong>1 activación = 1 máquina</strong><span>Si deseas activar InstallerLab PRO en otra computadora, necesitarás otra activación para el Machine Code de esa máquina.</span></div></div>
          </aside>
        </section>

        <section class="donate-steps">
          <h3>Cómo solicitar tu activación PRO</h3>
          <div class="step-grid">
            <div class="step-box"><span class="step-num">1</span><b>Apoya el proyecto</b><span>Envía US$10 o más mediante PayPal.me/OfficeRibbon.</span></div>
            <div class="step-box"><span class="step-num">2</span><b>Copia tu Machine Code</b><span>Abre InstallerLab y copia el código de la máquina que deseas activar.</span></div>
            <div class="step-box"><span class="step-num">3</span><b>Completa tus datos</b><span>Usa el formulario de abajo para preparar la solicitud de activación.</span></div>
            <div class="step-box"><span class="step-num">4</span><b>Adjunta el comprobante</b><span>Antes de enviar el correo, adjunta el comprobante o recibo de PayPal.</span></div>
          </div>
        </section>

        <section class="activation-card">
          <h3>Enviar datos para la activación</h3>
          <p class="activation-subtitle">Completa estos datos. Al pulsar <strong>Preparar correo</strong> se abrirá tu aplicación de correo con la solicitud lista para enviar a <span class="activation-email">${SUPPORT_EMAIL}</span>. Solo tendrás que <strong>adjuntar el comprobante de PayPal</strong> antes de enviarlo.</p>

          <form id="activation-request-form" class="activation-form">
            <div class="form-field"><label for="activation-name">Nombre</label><input id="activation-name" name="name" type="text" autocomplete="name" required placeholder="Tu nombre"></div>
            <div class="form-field"><label for="activation-email">Correo de contacto</label><input id="activation-email" name="email" type="email" autocomplete="email" required placeholder="tu@email.com"></div>
            <div class="form-field full"><label for="activation-machine">Machine Code</label><input id="activation-machine" name="machine" type="text" required placeholder="Pega aquí el Machine Code mostrado por InstallerLab"><span class="form-help">La licencia se generará específicamente para este Machine Code.</span></div>
            <div class="form-field"><label for="activation-transaction">Referencia / transacción PayPal</label><input id="activation-transaction" name="transaction" type="text" placeholder="Opcional, pero recomendado"></div>
            <div class="form-field"><label for="activation-amount">Importe enviado</label><input id="activation-amount" name="amount" type="text" value="US$10" placeholder="US$10"></div>
            <div class="form-field full"><label for="activation-notes">Notas</label><textarea id="activation-notes" name="notes" placeholder="Información adicional, si hace falta"></textarea></div>

            <div class="activation-check">
              <input id="activation-one-machine" type="checkbox" required>
              <label for="activation-one-machine">Entiendo que la activación PRO solicitada es válida para <strong>una sola máquina</strong> y quedará asociada al Machine Code indicado arriba.</label>
            </div>

            <div class="activation-note"><strong>Comprobante requerido:</strong> los navegadores no pueden adjuntar automáticamente un archivo a un correo mediante esta página. Cuando se abra tu aplicación de correo, <strong>adjunta manualmente el comprobante de PayPal</strong> antes de pulsar Enviar.</div>

            <div class="activation-actions">
              <button class="button primary" type="submit">Preparar correo de activación →</button>
              <button class="copy-mail" id="copy-support-email" type="button">Copiar correo</button>
              <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>
            </div>
            <div id="activation-form-status" class="form-status" aria-live="polite"></div>
          </form>
        </section>
      </div>` : `
      <div id="paypal-support-card" class="donate-page">
        <section class="donate-hero">
          <div class="donate-card">
            <span class="donate-badge">InstallerLab remains free</span>
            <h2>Support InstallerLab from US$10</h2>
            <p>PRO activation is an optional way to support development. A contribution of <strong>US$10 or more</strong> unlocks <strong>Portable creation</strong> and the <strong>21 PRO themes</strong>. Core features and the 11 free themes remain available without payment.</p>
            <div class="donate-actions">
              <a class="button primary" href="${PAYPAL}" target="_blank" rel="noopener noreferrer">Support with PayPal →</a>
              <a class="button" href="#activation-request-form">Already donated: request activation</a>
            </div>
          </div>
          <aside class="license-card">
            <h3>🔐 One-machine license</h3>
            <p>PRO activation is generated for <strong>one Machine Code</strong> and applies to <strong>one computer only</strong>.</p>
            <div class="license-machine"><span class="icon">💻</span><div><strong>1 activation = 1 machine</strong><span>To activate InstallerLab PRO on another computer, a separate activation is required for that machine's Machine Code.</span></div></div>
          </aside>
        </section>

        <section class="donate-steps">
          <h3>How to request PRO activation</h3>
          <div class="step-grid">
            <div class="step-box"><span class="step-num">1</span><b>Support the project</b><span>Send US$10 or more through PayPal.me/OfficeRibbon.</span></div>
            <div class="step-box"><span class="step-num">2</span><b>Copy your Machine Code</b><span>Open InstallerLab and copy the code from the computer you want to activate.</span></div>
            <div class="step-box"><span class="step-num">3</span><b>Enter your details</b><span>Use the form below to prepare your activation request.</span></div>
            <div class="step-box"><span class="step-num">4</span><b>Attach the receipt</b><span>Before sending the email, attach your PayPal receipt or payment confirmation.</span></div>
          </div>
        </section>

        <section class="activation-card">
          <h3>Send activation details</h3>
          <p class="activation-subtitle">Complete the form. Pressing <strong>Prepare email</strong> opens your email app with the request addressed to <span class="activation-email">${SUPPORT_EMAIL}</span>. You only need to <strong>attach the PayPal receipt</strong> before sending.</p>

          <form id="activation-request-form" class="activation-form">
            <div class="form-field"><label for="activation-name">Name</label><input id="activation-name" name="name" type="text" autocomplete="name" required placeholder="Your name"></div>
            <div class="form-field"><label for="activation-email">Contact email</label><input id="activation-email" name="email" type="email" autocomplete="email" required placeholder="you@email.com"></div>
            <div class="form-field full"><label for="activation-machine">Machine Code</label><input id="activation-machine" name="machine" type="text" required placeholder="Paste the Machine Code shown by InstallerLab"><span class="form-help">The license will be generated specifically for this Machine Code.</span></div>
            <div class="form-field"><label for="activation-transaction">PayPal transaction / reference</label><input id="activation-transaction" name="transaction" type="text" placeholder="Optional, but recommended"></div>
            <div class="form-field"><label for="activation-amount">Amount sent</label><input id="activation-amount" name="amount" type="text" value="US$10" placeholder="US$10"></div>
            <div class="form-field full"><label for="activation-notes">Notes</label><textarea id="activation-notes" name="notes" placeholder="Any additional information"></textarea></div>

            <div class="activation-check">
              <input id="activation-one-machine" type="checkbox" required>
              <label for="activation-one-machine">I understand that the requested PRO activation is valid for <strong>one machine only</strong> and will be tied to the Machine Code entered above.</label>
            </div>

            <div class="activation-note"><strong>Receipt required:</strong> a browser cannot automatically attach a local file to an email from this page. When your email app opens, <strong>attach the PayPal receipt manually</strong> before pressing Send.</div>

            <div class="activation-actions">
              <button class="button primary" type="submit">Prepare activation email →</button>
              <button class="copy-mail" id="copy-support-email" type="button">Copy email</button>
              <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>
            </div>
            <div id="activation-form-status" class="form-status" aria-live="polite"></div>
          </form>
        </section>
      </div>`;

    wireDonationForm(es);
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
