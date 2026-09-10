const ROOT=location.pathname.includes('/installerlab-web/')?'/installerlab-web/':'/';
let lang=localStorage.getItem('il-lang')||'es';
let page=document.body.dataset.page||'home';

const T={
  es:{
    home:['InstallerLab v3 · Deployment para Windows','Un solo proyecto. Múltiples formatos de distribución. Instaladores especializados.','InstallerLab v3 reúne Setup EXE, Portable, MSI y Bundle WiX Burn en un espacio visual basado en FSS, y añade proyectos especializados para Office Add-ins y QGIS Plugins.'],
    features:['InstallerLab v3','Un flujo para cada tipo de distribución.','Application, Office Add-in y QGIS Plugin comparten el mismo entorno, con targets de build inteligentes, CLI, SBOM, firma y Services.'],
    download:['InstallerLab v3.0.0','La versión pública actual está disponible.','Descarga InstallerLab v3.0.0 como Setup EXE, MSI, Bundle o Portable desde la release oficial.'],
    b4j:['Integración B4J','B4J Portable para proyectos B4J.','InstallerLab usa el toolchain local B4J/JDK del desarrollador para crear una distribución standalone y mantiene el resto de workflows independientes de B4J.'],
    donate:['Apoya el proyecto','Donación y activación PRO.','InstallerLab mantiene su núcleo gratuito. La activación PRO es una forma opcional de apoyar el desarrollo y desbloquear funciones adicionales.'],
    faq:['InstallerLab v3','Preguntas frecuentes.','Respuestas sobre Application, Office Add-ins, QGIS Plugins, EXE, MSI, Bundle, Portable, CLI, WiX y B4J.'],
    support:['Soporte v3','Ayuda para construir y distribuir mejor.','Incluye versión, ProjectType, target de build, pasos y logs relevantes para poder reproducir un problema.'],
    about:['InstallerLab v3','Un proyecto independiente de deployment para Windows.','Desarrollado con B4J, InstallerLab combina authoring visual y FSS editable para aplicaciones, Office Add-ins y QGIS Plugins.'],
    changelog:['InstallerLab v3.0.0','Historial de versiones.','Consulta las novedades de v3.0.0, las notas de release y los archivos oficiales publicados.']
  },
  en:{
    home:['InstallerLab v3 · Windows Deployment','One project. Multiple deployment formats. Specialized installers.','InstallerLab v3 brings Setup EXE, Portable, MSI and WiX Burn Bundle into one FSS-based visual workspace, with specialized Office Add-in and QGIS Plugin projects.'],
    features:['InstallerLab v3','A workflow for every deployment type.','Application, Office Add-in and QGIS Plugin projects share one workspace with smart build targets, CLI, SBOM, signing and Services.'],
    download:['InstallerLab v3.0.0','The current public release is available.','Download InstallerLab v3.0.0 as Setup EXE, MSI, Bundle or Portable from the official release.'],
    b4j:['B4J integration','B4J Portable for B4J projects.','InstallerLab uses the developer’s local B4J/JDK toolchain for standalone packaging while normal workflows remain independent from B4J.'],
    donate:['Support the project','Donation and PRO activation.','InstallerLab keeps its core free. PRO activation is an optional way to support development and unlock additional features.'],
    faq:['InstallerLab v3','Frequently asked questions.','Answers about Application, Office Add-ins, QGIS Plugins, EXE, MSI, Bundle, Portable, CLI, WiX and B4J.'],
    support:['v3 support','Help build and distribute better.','Include the version, ProjectType, build target, reproduction steps and relevant logs when reporting an issue.'],
    about:['InstallerLab v3','An independent Windows deployment project.','Built with B4J, InstallerLab combines visual authoring and editable FSS for applications, Office Add-ins and QGIS Plugins.'],
    changelog:['InstallerLab v3.0.0','Release history.','Review v3.0.0 changes, release notes and the official published files.']
  }
};

const isES=()=>lang!=='en';
const u=p=>ROOT+p.replace(/^\/+/, '');
const icon=()=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16v16H4z"/><path d="M8 12h8M12 8v8"/></svg>';
const code=s=>`<pre class="code"><button class="copy">Copy</button><code>${String(s).replaceAll('<','&lt;')}</code></pre>`;

