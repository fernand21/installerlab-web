(() => {
  'use strict';
  const cfg = window.INSTALLERLAB_ANALYTICS_CONFIG || {};
  const base = String(cfg.url || '').replace(/\/$/, '');
  if (!base) return;

  const edge = `${base}/functions/v1/account-api`;
  const nativeFetch = window.fetch.bind(window);

  function isRpc(url, name) {
    try {
      const u = typeof url === 'string' ? url : url?.url;
      return typeof u === 'string' && u.includes(`/rest/v1/rpc/${name}`);
    } catch { return false; }
  }

  function bodyJson(init) {
    try {
      if (!init?.body) return {};
      if (typeof init.body === 'string') return JSON.parse(init.body || '{}');
    } catch {}
    return {};
  }

  window.fetch = async function(input, init = {}) {
    let action = null;
    let payload = {};

    if (isRpc(input, 'account_summary')) {
      action = 'summary';
    } else if (isRpc(input, 'register_analytics_project')) {
      action = 'register';
      const b = bodyJson(init);
      payload = { track_id: b.p_track_id, app_name: b.p_app_name };
    } else if (isRpc(input, 'remove_analytics_project')) {
      action = 'remove';
      const b = bodyJson(init);
      payload = { track_id: b.p_track_id };
    }

    if (!action) return nativeFetch(input, init);

    const headers = new Headers(init?.headers || {});
    const auth = headers.get('Authorization');
    const apikey = headers.get('apikey') || cfg.publishableKey || '';
    const edgeHeaders = new Headers();
    if (auth) edgeHeaders.set('Authorization', auth);
    if (apikey) edgeHeaders.set('apikey', apikey);
    edgeHeaders.set('Content-Type', 'application/json');

    return nativeFetch(edge, {
      method: 'POST',
      headers: edgeHeaders,
      body: JSON.stringify({ action, ...payload }),
      cache: 'no-store'
    });
  };
})();
