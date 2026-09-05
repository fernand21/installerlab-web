(() => {
  const href = '/installerlab-web/community/';
  const label = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es' ? 'Comunidad' : 'Community';

  function addLink(){
    if(document.querySelector('a[data-installerlab-community-nav]')) return true;
    const nav = document.querySelector('header nav, .site-header nav, nav');
    if(!nav) return false;
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label();
    a.dataset.installerlabCommunityNav = '1';
    const download = [...nav.querySelectorAll('a')].find(x=>/download|descargar/i.test(x.textContent||''));
    if(download) nav.insertBefore(a,download); else nav.append(a);
    return true;
  }

  if(!addLink()){
    const observer = new MutationObserver(()=>{
      if(addLink()) observer.disconnect();
    });
    observer.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>observer.disconnect(),10000);
  }
})();