function cards(){
  const es=isES();
  return [
    ['Setup EXE',es?'Instalador visual para proyectos Application con temas, idiomas, archivos, accesos, registro y acciones.':'Visual installer for Application projects with themes, languages, files, shortcuts, registry and actions.','docs/#first-installer'],
    ['MSI',es?'Windows Installer generado mediante el backend WiX; también es la base de los instaladores especializados.':'Windows Installer generated through the WiX backend and used as the base for specialized installers.','msi-builder/'],
    ['Bundle',es?'Bootstrapper WiX Burn que encadena prerrequisitos y el MSI principal en un solo EXE.':'WiX Burn bootstrapper that chains prerequisites and the main MSI into one EXE.','bundle-builder/'],
    ['Portable',es?'Distribución portable para aplicaciones compatibles sin crear un segundo proyecto.':'Portable distribution for compatible applications without creating a second project.','portable-app-builder/'],
    ['B4J Portable',es?'Workflow dedicado que usa B4JBuilder y B4JPackager11 con el toolchain del desarrollador.':'Dedicated workflow using B4JBuilder and B4JPackager11 with the developer toolchain.','b4j/'],
    ['Office Add-ins',es?'Excel, Word y PowerPoint VBA como ProjectType especializado con MSI y Bundle.':'Excel, Word and PowerPoint VBA as a specialized ProjectType with MSI and Bundle.','docs/#office-addins'],
    ['QGIS Plugins',es?'Plugins Python desde carpeta o ZIP, con PluginId estable y perfil QGIS correcto.':'Python plugins from folder or ZIP with stable PluginId and the correct QGIS profile.','docs/#qgis-plugins'],
    ['CLI · SBOM · Signing',es?'Analyze/build/SBOM por CLI, CycloneDX/SPDX y firma Authenticode con SignTool.':'CLI analyze/build/SBOM, CycloneDX/SPDX and Authenticode signing with SignTool.','docs/#cli']
  ];
}

function header(){
  return `<a class="skip" href="#main">Skip to content</a><header class="header"><nav class="nav shell"><a class="brand" href="${ROOT}"><img src="${u('assets/icon.png')}" alt="InstallerLab">InstallerLab</a><div class="links"><a href="${u('features/')}">Features</a><a href="${u('docs/')}">Documentation</a><a data-v3-compare-nav="1" href="${u('comparison/')}">${isES()?'Comparar':'Compare'}</a><a href="${u('b4j/')}">B4J</a><a href="${u('download/')}">Download</a><a href="${u('donate/')}">Donate</a></div><div class="actions"><select class="lang" aria-label="Language"><option value="en">EN</option><option value="es">ES</option></select><a class="button primary" href="${u('download/')}">${isES()?'Descargar v3':'Download v3'}</a></div></nav></header>`;
}

function footer(){
  return `<footer class="footer"><div class="shell footer-grid"><div><div class="brand"><img src="${u('assets/icon.png')}" alt="">InstallerLab v3</div><p>${isES()?'Deployment para Windows sin complejidad innecesaria.':'Windows deployment without unnecessary setup complexity.'}</p></div><div><h4>Product</h4><a href="${u('features/')}">Features</a><a href="${u('download/')}">Download</a><a href="${u('changelog/')}">Changelog</a></div><div><h4>Docs</h4><a href="${u('docs/')}">Getting started</a><a href="${u('comparison/')}">${isES()?'Comparativa':'Comparison'}</a><a href="${u('b4j/')}">B4J Portable</a></div><div><h4>Support</h4><a href="${u('support/')}">Support</a><a href="${u('donate/')}">Donate / PRO</a><a href="mailto:farevbalo210@gmail.com">farevbalo210@gmail.com</a></div></div><div class="shell legal">InstallerLab is an independent software project and is not affiliated with or endorsed by Anywhere Software, Microsoft, QGIS or the other products referenced for technical comparison. © <span id="year"></span> InstallerLab.</div></footer>`;
}

