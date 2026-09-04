(() => {
  const BASE = 'https://fernand21.github.io/installerlab-web/';
  const DOWNLOAD = 'https://github.com/fernand21/installerlab-web/releases/download/v1.0.0/InstallerLab-Setup.exe';
  let busy = false;

  function isEs(){ return (localStorage.getItem('il-lang') || 'es').toLowerCase() !== 'en'; }

  function addJsonLd(){
    if (document.getElementById('installerlab-software-schema')) return;
    const schema = {
      '@context':'https://schema.org',
      '@type':'SoftwareApplication',
      name:'InstallerLab',
      applicationCategory:'DeveloperApplication',
      operatingSystem:'Windows',
      softwareVersion:'1.0.0',
      isAccessibleForFree:true,
      url:BASE,
      downloadUrl:DOWNLOAD,
      description:'Free visual Windows installer builder for Setup EXE, MSI and Portable packages with editable FSS projects, themes, multilingual installers and Windows integration.',
      featureList:[
        'Visual Setup EXE builder',
        'MSI generation from the same InstallerLab project',
        'Portable package creation',
        'Editable FSS project format',
        'Installer themes and branding',
        'Multilingual installer configuration',
        'Shortcuts, registry, file associations and context menu integration',
        'B4J Portable workflow'
      ],
      offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},
      author:{'@type':'Person',name:'Fernando Arevalo'},
      sameAs:['https://github.com/fernand21/installerlab-web']
    };
    const s=document.createElement('script');
    s.id='installerlab-software-schema'; s.type='application/ld+json'; s.textContent=JSON.stringify(schema);
    document.head.appendChild(s);
  }

  function injectHome(){
    if (document.body.dataset.page !== 'home' || document.getElementById('developer-seo')) return;
    const app=document.getElementById('app');
    if(!app) return;
    const es=isEs();
    const section=document.createElement('section');
    section.id='developer-seo'; section.className='seo-dev';
    section.innerHTML=es ? `
      <div class="seo-shell">
        <span class="seo-kicker">Creado para desarrolladores que quieren terminar el instalador hoy</span>
        <h2>Un Windows installer builder visual que no te obliga a elegir entre rapidez y control.</h2>
        <p class="seo-lede">InstallerLab nace alrededor de problemas reales de distribución: mantener dos proyectos distintos para EXE y MSI, escribir XML de WiX a mano, perder tiempo repitiendo reglas de archivos y registro, o terminar con un instalador genérico que no refleja tu aplicación. Aquí trabajas visualmente y conservas un proyecto FSS editable como fuente de verdad.</p>
        <div class="seo-proof"><span>Setup EXE</span><span>MSI desde el mismo proyecto</span><span>Portable</span><span>FSS editable</span><span>36 idiomas</span><span>32 temas</span><span>B4J Portable</span></div>
        <div class="seo-grid">
          <article class="seo-card"><h3>Una sola definición, menos trabajo duplicado</h3><p>Nombre, versión, archivos, destino, registro, accesos directos e idiomas viven en el mismo proyecto. El flujo MSI reutiliza esa configuración en lugar de obligarte a mantener otra definición.</p></article>
          <article class="seo-card"><h3>Visual cuando quieres velocidad. Script cuando necesitas precisión.</h3><p>Configura las tareas comunes desde la interfaz y conserva FSS visible y editable para revisar, versionar y ajustar reglas avanzadas.</p></article>
          <article class="seo-card"><h3>Distribución pensada más allá de “copiar archivos”</h3><p>Accesos directos, asociaciones, Open With, menús contextuales, registro, acciones, limpieza, idiomas, branding y empaquetado forman parte del mismo flujo.</p></article>
          <article class="seo-card"><h3>EXE para usuarios. MSI para TI.</h3><p>Entrega un Setup EXE visual para distribución directa y genera MSI cuando necesitas Windows Installer, msiexec o despliegue administrado.</p></article>
          <article class="seo-card"><h3>Portables sin reinventar el empaquetado</h3><p>InstallerLab incluye flujo Portable y una integración especial para B4J que usa el toolchain del desarrollador y añade su propia capa de distribución.</p></article>
          <article class="seo-card"><h3>Gratis para construir instaladores</h3><p>El flujo principal permanece gratuito. El apoyo PRO opcional desde US$10 desbloquea creación de Portables y 21 temas PRO para una máquina.</p></article>
        </div>
        <div class="seo-cta"><a class="button primary" href="${BASE}download/">Descargar InstallerLab v1.0.0 →</a><a class="button" href="${BASE}inno-setup-alternative/">Comparar alternativas</a><a class="button" href="${BASE}docs/">Ver documentación</a></div>
      </div>` : `
      <div class="seo-shell">
        <span class="seo-kicker">Built for developers who want to ship the installer today</span>
        <h2>A visual Windows installer builder that does not force you to choose between speed and control.</h2>
        <p class="seo-lede">InstallerLab is designed around real distribution pain: maintaining separate EXE and MSI projects, hand-writing WiX XML, duplicating file and registry rules, or ending up with a generic installer. Work visually while keeping an editable FSS project as your source of truth.</p>
        <div class="seo-proof"><span>Setup EXE</span><span>MSI from the same project</span><span>Portable</span><span>Editable FSS</span><span>36 languages</span><span>32 themes</span><span>B4J Portable</span></div>
        <div class="seo-grid">
          <article class="seo-card"><h3>One definition, less duplicated work</h3><p>Product metadata, files, destination, registry, shortcuts and languages live in the same project. MSI reuses that configuration instead of forcing a second installer definition.</p></article>
          <article class="seo-card"><h3>Visual for speed. Script for precision.</h3><p>Configure everyday tasks in the UI while keeping FSS visible and editable for review, version control and advanced rules.</p></article>
          <article class="seo-card"><h3>Distribution beyond copying files</h3><p>Shortcuts, associations, Open With, context menus, registry, actions, cleanup, languages, branding and packaging stay in one workflow.</p></article>
          <article class="seo-card"><h3>EXE for users. MSI for IT.</h3><p>Ship a visual Setup EXE for direct distribution and generate MSI when Windows Installer, msiexec or managed deployment is required.</p></article>
          <article class="seo-card"><h3>Portable workflows without rebuilding your process</h3><p>InstallerLab includes Portable packaging and a dedicated B4J workflow that uses the developer toolchain and adds InstallerLab's distribution layer.</p></article>
          <article class="seo-card"><h3>Free installer creation</h3><p>The main installer workflow remains free. Optional supporter/PRO activation from US$10 unlocks Portable creation and 21 PRO themes for one machine.</p></article>
        </div>
        <div class="seo-cta"><a class="button primary" href="${BASE}download/">Download InstallerLab v1.0.0 →</a><a class="button" href="${BASE}inno-setup-alternative/">Compare alternatives</a><a class="button" href="${BASE}docs/">Read documentation</a></div>
      </div>`;
    const sections=app.querySelectorAll(':scope > section');
    if(sections.length>1) sections[1].before(section); else app.appendChild(section);
  }

  function run(){ addJsonLd(); injectHome(); }
  function schedule(){ if(busy)return; busy=true; requestAnimationFrame(()=>{busy=false;run();}); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();
