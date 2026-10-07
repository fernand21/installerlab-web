(() => {
  let queued=false;
  const isES=()=>((localStorage.getItem('il-lang')||'es').toLowerCase()!=='en');
  const Y='<span class="cmp3-yes">✓</span>';
  const P='<span class="cmp3-part">◐</span>';
  const N='<span class="cmp3-na">—</span>';
  const U='<span class="cmp3-unknown">?</span>';
  const root=()=>location.pathname.includes('/installerlab-web/')?'/installerlab-web/':'/';

  const sources=`
    <a target="_blank" rel="noopener" href="https://jrsoftware.org/isinfo.php">Inno Setup — official feature overview</a>
    <a target="_blank" rel="noopener" href="https://jrsoftware.org/ishelp/topic_creatinginstallations.htm">Inno Setup — creating installations</a>
    <a target="_blank" rel="noopener" href="https://docs.firegiant.com/wix/">WiX Toolset — official overview</a>
    <a target="_blank" rel="noopener" href="https://docs.firegiant.com/wix/tools/burn/">WiX Toolset — Burn bundles</a>
    <a target="_blank" rel="noopener" href="https://www.advancedinstaller.com/create-deploy-windows-app-from-website.html">Advanced Installer — create/deploy a Windows app from a website (uses Nativefier + Advanced Installer)</a>
    <a target="_blank" rel="noopener" href="https://www.advancedinstaller.com/user-guide/qa-web-installation.html">Advanced Installer — Web Installer package</a>
    <a target="_blank" rel="noopener" href="https://www.advancedinstaller.com/user-guide/win-store-app-non-msix-dependencies.html">Advanced Installer — WebView2 external dependency</a>
    <a target="_blank" rel="noopener" href="https://nsis.sourceforge.io/Features">NSIS — official features</a>
    <a target="_blank" rel="noopener" href="https://docs.revenera.com/installshield/helplibrary/IWPReleaseWebType.htm">InstallShield — Web Type release panel</a>
    <a target="_blank" rel="noopener" href="https://docs.revenera.com/installshield/rn/Content/helplibrary/InstallShield_2026_R1.htm">InstallShield 2026 R1 — release notes</a>`;

  function spanish(){return `
<section class="cmp3-hero"><div class="shell"><span class="cmp3-kicker">Comparativa independiente · InstallerLab v4</span><h1>InstallerLab v4 frente a Inno Setup, WiX Toolset, Advanced Installer, NSIS e InstallShield.</h1><p>Comparación centrada en lo que realmente cambia con v4: InstallerLab ya no solo empaqueta aplicaciones existentes. Puede partir de una URL o HTML local, crear la aplicación Windows basada en WebView2 y generar sus formatos de distribución desde el mismo proyecto.</p><div class="cmp3-meta"><span>InstallerLab v4.0.0</span><span>Inno Setup 7.x</span><span>WiX 7 / Burn</span><span>Advanced Installer</span><span>NSIS 3.x</span><span>InstallShield 2026</span></div></div></section>
<main id="main" class="cmp3-main">
<div class="cmp3-back"><a class="button" href="${root()}docs/">← Documentación</a><a class="button primary" href="${root()}web-to-exe/">Web-to-EXE v4</a></div>
<div class="cmp3-anchorbar"><a href="#webtoexe-difference">Diferencia v4</a><a href="#matrix">Matriz</a><a href="#specialized">ProjectTypes</a><a href="#choose">Qué elegir</a><a href="#sources">Fuentes</a></div>

<section id="webtoexe-difference" class="cmp3-section"><span class="cmp3-kicker">La diferencia principal de v4</span><h2>URL / HTML → aplicación Windows → instalador, sin cambiar de herramienta.</h2>
<p>InstallerLab v4 incorpora <code>WebToExe</code> como ProjectType de primera clase. El mismo FSS puede definir la web, preparar el host WebView2 y producir Web-to-EXE, Setup EXE, MSI o Bundle.</p>
<div class="cmp3-summary">
<div class="cmp3-card"><b>1 · Origen web</b><p>URL remota o carpeta HTML local con <code>index.html</code>.</p></div>
<div class="cmp3-card"><b>2 · Aplicación Windows</b><p>InstallerLab prepara el host WebView2 y la configuración de la app.</p></div>
<div class="cmp3-card"><b>3 · Personalización</b><p>Tema, toolbar, enlaces externos, bloqueo PWA y reglas DOM por ID/clase/selector.</p></div>
<div class="cmp3-card"><b>4 · Distribución</b><p>Web-to-EXE, Setup EXE, MSI y Bundle desde el mismo ProjectType.</p></div>
</div>
<div class="cmp3-note"><strong>Diferenciador verificado en las fuentes revisadas:</strong> no encontramos en Inno Setup, WiX, NSIS o InstallShield un flujo dedicado equivalente que empiece en una URL/HTML y cree la aplicación de escritorio antes de empaquetarla. Advanced Installer sí publicó en 2026 una guía para este escenario, pero su propio procedimiento usa <strong>Nativefier para crear primero el binario</strong> y Advanced Installer después para empaquetarlo. Por eso, dentro de este grupo comparado, InstallerLab v4 es el único flujo documentado que integra ambos pasos en el mismo proyecto.</div>
<p class="cmp3-disclaimer">Esta afirmación está limitada a las herramientas y documentación oficial pública revisadas el 7 de octubre de 2026. No significa que sea imposible construir una solución equivalente mediante código, plugins, custom actions o herramientas externas.</p>
</section>

<section id="matrix" class="cmp3-section"><span class="cmp3-kicker">Matriz práctica v4</span><h2>Aplicación + empaquetado, no solo empaquetado.</h2>
<div class="cmp3-legend"><span>${Y} disponible/documentado</span><span>${P} parcial, externo o depende de otra herramienta</span><span>${N} no es salida/flujo principal</span><span>${U} no identificado como función dedicada en fuentes oficiales revisadas</span></div>
<div class="cmp3-tablewrap"><table class="cmp3-table"><thead><tr><th>Capacidad / enfoque</th><th class="cmp3-primary">InstallerLab v4</th><th>Inno Setup 7.x</th><th>WiX 7</th><th>Advanced Installer</th><th>NSIS 3.x</th><th>InstallShield 2026</th></tr></thead><tbody>
<tr><td>Authoring visual como flujo principal</td><td class="cmp3-primary">${Y} GUI + FSS editable</td><td>${P} IDE + script ISS</td><td>${N} authoring técnico / CLI / MSBuild</td><td>${Y} suite visual</td><td>${N} script-first</td><td>${Y} suite visual</td></tr>
<tr><td>Proyecto de texto directamente editable</td><td class="cmp3-primary">${Y} <code>.fss</code></td><td>${Y} <code>.iss</code></td><td>${Y} <code>.wxs/.wixproj</code></td><td>${P} proyecto gestionado por suite</td><td>${Y} <code>.nsi</code></td><td>${P} proyecto gestionado por suite</td></tr>
<tr><td><strong>URL → aplicación Windows</strong></td><td class="cmp3-primary">${Y} WebToExe + WebView2</td><td>${U}</td><td>${U} no es función del toolset de instalación revisado</td><td>${P} guía oficial usa Nativefier antes de Advanced Installer*</td><td>${U}</td><td>${U}</td></tr>
<tr><td><strong>HTML local → aplicación Windows</strong></td><td class="cmp3-primary">${Y} carpeta local + <code>index.html</code></td><td>${U}</td><td>${U}</td><td>${P} requiere app/binario previo en el flujo revisado*</td><td>${U}</td><td>${U}</td></tr>
<tr><td><strong>Mismo proyecto: crear app + Setup/MSI/Bundle</strong></td><td class="cmp3-primary">${Y} flujo integrado</td><td>${U}</td><td>${U}</td><td>${P} conversión y empaquetado son pasos/herramientas separadas*</td><td>${U}</td><td>${U}</td></tr>
<tr><td>Controles WebView2 / DOM sin editar la web</td><td class="cmp3-primary">${Y} hide/disable por ID, clase y selector</td><td>${U}</td><td>${U}</td><td>${U} no identificado como authoring de app web</td><td>${U}</td><td>${U}</td></tr>
<tr><td>Gestión de requisito WebView2</td><td class="cmp3-primary">${Y} EXE/Bundle puede preparar Evergreen Bootstrapper</td><td>${P} scripting/descarga posible</td><td>${Y} Burn puede encadenar runtimes</td><td>${Y} WebView2 como dependencia externa</td><td>${P} scripting/plugins</td><td>${P} Suite/prerequisites</td></tr>
<tr><td>Setup EXE</td><td class="cmp3-primary">${Y}</td><td>${Y} salida principal</td><td>${P} EXE mediante Burn Bundle</td><td>${Y}</td><td>${Y} salida principal</td><td>${Y}</td></tr>
<tr><td>MSI / Windows Installer</td><td class="cmp3-primary">${Y} backend WiX</td><td>${N} no es salida nativa</td><td>${Y} salida central</td><td>${Y}</td><td>${N} no es salida nativa</td><td>${Y}</td></tr>
<tr><td>Bundle / cadena de prerrequisitos</td><td class="cmp3-primary">${Y} WiX Burn</td><td>${P} scripting, no modelo Burn</td><td>${Y} Burn</td><td>${Y} bootstrapper/prerrequisitos</td><td>${P} scripting/plugins</td><td>${Y} Advanced UI / Suite</td></tr>
<tr><td>“Web Installer” de descarga</td><td class="cmp3-primary">${P} no es el concepto central de WebToExe</td><td>${P} puede descargar archivos por script</td><td>${Y} Burn puede descargar paquetes</td><td>${Y} Web Installer documentado</td><td>${P} scripting/plugins</td><td>${Y} Web Type / Downloader</td></tr>
<tr><td>Portable como salida de primera clase</td><td class="cmp3-primary">${Y} Application: Portable + B4J Portable</td><td>${N}</td><td>${N}</td><td>${N} no es formato principal documentado</td><td>${N}</td><td>${N} no es formato principal documentado</td></tr>
<tr><td>Office Add-in especializado</td><td class="cmp3-primary">${Y} VBA .xlam/.xla/.dotm/.dot/.ppam/.ppa</td><td>${U}</td><td>${U}</td><td>${Y} wizard VSTO/Visual Studio</td><td>${U}</td><td>${U}</td></tr>
<tr><td>QGIS Python Plugin especializado</td><td class="cmp3-primary">${Y} carpeta/ZIP + perfil + PluginId</td><td>${U}</td><td>${U}</td><td>${U}</td><td>${U}</td><td>${U}</td></tr>
<tr><td>Windows Services</td><td class="cmp3-primary">${Y}</td><td>${P} script/lógica externa</td><td>${Y}</td><td>${Y}</td><td>${P} scripting/plugins</td><td>${Y}</td></tr>
<tr><td>Build por línea de comandos</td><td class="cmp3-primary">${Y} <code>--cli</code></td><td>${Y} ISCC</td><td>${Y} wix / MSBuild</td><td>${Y} CLI</td><td>${Y} makensis</td><td>${Y} ISCmdBld</td></tr>
<tr><td>SBOM como función propia</td><td class="cmp3-primary">${Y} CycloneDX + SPDX</td><td>${U}</td><td>${U} en core revisado</td><td>${U}</td><td>${U}</td><td>${U}</td></tr>
<tr><td>Firma digital / Authenticode</td><td class="cmp3-primary">${Y} SignTool</td><td>${Y}</td><td>${Y}</td><td>${Y}</td><td>${P} tooling externo habitual</td><td>${Y}</td></tr>
<tr><td>MSIX</td><td class="cmp3-primary">${N} no en v4.0.0</td><td>${N}</td><td>${N} no es salida central del core revisado</td><td>${Y}</td><td>${N}</td><td>${Y}</td></tr>
</tbody></table></div>
<p class="cmp3-disclaimer">* La guía oficial de Advanced Installer “How to Create and Deploy a Windows Desktop App from a Website”, publicada en agosto de 2026, indica explícitamente el uso de <strong>Nativefier</strong> para convertir el sitio en binarios Windows y luego <strong>Advanced Installer</strong> para crear el instalador. Es una solución válida, pero es un flujo de dos herramientas, no un ProjectType integrado equivalente a WebToExe.</p>
</section>

<section id="specialized" class="cmp3-section"><span class="cmp3-kicker">ProjectTypes</span><h2>InstallerLab modela el tipo de producto, no solo los archivos que copiará.</h2>
<p>La línea v3 introdujo OfficeAddin y QgisPlugin. v4 añade WebToExe. En los tres casos InstallerLab cambia la interfaz, validación y targets según lo que realmente se distribuye.</p>
<div class="cmp3-choice">
<div><b>Application</b><p>Setup EXE, Portable, B4J Portable, MSI y Bundle.</p></div>
<div><b>OfficeAddin</b><p>VBA para Excel/Word/PowerPoint con MSI y Bundle.</p></div>
<div><b>QgisPlugin</b><p>Plugin Python desde carpeta/ZIP con MSI y Bundle.</p></div>
<div><b>WebToExe</b><p>URL/HTML → WebView2 app → Web-to-EXE, Setup EXE, MSI o Bundle.</p></div>
</div></section>

<section id="choose" class="cmp3-section"><span class="cmp3-kicker">Elegir según el trabajo</span><h2>No hay un ganador universal; v4 sí abre un espacio nuevo.</h2>
<div class="cmp3-choice">
<div><b>Quiero un Setup EXE muy maduro y scriptable.</b><p>Inno Setup y NSIS siguen siendo excelentes opciones script-first.</p></div>
<div><b>Quiero controlar MSI y Burn directamente.</b><p>WiX Toolset sigue siendo la capa técnica de referencia; InstallerLab usa WiX para MSI y Bundle.</p></div>
<div><b>Necesito MSIX, repackaging y administración empresarial amplia.</b><p>Advanced Installer e InstallShield ofrecen suites empresariales más extensas.</p></div>
<div><b>Quiero convertir una web en app Windows y además crear su instalador.</b><p>Este es el nuevo espacio fuerte de InstallerLab v4: el origen web y el deployment viven en el mismo proyecto.</p></div>
</div></section>

<section id="sources" class="cmp3-section"><span class="cmp3-kicker">Fuentes verificables</span><h2>Documentación oficial consultada.</h2>
<p>La revisión de competidores se actualizó el <strong>7 de octubre de 2026</strong>. Un “?” significa que no encontramos esa capacidad como función dedicada en las fuentes oficiales revisadas; no significa que sea técnicamente imposible reproducirla mediante desarrollo o integración externa.</p><div class="cmp3-sources">${sources}</div>
<p class="cmp3-disclaimer">Advanced Installer, Inno Setup, NSIS, WiX Toolset, InstallShield, Revenera, Microsoft, Windows y WebView2 son nombres o marcas de sus respectivos titulares. La comparación no implica afiliación, patrocinio ni aprobación.</p></section>
</main>`}

  function english(){return `
<section class="cmp3-hero"><div class="shell"><span class="cmp3-kicker">Independent comparison · InstallerLab v4</span><h1>InstallerLab v4 compared with Inno Setup, WiX Toolset, Advanced Installer, NSIS and InstallShield.</h1><p>This comparison focuses on what materially changes in v4: InstallerLab no longer only packages an existing Windows application. It can start from a URL or local HTML, create the WebView2-based Windows desktop application and build deployment formats from the same project.</p><div class="cmp3-meta"><span>InstallerLab v4.0.0</span><span>Inno Setup 7.x</span><span>WiX 7 / Burn</span><span>Advanced Installer</span><span>NSIS 3.x</span><span>InstallShield 2026</span></div></div></section>
<main id="main" class="cmp3-main">
<div class="cmp3-back"><a class="button" href="${root()}docs/">← Documentation</a><a class="button primary" href="${root()}web-to-exe/">Web-to-EXE v4</a></div>
<div class="cmp3-anchorbar"><a href="#webtoexe-difference">v4 difference</a><a href="#matrix">Matrix</a><a href="#specialized">ProjectTypes</a><a href="#choose">What to choose</a><a href="#sources">Sources</a></div>

<section id="webtoexe-difference" class="cmp3-section"><span class="cmp3-kicker">The key v4 difference</span><h2>URL / HTML → Windows app → installer, without switching tools.</h2>
<p>InstallerLab v4 adds <code>WebToExe</code> as a first-class ProjectType. The same FSS can define the web source, prepare the WebView2 host and produce Web-to-EXE, Setup EXE, MSI or Bundle output.</p>
<div class="cmp3-summary">
<div class="cmp3-card"><b>1 · Web source</b><p>Remote URL or local HTML folder with <code>index.html</code>.</p></div>
<div class="cmp3-card"><b>2 · Windows application</b><p>InstallerLab prepares the WebView2 host and app configuration.</p></div>
<div class="cmp3-card"><b>3 · Customization</b><p>Theme, toolbar, external links, PWA blocking and DOM rules by ID/class/selector.</p></div>
<div class="cmp3-card"><b>4 · Deployment</b><p>Web-to-EXE, Setup EXE, MSI and Bundle from the same ProjectType.</p></div>
</div>
<div class="cmp3-note"><strong>Verified differentiator in the reviewed sources:</strong> we did not find a dedicated equivalent flow in Inno Setup, WiX, NSIS or InstallShield that begins with a URL/HTML source and creates the desktop application before packaging it. Advanced Installer published a 2026 guide for this scenario, but its own workflow uses <strong>Nativefier to create the Windows binaries first</strong>, then Advanced Installer to package them. Within this comparison set, InstallerLab v4 is therefore the only documented workflow that integrates both steps into one project.</div>
<p class="cmp3-disclaimer">This statement is limited to the compared tools and public official documentation reviewed on October 7, 2026. It does not mean an equivalent solution is technically impossible through code, plugins, custom actions or external tooling.</p>
</section>

<section id="matrix" class="cmp3-section"><span class="cmp3-kicker">Practical v4 matrix</span><h2>Application creation + packaging, not packaging alone.</h2>
<div class="cmp3-legend"><span>${Y} available/documented</span><span>${P} partial, external or another tool is required</span><span>${N} not a primary output/workflow</span><span>${U} not identified as a dedicated feature in reviewed official sources</span></div>
<div class="cmp3-tablewrap"><table class="cmp3-table"><thead><tr><th>Capability / approach</th><th class="cmp3-primary">InstallerLab v4</th><th>Inno Setup 7.x</th><th>WiX 7</th><th>Advanced Installer</th><th>NSIS 3.x</th><th>InstallShield 2026</th></tr></thead><tbody>
<tr><td>Visual authoring as primary workflow</td><td class="cmp3-primary">${Y} GUI + editable FSS</td><td>${P} IDE + ISS script</td><td>${N} technical authoring / CLI / MSBuild</td><td>${Y} visual suite</td><td>${N} script-first</td><td>${Y} visual suite</td></tr>
<tr><td>Directly editable text project</td><td class="cmp3-primary">${Y} <code>.fss</code></td><td>${Y} <code>.iss</code></td><td>${Y} <code>.wxs/.wixproj</code></td><td>${P} suite-managed project</td><td>${Y} <code>.nsi</code></td><td>${P} suite-managed project</td></tr>
<tr><td><strong>URL → Windows desktop application</strong></td><td class="cmp3-primary">${Y} WebToExe + WebView2</td><td>${U}</td><td>${U} not identified as an installer-toolset app-generation feature</td><td>${P} official guide uses Nativefier before Advanced Installer*</td><td>${U}</td><td>${U}</td></tr>
<tr><td><strong>Local HTML → Windows desktop application</strong></td><td class="cmp3-primary">${Y} local folder + <code>index.html</code></td><td>${U}</td><td>${U}</td><td>${P} reviewed workflow requires an application/binary first*</td><td>${U}</td><td>${U}</td></tr>
<tr><td><strong>Same project: create app + Setup/MSI/Bundle</strong></td><td class="cmp3-primary">${Y} integrated workflow</td><td>${U}</td><td>${U}</td><td>${P} conversion and packaging are separate steps/tools*</td><td>${U}</td><td>${U}</td></tr>
<tr><td>WebView2 / DOM controls without changing site source</td><td class="cmp3-primary">${Y} hide/disable by ID, class and selector</td><td>${U}</td><td>${U}</td><td>${U} not identified as web-app authoring</td><td>${U}</td><td>${U}</td></tr>
<tr><td>WebView2 prerequisite handling</td><td class="cmp3-primary">${Y} EXE/Bundle can stage Evergreen Bootstrapper</td><td>${P} scripting/download possible</td><td>${Y} Burn can chain runtimes</td><td>${Y} WebView2 external dependency</td><td>${P} scripting/plugins</td><td>${P} Suite/prerequisites</td></tr>
<tr><td>Setup EXE</td><td class="cmp3-primary">${Y}</td><td>${Y} primary output</td><td>${P} EXE via Burn Bundle</td><td>${Y}</td><td>${Y} primary output</td><td>${Y}</td></tr>
<tr><td>MSI / Windows Installer</td><td class="cmp3-primary">${Y} WiX backend</td><td>${N} not native output</td><td>${Y} core output</td><td>${Y}</td><td>${N} not native output</td><td>${Y}</td></tr>
<tr><td>Bundle / prerequisite chain</td><td class="cmp3-primary">${Y} WiX Burn</td><td>${P} scripting, not Burn model</td><td>${Y} Burn</td><td>${Y} bootstrapper/prerequisites</td><td>${P} scripting/plugins</td><td>${Y} Advanced UI / Suite</td></tr>
<tr><td>Download-style “Web Installer”</td><td class="cmp3-primary">${P} different concept from WebToExe</td><td>${P} scripts can download files</td><td>${Y} Burn can download packages</td><td>${Y} documented Web Installer</td><td>${P} scripting/plugins</td><td>${Y} Web Type / Downloader</td></tr>
<tr><td>First-class Portable output</td><td class="cmp3-primary">${Y} Application: Portable + B4J Portable</td><td>${N}</td><td>${N}</td><td>${N} not a primary documented format</td><td>${N}</td><td>${N} not a primary documented format</td></tr>
<tr><td>Specialized Office Add-in workflow</td><td class="cmp3-primary">${Y} VBA .xlam/.xla/.dotm/.dot/.ppam/.ppa</td><td>${U}</td><td>${U}</td><td>${Y} VSTO/Visual Studio wizard</td><td>${U}</td><td>${U}</td></tr>
<tr><td>Specialized QGIS Python Plugin workflow</td><td class="cmp3-primary">${Y} folder/ZIP + profile + PluginId</td><td>${U}</td><td>${U}</td><td>${U}</td><td>${U}</td><td>${U}</td></tr>
<tr><td>Windows Services</td><td class="cmp3-primary">${Y}</td><td>${P} script/external logic</td><td>${Y}</td><td>${Y}</td><td>${P} scripting/plugins</td><td>${Y}</td></tr>
<tr><td>Command-line build</td><td class="cmp3-primary">${Y} <code>--cli</code></td><td>${Y} ISCC</td><td>${Y} wix / MSBuild</td><td>${Y} CLI</td><td>${Y} makensis</td><td>${Y} ISCmdBld</td></tr>
<tr><td>Built-in SBOM workflow</td><td class="cmp3-primary">${Y} CycloneDX + SPDX</td><td>${U}</td><td>${U} in reviewed core docs</td><td>${U}</td><td>${U}</td><td>${U}</td></tr>
<tr><td>Digital signing / Authenticode</td><td class="cmp3-primary">${Y} SignTool</td><td>${Y}</td><td>${Y}</td><td>${Y}</td><td>${P} typically external tooling</td><td>${Y}</td></tr>
<tr><td>MSIX</td><td class="cmp3-primary">${N} not in v4.0.0</td><td>${N}</td><td>${N} not a core output in reviewed overview</td><td>${Y}</td><td>${N}</td><td>${Y}</td></tr>
</tbody></table></div>
<p class="cmp3-disclaimer">* Advanced Installer's official “How to Create and Deploy a Windows Desktop App from a Website” guide, published in August 2026, explicitly uses <strong>Nativefier</strong> to turn the website into Windows binaries and then <strong>Advanced Installer</strong> to build the installer. That is a valid workflow, but it is a two-tool flow rather than a built-in ProjectType equivalent to WebToExe.</p>
</section>

<section id="specialized" class="cmp3-section"><span class="cmp3-kicker">ProjectTypes</span><h2>InstallerLab models the product type, not just the files being copied.</h2>
<p>The v3 line introduced OfficeAddin and QgisPlugin. v4 adds WebToExe. In all three cases InstallerLab changes the UI, validation and valid build targets based on what is actually being deployed.</p>
<div class="cmp3-choice">
<div><b>Application</b><p>Setup EXE, Portable, B4J Portable, MSI and Bundle.</p></div>
<div><b>OfficeAddin</b><p>Excel/Word/PowerPoint VBA with MSI and Bundle.</p></div>
<div><b>QgisPlugin</b><p>Python plugin from folder/ZIP with MSI and Bundle.</p></div>
<div><b>WebToExe</b><p>URL/HTML → WebView2 app → Web-to-EXE, Setup EXE, MSI or Bundle.</p></div>
</div></section>

<section id="choose" class="cmp3-section"><span class="cmp3-kicker">Choose by job</span><h2>There is no universal winner; v4 does open a new space.</h2>
<div class="cmp3-choice">
<div><b>I want a mature scriptable Setup EXE.</b><p>Inno Setup and NSIS remain excellent script-first choices.</p></div>
<div><b>I want direct MSI and Burn control.</b><p>WiX Toolset remains the technical reference layer; InstallerLab uses WiX for MSI and Bundle output.</p></div>
<div><b>I need MSIX, repackaging and a broad enterprise suite.</b><p>Advanced Installer and InstallShield provide broader enterprise packaging suites.</p></div>
<div><b>I want to turn a web app into a Windows app and also build its installer.</b><p>This is InstallerLab v4's new strong space: web source and deployment live in the same project.</p></div>
</div></section>

<section id="sources" class="cmp3-section"><span class="cmp3-kicker">Verifiable sources</span><h2>Official documentation reviewed.</h2>
<p>The competitor review was updated on <strong>October 7, 2026</strong>. A “?” means the capability was not identified as a dedicated feature in the reviewed official sources; it does not mean the outcome is technically impossible through custom development or external integration.</p><div class="cmp3-sources">${sources}</div>
<p class="cmp3-disclaimer">Advanced Installer, Inno Setup, NSIS, WiX Toolset, InstallShield, Revenera, Microsoft, Windows and WebView2 are names or marks of their respective owners. This comparison does not imply affiliation, sponsorship or endorsement.</p></section>
</main>`}

  function render(){
    if(document.body.dataset.page!=='comparison')return;
    const hero=document.querySelector('.page-hero');
    const main=document.querySelector('main.content');
    if(!hero||!main||main.dataset.comparisonV4==='1')return;
    const holder=document.createElement('div');
    holder.innerHTML=isES()?spanish():english();
    const newHero=holder.querySelector('.cmp3-hero');
    const newMain=holder.querySelector('.cmp3-main');
    if(!newHero||!newMain)return;
    hero.replaceWith(newHero);
    main.replaceWith(newMain);
    newMain.dataset.comparisonV4='1';
  }
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render()})}
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  schedule();
})();