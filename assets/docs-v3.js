(() => {
  const esc = s => String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const code = (label,text) => `<div class="doc3-code"><div class="doc3-codebar"><span>${label}</span><button type="button" data-copy>Copiar</button></div><pre><code>${esc(text)}</code></pre></div>`;
  const shot = (file, alt, caption) => `<figure class="doc3-shot"><a href="assets/${file}" target="_blank" rel="noopener"><img src="assets/${file}" alt="${alt}" loading="lazy"></a><figcaption>${caption}</figcaption></figure>`;
  const pair = (a,b) => `<div class="doc3-shotgrid">${a}${b}</div>`;

  const fss = `[Setup]\nAppName=Ribbon UI Studio\nAppVersion=3.2.0\nPublisher=B4X Store\nSourceDir=F:\\MyApp\nMainExecutable=Ribbon UI Studio.exe\nOutputDir=C:\\Build\nInstallScope=allUsers\nInstallerLanguage=en\nLanguages=en|es|fr|de|it|pt\nShowLanguageSelector=True\nDefaultDirName={autopf}\\{AppName}\n\n[Files]\nSource: "F:\\MyApp\\*"; DestDir: "{app}"; Flags: "recursesubdirs createallsubdirs"\n\n[Icons]\nName: "{autoprograms}\\Ribbon UI Studio"; Filename: "{app}\\Ribbon UI Studio.exe"; WorkingDir: "{app}"`;
  const menuFss = `[Registry]\n; Aplicación disponible en Open With\nRoot: HKCR; Subkey: "Applications\\MyApp.exe"; ValueType: string; ValueName: "FriendlyAppName"; ValueData: "My App"; Flags: uninsdeletekey\nRoot: HKCR; Subkey: "Applications\\MyApp.exe\\shell\\open\\command"; ValueType: string; ValueName: ""; ValueData: "\\\"{app}\\MyApp.exe\\\" \\\"%1\\\""; Flags: uninsdeletekey\n\n; Acción del menú contextual\nRoot: HKCR; Subkey: "Directory\\shell\\MyApp"; ValueType: string; ValueName: "MUIVerb"; ValueData: "Procesar con My App"; Flags: uninsdeletekey`;
  const b4jReceive = `Sub AppStart (Form1 As Form, Args() As String)\n    If Args.Length = 0 Then Return\n\n    Select Args(0)\n        Case "--create-excel-2010"\n            If Args.Length > 1 Then CreateExcelAddin(Args(1))\n        Case "--open"\n            If Args.Length > 1 Then OpenDocument(Args(1))\n    End Select\nEnd Sub`;
  const b4jCall = `Dim sh As Shell\nsh.Initialize("runapp", "MyApp.exe", _\n    Array As String("--create-excel-2010", FilePath))\nsh.Run(-1)`;
  const cs = `static void Main(string[] args)\n{\n    if (args.Length >= 2 && args[0] == "--open")\n        OpenDocument(args[1]);\n}`;
  const java = `public static void main(String[] args) {\n    if (args.length >= 2 && "--open".equals(args[0])) {\n        openDocument(args[1]);\n    }\n}`;
  const python = `import sys\n\nif len(sys.argv) >= 3 and sys.argv[1] == "--open":\n    open_document(sys.argv[2])`;
  const ps = `param([string]$Action, [string]$Path)\n\nif ($Action -eq "--open") {\n    Write-Host "Opening $Path"\n}`;
  const batch = `@echo off\nif /I "%~1"=="--open" (\n  echo File received: "%~2"\n)`;
  const b4jProps = `#PackagerProperty: IconFile = ..\\icon.ico\n#PackagerProperty: ExeName = My Application.exe\n#PackagerProperty: IncludedModules = jdk.crypto.ec, javafx.swing, javafx.web\n#PackagerProperty: Version = 1.0.0`;

  const html = `
<section class="doc3-hero"><div class="doc3-shell"><span class="doc3-kicker">InstallerLab Documentation</span><h1>Construye instaladores visualmente. Conserva el control del script.</h1><p>InstallerLab está pensado para que un desarrollador pueda pasar de una aplicación terminada a un Setup EXE, Portable o MSI sin tener que escribir un segundo instalador. El editor visual mantiene el mismo proyecto <strong>.fss</strong> que puedes inspeccionar y editar cuando quieras.</p><div class="doc3-pills"><span>Setup EXE</span><span>MSI / WiX</span><span>Portable</span><span>B4J Portable</span><span>36 idiomas</span><span>32 temas</span></div></div></section>
<div class="doc3-shell doc3-layout">
<aside class="doc3-side"><input id="doc3search" type="search" placeholder="Buscar…"><nav>
<b>Inicio</b><a href="#quick">Primer instalador</a><a href="#visual-fss">Visual + FSS</a><a href="#developers">Qué busca un desarrollador</a>
<b>Integración</b><a href="#associations">Asociaciones</a><a href="#context">Menús contextuales</a><a href="#args">Argumentos</a><a href="#shortcuts">Accesos directos</a><a href="#registry">Registro</a>
<b>Distribución</b><a href="#themes">Temas</a><a href="#languages">Idiomas</a><a href="#portable">Portable</a><a href="#b4j">B4J Portable</a><a href="#exe-msi">EXE vs MSI</a>
<b>Referencia</b><a href="#fss">FSS</a><a href="#sources">Fuentes técnicas</a></nav></aside>
<main class="doc3-main">
<section class="doc3-stats"><div><strong>3 datos</strong><span>carpeta, EXE y salida para empezar</span></div><div><strong>1 proyecto</strong><span>para EXE y MSI</span></div><div><strong>Visual + código</strong><span>sin quedar encerrado en un wizard</span></div></section>

<article id="quick" data-search="primer instalador app information source folder executable output setup exe">
<span class="doc3-kicker">Inicio rápido</span><h2>Tu primer Setup EXE no tiene por qué empezar con código.</h2><p>Para un caso típico, selecciona la carpeta que ya contiene tu aplicación, el ejecutable principal y la carpeta de salida. Completa nombre, versión, publisher e icono y pulsa <strong>EXE Installer</strong>.</p>
${pair(shot('app-information.webp','Panel App Information','App Information concentra los datos fundamentales del paquete.'),shot('installation-destination.webp','Destino de instalación','El alcance y el destino se seleccionan visualmente: usuario actual, todos los usuarios, Program Files, LocalAppData, Documents o una ruta personalizada.'))}
<div class="doc3-steps"><div><i>1</i><b>Source folder</b><span>La aplicación que ya funciona.</span></div><div><i>2</i><b>Main executable</b><span>El EXE que inicia el programa.</span></div><div><i>3</i><b>Output folder</b><span>Dónde recibir el instalador.</span></div><div><i>4</i><b>Build</b><span>EXE o MSI desde el mismo proyecto.</span></div></div>
</article>

<article id="visual-fss" data-search="visual script fss inno setup monaco auto escribe sincroniza">
<span class="doc3-kicker">Dos formas de trabajar, un solo proyecto</span><h2>Lo visual autoescribe el FSS.</h2><p>FSS es un formato de texto plano inspirado en el estilo declarativo familiar de herramientas como Inno Setup, pero es el formato propio de InstallerLab. Cuando cambias información desde los paneles visuales, InstallerLab actualiza el documento; al abrir <strong>Script / Automation</strong> puedes ver y ajustar exactamente esas reglas.</p><div class="doc3-call good"><strong>No es un “wizard que oculta todo”.</strong> Puedes empezar sin escribir código y bajar al script cuando necesitas control fino, versionado o automatización.</div>${code('Ejemplo de proyecto FSS',fss)}
${shot('files-folders.webp','Editor visual Files and Folders','Agregar archivos y carpetas actualiza [Files]. Una carpeta puede conservar su estructura con flags como recursesubdirs y createallsubdirs.')}
</article>

<article id="developers" data-search="developer workflow no code repeatable automation transparent script installer">
<span class="doc3-kicker">Diseñado para el flujo de desarrollo</span><h2>Lo que suele importar al empaquetar una aplicación.</h2><div class="doc3-grid"><div class="doc3-card"><b>Menos trabajo duplicado</b><p>No volver a describir la aplicación para cada formato de salida.</p></div><div class="doc3-card"><b>Configuración visible</b><p>Archivos, accesos, registro, asociaciones e idiomas en paneles entendibles.</p></div><div class="doc3-card"><b>Automatización</b><p>Un archivo de proyecto legible y versionable que puede revisarse o modificarse.</p></div><div class="doc3-card"><b>Integración de Windows</b><p>Open With, tipos de archivo y menús contextuales sin escribir a mano todas las claves del registro.</p></div><div class="doc3-card"><b>Distribución profesional</b><p>EXE para una experiencia controlada y MSI cuando necesitas Windows Installer y despliegue empresarial.</p></div><div class="doc3-card"><b>Apariencia</b><p>Un instalador que no parezca genérico: temas, branding, acento, banner y preview.</p></div></div>
</article>

<article id="associations" data-search="file association open with progid extension document icon">
<span class="doc3-kicker">Windows Integration</span><h2>Asociaciones de archivo y “Open With” de forma visual.</h2><p>Activa el registro de la aplicación, escribe las extensiones admitidas y, si quieres, define un <strong>ProgID</strong>, una descripción amigable y un icono para el tipo de documento. El objetivo es que Windows pueda mostrar tu aplicación en <strong>Abrir con</strong> y que los archivos tengan una identidad comprensible para el usuario.</p>${shot('windows-integration.webp','Windows Integration - Open With','La misma pantalla permite declarar extensiones como .xlam, .xlsm, .dotm, .ppam o cualquier formato propio de tu aplicación.')}
<div class="doc3-how"><b>Ejemplo real</b><ol><li>Activa <em>Register the application in the Windows Open With list</em>.</li><li>Escribe extensiones separadas por coma o espacio.</li><li>Define ProgID y descripción si quieres controlar cómo se identifica el documento.</li><li>Selecciona un icono opcional.</li><li>InstallerLab genera las reglas correspondientes dentro del proyecto.</li></ol></div>
</article>

<article id="context" data-search="context menu right click cascading submenu parameters explorer">
<span class="doc3-kicker">Menú contextual</span><h2>Crea un menú de clic derecho, incluso con submenús en cascada.</h2><p>Puedes registrar una acción directa o un menú padre con varios comandos. Cada entrada puede tener texto visible, parámetros e icono. Esto sirve para herramientas que exponen operaciones diferentes sobre una carpeta o archivo.</p>${shot('context-menu.webp','Editor de menú contextual','Ejemplo: un menú “Crear Ribbon Add-in” con comandos separados para Excel, Word y PowerPoint.')}
<div class="doc3-call"><strong>Por qué es útil:</strong> el usuario diseña la experiencia desde la UI, mientras InstallerLab escribe las reglas de registro. Si luego necesita algo especial, puede abrir el FSS y modificarlo.</div>${code('Equivalente FSS simplificado',menuFss)}
</article>

<article id="args" data-search="arguments command line b4j csharp java python powershell batch args parameters">
<span class="doc3-kicker">Argumentos y automatización</span><h2>El menú puede ejecutar tu aplicación con argumentos que tú decides.</h2><p>InstallerLab no inventa un protocolo: simplemente registra la línea de comandos que deseas. Tu aplicación recibe esos argumentos como cualquier programa de Windows. Puedes reutilizar el mismo patrón en menús contextuales, accesos directos, scripts y automatizaciones.</p>
<div class="doc3-tabs"><button class="active" data-lang="b4jr">B4J recibe</button><button data-lang="b4jc">B4J ejecuta</button><button data-lang="cs">C#</button><button data-lang="java">Java</button><button data-lang="python">Python</button><button data-lang="ps">PowerShell</button><button data-lang="bat">Batch</button></div>
<div class="doc3-lang active" data-panel="b4jr">${code('B4J — recibir argumentos en AppStart',b4jReceive)}</div><div class="doc3-lang" data-panel="b4jc">${code('B4J — ejecutar otra aplicación con argumentos',b4jCall)}</div><div class="doc3-lang" data-panel="cs">${code('C#',cs)}</div><div class="doc3-lang" data-panel="java">${code('Java',java)}</div><div class="doc3-lang" data-panel="python">${code('Python',python)}</div><div class="doc3-lang" data-panel="ps">${code('PowerShell',ps)}</div><div class="doc3-lang" data-panel="bat">${code('Batch',batch)}</div>
<div class="doc3-call warn"><strong>Rutas con espacios:</strong> cuando armes una línea de comandos manualmente, cita las rutas. Cuando el lenguaje permite pasar un array/lista de argumentos —como B4J o Python— es preferible pasar cada argumento como elemento independiente.</div>
</article>

<article id="shortcuts" data-search="shortcuts desktop start menu arguments icons">
<span class="doc3-kicker">Shortcuts</span><h2>Accesos directos al escritorio y menú Inicio.</h2><p>Define el nombre, el ejecutable, el directorio de trabajo y el icono. Las mismas constantes del proyecto te permiten apuntar al ejecutable instalado sin codificar rutas absolutas.</p>${shot('shortcuts.webp','Editor de accesos directos','Las reglas visuales de Shortcuts se guardan como entradas [Icons] en FSS.')}
</article>

<article id="registry" data-search="registry HKCU HKCR value type subkey uninsdeletekey">
<span class="doc3-kicker">Registry</span><h2>Registro de Windows sin perder la representación declarativa.</h2><p>Root, Subkey, ValueType, ValueName, ValueData y Flags se editan en una tabla clara. Las reglas continúan visibles en <code>[Registry]</code>, así que el proyecto no queda atado a una interfaz opaca.</p>${shot('registry.webp','Editor Registry','El panel visual sirve tanto para entradas simples como para reglas generadas por asociaciones y shell integration.')}
</article>

<article id="themes" data-search="themes free pro 32 branding banner accent preview installer appearance">
<span class="doc3-kicker">Personalización</span><h2>32 temas: 11 Free y 21 PRO.</h2><p>La apariencia es una parte importante del producto final. InstallerLab permite elegir un tema y, cuando el tema lo admite, personalizar acento, branding, banner, opacidad y watermark. La ventaja no es solo estética: puedes mantener una experiencia consistente con la identidad visual de tu aplicación.</p><div class="doc3-themeband"><div><strong>11</strong><span>Free</span></div><div><strong>21</strong><span>PRO</span></div><div><strong>32</strong><span>Total actual</span></div></div><p>El catálogo incluye estilos oscuros, claros, compactos, glass y diseños más expresivos. La documentación visual del sitio muestra ejemplos reales de estos temas.</p></article>

<article id="languages" data-search="languages 36 selector default installer language multilingual">
<span class="doc3-kicker">Idiomas</span><h2>Seleccionar idiomas debe ser tan fácil como marcarlos.</h2><p>El catálogo actual incluye 36 idiomas. Selecciona cuáles incluir, elige el predeterminado y decide si el Setup mostrará un selector al iniciar. InstallerLab escribe <code>Languages</code>, <code>InstallerLanguage</code> y <code>ShowLanguageSelector</code> en el mismo proyecto.</p>${shot('languages.webp','Selector de idiomas','El menú de idiomas permite crear un instalador multilenguaje sin duplicar el proyecto.')}
</article>

<article id="portable" data-search="portable exe source executable output icon version">
<span class="doc3-kicker">Portable EXE</span><h2>Una aplicación ya portable puede convertirse en un único EXE.</h2><p>Selecciona el ejecutable fuente, el archivo de salida, un icono opcional y la versión. InstallerLab toma la carpeta que contiene el EXE como origen y crea la distribución portable.</p>${shot('portable.webp','Create portable','El flujo Portable está deliberadamente reducido a los datos necesarios.')}
</article>

<article id="b4j" data-search="b4j portable jdk packager property includedmodules B4JBuilder">
<span class="doc3-kicker">B4J Portable</span><h2>Empaquetado especializado para proyectos B4J.</h2><p>Selecciona el archivo <code>.b4j</code>. InstallerLab inspecciona las <code>#PackagerProperty</code>, detecta B4J y su JDK cuando están disponibles y prepara una carpeta portable utilizando el runtime oficial de B4J.</p>${shot('b4j-portable.webp','B4J Portable','La ventana muestra proyecto, ExeName, Version, IconFile, IncludedModules, toolchain detectado y carpeta de salida.')}${code('Propiedades que InstallerLab puede leer del proyecto',b4jProps)}
</article>

<article id="exe-msi" data-search="exe msi comparison windows installer wix enterprise rollback prerequisites same project">
<span class="doc3-kicker">Formato de salida</span><h2>Setup EXE y MSI no son lo mismo. InstallerLab puede generar ambos desde el mismo proyecto.</h2><p>Un <strong>MSI</strong> es un paquete consumido por el servicio <strong>Windows Installer</strong>. Internamente es una base de datos con tablas, componentes, features y reglas que Windows Installer interpreta. Un <strong>Setup EXE</strong> es un programa ejecutable de instalación cuyo motor y experiencia pueden ser controlados por la herramienta que lo genera.</p>
<div class="doc3-call good"><strong>La diferencia clave en InstallerLab:</strong> no necesitas programar un segundo instalador para obtener MSI. InstallerLab toma los datos y reglas del mismo proyecto/FSS —aplicación, versión, publisher, archivos, registro, accesos directos, idiomas, scope y destino— y genera el proyecto WiX/MSI correspondiente.</div>
<div class="doc3-tablewrap"><table class="doc3-table"><thead><tr><th>Aspecto</th><th>Setup EXE de InstallerLab</th><th>MSI de InstallerLab</th></tr></thead><tbody>
<tr><td>Motor</td><td>Runtime de instalación empaquetado por InstallerLab.</td><td>Windows Installer; InstallerLab genera el MSI mediante WiX.</td></tr>
<tr><td>Proyecto fuente</td><td><strong>El mismo .fss</strong>.</td><td><strong>El mismo .fss</strong>; no hay que rehacer el proyecto.</td></tr>
<tr><td>Experiencia visual</td><td>Más libertad para temas, branding y flujo propio.</td><td>Más condicionado por el modelo y convenciones de Windows Installer.</td></tr>
<tr><td>Prerequisitos</td><td>Ideal para comprobar o encadenar runtimes/dependencias antes de instalar.</td><td>MSI puro no es un bootstrapper; prerequisitos externos suelen requerir un bootstrapper/bundle.</td></tr>
<tr><td>Rollback</td><td>Depende de las capacidades implementadas por el runtime del Setup.</td><td>Windows Installer tiene modelo transaccional y rollback de instalación.</td></tr>
<tr><td>Reparación / resiliencia</td><td>No es una característica inherente al formato EXE.</td><td>Windows Installer puede soportar reparación y resiliencia basada en componentes.</td></tr>
<tr><td>Administración empresarial</td><td>Útil para distribución normal y escenarios donde necesitas un bootstrapper.</td><td>Formato estándar de Windows Installer, muy usado con herramientas corporativas de despliegue.</td></tr>
<tr><td>Línea de comandos</td><td>La define el motor/Setup.</td><td>Compatible con el ecosistema <code>msiexec</code> y propiedades MSI.</td></tr>
<tr><td>Cuándo elegirlo</td><td>Cuando priorizas experiencia visual, prerequisitos o un instalador único controlado.</td><td>Cuando necesitas Windows Installer, políticas corporativas, inventario, reparación o despliegue MSI.</td></tr>
</tbody></table></div>
<div class="doc3-grid"><div class="doc3-card"><b>Elige EXE cuando…</b><p>Quieres la experiencia visual de InstallerLab, necesitas manejar prerequisitos antes del paquete principal o prefieres una distribución ejecutable autocontenida.</p></div><div class="doc3-card"><b>Elige MSI cuando…</b><p>Tu cliente, departamento TI o sistema de despliegue espera un paquete Windows Installer y quieres aprovechar su modelo de componentes, rollback y administración.</p></div></div>
</article>

<article id="fss" data-search="fss sections setup files dirs registry icons run prerequisites install delete uninstall delete">
<span class="doc3-kicker">Referencia FSS</span><h2>Secciones principales.</h2><div class="doc3-sectionlist"><span>[Setup]</span><span>[Files]</span><span>[Dirs]</span><span>[Icons]</span><span>[Registry]</span><span>[Prerequisites]</span><span>[Run]</span><span>[InstallDelete]</span><span>[UninstallDelete]</span></div><p>La interfaz visual cubre los casos frecuentes; FSS queda disponible para reglas más específicas, revisión, control de versiones y automatización.</p></article>

<article id="sources" data-search="microsoft windows installer sources wix advanced installer research">
<span class="doc3-kicker">Fuentes técnicas</span><h2>Referencias usadas para esta comparación.</h2><p>La diferencia EXE/MSI anterior sigue la arquitectura documentada por Microsoft para Windows Installer: un MSI contiene la base de datos de instalación y Windows Installer aporta capacidades como componentes, features, rollback, resiliencia y administración. También se tomó como referencia la práctica habitual de los bootstrappers EXE para ejecutar comprobaciones y prerequisitos antes del paquete principal.</p><div class="doc3-links"><a href="https://learn.microsoft.com/windows/win32/msi/installation-package" target="_blank" rel="noopener">Microsoft — Installation Package</a><a href="https://learn.microsoft.com/windows/win32/msi/installation-mechanism" target="_blank" rel="noopener">Microsoft — Installation Mechanism / Rollback</a><a href="https://learn.microsoft.com/windows/win32/msi/windows-installer-portal" target="_blank" rel="noopener">Microsoft — Windows Installer</a><a href="https://www.advancedinstaller.com/exe-bootstrapper.html" target="_blank" rel="noopener">Advanced Installer — EXE bootstrapper / prerequisites</a></div></article>
</main></div>`;

  function mount(){
    const old=document.querySelector('.docs-shell,.docs-page,.docv2-hero'); if(old) old.remove();
    const host=document.createElement('div');host.className='doc3';host.innerHTML=html;document.body.appendChild(host);
    document.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{const pre=btn.closest('.doc3-code').querySelector('code').textContent;try{await navigator.clipboard.writeText(pre);btn.textContent='Copiado';setTimeout(()=>btn.textContent='Copiar',1200)}catch(e){}}));
    document.querySelectorAll('.doc3-tabs button').forEach(btn=>btn.addEventListener('click',()=>{const group=btn.closest('article');group.querySelectorAll('.doc3-tabs button').forEach(b=>b.classList.remove('active'));group.querySelectorAll('.doc3-lang').forEach(p=>p.classList.remove('active'));btn.classList.add('active');group.querySelector(`[data-panel="${btn.dataset.lang}"]`).classList.add('active')}));
    const search=document.getElementById('doc3search');search.addEventListener('input',()=>{const q=search.value.toLowerCase().trim();document.querySelectorAll('.doc3-main article').forEach(a=>{a.hidden=q&&!(a.textContent+' '+a.dataset.search).toLowerCase().includes(q)})});
    const links=[...document.querySelectorAll('.doc3-side a')];const observer=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}})},{rootMargin:'-20% 0px -70%'});document.querySelectorAll('.doc3-main article').forEach(a=>observer.observe(a));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
