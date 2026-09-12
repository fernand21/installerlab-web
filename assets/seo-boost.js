(() => {
  const BASE='https://installerlab.website/';
  const DOWNLOAD='https://github.com/fernand21/installerlab-web/releases/download/v3.0.0/InstallerLab-Setup.exe';
  let busy=false;
  const isEs=()=>((localStorage.getItem('il-lang')||'es').toLowerCase()!=='en');

  function addJsonLd(){
    if(document.getElementById('installerlab-software-schema'))return;
    const schema={
      '@context':'https://schema.org','@type':'SoftwareApplication',name:'InstallerLab',
      applicationCategory:'DeveloperApplication',operatingSystem:'Windows',softwareVersion:'3.0.0',
      isAccessibleForFree:true,url:BASE,downloadUrl:DOWNLOAD,
      description:'Free visual Windows installer builder for Setup EXE, MSI, WiX Burn Bundle and Portable packages from one editable FSS project.',
      featureList:[
        'Visual Setup EXE builder','MSI generation from the same FSS project','WiX Burn Bundle with prerequisite chaining',
        'Portable package creation','B4J Portable workflow','Editable FSS project format','FSS Analyzer',
        'ISS to FSS importer for supported Inno Setup script sections','ZERO-TRASH temporary build pipeline',
        'Installer themes and branding','Multilingual installer configuration','Shortcuts, registry, file associations and context menus'
      ],offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},sameAs:['https://github.com/fernand21/installerlab-web']
    };
    const s=document.createElement('script');s.id='installerlab-software-schema';s.type='application/ld+json';s.textContent=JSON.stringify(schema);document.head.appendChild(s);
  }

  function injectHome(){
    if(document.body.dataset.page!=='home'||document.getElementById('developer-seo'))return;
    const app=document.getElementById('app');if(!app)return;const es=isEs();
    const section=document.createElement('section');section.id='developer-seo';section.className='seo-dev';
    section.innerHTML=es?`
      <div class="seo-shell">
        <span class="seo-kicker">InstallerLab v2 · Windows installer builder visual</span>
        <h2>Setup EXE, MSI, Bundle WiX Burn y Portable desde un solo proyecto FSS.</h2>
        <p class="seo-lede">InstallerLab v2 reduce trabajo duplicado: configura tu aplicación una vez, conserva un FSS pequeño y editable, genera varios formatos de distribución y usa herramientas de migración y análisis antes del build.</p>
        <div class="seo-proof"><span>Setup EXE</span><span>MSI</span><span>Bundle / Burn</span><span>Portable</span><span>ISS → FSS</span><span>FSS Analyzer</span><span>ZERO-TRASH</span><span>36 idiomas</span></div>
        <div class="seo-grid">
          <article class="seo-card"><h3>Bundle EXE con WiX Burn</h3><p>Encadena prerequisitos EXE/MSI antes del MSI principal y genera un bootstrapper único. Ideal cuando tu producto necesita runtimes o componentes previos.</p><p><a href="${BASE}bundle-builder/">Ver Bundle builder →</a></p></article>
          <article class="seo-card"><h3>Importa scripts de Inno Setup</h3><p>El importador ISS → FSS convierte las secciones compatibles para que puedas migrar un proyecto existente sin empezar desde cero.</p><p><a href="${BASE}inno-setup-importer/">Ver importador ISS → FSS →</a></p></article>
          <article class="seo-card"><h3>Analiza el FSS antes de compilar</h3><p>FSS Analyzer ayuda a detectar errores, advertencias y problemas de compatibilidad antes de entrar al pipeline de empaquetado.</p><p><a href="${BASE}fss-analyzer/">Ver FSS Analyzer →</a></p></article>
          <article class="seo-card"><h3>EXE para usuarios, MSI para TI</h3><p>Usa un Setup EXE visual para distribución directa y un MSI real para Windows Installer, msiexec o despliegue administrado.</p><p><a href="${BASE}msi-builder/">Ver MSI builder →</a></p></article>
          <article class="seo-card"><h3>FSS es el proyecto</h3><p>La configuración permanente permanece en un archivo de texto ligero. El staging de build es temporal, desechable y se elimina con la política ZERO-TRASH.</p></article>
          <article class="seo-card"><h3>Visual para velocidad, script para precisión</h3><p>Los paneles visuales mantienen el proyecto y el FSS queda disponible para revisión, versionado y ajustes avanzados.</p></article>
        </div>
        <div class="seo-cta"><a class="button primary" href="${BASE}download/">Descargar InstallerLab v2.0.0 →</a><a class="button" href="${BASE}inno-setup-alternative/">Alternativa a Inno Setup</a><a class="button" href="${BASE}docs/">Documentación v2</a></div>
      </div>`:`
      <div class="seo-shell">
        <span class="seo-kicker">InstallerLab v2 · Visual Windows installer builder</span>
        <h2>Setup EXE, MSI, WiX Burn Bundle and Portable from one FSS project.</h2>
        <p class="seo-lede">InstallerLab v2 reduces duplicated packaging work: configure the application once, keep a small editable FSS project, target multiple Windows distribution formats and use migration and analysis tools before building.</p>
        <div class="seo-proof"><span>Setup EXE</span><span>MSI</span><span>Bundle / Burn</span><span>Portable</span><span>ISS → FSS</span><span>FSS Analyzer</span><span>ZERO-TRASH</span><span>36 languages</span></div>
        <div class="seo-grid">
          <article class="seo-card"><h3>WiX Burn Bundle EXE</h3><p>Chain EXE/MSI prerequisites before the main MSI and produce one bootstrapper executable for the complete installation flow.</p><p><a href="${BASE}bundle-builder/">Explore the Bundle builder →</a></p></article>
          <article class="seo-card"><h3>Import Inno Setup scripts</h3><p>The ISS → FSS importer converts supported Inno Setup sections so an existing installer project can be migrated instead of rebuilt from scratch.</p><p><a href="${BASE}inno-setup-importer/">Explore ISS → FSS import →</a></p></article>
          <article class="seo-card"><h3>Analyze FSS before build</h3><p>FSS Analyzer helps surface errors, warnings and compatibility issues before the packaging pipeline starts.</p><p><a href="${BASE}fss-analyzer/">Explore FSS Analyzer →</a></p></article>
          <article class="seo-card"><h3>EXE for users, MSI for IT</h3><p>Ship a visual Setup EXE for direct downloads and a real MSI for Windows Installer, msiexec and managed deployment.</p><p><a href="${BASE}msi-builder/">Explore the MSI builder →</a></p></article>
          <article class="seo-card"><h3>FSS is the project</h3><p>Durable configuration stays in a lightweight text file while build staging remains temporary and disposable under the ZERO-TRASH policy.</p></article>
          <article class="seo-card"><h3>Visual for speed, script for precision</h3><p>Visual panels maintain the project while FSS remains available for review, version control and advanced edits.</p></article>
        </div>
        <div class="seo-cta"><a class="button primary" href="${BASE}download/">Download InstallerLab v2.0.0 →</a><a class="button" href="${BASE}inno-setup-alternative/">Inno Setup alternative</a><a class="button" href="${BASE}docs/">v2 documentation</a></div>
      </div>`;
    const sections=app.querySelectorAll(':scope > section');if(sections.length>1)sections[1].before(section);else app.appendChild(section);
  }

  function run(){addJsonLd();injectHome();}
  function schedule(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;run();});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();
