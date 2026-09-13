(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;
  const isES=()=> (localStorage.getItem('il-lang')||'en').toLowerCase()==='es';
  function add(){
    const bar=document.querySelector('.iax-appbar');
    if(!bar||bar.querySelector('.iax-drive-sync-link')) return;
    const a=document.createElement('a');
    a.className='iax-demo-toggle iax-drive-sync-link';
    a.href='../account/?drive=sync';
    a.textContent=isES()?'↻ Sincronizar Drive':'↻ Sync Drive';
    a.style.textDecoration='none';
    const demo=bar.querySelector('.iax-demo-toggle');
    if(demo) bar.insertBefore(a,demo); else bar.appendChild(a);
  }
  new MutationObserver(()=>requestAnimationFrame(add)).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',add,{once:true}); else add();
})();
