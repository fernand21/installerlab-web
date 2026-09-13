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
      lead:'Toda contribución recibe un certificado permanente de supporter. La licencia PRO añade algo distinto: una clave de activación vinculada al Machine Code que desbloquea las funciones PRO de InstallerLab.',
      primary:'Obtener licencia PRO →',
      paypal:'Pagar / aportar con PayPal ↗',
      benefits:'¿Qué añade PRO además del certificado?',
      b1:'01 · Clave de activación PRO',
      b1b:'Después de la verificación manual recibes una clave de activación para tu Machine Code. Esa clave —no el certificado— es la que desbloquea PRO.',
      b2:'02 · Catálogo de temas PRO',
      b2b:'La clave PRO desbloquea el catálogo de temas visuales PRO para ampliar la presentación y el branding de tus instaladores.',
      b3:'03 · Portable Builder PRO',
      b3b:'Permite crear paquetes Portable de otras aplicaciones Windows desde InstallerLab, además de usar la edición Portable de InstallerLab.',
      b4:'04 · Personalización PRO ampliada',
      b4b:'Acceso a las opciones de apariencia reservadas para PRO dentro de los flujos visuales compatibles.',
      process:'Cómo obtenerla',
      f1:'Desde US$10',
      f1b:'Un aporte de US$10 o más puede solicitar PRO tras verificación manual y también conserva su certificado permanente de supporter.',
      f2:'1 máquina',
      f2b:'La clave PRO actual se genera para el Machine Code del equipo solicitado.',
      f3:'Certificado + clave PRO',
      f3b:'El certificado reconoce tu apoyo al proyecto; la clave de activación es la credencial que habilita las funciones PRO.',
      note:'Importante: un certificado por sí solo no activa PRO. Todo supporter puede recibir certificado; solo una solicitud PRO aprobada recibe además una clave de activación.'
    } : {
      nav:'PRO License',
      badge:'PRO LICENSE',
      title:'Get InstallerLab PRO',
      lead:'Every contribution receives a permanent supporter certificate. A PRO license adds something different: an activation key tied to the Machine Code that unlocks InstallerLab PRO features.',
      primary:'Get PRO license →',
      paypal:'Pay / support with PayPal ↗',
      benefits:'What does PRO add beyond the certificate?',
      b1:'01 · PRO activation key',
      b1b:'After manual verification you receive an activation key for your Machine Code. That key —not the certificate— is what unlocks PRO.',
      b2:'02 · PRO theme catalog',
      b2b:'The PRO key unlocks the PRO visual theme catalog for broader installer presentation and branding choices.',
      b3:'03 · PRO Portable Builder',
      b3b:'Lets you create Portable packages for other Windows applications from InstallerLab, beyond using InstallerLab itself as a portable app.',
      b4:'04 · Expanded PRO customization',
      b4b:'Access to appearance options reserved for PRO within supported visual workflows.',
      process:'How to get it',
      f1:'From US$10',
      f1b:'A contribution of US$10 or more may request PRO after manual verification and still keeps the permanent supporter certificate.',
      f2:'1 machine',
      f2b:'The current PRO key is generated for the Machine Code of the requested computer.',
      f3:'Certificate + PRO key',
      f3b:'The certificate recognizes your support for the project; the activation key is the credential that enables PRO features.',
      note:'Important: a certificate by itself does not activate PRO. Every supporter may receive a certificate; only an approved PRO request additionally receives an activation key.'
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
        <div class="license-highlight__fact"><strong>${t.b4}</strong><span>${t.b4b}</span></div>
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
