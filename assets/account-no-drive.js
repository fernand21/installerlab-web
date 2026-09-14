(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'account') return;

  function clean() {
    const root = document.getElementById('app');
    if (!root) return;

    root.querySelectorAll('.account-policy > div').forEach(item => {
      const label = (item.querySelector('b')?.textContent || '').trim().toLowerCase();
      if (label === 'drive' || label.includes('google drive')) item.remove();
    });

    root.querySelectorAll('.account-card').forEach(card => {
      const heading = (card.querySelector('h2')?.textContent || '').trim().toLowerCase();
      const kicker = (card.querySelector('.account-kicker')?.textContent || '').trim().toLowerCase();
      if (heading.includes('google drive') || kicker === 'archive' || kicker === 'archivo') card.remove();
    });

    root.querySelectorAll('.account-app small').forEach(node => {
      if (/drive/i.test(node.textContent || '')) node.remove();
    });

    root.querySelectorAll('h1,p,.account-note,.account-muted').forEach(node => {
      const value = node.textContent || '';
      if (/Drive archive|archivo en Drive|Google Drive|Supabase/i.test(value)) {
        node.textContent = value
          .replace(/, proyectos y tu archivo en Drive\.?/gi, ' y proyectos.')
          .replace(/projects and your Drive archive\.?/gi, 'projects.')
          .replace(/Google Drive/gi, 'InstallerLab Cloud')
          .replace(/Drive archive/gi, 'cloud history')
          .replace(/archivo en Drive/gi, 'histórico en la nube')
          .replace(/Supabase/gi, 'MySQL');
      }
    });
  }

  const run = () => requestAnimationFrame(clean);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once:true });
  else run();

  const root = document.getElementById('app');
  if (root) new MutationObserver(run).observe(root, { childList:true, subtree:true });
})();
