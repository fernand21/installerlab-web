// Public client configuration for InstallerLab Analytics.
// This is intentionally the Supabase publishable key. Never put a
// service_role/secret key in this static site or in a generated installer.
window.INSTALLERLAB_ANALYTICS_CONFIG = Object.freeze({
  url: 'https://kjbmheqsebikpvamotov.supabase.co',
  publishableKey: 'sb_publishable_0fA4y3-87oHZEaA2zZZGUQ_d__9tteR',

  // Account rollout is intentionally feature-flagged. Enable the gate only
  // after supabase/account-analytics.sql has been applied successfully.
  accountGateEnabled: false,
  accountPolicy: Object.freeze({
    freeApps: 1,
    supporterApps: 5,
    proApps: 10
  })
});
