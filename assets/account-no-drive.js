(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'account') return;

  const sessionKey = 'installerlab-account-session-v1';
  let scheduled = false;

  function hasSession() {
    try {
      return !!JSON.parse(localStorage.getItem(sessionKey) || 'null')?.access_token;
    } catch {
      return false;
    }
  }

  function cleanAccountPage() {
    const root = document.getElementById('app');
    if (!root) return;

    // Remove every visible Drive/archive feature block. Google authentication
    // remains untouched; only the retired Google Drive integration is removed.
    root.querySelectorAll('.account-policy > div').forEach(item => {
      const text = (item.textContent || '').toLowerCase();
      if (/google\s+drive|drive\s+archive|archivo\s+en\s+drive|\bdrive\b/.test(text)) item.remove();
    });

    root.querySelectorAll('.account-card').forEach(card => {
      const heading = (card.querySelector('h2')?.textContent || '').trim().toLowerCase();
      const kicker = (card.querySelector('.account-kicker')?.textContent || '').trim().toLowerCase();
      const text = (card.textContent || '').toLowerCase();
      if (
        card.querySelector('.account-drive') ||
        heading.includes('google drive') ||
        kicker === 'archive' ||
        kicker === 'archivo' ||
        text.includes('connect google drive') ||
        text.includes('conectar google drive')
      ) card.remove();
    });

    root.querySelectorAll('.account-app small').forEach(node => {
      if (/\bdrive\b/i.test(node.textContent || '')) node.remove();
    });

    root.querySelectorAll('h1,p,.account-note,.account-muted,span').forEach(node => {
      const value = node.textContent || '';
      if (!/Google Drive|Drive archive|archivo en Drive|your Drive archive|Supabase/i.test(value)) return;
      let next = value
        .replace(/Una cuenta para Analytics, proyectos y tu archivo en Drive\.?/gi, 'Una cuenta para Analytics y tus proyectos.')
        .replace(/One account for Analytics, projects and your Drive archive\.?/gi, 'One account for Analytics and your projects.')
        .replace(/, proyectos y tu archivo en Drive\.?/gi, ' y tus proyectos.')
        .replace(/projects and your Drive archive\.?/gi, 'projects.')
        .replace(/Google Drive/gi, 'Cloud')
        .replace(/Drive archive/gi, 'Cloud history')
        .replace(/archivo en Drive/gi, 'histórico Cloud')
        .replace(/Supabase/gi, 'Cloud');
      node.textContent = next;
    });
  }

  function cleanNavigation() {
    if (!hasSession()) return;
    document.querySelectorAll('.header a[href]').forEach(anchor => {
      try {
        const url = new URL(anchor.getAttribute('href'), location.href);
        if (/\/account\/?$/.test(url.pathname)) anchor.remove();
      } catch {}
    });
    document.querySelectorAll('.header .il-account-wrap').forEach(node => node.remove());
  }

  function clean() {
    cleanAccountPage();
    cleanNavigation();
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      clean();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once:true });
  } else {
    schedule();
  }

  new MutationObserver(schedule).observe(document.documentElement, {
    childList:true,
    subtree:true,
    characterData:true
  });
  window.addEventListener('installerlab:account-session', schedule);
  window.addEventListener('storage', schedule);
})();
