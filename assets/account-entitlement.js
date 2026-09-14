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
    kicker: 'Activación segura', title: 'Canjear licencia',
    intro: 'Pega aquí el token de un solo uso que recibiste para activar Supporter o PRO en esta cuenta.',
    label: 'Token de licencia', placeholder: 'Pega el token firmado…', button: 'Canjear token',
    help: 'El token se valida en el servidor y no se guarda en el navegador.', loading: 'Validando…',
    success: 'Licencia activada. Actualizando tu cuenta…',
    notSigned: 'Inicia sesión para canjear una licencia.',
    invalid: 'El token no es válido, está vencido, revocado o ya fue canjeado.',
    unavailable: 'El servicio de activación no está disponible todavía.',
    error: 'No se pudo activar la licencia.'
  } : {
    kicker: 'Secure activation', title: 'Redeem a license',
    intro: 'Paste the single-use token you received to activate Supporter or PRO on this account.',
    label: 'License token', placeholder: 'Paste the signed token…', button: 'Redeem token',
    help: 'The token is verified server-side and is not stored in your browser.', loading: 'Validating…',
    success: 'License activated. Refreshing your account…',
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

  function mount() {
    const root = document.getElementById('app');
    if (!root || root.querySelector('[data-entitlement-claim]')) return;
    if (!root.querySelector('#account-logout')) return;
    const t = copy();
    const card = document.createElement('article');
    card.className = 'account-card account-entitlement-card';
    card.dataset.entitlementClaim = '1';
    card.innerHTML = `<div class="account-head"><div><span class="account-kicker">${t.kicker}</span><h2>${t.title}</h2></div><span class="account-badge supporter">ONE-TIME</span></div><p class="account-entitlement-copy">${t.intro}</p><form class="account-entitlement-form"><label>${t.label}<input name="token" type="text" inputmode="text" autocomplete="off" spellcheck="false" maxlength="20000" placeholder="${t.placeholder}" required></label><button class="account-btn primary" type="submit">${t.button}</button></form><div class="account-entitlement-help">${t.help}</div><div class="account-entitlement-message" role="status" aria-live="polite"></div>`;
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
          const known = ['invalid', 'expired', 'revoked', 'redeemed'];
          message(status, known.includes(String(data.reason || '').toLowerCase()) ? t.invalid : (response.status >= 500 ? t.unavailable : t.error), 'error');
          submit.disabled = false;
          return;
        }
        input.value = '';
        try { sessionStorage.removeItem(pendingClaimKey); } catch {}
        message(status, t.success, 'ok');
        setTimeout(() => window.location.reload(), 700);
      } catch {
        message(status, t.unavailable, 'error');
        submit.disabled = false;
      }
    });
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; mount(); });
  }

  captureClaimFromUrl();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  else schedule();
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('installerlab:account-session', schedule);
  window.addEventListener('storage', event => { if (event.key === sessionKey || event.key === 'il-lang') schedule(); });
})();