function home(t){
  const es=isES();
  const all=cards();
  return `<section class="hero"><div class="shell hero-grid"><div><span class="eyebrow">${t[0]}</span><h1>${t[1]}</h1><p>${t[2]}</p><div class="hero-actions"><a class="button primary" href="${u('download/')}">${es?'Descargar InstallerLab v3 →':'Download InstallerLab v3 →'}</a><a class="button" href="${u('docs/')}">${es?'Leer documentación':'Read documentation'}</a><a class="button" data-v3-compare-hero="1" href="${u('comparison/')}">${es?'Comparar herramientas →':'Compare tools →'}</a></div><div class="status">v3.0.0 · FSS · Setup EXE · MSI · Bundle · Portable · Office Add-ins · QGIS Plugins</div></div><div class="visual"><img src="${u('assets/installerlab-banner.png')}" alt="InstallerLab v3"><div class="build-strip"><i class="ok"></i> InstallerLab v3 · EXE · Portable · MSI · Bundle · Office · QGIS</div></div></div></section>
  <section><div class="shell"><div class="section-head"><span class="eyebrow">${es?'Múltiples salidas, un proyecto':'Multiple outputs, one project'}</span><h2>${es?'Elige el formato que realmente corresponde a tu proyecto.':'Choose the deployment format that actually fits your project.'}</h2></div><div class="grid">${all.slice(0,5).map(c=>`<article class="card">${icon()}<h3>${c[0]}</h3><p>${c[1]}</p><a href="${u(c[2])}">${es?'Más información →':'Learn more →'}</a></article>`).join('')}</div></div></section>
  <section id="home-v3-specialized" class="band"><div class="shell"><div class="section-head"><span class="eyebrow">${es?'Nuevo en v3':'New in v3'}</span><h2>${es?'InstallerLab ahora entiende el tipo de proyecto.':'InstallerLab now understands the project type.'}</h2><p>${es?'El mismo FSS puede describir una Application, un OfficeAddin o un QgisPlugin y la interfaz habilita solo los targets válidos.':'The same FSS can describe an Application, OfficeAddin or QgisPlugin and the UI enables only valid build targets.'}</p></div><div class="grid">${all.slice(5).map(c=>`<article class="card">${icon()}<h3>${c[0]}</h3><p>${c[1]}</p><a href="${u(c[2])}">${es?'Explorar →':'Explore →'}</a></article>`).join('')}</div></div></section>
  <section id="home-tool-comparison"><div class="shell"><div class="section-head"><span class="eyebrow">${es?'Comparativa 2026':'2026 comparison'}</span><h2>${es?'InstallerLab frente a otras herramientas de deployment.':'InstallerLab compared with other deployment tools.'}</h2><p>${es?'La comparación con Inno Setup, WiX, Advanced Installer, NSIS e InstallShield tiene ahora una página propia con matriz, notas y fuentes oficiales.':'The comparison with Inno Setup, WiX, Advanced Installer, NSIS and InstallShield now has its own page with a matrix, notes and official sources.'}</p></div><a class="button primary" href="${u('comparison/')}">${es?'Abrir comparativa completa →':'Open full comparison →'}</a></div></section>`;
}

function features(t){
  const es=isES();
  return `<section class="page-hero"><div class="shell"><span class="eyebrow">${t[0]}</span><h1>${t[1]}</h1><p>${t[2]}</p></div></section><main id="main" class="content"><section id="features-v3"><div class="grid">${cards().map(c=>`<article class="card">${icon()}<h3>${c[0]}</h3><p>${c[1]}</p></article>`).join('')}</div><h2>${es?'Smart Build Targets':'Smart Build Targets'}</h2><table class="table"><tr><th>ProjectType</th><th>EXE</th><th>Portable</th><th>B4J Portable</th><th>MSI</th><th>Bundle</th></tr><tr><td>Application</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr><tr><td>OfficeAddin</td><td>—</td><td>—</td><td>—</td><td>✓</td><td>✓</td></tr><tr><td>QgisPlugin</td><td>—</td><td>—</td><td>—</td><td>✓</td><td>✓</td></tr></table><p><a class="button" href="${u('comparison/')}">${es?'Comparar InstallerLab con otras herramientas →':'Compare InstallerLab with other tools →'}</a></p></section></main>`;
}

