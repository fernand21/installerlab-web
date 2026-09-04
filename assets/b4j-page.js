(() => {
  const OFFICIAL = 'https://www.b4x.com/android/forum/threads/integrated-b4jpackager11-the-simple-way-to-distribute-standalone-ui-apps.117880/';
  let queued = false;

  const lang = () => (localStorage.getItem('il-lang') || 'es').toLowerCase() === 'en' ? 'en' : 'es';

  function dialogMock() {
    const en = lang() === 'en';
    return `
      <div class="b4j-ui" role="img" aria-label="${en ? 'Recreated B4J Portable dialog' : 'Recreación del cuadro B4J Portable'}">
        <div class="b4j-ui-title"><span>B4J Portable</span><span class="b4j-ui-close">×</span></div>
        <div class="b4j-ui-body">
          <section class="b4j-ui-panel">
            <div class="b4j-ui-kicker">B4J PROJECT</div>

            <div class="b4j-ui-row">
              <div class="b4j-ui-label">${en ? 'Project file or folder' : 'Archivo o carpeta del proyecto'}</div>
              <div><span class="b4j-ui-hint">${en ? 'Path to a .b4j project' : 'Ruta a un proyecto .b4j'}</span><div class="b4j-ui-input">F:\\MyProject\\MyApp.b4j</div></div>
            </div>

            <div class="b4j-ui-row">
              <div class="b4j-ui-label">ExeName</div>
              <div><span class="b4j-ui-hint">Application.exe</span><div class="b4j-ui-input">My Application.exe</div></div>
            </div>

            <div class="b4j-ui-row">
              <div class="b4j-ui-label">${en ? 'Version' : 'Versión'}</div>
              <div><span class="b4j-ui-hint">1.0.0</span><div class="b4j-ui-input">3.2.0</div></div>
            </div>

            <div class="b4j-ui-row">
              <div class="b4j-ui-label">IconFile</div>
              <div><span class="b4j-ui-hint">${en ? 'Optional .ico file' : 'Archivo .ico opcional'}</span><div class="b4j-ui-input">icon.ico</div></div>
            </div>

            <div class="b4j-ui-row">
              <div class="b4j-ui-label">IncludedModules</div>
              <div><div class="b4j-ui-input multiline">jdk.crypto.ec, javafx.swing, javafx.web</div></div>
            </div>
          </section>

          <section class="b4j-ui-panel">
            <div class="b4j-ui-kicker">BUILD / OUTPUT</div>

            <div class="b4j-ui-row">
              <div class="b4j-ui-label">${en ? 'Output folder' : 'Carpeta de salida'}</div>
              <div><span class="b4j-ui-hint">${en ? 'Portable output folder' : 'Carpeta de salida portable'}</span><div class="b4j-ui-input">F:\\MyProject-B4J-Portable</div></div>
            </div>

            <div class="b4j-ui-row">
              <div class="b4j-ui-label">${en ? 'Mode' : 'Modo'}</div>
              <div class="b4j-ui-label">${en ? 'Portable folder (official B4J runtime)' : 'Carpeta portable (runtime oficial B4J)'}</div>
            </div>

            <div class="b4j-ui-tool"><div class="b4j-ui-status">B4J: ready<br>${en ? 'Compiler / Packager' : 'Compilador / Packager'}: ready<br>JDK: ready (jdk-19.0.2)</div><div><span class="b4j-ui-btn">B4J folder</span><span class="b4j-ui-btn" style="margin-top:8px">JDK folder</span></div></div>

            <div class="b4j-ui-status b4j-ui-ok">${en ? 'Configuration: InstallerLab.confbuilder found' : 'Configuración: InstallerLab.confbuilder encontrado'}</div>
            <div class="b4j-ui-status">Launcher V4: cached SHA 6b269ab75f03415e…</div>
            <div class="b4j-ui-status b4j-ui-warn">IconFile path changed.</div>
          </section>
        </div>

        <div class="b4j-ui-footer">
          <span class="b4j-ui-loaded">${en ? 'Project loaded: MyApp.b4j' : 'Proyecto cargado: MyApp.b4j'}</span>
          <div class="b4j-ui-actions">
            <span class="b4j-ui-btn secondary">${en ? 'Update from project' : 'Actualizar desde proyecto'}</span>
            <span class="b4j-ui-btn primary">${en ? 'CREATE B4J PORTABLE' : 'CREAR B4J PORTABLE'}</span>
          </div>
        </div>
        <div class="b4j-ui-note">${en ? 'Web recreation based on the real InstallerLab dialog, isolated here so each control can be explained clearly.' : 'Recreación web basada en el cuadro real de InstallerLab, aislada aquí para poder explicar claramente cada control.'}</div>
      </div>`;
  }

  function renderPage() {
    if (document.body.dataset.page !== 'b4j') return;
    const main = document.querySelector('main.content');
    if (!main || main.dataset.b4jEnhanced === '1') return;

    main.dataset.b4jEnhanced = '1';
    const en = lang() === 'en';

    main.innerHTML = `
      <div class="b4j-guide">
        <section class="b4j-intro">
          <div class="b4j-lead">
            <span class="b4j-badge"><i class="b4j-dot"></i>${en ? 'Official B4J + InstallerLab distribution layer' : 'B4J oficial + capa de distribución InstallerLab'}</span>
            <h2>${en ? 'From a .b4j project to a portable folder ready to distribute.' : 'De un proyecto .b4j a una carpeta portable lista para distribuir.'}</h2>
            <p>${en
              ? 'B4J Portable does not replace the B4J compiler. InstallerLab uses <strong>B4JBuilder.exe</strong> and <strong>B4JPackager11.jar</strong> to compile and create the official runtime, then applies its own launch and configuration layer.'
              : 'B4J Portable no sustituye el compilador de B4J. InstallerLab usa <strong>B4JBuilder.exe</strong> y <strong>B4JPackager11.jar</strong> para compilar y crear el runtime oficial; después aplica su propia capa de lanzamiento y configuración.'}</p>
          </div>
          <aside class="b4j-side-note">
            <strong>${en ? 'What “portable” means here' : 'Qué significa “portable” aquí'}</strong>
            <p>${en
              ? 'It is a <strong>self-contained folder</strong>: application, Java runtime and dependencies travel together. The target PC does not need Java or B4J installed. It does not mean one single EXE.'
              : 'Es una <strong>carpeta autocontenida</strong>: aplicación, runtime Java y dependencias viajan juntos. El PC destino no necesita Java ni B4J instalados. No significa un único EXE.'}</p>
          </aside>
        </section>

        <section class="b4j-section">
          <div class="b4j-section-head">
            <h2>${en ? 'The B4J Portable dialog, isolated' : 'El cuadro B4J Portable, aislado'}</h2>
            <p>${en
              ? 'The left side describes the B4J project. The right side validates the local toolchain, configuration, launcher state and destination before building.'
              : 'La parte izquierda describe el proyecto B4J. La derecha valida el toolchain local, la configuración, el estado del launcher y el destino antes de construir.'}</p>
          </div>
          ${dialogMock()}
        </section>

        <section class="b4j-section">
          <div class="b4j-section-head">
            <h2>${en ? 'How it works, step by step' : 'Cómo funciona, paso a paso'}</h2>
            <p>${en ? 'InstallerLab preserves the official B4J build pipeline and automates the distribution layer around it.' : 'InstallerLab conserva el proceso oficial de B4J y automatiza la capa de distribución alrededor de él.'}</p>
          </div>

          <div class="b4j-grid">
            <article class="b4j-card"><span class="b4j-step">1</span><h3>${en ? 'Select the project' : 'Selecciona el proyecto'}</h3><p>${en
              ? 'Open the <code>.b4j</code> file. InstallerLab reads <code>#PackagerProperty</code> values such as <code>ExeName</code>, <code>IconFile</code>, <code>IncludedModules</code> and <code>Version</code> without modifying the source.'
              : 'Abre el archivo <code>.b4j</code>. InstallerLab lee, sin modificar el código fuente, valores <code>#PackagerProperty</code> como <code>ExeName</code>, <code>IconFile</code>, <code>IncludedModules</code> y <code>Version</code>.'}</p></article>

            <article class="b4j-card"><span class="b4j-step">2</span><h3>${en ? 'Restore project settings' : 'Recupera la configuración'}</h3><p>${en
              ? 'If <code>InstallerLab.confbuilder</code> exists, the saved settings for that project are reused. <strong>Update from project</strong> rereads the B4J properties.'
              : 'Si existe <code>InstallerLab.confbuilder</code>, se reutilizan los valores guardados para ese proyecto. <strong>Update from project</strong> vuelve a leer las propiedades B4J.'}</p></article>

            <article class="b4j-card"><span class="b4j-step">3</span><h3>${en ? 'Detect B4J and the JDK' : 'Detecta B4J y el JDK'}</h3><p>${en
              ? 'InstallerLab locates <code>B4JBuilder.exe</code>, <code>B4JPackager11.jar</code> and a complete JDK with <code>java</code>, <code>jlink</code> and <code>jdeps</code>. Manual B4J and JDK folder buttons are available if automatic detection is not enough.'
              : 'InstallerLab localiza <code>B4JBuilder.exe</code>, <code>B4JPackager11.jar</code> y un JDK completo con <code>java</code>, <code>jlink</code> y <code>jdeps</code>. Si la detección automática no basta, puedes indicar las carpetas manualmente.'}</p></article>

            <article class="b4j-card"><span class="b4j-step">4</span><h3>${en ? 'Compile with official B4J' : 'Compila con B4J oficial'}</h3><p>${en
              ? 'InstallerLab launches <code>B4JBuilder.exe -Task=Build</code>. It does not use a substitute compiler and does not translate the B4J source itself.'
              : 'InstallerLab ejecuta <code>B4JBuilder.exe -Task=Build</code>. No usa un compilador sustituto ni traduce por su cuenta el código B4J.'}</p></article>

            <article class="b4j-card"><span class="b4j-step">5</span><h3>${en ? 'Build the official runtime' : 'Crea el runtime oficial'}</h3><p>${en
              ? 'The compiled JAR is passed to <code>B4JPackager11.jar</code> with the EXE name, icon and Java modules. InstallerLab also makes sure <code>jdk.charsets</code> is present in the module list.'
              : 'El JAR compilado se entrega a <code>B4JPackager11.jar</code> junto con el nombre del EXE, icono y módulos Java. InstallerLab también asegura la presencia de <code>jdk.charsets</code> en la lista de módulos.'}</p></article>

            <article class="b4j-card"><span class="b4j-step">6</span><h3>${en ? 'Apply InstallerLab Launcher V4' : 'Aplica InstallerLab Launcher V4'}</h3><p>${en
              ? 'After official packaging, InstallerLab replaces the outer launcher, writes <code>b4j-launcher.conf</code>, keeps the B4J-generated application launcher under <code>bin</code>, forwards arguments and uses a controlled working directory.'
              : 'Después del empaquetado oficial, InstallerLab sustituye el launcher exterior, escribe <code>b4j-launcher.conf</code>, conserva el launcher de aplicación generado por B4J dentro de <code>bin</code>, reenvía argumentos y usa un directorio de trabajo controlado.'}</p></article>
          </div>

          <div class="b4j-flow" aria-label="${en ? 'Build flow' : 'Flujo de construcción'}">
            <span class="b4j-node">${en ? '.b4j project' : 'Proyecto .b4j'}</span><span class="b4j-arrow">→</span>
            <span class="b4j-node">B4JBuilder</span><span class="b4j-arrow">→</span>
            <span class="b4j-node">JAR</span><span class="b4j-arrow">→</span>
            <span class="b4j-node">B4JPackager11</span><span class="b4j-arrow">→</span>
            <span class="b4j-node">${en ? 'Official runtime' : 'Runtime oficial'}</span><span class="b4j-arrow">→</span>
            <span class="b4j-node">Launcher V4</span><span class="b4j-arrow">→</span>
            <span class="b4j-node">${en ? 'Portable folder' : 'Carpeta portable'}</span>
          </div>
        </section>

        <section class="b4j-section">
          <div class="b4j-callout">
            <h3>${en ? 'The key difference: the B4J runtime is not replaced; the entry layer is.' : 'La diferencia clave: no se reemplaza el runtime de B4J; se reemplaza la capa de entrada.'}</h3>
            <p>${en
              ? 'A package created directly in B4J and one created through InstallerLab begin with the same official compiler and B4JPackager11. The difference appears <strong>after</strong> that official package is produced: InstallerLab keeps the B4J runtime and internal application launcher, but replaces the outer executable with a project-stable Launcher V4 that reads explicit configuration, sets the working directory and forwards arguments. That is why B4J Portable is not simply the B4J package button placed in another UI.'
              : 'Un paquete creado directamente en B4J y otro creado mediante InstallerLab comienzan con el mismo compilador oficial y con B4JPackager11. La diferencia aparece <strong>después</strong> de producirse ese paquete oficial: InstallerLab conserva el runtime y el launcher interno de la aplicación, pero sustituye el ejecutable exterior por un Launcher V4 estable por proyecto que lee una configuración explícita, fija el directorio de trabajo y reenvía argumentos. Por eso B4J Portable no es simplemente el botón de empaquetado de B4J puesto en otra interfaz.'}</p>
          </div>
        </section>

        <section class="b4j-section">
          <div class="b4j-section-head">
            <h2>${en ? 'Direct B4J vs. InstallerLab B4J Portable' : 'B4J directo vs. B4J Portable de InstallerLab'}</h2>
            <p>${en ? 'Both produce a self-contained Windows distribution. InstallerLab adds its own project and launcher architecture on top of the official package.' : 'Ambos producen una distribución autocontenida de Windows. InstallerLab añade su propia arquitectura de proyecto y launcher sobre el paquete oficial.'}</p>
          </div>

          <div class="b4j-compare-wrap">
            <table class="b4j-compare">
              <thead><tr><th>${en ? 'Area' : 'Aspecto'}</th><th>${en ? 'Direct B4J' : 'B4J directamente'}</th><th>InstallerLab B4J Portable</th></tr></thead>
              <tbody>
                <tr><td>${en ? 'Compilation' : 'Compilación'}</td><td>${en ? 'Official B4J.' : 'B4J oficial.'}</td><td><strong>${en ? 'The same official B4JBuilder.' : 'El mismo B4JBuilder oficial.'}</strong></td></tr>
                <tr><td>Runtime</td><td>${en ? 'B4JPackager11 creates the self-contained runtime.' : 'B4JPackager11 crea el runtime autocontenido.'}</td><td><strong>${en ? 'The same B4JPackager11 creates the runtime.' : 'El mismo B4JPackager11 crea el runtime.'}</strong></td></tr>
                <tr><td>${en ? 'Entry EXE' : 'EXE de entrada'}</td><td>${en ? 'Outer launcher from the standard B4J packaging flow.' : 'Launcher exterior del flujo estándar de empaquetado B4J.'}</td><td>${en ? 'InstallerLab replaces that outer launcher with <strong>Launcher V4</strong>.' : 'InstallerLab sustituye ese launcher exterior por <strong>Launcher V4</strong>.'}</td></tr>
                <tr><td>${en ? 'Configuration' : 'Configuración'}</td><td><code>#PackagerProperty</code> + ${en ? 'packager settings' : 'configuración del packager'}.</td><td><code>#PackagerProperty</code> + <code>InstallerLab.confbuilder</code> + <code>b4j-launcher.conf</code>.</td></tr>
                <tr><td>${en ? 'Per-project launcher' : 'Launcher por proyecto'}</td><td>${en ? 'Generated as part of the normal package.' : 'Se genera como parte del paquete normal.'}</td><td>${en ? 'Cached per project and regenerated when its schema or icon changes.' : 'Se guarda en caché por proyecto y se regenera si cambia su esquema o el icono.'}</td></tr>
                <tr><td>${en ? 'Java on target PC' : 'Java en el PC destino'}</td><td>${en ? 'Not required for a correct standalone package.' : 'No es necesario en un paquete standalone correcto.'}</td><td>${en ? 'Also not required; the runtime is still the official B4J packaged runtime.' : 'Tampoco es necesario; el runtime sigue siendo el oficial empaquetado por B4J.'}</td></tr>
                <tr><td>${en ? 'Final format' : 'Formato final'}</td><td>${en ? 'Standalone Windows folder.' : 'Carpeta standalone de Windows.'}</td><td>${en ? 'Portable Windows folder integrated with InstallerLab.' : 'Carpeta portable de Windows integrada con InstallerLab.'}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="b4j-section">
          <div class="b4j-section-head"><h2>${en ? 'What InstallerLab verifies before delivery' : 'Qué verifica InstallerLab antes de entregar la carpeta'}</h2></div>
          <div class="b4j-checks">
            <div class="b4j-check"><b>✓ ${en ? 'Official compile' : 'Compilación oficial'}</b><span>${en ? 'B4JBuilder must finish correctly and produce the project JAR.' : 'B4JBuilder debe terminar correctamente y producir el JAR del proyecto.'}</span></div>
            <div class="b4j-check"><b>✓ ${en ? 'Official package' : 'Empaquetado oficial'}</b><span>${en ? 'B4JPackager11 must create the standalone folder and packaged application launcher.' : 'B4JPackager11 debe crear la carpeta standalone y el launcher empaquetado de la aplicación.'}</span></div>
            <div class="b4j-check"><b>✓ ${en ? 'Final Launcher V4' : 'Launcher V4 final'}</b><span>${en ? 'The final outer EXE is checked after replacement, and a SHA-256 is logged.' : 'Se verifica el EXE exterior final después del reemplazo y se registra su SHA-256.'}</span></div>
          </div>

          <div class="b4j-footer-note">
            <p>${en ? 'For the official standalone packaging behavior and #PackagerProperty options, see the B4JPackager11 reference.' : 'Para el comportamiento oficial del empaquetado standalone y las opciones #PackagerProperty, consulta la referencia de B4JPackager11.'}</p>
            <a class="button" href="${OFFICIAL}" target="_blank" rel="noopener noreferrer">${en ? 'Official B4J reference ↗' : 'Referencia oficial B4J ↗'}</a>
          </div>
        </section>
      </div>`;
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      renderPage();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderPage);
  else renderPage();

  new MutationObserver(schedule).observe(document.documentElement, {childList:true, subtree:true});
})();
