(() => {
  const BASE = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  const CONTACT = 'farevalo210@gmail.com';
  const FORM_ENDPOINT = `https://formsubmit.co/${CONTACT}`;
  let queued = false;

  const isSpanish = () => (localStorage.getItem('il-lang') || 'es').toLowerCase() === 'es';

  function copy(es){
    return es ? {
      eyebrow:'Financiación comunitaria',
      title:'Ayuda a mantener InstallerLab vivo.',
      intro:'InstallerLab es un proyecto independiente y la mayor parte de sus funciones se mantiene gratuita por decisión propia. Cada aporte ayuda a sostener pruebas, documentación, dominio, mantenimiento y tiempo de desarrollo.',
      permanent:'Certificado permanente para cualquier supporter',
      permanentText:'Cualquier contribución desde US$1 recibe un InstallerLab Supporter ID y un certificado oficial que no caduca. Esto también aplica a quien solicita PRO: la licencia PRO incluye ese mismo reconocimiento y, además, una clave de activación.',
      privacy:'El importe de tu aporte no se publica. Puedes aparecer con nombre, alias o como Private Supporter.',
      button:'Apoyar desde US$1',
      demo:'Ver certificado de ejemplo',
      goal:'Meta inicial de sostenibilidad',
      goalText:'Una meta pequeña para ayudar a mantener el proyecto activo sin convertir la Community Edition en un producto de pago.',
      scope:'Lo que ya estás ayudando a mantener',
      scopeText:'InstallerLab ya cubre varios flujos reales de distribución de Windows y sigue creciendo de forma independiente.',
      pro:'Licencia PRO',
      proText:'Los aportes de US$10 o más pueden solicitar PRO para una máquina. PRO incluye el certificado permanente de supporter y, tras verificación manual, una clave de activación vinculada al Machine Code.',
      proNote:'El certificado reconoce tu apoyo, pero no desbloquea funciones. La clave de activación PRO es la que habilita las funciones PRO en InstallerLab.',
      after:'¿Ya realizaste un aporte?',
      afterText:'Envíame el comprobante y el nombre o alias para el certificado. Si solicitas PRO, agrega el Machine Code para poder generar tu clave de activación.',
      name:'Nombre o alias para el certificado',
      reference:'Referencia / detalle del aporte',
      email:'Correo de contacto',
      receipt:'Comprobante de PayPal',
      receiptHelp:'PNG, JPG o PDF. Máximo 10 MB.',
      machine:'Machine Code (necesario para generar la clave PRO)',
      public:'Quiero aparecer en la página pública de supporters',
      prepare:'Enviar solicitud de certificado / clave PRO',
      attach:'Adjunta aquí el comprobante de PayPal. Se aceptan PNG, JPG o PDF de hasta 10 MB. La solicitud se enviará directamente al correo oficial de InstallerLab.',
      lifetime:'PERMANENTE · NO CADUCA',
      supporters:'supporters',
      raised:'recaudados',
      manual:'La confirmación, el certificado y la emisión de la clave PRO son manuales por ahora.',
      supporterLabel:'SUPPORTER',
      supporterTitle:'Aporte desde US$1',
      supporterItems:['Supporter ID permanente','Certificado oficial permanente','Sin clave de activación PRO','No desbloquea funciones PRO'],
      proLabel:'PRO',
      proTitle:'Aporte desde US$10',
      proItems:['Incluye Supporter ID y certificado permanente','Incluye clave de activación PRO tras verificación','Clave vinculada al Machine Code de 1 equipo','Desbloquea las funciones PRO de InstallerLab']
    } : {
      eyebrow:'Community funding',
      title:'Help keep InstallerLab alive.',
      intro:'InstallerLab is an independent project and most of its functionality is intentionally kept free. Every contribution helps sustain testing, documentation, the domain, maintenance and development time.',
      permanent:'A permanent certificate for every supporter',
      permanentText:'Any contribution from US$1 receives an InstallerLab Supporter ID and an official certificate that does not expire. This also applies to PRO supporters: a PRO license includes that same recognition plus an activation key.',
      privacy:'Your contribution amount is never published. You can appear by name, alias, or as a Private Supporter.',
      button:'Support from US$1',
      demo:'View certificate demo',
      goal:'Initial sustainability goal',
      goalText:'A small goal to help keep the project active without turning the Community Edition into a paid-only product.',
      scope:'What your support already helps maintain',
      scopeText:'InstallerLab already covers several real Windows deployment workflows and continues to grow independently.',
      pro:'PRO license',
      proText:'Contributions of US$10 or more may request PRO for one machine. PRO includes the permanent supporter certificate and, after manual verification, an activation key tied to the Machine Code.',
      proNote:'The certificate recognizes your support, but it does not unlock features. The PRO activation key is what enables InstallerLab PRO capabilities.',
      after:'Already contributed?',
      afterText:'Send the receipt plus the name or alias for the certificate. If you are requesting PRO, include the Machine Code so the activation key can be generated.',
      name:'Name or alias for the certificate',
      reference:'Contribution reference / details',
      email:'Contact email',
      receipt:'PayPal receipt',
      receiptHelp:'PNG, JPG or PDF. Maximum 10 MB.',
      machine:'Machine Code (required to generate the PRO key)',
      public:'I want to appear on the public supporters page',
      prepare:'Send certificate / PRO key request',
      attach:'Attach the PayPal receipt here. PNG, JPG or PDF files up to 10 MB are accepted. The request will be sent directly to the official InstallerLab email.',
      lifetime:'PERMANENT · DOES NOT EXPIRE',
      supporters:'supporters',
      raised:'raised',
      manual:'Confirmation, certificate issuance and PRO key issuance are manual for now.',
      supporterLabel:'SUPPORTER',
      supporterTitle:'Contribution from US$1',
      supporterItems:['Permanent Supporter ID','Permanent official certificate','No PRO activation key','Does not unlock PRO features'],
      proLabel:'PRO',
      proTitle:'Contribution from US$10',
      proItems:['Includes Supporter ID and permanent certificate','Includes PRO activation key after verification','Key tied to the Machine Code of 1 computer','Unlocks InstallerLab PRO features']
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
        <div class="section-head"><span class="eyebrow">${es?'Diferencia clara':'Clear difference'}</span><h2>${es?'Certificado y licencia PRO no son lo mismo.':'Certificate and PRO license are not the same thing.'}</h2></div>
        <div class="support-scope-grid">
          <article><span>★</span><div><h3>${t.supporterLabel} · ${t.supporterTitle}</h3><p>${t.supporterItems.map(x=>'✓ '+x).join('<br>')}</p></div></article>
          <article><span>🔑</span><div><h3>${t.proLabel} · ${t.proTitle}</h3><p>${t.proItems.map(x=>'✓ '+x).join('<br>')}</p></div></article>
        </div>
      </section>

      <section class="donate-section">
        <div class="section-head"><span class="eyebrow">InstallerLab today</span><h2>${t.scope}</h2><p>${t.scopeText}</p></div>
        <div class="support-scope-grid">${features.map(x=>`<article><span>✓</span><div><h3>${x[0]}</h3><p>${x[1]}</p></div></article>`).join('')}</div>
      </section>

      <section id="pro" class="license-card">
        <div><span class="donate-badge">PRO</span><h2>${t.pro}</h2><p>${t.proText}</p><div class="license-machine"><span class="icon">🔑</span><div><strong>${es?'Clave de activación por máquina':'Per-machine activation key'}</strong><span>${t.proNote}</span></div></div></div>
        <a class="button" href="#supporter-request">${es?'Solicitar certificado / clave PRO':'Request certificate / PRO key'}</a>
      </section>

      <section id="supporter-request" class="activation-card">
        <h2>${t.after}</h2><p class="activation-subtitle">${t.afterText}</p>
        <form class="activation-form" id="supporter-form" action="${FORM_ENDPOINT}" method="POST" enctype="multipart/form-data">
          <input type="hidden" name="_subject" value="${es?'InstallerLab - Solicitud de certificado / clave PRO':'InstallerLab - Certificate / PRO key request'}">
          <input type="hidden" name="_template" value="table">
          <input type="hidden" name="_next" value="https://installerlab.website/donate/?sent=1&thanks=1">
          <input type="hidden" name="_url" value="https://installerlab.website/donate/">
          <input type="text" name="_honey" tabindex="-1" autocomplete="off" style="display:none">
          <div class="form-field"><label for="supporter-name">${t.name}</label><input id="supporter-name" name="${es?'Nombre o alias':'Name or alias'}" maxlength="80" required></div>
          <div class="form-field"><label for="supporter-email">${t.email}</label><input id="supporter-email" name="email" type="email" maxlength="160" autocomplete="email" required placeholder="${es?'tu@email.com':'you@email.com'}"></div>
          <div class="form-field"><label for="supporter-ref">${t.reference}</label><input id="supporter-ref" name="${es?'Referencia PayPal':'PayPal reference'}" maxlength="140" placeholder="PayPal / transaction / date"></div>
          <div class="form-field"><label for="supporter-receipt">${t.receipt}</label><input id="supporter-receipt" name="attachment" type="file" required accept="image/png,image/jpeg,application/pdf"><span class="form-help">${t.receiptHelp}</span></div>
          <div class="form-field full"><label for="supporter-machine">${t.machine}</label><textarea id="supporter-machine" name="Machine Code" rows="3" placeholder="${es?'Déjalo vacío si solo solicitas el certificado Supporter':'Leave blank if you only request the Supporter certificate'}"></textarea></div>
          <label class="activation-check"><input id="supporter-public" name="${es?'Publicación en supporters':'Public supporters listing'}" value="${es?'Sí':'Yes'}" type="checkbox"><span>${t.public}</span></label>
          <div class="activation-note">${t.attach}<br><br><strong>${es?'Correo oficial':'Official email'}:</strong> <span class="activation-email">${CONTACT}</span><br><span>${es?'El envío usa FormSubmit para poder adjuntar el archivo desde GitHub Pages. No adjuntes contraseñas, documentos de identidad ni datos bancarios.':'Submission uses FormSubmit so the file can be attached from GitHub Pages. Do not attach passwords, identity documents or banking information.'}</span></div>
          <div class="activation-actions"><button class="button primary" id="supporter-submit" type="submit">${t.prepare}</button><a class="button" href="${BASE}supporters/">${es?'Ver supporters':'View supporters'}</a></div>
          <div class="form-status" id="supporter-status" role="status" aria-live="polite"></div>
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
    const form=document.getElementById('supporter-form'); if(!form || form.dataset.wired==='1') return;
    form.dataset.wired='1';
    const file=document.getElementById('supporter-receipt');
    const status=document.getElementById('supporter-status');
    const submit=document.getElementById('supporter-submit');

    if(file){
      file.addEventListener('change',()=>{
        const selected=file.files&&file.files[0];
        if(!selected){ if(status)status.textContent=''; return; }
        if(selected.size>10*1024*1024){
          file.value='';
          if(status) status.textContent=es?'El comprobante supera 10 MB. Selecciona un archivo más pequeño.':'The receipt is larger than 10 MB. Please choose a smaller file.';
          return;
        }
        if(status) status.textContent=es?`Comprobante seleccionado: ${selected.name}`:`Receipt selected: ${selected.name}`;
      });
    }

    form.addEventListener('submit',e=>{
      if(!form.reportValidity()){ e.preventDefault(); return; }
      const selected=file&&file.files&&file.files[0];
      if(!selected){
        e.preventDefault();
        if(status) status.textContent=es?'Adjunta el comprobante de PayPal antes de enviar la solicitud.':'Attach the PayPal receipt before sending the request.';
        return;
      }
      if(selected.size>10*1024*1024){
        e.preventDefault();
        if(status) status.textContent=es?'El comprobante supera el límite de 10 MB.':'The receipt exceeds the 10 MB limit.';
        return;
      }
      if(submit){
        submit.disabled=true;
        submit.textContent=es?'Enviando solicitud…':'Sending request…';
      }
      if(status) status.textContent=es?`Enviando solicitud y comprobante a ${CONTACT}…`:`Sending request and receipt to ${CONTACT}…`;
    });
  }

  function celebrate(){
    if(!new URLSearchParams(location.search).has('thanks') && !new URLSearchParams(location.search).has('sent')) return;
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
