(() => {
  const BASE = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  const PAYPAL = 'https://paypal.me/OfficeRibbon';
  let queued = false;

  const isSpanish = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';

  function copy(es){
    return es ? {
      nav:'Licencia PRO',
      badge:'LICENCIA PRO',
      title:'Obtén InstallerLab PRO',
      lead:'Activa las funciones PRO en tu equipo y, al mismo tiempo, ayuda a sostener el desarrollo independiente de InstallerLab.',
      primary:'Obtener licencia PRO →',
      paypal:'Pagar / aportar con PayPal ↗',
      benefits:'¿Qué desbloquea la licencia PRO?',
      b1:'01 · 21 temas visuales PRO',
      b1b:'Desbloquea el catálogo de temas PRO para dar a tus instaladores una presentación más cuidada y diferenciada.',
      b2:'02 · Portable Builder PRO',
      b2b:'Permite crear paquetes Portable de otras aplicaciones Windows desde InstallerLab, además de usar la edición Portable de InstallerLab.',
      b3:'03 · Más opciones de personalización visual',
      b3b:'Los temas PRO amplían las posibilidades de apariencia y branding frente al catálogo gratuito y Community.',
      process:'Cómo obtenerla',
      f1:'Desde US$10',
      f1b:'Las contribuciones de US$10 o más pueden solicitar activación PRO tras verificación manual.',
      f2:'1 máquina',
      f2b:'La activación PRO actual se vincula al Machine Code del equipo solicitado.',
      f3:'Proceso simple',
      f3b:'Realiza el aporte, copia tu Machine Code y envía el comprobante desde la página de licencia.',
      note:'El certificado permanente es un beneficio separado para cualquier aporte desde US$1. La licencia PRO añade las funciones anteriores y se solicita desde US$10.'
    } : {
      nav:'PRO License',
      badge:'PRO LICENSE',
      title:'Get InstallerLab PRO',
      lead:'Unlock PRO capabilities on your machine while helping sustain InstallerLab as an independent project.',
      primary:'Get PRO license →',
      paypal:'Pay / support with PayPal ↗',
      benefits:'What does the PRO license unlock?',
      b1:'01 · 21 PRO visual themes',
      b1b:'Unlocks the PRO theme catalog for a more polished and distinctive installer presentation.',
      b2:'02 · PRO Portable Builder',
      b2b:'Lets you create Portable packages for other Windows applications from InstallerLab, beyond using InstallerLab itself as a portable app.',
      b3:'03 · More visual customization options',
      b3b:'PRO themes expand appearance and branding choices beyond the free and Community catalogs.',
      process:'How to get it',
      f1:'From US$10',
      f1b:'Contributions of US$10 or more may request PRO activation after manual verification.',
      f2:'1 machine',
      f2b:'The current PRO activation is tied to the Machine Code of the requested computer.',
      f3:'Simple process',
      f3b:'Make the contribution, copy your Machine Code, and send the receipt from the license page.',
      note:'The permanent supporter certificate is a separate benefit for any contribution from US$1. The PRO license adds the capabilities above and may be requested from US$10.'
    };
  }

  function ensureNav(es){
    const actions = document.querySelector('.header .actions');
    if(!actions) return;
    let link = actions.querySelector('[data-installerlab-license-nav]');
    if(!link){
      link = document.createElement('a');
      link.dataset.installerlabLicenseNav = '1';
      link.className = 'button license-nav-cta';
      actions.appendChild(link);
    }
    link.href = BASE + 'donate/#pro';
    link.textContent = copy(es).nav;
    link.title = es ? 'Adquirir / solicitar licencia InstallerLab PRO' : 'Acquire / request InstallerLab PRO license';
  }

  function ensureSection(es){
    if(document.body?.dataset?.page !== 'home') return;
    const hero = document.querySelector('.hero');
    if(!hero) return;
    const key = es ? 'es' : 'en';
    let section = document.querySelector('.license-highlight');
    if(section?.dataset?.lang === key) return;
    if(section) section.remove();

    const t = copy(es);
    section = document.createElement('section');
    section.className = 'license-highlight';
    section.dataset.lang = key;
    section.innerHTML = `<div class="shell"><div class="license-highlight__panel">
      <div>
        <span class="license-highlight__badge">★ ${t.badge}</span>
        <h2>${t.title}</h2>
        <p class="license-highlight__lead">${t.lead}</p>
        <div class="license-highlight__actions">
          <a class="button primary" href="${BASE}donate/#pro">${t.primary}</a>
          <a class="license-highlight__paypal" href="${PAYPAL}" target="_blank" rel="noopener noreferrer">${t.paypal}</a>
        </div>
      </div>
      <div class="license-highlight__facts">
        <div class="license-highlight__fact"><strong>${t.benefits}</strong><span></span></div>
        <div class="license-highlight__fact"><strong>${t.b1}</strong><span>${t.b1b}</span></div>
        <div class="license-highlight__fact"><strong>${t.b2}</strong><span>${t.b2b}</span></div>
        <div class="license-highlight__fact"><strong>${t.b3}</strong><span>${t.b3b}</span></div>
      </div>
      <div class="license-highlight__facts">
        <div class="license-highlight__fact"><strong>${t.process}</strong><span></span></div>
        <div class="license-highlight__fact"><strong>${t.f1}</strong><span>${t.f1b}</span></div>
        <div class="license-highlight__fact"><strong>${t.f2}</strong><span>${t.f2b}</span></div>
        <div class="license-highlight__fact"><strong>${t.f3}</strong><span>${t.f3b}</span></div>
      </div>
      <p class="license-highlight__note">${t.note}</p>
    </div></div>`;
    hero.insertAdjacentElement('afterend', section);
  }

  function apply(){
    const es = isSpanish();
    ensureNav(es);
    ensureSection(es);
  }

  function schedule(){
    if(queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; apply(); });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('storage', schedule);
})();
