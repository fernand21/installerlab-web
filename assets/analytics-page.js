(() => {
  const isES=()=>((localStorage.getItem('il-lang')||'en').toLowerCase()==='es');
  let queued=false;

  const text=es=>es?{
    kicker:'InstallerLab Analytics',status:'VISTA PREVIA · FASE WEB',title:'Mide lo que ocurre después de publicar tu instalador.',lead:'Una futura capa de analítica opcional para conocer instalaciones, errores, versiones y entorno sin convertir el TrackID en identidad de la aplicación ni en parte de la licencia.',cta:'Modelo de integración',privacy:'Privacidad y reglas',m1:'Instalaciones',m2:'Correctas',m3:'Fallidas',m4:'Desinstalaciones',dash:'Vista del dashboard',dashp:'La interfaz está preparada primero. Los datos reales llegarán cuando conectemos el backend y la telemetría del instalador.',what:'Qué podrá mostrar',whatp:'La idea es cubrir el ciclo real de despliegue, no solo contar descargas.',cards:[['Instalaciones','Inicio, éxito, cancelación y fallo del proceso.'],['Versiones','Qué versión del producto se instala y cuál sigue en uso.'],['Sistema','Windows, idioma y arquitectura del equipo.'],['Errores','Código y etapa donde falló el instalador.'],['Prerrequisitos','Qué dependencia impidió continuar o necesitó instalarse.'],['Desinstalaciones','Cuántos equipos retiraron el producto y cuándo.'],['Paquetes','Setup EXE, MSI y Bundle identificados dentro del mismo proyecto.'],['Entorno','x64, x86 o ARM64 y otros datos técnicos no personales.']],cfg:'Modelo para la sección Installer',cfgp:'Este bloque define cómo queremos llevarlo después a la aplicación. Arquitectura y Tracking serán configuraciones independientes.',arch:'Arquitectura del paquete',archhelp:'No depende de Analytics. La selección futura debe controlar el build del instalador, no el TrackID.',tracking:'Habilitar tracking',trackid:'TrackID',generate:'Generar TrackID',copy:'Copiar',trackhelp:'El TrackID es solo una clave para agrupar eventos de Analytics. No reemplaza AppId, ProductCode, UpgradeCode, GUID, licencia ni Machine Code.',none:'Si Tracking está desactivado o no existe TrackID, la aplicación y el instalador deben funcionar exactamente igual y no enviar telemetría.',model:'Modelo FSS propuesto',rules:'Reglas del TrackID',r1:'Solo Analytics',r1b:'Nunca debe decidir rutas, upgrades, identidad MSI, licencia o comportamiento funcional de la app.',r2:'Opcional',r2b:'Un proyecto sin TrackID sigue siendo completamente válido. Tracking simplemente queda apagado.',r3:'Generable',r3b:'InstallerLab podrá generarlo con un botón. También podrá pegarse uno existente para conservar el historial.',privacyTitle:'Privacidad por diseño',p1:'Sin datos personales por defecto',p1b:'No necesitamos nombres, correos, documentos, Machine Code ni claves de licencia para contar instalaciones.',p2:'Identificador del proyecto',p2b:'TrackID identifica el flujo de analítica del proyecto, no a una persona ni a una máquina concreta.',p3:'Transparencia',p3b:'El usuario del instalador debe poder conocer que existe telemetría cuando se habilite y qué datos técnicos se envían.',steps:'Plan de implementación',s1:'Web',s1b:'Definir dashboard, configuración, TrackID y reglas. Esta fase ya empieza aquí.',s2:'InstallerLab',s2b:'Añadir Architecture, toggle Tracking y botón Generate TrackID sin alterar proyectos antiguos.',s3:'Backend',s3b:'Conectar endpoint seguro, almacenamiento, agregaciones y autenticación para mostrar datos reales.',copied:'TrackID copiado.',generated:'TrackID generado localmente. Aún no está registrado en ningún backend.'
  }:{
    kicker:'InstallerLab Analytics',status:'PREVIEW · WEB PHASE',title:'Measure what happens after you publish your installer.',lead:'An optional future analytics layer for installs, errors, versions and environment data without turning TrackID into application identity or licensing data.',cta:'Integration model',privacy:'Privacy & rules',m1:'Installs',m2:'Successful',m3:'Failed',m4:'Uninstalls',dash:'Dashboard preview',dashp:'The interface comes first. Real data will appear after the backend and installer telemetry are connected.',what:'What it can show',whatp:'The goal is to cover the real deployment lifecycle, not just count downloads.',cards:[['Installs','Start, success, cancellation and failure of the process.'],['Versions','Which product version is installed and which remains in use.'],['System','Windows, language and machine architecture.'],['Errors','Code and stage where the installer failed.'],['Prerequisites','Which dependency blocked or had to be installed.'],['Uninstalls','How many systems removed the product and when.'],['Packages','Setup EXE, MSI and Bundle grouped under the same project.'],['Environment','x64, x86 or ARM64 and other non-personal technical data.']],cfg:'Installer section model',cfgp:'This block defines how we want to bring it into the application next. Architecture and Tracking are independent settings.',arch:'Package architecture',archhelp:'Independent from Analytics. The future selector controls installer build architecture, not TrackID.',tracking:'Enable tracking',trackid:'TrackID',generate:'Generate TrackID',copy:'Copy',trackhelp:'TrackID is only a key for grouping Analytics events. It does not replace AppId, ProductCode, UpgradeCode, GUID, license data or Machine Code.',none:'If Tracking is disabled or TrackID is missing, the application and installer must behave exactly the same and send no telemetry.',model:'Proposed FSS model',rules:'TrackID rules',r1:'Analytics only',r1b:'It must never drive install paths, upgrades, MSI identity, licensing or application behavior.',r2:'Optional',r2b:'A project without TrackID remains fully valid. Tracking is simply off.',r3:'Generatable',r3b:'InstallerLab can generate one from a button. An existing TrackID can also be pasted to preserve history.',privacyTitle:'Privacy by design',p1:'No personal data by default',p1b:'Names, email addresses, documents, Machine Code and license keys are not required to count installations.',p2:'Project identifier',p2b:'TrackID identifies the project analytics stream, not a person or a specific computer.',p3:'Transparency',p3b:'When telemetry is enabled, installer users should be able to know that it exists and what technical data is sent.',steps:'Implementation plan',s1:'Web',s1b:'Define dashboard, configuration, TrackID and rules. This phase starts here.',s2:'InstallerLab',s2b:'Add Architecture, Tracking toggle and Generate TrackID without breaking old projects.',s3:'Backend',s3b:'Connect a secure endpoint, storage, aggregation and authentication for real data.',copied:'TrackID copied.',generated:'TrackID generated locally. It is not registered with any backend yet.'
  };

  function newTrackId(){
    const bytes=new Uint8Array(12);
    crypto.getRandomValues(bytes);
    return 'IL-TRK-'+[...bytes].map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
  }

  function markup(t){
    return `<main class="iax-page" data-iax-lang="${isES()?'es':'en'}">
      <section class="iax-hero">
        <div class="iax-panel"><span class="iax-kicker">${t.kicker}<span class="iax-status">${t.status}</span></span><h1>${t.title}</h1><p>${t.lead}</p><div class="iax-actions"><a class="button primary" href="#integration">${t.cta}</a><a class="button" href="#privacy">${t.privacy}</a></div></div>
        <aside class="iax-panel iax-summary"><div class="iax-metric"><span>${t.m1}</span><strong>—</strong></div><div class="iax-metric"><span>${t.m2}</span><strong>—</strong></div><div class="iax-metric"><span>${t.m3}</span><strong>—</strong></div><div class="iax-metric"><span>${t.m4}</span><strong>—</strong></div></aside>
      </section>

      <section class="iax-section"><span class="iax-kicker">Analytics UI</span><h2>${t.dash}</h2><p>${t.dashp}</p><div class="iax-dashboard"><div class="iax-card iax-chart"><b>Install trend</b><div class="iax-chart-grid"></div><div class="iax-chart-line"></div></div><div class="iax-card iax-side-list"><div class="iax-side-item"><span>Windows</span><strong>—</strong></div><div class="iax-side-item"><span>Architecture</span><strong>—</strong></div><div class="iax-side-item"><span>Latest version</span><strong>—</strong></div><div class="iax-side-item"><span>Error rate</span><strong>—</strong></div></div></div></section>

      <section class="iax-section"><span class="iax-kicker">Deployment intelligence</span><h2>${t.what}</h2><p>${t.whatp}</p><div class="iax-grid">${t.cards.map(c=>`<article class="iax-card"><b>${c[0]}</b><p>${c[1]}</p></article>`).join('')}</div></section>

      <section id="integration" class="iax-section"><span class="iax-kicker">InstallerLab project model</span><h2>${t.cfg}</h2><p>${t.cfgp}</p><div class="iax-config">
        <div class="iax-form-grid"><div class="iax-field"><label for="iax-arch">${t.arch}</label><select id="iax-arch"><option value="auto">Auto</option><option value="x64">x64</option><option value="x86">x86</option><option value="arm64">ARM64</option></select><p class="iax-small">${t.archhelp}</p></div>
        <div class="iax-field"><label>${t.tracking}</label><label class="iax-toggle"><input id="iax-enabled" type="checkbox"> <span>${t.tracking}</span></label><p class="iax-small">${t.none}</p></div></div>
        <div class="iax-field" style="margin-top:18px"><label for="iax-trackid">${t.trackid}</label><div class="iax-track-row"><input id="iax-trackid" placeholder="IL-TRK-…" autocomplete="off" disabled><button id="iax-generate" class="button" type="button" disabled>${t.generate}</button><button id="iax-copy" class="button" type="button" disabled>${t.copy}</button></div><p class="iax-small">${t.trackhelp}</p><div id="iax-copy-state" class="iax-copy-state"></div></div>
        <div class="iax-warning">${t.none}</div><div class="iax-code"><strong>${t.model}</strong><pre id="iax-code"></pre></div>
      </div></section>

      <section class="iax-section"><span class="iax-kicker">TrackID</span><h2>${t.rules}</h2><div class="iax-rules"><article class="iax-note"><strong>${t.r1}</strong><p>${t.r1b}</p></article><article class="iax-note"><strong>${t.r2}</strong><p>${t.r2b}</p></article><article class="iax-note"><strong>${t.r3}</strong><p>${t.r3b}</p></article></div></section>

      <section id="privacy" class="iax-section"><span class="iax-kicker">Privacy</span><h2>${t.privacyTitle}</h2><div class="iax-rules"><article class="iax-note"><strong>${t.p1}</strong><p>${t.p1b}</p></article><article class="iax-note"><strong>${t.p2}</strong><p>${t.p2b}</p></article><article class="iax-note"><strong>${t.p3}</strong><p>${t.p3b}</p></article></div></section>

      <section class="iax-section"><span class="iax-kicker">Roadmap</span><h2>${t.steps}</h2><div class="iax-steps"><article class="iax-step"><b>${t.s1}</b><p>${t.s1b}</p></article><article class="iax-step"><b>${t.s2}</b><p>${t.s2b}</p></article><article class="iax-step"><b>${t.s3}</b><p>${t.s3b}</p></article></div></section>
    </main>`;
  }

  function wire(t){
    const enabled=document.getElementById('iax-enabled'),field=document.getElementById('iax-trackid'),gen=document.getElementById('iax-generate'),copy=document.getElementById('iax-copy'),arch=document.getElementById('iax-arch'),code=document.getElementById('iax-code'),state=document.getElementById('iax-copy-state');
    if(!enabled||!field||!gen||!copy||!arch||!code)return;
    const update=()=>{
      const on=enabled.checked;
      field.disabled=!on;gen.disabled=!on;copy.disabled=!on||!field.value.trim();
      const lines=['[Setup]',`Architecture=${arch.value}`];
      if(on&&field.value.trim()) lines.push('','[Analytics]','Enabled=True',`TrackID=${field.value.trim()}`,'TrackInstall=True','TrackUninstall=True','TrackErrors=True','TrackEnvironment=True');
      else lines.push('','; Analytics disabled — no TrackID, no telemetry');
      code.textContent=lines.join('\n');
    };
    enabled.addEventListener('change',update);arch.addEventListener('change',update);field.addEventListener('input',update);
    gen.addEventListener('click',()=>{field.value=newTrackId();state.textContent=t.generated;update();field.focus();field.select();});
    copy.addEventListener('click',async()=>{if(!field.value.trim())return;try{await navigator.clipboard.writeText(field.value.trim());state.textContent=t.copied;}catch{field.select();document.execCommand('copy');state.textContent=t.copied;}});
    update();
  }

  function render(){
    if(document.body?.dataset?.page!=='analytics')return;
    const app=document.getElementById('app');if(!app)return;
    const lang=isES()?'es':'en';
    if(app.querySelector('.iax-page')?.dataset?.iaxLang===lang)return;
    const t=text(isES());app.innerHTML=markup(t);wire(t);
  }
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render();});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('storage',schedule);
})();
