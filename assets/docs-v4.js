(() => {
  if (document.body.dataset.page !== 'docs') return;
  let queued=false;
  const es=()=>((localStorage.getItem('il-lang')||'es').toLowerCase()!=='en');
  const root=()=>location.pathname.includes('/installerlab-web/')?'/installerlab-web/':'/';
  const code=s=>'<div class="docv2-code"><div class="docv2-codebar"><span>FSS</span></div><pre><code>'+s.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</code></pre></div>';

  function apply(){
    const main=document.querySelector('.docv2-main'),side=document.querySelector('.docv2-side');
    if(!main||!side||document.getElementById('doc-v4-marker')) return;
    const spanish=es();
    main.insertAdjacentHTML('afterbegin','<span id="doc-v4-marker" hidden></span>');
    const search=side.querySelector('.docv2-search');
    const nav='<div class="docv2-navgroup"><b>v4.0 · '+(spanish?'Nuevo':'New')+'</b><a href="#v4-overview">'+(spanish?'Resumen v4':'v4 overview')+'</a><a href="#webtoexe-v4">Web-to-EXE</a><a href="#web-builds-v4">'+(spanish?'Targets Web':'Web targets')+'</a><a href="#web-control-v4">'+(spanish?'Control de la web':'Web controls')+'</a><a href="#workspace-v4">'+(spanish?'Workspace v4':'v4 workspace')+'</a></div>';
    if(search) search.insertAdjacentHTML('afterend',nav); else side.insertAdjacentHTML('afterbegin',nav);

    const first=main.querySelector('#v35-overview')||main.querySelector('.docv2-lead')||main.firstElementChild;
    const html=`
    <section id="v4-overview" class="doc35-showcase" data-title="InstallerLab v4">
      <div class="doc35-showcase-grid"><div><span class="docv2-kicker">InstallerLab v4.0</span>
      <h2>${spanish?'De una URL o HTML local a una app de Windows y su instalador, desde el mismo proyecto.':'From a URL or local HTML to a Windows app and its installer, from the same project.'}</h2>
      <p>${spanish?'v4 incorpora <strong>WebToExe</strong> como ProjectType de primera clase. InstallerLab prepara una aplicación basada en WebView2 y después puede producir el ejecutable Web-to-EXE, Setup EXE, MSI o Bundle desde el mismo FSS.':'v4 adds <strong>WebToExe</strong> as a first-class ProjectType. InstallerLab prepares a WebView2-based Windows application and can then produce Web-to-EXE, Setup EXE, MSI or Bundle output from the same FSS.'}</p>
      <div class="doc35-chips"><span>URL → EXE</span><span>Local HTML</span><span>WebView2</span><span>MSI</span><span>Bundle</span></div>
      <p><a class="button primary" href="${root()}web-to-exe/">${spanish?'Guía dedicada Web-to-EXE →':'Dedicated Web-to-EXE guide →'}</a></p>
      </div><div class="doc35-showcase-art"><img loading="lazy" src="../assets/screenshots/app-dark.webp" alt="InstallerLab v4 workspace"></div></div>
    </section>

    <article id="webtoexe-v4" data-title="Web-to-EXE" data-keywords="web to exe website url html WebView2 Windows desktop app">
      <span class="docv2-kicker">v4 · WebToExe ProjectType</span>
      <h2>${spanish?'Una web deja de ser solo contenido para instalar: InstallerLab crea la aplicación de escritorio.':'A website is no longer only content to install: InstallerLab creates the desktop application.'}</h2>
      <p>${spanish?'El proyecto puede apuntar a una URL remota o a una carpeta web local con <code>index.html</code>. El motor prepara el host WebView2, aplica la configuración del proyecto y produce el artefacto solicitado.':'The project can point to a remote URL or a local web folder containing <code>index.html</code>. The engine prepares the WebView2 host, applies project configuration and produces the requested artifact.'}</p>
      ${code('[Setup]\nProjectType=WebToExe\nAppName=My Web App\nAppVersion=1.0.0\n\n[WebApp]\nUrl=https://example.com\nTheme=System\nShowToolbar=True\nBlockPwaInstall=True\nAllowExternalLinks=True')}
      <div class="doc35-note"><strong>${spanish?'No confundir con “Web Installer”:':'Do not confuse with a “Web Installer”:'}</strong> ${spanish?'un Web Installer tradicional descarga recursos de instalación desde Internet. Web-to-EXE crea primero una aplicación Windows basada en la web y luego la empaqueta.':'a traditional Web Installer downloads installation resources from the Internet. Web-to-EXE first creates a Windows application from the web application and then packages it.'}</div>
    </article>

    <article id="web-builds-v4" data-title="${spanish?'Targets Web-to-EXE':'Web-to-EXE targets'}" data-keywords="setup exe msi bundle webview2 prerequisite">
      <span class="docv2-kicker">v4 · Smart Build Targets</span><h2>${spanish?'Una definición WebToExe, varios destinos de Windows.':'One WebToExe definition, multiple Windows destinations.'}</h2>
      <table class="doc35-matrix"><tr><th>Target</th><th>WebToExe</th><th>${spanish?'Comportamiento':'Behavior'}</th></tr>
      <tr><td>Web-to-EXE</td><td>✓</td><td>${spanish?'Ejecutable único mediante el motor Portable interno.':'Single-file output through the internal Portable engine.'}</td></tr>
      <tr><td>Setup EXE</td><td>✓</td><td>${spanish?'Instalador de la aplicación WebView2 autocontenida.':'Installer for the self-contained WebView2 application.'}</td></tr>
      <tr><td>MSI</td><td>✓</td><td>${spanish?'Paquete Windows Installer de la aplicación autocontenida.':'Windows Installer package for the self-contained application.'}</td></tr>
      <tr><td>Bundle</td><td>✓</td><td>${spanish?'Bundle WiX Burn para la misma aplicación autocontenida.':'WiX Burn Bundle for the same self-contained application.'}</td></tr>
      <tr><td>Portable clásico</td><td>—</td><td>Application ProjectType</td></tr>
      <tr><td>B4J Portable</td><td>—</td><td>B4J workflow</td></tr></table>
      <p>${spanish?'WebView2 se distribuye de forma autocontenida con la aplicación generada: el equipo de destino no necesita instalar WebView2 por separado.':'WebView2 is distributed self-contained with the generated application: the destination PC does not need a separate WebView2 installation.'}</p>
    </article>

    <article id="web-modes-v4" data-title="${spanish?'Modo online y offline':'Online and offline modes'}" data-keywords="online offline local html no internet url">
<span class="docv2-kicker">v4.0.0 · Online / Offline</span><h2>${spanish?'Una URL en vivo o una aplicación HTML local autocontenida.':'A live URL or a self-contained local HTML application.'}</h2>
<div class="doc35-feature-grid"><div class="doc35-feature"><h3>Online</h3><p>${spanish?'La app carga una URL remota y recibe los cambios publicados en el servidor sin recompilar.':'The app loads a remote URL and receives server-side updates without rebuilding.'}</p></div><div class="doc35-feature"><h3>Offline / Local</h3><p>${spanish?'HTML, CSS, JavaScript e imágenes pueden viajar dentro de la aplicación. Puede funcionar sin Internet cuando su propia lógica no usa APIs o recursos remotos.':'HTML, CSS, JavaScript and images can travel inside the application. It can work without Internet when its own logic does not call remote APIs or resources.'}</p></div></div>
<div class="doc35-note"><strong>WebView2 self-contained:</strong> ${spanish?'el runtime viaja con la aplicación; no hay que instalar WebView2 aparte.':'the runtime ships with the application; WebView2 does not need to be installed separately.'}</div>
</article>

<article id="web-control-v4" data-title="${spanish?'Control del WebView2':'WebView2 controls'}" data-keywords="theme toolbar PWA external links hide disable css selectors">
      <span class="docv2-kicker">v4 · Web application controls</span><h2>${spanish?'El host puede adaptarse al sitio sin modificar el código fuente de la web.':'The host can adapt to the site without modifying the website source code.'}</h2>
      <div class="doc35-feature-grid">
      <div class="doc35-feature"><h3>Theme</h3><p>System · Light · Dark</p></div>
      <div class="doc35-feature"><h3>${spanish?'Navegación':'Navigation'}</h3><p>${spanish?'Toolbar opcional y enlaces externos al navegador.':'Optional toolbar and external links in the system browser.'}</p></div>
      <div class="doc35-feature"><h3>PWA</h3><p>${spanish?'Puede bloquear el flujo de instalación PWA del sitio dentro del host.':'Can block the website PWA installation flow inside the host.'}</p></div>
      <div class="doc35-feature"><h3>DOM</h3><p>${spanish?'Ocultar o desactivar elementos por ID, clase o selector CSS.':'Hide or disable elements by ID, class or CSS selector.'}</p></div>
      </div>
      <div class="doc35-note"><strong>Community:</strong> ${spanish?'URL → Web-to-EXE básico. <strong>PRO desde US$10:</strong> HTML local, personalización de elementos y targets instalables EXE/MSI/Bundle para una máquina tras verificación.':'basic URL → Web-to-EXE. <strong>PRO from US$10:</strong> local HTML, element customization and installable EXE/MSI/Bundle targets for one machine after verification.'}</div>
    </article>

    <article id="workspace-v4" data-title="${spanish?'Workspace v4':'v4 workspace'}" data-keywords="Monaco project sessions multiple documents fss open with edit menu">
      <span class="docv2-kicker">v4 · Workspace</span><h2>${spanish?'Sesiones de proyecto y editor más coherentes.':'More coherent project sessions and editor workflow.'}</h2>
      <p>${spanish?'Cada proyecto abierto se asocia con su documento Monaco mediante <code>ProjectSession</code>. Al activar un documento, InstallerLab sincroniza el FSS, paneles y targets del proyecto activo. También acepta archivos <code>.fss</code> enviados por Windows al abrir con InstallerLab y evita duplicar una sesión ya abierta.':'Each open project is associated with its Monaco document through <code>ProjectSession</code>. Activating a document synchronizes the active FSS, visual panels and build targets. InstallerLab also accepts <code>.fss</code> files passed by Windows and selects an existing session instead of opening a duplicate.'}</p>
      <p>${spanish?'El menú Edit expone Undo, Redo, Select All, Toggle Comment, Copy, Cut, Paste, Format Document y Format Selection.':'The Edit menu exposes Undo, Redo, Select All, Toggle Comment, Copy, Cut, Paste, Format Document and Format Selection.'}</p>
    </article>`;
    first.insertAdjacentHTML('beforebegin',html);
  }
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();