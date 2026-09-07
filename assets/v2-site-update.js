(() => {
  const BASE='https://fernand21.github.io/installerlab-web/';
  let queued=false;
  const l=()=>((localStorage.getItem('il-lang')||'es').toLowerCase()==='en'?'en':'es');
  const icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16v16H4z"/><path d="M8 12h8M12 8v8"/></svg>';
  function setText(node,value){if(node&&node.textContent!==value)node.textContent=value;}
  function addBundleCard(grid,withLink){
    if(!grid||grid.querySelector('[data-v2-bundle]'))return;
    const es=l()==='es';
    const article=document.createElement('article');article.className='card';article.dataset.v2Bundle='1';
    article.innerHTML=`${icon}<h3>Bundle</h3><p>${es?'Bootstrapper WiX Burn que encadena prerequisitos EXE/MSI y el MSI principal en un único ejecutable.':'WiX Burn bootstrapper that chains EXE/MSI prerequisites and the main MSI into one executable.'}</p>${withLink?`<a href="${BASE}docs/#bundle">${es?'Más información →':'Learn more →'}</a>`:''}`;
    grid.appendChild(article);
  }
  function addCompareAccess(){
    const es=l()==='es';
    const links=document.querySelector('.header .nav .links');
    if(links&&!links.querySelector('[data-v2-compare-nav]')){
      const a=document.createElement('a');a.dataset.v2CompareNav='1';a.href=BASE+'docs/#installer-comparison';a.textContent=es?'Comparar':'Compare';
      const download=[...links.querySelectorAll('a')].find(x=>/download|descarga/i.test(x.textContent||''));
      if(download)links.insertBefore(a,download);else links.appendChild(a);
    } else if(links){
      const a=links.querySelector('[data-v2-compare-nav]');if(a)setText(a,es?'Comparar':'Compare');
    }

    if(document.body.dataset.page==='home'){
      const actions=document.querySelector('.hero-actions');
      if(actions&&!actions.querySelector('[data-v2-compare-hero]')){
        const a=document.createElement('a');a.className='button';a.dataset.v2CompareHero='1';a.href=BASE+'docs/#installer-comparison';a.textContent=es?'Comparar herramientas →':'Compare tools →';actions.appendChild(a);
      } else if(actions){
        const a=actions.querySelector('[data-v2-compare-hero]');if(a)setText(a,es?'Comparar herramientas →':'Compare tools →');
      }
    }
  }
  function addHomeComparison(){
    if(document.body.dataset.page!=='home')return;
    const es=l()==='es';
    let section=document.getElementById('home-tool-comparison');
    if(!section){
      section=document.createElement('section');section.id='home-tool-comparison';section.dataset.v2Comparison='1';
      const productSection=[...document.querySelectorAll('#app > section')].find(s=>s.querySelector('.grid .card'));
      if(productSection&&productSection.nextElementSibling)productSection.nextElementSibling.before(section);else document.getElementById('app')?.appendChild(section);
    }
    section.innerHTML=es?`
      <div class="shell">
        <div class="section-head">
          <span class="eyebrow">Compara antes de elegir</span>
          <h2>¿InstallerLab, Inno Setup, WiX, Advanced Installer, NSIS o InstallShield?</h2>
          <p>La documentación incluye una comparativa práctica y con fuentes públicas: filosofía de authoring, EXE, MSI, Bundle, prerequisitos, scripting, importación y tipo de proyecto.</p>
        </div>
        <div class="grid">
          <article class="card"><h3>InstallerLab vs Inno Setup</h3><p>Compara el flujo visual + FSS con el enfoque script-first de Inno Setup y revisa la migración ISS → FSS de v2.</p><a href="${BASE}docs/#installer-comparison">Ver comparación →</a></article>
          <article class="card"><h3>InstallerLab vs WiX Toolset</h3><p>Entiende cuándo conviene el authoring técnico directo de WiX y cuándo usar InstallerLab como capa visual para MSI y Burn Bundle.</p><a href="${BASE}docs/#installer-comparison">Ver comparación →</a></article>
          <article class="card"><h3>Suites comerciales</h3><p>Advanced Installer e InstallShield cubren escenarios empresariales amplios. La tabla muestra dónde encaja el enfoque ligero basado en FSS.</p><a href="${BASE}docs/#installer-comparison">Advanced Installer / InstallShield →</a></article>
          <article class="card"><h3>Comparativa completa 2026</h3><p>Una sola matriz para InstallerLab v2, Inno Setup, WiX Toolset, Advanced Installer, NSIS e InstallShield, con notas y referencias.</p><a href="${BASE}docs/#installer-comparison">Abrir comparativa completa →</a></article>
        </div>
      </div>`:`
      <div class="shell">
        <div class="section-head">
          <span class="eyebrow">Compare before choosing</span>
          <h2>InstallerLab, Inno Setup, WiX, Advanced Installer, NSIS or InstallShield?</h2>
          <p>The documentation includes a practical comparison backed by public sources: authoring philosophy, EXE, MSI, Bundle, prerequisites, scripting, migration and project model.</p>
        </div>
        <div class="grid">
          <article class="card"><h3>InstallerLab vs Inno Setup</h3><p>Compare InstallerLab's visual + FSS workflow with Inno Setup's script-first approach and review v2's ISS → FSS migration path.</p><a href="${BASE}docs/#installer-comparison">View comparison →</a></article>
          <article class="card"><h3>InstallerLab vs WiX Toolset</h3><p>See when direct WiX authoring makes sense and when InstallerLab can serve as a visual layer for MSI and Burn Bundle workflows.</p><a href="${BASE}docs/#installer-comparison">View comparison →</a></article>
          <article class="card"><h3>Commercial suites</h3><p>Advanced Installer and InstallShield cover broad enterprise scenarios. The matrix shows where InstallerLab's lightweight FSS model fits.</p><a href="${BASE}docs/#installer-comparison">Advanced Installer / InstallShield →</a></article>
          <article class="card"><h3>Full 2026 comparison</h3><p>One matrix covering InstallerLab v2, Inno Setup, WiX Toolset, Advanced Installer, NSIS and InstallShield, with notes and references.</p><a href="${BASE}docs/#installer-comparison">Open full comparison →</a></article>
        </div>
      </div>`;
  }
  function apply(){
    const page=document.body.dataset.page||'home',es=l()==='es';
    addCompareAccess();
    if(page==='home'){
      setText(document.querySelector('.hero .hero-grid>div>p'),es?'InstallerLab reúne Setup EXE, Portable, MSI y Bundle WiX Burn en un espacio de trabajo visual, usando el mismo proyecto FSS como fuente de configuración.':'InstallerLab brings Setup EXE, Portable, MSI and WiX Burn Bundle workflows into one visual workspace, all driven by the same FSS project.');
      const strip=document.querySelector('.build-strip');
      if(strip&&!strip.dataset.v2Updated){strip.dataset.v2Updated='1';strip.innerHTML='<i class="ok"></i> Build workspace · Setup EXE · Portable · MSI · Bundle';}
      const grids=[...document.querySelectorAll('section .grid')];if(grids.length)addBundleCard(grids[0],true);
      addHomeComparison();
    }
    if(page==='features'){
      setText(document.querySelector('.page-hero .shell p'),es?'Setup EXE, Portable, MSI, Bundle WiX Burn y B4J Portable comparten el mismo proyecto visual/FSS, con backends separados y responsabilidades claras.':'Setup EXE, Portable, MSI, WiX Burn Bundle and B4J Portable share the same visual/FSS project while keeping separate backends and clear responsibilities.');
      addBundleCard(document.querySelector('main.content .grid'),false);
    }
    if(page==='faq'){
      setText(document.querySelector('.faq details:first-child p'),es?'No para los flujos normales de Setup EXE, Portable, MSI o Bundle. B4J solo es necesario cuando construyes un proyecto B4J mediante B4J Portable.':'No for normal Setup EXE, Portable, MSI or Bundle workflows. B4J is only required when building a B4J project through B4J Portable.');
      const faq=document.querySelector('.faq');if(faq&&!faq.querySelector('[data-v2-wix-faq]')){const d=document.createElement('details');d.dataset.v2WixFaq='1';d.innerHTML=`<summary>${es?'¿Necesito WiX?':'Do I need WiX?'}</summary><p>${es?'Solo para crear MSI o Bundle. InstallerLab puede ejecutarse sin WiX, pero esas dos salidas requieren el CLI de WiX y sus extensiones BootstrapperApplications y Util en la máquina de build.':'Only when creating MSI or Bundle packages. InstallerLab can run without WiX, but those two outputs require the WiX CLI plus the BootstrapperApplications and Util extensions on the build machine.'}</p>`;faq.appendChild(d);}
    }
    if(page==='support'){
      document.querySelectorAll('code').forEach(c=>{if(c.textContent.includes('Build type:')&&!c.textContent.includes('Bundle'))c.textContent=c.textContent.replace('Build type: Setup EXE / Portable / MSI / B4J Portable','Build type: Setup EXE / Portable / MSI / Bundle / B4J Portable');});
    }
  }
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();
