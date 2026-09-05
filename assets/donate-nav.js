(() => {
  const projectBase = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  const donateUrl = projectBase + 'donate/';
  const homeUrl = projectBase;
  const forumUrl = projectBase + 'community/';
  let scheduled = false;

  function isSpanish() {
    return (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  }

  function ensureGlobalNavLinks() {
    const links = document.querySelector('.header .links');
    if (!links) return;

    let home = links.querySelector('[data-installerlab-home-nav]');
    if (!home) {
      home = document.createElement('a');
      home.dataset.installerlabHomeNav = '1';
      home.href = homeUrl;
      links.insertBefore(home, links.firstElementChild || null);
    }
    home.textContent = isSpanish() ? 'Inicio' : 'Home';

    let forum = links.querySelector('[data-installerlab-forum-nav]');
    if (!forum) {
      forum = document.createElement('a');
      forum.dataset.installerlabForumNav = '1';
      forum.href = forumUrl;
      const download = [...links.querySelectorAll('a')].find(a => /download|descargar/i.test(a.textContent || ''));
      if (download) links.insertBefore(forum, download);
      else links.appendChild(forum);
    }
    forum.textContent = isSpanish() ? 'Foro' : 'Forum';
  }

  function fixDonateLink() {
    const links = document.querySelectorAll('.header .links a, header a');
    links.forEach(a => {
      const text = (a.textContent || '').trim().toLowerCase();
      if (text === 'donate' || text === 'donar') {
        a.href = donateUrl;
        a.removeAttribute('target');
        a.removeAttribute('rel');
        a.title = text === 'donar' ? 'Apoyar InstallerLab' : 'Support InstallerLab';
      }
    });
    ensureGlobalNavLinks();
  }

  function scheduleFix() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      fixDonateLink();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fixDonateLink);
  else fixDonateLink();

  new MutationObserver(scheduleFix).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('storage', scheduleFix);
})();
