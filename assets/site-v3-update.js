(() => {
  const BASE = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  let queued = false;
  const es = () => ((localStorage.getItem('il-lang') || 'es').toLowerCase() !== 'en');
  const icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16v16H4z"/><path d="M8 12h8M12 8v8"/></svg>';
  const url = p => BASE + p.replace(/^\/+/, '');

  function replaceVersionText(root=document){
    root.querySelectorAll('a,button,h1,h2,h3,p,span,b,strong').forEach(el => {
      if (el.children.length) return;
      const t = el.textContent || '';
      const next = t
        .replace(/InstallerLab v2\.0\.0/g, 'InstallerLab v3.0.0')
        .replace(/InstallerLab v2\b/g, 'InstallerLab v3')
        .replace(/Download v2\.0\.0/g, 'Download v3.0.0')
        .replace(/Download v1\.0\.0/g, 'Download v3.0.0')
        .replace(/Download InstallerLab v2/g, 'Download InstallerLab v3')
        .replace(/Get InstallerLab v2/g, 'Get InstallerLab v3');
      if (next !== t) el.textContent = next;
    });
    root.querySelectorAll('a[href]').forEach(a => {
      let h = a.getAttribute('href') || '';
      if (/releases\/(download|tag)\/v[12]\.0\.0/i.test(h)) h = h.replace(/v[12]\.0\.0/g,'v3.0.0');
      if (h === '#installer-comparison' || /\/docs\/?#installer-comparison$/.test(h)) h = url('comparison/');
      a.setAttribute('href', h);
    });
  }

  function ensureCompareNav(){
    const links = document.querySelector('.header .nav .links');
    if (!links) return;
    links.querySelectorAll('[data-v2-compare-nav]').forEach(a=>a.remove());
    let a = links.querySelector('[data-v3-compare-nav]');
    if (!a){
      a = document.createElement('a'); a.dataset.v3CompareNav='1';
      const download = [...links.querySelectorAll('a')].find(x => /download|descarga/i.test(x.textContent||''));
      if (download) links.insertBefore(a,download); else links.appendChild(a);
    }
    a.href = url('comparison/'); a.textContent = es() ? 'Comparar' : 'Compare';
  }

  function ensureBundleCard(){
    if(!['home','features'].includes(document.body.dataset.page)) return;
    const grid=[...document.querySelectorAll('section .grid, main.content .grid')].find(g=>[...g.querySelectorAll('.card h3')].some(h=>/Setup EXE/i.test(h.textContent||'')));
    if(!grid || [...grid.querySelectorAll('.card h3')].some(h=>/^Bundle$/i.test((h.textContent||'').trim()))) return;
    const a=document.createElement('article'); a.className='card'; a.dataset.v3Bundle='1';
    a.innerHTML=`${icon}<h3>Bundle</h3><p>${es()?'WiX Burn bootstrapper que encadena prerrequisitos y el MSI principal. En v3 también envuelve los MSI especializados de Office Add-in y QGIS Plugin.':'WiX Burn bootstrapper that chains prerequisites and the main MSI. In v3 it also wraps the specialized Office Add-in and QGIS Plugin MSI backends.'}</p>${document.body.dataset.page==='home'?`<a href="${url('docs/#bundle')}">${es()?'Más información →':'Learn more →'}</a>`:''}`;
    grid.appendChild(a);
  }

  function ensureHomeComparison(){
    if(document.body.dataset.page!=='home') return;
    let section=document.getElementById('home-tool-comparison');
    if(!section){
      section=document.createElement('section'); section.id='home-tool-comparison';
      const specialized=document.getElementById('home-v3-specialized');
      if(specialized) specialized.after(section); else document.getElementById('app')?.appendChild(section);
    }
    section.innerHTML=es()?`<div class="shell"><div class="section-head"><span class="eyebrow">Comparativa 2026</span><h2>InstallerLab v3 frente a Inno Setup, WiX, Advanced Installer, NSIS e InstallShield.</h2><p>La comparación ahora tiene una página propia. Revisa formatos, authoring, CLI, Services, firma, Office Add-ins, QGIS Plugins y otras diferencias sin buscar una sección dentro de la documentación.</p></div><div class="grid"><article class="card"><h3>InstallerLab vs Inno Setup</h3><p>GUI + FSS frente a script-first, incluyendo ISS → FSS.</p><a href="${url('comparison/')}">Abrir comparativa →</a></article><article class="card"><h3>InstallerLab vs WiX</h3><p>Capa visual frente a authoring técnico directo de MSI y Burn.</p><a href="${url('comparison/')}">Abrir comparativa →</a></article><article class="card"><h3>Office y QGIS</h3><p>Compara los nuevos project types especializados de InstallerLab v3.</p><a href="${url('comparison/#specialized')}">Ver especialización →</a></article><article class="card"><h3>Matriz completa</h3><p>Una tabla única con fuentes oficiales revisadas en septiembre de 2026.</p><a href="${url('comparison/#matrix')}">Ver matriz →</a></article></div></div>`:`<div class="shell"><div class="section-head"><span class="eyebrow">2026 comparison</span><h2>InstallerLab v3 vs Inno Setup, WiX, Advanced Installer, NSIS and InstallShield.</h2><p>The comparison now has its own page. Review formats, authoring, CLI, Services, signing, Office Add-ins, QGIS Plugins and other differences without hunting through the documentation.</p></div><div class="grid"><article class="card"><h3>InstallerLab vs Inno Setup</h3><p>GUI + FSS compared with script-first authoring, including ISS → FSS.</p><a href="${url('comparison/')}">Open comparison →</a></article><article class="card"><h3>InstallerLab vs WiX</h3><p>A visual layer compared with direct technical MSI and Burn authoring.</p><a href="${url('comparison/')}">Open comparison →</a></article><article class="card"><h3>Office and QGIS</h3><p>Compare InstallerLab v3's new specialized project types.</p><a href="${url('comparison/#specialized')}">View specialization →</a></article><article class="card"><h3>Full matrix</h3><p>One table backed by official sources reviewed in September 2026.</p><a href="${url('comparison/#matrix')}">View matrix →</a></article></div></div>`;
  }

  function ensureHome(){
    if (document.body.dataset.page !== 'home') return;
    const lead = document.querySelector('.hero .hero-grid>div>p');
    if (lead) lead.textContent = es()
      ? 'InstallerLab v3 reúne Setup EXE, Portable, MSI y Bundle WiX Burn en un mismo espacio visual, y ahora entiende proyectos especializados de Office Add-ins y QGIS Plugins desde el mismo FSS.'
      : 'InstallerLab v3 brings Setup EXE, Portable, MSI and WiX Burn Bundle into one visual workspace, and now understands specialized Office Add-in and QGIS Plugin projects from the same FSS.';
    const strip = document.querySelector('.build-strip'); if (strip) strip.innerHTML = '<i class="ok"></i> InstallerLab v3 · EXE · Portable · MSI · Bundle · Office · QGIS';
    const actions = document.querySelector('.hero-actions');
    if (actions){
      actions.querySelectorAll('[data-v2-compare-hero]').forEach(a=>a.remove());
      let compare = actions.querySelector('[data-v3-compare-hero]');
      if (!compare){ compare=document.createElement('a'); compare.className='button'; compare.dataset.v3CompareHero='1'; actions.appendChild(compare); }
      compare.href=url('comparison/'); compare.textContent=es()?'Comparar herramientas →':'Compare tools →';
    }
    let section = document.getElementById('home-v3-specialized');
    if (!section){ section=document.createElement('section'); section.id='home-v3-specialized'; document.getElementById('app')?.appendChild(section); }
    section.innerHTML = es() ? `<div class="shell"><div class="section-head"><span class="eyebrow">Nuevo en InstallerLab v3</span><h2>Un proyecto que entiende lo que estás distribuyendo.</h2><p>Además del flujo clásico de aplicaciones Windows, v3 incorpora instaladores especializados, automatización y herramientas de release.</p></div><div class="grid"><article class="card">${icon}<h3>Office Add-ins</h3><p>Importa y empaqueta complementos VBA de Excel, Word y PowerPoint como proyectos especializados con MSI y Bundle.</p><a href="${url('docs/#office-addins')}">Ver Office Add-ins →</a></article><article class="card">${icon}<h3>QGIS Plugins</h3><p>Importa plugins Python desde carpeta o ZIP, conserva PluginId estable y despliega al perfil correcto de QGIS.</p><a href="${url('docs/#qgis-plugins')}">Ver QGIS Plugins →</a></article><article class="card">${icon}<h3>CLI + SBOM + Signing</h3><p>Analiza y compila por CLI, genera CycloneDX/SPDX y firma artefactos con Authenticode/SignTool.</p><a href="${url('docs/#cli')}">Ver automatización →</a></article><article class="card">${icon}<h3>Smart Build Targets</h3><p>Application mantiene todos los targets; Office y QGIS muestran únicamente MSI y Bundle como opciones válidas.</p><a href="${url('docs/#smart-targets')}">Ver matriz de build →</a></article></div></div>` : `<div class="shell"><div class="section-head"><span class="eyebrow">New in InstallerLab v3</span><h2>A project model that understands what you are deploying.</h2><p>Alongside the classic Windows application workflow, v3 adds specialized installers, automation and release tooling.</p></div><div class="grid"><article class="card">${icon}<h3>Office Add-ins</h3><p>Import and package Excel, Word and PowerPoint VBA add-ins as specialized MSI and Bundle projects.</p><a href="${url('docs/#office-addins')}">Explore Office Add-ins →</a></article><article class="card">${icon}<h3>QGIS Plugins</h3><p>Import Python plugins from folder or ZIP, keep a stable PluginId and deploy into the proper QGIS profile.</p><a href="${url('docs/#qgis-plugins')}">Explore QGIS Plugins →</a></article><article class="card">${icon}<h3>CLI + SBOM + Signing</h3><p>Analyze and build from CLI, generate CycloneDX/SPDX, and sign artifacts with Authenticode/SignTool.</p><a href="${url('docs/#cli')}">Explore automation →</a></article><article class="card">${icon}<h3>Smart Build Targets</h3><p>Application keeps every target; Office and QGIS automatically expose only MSI and Bundle as valid outputs.</p><a href="${url('docs/#smart-targets')}">View build matrix →</a></article></div></div>`;
    ensureHomeComparison();
  }

  function ensureFeatures(){
    if (document.body.dataset.page !== 'features') return;
    const hero = document.querySelector('.page-hero .shell p'); if (hero) hero.textContent = es() ? 'InstallerLab v3 combina Application, Office Add-in y QGIS Plugin con Setup EXE, Portable, MSI, Bundle, CLI, SBOM, firma digital, Services, FSS Analyzer e importación ISS → FSS.' : 'InstallerLab v3 combines Application, Office Add-in and QGIS Plugin projects with Setup EXE, Portable, MSI, Bundle, CLI, SBOM, digital signing, Services, FSS Analyzer and ISS → FSS import.';
    const main=document.querySelector('main.content'); if(!main) return;
    let section=document.getElementById('features-v3'); if(!section){ section=document.createElement('section'); section.id='features-v3'; main.appendChild(section); }
    section.innerHTML=es()?`<h2>Funciones añadidas en v3</h2><div class="grid"><article class="card"><h3>Office Add-ins</h3><p>Excel, Word y PowerPoint VBA con importación especializada, activación y lifecycle MSI/Bundle.</p></article><article class="card"><h3>QGIS Plugins</h3><p>Carpeta/ZIP, metadata estática, PluginId, perfiles QGIS y lifecycle MSI/Bundle.</p></article><article class="card"><h3>CLI</h3><p><code>--cli analyze</code>, <code>build</code> y <code>sbom</code> para automatización y CI.</p></article><article class="card"><h3>SBOM + firma</h3><p>CycloneDX, SPDX y Authenticode con SignTool y verificación posterior.</p></article><article class="card"><h3>Windows Services</h3><p>Reglas de servicio dentro del FSS para targets instalables compatibles.</p></article><article class="card"><h3>Idioma automático</h3><p>Cultura exacta → idioma base → InstallerLanguage → English fallback.</p></article><article class="card"><h3>Smart targets</h3><p>El Ribbon y el menú Build habilitan solo formatos válidos para el ProjectType activo.</p></article><article class="card"><h3>Comparativa independiente</h3><p>La tabla de herramientas tiene ahora su propia página y enlaces directos.</p><a href="${url('comparison/')}">Abrir comparativa →</a></article></div>`:`<h2>Features added in v3</h2><div class="grid"><article class="card"><h3>Office Add-ins</h3><p>Excel, Word and PowerPoint VBA with specialized import, activation and MSI/Bundle lifecycle.</p></article><article class="card"><h3>QGIS Plugins</h3><p>Folder/ZIP import, static metadata inspection, PluginId, QGIS profiles and MSI/Bundle lifecycle.</p></article><article class="card"><h3>CLI</h3><p><code>--cli analyze</code>, <code>build</code> and <code>sbom</code> for automation and CI.</p></article><article class="card"><h3>SBOM + signing</h3><p>CycloneDX, SPDX and Authenticode with SignTool and post-sign verification.</p></article><article class="card"><h3>Windows Services</h3><p>Service rules in FSS for compatible installable targets.</p></article><article class="card"><h3>Automatic language</h3><p>Exact culture → base language → InstallerLanguage → English fallback.</p></article><article class="card"><h3>Smart targets</h3><p>Ribbon and Build menu expose only valid outputs for the active ProjectType.</p></article><article class="card"><h3>Dedicated comparison</h3><p>The installer-tool matrix now has its own directly addressable page.</p><a href="${url('comparison/')}">Open comparison →</a></article></div>`;
  }

  function ensureFaqSupport(){
    if(document.body.dataset.page==='faq'){
      const faq=document.querySelector('.faq'); if(faq&&!faq.querySelector('[data-v3-specialized-faq]')){const d=document.createElement('details'); d.dataset.v3SpecializedFaq='1'; d.innerHTML=es()?'<summary>¿Qué proyectos especializados soporta v3?</summary><p>Office Add-ins VBA de Excel/Word/PowerPoint y QGIS Python Plugins. Para estos proyectos InstallerLab habilita MSI y Bundle y desactiva targets que no aplican.</p>':'<summary>Which specialized projects does v3 support?</summary><p>Excel/Word/PowerPoint VBA Office Add-ins and QGIS Python Plugins. InstallerLab enables MSI and Bundle for these projects and disables targets that do not apply.</p>'; faq.appendChild(d);}
    }
    if(document.body.dataset.page==='support') document.querySelectorAll('code').forEach(c=>{if(c.textContent.includes('Build type:')) c.textContent=c.textContent.replace(/Build type:[^\n]*/,'Build type: Setup EXE / Portable / B4J Portable / MSI / Bundle / Office Add-in / QGIS Plugin');});
  }

  function apply(){replaceVersionText();ensureCompareNav();ensureBundleCard();ensureHome();ensureFeatures();ensureFaqSupport();}
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();
