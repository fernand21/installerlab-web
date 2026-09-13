// Public client configuration for InstallerLab Analytics.
// This is intentionally the Supabase publishable key. Never put a
// service_role/secret key in this static site or in a generated installer.
window.INSTALLERLAB_ANALYTICS_CONFIG = Object.freeze({
  url: 'https://kjbmheqsebikpvamotov.supabase.co',
  publishableKey: 'sb_publishable_0fA4y3-87oHZEaA2zZZGUQ_d__9tteR',

  // Account rollout is intentionally feature-flagged. Enable the gate only
  // after the account flow has been verified end-to-end in production.
  accountGateEnabled: false,
  accountPolicy: Object.freeze({
    freeApps: 1,
    supporterApps: 5,
    proApps: 10
  })
});

// Account API bridge.
// The account page was originally prepared against PostgREST RPC names.
// During rollout we route those calls through a JWT-protected Edge Function
// so entitlement checks and writes are enforced server-side.
(() => {
  if (document.body?.dataset?.page !== 'account') return;
  const cfg = window.INSTALLERLAB_ANALYTICS_CONFIG || {};
  const base = String(cfg.url || '').replace(/\/$/, '');
  if (!base) return;

  const edge = `${base}/functions/v1/account-api`;
  const nativeFetch = window.fetch.bind(window);

  function rpcName(input) {
    try {
      const value = typeof input === 'string' ? input : input?.url;
      if (typeof value !== 'string') return '';
      const match = value.match(/\/rest\/v1\/rpc\/(account_summary|register_analytics_project|remove_analytics_project)(?:\?|$)/);
      return match ? match[1] : '';
    } catch { return ''; }
  }

  function parseBody(init) {
    try {
      return typeof init?.body === 'string' ? JSON.parse(init.body || '{}') : {};
    } catch { return {}; }
  }

  window.fetch = function(input, init = {}) {
    const rpc = rpcName(input);
    if (!rpc) return nativeFetch(input, init);

    const originalHeaders = new Headers(init.headers || {});
    const authorization = originalHeaders.get('Authorization') || '';
    const apikey = originalHeaders.get('apikey') || cfg.publishableKey || '';
    const source = parseBody(init);
    let payload = { action: 'summary' };

    if (rpc === 'register_analytics_project') {
      payload = { action: 'register', track_id: source.p_track_id || '', app_name: source.p_app_name || '' };
    } else if (rpc === 'remove_analytics_project') {
      payload = { action: 'remove', track_id: source.p_track_id || '' };
    }

    return nativeFetch(edge, {
      method: 'POST',
      headers: {
        'Authorization': authorization,
        'apikey': apikey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });
  };
})();
