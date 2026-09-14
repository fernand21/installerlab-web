(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'account') return;
  if (window.__installerLabEntitlementClaimBound) return;
  window.__installerLabEntitlementClaimBound = true;

  const sessionKey = 'installerlab-account-session-v1';
  const pendingClaimKey = 'installerlab-pending-claim-v1';
  const cfg = window.INSTALLERLAB_ANALYTICS_CONFIG || {};
  const base = String(cfg.url || '').replace(/\/$/, '');
  const anon = String(cfg.publishableKey || '');
  let scheduled = false;

  const isSpanish = () => (localStorage.getItem('il-lang') || 'en').toLowerCase().startsWith('es');
  const copy = () => isSpanish() ? {
    kicker: 'Activación segura', title: 'Canjear beneficio de InstallerLab',
    intro: 'Si recibiste un QR/código Supporter o PRO, vincúlalo aquí a tu cuenta.',
    found: 'Beneficio de InstallerLab encontrado', foundText: 'Este beneficio de un solo uso quedará vinculado a tu cuenta.',
    label: 'Token de beneficio', placeholder: 'Pega el token firmado…', button: 'Canjear',
    linkButton: 'Vincular a mi cuenta',
    help: 'El token se valida en el servidor y no se guarda en el navegador.', loading: 'Validando…',
    success: 'Beneficio activado. Actualizando tu cuenta…', linkedPro: '✓ InstallerLab PRO vinculado', linkedSupporter: '✓ InstallerLab Supporter vinculado',
    redeemed: 'Este beneficio ya fue canjeado.', revoked: 'Este beneficio ya no es válido.', expired: 'Este beneficio ha expirado.',
    notSigned: 'Inicia sesión para canjear una licencia.',
    invalid: 'El token no es válido, está vencido, revocado o ya fue canjeado.',
    unavailable: 'El servicio de activación no está disponible todavía.',
    error: 'No se pudo activar la licencia.'
  } : {
    kicker: 'Secure activation', title: 'Redeem InstallerLab benefit',
    intro: 'If you received a Supporter or PRO QR/code, link it to your account here.',
    found: 'InstallerLab benefit found', foundText: 'This one-time benefit will be linked to your account.',
    label: 'Benefit token', placeholder: 'Paste the signed token…', button: 'Redeem',
    linkButton: 'Link to my account',
    help: 'The token is verified server-side and is not stored in your browser.', loading: 'Validating…',
    success: 'Benefit activated. Refreshing your account…', linkedPro: '✓ InstallerLab PRO linked', linkedSupporter: '✓ InstallerLab Supporter linked',
    redeemed: 'This benefit has already been redeemed.', revoked: 'This benefit is no longer valid.', expired: 'This benefit has expired.',
    notSigned: 'Sign in to redeem a license.',
    invalid: 'The token is invalid, expired, revoked, or already redeemed.',
    unavailable: 'The activation service is not available yet.',
    error: 'The license could not be activated.'
  };

  function session() {
    try { return JSON.parse(localStorage.getItem(sessionKey) || 'null'); } catch { return null; }
  }

  function captureClaimFromUrl() {
    const params = new URLSearchParams(location.search);
    const claim = String(params.get('claim') || '').trim();
    if (claim && claim.length <= 20000) {
      try { sessionStorage.setItem(pendingClaimKey, claim); } catch {}
      params.delete('claim');
      const query = params.toString();
      history.replaceState({}, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
    }
  }

  function pendingClaim() {
    try { return String(sessionStorage.getItem(pendingClaimKey) || ''); } catch { return ''; }
  }

  function message(node, value, state = '') {
    node.textContent = value || '';
    node.className = `account-entitlement-message ${state}`;
  }

  function mountPendingNotice() {
    const root = document.getElementById('app');
    if (!root || !pendingClaim() || root.querySelector('[data-entitlement-pending]') || root.querySelector('#account-logout')) return;
    const notice = document.createElement('div');
    notice.className = 'account-note account-entitlement-pending';
    notice.dataset.entitlementPending = '1';
    notice.textContent = isSpanish() ? 'Inicia sesión para vincular este beneficio a tu cuenta.' : 'Sign in to link this benefit to your account.';
    const shell = root.querySelector('.account-shell');
    shell?.prepend(notice);
  }

  function mount() {
    const root = document.getElementById('app');
    if (!root || root.querySelector('[data-entitlement-claim]')) return;
    if (!root.querySelector('#account-logout')) return;
    const t = copy();
    const card = document.createElement('article');
    card.className = 'account-card account-entitlement-card';
    card.dataset.entitlementClaim = '1';
    const fromQr = !!pendingClaim();
    card.innerHTML = `<div class="account-head"><div><span class="account-kicker">${t.kicker}</span><h2>${t.title}</h2></div><span class="account-badge supporter">ONE-TIME</span></div>${fromQr ? `<p class="account-entitlement-found"><strong>${t.found}</strong><span>${t.foundText}</span></p>` : ''}<p class="account-entitlement-copy">${t.intro}</p><form class="account-entitlement-form"><label>${t.label}<input name="token" type="text" inputmode="text" autocomplete="off" spellcheck="false" maxlength="20000" placeholder="${t.placeholder}" required></label><button class="account-btn primary" type="submit">${fromQr ? t.linkButton : t.button}</button></form><div class="account-entitlement-help">${t.help}</div><div class="account-entitlement-message" role="status" aria-live="polite"></div>`;
    const grid = root.querySelector('.account-grid');
    if (!grid) return;
    grid.appendChild(card);
    const form = card.querySelector('form');
    const input = card.querySelector('input');
    const submit = card.querySelector('button');
    const status = card.querySelector('.account-entitlement-message');
    input.value = pendingClaim();
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const token = String(input.value || '').trim();
      const current = session();
      if (!current?.access_token) { message(status, t.notSigned, 'error'); return; }
      if (!base || !anon || !token) { message(status, t.error, 'error'); return; }
      submit.disabled = true;
      message(status, t.loading);
      try {
        const response = await fetch(`${base}/functions/v1/redeem-entitlement`, {
          method: 'POST',
          headers: { apikey: anon, Authorization: `Bearer ${current.access_token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ claim: token }),
          cache: 'no-store'
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || data.success !== true) {
          const apiMessage = String(data.message || '').toLowerCase();
          let errorText = t.error;
          if (response.status === 409 || apiMessage.includes('already been redeemed')) errorText = t.redeemed;
          else if (response.status === 410 && apiMessage.includes('expired')) errorText = t.expired;
          else if (response.status === 410) errorText = t.revoked;
          else if (response.status === 400) errorText = t.invalid;
          else if (response.status >= 500) errorText = t.unavailable;
          message(status, errorText, 'error');
          submit.disabled = false;
          return;
        }
        input.value = '';
        try { sessionStorage.removeItem(pendingClaimKey); } catch {}
        message(status, result.tier === 'pro' ? t.linkedPro : t.linkedSupporter, 'ok');
        setTimeout(async () => {
          if (typeof window.installerLabAccountRefresh === 'function') {
            await window.installerLabAccountRefresh();
          } else {
            window.location.reload();
          }
        }, 350);
      } catch {
        message(status, t.unavailable, 'error');
        submit.disabled = false;
      }
    });
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; mountPendingNotice(); mount(); });
  }

  captureClaimFromUrl();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  else schedule();
  window.addEventListener('installerlab:account-rendered', schedule);
  window.addEventListener('installerlab:account-session', schedule);
  window.addEventListener('storage', event => { if (event.key === sessionKey || event.key === 'il-lang') schedule(); });
})();
