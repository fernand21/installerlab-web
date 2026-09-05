(() => {
  const base = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  let queued = false;

  function isSpanish(){
    return (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  }

  function ensureLinks(){
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

  function queue(){
    if(queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      ensureLinks();
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureLinks, {once:true});
  else ensureLinks();

  new MutationObserver(queue).observe(document.body, {childList:true, subtree:true});
  window.addEventListener('storage', queue);
})();
