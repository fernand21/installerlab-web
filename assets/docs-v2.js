(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const code = (label, text) => `<div class="docv2-code"><div class="docv2-codebar"><span>${label}</span><button type="button" data-copy>Copy</button></div><pre><code>${esc(text)}</code></pre></div>`;
  const setupExample = `[Setup]\nAppName=My Application\nAppVersion=1.0.0\nPublisher=My Company\nSourceDir=C:\\MyApp\nMainExecutable=MyApp.exe\nOutputDir=C:\\Build\nInstallScope=currentUser\nInstallerLanguage=en\nLanguages=en|es|fr\nShowLanguageSelector=True\nDefaultDirName={localappdata}\\{AppName}\nCreateDesktopShortcut=True\nCreateStartMenuShortcut=True`;
  const filesExample = `[Files]\nSource: "C:\\MyApp\\*"; DestDir: "{app}"; Flags: "recursesubdirs createallsubdirs"\n\n[Icons]\nName: "{autoprograms}\\My Application"; Filename: "{app}\\MyApp.exe"; WorkingDir: "{app}"\nName: "{autodesktop}\\My Application"; Filename: "{app}\\MyApp.exe"; WorkingDir: "{app}"`;
  const b4jExample = `#PackagerProperty: IconFile = ..\\icon.ico\n#PackagerProperty: ExeName = My Application.exe\n#PackagerProperty: IncludedModules = jdk.crypto.ec, javafx.swing, javafx.web\n#PackagerProperty: Version = 1.0.0`;
  const COPY_ES='Copiar', COPIED_ES='Copiado';

  function spanish(){return `
<section class="docv2-hero"><div class="docv2-shell">
  <span class="docv2-kicker">Documentación de InstallerLab</span>
  <h1>De una carpeta a un instalador de Windows, sin pelear con el empaquetado.</h1>
  <p>InstallerLab convierte tareas que normalmente terminan repartidas entre scripts, herramientas y ajustes de Windows en un flujo visual. Para un proyecto sencillo, eliges la carpeta de tu aplicación, el EXE principal, la carpeta de salida y construyes.</p>
  <div class="docv2-badges"><span class="docv2-badge">Setup EXE</span><span class="docv2-badge">Portable EXE</span><span class="docv2-badge">B4J Portable</span><span class="docv2-badge">MSI / WiX</span><span class="docv2-badge">FSS editable</span></div>
</div></section>
<div class="docv2-shell docv2-layout">
<aside class="docv2-side">
  <div class="docv2-search"><input id="docsSearch" type="search" placeholder="Buscar en la documentación…" autocomplete="off"><div id="docsResults" class="docv2-results"></div></div>
  <div class="docv2-navgroup"><b>Empieza aquí</b><a href="#overview">Qué es InstallerLab</a><a href="#first-installer">Tu primer Setup EXE</a><a href="#visual-script">Visual + Script FSS</a></div>
  <div class="docv2-navgroup"><b>Proyecto</b><a href="#app-info">Información de la app</a><a href="#files">Archivos y carpetas</a><a href="#shortcuts">Accesos directos</a><a href="#integration">Integración con Windows</a><a href="#registry">Registro</a></div>
  <div class="docv2-navgroup"><b>Personalización</b><a href="#languages">Idiomas</a><a href="#themes">Temas</a><a href="#installer">Instalación y limpieza</a></div>
  <div class="docv2-navgroup"><b>Empaquetado</b><a href="#portable">Portable</a><a href="#b4j">B4J Portable</a><a href="#msi">MSI</a></div>
  <div class="docv2-navgroup"><b>Referencia</b><a href="#fss">Referencia FSS</a><a href="#constants">Constantes</a><a href="#workflow">Cómo funciona</a><a href="#tips">Pruebas y buenas prácticas</a></div>
</aside>
<main class="docv2-main">
  <div class="docv2-lead"><div class="docv2-stat"><strong>3 pasos</strong><span>carpeta, ejecutable y salida para empezar</span></div><div class="docv2-stat"><strong>36 idiomas</strong><span>catálogo de idiomas del instalador</span></div><div class="docv2-stat"><strong>32 temas</strong><span>11 Free y 21 PRO en el catálogo actual</span></div></div>

  <article id="overview" data-title="Qué es InstallerLab" data-keywords="introducción setup exe visual windows empaquetado">
    <span class="docv2-kicker">Introducción</span><h2>El objetivo: que empaquetar sea la parte fácil.</h2>
    <p>InstallerLab es una herramienta visual para preparar distribuciones de Windows. El mismo proyecto puede describir archivos, carpetas, accesos directos, claves de registro, integración con el Explorador, acciones, limpieza, idiomas y apariencia.</p>
    <div class="docv2-callout good"><strong>No necesitas empezar escribiendo un script.</strong> Puedes configurar el proyecto desde los paneles visuales y revisar o ajustar el FSS cuando quieras.</div>
    <div class="docv2-grid2"><div class="docv2-card"><h3>Para proyectos simples</h3><p>Configura lo esencial y deja que InstallerLab genere y mantenga el proyecto por ti.</p></div><div class="docv2-card"><h3>Para proyectos avanzados</h3><p>Abre <strong>Script / Automation</strong> y trabaja directamente con las secciones FSS cuando necesites control fino.</p></div></div>
  </article>

  <article id="first-installer" data-title="Tu primer Setup EXE" data-keywords="primer instalador carpeta exe output build sencillo">
    <span class="docv2-kicker">Inicio rápido</span><h2>Tu primer Setup EXE puede empezar con cuatro decisiones.</h2>
    <div class="docv2-quick"><div class="docv2-step"><em>1</em><b>Carpeta fuente</b><small>Selecciona la carpeta que contiene tu aplicación.</small></div><div class="docv2-step"><em>2</em><b>EXE principal</b><small>Elige el ejecutable que inicia el programa.</small></div><div class="docv2-step"><em>3</em><b>Carpeta de salida</b><small>Indica dónde quieres recibir el instalador generado.</small></div><div class="docv2-step"><em>4</em><b>EXE Installer</b><small>Construye y prueba el Setup EXE.</small></div></div>
    <p>Desde <strong>App Information</strong> puedes completar nombre, versión, publisher, icono, alcance de instalación y destino predeterminado. Para una aplicación que ya funciona desde una carpeta, no necesitas describir archivo por archivo antes de obtener un primer instalador.</p>
    <div class="docv2-callout"><strong>Modo clásico:</strong> si defines <code>SourceDir</code> y el ejecutable principal, InstallerLab puede usar esa carpeta como base del payload. Si necesitas más control, la sección <code>[Files]</code> permite definir reglas explícitas.</div>
  </article>

  <article id="visual-script" data-title="Editor visual y Script FSS" data-keywords="fss inno setup script automatico sincroniza visual monaco">
    <span class="docv2-kicker">Una sola fuente de verdad</span><h2>Lo que haces visualmente se convierte en script.</h2>
    <p>Un proyecto de InstallerLab se guarda como un archivo <strong>.fss</strong>: texto plano, editable y fácil de versionar. Su estilo es familiar para quien haya trabajado con herramientas declarativas como Inno Setup, pero <strong>FSS es el formato propio de InstallerLab</strong>.</p>
    <p>Cuando cambias información de la aplicación, archivos, registro, accesos directos, idiomas u otras opciones desde los paneles, InstallerLab actualiza el documento del proyecto. Al volver a <strong>Script / Automation</strong>, ves ese mismo contenido en el editor Monaco.</p>
    <div class="docv2-callout good"><strong>Edición segura:</strong> las actualizaciones de propiedades de <code>[Setup]</code> están diseñadas para conservar comentarios y las demás secciones escritas por el usuario. No se genera un segundo bloque <code>[Setup]</code> encima de tu script.</div>
    ${code('Ejemplo FSS', setupExample)}
  </article>

  <article id="app-info" data-title="Información de la aplicación" data-keywords="app information nombre versión publisher source main executable output scope destination icon">
    <span class="docv2-kicker">Project Explorer</span><h2>App Information: lo esencial del paquete.</h2>
    <table class="docv2-table"><tr><th>Campo</th><th>Para qué sirve</th></tr><tr><td>Application name</td><td>Nombre visible de la aplicación y base para constantes como <code>{AppName}</code>.</td></tr><tr><td>Version / Publisher</td><td>Metadatos de la distribución.</td></tr><tr><td>Source folder</td><td>Carpeta fuente del modo clásico.</td></tr><tr><td>Main executable</td><td>Ejecutable principal de la aplicación.</td></tr><tr><td>Output folder</td><td>Carpeta donde se genera la salida.</td></tr><tr><td>Installer icon</td><td>Icono <code>.ico</code> del instalador.</td></tr><tr><td>Installation scope</td><td><code>currentUser</code> o <code>allUsers</code>.</td></tr><tr><td>Default destination</td><td>LocalAppData, Program Files, Documents o ruta personalizada.</td></tr></table>
    <div class="docv2-callout warn">Una instalación para <strong>all users</strong> o en Program Files requiere elevación UAC. InstallerLab genera el nivel de ejecución correspondiente al empaquetar.</div>
  </article>

  <article id="files" data-title="Archivos y carpetas" data-keywords="files folders source destdir flags drag drop recursesubdirs">
    <span class="docv2-kicker">Payload</span><h2>Files and Folders: desde una carpeta completa hasta reglas precisas.</h2>
    <p>Puedes añadir archivos o carpetas y definir <strong>Source</strong>, <strong>DestDir</strong> y <strong>Flags</strong>. Al añadir una carpeta se puede conservar su estructura con <code>recursesubdirs createallsubdirs</code>. El panel también admite añadir elementos al bloque <code>[Files]</code> y revisar el destino antes de construir.</p>
    ${code('Archivos y accesos directos', filesExample)}
  </article>

  <article id="shortcuts" data-title="Accesos directos" data-keywords="shortcuts icons desktop start menu autoprograms autodesktop">
    <span class="docv2-kicker">Windows Shell</span><h2>Accesos directos sin escribir comandos de Windows.</h2>
    <p>La sección visual <strong>Shortcuts</strong> mantiene las reglas de <code>[Icons]</code>. Puedes crear accesos en el menú Inicio o el escritorio y definir ejecutable, directorio de trabajo e icono.</p>
    <div><span class="docv2-tag">{autoprograms}</span><span class="docv2-tag">{autodesktop}</span><span class="docv2-tag">{app}</span></div>
  </article>

  <article id="integration" data-title="Integración con Windows" data-keywords="open with context menu right click cascading submenu file association explorer">
    <span class="docv2-kicker">Menus and Integration</span><h2>Asociaciones “Open With” y menús contextuales.</h2>
    <p>InstallerLab puede preparar la integración de tu aplicación con el Explorador de Windows: registrar extensiones compatibles en <strong>Open With</strong>, definir descripción e icono del tipo de documento y crear menús de clic derecho.</p>
    <p>Para herramientas con varias acciones, el menú contextual puede ser directo o usar un <strong>submenú en cascada</strong> con comandos diferentes. Cada elemento puede llevar sus propios parámetros e icono.</p>
    <div class="docv2-callout">Estas opciones se traducen a reglas de registro dentro del proyecto. Puedes usar la interfaz para generarlas y luego inspeccionarlas en el FSS.</div>
  </article>

  <article id="registry" data-title="Registro de Windows" data-keywords="registry hkcu hkcr subkey valuetype valuename valuedata flags">
    <span class="docv2-kicker">Registry</span><h2>Registro declarativo y visible.</h2>
    <p>El editor de registro trabaja con <strong>Root</strong>, <strong>Subkey</strong>, <strong>ValueType</strong>, <strong>ValueName</strong>, <strong>ValueData</strong> y <strong>Flags</strong>. Las reglas quedan escritas en <code>[Registry]</code> y pueden participar también en la desinstalación mediante flags como <code>uninsdeletekey</code>.</p>
  </article>

  <article id="languages" data-title="Idiomas del instalador" data-keywords="languages language selector english spanish french german 36">
    <span class="docv2-kicker">Multilenguaje</span><h2>Seleccionar idiomas es una operación visual.</h2>
    <p>El catálogo actual incluye <strong>36 idiomas</strong>. Puedes buscar un idioma, seleccionar los que incluirá el instalador, elegir el idioma predeterminado y decidir si se muestra el selector cuando inicia el Setup.</p>
    <div class="docv2-flow"><span>Elige idiomas</span><i>→</i><span>Define predeterminado</span><i>→</i><span>Activa selector</span><i>→</i><span>Build</span></div>
    <div class="docv2-callout good">La interfaz escribe automáticamente <code>Languages=...</code>, <code>InstallerLanguage=...</code> y <code>ShowLanguageSelector=True/False</code> en <code>[Setup]</code>.</div>
    <p class="docv2-muted">El idioma del instalador controla la interfaz del Setup; no cambia automáticamente el idioma interno de la aplicación que estás instalando.</p>
  </article>

  <article id="themes" data-title="Temas y apariencia" data-keywords="themes 32 free pro accent brand banner watermark appearance">
    <span class="docv2-kicker">Apariencia</span><h2>Un instalador no tiene que verse genérico.</h2>
    <p>El catálogo actual contiene <strong>32 temas</strong>: 11 Free y 21 PRO. Según el tema puedes trabajar con variante, color de acento, imagen de marca, banner, opacidad y watermark.</p>
    <p>El proyecto guarda estas decisiones en propiedades como <code>ThemeFile</code>, <code>ThemeAccent</code>, <code>BrandImage</code>, <code>ShowBanner</code> y <code>BannerOpacity</code>.</p>
  </article>

  <article id="installer" data-title="Instalación y limpieza" data-keywords="installer cleanup uninstall installdelete uninstalldelete run prerequisites launch after install">
    <span class="docv2-kicker">Ciclo de vida</span><h2>Instalación, acciones y limpieza.</h2>
    <p>El proyecto puede contener reglas <code>[Prerequisites]</code>, <code>[Run]</code>, <code>[InstallDelete]</code> y <code>[UninstallDelete]</code>. Esto permite preparar requisitos, acciones posteriores y limpieza sin esconderlas dentro de código opaco.</p>
    <div class="docv2-callout warn"><strong>Prueba la desinstalación.</strong> Las reglas de limpieza deben apuntar solo a archivos o carpetas que realmente pertenezcan a tu aplicación.</div>
  </article>

  <article id="portable" data-title="Portable EXE" data-keywords="portable exe simple source executable destination icon version">
    <span class="docv2-kicker">Portable</span><h2>Crear un portable es todavía más directo.</h2>
    <p>En el flujo <strong>Portable</strong> eliges el <strong>EXE fuente</strong> y dónde guardar el nuevo <strong>EXE portable</strong>. InstallerLab obtiene automáticamente la carpeta fuente a partir del ejecutable. El icono es opcional y puedes indicar la versión.</p>
    <div class="docv2-quick"><div class="docv2-step"><em>1</em><b>Source executable</b><small>Selecciona el EXE que ya funciona.</small></div><div class="docv2-step"><em>2</em><b>Save portable as</b><small>Elige el archivo EXE de salida.</small></div><div class="docv2-step"><em>3</em><b>Opcional</b><small>Icono y versión.</small></div><div class="docv2-step"><em>4</em><b>Create Portable</b><small>InstallerLab empaqueta la carpeta del EXE.</small></div></div>
    <div class="docv2-callout">La salida debe guardarse fuera de la carpeta fuente para evitar que el portable termine incluyéndose a sí mismo durante el empaquetado.</div>
  </article>

  <article id="b4j" data-title="B4J Portable" data-keywords="b4j portable jdk b4jbuilder packagerproperty modules launcher">
    <span class="docv2-kicker">Para desarrolladores B4X</span><h2>B4J Portable entiende el proyecto, no solo la carpeta.</h2>
    <p>Selecciona un archivo <code>.b4j</code>. InstallerLab puede leer sus <code>#PackagerProperty</code> sin modificar el código fuente, detectar la instalación de B4J y su JDK completo, y usar el toolchain oficial para generar la distribución standalone.</p>
    ${code('Ejemplo en el proyecto .b4j', b4jExample)}
    <div class="docv2-callout good"><strong>Detección automática:</strong> cuando B4J, B4JBuilder, el packager y Java están disponibles, el panel los muestra como ready. También puedes seleccionar manualmente las carpetas si la detección no encuentra el toolchain.</div>
    <p>La configuración específica del proyecto se puede conservar en <code>InstallerLab.confbuilder</code>, incluyendo el proyecto seleccionado y datos usados para mantener estable el launcher.</p>
  </article>

  <article id="msi" data-title="MSI con WiX" data-keywords="msi wix windows installer prereq bundle">
    <span class="docv2-kicker">MSI</span><h2>Backend MSI independiente mediante WiX.</h2>
    <p>InstallerLab puede preparar un paquete MSI usando WiX en la máquina de desarrollo. Es un backend diferente al Setup EXE: un MSI puro no incluye automáticamente el mismo flujo de prerequisitos de un bootstrapper.</p>
    <div class="docv2-callout warn"><strong>WiX es una dependencia de build para MSI.</strong> Si no está disponible, InstallerLab puede conservar información de diagnóstico del proceso en lugar de fingir que el MSI se creó.</div>
  </article>

  <article id="fss" data-title="Referencia del script FSS" data-keywords="fss setup dirs files registry icons prerequisites run installdelete uninstalldelete">
    <span class="docv2-kicker">Referencia</span><h2>FSS: legible para humanos y editable a mano.</h2>
    <p>Las secciones principales usadas actualmente por InstallerLab son:</p>
    <div class="docv2-grid2"><div class="docv2-card"><h3>[Setup]</h3><p>Metadatos, rutas, alcance, idioma, temas y preferencias generales.</p></div><div class="docv2-card"><h3>[Dirs] / [Files]</h3><p>Directorios y payload que se instalará.</p></div><div class="docv2-card"><h3>[Registry] / [Icons]</h3><p>Integración con Windows, registro y accesos directos.</p></div><div class="docv2-card"><h3>[Prerequisites] / [Run]</h3><p>Requisitos y acciones que forman parte del flujo del instalador.</p></div><div class="docv2-card"><h3>[InstallDelete]</h3><p>Limpieza que puede ejecutarse durante una instalación.</p></div><div class="docv2-card"><h3>[UninstallDelete]</h3><p>Limpieza declarada para la desinstalación.</p></div></div>
    ${code('Proyecto mínimo', `[Setup]\nAppName=My Application\nAppVersion=1.0.0\nSourceDir=C:\\MyApp\nMainExecutable=MyApp.exe\nOutputDir=C:\\Build\n\n[Files]\nSource: "C:\\MyApp\\*"; DestDir: "{app}"; Flags: "recursesubdirs createallsubdirs"`)}
  </article>

  <article id="constants" data-title="Constantes de rutas" data-keywords="app localappdata autopf userdocs autoprograms autodesktop constants">
    <span class="docv2-kicker">Rutas</span><h2>Constantes que evitan hardcodear rutas de Windows.</h2>
    <table class="docv2-table"><tr><th>Constante</th><th>Uso habitual</th></tr><tr><td>{app}</td><td>Carpeta de instalación de la aplicación.</td></tr><tr><td>{localappdata}</td><td>Datos locales del usuario actual.</td></tr><tr><td>{autopf}</td><td>Program Files apropiado para una instalación para todos los usuarios.</td></tr><tr><td>{userdocs}</td><td>Documentos del usuario.</td></tr><tr><td>{autoprograms}</td><td>Menú Inicio / Programs.</td></tr><tr><td>{autodesktop}</td><td>Escritorio.</td></tr><tr><td>{AppName}</td><td>Nombre de la aplicación definido en <code>[Setup]</code>.</td></tr></table>
  </article>

  <article id="workflow" data-title="Cómo funciona InstallerLab" data-keywords="architecture workflow setupproject buildengine runtime installeractions project fss">
    <span class="docv2-kicker">Bajo el capó</span><h2>Proyecto → plan → payload → runtime → Setup.exe.</h2>
    <div class="docv2-flow"><span>.fss</span><i>→</i><span>SetupProject</span><i>→</i><span>BuildEngine</span><i>→</i><span>Payload</span><i>→</i><span>Installer runtime</span><i>→</i><span>Setup.exe</span></div>
    <p>El runtime recibe el script del proyecto que tú has creado. Las reglas no se esconden sustituyéndolas por un segundo bloque de configuración. El build prepara los archivos, manifiestos y componentes internos necesarios para producir la salida.</p>
  </article>

  <article id="tips" data-title="Pruebas y buenas prácticas" data-keywords="test clean machine smartscreen antivirus uninstall uac testing">
    <span class="docv2-kicker">Antes de distribuir</span><h2>Construir es rápido; validar sigue siendo obligatorio.</h2>
    <ol><li>Prueba el instalador en una máquina o VM limpia.</li><li>Comprueba instalación para usuario actual y para todos los usuarios si soportas ambos modos.</li><li>Verifica accesos directos, asociaciones y menús contextuales.</li><li>Prueba <strong>Launch after install</strong> con la opción activada y desactivada.</li><li>Desinstala y confirma que los datos persistentes que quieras conservar realmente se conservan.</li><li>Firma el ejecutable cuando el producto esté listo para distribución pública.</li></ol>
    <div class="docv2-cta"><strong>Esta documentación seguirá creciendo.</strong><p>Las próximas ampliaciones pueden incluir capturas paso a paso de cada panel, referencia completa de propiedades FSS y ejemplos de proyectos reales.</p></div>
  </article>
</main></div>`}

  function english(){return `
<section class="docv2-hero"><div class="docv2-shell"><span class="docv2-kicker">InstallerLab documentation</span><h1>From an application folder to a Windows installer without fighting the packaging process.</h1><p>InstallerLab turns installer configuration into a visual workflow. For a simple project, choose your application folder, main EXE and output folder, then build.</p><div class="docv2-badges"><span class="docv2-badge">Setup EXE</span><span class="docv2-badge">Portable EXE</span><span class="docv2-badge">B4J Portable</span><span class="docv2-badge">MSI / WiX</span><span class="docv2-badge">Editable FSS</span></div></div></section>
<div class="docv2-shell docv2-layout"><aside class="docv2-side"><div class="docv2-search"><input id="docsSearch" type="search" placeholder="Search documentation…" autocomplete="off"><div id="docsResults" class="docv2-results"></div></div><div class="docv2-navgroup"><b>Start here</b><a href="#overview">What InstallerLab is</a><a href="#first-installer">Your first Setup EXE</a><a href="#visual-script">Visual + FSS script</a></div><div class="docv2-navgroup"><b>Project</b><a href="#app-info">Application info</a><a href="#files">Files and folders</a><a href="#shortcuts">Shortcuts</a><a href="#integration">Windows integration</a><a href="#registry">Registry</a></div><div class="docv2-navgroup"><b>Customization</b><a href="#languages">Languages</a><a href="#themes">Themes</a><a href="#installer">Install and cleanup</a></div><div class="docv2-navgroup"><b>Packaging</b><a href="#portable">Portable</a><a href="#b4j">B4J Portable</a><a href="#msi">MSI</a></div><div class="docv2-navgroup"><b>Reference</b><a href="#fss">FSS reference</a><a href="#constants">Constants</a><a href="#workflow">How it works</a><a href="#tips">Testing</a></div></aside>
<main class="docv2-main"><div class="docv2-lead"><div class="docv2-stat"><strong>3 inputs</strong><span>folder, executable and output to get started</span></div><div class="docv2-stat"><strong>36 languages</strong><span>installer language catalog</span></div><div class="docv2-stat"><strong>32 themes</strong><span>11 Free and 21 PRO in the current catalog</span></div></div>
<article id="overview" data-title="What InstallerLab is" data-keywords="introduction setup exe visual windows packaging"><span class="docv2-kicker">Introduction</span><h2>Packaging should be the easy part.</h2><p>InstallerLab is a visual tool for preparing Windows distributions. One project can describe files, folders, shortcuts, registry entries, Explorer integration, actions, cleanup, languages and appearance.</p><div class="docv2-callout good"><strong>You do not need to start by writing a script.</strong> Configure the project visually and open the FSS whenever you want direct control.</div></article>
<article id="first-installer" data-title="Your first Setup EXE" data-keywords="first installer folder exe output build simple"><span class="docv2-kicker">Quick start</span><h2>Your first Setup EXE can start with four decisions.</h2><div class="docv2-quick"><div class="docv2-step"><em>1</em><b>Source folder</b><small>Select the folder containing your app.</small></div><div class="docv2-step"><em>2</em><b>Main EXE</b><small>Choose the executable that starts it.</small></div><div class="docv2-step"><em>3</em><b>Output folder</b><small>Choose where the installer will be generated.</small></div><div class="docv2-step"><em>4</em><b>EXE Installer</b><small>Build and test the Setup EXE.</small></div></div><p>Application Info also lets you set name, version, publisher, installer icon, install scope and default destination.</p></article>
<article id="visual-script" data-title="Visual editor and FSS script" data-keywords="fss inno setup script automatic sync visual monaco"><span class="docv2-kicker">One source of truth</span><h2>Visual changes become script.</h2><p>An InstallerLab project is stored as an <strong>.fss</strong> plain-text document. Its declarative style will feel familiar to users of tools such as Inno Setup, but <strong>FSS is InstallerLab's own format</strong>.</p><p>Visual panels update the same project document shown in <strong>Script / Automation</strong>. Setup-property updates are designed to preserve comments and user-authored sections.</p>${code('FSS example', setupExample)}</article>
<article id="app-info" data-title="Application information" data-keywords="app information name version publisher source executable output scope destination icon"><span class="docv2-kicker">Project Explorer</span><h2>Application Info: the essentials.</h2><table class="docv2-table"><tr><th>Field</th><th>Purpose</th></tr><tr><td>Application name</td><td>Product name and <code>{AppName}</code>.</td></tr><tr><td>Version / Publisher</td><td>Distribution metadata.</td></tr><tr><td>Source folder</td><td>Classic-mode source folder.</td></tr><tr><td>Main executable</td><td>Primary application executable.</td></tr><tr><td>Output folder</td><td>Where build output is created.</td></tr><tr><td>Installer icon</td><td>Installer <code>.ico</code>.</td></tr><tr><td>Installation scope</td><td><code>currentUser</code> or <code>allUsers</code>.</td></tr><tr><td>Default destination</td><td>LocalAppData, Program Files, Documents or custom.</td></tr></table><div class="docv2-callout warn">All-users or Program Files installation requires UAC elevation; InstallerLab chooses the corresponding execution level at build time.</div></article>
<article id="files" data-title="Files and folders" data-keywords="files folders source destdir flags drag drop"><span class="docv2-kicker">Payload</span><h2>Use a complete folder or precise file rules.</h2><p>Add files or folders and define Source, DestDir and Flags. Folder rules can retain their structure with <code>recursesubdirs createallsubdirs</code>.</p>${code('Files and shortcuts', filesExample)}</article>
<article id="shortcuts" data-title="Shortcuts" data-keywords="shortcuts icons desktop start menu"><span class="docv2-kicker">Windows Shell</span><h2>Start menu and desktop shortcuts.</h2><p>The visual Shortcuts editor maintains <code>[Icons]</code> rules for target, working directory and optional icon.</p></article>
<article id="integration" data-title="Windows integration" data-keywords="open with context menu right click cascade association"><span class="docv2-kicker">Menus and Integration</span><h2>Open With associations and Explorer context menus.</h2><p>Register supported file extensions, descriptions and icons, or create direct and cascading right-click menus with different commands and parameters.</p><div class="docv2-callout">The visual editor translates these options into project registry rules that remain inspectable in FSS.</div></article>
<article id="registry" data-title="Windows registry" data-keywords="registry hkcu hkcr subkey value flags"><span class="docv2-kicker">Registry</span><h2>Declarative registry rules.</h2><p>Define Root, Subkey, ValueType, ValueName, ValueData and Flags in the visual editor. The resulting rules are stored in <code>[Registry]</code>.</p></article>
<article id="languages" data-title="Installer languages" data-keywords="languages selector 36"><span class="docv2-kicker">Multilingual</span><h2>Language selection is visual.</h2><p>The current catalog contains <strong>36 languages</strong>. Choose which languages to include, select the default and decide whether the setup should show a language selector on startup.</p><div class="docv2-callout good">The UI writes <code>Languages</code>, <code>InstallerLanguage</code> and <code>ShowLanguageSelector</code> into <code>[Setup]</code>.</div></article>
<article id="themes" data-title="Themes and appearance" data-keywords="themes 32 free pro accent brand banner"><span class="docv2-kicker">Appearance</span><h2>Your installer does not have to look generic.</h2><p>The current catalog contains <strong>32 themes</strong>: 11 Free and 21 PRO. Depending on the theme you can use variants, accent color, branding, banners, opacity and watermark settings.</p></article>
<article id="installer" data-title="Install and cleanup" data-keywords="installer cleanup uninstall run prerequisites"><span class="docv2-kicker">Lifecycle</span><h2>Actions and cleanup stay explicit.</h2><p>Projects can contain <code>[Prerequisites]</code>, <code>[Run]</code>, <code>[InstallDelete]</code> and <code>[UninstallDelete]</code> rules.</p></article>
<article id="portable" data-title="Portable EXE" data-keywords="portable source executable destination icon version"><span class="docv2-kicker">Portable</span><h2>Portable creation is even more direct.</h2><p>Select the <strong>source EXE</strong> and where to save the new <strong>portable EXE</strong>. InstallerLab derives the source folder from that executable. Icon is optional and version can be specified.</p><div class="docv2-callout">Save the portable outside the source folder so the output cannot include itself while packaging.</div></article>
<article id="b4j" data-title="B4J Portable" data-keywords="b4j portable jdk builder packagerproperty"><span class="docv2-kicker">For B4X developers</span><h2>B4J Portable understands the project.</h2><p>Select a <code>.b4j</code> file. InstallerLab can read <code>#PackagerProperty</code> comments without modifying the project, detect B4J and its full JDK, and use the official local toolchain.</p>${code('B4J project example', b4jExample)}<div class="docv2-callout good">When B4J, B4JBuilder, the packager and Java are available, the panel reports them as ready; manual folder selection is available when automatic detection is not enough.</div></article>
<article id="msi" data-title="MSI with WiX" data-keywords="msi wix"><span class="docv2-kicker">MSI</span><h2>An independent WiX backend.</h2><p>InstallerLab can build MSI packages through WiX on the development machine. A pure MSI is different from the Setup EXE bootstrapper and does not automatically carry the same prerequisite flow.</p></article>
<article id="fss" data-title="FSS script reference" data-keywords="fss setup files dirs registry icons run prerequisites"><span class="docv2-kicker">Reference</span><h2>FSS is readable and editable.</h2><p>Current sections include <code>[Setup]</code>, <code>[Dirs]</code>, <code>[Files]</code>, <code>[Registry]</code>, <code>[Icons]</code>, <code>[Prerequisites]</code>, <code>[Run]</code>, <code>[InstallDelete]</code> and <code>[UninstallDelete]</code>.</p>${code('Minimal project', `[Setup]\nAppName=My Application\nAppVersion=1.0.0\nSourceDir=C:\\MyApp\nMainExecutable=MyApp.exe\nOutputDir=C:\\Build\n\n[Files]\nSource: "C:\\MyApp\\*"; DestDir: "{app}"; Flags: "recursesubdirs createallsubdirs"`)}</article>
<article id="constants" data-title="Path constants" data-keywords="app localappdata autopf userdocs autoprograms autodesktop"><span class="docv2-kicker">Paths</span><h2>Use constants instead of hard-coded Windows paths.</h2><table class="docv2-table"><tr><th>Constant</th><th>Typical use</th></tr><tr><td>{app}</td><td>Application install folder.</td></tr><tr><td>{localappdata}</td><td>Current-user local data.</td></tr><tr><td>{autopf}</td><td>Program Files.</td></tr><tr><td>{userdocs}</td><td>User Documents.</td></tr><tr><td>{autoprograms}</td><td>Start menu Programs.</td></tr><tr><td>{autodesktop}</td><td>Desktop.</td></tr><tr><td>{AppName}</td><td>Application name from Setup.</td></tr></table></article>
<article id="workflow" data-title="How InstallerLab works" data-keywords="workflow setupproject buildengine runtime"><span class="docv2-kicker">Under the hood</span><h2>Project → plan → payload → runtime → Setup.exe.</h2><div class="docv2-flow"><span>.fss</span><i>→</i><span>SetupProject</span><i>→</i><span>BuildEngine</span><i>→</i><span>Payload</span><i>→</i><span>Installer runtime</span><i>→</i><span>Setup.exe</span></div><p>The runtime receives the authored project script; build-time packaging prepares the payload, manifests and required internal components.</p></article>
<article id="tips" data-title="Testing and good practices" data-keywords="testing vm uninstall uac"><span class="docv2-kicker">Before distribution</span><h2>Building is fast; validation still matters.</h2><ol><li>Test on a clean Windows machine or VM.</li><li>Test current-user and all-users installs when supported.</li><li>Verify shortcuts, file associations and context menus.</li><li>Test Launch after install both enabled and disabled.</li><li>Uninstall and verify persistent data behavior.</li><li>Code-sign the final executable when ready for public distribution.</li></ol></article>
</main></div>`}

  function wireDocs(){
    document.querySelectorAll('[data-copy]').forEach(btn => btn.addEventListener('click', () => {
      const text=btn.closest('.docv2-code').querySelector('code').textContent;
      navigator.clipboard.writeText(text).then(()=>{const es=(localStorage.getItem('il-lang')||'es')==='es';btn.textContent=es?COPIED_ES:'Copied';setTimeout(()=>btn.textContent=es?COPY_ES:'Copy',1200)});
    }));
    const input=$('#docsSearch'), results=$('#docsResults');
    const articles=[...document.querySelectorAll('.docv2-main article')];
    if(input&&results){input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();if(q.length<2){results.classList.remove('show');results.innerHTML='';return;}const hits=articles.filter(a=>(a.dataset.title+' '+a.dataset.keywords+' '+a.textContent).toLowerCase().includes(q)).slice(0,8);results.innerHTML=hits.length?hits.map(a=>`<a href="#${a.id}">${a.dataset.title}</a>`).join(''):`<span class="docv2-muted">${(localStorage.getItem('il-lang')||'es')==='es'?'Sin resultados':'No results'}</span>`;results.classList.add('show');});results.addEventListener('click',()=>{results.classList.remove('show');input.value='';});}
    const links=[...document.querySelectorAll('.docv2-side a')];
    if('IntersectionObserver' in window){const obs=new IntersectionObserver(entries=>{entries.filter(e=>e.isIntersecting).forEach(e=>{links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));});},{rootMargin:'-15% 0px -70% 0px'});articles.forEach(a=>obs.observe(a));}
  }

  function renderInstallerLabDocs(){
    if(document.body.dataset.page!=='docs')return;
    const app=document.getElementById('app');if(!app)return;
    const current=(localStorage.getItem('il-lang')||'es').toLowerCase();
    app.innerHTML=current==='en'?english():spanish();
    wireDocs();
  }

  if(typeof render==='function'){
    const baseRender=render;
    render=function(){baseRender();renderInstallerLabDocs();};
  }
  renderInstallerLabDocs();
})();
