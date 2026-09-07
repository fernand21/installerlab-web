(() => {
  let queued=false;
  const es=()=>((localStorage.getItem('il-lang')||'es').toLowerCase()!=='en');
  const Y='<span class="docv5-yes">✓</span>';
  const P='<span class="docv5-partial">◐</span>';
  const N='<span class="docv5-no">—</span>';

  function spanish(){return `
    <span class="docv2-kicker">Comparativa ampliada · revisada para v2</span>
    <h2>InstallerLab frente a Inno Setup, WiX Toolset, Advanced Installer, NSIS e InstallShield.</h2>
    <p>La comparación ahora refleja lo que realmente cambió con InstallerLab v2: <strong>MSI como salida de primera clase, Bundle mediante WiX Burn, importación ISS → FSS, FSS Analyzer y el pipeline ZERO-TRASH</strong>. No se presenta una herramienta como ganadora universal; cada una prioriza un tipo de trabajo distinto.</p>

    <div class="docv5-compare-intro">
      <div><h3>Cómo leer esta tabla</h3><p>Se comparan <strong>enfoque de authoring, formatos principales, bootstrapper/prerequisitos, migración, scripting y tipo de proyecto</strong>. Algunas capacidades dependen de edición o configuración en productos comerciales; por eso se indican como tales en lugar de convertir la tabla en una lista absoluta de “sí/no”.</p></div>
      <div><h3>Instantánea</h3><p>Revisada con documentación pública oficial disponible en septiembre de 2026.</p><div class="docv5-snapshot"><span>InstallerLab v2.0.0</span><span>Inno Setup 7.x</span><span>WiX / Burn</span><span>Advanced Installer</span><span>NSIS 3.x</span><span>InstallShield 2026</span></div></div>
    </div>

    <h3>Primero: la diferencia de filosofía</h3>
    <div class="docv5-position-grid">
      <div class="docv5-position-card primary"><h3>InstallerLab</h3><p><strong>Visual + FSS editable.</strong> Un mismo proyecto ligero alimenta Setup EXE, MSI, Bundle y Portable. v2 añade importador ISS, Analyzer y staging temporal desechable.</p></div>
      <div class="docv5-position-card"><h3>Inno Setup</h3><p><strong>Script-first muy maduro.</strong> Produce Setup EXE, ofrece preprocesador y Pascal para lógica avanzada y mantiene un formato ISS legible.</p></div>
      <div class="docv5-position-card"><h3>WiX Toolset</h3><p><strong>Authoring técnico.</strong> Orientado a Windows Installer y Burn; ofrece control directo de MSI y bundles desde código/archivos de authoring.</p></div>
      <div class="docv5-position-card"><h3>Advanced Installer</h3><p><strong>Suite visual amplia.</strong> GUI profesional para MSI, EXE, MSIX, bootstrapper, automatización, repackaging e importación de proyectos según edición.</p></div>
      <div class="docv5-position-card"><h3>NSIS</h3><p><strong>EXE scriptable y pequeño.</strong> Lenguaje propio, macros y plugins; excelente cuando el instalador es lógica personalizada más que un modelo MSI.</p></div>
      <div class="docv5-position-card"><h3>InstallShield</h3><p><strong>Suite comercial de gran alcance.</strong> MSI, EXE, MSIX, prerequisitos, Visual Studio, automatización y Suite/bootstrappers en ediciones correspondientes.</p></div>
    </div>

    <h3>Matriz práctica</h3>
    <div class="docv4-compare-wrap"><table class="docv2-table docv4-compare docv5-matrix"><thead><tr><th>Capacidad / enfoque</th><th>InstallerLab v2</th><th>Inno Setup</th><th>WiX Toolset</th><th>Advanced Installer</th><th>NSIS</th><th>InstallShield</th></tr></thead><tbody>
      <tr><td><strong>Authoring visual como flujo principal</strong></td><td>${Y} Sí</td><td>${P} IDE + script</td><td>${N} Código/authoring técnico</td><td>${Y} Sí</td><td>${N} Script-first</td><td>${Y} Sí</td></tr>
      <tr><td><strong>Proyecto de texto legible/editable</strong></td><td>${Y} <code>.fss</code></td><td>${Y} <code>.iss</code></td><td>${Y} archivos WiX</td><td>${P} proyecto gestionado por la suite</td><td>${Y} <code>.nsi</code></td><td>${P} proyecto gestionado por la suite</td></tr>
      <tr><td><strong>Setup EXE para distribución directa</strong></td><td>${Y} Setup EXE</td><td>${Y} Sí</td><td>${P} EXE mediante Burn/Bundle</td><td>${Y} Sí</td><td>${Y} Sí</td><td>${Y} Sí</td></tr>
      <tr><td><strong>MSI nativo / Windows Installer</strong></td><td>${Y} Sí, backend WiX</td><td>${N} No es su salida nativa</td><td>${Y} Sí</td><td>${Y} Sí</td><td>${N} No es su salida nativa</td><td>${Y} Sí</td></tr>
      <tr><td><strong>Bundle / bootstrapper con cadena de paquetes</strong></td><td>${Y} WiX Burn</td><td>${P} posible mediante lógica/script, no es un modelo Burn</td><td>${Y} Burn</td><td>${Y} bootstrapper / suite según edición</td><td>${P} posible mediante scripting/plugins</td><td>${Y} Suite/Advanced UI en edición correspondiente</td></tr>
      <tr><td><strong>Prerequisitos EXE/MSI antes del paquete principal</strong></td><td>${Y} Bundle v2</td><td>${P} se puede orquestar por script</td><td>${Y} cadena Burn</td><td>${Y} soporte de prerequisites</td><td>${P} lógica personalizada</td><td>${Y} Prerequisite Editor / Suite</td></tr>
      <tr><td><strong>MSIX</strong></td><td>${N} No en v2.0.0</td><td>${N} No es su objetivo</td><td>${N} No es el foco de WiX</td><td>${Y} Sí</td><td>${N} No es su objetivo</td><td>${Y} Sí</td></tr>
      <tr><td><strong>Importar proyecto Inno Setup</strong></td><td>${Y} ISS → FSS (secciones soportadas)</td><td>${N} N/A</td><td>${N} No es una función central</td><td>${Y} Importador ISS a proyecto Advanced Installer</td><td>${N} No es una función central</td><td>${N} No es el foco principal documentado</td></tr>
      <tr><td><strong>Analizador propio del proyecto antes del build</strong></td><td>${Y} FSS Analyzer</td><td>${P} compilador/preprocesador detecta errores de script</td><td>${P} validación/build toolchain</td><td>${Y} varias validaciones según flujo/edición</td><td>${P} compilador de script</td><td>${Y} validación y herramientas del producto</td></tr>
      <tr><td><strong>Portable como salida específica del producto</strong></td><td>${Y} Portable + B4J Portable</td><td>${N} no es su salida principal</td><td>${N} no es su salida principal</td><td>${N} no es su formato principal</td><td>${N} no es su formato principal</td><td>${N} no es su formato principal</td></tr>
      <tr><td><strong>Profundidad de scripting / extensibilidad</strong></td><td>${P} FSS + acciones soportadas</td><td>${Y} Pascal + preprocesador</td><td>${Y} authoring técnico/extensiones</td><td>${Y} custom actions + automatización</td><td>${Y} scripting + plugins</td><td>${Y} InstallScript/custom actions/automation</td></tr>
      <tr><td><strong>Perfil al que mejor apunta</strong></td><td>Desarrollador que quiere GUI + proyecto FSS ligero + varias salidas</td><td>Desarrollador que quiere un Setup EXE maduro y scriptable</td><td>Equipos que quieren control directo de MSI/Burn</td><td>Desarrollo/IT que necesita una suite visual extensa</td><td>Instaladores EXE muy personalizados y compactos</td><td>ISV/empresa con necesidades amplias de packaging Windows</td></tr>
    </tbody></table></div>

    <div class="docv2-callout good"><strong>El salto real de InstallerLab v2:</strong> en la comparación anterior Bundle era una idea futura. Ahora el mismo FSS puede producir el MSI principal y convertirlo en una cadena WiX Burn con prerequisitos. Eso cambia de forma importante dónde encaja InstallerLab frente a herramientas centradas únicamente en Setup EXE.</div>

    <h3>Qué mejoró específicamente en v2</h3>
    <div class="docv5-update-list">
      <div><b>Bundle dejó de ser “futuro”</b><span>Existe un backend independiente de WiX Burn con cadena de prerequisitos y MSI principal.</span></div>
      <div><b>MSI se volvió una salida real del mismo FSS</b><span>El usuario no mantiene un segundo proyecto solo para Windows Installer.</span></div>
      <div><b>Migración desde Inno Setup</b><span>El importador ISS → FSS convierte las secciones soportadas y deja el resultado visible y editable.</span></div>
      <div><b>FSS Analyzer</b><span>Permite revisar errores, advertencias y compatibilidad antes de empaquetar.</span></div>
      <div><b>ZERO-TRASH</b><span>MSI, Bundle, Portable y B4J Portable usan staging temporal y lo eliminan al finalizar.</span></div>
      <div><b>FSS como respaldo ligero</b><span>El proyecto durable sigue siendo un archivo pequeño; el staging de build no se convierte en estado permanente.</span></div>
    </div>

    <h3>Dos formas distintas de migrar desde Inno Setup</h3>
    <div class="docv5-migrate">
      <div class="docv5-migrate-card"><h3>InstallerLab: ISS → FSS</h3><p>La migración termina en el formato propio y ligero de InstallerLab.</p><ul><li>Importa las secciones soportadas.</li><li>El resultado queda en texto plano <code>.fss</code>.</li><li>Se puede revisar con FSS Analyzer.</li><li>Ese FSS puede alimentar Setup EXE, MSI o Bundle donde las reglas sean compatibles.</li></ul></div>
      <div class="docv5-migrate-card"><h3>Advanced Installer: ISS → proyecto Advanced Installer</h3><p>Advanced Installer también documenta importación de scripts Inno Setup.</p><ul><li>Su wizard crea un proyecto Advanced Installer.</li><li>La suite puede continuar hacia MSI y otros formatos soportados.</li><li>Ofrece además repackaging y un conjunto de funciones empresariales mucho más amplio.</li><li>Como en cualquier migración, el resultado debe revisarse y probarse.</li></ul></div>
    </div>
    <div class="docv2-callout"><strong>No vender humo aquí ayuda más:</strong> InstallerLab no es el único producto capaz de importar Inno Setup. Su diferencia está en <em>qué obtiene después de la importación</em>: un FSS pequeño, editable y reutilizable por sus distintos backends.</div>

    <h3>¿Qué herramienta elegir según el trabajo?</h3>
    <div class="docv5-choice-grid">
      <div class="docv5-choice-card"><b>Quiero un Setup EXE muy maduro y me gusta trabajar con script.</b><p>Inno Setup es una referencia natural; NSIS también encaja cuando necesitas lógica y plugins con un runtime muy compacto.</p></div>
      <div class="docv5-choice-card"><b>Quiero controlar MSI y Burn directamente.</b><p>WiX Toolset es el nivel técnico de referencia. InstallerLab usa WiX precisamente para no obligar al usuario visual a escribir ese authoring en el flujo normal.</p></div>
      <div class="docv5-choice-card"><b>Necesito MSIX, repackaging, CI/CD y un catálogo enorme de funciones empresariales.</b><p>Advanced Installer o InstallShield cubren escenarios mucho más amplios que InstallerLab v2 y deben evaluarse por edición, soporte y presupuesto.</p></div>
      <div class="docv5-choice-card"><b>Quiero una GUI sencilla, un proyecto FSS que pueda respaldar en un solo archivo y generar EXE/MSI/Bundle desde él.</b><p>Ese es exactamente el espacio que InstallerLab intenta ocupar. Si además trabajas con B4J, tiene un flujo Portable dedicado.</p></div>
    </div>

    <div class="docv4-brand-note">Advanced Installer, Inno Setup, NSIS, WiX Toolset, InstallShield, Revenera, Microsoft y Windows son nombres y marcas de sus respectivos titulares. La comparación es descriptiva, basada en documentación pública y no implica afiliación, patrocinio ni aprobación. Las capacidades comerciales pueden variar por edición y cambiar con el tiempo.</div>
    <div class="docv3-sources"><b>Fuentes oficiales consultadas</b><div class="docv5-source-grid">
      <a target="_blank" rel="noopener" href="https://jrsoftware.org/ishelp/topic_whatisinnosetup.htm">Inno Setup — What is Inno Setup?</a>
      <a target="_blank" rel="noopener" href="https://nsis.sourceforge.io/Docs/Chapter1.html">NSIS — Introduction & features</a>
      <a target="_blank" rel="noopener" href="https://docs.firegiant.com/wix/tools/burn/">WiX / FireGiant — Burn bundles</a>
      <a target="_blank" rel="noopener" href="https://www.advancedinstaller.com/features.html">Advanced Installer — Features</a>
      <a target="_blank" rel="noopener" href="https://www.advancedinstaller.com/import.html">Advanced Installer — Installer Import</a>
      <a target="_blank" rel="noopener" href="https://www.revenera.com/install/products/installshield">InstallShield — Product overview</a>
    </div></div>`}

  function english(){return `
    <span class="docv2-kicker">Expanded comparison · updated for v2</span>
    <h2>InstallerLab compared with Inno Setup, WiX Toolset, Advanced Installer, NSIS and InstallShield.</h2>
    <p>This comparison now reflects what actually changed in InstallerLab v2: <strong>first-class MSI output, WiX Burn Bundle, ISS → FSS import, FSS Analyzer and the ZERO-TRASH pipeline</strong>. There is no universal winner; each tool optimizes for a different authoring and deployment model.</p>

    <div class="docv5-compare-intro"><div><h3>How to read this</h3><p>The focus is on <strong>authoring model, core outputs, bootstrapping/prerequisites, migration, scripting and project model</strong>. Commercial products often gate capabilities by edition, so the table says so instead of flattening everything into misleading yes/no claims.</p></div><div><h3>Snapshot</h3><p>Reviewed against public official documentation available in September 2026.</p><div class="docv5-snapshot"><span>InstallerLab v2.0.0</span><span>Inno Setup 7.x</span><span>WiX / Burn</span><span>Advanced Installer</span><span>NSIS 3.x</span><span>InstallShield 2026</span></div></div></div>

    <h3>First: the authoring philosophy</h3>
    <div class="docv5-position-grid">
      <div class="docv5-position-card primary"><h3>InstallerLab</h3><p><strong>Visual + editable FSS.</strong> One lightweight project drives Setup EXE, MSI, Bundle and Portable. v2 adds ISS import, Analyzer and disposable build staging.</p></div>
      <div class="docv5-position-card"><h3>Inno Setup</h3><p><strong>Mature script-first setup builder.</strong> Produces Setup EXE, with a preprocessor and Pascal scripting for advanced logic.</p></div>
      <div class="docv5-position-card"><h3>WiX Toolset</h3><p><strong>Technical authoring.</strong> Focused on Windows Installer and Burn with direct control from source/build tooling.</p></div>
      <div class="docv5-position-card"><h3>Advanced Installer</h3><p><strong>Broad visual suite.</strong> GUI for MSI, EXE, MSIX, bootstrapping, automation, repackaging and project import depending on edition.</p></div>
      <div class="docv5-position-card"><h3>NSIS</h3><p><strong>Small scriptable EXE installer system.</strong> Custom language, macros and plugins for highly controlled executable installers.</p></div>
      <div class="docv5-position-card"><h3>InstallShield</h3><p><strong>Large commercial packaging suite.</strong> MSI, EXE, MSIX, prerequisites, Visual Studio, automation and Suite bootstrappers in applicable editions.</p></div>
    </div>

    <h3>Practical matrix</h3>
    <div class="docv4-compare-wrap"><table class="docv2-table docv4-compare docv5-matrix"><thead><tr><th>Capability / approach</th><th>InstallerLab v2</th><th>Inno Setup</th><th>WiX Toolset</th><th>Advanced Installer</th><th>NSIS</th><th>InstallShield</th></tr></thead><tbody>
      <tr><td><strong>Visual-first authoring</strong></td><td>${Y} Yes</td><td>${P} IDE + script</td><td>${N} Technical/source authoring</td><td>${Y} Yes</td><td>${N} Script-first</td><td>${Y} Yes</td></tr>
      <tr><td><strong>Human-readable editable text project</strong></td><td>${Y} <code>.fss</code></td><td>${Y} <code>.iss</code></td><td>${Y} WiX source</td><td>${P} suite-managed project</td><td>${Y} <code>.nsi</code></td><td>${P} suite-managed project</td></tr>
      <tr><td><strong>Setup EXE for direct distribution</strong></td><td>${Y} Setup EXE</td><td>${Y} Yes</td><td>${P} EXE through Burn/Bundle</td><td>${Y} Yes</td><td>${Y} Yes</td><td>${Y} Yes</td></tr>
      <tr><td><strong>Native MSI / Windows Installer</strong></td><td>${Y} Yes, WiX backend</td><td>${N} Not its native output</td><td>${Y} Yes</td><td>${Y} Yes</td><td>${N} Not its native output</td><td>${Y} Yes</td></tr>
      <tr><td><strong>Bundle / bootstrapper package chain</strong></td><td>${Y} WiX Burn</td><td>${P} custom scripting rather than a Burn model</td><td>${Y} Burn</td><td>${Y} bootstrapper / suite by edition</td><td>${P} custom scripting/plugins</td><td>${Y} Suite/Advanced UI in applicable edition</td></tr>
      <tr><td><strong>EXE/MSI prerequisites before main package</strong></td><td>${Y} v2 Bundle</td><td>${P} can be orchestrated in script</td><td>${Y} Burn chain</td><td>${Y} prerequisite support</td><td>${P} custom logic</td><td>${Y} Prerequisite Editor / Suite</td></tr>
      <tr><td><strong>MSIX</strong></td><td>${N} Not in v2.0.0</td><td>${N} Not a core target</td><td>${N} Not WiX's core target</td><td>${Y} Yes</td><td>${N} Not a core target</td><td>${Y} Yes</td></tr>
      <tr><td><strong>Import an Inno Setup project</strong></td><td>${Y} ISS → FSS (supported sections)</td><td>${N} N/A</td><td>${N} Not a core feature</td><td>${Y} ISS import to Advanced Installer project</td><td>${N} Not a core feature</td><td>${N} Not the primary documented focus</td></tr>
      <tr><td><strong>Project analysis before build</strong></td><td>${Y} FSS Analyzer</td><td>${P} compiler/preprocessor script errors</td><td>${P} validation/build toolchain</td><td>${Y} multiple validation workflows by feature/edition</td><td>${P} script compiler</td><td>${Y} product validation/tooling</td></tr>
      <tr><td><strong>Portable as a dedicated product output</strong></td><td>${Y} Portable + B4J Portable</td><td>${N} not a primary format</td><td>${N} not a primary format</td><td>${N} not a primary format</td><td>${N} not a primary format</td><td>${N} not a primary format</td></tr>
      <tr><td><strong>Scripting / extensibility depth</strong></td><td>${P} FSS + supported actions</td><td>${Y} Pascal + preprocessor</td><td>${Y} technical authoring/extensions</td><td>${Y} custom actions + automation</td><td>${Y} scripting + plugins</td><td>${Y} InstallScript/custom actions/automation</td></tr>
      <tr><td><strong>Best-fit profile</strong></td><td>Developer wanting GUI + lightweight FSS + multiple outputs</td><td>Developer wanting a mature scriptable Setup EXE</td><td>Teams wanting direct MSI/Burn control</td><td>Development/IT needing a broad visual suite</td><td>Highly customized compact EXE installers</td><td>ISV/enterprise teams with broad Windows packaging needs</td></tr>
    </tbody></table></div>

    <div class="docv2-callout good"><strong>The meaningful v2 change:</strong> Bundle used to be a future idea in this documentation. It is now a real WiX Burn backend that builds the main MSI and chains prerequisites around it. That materially changes where InstallerLab fits against EXE-only and MSI/Burn-focused tools.</div>

    <h3>What specifically improved in v2</h3><div class="docv5-update-list">
      <div><b>Bundle is no longer “future”</b><span>A separate WiX Burn backend now chains prerequisites and the main MSI.</span></div>
      <div><b>MSI is a real output from the same FSS</b><span>No second product definition is required just for Windows Installer.</span></div>
      <div><b>Migration from Inno Setup</b><span>The ISS → FSS importer converts supported sections into visible editable project text.</span></div>
      <div><b>FSS Analyzer</b><span>Project errors, warnings and compatibility concerns can be reviewed before packaging.</span></div>
      <div><b>ZERO-TRASH</b><span>MSI, Bundle, Portable and B4J Portable staging is temporary and cleaned after the build.</span></div>
      <div><b>FSS stays the lightweight backup</b><span>Build staging never becomes permanent project state.</span></div>
    </div>

    <h3>Two different ways to migrate from Inno Setup</h3><div class="docv5-migrate">
      <div class="docv5-migrate-card"><h3>InstallerLab: ISS → FSS</h3><p>Migration ends in InstallerLab's lightweight native project format.</p><ul><li>Imports supported sections.</li><li>Produces editable plain-text <code>.fss</code>.</li><li>Can be checked by FSS Analyzer.</li><li>The same FSS can drive Setup EXE, MSI or Bundle where supported.</li></ul></div>
      <div class="docv5-migrate-card"><h3>Advanced Installer: ISS → Advanced Installer project</h3><p>Advanced Installer also officially documents Inno Setup import.</p><ul><li>Its wizard creates an Advanced Installer project.</li><li>The suite can continue toward MSI and other supported package types.</li><li>It also offers repackaging and a much broader enterprise feature set.</li><li>As with any migration, the result still needs review and testing.</li></ul></div>
    </div>
    <div class="docv2-callout"><strong>Accuracy matters more than marketing:</strong> InstallerLab is not the only product that can import Inno Setup. Its distinction is what the migration produces: a small editable FSS reused by InstallerLab's own build backends.</div>

    <h3>Which tool fits which job?</h3><div class="docv5-choice-grid">
      <div class="docv5-choice-card"><b>I want a very mature Setup EXE and I like scripting.</b><p>Inno Setup is a natural reference; NSIS also fits when deep custom logic and plugins matter more than MSI semantics.</p></div>
      <div class="docv5-choice-card"><b>I want direct control of MSI and Burn.</b><p>WiX Toolset is the technical reference layer. InstallerLab uses WiX specifically so normal visual authoring does not require hand-writing that source.</p></div>
      <div class="docv5-choice-card"><b>I need MSIX, repackaging, CI/CD and a very large enterprise feature catalog.</b><p>Advanced Installer or InstallShield cover a broader scope than InstallerLab v2 and should be evaluated by edition, support and budget.</p></div>
      <div class="docv5-choice-card"><b>I want a simple GUI, one FSS file I can back up, and EXE/MSI/Bundle from that definition.</b><p>That is the exact space InstallerLab targets. B4J developers also get a dedicated Portable workflow.</p></div>
    </div>

    <div class="docv4-brand-note">Advanced Installer, Inno Setup, NSIS, WiX Toolset, InstallShield, Revenera, Microsoft and Windows are names or trademarks of their respective owners. This is a descriptive comparison based on public documentation and does not imply affiliation, sponsorship or endorsement. Commercial capabilities may vary by edition and change over time.</div>
    <div class="docv3-sources"><b>Official sources reviewed</b><div class="docv5-source-grid"><a target="_blank" rel="noopener" href="https://jrsoftware.org/ishelp/topic_whatisinnosetup.htm">Inno Setup — What is Inno Setup?</a><a target="_blank" rel="noopener" href="https://nsis.sourceforge.io/Docs/Chapter1.html">NSIS — Introduction & features</a><a target="_blank" rel="noopener" href="https://docs.firegiant.com/wix/tools/burn/">WiX / FireGiant — Burn bundles</a><a target="_blank" rel="noopener" href="https://www.advancedinstaller.com/features.html">Advanced Installer — Features</a><a target="_blank" rel="noopener" href="https://www.advancedinstaller.com/import.html">Advanced Installer — Installer Import</a><a target="_blank" rel="noopener" href="https://www.revenera.com/install/products/installshield">InstallShield — Product overview</a></div></div>`}

  function apply(){
    if(document.body.dataset.page!=='docs')return;
    const article=document.getElementById('installer-comparison');
    if(!article||article.dataset.v2Expanded==='1')return;
    article.dataset.v2Expanded='1';
    article.dataset.title=es()?'Comparativa InstallerLab vs otras herramientas':'InstallerLab vs other tools comparison';
    article.dataset.keywords='InstallerLab Inno Setup WiX Advanced Installer NSIS InstallShield comparison bundle msi iss importer fss analyzer';
    article.innerHTML=es()?spanish():english();
    document.querySelectorAll('.docv2-side a[href="#installer-comparison"]').forEach(a=>a.textContent=es()?'Comparativa 2026':'2026 comparison');
  }
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();
