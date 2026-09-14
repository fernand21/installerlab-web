(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const STORAGE_KEY = 'installerlab_magicapi_read_token';
  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';

  function getToken() {
    try { return String(localStorage.getItem(STORAGE_KEY) || '').trim(); }
    catch { return ''; }
  }

  function saveToken(value) {
    try { localStorage.setItem(STORAGE_KEY, value); return true; }
    catch { return false; }
  }

  function showTokenDialog() {
    if (document.getElementById('il-magic-token-dialog')) return;

    const overlay = document.createElement('div');
    overlay.id = 'il-magic-token-dialog';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(2,10,22,.72);display:grid;place-items:center;padding:20px;backdrop-filter:blur(4px)';

    const box = document.createElement('div');
    box.style.cssText = 'width:min(520px,100%);background:#0b223b;border:1px solid #28547a;border-radius:16px;padding:22px;box-shadow:0 20px 70px rgba(0,0,0,.45);color:#e8f4ff;font-family:inherit';

    const title = document.createElement('h3');
    title.textContent = es() ? 'Conectar Analytics' : 'Connect Analytics';
    title.style.cssText = 'margin:0 0 8px;font-size:1.25rem';

    const text = document.createElement('p');
    text.textContent = es()
      ? 'Introduce el token MagicApi con permiso READ. Se guardará únicamente en este navegador.'
      : 'Enter the MagicApi token with READ permission. It will be stored only in this browser.';
    text.style.cssText = 'margin:0 0 16px;color:#9fc8ec;line-height:1.45';

    const input = document.createElement('input');
    input.type = 'password';
    input.autocomplete = 'off';
    input.placeholder = 'magic_…';
    input.style.cssText = 'width:100%;box-sizing:border-box;padding:12px 14px;border-radius:10px;border:1px solid #2f5c83;background:#071a2d;color:#fff;font:inherit;outline:none';

    const error = document.createElement('div');
    error.style.cssText = 'min-height:20px;margin-top:8px;color:#ffaaaa;font-size:.86rem';

    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;justify-content:flex-end;gap:10px;margin-top:16px';

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = es() ? 'Cancelar' : 'Cancel';
    cancel.style.cssText = 'padding:10px 16px;border-radius:9px;border:1px solid #315b80;background:#102b46;color:#d9ecff;cursor:pointer';

    const connect = document.createElement('button');
    connect.type = 'button';
    connect.textContent = es() ? 'Conectar' : 'Connect';
    connect.style.cssText = 'padding:10px 16px;border-radius:9px;border:0;background:#39a9ff;color:#03111e;font-weight:700;cursor:pointer';

    const close = () => overlay.remove();
    cancel.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    const commit = () => {
      const value = input.value.trim();
      if (!/^magic_[A-Za-z0-9_-]{20,}$/.test(value)) {
        error.textContent = es() ? 'Introduce un token MagicApi válido.' : 'Enter a valid MagicApi token.';
        input.focus();
        return;
      }
      if (!saveToken(value)) {
        error.textContent = es() ? 'No se pudo guardar el token en este navegador.' : 'The token could not be stored in this browser.';
        return;
      }
      close();
      location.reload();
    };

    connect.addEventListener('click', commit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') commit(); });

    actions.append(cancel, connect);
    box.append(title, text, input, error, actions);
    overlay.append(box);
    document.body.append(overlay);
    setTimeout(() => input.focus(), 0);
  }

  document.addEventListener('click', event => {
    if (getToken()) return;
    const trigger = event.target.closest('.iax-picker,.iax-connect-banner button,.iax-side-foot button');
    if (!trigger) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showTokenDialog();
  }, true);
})();
