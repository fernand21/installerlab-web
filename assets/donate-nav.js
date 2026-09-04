(() => {
  const projectBase = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  const donateUrl = projectBase + 'donate/';
  let scheduled = false;

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
})();
