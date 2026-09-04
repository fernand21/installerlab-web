(() => {
  const esc = (s) => String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const codeCard = (title, code) => `<div class="docv3-codecard"><div class="docv3-codehead">${title}</div><pre><code>${esc(code)}</code></pre></div>`;
  const isSpanish = () => (localStorage.getItem('il-lang') || 'es').toLowerCase() !== 'en';

  const ES = {
    priorities: `
      <article id="developer-priorities" data-title="Qué buscan desarrolladores y equipos de TI" data-keywords="developers sysadmin enterprise silent logging msi themes visual no code">
        <span class="docv2-kicker">Diseñado para el trabajo real</span>
        <h2>Lo que más se valora en una herramienta de instalación.</h2>
        <p>Al revisar documentación técnica y conversaciones de desarrolladores y administradores de Windows aparece un patrón claro: quieren <strong>menos trabajo repetido</strong>, un formato fácil de desplegar, instalaciones predecibles, integración con Windows y una experiencia visual que no obligue a escribir una segunda herramienta solo para empaquetar.</p>
        <div class="docv3-priority-grid">
          <div class="docv3-priority"><b>⚡ Empezar rápido</b><span>Carpeta, EXE principal y salida para obtener un primer paquete sin aprender primero un DSL complejo.</span></div>
          <div class="docv3-priority"><b>🧩 Una sola fuente de verdad</b><span>Editar visualmente o en FSS sin mantener dos configuraciones distintas para EXE y MSI.</span></div>
          <div class="docv3-priority"><b>🏢 Despliegue empresarial</b><span>MSI estándar, identificadores de producto, logging y automatización con <code>msiexec</code>.</span></div>
          <div class="docv3-priority"><b>🎨 Apariencia profesional</b><span>Temas, branding, acento, banner e identidad visual sin tener que programar una interfaz de instalador.</span></div>
          <div class="docv3-priority"><b>🪟 Integración con Windows</b><span>Accesos directos, registro, Open With y menús contextuales desde paneles visuales.</span></div>
          <div class="docv3-priority"><b>🔧 Escape hatch para expertos</b><span>Cuando el proyecto crece, el FSS sigue visible, editable y versionable.</span></div>
        </div>
        <div class="docv2-callout good"><strong>La idea central de InstallerLab:</strong> simplificar el 80% visualmente sin cerrar la puerta al 20% avanzado.</div>
      </article>`,
    arguments: `
      <article id="arguments" data-title="Argumentos y automatización" data-keywords="arguments command line b4j powershell csharp python batch context menu parameters">
        <span class="docv2-kicker">Casos reales</span>
        <h2>El menú puede lanzar tu aplicación con argumentos.</h2>
        <p>Un elemento de menú contextual no tiene que abrir siempre la misma pantalla. Puedes guardar parámetros distintos por acción y hacer que tu aplicación interprete esos argumentos normalmente. Por ejemplo, un menú para crear complementos de Office puede enviar <code>--create-excel-2010</code>, <code>--create-word-2010</code> o <code>--create-ppt-2010</code>.</p>
        <div class="docv3-visual-example">
          <div class="docv3-mini-ui">
            <div class="docv3-ui-title">Windows context menu</div>
            <label>Visible text</label><div class="docv3-field">Create Ribbon Add-in</div>
            <label>Menu structure</label><div class="docv3-choice">● Cascading submenu &nbsp;&nbsp; ○ Direct action</div>
            <label>Child item</label><div class="docv3-listrow"><b>Excel Add-in (.xlam, Modern 2010+)</b><small>Parameters: --create-excel-2010 "%1"</small></div>
            <div class="docv3-listrow"><b>Word Add-in (.dotm, Modern 2010+)</b><small>Parameters: --create-word-2010 "%1"</small></div>
          </div>
          <div class="docv3-arrow">→</div>
          <div class="docv3-mini-ui result"><div class="docv3-ui-title">Windows Explorer</div><div class="docv3-context"><b>Create Ribbon Add-in ▸</b><span>Excel Add-in</span><span>Word Add-in</span><span>PowerPoint Add-in</span></div></div>
        </div>
        <h3>Cómo recibir esos argumentos</h3>
        <div class="docv3-codegrid">
          ${codeCard('B4J', `Sub AppStart (Form1 As Form, Args() As String)\n    For Each Arg As String In Args\n        Log(Arg)\n    Next\nEnd Sub`)}
          ${codeCard('PowerShell', `$args | ForEach-Object { Write-Host $_ }\n# Ejemplo: MyApp.exe --create-excel-2010 "C:\\Project"`)}
          ${codeCard('C#', `static void Main(string[] args)\n{\n    foreach (var arg in args) Console.WriteLine(arg);\n}`)}
          ${codeCard('Python', `import sys\nfor arg in sys.argv[1:]:\n    print(arg)`)}
          ${codeCard('Batch', `@echo off\necho First argument: %1\necho Second argument: %2`)}
        </div>
        <div class="docv2-callout"><strong>Consejo:</strong> trata cada argumento como un dato independiente y cita las rutas que puedan contener espacios.</div>
      </article>`,
    themes: `
      <div class="docv3-theme-intro">
        <div><span class="docv3-big-number">32</span><b> temas actualmente</b><p>11 Free + 21 PRO. El tema no es un detalle cosmético: para software distribuido públicamente, la primera impresión ocurre antes de que la aplicación se abra.</p></div>
        <div class="docv3-theme-controls"><span>Accent color</span><span>Brand image</span><span>Banner</span><span>Opacity</span><span>Watermark</span></div>
      </div>
      <div class="docv3-theme-gallery">
        <figure><img loading="lazy" src="../assets/screenshots/aurora-pro.png" alt="InstallerLab Aurora Pro theme"><figcaption>Aurora Pro</figcaption></figure>
        <figure><img loading="lazy" src="../assets/screenshots/aero-glass.png" alt="InstallerLab Aero Glass theme"><figcaption>Aero Glass</figcaption></figure>
        <figure><img loading="lazy" src="../assets/screenshots/cosmic-glow.png" alt="InstallerLab Cosmic Glow theme"><figcaption>Cosmic Glow</figcaption></figure>
        <figure><img loading="lazy" src="../assets/screenshots/corporate.png" alt="InstallerLab Corporate theme"><figcaption>Corporate</figcaption></figure>
        <figure><img loading="lazy" src="../assets/screenshots/fluent-light.png" alt="InstallerLab Fluent Light theme"><figcaption>Fluent Light</figcaption></figure>
        <figure><img loading="lazy" src="../assets/screenshots/blueprint.png" alt="InstallerLab Blueprint theme"><figcaption>Blueprint</figcaption></figure>
      </div>
      <div class="docv2-callout good"><strong>Ventaja práctica:</strong> puedes ofrecer una experiencia de instalación acorde con tu producto sin programar una interfaz de Setup desde cero.</div>`,
    msi: `
      <span class="docv2-kicker">Dos salidas, el mismo proyecto</span>
      <h2>Setup EXE o MSI: no son lo mismo, y no tienes que mantener dos proyectos.</h2>
      <p>InstallerLab puede generar un <strong>Setup EXE</strong> con su runtime propio o un <strong>MSI</strong> basado en Windows Installer mediante WiX. La diferencia importante es la tecnología de instalación y el escenario de distribución, no la información que tú tienes que volver a escribir.</p>
      <div class="docv2-callout good"><strong>No necesitas programar un MSI aparte.</strong> InstallerLab toma del mismo proyecto/FSS el nombre, versión, publisher, alcance, destino, archivos, reglas de registro, accesos directos, idiomas y demás datos compatibles, construye el modelo MSI y genera la salida con WiX. No necesitas escribir XML de WiX ni mantener una segunda definición del producto.</div>
      <div class="docv3-dual-output"><span>Paneles visuales</span><i>+</i><span>FSS / SetupProject</span><i>→</i><b>Setup EXE</b><i>o</i><b>MSI</b></div>
      <h3>Comparativa técnica</h3>
      <div class="docv3-table-wrap"><table class="docv2-table docv3-compare"><thead><tr><th>Característica</th><th>Setup EXE de InstallerLab</th><th>MSI de InstallerLab</th></tr></thead><tbody>
        <tr><td>Tecnología</td><td>Runtime/instalador propio de InstallerLab.</td><td>Paquete de <strong>Windows Installer</strong> construido mediante WiX.</td></tr>
        <tr><td>Mejor para</td><td>Descarga directa por usuarios, producto con identidad visual y flujo controlado por InstallerLab.</td><td>Empresas, TI, SCCM/Configuration Manager, Intune, RMM y despliegues donde se espera MSI.</td></tr>
        <tr><td>Temas y branding</td><td><strong>Experiencia completa de temas</strong>, banner, imágenes, acento y variantes del runtime.</td><td>La salida se rige por el modelo de Windows Installer; no equivale al runtime temático del Setup EXE.</td></tr>
        <tr><td>Prerequisitos</td><td>Puede formar parte del flujo del Setup y coordinar acciones previas.</td><td>Un MSI puro no es el lugar ideal para encadenar runtimes externos; normalmente se usa un bootstrapper/bundle para prerequisitos.</td></tr>
        <tr><td>Instalación silenciosa</td><td>Depende de las opciones que exponga el runtime EXE.</td><td>Estándar con <code>msiexec</code>, por ejemplo <code>/qn</code>, <code>/norestart</code> y logging.</td></tr>
        <tr><td>Rollback / reparación</td><td>Usa el ciclo de vida definido por InstallerLab.</td><td>Windows Installer tiene transacciones, rollback y mecanismos de reparación propios.</td></tr>
        <tr><td>Logging empresarial</td><td>Logs propios del instalador.</td><td>Logging estándar de Windows Installer con <code>/L*v</code>.</td></tr>
        <tr><td>Identidad de actualización</td><td>Controlada por el proyecto y runtime de InstallerLab.</td><td>Usa conceptos MSI como ProductId/ProductCode y UpgradeCode para mantenimiento y upgrades.</td></tr>
        <tr><td>Configuración que mantienes</td><td><strong>El mismo proyecto/FSS.</strong></td><td><strong>El mismo proyecto/FSS.</strong> No hay que reescribirlo en WiX.</td></tr>
        <tr><td>Dependencia de build</td><td>Toolchain interno de InstallerLab.</td><td>WiX debe estar disponible en la máquina que construye el MSI.</td></tr>
      </tbody></table></div>
      <div class="docv3-choice-cards"><div><b>Elige EXE cuando…</b><p>Quieres entregar una experiencia visual más rica, directa y controlada por InstallerLab.</p></div><div><b>Elige MSI cuando…</b><p>Tu cliente o equipo de TI necesita un paquete estándar para automatización, inventario, despliegue y mantenimiento.</p></div><div><b>Publica ambos cuando…</b><p>Quieres un EXE para usuarios finales y un MSI para administradores, sin duplicar tu configuración.</p></div></div>
      <h3>Ejemplos de automatización MSI</h3>
      ${codeCard('Instalación silenciosa', `msiexec /i "MyApplication.msi" /qn /norestart /L*v "install.log"`)}
      ${codeCard('Desinstalación silenciosa', `msiexec /x "MyApplication.msi" /qn /norestart /L*v "uninstall.log"`)}
      <div class="docv2-callout warn"><strong>Importante:</strong> “MSI” no significa simplemente “un EXE con otra extensión”. Es una base de datos y modelo de instalación administrado por el servicio Windows Installer. Un EXE, en cambio, puede implementar su propio motor o actuar como bootstrapper.</div>
      <div class="docv3-sources"><b>Referencias técnicas</b><a target="_blank" rel="noopener" href="https://learn.microsoft.com/en-us/windows/win32/msi/installation-mechanism">Microsoft — Windows Installer installation mechanism</a><a target="_blank" rel="noopener" href="https://docs.firegiant.com/wix/tools/burn/">WiX — Burn bundles and bootstrapper applications</a><a target="_blank" rel="noopener" href="https://www.advancedinstaller.com/exe-vs-msi-installer.html">Advanced Installer — EXE vs MSI overview</a></div>`
  };

  const EN = {
    priorities: `
      <article id="developer-priorities" data-title="What developers and IT teams look for" data-keywords="developers sysadmin enterprise silent logging msi themes visual no code">
        <span class="docv2-kicker">Built for real deployment work</span><h2>What teams value most in installer tooling.</h2>
        <p>Across Windows deployment documentation and developer/admin discussions, the same priorities keep appearing: <strong>less duplicated work</strong>, predictable deployment, enterprise-friendly packaging, Windows integration, and a polished setup experience without writing another application just to install the first one.</p>
        <div class="docv3-priority-grid"><div class="docv3-priority"><b>⚡ Fast first build</b><span>Folder, main EXE and output are enough to start.</span></div><div class="docv3-priority"><b>🧩 One source of truth</b><span>Visual editing and FSS without separate EXE/MSI projects.</span></div><div class="docv3-priority"><b>🏢 Enterprise deployment</b><span>Standard MSI, product identity, logging and msiexec automation.</span></div><div class="docv3-priority"><b>🎨 Professional appearance</b><span>Themes and branding without custom installer UI code.</span></div><div class="docv3-priority"><b>🪟 Windows integration</b><span>Shortcuts, registry, Open With and context menus visually.</span></div><div class="docv3-priority"><b>🔧 Expert escape hatch</b><span>Readable FSS remains available when you need precise control.</span></div></div>
      </article>`,
    arguments: `
      <article id="arguments" data-title="Arguments and automation" data-keywords="arguments command line b4j powershell csharp python batch context menu parameters">
        <span class="docv2-kicker">Real-world cases</span><h2>Context-menu actions can pass arguments to your app.</h2><p>Each child command can store different parameters. Your application receives those arguments normally, so one menu can dispatch actions such as <code>--create-excel-2010</code>, <code>--create-word-2010</code> or <code>--create-ppt-2010</code>.</p>
        <div class="docv3-codegrid">${codeCard('B4J', `Sub AppStart (Form1 As Form, Args() As String)\n    For Each Arg As String In Args\n        Log(Arg)\n    Next\nEnd Sub`)}${codeCard('PowerShell', `$args | ForEach-Object { Write-Host $_ }`)}${codeCard('C#', `static void Main(string[] args)\n{\n    foreach (var arg in args) Console.WriteLine(arg);\n}`)}${codeCard('Python', `import sys\nfor arg in sys.argv[1:]:\n    print(arg)`)}${codeCard('Batch', `@echo off\necho First argument: %1`)}</div>
      </article>`,
    themes: `
      <div class="docv3-theme-intro"><div><span class="docv3-big-number">32</span><b> themes today</b><p>11 Free + 21 PRO, with branding controls that let the setup match the product.</p></div><div class="docv3-theme-controls"><span>Accent color</span><span>Brand image</span><span>Banner</span><span>Opacity</span><span>Watermark</span></div></div>
      <div class="docv3-theme-gallery"><figure><img loading="lazy" src="../assets/screenshots/aurora-pro.png" alt="Aurora Pro"><figcaption>Aurora Pro</figcaption></figure><figure><img loading="lazy" src="../assets/screenshots/aero-glass.png" alt="Aero Glass"><figcaption>Aero Glass</figcaption></figure><figure><img loading="lazy" src="../assets/screenshots/cosmic-glow.png" alt="Cosmic Glow"><figcaption>Cosmic Glow</figcaption></figure><figure><img loading="lazy" src="../assets/screenshots/corporate.png" alt="Corporate"><figcaption>Corporate</figcaption></figure><figure><img loading="lazy" src="../assets/screenshots/fluent-light.png" alt="Fluent Light"><figcaption>Fluent Light</figcaption></figure><figure><img loading="lazy" src="../assets/screenshots/blueprint.png" alt="Blueprint"><figcaption>Blueprint</figcaption></figure></div>`,
    msi: `
      <span class="docv2-kicker">Two outputs, one project</span><h2>Setup EXE vs MSI: different technologies, no duplicated project.</h2><p>InstallerLab can build its own Setup EXE runtime or a Windows Installer MSI through WiX. You do <strong>not</strong> need a second configuration or hand-written WiX XML: compatible values are taken from the same FSS/SetupProject.</p>
      <div class="docv2-callout good"><strong>No extra MSI programming required.</strong> Application metadata, scope, destination, files, registry rules, shortcuts, languages and other compatible project data are reused to create the MSI model automatically.</div>
      <div class="docv3-dual-output"><span>Visual panels</span><i>+</i><span>FSS / SetupProject</span><i>→</i><b>Setup EXE</b><i>or</i><b>MSI</b></div>
      <div class="docv3-table-wrap"><table class="docv2-table docv3-compare"><thead><tr><th>Area</th><th>InstallerLab Setup EXE</th><th>InstallerLab MSI</th></tr></thead><tbody><tr><td>Technology</td><td>InstallerLab custom runtime.</td><td>Windows Installer package built with WiX.</td></tr><tr><td>Best fit</td><td>Direct end-user distribution and branded setup UX.</td><td>Enterprise deployment and standardized management.</td></tr><tr><td>Themes</td><td>Full InstallerLab theme/branding experience.</td><td>Windows Installer model; not the same themed runtime.</td></tr><tr><td>Prerequisites</td><td>Can be coordinated in the setup flow.</td><td>Pure MSI packages normally rely on a bootstrapper/bundle for external prerequisites.</td></tr><tr><td>Silent install</td><td>Depends on EXE runtime options.</td><td>Standard <code>msiexec /qn</code> automation.</td></tr><tr><td>Rollback / repair</td><td>InstallerLab lifecycle.</td><td>Native Windows Installer transaction/repair model.</td></tr><tr><td>Logging</td><td>InstallerLab logs.</td><td>Standard MSI logging with <code>/L*v</code>.</td></tr><tr><td>Project you maintain</td><td><strong>The same FSS project.</strong></td><td><strong>The same FSS project.</strong> No duplicated WiX authoring.</td></tr><tr><td>Build dependency</td><td>InstallerLab packaging toolchain.</td><td>WiX must be available on the build machine.</td></tr></tbody></table></div>
      <div class="docv3-sources"><b>Technical references</b><a target="_blank" rel="noopener" href="https://learn.microsoft.com/en-us/windows/win32/msi/installation-mechanism">Microsoft — Windows Installer installation mechanism</a><a target="_blank" rel="noopener" href="https://docs.firegiant.com/wix/tools/burn/">WiX — Burn bundles</a><a target="_blank" rel="noopener" href="https://www.advancedinstaller.com/exe-vs-msi-installer.html">Advanced Installer — EXE vs MSI</a></div>`
  };

  function enhance() {
    if (document.body.dataset.page !== 'docs') return;
    const app = document.getElementById('app');
    if (!app || app.dataset.docEnhancements === '1') return;
    const overview = document.getElementById('overview');
    const integration = document.getElementById('integration');
    const themes = document.getElementById('themes');
    const msi = document.getElementById('msi');
    if (!overview || !integration || !themes || !msi) return;
    app.dataset.docEnhancements = '1';
    const T = isSpanish() ? ES : EN;

    overview.insertAdjacentHTML('afterend', T.priorities);
    integration.insertAdjacentHTML('afterend', T.arguments);
    themes.insertAdjacentHTML('beforeend', T.themes);
    msi.innerHTML = T.msi;

    const side = document.querySelector('.docv2-side');
    if (side) {
      const startGroup = side.querySelector('.docv2-navgroup');
      if (startGroup && !startGroup.querySelector('a[href="#developer-priorities"]')) {
        startGroup.insertAdjacentHTML('beforeend', `<a href="#developer-priorities">${isSpanish() ? 'Qué buscan los desarrolladores' : 'What developers want'}</a>`);
      }
      const projectGroups = side.querySelectorAll('.docv2-navgroup');
      const projectGroup = projectGroups[1];
      if (projectGroup && !projectGroup.querySelector('a[href="#arguments"]')) {
        projectGroup.insertAdjacentHTML('beforeend', `<a href="#arguments">${isSpanish() ? 'Argumentos y automatización' : 'Arguments & automation'}</a>`);
      }
    }
  }

  const app = document.getElementById('app');
  if (app && 'MutationObserver' in window) {
    const observer = new MutationObserver(() => {
      if (app.dataset.docEnhancements !== '1') requestAnimationFrame(enhance);
    });
    observer.observe(app, {childList:true, subtree:false});
  }
  requestAnimationFrame(enhance);
})();
