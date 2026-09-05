(() => {
  const projectBase = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  const donateUrl = projectBase + 'donate/';
  const roadmapUrl = projectBase + 'roadmap/';
  let scheduled = false;

  function currentSpanish() {
    return (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  }

  function fixTopNav() {
    const es = currentSpanish();
    const links = document.querySelectorAll('.header .links a, header a');
    links.forEach(a => {
      const text = (a.textContent || '').trim().toLowerCase();
      if (text === 'donate' || text === 'donar') {
        a.href = donateUrl;
        a.removeAttribute('target');
        a.removeAttribute('rel');
        a.title = es ? 'Apoyar InstallerLab' : 'Support InstallerLab';
      }
    });

    const nav = document.querySelector('.header .links, header .links');
    if (!nav) return;
    let roadmap = Array.from(nav.querySelectorAll('a')).find(a => {
      const text = (a.textContent || '').trim().toLowerCase();
      return text === 'roadmap' || text === 'hoja de ruta' || a.getAttribute('href') === roadmapUrl;
    });
    if (!roadmap) {
      roadmap = document.createElement('a');
      roadmap.dataset.installerlabRoadmap = '1';
      const donate = Array.from(nav.querySelectorAll('a')).find(a => {
        const text = (a.textContent || '').trim().toLowerCase();
        return text === 'donate' || text === 'donar';
      });
      if (donate) nav.insertBefore(roadmap, donate);
      else nav.appendChild(roadmap);
    }
    roadmap.href = roadmapUrl;
    roadmap.textContent = es ? 'Hoja de ruta' : 'Roadmap';
    roadmap.title = es ? 'Hoja de ruta pública de InstallerLab' : 'InstallerLab public roadmap';
  }

  function scheduleFix() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      fixTopNav();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fixTopNav);
  else fixTopNav();

  new MutationObserver(scheduleFix).observe(document.documentElement, { childList: true, subtree: true });
})();
