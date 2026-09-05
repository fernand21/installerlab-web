(() => {
  const base = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  const label = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es' ? 'Comunidad' : 'Community';

  function addCommunityLinks() {
    const links = document.querySelector('.header .links');
    if (links && !links.querySelector('[data-installerlab-community]')) {
      const a = document.createElement('a');
      a.href = base + 'community/';
      a.dataset.installerlabCommunity = '1';
      a.textContent = label();
      const download = [...links.querySelectorAll('a')].find(x => /download|descargar/i.test(x.textContent));
      if (download) links.insertBefore(a, download); else links.appendChild(a);
    }

    const community = document.querySelector('[data-installerlab-community]');
    if (community) community.textContent = label();

    const supportCol = [...document.querySelectorAll('.footer h4')].find(h => /support|soporte/i.test(h.textContent))?.parentElement;
    if (supportCol && !supportCol.querySelector('[data-installerlab-community-footer]')) {
      const a = document.createElement('a');
      a.href = base + 'community/';
      a.dataset.installerlabCommunityFooter = '1';
      a.textContent = label();
      supportCol.insertBefore(a, supportCol.firstElementChild?.nextSibling || null);
    }
    const footer = document.querySelector('[data-installerlab-community-footer]');
    if (footer) footer.textContent = label();
  }

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      addCommunityLinks();
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addCommunityLinks, {once:true});
  else addCommunityLinks();

  new MutationObserver(queue).observe(document.body, {childList:true, subtree:true});
  window.addEventListener('storage', queue);
})();
