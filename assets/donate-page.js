(() => {
  const BASE = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  const CONTACT = 'farevbalo210@gmail.com';
  let queued = false;

  const isSpanish = () => (localStorage.getItem('il-lang') || 'es').toLowerCase() === 'es';

  function copy(es){
    return es ? {
      eyebrow:'Financiación comunitaria',
      title:'Ayuda a mantener InstallerLab vivo.',
      intro:'InstallerLab es un proyecto independiente y la mayor parte de sus funciones se mantiene gratuita por decisión propia. Cada aporte ayuda a sostener pruebas, documentación, dominio, mantenimiento y tiempo de desarrollo.',
      permanent:'Certificado permanente para cualquier donador',
      permanentText:'Cualquier contribución desde US$1 recibe un InstallerLab Supporter ID y un certificado oficial que no caduca. La primera contribución crea tu ID; los aportes futuros conservan el mismo ID.',
      privacy:'El importe de tu aporte no se publica. Puedes aparecer con nombre, alias o como Private Supporter.',
      button:'Apoyar desde US$1',
      demo:'Ver certificado de ejemplo',
      goal:'Meta inicial de sostenibilidad',
      goalText:'Una meta pequeña para ayudar a mantener el proyecto activo sin convertir la Community Edition en un producto de pago.',
      scope:'Lo que ya estás ayudando a mantener',
      scopeText:'InstallerLab ya cubre varios flujos reales de distribución de Windows y sigue creciendo de forma independiente.',
      pro:'Licencia PRO',
      proText:'La política PRO actual se mantiene separada del certificado: los aportes de US$10 o más pueden solicitar activación PRO para una máquina después de la verificación manual.',
      proNote:'Un aporte de US$1–9 sigue recibiendo el certificado permanente; simplemente no activa PRO.',
      after:'¿Ya realizaste un aporte?',
      afterText:'Envíame el comprobante y el nombre o alias que quieres en el certificado. Si también solicitas PRO, agrega el Machine Code.',
      name:'Nombre o alias para el certificado',
      reference:'Referencia / detalle del aporte',
      machine:'Machine Code (solo si solicitas PRO)',
      public:'Quiero aparecer en la página pública de supporters',
      prepare:'Preparar correo de solicitud',
      attach:'El botón abre tu correo con los datos preparados. Adjunta allí el comprobante de pago. No publiques contraseñas, documentos ni datos bancarios.',
      lifetime:'PERMANENTE · NO CADUCA',
      supporters:'supporters',
      raised:'recaudados',
      manual:'La confirmación y emisión son manuales por ahora. Cuando conectemos un proveedor de pagos, esta misma página ya está preparada para recibir una redirección de éxito y mostrar la animación de agradecimiento.'
    } : {
      eyebrow:'Community funding',
      title:'Help keep InstallerLab alive.',
      intro:'InstallerLab is an independent project and most of its functionality is intentionally kept free. Every contribution helps sustain testing, documentation, the domain, maintenance and development time.',
      permanent:'A permanent certificate for every supporter',
      permanentText:'Any contribution from US$1 receives an InstallerLab Supporter ID and an official certificate that does not expire. Your first contribution creates the ID; future contributions keep the same ID.',
      privacy:'Your contribution amount is never published. You can appear by name, alias, or as a Private Supporter.',
      button:'Support from US$1',
      demo:'View certificate demo',
      goal:'Initial sustainability goal',
      goalText:'A small goal to help keep the project active without turning the Community Edition into a paid-only product.',
      scope:'What your support already helps maintain',
      scopeText:'InstallerLab already covers several real Windows deployment workflows and continues to grow independently.',
      pro:'PRO license',
      proText:'The current PRO policy remains separate from the certificate: contributions of US$10 or more may request one-machine PRO activation after manual verification.',
      proNote:'A US$1–9 contribution still receives the permanent certificate; it simply does not activate PRO.',
      after:'Already contributed?',
      afterText:'Send the receipt plus the name or alias you want on the certificate. If you are also requesting PRO, include the Machine Code.',
      name:'Name or alias for the certificate',
      reference:'Contribution reference / details',
      machine:'Machine Code (only when requesting PRO)',
      public:'I want to appear on the public supporters page',
      prepare:'Prepare supporter request email',
      attach:'The button opens your mail app with the details prepared. Attach the payment receipt there. Never publish passwords, identity documents or banking data.',
      lifetime:'PERMANENT · DOES NOT EXPIRE',
      supporters:'supporters',
      raised:'raised',
      manual:'Confirmation and certificate issuance are manual for now. Once a payment provider is connected, this page is already ready for a success redirect and the supporter celebration animation.'
    };
  }

  function campaignMarkup(es){
    const t = copy(es);
    const features = es ? [
      ['Setup EXE','Instaladores visuales con reglas, temas e idiomas.'],
      ['MSI + Bundle','WiX MSI y Burn Bundle desde el mismo proyecto FSS.'],
      ['Portable + B4J','Distribuciones portables y flujo B4J especializado.'],
      ['CLI + SBOM','Automatización, inventario y artefactos de release.'],
      ['Firma digital','Flujos Authenticode / SignTool y verificación.'],
      ['Office + QGIS','Project types especializados para Add-ins y Plugins.']
    ] : [
      ['Setup EXE','Visual installers with rules, themes and languages.'],
      ['MSI + Bundle','WiX MSI and Burn Bundle from the same FSS project.'],
      ['Portable + B4J','Portable distributions and a specialized B4J workflow.'],
      ['CLI + SBOM','Automation, inventory and release artifacts.'],
      ['Digital signing','Authenticode / SignTool workflows and verification.'],
      ['Office + QGIS','Specialized project types for Add-ins and Plugins.']
    ];
    return `<main class="donate-page" data-support-campaign-rendered="${es?'es':'en'}">
      <section class="donate-hero">
        <article class="donate-card donate-card--lead">
          <span class="donate-badge">❤ ${t.eyebrow}</span>
          <h1>${t.title}</h1>
          <p>${t.intro}</p>
          <div class="donate-actions">
            <a class="button primary" data-support-contact href="mailto:${CONTACT}">${t.button}</a>
            <a class="button" href="${BASE}supporters/?demo=1">${t.demo}</a>
          </div>
          <p class="donate-manual-note">${t.manual}</p>
        </article>
        <aside class="funding-card" aria-label="${t.goal}">
          <span>${t.goal}</span>
          <div class="funding-numbers"><strong id="support-raised">$0</strong><b>/</b><span id="support-goal">$500</span></div>
          <div class="funding-progress"><i id="support-progress"></i></div>
          <div class="funding-meta"><span><b id="support-count">0</b> ${t.supporters}</span><span id="support-percent">0%</span></div>
          <p>${t.goalText}</p>
        </aside>
      </section>

      <section class="certificate-promise">
        <div class="certificate-promise__seal">★</div>
        <div>
          <span class="certificate-kicker">${t.lifetime}</span>
          <h2>${t.permanent}</h2>
          <p>${t.permanentText}</p>
          <p class="privacy-note">🔒 ${t.privacy}</p>
        </div>
      </section>

      <section class="donate-section">
        <div class="section-head"><span class="eyebrow">InstallerLab today</span><h2>${t.scope}</h2><p>${t.scopeText}</p></div>
        <div class="support-scope-grid">${features.map(x=>`<article><span>✓</span><div><h3>${x[0]}</h3><p>${x[1]}</p></div></article>`).join('')}</div>
      </section>

      <section id="pro" class="license-card">
        <div><span class="donate-badge">PRO</span><h2>${t.pro}</h2><p>${t.proText}</p><div class="license-machine"><span class="icon">🖥️</span><div><strong>${es?'Activación por máquina':'Per-machine activation'}</strong><span>${t.proNote}</span></div></div></div>
        <a class="button" href="#supporter-request">${es?'Solicitar certificado / PRO':'Request certificate / PRO'}</a>
      </section>

      <section id="supporter-request" class="activation-card">
        <h2>${t.after}</h2><p class="activation-subtitle">${t.afterText}</p>
        <form class="activation-form" id="supporter-form">
          <div class="form-field"><label for="supporter-name">${t.name}</label><input id="supporter-name" name="name" maxlength="80" required></div>
          <div class="form-field"><label for="supporter-ref">${t.reference}</label><input id="supporter-ref" name="reference" maxlength="140" placeholder="PayPal / transaction / date"></div>
          <div class="form-field full"><label for="supporter-machine">${t.machine}</label><textarea id="supporter-machine" name="machine" rows="3"></textarea></div>
          <label class="activation-check"><input id="supporter-public" type="checkbox"><span>${t.public}</span></label>
          <div class="activation-note">${t.attach}<br><br><strong>${es?'Contacto':'Contact'}:</strong> <span class="activation-email">${CONTACT}</span></div>
          <div class="activation-actions"><button class="button primary" type="submit">${t.prepare}</button><a class="button" href="${BASE}supporters/">${es?'Ver supporters':'View supporters'}</a></div>
          <div class="form-status" id="supporter-status" role="status"></div>
        </form>
      </section>
    </main>`;
  }

  function updateFunding(){
    fetch(BASE+'supporters/data.json',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()).then(data=>{
      const goal=Math.max(1,Number(data.goal)||500), raised=Math.max(0,Number(data.raised)||0), count=Array.isArray(data.supporters)?data.supporters.length:0;
      const pct=Math.min(100,Math.round((raised/goal)*100));
      const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
      set('support-raised','$'+raised.toLocaleString());set('support-goal','$'+goal.toLocaleString());set('support-count',String(count));set('support-percent',pct+'%');
      const bar=document.getElementById('support-progress');if(bar)bar.style.width=pct+'%';
    }).catch(()=>{});
  }

  function wireForm(es){
    const form=document.getElementById('supporter-form'); if(!form) return;
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const name=document.getElementById('supporter-name').value.trim();
      const ref=document.getElementById('supporter-ref').value.trim();
      const machine=document.getElementById('supporter-machine').value.trim();
      const publicListing=document.getElementById('supporter-public').checked;
      const subject=es?'[InstallerLab] Solicitud de certificado de supporter':'[InstallerLab] Supporter certificate request';
      const lines=es?[
        'Hola, ya realicé un aporte para apoyar InstallerLab.','',`Nombre o alias del certificado: ${name}`,`Referencia del aporte: ${ref||'(adjunto comprobante)'}`,`Publicación en supporters: ${publicListing?'Sí':'No'}`,`Machine Code para PRO: ${machine||'No solicito PRO'}`,'','Adjunto el comprobante de pago. Entiendo que el certificado es un reconocimiento del proyecto y no un comprobante fiscal.'
      ]:[
        'Hello, I have made a contribution to support InstallerLab.','',`Certificate name or alias: ${name}`,`Contribution reference: ${ref||'(receipt attached)'}`,`Public supporters listing: ${publicListing?'Yes':'No'}`,`Machine Code for PRO: ${machine||'Not requesting PRO'}`,'','I am attaching the payment receipt. I understand that the certificate is project recognition and not a tax receipt.'
      ];
      location.href=`mailto:${CONTACT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
      const status=document.getElementById('supporter-status');if(status)status.textContent=es?'Correo preparado. Adjunta el comprobante antes de enviarlo.':'Email prepared. Attach the receipt before sending it.';
    });
    document.querySelector('[data-support-contact]')?.addEventListener('click',e=>{
      e.currentTarget.href=`mailto:${CONTACT}?subject=${encodeURIComponent(es?'Quiero apoyar InstallerLab':'I want to support InstallerLab')}&body=${encodeURIComponent(es?'Hola, quiero apoyar InstallerLab desde US$1. Por favor indícame el método/enlace de pago disponible.':'Hello, I want to support InstallerLab from US$1. Please send me the currently available payment method/link.')}`;
    });
  }

  function celebrate(){
    if(!new URLSearchParams(location.search).has('thanks')) return;
    if(document.querySelector('.support-celebration')) return;
    const es=isSpanish();
    const wrap=document.createElement('div');wrap.className='support-celebration';
    wrap.innerHTML=`<div class="support-celebration__card"><div class="support-celebration__heart">❤</div><h2>${es?'¡Gracias por mantener InstallerLab vivo!':'Thank you for helping keep InstallerLab alive!'}</h2><p>${es?'Tu apoyo forma parte de la historia del proyecto.':'Your support is now part of the project’s story.'}</p><button type="button">${es?'Continuar':'Continue'}</button></div>`+Array.from({length:26},(_,i)=>`<i style="--i:${i}"></i>`).join('');
    wrap.querySelector('button').onclick=()=>wrap.remove();document.body.appendChild(wrap);
  }

  function render(){
    if(document.body?.dataset?.page!=='donate') return;
    const es=isSpanish(), current=document.querySelector('.donate-page');
    if(current?.dataset?.supportCampaignRendered===(es?'es':'en')) return;
    const app=document.getElementById('app');if(!app)return;
    app.innerHTML=campaignMarkup(es);updateFunding();wireForm(es);celebrate();
  }
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('storage',schedule);
})();
