(() => {
  if (document.body?.dataset?.page !== 'donate') return;
  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  function apply(){
    const main=document.querySelector('.donate-page');
    if(!main || main.querySelector('[data-analytics-access-policy]')) return;
    const spanish=es();
    const section=document.createElement('section');
    section.className='donate-section';
    section.dataset.analyticsAccessPolicy='1';
    section.innerHTML=`<div class="section-head"><span class="eyebrow">InstallerLab Analytics</span><h2>${spanish?'La aplicación sigue libre. Analytics escala con tu apoyo.':'The desktop app stays free. Analytics scales with your support.'}</h2><p>${spanish?'Todas las funciones locales de InstallerLab continúan disponibles. La cuenta web gratuita incluye Analytics completo para una aplicación; supporters y usuarios PRO pueden conectar más aplicaciones.':'All local InstallerLab features remain available. A free web account includes complete Analytics for one application; supporters and PRO users can connect more applications.'}</p></div><div class="support-scope-grid"><article><span>1</span><div><h3>${spanish?'Cuenta gratuita':'Free account'}</h3><p>${spanish?'1 aplicación Analytics · Dashboard completo · Historial en Google Drive cuando esté habilitado.':'1 Analytics application · Full dashboard · Google Drive history when enabled.'}</p></div></article><article><span>★</span><div><h3>Supporter</h3><p>${spanish?'Política inicial: hasta 5 aplicaciones Analytics.':'Initial policy: up to 5 Analytics applications.'}</p></div></article><article><span>PRO</span><div><h3>${spanish?'Licencia PRO':'PRO license'}</h3><p>${spanish?'Política inicial: hasta 10 aplicaciones Analytics. La capacidad se administra desde la web, no desde la aplicación de escritorio.':'Initial policy: up to 10 Analytics applications. Capacity is managed on the website, not in the desktop app.'}</p></div></article></div>`;
    const target=main.querySelector('#pro') || main.lastElementChild;
    if(target) target.insertAdjacentElement('beforebegin',section); else main.appendChild(section);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,0));else setTimeout(apply,0);
  window.addEventListener('storage',()=>setTimeout(apply,0));
})();
