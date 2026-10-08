(() => {
  const BASE = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  let queued = false;
  const isES = () => ((localStorage.getItem('il-lang') || 'es').toLowerCase() !== 'en');
  const url = p => BASE + p.replace(/^\/+/, '');
  const icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16v16H4z"/><path d="M8 12h8M12 8v8"/></svg>';

  function normalizeVisibleVersion(){
    document.querySelectorAll('h1,h2,h3,p,span,b,strong').forEach(el=>{
      if(el.children.length || el.closest('.release-live,.release-history,.release-history-card')) return;
      const t=el.textContent||'';
      const n=t
        .replace(/InstallerLab v3\.5(?:\.0)?/g,'InstallerLab v4.0.0')
        .replace(/InstallerLab v3\.1(?:\.0)?/g,'InstallerLab v4.0.0')
        .replace(/InstallerLab v3\.0\.0/g,'InstallerLab v4.0.0')
        .replace(/InstallerLab v3\b/g,'InstallerLab v4.0.0');
      if(n!==t) el.textContent=n;
    });
  }

  function ensureCompareNav(){
    const links=document.querySelector('.header .nav .links');
    if(!links) return;
    let a=links.querySelector('[data-v4-compare-nav]');
    if(!a){
      a=document.createElement('a');
      a.dataset.v4CompareNav='1';
      const download=[...links.querySelectorAll('a')].find(x=>/download|descarga/i.test(x.textContent||''));
      if(download) links.insertBefore(a,download); else links.appendChild(a);
    }
    a.href=url('comparison/');
    a.textContent=isES()?'Comparar':'Compare';

    const actions=document.querySelector('.header .nav .actions');
    if(actions){
      let top=actions.querySelector('[data-v4-compare-top]');
      if(!top){
        top=document.createElement('a');
        top.dataset.v4CompareTop='1';
        top.className='button v4-compare-top';
        const primary=actions.querySelector('.button.primary');
        if(primary) actions.insertBefore(top,primary); else actions.appendChild(top);
      }
      top.href=url('comparison/');
      top.textContent=isES()?'Comparar':'Compare';
      top.title=isES()?'Comparar InstallerLab con otras herramientas':'Compare InstallerLab with other tools';
    }
  }

  function ensureBundleCard(){
    if(!['home','features'].includes(document.body.dataset.page)) return;
    const grid=[...document.querySelectorAll('section .grid, main.content .grid')]
      .find(g=>[...g.querySelectorAll('.card h3')].some(h=>/Setup EXE/i.test(h.textContent||'')));
    if(!grid || [...grid.querySelectorAll('.card h3')].some(h=>/^Bundle$/i.test((h.textContent||'').trim()))) return;
    const a=document.createElement('article');
    a.className='card';
    a.dataset.v4Bundle='1';
    a.innerHTML=`${icon}<h3>Bundle</h3><p>${isES()?'WiX Burn para encadenar paquetes y distribuir una experiencia de instalación única.':'WiX Burn for chaining packages into one deployment experience.'}</p>`;
    grid.appendChild(a);
  }

  function homeSpotlight(){
    if(document.body.dataset.page!=='home') return;
    const hero=document.querySelector('.hero');
    if(!hero) return;
    let s=document.getElementById('home-v4-comparison');
    if(!s){
      s=document.createElement('section');
      s.id='home-v4-comparison';
      s.className='v4-spotlight';
      hero.after(s);
    }
    s.innerHTML=isES()?`
      <div class="shell">
        <div class="v4-badge">InstallerLab v4.0.0 · Web-to-EXE</div>
        <div class="v4-head">
          <div>
            <span class="eyebrow">Una diferencia que se ve desde la portada</span>
            <h2>De una web a una app Windows y a su instalador, en el mismo proyecto.</h2>
            <p>InstallerLab v4.0.0 puede trabajar con una URL en vivo o con HTML local. Crea la aplicación Windows con <strong>WebView2 autocontenido</strong>, sin instalar WebView2 aparte, y desde el mismo FSS genera Web-to-EXE, Setup EXE, MSI o Bundle.</p>
          </div>
          <div class="v4-actions"><a class="button primary" href="${url('web-to-exe/')}">Ver Web-to-EXE →</a><a class="button" href="${url('comparison/')}">Comparación completa →</a></div>
        </div>

        <div class="v4-flow">
          <div><b>URL online</b><span>La app refleja cambios del servidor.</span></div>
          <i>o</i>
          <div><b>HTML local</b><span>Interfaz offline si no usa servicios remotos.</span></div>
          <i>→</i>
          <div><b>App Windows</b><span>WebView2 autocontenido.</span></div>
          <i>→</i>
          <div><b>Distribución</b><span>Web-to-EXE · Setup · MSI · Bundle</span></div>
        </div>

        <div class="v4-grid">
          <article><b>Ocultar elementos</b><p>Por ID, clase o selector CSS, sin modificar el código fuente del sitio.</p></article>
          <article><b>Deshabilitar elementos</b><p>Mantén un control visible pero evita que el usuario interactúe con él.</p></article>
          <article><b>Sin instalación extra</b><p>El runtime WebView2 viaja con la aplicación generada.</p></article>
          <article><b>Precio</b><p><strong>Community gratis.</strong> PRO puede solicitarse desde un aporte de <strong>US$10</strong> para una máquina, tras verificación.</p></article>
        </div>

        <div class="v4-matrix-wrap">
          <div class="v4-matrix-title"><b>Comparación rápida</b><span>Fuentes oficiales revisadas en octubre de 2026.</span></div>
          <table class="v4-matrix">
            <thead><tr><th>Capacidad</th><th class="best">InstallerLab v4.0.0</th><th>Inno Setup</th><th>WiX</th><th>Advanced Installer</th><th>NSIS</th><th>InstallShield</th></tr></thead>
            <tbody>
              <tr><td>URL/HTML → app Windows</td><td class="best">✓ Integrado</td><td>?</td><td>?</td><td>◐ Nativefier + empaquetado</td><td>?</td><td>?</td></tr>
              <tr><td>Mismo proyecto: app + EXE/MSI/Bundle</td><td class="best">✓</td><td>?</td><td>?</td><td>◐ pasos separados</td><td>?</td><td>?</td></tr>
              <tr><td>HTML local / UI offline</td><td class="best">✓</td><td>?</td><td>?</td><td>◐ flujo externo</td><td>?</td><td>?</td></tr>
              <tr><td>Ocultar/deshabilitar DOM</td><td class="best">✓ ID · clase · CSS</td><td>?</td><td>?</td><td>?</td><td>?</td><td>?</td></tr>
              <tr><td>Precio base</td><td class="best">Community gratis · PRO desde US$10</td><td>Gratis / OSS</td><td>OSS</td><td>Freeware + planes comerciales</td><td>Gratis / OSS</td><td>Comercial</td></tr>
            </tbody>
          </table>
        </div>
        <p class="v4-note">“?” significa que no se identificó esa función como flujo dedicado en la documentación oficial revisada; no significa que sea técnicamente imposible reproducirla con código o herramientas externas.</p>
      </div>`
      :`
      <div class="shell">
        <div class="v4-badge">InstallerLab v4.0.0 · Web-to-EXE</div>
        <div class="v4-head">
          <div>
            <span class="eyebrow">A difference worth showing on the home page</span>
            <h2>From a website to a Windows app and its installer, in the same project.</h2>
            <p>InstallerLab v4.0.0 can use a live URL or local HTML. It creates the Windows application with a <strong>self-contained WebView2 runtime</strong>, with no separate WebView2 installation, then builds Web-to-EXE, Setup EXE, MSI or Bundle from the same FSS.</p>
          </div>
          <div class="v4-actions"><a class="button primary" href="${url('web-to-exe/')}">Explore Web-to-EXE →</a><a class="button" href="${url('comparison/')}">Full comparison →</a></div>
        </div>

        <div class="v4-flow">
          <div><b>Online URL</b><span>The app follows server-side updates.</span></div>
          <i>or</i>
          <div><b>Local HTML</b><span>Offline UI when no remote services are required.</span></div>
          <i>→</i>
          <div><b>Windows app</b><span>Self-contained WebView2.</span></div>
          <i>→</i>
          <div><b>Deployment</b><span>Web-to-EXE · Setup · MSI · Bundle</span></div>
        </div>

        <div class="v4-grid">
          <article><b>Hide elements</b><p>By ID, class or CSS selector without modifying the website source.</p></article>
          <article><b>Disable elements</b><p>Keep a control visible while preventing user interaction.</p></article>
          <article><b>No extra installation</b><p>The WebView2 runtime ships with the generated application.</p></article>
          <article><b>Price</b><p><strong>Community is free.</strong> PRO can be requested from a <strong>US$10</strong> contribution for one machine after verification.</p></article>
        </div>

        <div class="v4-matrix-wrap">
          <div class="v4-matrix-title"><b>Quick comparison</b><span>Official sources reviewed in October 2026.</span></div>
          <table class="v4-matrix">
            <thead><tr><th>Capability</th><th class="best">InstallerLab v4.0.0</th><th>Inno Setup</th><th>WiX</th><th>Advanced Installer</th><th>NSIS</th><th>InstallShield</th></tr></thead>
            <tbody>
              <tr><td>URL/HTML → Windows app</td><td class="best">✓ Integrated</td><td>?</td><td>?</td><td>◐ Nativefier + packaging</td><td>?</td><td>?</td></tr>
              <tr><td>Same project: app + EXE/MSI/Bundle</td><td class="best">✓</td><td>?</td><td>?</td><td>◐ separate steps</td><td>?</td><td>?</td></tr>
              <tr><td>Local HTML / offline UI</td><td class="best">✓</td><td>?</td><td>?</td><td>◐ external flow</td><td>?</td><td>?</td></tr>
              <tr><td>Hide/disable DOM</td><td class="best">✓ ID · class · CSS</td><td>?</td><td>?</td><td>?</td><td>?</td><td>?</td></tr>
              <tr><td>Base price</td><td class="best">Community free · PRO from US$10</td><td>Free / OSS</td><td>OSS</td><td>Freeware + commercial plans</td><td>Free / OSS</td><td>Commercial</td></tr>
            </tbody>
          </table>
        </div>
        <p class="v4-note">“?” means the feature was not identified as a dedicated workflow in the reviewed official documentation; it does not mean an equivalent outcome is technically impossible through custom code or external tools.</p>
      </div>`;
  }

  function homeHeroComparison(){
    if(document.body.dataset.page!=='home') return;
    const visual=document.querySelector('.hero .visual');
    if(!visual) return;
    let card=visual.querySelector('[data-v4-hero-compare]');
    if(!card){
      card=document.createElement('div');
      card.dataset.v4HeroCompare='1';
      card.className='v4-hero-compare';
      visual.appendChild(card);
    }
    card.innerHTML=isES()?`
      <div class="v4-hero-compare-head">
        <span>Comparación rápida</span>
        <a href="${url('comparison/')}">Ver completa →</a>
      </div>
      <div class="v4-hero-compare-products">
        <b>InstallerLab v4.0.0</b><span>vs</span><span>Inno Setup</span><span>WiX</span><span>Advanced Installer</span><span>NSIS</span><span>InstallShield</span>
      </div>
      <div class="v4-hero-compare-rows">
        <div><span>Web → app Windows</span><strong>✓ Integrado</strong><em>otros: no integrado / externo</em></div>
        <div><span>HTML local / offline</span><strong>✓</strong><em>WebView2 autocontenido</em></div>
        <div><span>App + EXE/MSI/Bundle</span><strong>✓ mismo proyecto</strong><em>FSS</em></div>
        <div><span>Precio</span><strong>Community gratis</strong><em>PRO desde US$10</em></div>
      </div>`
      :`
      <div class="v4-hero-compare-head">
        <span>Quick comparison</span>
        <a href="${url('comparison/')}">View full →</a>
      </div>
      <div class="v4-hero-compare-products">
        <b>InstallerLab v4.0.0</b><span>vs</span><span>Inno Setup</span><span>WiX</span><span>Advanced Installer</span><span>NSIS</span><span>InstallShield</span>
      </div>
      <div class="v4-hero-compare-rows">
        <div><span>Web → Windows app</span><strong>✓ Integrated</strong><em>others: not integrated / external</em></div>
        <div><span>Local HTML / offline</span><strong>✓</strong><em>self-contained WebView2</em></div>
        <div><span>App + EXE/MSI/Bundle</span><strong>✓ same project</strong><em>FSS</em></div>
        <div><span>Price</span><strong>Community free</strong><em>PRO from US$10</em></div>
      </div>`;
  }

  function homeOtherUpdates(){
    if(document.body.dataset.page!=='home') return;
    const lead=document.querySelector('.hero .hero-grid>div>p');
    if(lead) lead.textContent=isES()
      ?'InstallerLab v4.0.0 reúne deployment Windows y Web-to-EXE en un mismo espacio visual: Application, Office Add-ins, QGIS Plugins y aplicaciones web online u offline desde FSS.'
      :'InstallerLab v4.0.0 brings Windows deployment and Web-to-EXE into one visual workspace: Application, Office Add-ins, QGIS Plugins and online/offline web applications from FSS.';
    const strip=document.querySelector('.build-strip');
    if(strip) strip.innerHTML='<i class="ok"></i> InstallerLab v4.0.0 · EXE · Portable · MSI · Bundle · Office · QGIS · Web-to-EXE';
    const actions=document.querySelector('.hero-actions');
    if(actions){
      let compare=actions.querySelector('[data-v4-compare-hero]');
      if(!compare){
        compare=document.createElement('a');
        compare.className='button';
        compare.dataset.v4CompareHero='1';
        actions.appendChild(compare);
      }
      compare.href=url('comparison/');
      compare.textContent=isES()?'Comparar v4 →':'Compare v4 →';
    }
  }

  function ensureSpecialized(){
    if(document.body.dataset.page!=='home') return;
    const app=document.getElementById('app');
    if(!app) return;
    let section=document.getElementById('home-v4-specialized');
    if(!section){
      section=document.createElement('section');
      section.id='home-v4-specialized';
      app.appendChild(section);
    }
    section.innerHTML=isES()?`<div class="shell"><div class="section-head"><span class="eyebrow">ProjectTypes v4.0.0</span><h2>InstallerLab entiende qué estás distribuyendo.</h2></div><div class="grid"><article class="card">${icon}<h3>Application</h3><p>Setup EXE, Portable, B4J Portable, MSI y Bundle.</p></article><article class="card">${icon}<h3>Office Add-in</h3><p>Complementos VBA de Excel, Word y PowerPoint con MSI y Bundle.</p></article><article class="card">${icon}<h3>QGIS Plugin</h3><p>Plugins Python desde carpeta/ZIP con perfil y PluginId.</p></article><article class="card">${icon}<h3>WebToExe</h3><p>URL o HTML local → app Windows autocontenida → Web-to-EXE, Setup, MSI o Bundle.</p><a href="${url('web-to-exe/')}">Ver Web-to-EXE →</a></article></div></div>`
      :`<div class="shell"><div class="section-head"><span class="eyebrow">v4.0.0 ProjectTypes</span><h2>InstallerLab understands what you are deploying.</h2></div><div class="grid"><article class="card">${icon}<h3>Application</h3><p>Setup EXE, Portable, B4J Portable, MSI and Bundle.</p></article><article class="card">${icon}<h3>Office Add-in</h3><p>Excel, Word and PowerPoint VBA add-ins with MSI and Bundle.</p></article><article class="card">${icon}<h3>QGIS Plugin</h3><p>Python plugins from folder/ZIP with profile and PluginId.</p></article><article class="card">${icon}<h3>WebToExe</h3><p>URL or local HTML → self-contained Windows app → Web-to-EXE, Setup, MSI or Bundle.</p><a href="${url('web-to-exe/')}">Explore Web-to-EXE →</a></article></div></div>`;
  }

  function ensureFeatures(){
    if(document.body.dataset.page!=='features') return;
    const p=document.querySelector('.page-hero .shell p');
    if(p) p.textContent=isES()
      ?'InstallerLab v4.0.0 combina Application, Office Add-in, QGIS Plugin y WebToExe con múltiples targets, CLI, SBOM, firma digital, Services, Analytics y FSS.'
      :'InstallerLab v4.0.0 combines Application, Office Add-in, QGIS Plugin and WebToExe projects with multiple targets, CLI, SBOM, signing, Services, Analytics and FSS.';
  }

  function ensureFaqSupport(){
    if(document.body.dataset.page==='faq'){
      const faq=document.querySelector('.faq');
      if(faq&&!faq.querySelector('[data-v4-web-faq]')){
        const d=document.createElement('details');
        d.dataset.v4WebFaq='1';
        d.innerHTML=isES()
          ?'<summary>¿Web-to-EXE necesita instalar WebView2?</summary><p>No. En InstallerLab v4.0.0 el runtime WebView2 se distribuye autocontenido con la aplicación. También puedes usar URL online o HTML local para una interfaz que funcione offline si no depende de servicios remotos.</p>'
          :'<summary>Does Web-to-EXE require a separate WebView2 installation?</summary><p>No. InstallerLab v4.0.0 ships the WebView2 runtime self-contained with the application. You can also use an online URL or local HTML for an offline-capable UI when no remote services are required.</p>';
        faq.appendChild(d);
      }
    }
    if(document.body.dataset.page==='support'){
      document.querySelectorAll('code').forEach(c=>{
        if(c.textContent.includes('Build type:')) c.textContent=c.textContent.replace(/Build type:[^\n]*/,'Build type: Setup EXE / Portable / B4J Portable / MSI / Bundle / Web-to-EXE / Office Add-in / QGIS Plugin');
      });
    }
  }

  function apply(){
    normalizeVisibleVersion();
    ensureCompareNav();
    ensureBundleCard();
    homeOtherUpdates();
    // Comparison is now embedded directly in site.js so it cannot be hidden by cache or render order.
    ensureSpecialized();
    ensureFeatures();
    ensureFaqSupport();
  }
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',schedule); else schedule();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();