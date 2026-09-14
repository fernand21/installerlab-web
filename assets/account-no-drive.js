(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'account') return;

  let scheduled = false;

  function cleanAccountPage() {
    const root = document.getElementById('app');
    if (!root) return;

    // Remove retired Google Drive/archive UI only. Google authentication and
    // the Account / My account navigation entry remain available.
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
        text.includes('google drive') ||
        text.includes('drive archive') ||
        text.includes('archivo en drive') ||
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
      node.textContent = value
        .replace(/Una cuenta para Analytics, proyectos y tu archivo en Drive\.?/gi, 'Una cuenta para Analytics y tus proyectos.')
        .replace(/One account for Analytics, projects and your Drive archive\.?/gi, 'One account for Analytics and your projects.')
        .replace(/, proyectos y tu archivo en Drive\.?/gi, ' y tus proyectos.')
        .replace(/projects and your Drive archive\.?/gi, 'projects.')
        .replace(/Google Drive/gi, '')
        .replace(/Drive archive/gi, '')
        .replace(/archivo en Drive/gi, '')
        .replace(/Supabase/gi, 'Cloud');
    });
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      cleanAccountPage();
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
})();
