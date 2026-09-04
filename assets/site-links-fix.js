(() => {
  const PAYPAL = 'https://paypal.me/OfficeRibbon';
  const SUPPORT_EMAIL = 'farevalo210@gmail.com';
  const FORM_ENDPOINT = `https://formsubmit.co/${SUPPORT_EMAIL}`;
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

  function wireDonationForm(es) {
    const form = document.getElementById('activation-request-form');
    if (!form || form.dataset.wired === '1') return;
    form.dataset.wired = '1';

    const file = document.getElementById('activation-receipt');
    const status = document.getElementById('activation-form-status');
    const send = document.getElementById('activation-send');
    const copy = document.getElementById('copy-support-email');

    if (file) {
      file.addEventListener('change', () => {
        const selected = file.files && file.files[0];
        if (!selected) return;
        if (selected.size > 10 * 1024 * 1024) {
          file.value = '';
          if (status) status.textContent = es
            ? 'El comprobante supera 10 MB. Selecciona un archivo más pequeño.'
            : 'The receipt is larger than 10 MB. Please choose a smaller file.';
        } else if (status) {
          status.textContent = es ? `Comprobante seleccionado: ${selected.name}` : `Receipt selected: ${selected.name}`;
        }
      });
    }

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

    form.addEventListener('submit', e => {
      if (!form.reportValidity()) {
        e.preventDefault();
        return;
      }
      const selected = file && file.files && file.files[0];
      if (!selected) {
        e.preventDefault();
        if (status) status.textContent = es
          ? 'Adjunta el comprobante de PayPal antes de enviar la solicitud.'
          : 'Attach the PayPal receipt before sending the request.';
        return;
      }
      if (selected.size > 10 * 1024 * 1024) {
        e.preventDefault();
        if (status) status.textContent = es
          ? 'El comprobante supera el límite de 10 MB.'
          : 'The receipt exceeds the 10 MB limit.';
        return;
      }
      if (send) {
        send.disabled = true;
        send.textContent = es ? 'Enviando solicitud…' : 'Sending request…';
      }
      if (status) status.textContent = es
        ? `Enviando directamente a ${SUPPORT_EMAIL}…`
        : `Sending directly to ${SUPPORT_EMAIL}…`;
    });
  }

  function renderDonationPage() {
    if (document.body.dataset.page !== 'donate') return;
    const main = document.querySelector('main.content');
    if (!main || main.querySelector('#paypal-support-card')) return;
    const es = (localStorage.getItem('il-lang') || 'es').toLowerCase() !== 'en';
    const sent = new URLSearchParams(location.search).get('sent') === '1';
    const nextUrl = 'https://fernand21.github.io/installerlab-web/donate/?sent=1';
    const currentUrl = 'https://fernand21.github.io/installerlab-web/donate/';

    main.innerHTML = es ? `
      <div id="paypal-support-card" class="donate-page">
        ${sent ? '<div class="notice" style="margin-bottom:22px"><strong>✓ Solicitud enviada.</strong> Los datos de activación fueron enviados. Revisa tu correo por si necesitas conservar la confirmación.</div>' : ''}

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
            <div class="license-machine"><span class="icon">💻</span><div><strong>1 activación = 1 máquina</strong><span>Para otra computadora se necesita otra activación asociada al Machine Code de esa máquina.</span></div></div>
          </aside>
        </section>

        <section class="donate-steps">
          <h3>Cómo solicitar tu activación PRO</h3>
          <div class="step-grid">
            <div class="step-box"><span class="step-num">1</span><b>Apoya el proyecto</b><span>Envía US$10 o más mediante PayPal.me/OfficeRibbon.</span></div>
            <div class="step-box"><span class="step-num">2</span><b>Copia tu Machine Code</b><span>Abre InstallerLab y copia el código de la computadora que deseas activar.</span></div>
            <div class="step-box"><span class="step-num">3</span><b>Completa el formulario</b><span>Indica tus datos, Machine Code y referencia de PayPal.</span></div>
            <div class="step-box"><span class="step-num">4</span><b>Adjunta y envía</b><span>Sube el comprobante y la página enviará la solicitud directamente.</span></div>
          </div>
        </section>

        <section class="activation-card">
          <h3>Enviar solicitud de activación</h3>
          <p class="activation-subtitle">Ya no necesitas abrir tu aplicación de correo. Completa el formulario, adjunta el comprobante y pulsa <strong>Enviar solicitud</strong>. La información será enviada directamente a <span class="activation-email">${SUPPORT_EMAIL}</span>.</p>

          <form id="activation-request-form" class="activation-form" action="${FORM_ENDPOINT}" method="POST" enctype="multipart/form-data">
            <input type="hidden" name="_subject" value="Solicitud de activación PRO - InstallerLab">
            <input type="hidden" name="_template" value="table">
            <input type="hidden" name="_next" value="${nextUrl}">
            <input type="hidden" name="_url" value="${currentUrl}">
            <input type="text" name="_honey" tabindex="-1" autocomplete="off" style="display:none">

            <div class="form-field"><label for="activation-name">Nombre</label><input id="activation-name" name="Nombre" type="text" autocomplete="name" required placeholder="Tu nombre"></div>
            <div class="form-field"><label for="activation-email">Correo de contacto</label><input id="activation-email" name="email" type="email" autocomplete="email" required placeholder="tu@email.com"></div>
            <div class="form-field full"><label for="activation-machine">Machine Code</label><input id="activation-machine" name="Machine Code" type="text" required placeholder="Pega aquí el Machine Code mostrado por InstallerLab"><span class="form-help">La licencia se generará específicamente para este Machine Code.</span></div>
            <div class="form-field"><label for="activation-transaction">Referencia / transacción PayPal</label><input id="activation-transaction" name="Transacción PayPal" type="text" placeholder="Recomendado"></div>
            <div class="form-field"><label for="activation-amount">Importe enviado</label><input id="activation-amount" name="Importe" type="text" value="US$10" required placeholder="US$10"></div>
            <div class="form-field full"><label for="activation-receipt">Comprobante de PayPal</label><input id="activation-receipt" name="attachment" type="file" required accept="image/png,image/jpeg,application/pdf"><span class="form-help">PNG, JPG o PDF. Tamaño máximo total: 10 MB.</span></div>
            <div class="form-field full"><label for="activation-notes">Notas</label><textarea id="activation-notes" name="Notas" placeholder="Información adicional, si hace falta"></textarea></div>

            <div class="activation-check">
              <input id="activation-one-machine" name="Licencia para una máquina" value="Aceptado" type="checkbox" required>
              <label for="activation-one-machine">Entiendo que la activación PRO solicitada es válida para <strong>una sola máquina</strong> y quedará asociada al Machine Code indicado arriba.</label>
            </div>

            <div class="activation-note"><strong>Envío directo:</strong> este formulario utiliza FormSubmit como servicio de entrega para poder funcionar desde GitHub Pages sin un servidor propio. Los datos y el comprobante se transmiten a ese servicio para ser reenviados a ${SUPPORT_EMAIL}.</div>

            <div class="activation-actions">
              <button class="button primary" id="activation-send" type="submit">Enviar solicitud →</button>
              <button class="copy-mail" id="copy-support-email" type="button">Copiar correo</button>
              <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>
            </div>
            <div id="activation-form-status" class="form-status" aria-live="polite"></div>
          </form>
        </section>
      </div>` : `
      <div id="paypal-support-card" class="donate-page">
        ${sent ? '<div class="notice" style="margin-bottom:22px"><strong>✓ Request sent.</strong> Your activation details were submitted successfully.</div>' : ''}

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
            <div class="license-machine"><span class="icon">💻</span><div><strong>1 activation = 1 machine</strong><span>A separate activation is required for another computer and its Machine Code.</span></div></div>
          </aside>
        </section>

        <section class="donate-steps">
          <h3>How to request PRO activation</h3>
          <div class="step-grid">
            <div class="step-box"><span class="step-num">1</span><b>Support the project</b><span>Send US$10 or more through PayPal.me/OfficeRibbon.</span></div>
            <div class="step-box"><span class="step-num">2</span><b>Copy your Machine Code</b><span>Open InstallerLab and copy the code from the computer you want to activate.</span></div>
            <div class="step-box"><span class="step-num">3</span><b>Complete the form</b><span>Enter your details, Machine Code and PayPal reference.</span></div>
            <div class="step-box"><span class="step-num">4</span><b>Attach and send</b><span>Upload the receipt and the site will send the request directly.</span></div>
          </div>
        </section>

        <section class="activation-card">
          <h3>Send activation request</h3>
          <p class="activation-subtitle">You no longer need to open an email app. Complete the form, attach the receipt and press <strong>Send request</strong>. The information will be delivered directly to <span class="activation-email">${SUPPORT_EMAIL}</span>.</p>

          <form id="activation-request-form" class="activation-form" action="${FORM_ENDPOINT}" method="POST" enctype="multipart/form-data">
            <input type="hidden" name="_subject" value="InstallerLab PRO activation request">
            <input type="hidden" name="_template" value="table">
            <input type="hidden" name="_next" value="${nextUrl}">
            <input type="hidden" name="_url" value="${currentUrl}">
            <input type="text" name="_honey" tabindex="-1" autocomplete="off" style="display:none">

            <div class="form-field"><label for="activation-name">Name</label><input id="activation-name" name="Name" type="text" autocomplete="name" required placeholder="Your name"></div>
            <div class="form-field"><label for="activation-email">Contact email</label><input id="activation-email" name="email" type="email" autocomplete="email" required placeholder="you@email.com"></div>
            <div class="form-field full"><label for="activation-machine">Machine Code</label><input id="activation-machine" name="Machine Code" type="text" required placeholder="Paste the Machine Code shown by InstallerLab"><span class="form-help">The license will be generated specifically for this Machine Code.</span></div>
            <div class="form-field"><label for="activation-transaction">PayPal transaction / reference</label><input id="activation-transaction" name="PayPal transaction" type="text" placeholder="Recommended"></div>
            <div class="form-field"><label for="activation-amount">Amount sent</label><input id="activation-amount" name="Amount" type="text" value="US$10" required placeholder="US$10"></div>
            <div class="form-field full"><label for="activation-receipt">PayPal receipt</label><input id="activation-receipt" name="attachment" type="file" required accept="image/png,image/jpeg,application/pdf"><span class="form-help">PNG, JPG or PDF. Maximum total size: 10 MB.</span></div>
            <div class="form-field full"><label for="activation-notes">Notes</label><textarea id="activation-notes" name="Notes" placeholder="Any additional information"></textarea></div>

            <div class="activation-check">
              <input id="activation-one-machine" name="One-machine license" value="Accepted" type="checkbox" required>
              <label for="activation-one-machine">I understand that the requested PRO activation is valid for <strong>one machine only</strong> and will be tied to the Machine Code entered above.</label>
            </div>

            <div class="activation-note"><strong>Direct delivery:</strong> this form uses FormSubmit as a delivery service so it can work from GitHub Pages without a private backend. The entered data and receipt are transmitted to that service for forwarding to ${SUPPORT_EMAIL}.</div>

            <div class="activation-actions">
              <button class="button primary" id="activation-send" type="submit">Send request →</button>
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
        return u.pathname.endsWith('/donate/') || a.textContent.trim().toLowerCase() === 'donate' || a.textContent.trim().toLowerCase() === 'donar';
      } catch { return false; }
    });
    if (donateTop) {
      donateTop.href = PAYPAL;
      donateTop.target = '_blank';
      donateTop.rel = 'noopener noreferrer';
      donateTop.textContent = (localStorage.getItem('il-lang') || 'es').toLowerCase() === 'en' ? 'Donate' : 'Donar';
      donateTop.title = 'PayPal.me/OfficeRibbon';
    }

    const footerDonate = [...document.querySelectorAll('.footer a')].find(a => /donate|donar|pro/i.test(a.textContent));
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