function standard(t){
  const es=isES();
  let x='';
  if(page==='download') x=`<div class="notice"><b>InstallerLab v3.0.0</b><p>${es?'La release oficial incluye Setup EXE, MSI, Bundle EXE y Portable. Los hashes SHA-256 están publicados junto con las notas de versión.':'The official release includes Setup EXE, MSI, Bundle EXE and Portable. SHA-256 hashes are published with the release notes.'}</p><p><a class="button primary" href="https://github.com/fernand21/installerlab-web/releases/tag/v3.0.0" target="_blank" rel="noopener">${es?'Abrir release v3.0.0 ↗':'Open v3.0.0 release ↗'}</a></p></div>`;
  if(page==='faq') x=`<div class="faq"><details open data-v3-specialized-faq="1"><summary>${es?'¿Qué tipos de proyecto soporta InstallerLab v3?':'Which project types does InstallerLab v3 support?'}</summary><p>${es?'Application, OfficeAddin y QgisPlugin. Application conserva todos los targets; Office y QGIS usan MSI y Bundle.':'Application, OfficeAddin and QgisPlugin. Application keeps all targets; Office and QGIS use MSI and Bundle.'}</p></details><details><summary>${es?'¿Necesito WiX?':'Do I need WiX?'}</summary><p>${es?'Solo para crear MSI o Bundle. InstallerLab v3 está preparado para WiX 7.x; Bundle usa BootstrapperApplications y Util cuando la detección de prerrequisitos lo requiere.':'Only to create MSI or Bundle. InstallerLab v3 targets WiX 7.x; Bundle uses BootstrapperApplications and Util when prerequisite detection requires it.'}</p></details><details><summary>${es?'¿Existe CLI?':'Is there a CLI?'}</summary><p>${es?'Sí. v3 incluye analyze, build y sbom mediante --cli.':'Yes. v3 includes analyze, build and sbom through --cli.'}</p></details><details><summary>${es?'¿Necesito B4J?':'Do I need B4J?'}</summary><p>${es?'No para los workflows normales. Solo para construir un proyecto B4J mediante B4J Portable.':'Not for normal workflows. Only when building a B4J project through B4J Portable.'}</p></details><details><summary>${es?'¿Cómo funciona el idioma automático?':'How does automatic language selection work?'}</summary><p>${es?'Cultura exacta de Windows → idioma base → InstallerLanguage → inglés.':'Exact Windows UI culture → base language → InstallerLanguage → English.'}</p></details></div>`;
  if(page==='support') x=`<p>${es?'Al reportar un problema incluye esta información:':'When reporting an issue, include:'}</p>${code('InstallerLab version: 3.0.0\nWindows version:\nProjectType: Application / OfficeAddin / QgisPlugin\nBuild type: Setup EXE / Portable / B4J Portable / MSI / Bundle / Office Add-in / QGIS Plugin\nSteps to reproduce:\nExpected:\nActual:\nRelevant log:')}`;
  if(page==='about') x=`<p>${es?'InstallerLab v3 es un proyecto independiente desarrollado con B4J para simplificar deployment y packaging en Windows sin ocultar la configuración real. FSS continúa siendo la fuente de verdad editable.':'InstallerLab v3 is an independent B4J-built project for simplifying Windows deployment and packaging without hiding the real configuration. FSS remains the editable source of truth.'}</p><p>${es?'v3 añade Office Add-ins VBA, QGIS Python Plugins, Smart Build Targets, CLI, SBOM, firma digital y Services al flujo existente de EXE, MSI, Bundle y Portable.':'v3 adds VBA Office Add-ins, QGIS Python Plugins, Smart Build Targets, CLI, SBOM, digital signing and Services to the existing EXE, MSI, Bundle and Portable workflow.'}</p><p><a class="button" href="${u('comparison/')}">${es?'Ver comparativa de herramientas →':'View tool comparison →'}</a></p>`;
  if(page==='changelog') x=`<div class="notice"><b>InstallerLab v3.0.0</b><p>${es?'Versión pública actual: instaladores especializados Office/QGIS, Smart Build Targets, CLI, SBOM, firma, Services y mejoras MSI/Bundle.':'Current public release: specialized Office/QGIS installers, Smart Build Targets, CLI, SBOM, signing, Services and MSI/Bundle improvements.'}</p><p><a class="button primary" href="https://github.com/fernand21/installerlab-web/releases/tag/v3.0.0" target="_blank" rel="noopener">${es?'Notas y archivos v3.0.0 ↗':'v3.0.0 notes and files ↗'}</a></p></div>`;
  if(page==='donate') x='<p>InstallerLab PRO</p>';
  return `<section class="page-hero"><div class="shell"><span class="eyebrow">${t[0]}</span><h1>${t[1]}</h1><p>${t[2]}</p></div></section><main id="main" class="content">${x}</main>`;
}

function docsFallback(){
  const es=isES();
  return `<section class="page-hero"><div class="shell"><span class="eyebrow">InstallerLab v3</span><h1>${es?'Documentación de deployment e instaladores.':'Deployment and installer documentation.'}</h1><p>${es?'Application, Office Add-ins, QGIS Plugins, Setup EXE, MSI, Bundle, Portable, CLI, SBOM y FSS.':'Application, Office Add-ins, QGIS Plugins, Setup EXE, MSI, Bundle, Portable, CLI, SBOM and FSS.'}</p></div></section><main id="main" class="content"><p><a href="${u('comparison/')}">${es?'Comparativa de herramientas':'Tool comparison'}</a></p></main>`;
}

function render(){
  const t=(T[lang]||T.es)[page]||(T[lang]||T.es).home;
  const body=page==='docs'?docsFallback():page==='home'?home(t):page==='features'?features(t):standard(t);
  document.body.innerHTML=header()+`<div id="app">${body}</div>`+footer();
  const select=document.querySelector('.lang'); if(select){select.value=lang;select.onchange=e=>{lang=e.target.value;localStorage.setItem('il-lang',lang);render();};}
  document.querySelectorAll('.copy').forEach(b=>b.onclick=()=>navigator.clipboard.writeText(b.nextElementSibling.textContent).then(()=>b.textContent=isES()?'Copiado':'Copied'));
  const year=document.querySelector('#year'); if(year)year.textContent=new Date().getFullYear();
}
render();
