(() => {
  const base = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  let queued = false;

  function isSpanish(){
    return (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  }

  function ensureLegalLinks(){
    const legal = document.querySelector('.footer .legal');
    if(!legal) return;

    let wrap = legal.querySelector('[data-installerlab-legal-links]');
    if(!wrap){
      wrap = document.createElement('span');
      wrap.dataset.installerlabLegalLinks = '1';
      wrap.style.marginLeft = '10px';
      legal.appendChild(wrap);
    }

    wrap.innerHTML = isSpanish()
      ? ` · <a href="${base}privacy/">Privacidad</a> · <a href="${base}terms/">Condiciones del servicio</a>`
      : ` · <a href="${base}privacy/">Privacy</a> · <a href="${base}terms/">Terms of Service</a>`;
  }

  function ensureLegacyLinks(){
    // The universal navigation already provides Home and Community.
    // Do not add the old direct links when that navigation is active.
    if(window.__INSTALLERLAB_GLOBAL_NAV_V4__) return;

    const links = document.querySelector('.header .links');
    if(!links) return;

    let home = links.querySelector('[data-installerlab-home-nav]');
    if(!home){
      home = document.createElement('a');
      home.dataset.installerlabHomeNav = '1';
      home.href = base;
      links.insertBefore(home, links.firstElementChild || null);
    }
    home.textContent = isSpanish() ? 'Inicio' : 'Home';

    let forum = links.querySelector('[data-installerlab-forum-nav]');
    if(!forum){
      forum = document.createElement('a');
      forum.dataset.installerlabForumNav = '1';
      forum.href = base + 'community/';
      const download = [...links.querySelectorAll('a')].find(a => /download|descargar/i.test(a.textContent || ''));
      if(download) links.insertBefore(forum, download);
      else links.appendChild(forum);
    }
    forum.textContent = isSpanish() ? 'Foro' : 'Forum';
  }

  function apply(){
    ensureLegacyLinks();
    ensureLegalLinks();
  }

  function queue(){
    if(queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      apply();
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, {once:true});
  else apply();

  new MutationObserver(queue).observe(document.body, {childList:true, subtree:true});
  window.addEventListener('storage', queue);
})();
