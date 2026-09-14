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
    section.innerHTML=`<div class="section-head"><span class="eyebrow">InstallerLab Analytics</span><h2>${spanish?'La aplicación sigue libre. Analytics escala con tu cuenta.':'The desktop app stays free. Analytics scales with your account.'}</h2><p>${spanish?'Todas las funciones locales de InstallerLab continúan disponibles sin registro. La cuenta web se necesita únicamente para vincular TrackID y usar Analytics Cloud. Registrarse es gratuito y ya incluye Analytics completo para una aplicación.':'All local InstallerLab features remain available without registration. A web account is only required to link TrackIDs and use Analytics Cloud. Registration is free and already includes full Analytics for one application.'}</p></div><div class="support-scope-grid"><article><span>1</span><div><h3>${spanish?'Cuenta gratuita':'Free account'}</h3><p>${spanish?'1 aplicación Analytics · Dashboard completo · Hasta 24 meses de historial.':'1 Analytics application · Full dashboard · Up to 24 months of history.'}</p></div></article><article><span>★</span><div><h3>Supporter</h3><p>${spanish?'Hasta 5 aplicaciones Analytics · Dashboard completo · Hasta 24 meses de historial.':'Up to 5 Analytics applications · Full dashboard · Up to 24 months of history.'}</p></div></article><article><span>PRO</span><div><h3>${spanish?'Licencia PRO':'PRO license'}</h3><p>${spanish?'Hasta 10 aplicaciones Analytics · Dashboard completo · Hasta 24 meses de historial. La capacidad se administra desde la cuenta web, no desde InstallerLab Desktop.':'Up to 10 Analytics applications · Full dashboard · Up to 24 months of history. Capacity is managed from the web account, not from InstallerLab Desktop.'}</p></div></article></div>`;
    const target=main.querySelector('#pro') || main.lastElementChild;
    if(target) target.insertAdjacentElement('beforebegin',section); else main.appendChild(section);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,0));else setTimeout(apply,0);
  window.addEventListener('storage',()=>setTimeout(apply,0));
})();
