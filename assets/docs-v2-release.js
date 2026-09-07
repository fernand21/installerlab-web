(() => {
  let queued=false;
  const lang=()=>((localStorage.getItem('il-lang')||'es').toLowerCase()==='en'?'en':'es');
  const wixCommands=`dotnet tool install --global wix\nwix extension add WixToolset.BootstrapperApplications.wixext --global\nwix extension add WixToolset.Util.wixext --global`;
  const codeBlock=(title,text)=>`<div class="docv2-code"><div class="docv2-codebar"><span>${title}</span><button type="button" data-v2-copy>Copy</button></div><pre><code>${text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre></div>`;
  function apply(){
    if(document.body.dataset.page!=='docs')return;
    const main=document.querySelector('.docv2-main');if(!main||main.dataset.v2Release==='1')return;main.dataset.v2Release='1';
    const es=lang()==='es';
    const badges=document.querySelector('.docv2-badges');
    if(badges){if(!badges.querySelector('[data-bundle-badge]'))badges.insertAdjacentHTML('beforeend',`<span class="docv2-badge" data-bundle-badge>Bundle / Burn</span><span class="docv2-badge">FSS Analyzer</span><span class="docv2-badge">ISS → FSS</span>`);}
    const packaging=[...document.querySelectorAll('.docv2-navgroup')].find(g=>(g.querySelector('b')?.textContent||'').match(/Empaquetado|Packaging/i));
    if(packaging&&!packaging.querySelector('a[href="#bundle"]'))packaging.insertAdjacentHTML('beforeend','<a href="#bundle">Bundle / Burn</a>');
    const reference=[...document.querySelectorAll('.docv2-navgroup')].find(g=>(g.querySelector('b')?.textContent||'').match(/Referencia|Reference/i));
    if(reference&&!reference.querySelector('a[href="#fss-tools"]'))reference.insertAdjacentHTML('afterbegin',`<b style="display:none"></b><a href="#fss-tools">${es?'Analizador e importador':'Analyzer & importer'}</a><a href="#zero-trash">ZERO-TRASH</a>`);

    const msi=document.getElementById('msi');
    if(msi){
      const callout=es?'<div class="docv2-callout warn"><strong>MSI puro y prerequisitos:</strong> el MSI no encadena automáticamente <code>[Prerequisites]</code>. Usa Bundle cuando necesites instalar prerequisitos antes del producto principal.</div>':'<div class="docv2-callout warn"><strong>Pure MSI and prerequisites:</strong> the MSI does not automatically chain <code>[Prerequisites]</code>. Use Bundle when prerequisites must run before the main product.</div>';
      msi.insertAdjacentHTML('beforeend',callout);
      msi.insertAdjacentHTML('beforeend',codeBlock(es?'Instalar WiX para MSI/Bundle':'Install WiX for MSI/Bundle',wixCommands));
      msi.insertAdjacentHTML('afterend',es?`
<article id="bundle" data-title="Bundle con WiX Burn" data-keywords="bundle burn wix prerequisites bootstrapper exe msi">
  <span class="docv2-kicker">Nuevo en v2</span><h2>Bundle: prerequisitos + MSI principal en un único EXE.</h2>
  <p>InstallerLab v2 incorpora un backend Bundle basado en <strong>WiX Burn</strong>. El Bundle usa el mismo proyecto FSS y puede encadenar paquetes EXE/MSI definidos en <code>[Prerequisites]</code> antes del MSI principal.</p>
  <div class="docv2-flow"><span>.fss</span><i>→</i><span>[Prerequisites]</span><i>→</i><span>MSI principal</span><i>→</i><span>WiX Burn</span><i>→</i><span>Bundle.exe</span></div>
  <div class="docv2-grid2"><div class="docv2-card"><h3>Un solo proyecto</h3><p>No necesitas mantener un segundo proyecto para Bundle: el FSS sigue siendo la definición del producto.</p></div><div class="docv2-card"><h3>Un solo EXE</h3><p>Burn empaqueta la cadena y el MSI principal en un bootstrapper ejecutable.</p></div><div class="docv2-card"><h3>Orden explícito</h3><p>Los prerequisitos se procesan antes del paquete principal siguiendo el orden del proyecto.</p></div><div class="docv2-card"><h3>Branding</h3><p>La edición v2 usa WixStandardBootstrapperApplication con branding propio de InstallerLab para el Bundle.</p></div></div>
  <div class="docv2-callout warn"><strong>Requisito de build:</strong> para crear Bundles se necesita WiX 7 y las extensiones <code>WixToolset.BootstrapperApplications.wixext</code> y <code>WixToolset.Util.wixext</code>.</div>
</article>`:`
<article id="bundle" data-title="Bundle with WiX Burn" data-keywords="bundle burn wix prerequisites bootstrapper exe msi">
  <span class="docv2-kicker">New in v2</span><h2>Bundle: prerequisites + main MSI in one EXE.</h2>
  <p>InstallerLab v2 adds a <strong>WiX Burn</strong> Bundle backend. It uses the same FSS project and can chain EXE/MSI packages from <code>[Prerequisites]</code> before the main MSI.</p>
  <div class="docv2-flow"><span>.fss</span><i>→</i><span>[Prerequisites]</span><i>→</i><span>Main MSI</span><i>→</i><span>WiX Burn</span><i>→</i><span>Bundle.exe</span></div>
  <div class="docv2-grid2"><div class="docv2-card"><h3>One project</h3><p>No second Bundle project is required: FSS remains the product definition.</p></div><div class="docv2-card"><h3>One EXE</h3><p>Burn packages the chain and main MSI into an executable bootstrapper.</p></div><div class="docv2-card"><h3>Explicit order</h3><p>Prerequisites are processed before the main package in project order.</p></div><div class="docv2-card"><h3>Branding</h3><p>v2 uses WixStandardBootstrapperApplication with InstallerLab-specific Bundle branding.</p></div></div>
  <div class="docv2-callout warn"><strong>Build requirement:</strong> Bundle creation needs WiX 7 plus <code>WixToolset.BootstrapperApplications.wixext</code> and <code>WixToolset.Util.wixext</code>.</div>
</article>`);
    }

    const fss=document.getElementById('fss');
    if(fss)fss.insertAdjacentHTML('beforebegin',es?`
<article id="fss-tools" data-title="Analizador FSS e importador ISS" data-keywords="fss analyzer iss importer inno setup migration errors warnings">
  <span class="docv2-kicker">Herramientas v2</span><h2>Analiza tu FSS y migra scripts ISS sin empezar de cero.</h2>
  <p><strong>FSS Analyzer</strong> revisa la estructura del proyecto antes del empaquetado y puede señalar errores, advertencias y problemas de compatibilidad. El <strong>importador ISS → FSS</strong> convierte las secciones soportadas de un script de Inno Setup al formato propio de InstallerLab.</p>
  <div class="docv2-callout good"><strong>El FSS sigue siendo el respaldo.</strong> El resultado de la migración queda en un archivo de texto pequeño, editable, versionable y reutilizable por todos los backends.</div>
</article>
<article id="zero-trash" data-title="ZERO-TRASH" data-keywords="temp cache staging cleanup zero trash msi bundle portable b4j">
  <span class="docv2-kicker">Pipeline limpio</span><h2>Los builds no deben dejar staging histórico.</h2>
  <p>MSI, Bundle, Portable y B4J Portable usan <code>%TEMP%\\InstallerLab</code> como área de trabajo. El staging se elimina al terminar, tanto en éxito como en fallo, y el arranque limpia temporales huérfanos de ejecuciones anteriores.</p>
  <div class="docv2-flow"><span>FSS</span><i>→</i><span>%TEMP%\\InstallerLab</span><i>→</i><span>Build</span><i>→</i><span>OutputDir</span><i>→</i><span>Temp eliminado</span></div>
  <p>Lo permanente es el proyecto FSS y el artefacto final solicitado; los archivos intermedios no forman parte del proyecto.</p>
</article>`:`
<article id="fss-tools" data-title="FSS Analyzer and ISS importer" data-keywords="fss analyzer iss importer inno setup migration errors warnings">
  <span class="docv2-kicker">v2 tools</span><h2>Analyze FSS projects and migrate ISS scripts without starting over.</h2>
  <p><strong>FSS Analyzer</strong> checks project structure before packaging and can surface errors, warnings and compatibility issues. The <strong>ISS → FSS importer</strong> converts supported Inno Setup sections into InstallerLab's own project format.</p>
  <div class="docv2-callout good"><strong>FSS remains the backup.</strong> Migration results stay in a small, editable, versionable text file reusable by all InstallerLab backends.</div>
</article>
<article id="zero-trash" data-title="ZERO-TRASH" data-keywords="temp cache staging cleanup zero trash msi bundle portable b4j">
  <span class="docv2-kicker">Clean pipeline</span><h2>Builds should not leave historical staging behind.</h2>
  <p>MSI, Bundle, Portable and B4J Portable use <code>%TEMP%\\InstallerLab</code> as their workspace. Staging is deleted after success or failure, and startup cleanup removes orphaned build directories from interrupted runs.</p>
  <div class="docv2-flow"><span>FSS</span><i>→</i><span>%TEMP%\\InstallerLab</span><i>→</i><span>Build</span><i>→</i><span>OutputDir</span><i>→</i><span>Temp removed</span></div>
  <p>The durable state is the FSS project and the requested final artifact; intermediate build files are disposable.</p>
</article>`);

    const workflow=document.getElementById('workflow');if(workflow)workflow.insertAdjacentHTML('beforeend',es?'<div class="docv2-callout good"><strong>v2:</strong> desde el mismo FSS puedes dirigir el build a Setup EXE, MSI, Bundle, Portable o B4J Portable sin convertir el staging en estado permanente del proyecto.</div>':'<div class="docv2-callout good"><strong>v2:</strong> the same FSS can drive Setup EXE, MSI, Bundle, Portable or B4J Portable without turning build staging into permanent project state.</div>');

    document.querySelectorAll('[data-v2-copy]').forEach(btn=>btn.addEventListener('click',()=>navigator.clipboard.writeText(btn.closest('.docv2-code').querySelector('code').textContent).then(()=>{btn.textContent=es?'Copiado':'Copied';setTimeout(()=>btn.textContent=es?'Copiar':'Copy',1200)})));
  }
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();
