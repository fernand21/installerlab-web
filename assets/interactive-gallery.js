(() => {
  if (document.body.dataset.page !== 'home') return;

  document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="assets/gallery-overrides.css">');
  document.querySelectorAll('[href^="/"], [src^="/"]').forEach(element => {
    const attribute = element.hasAttribute('href') ? 'href' : 'src';
    element.setAttribute(attribute, element.getAttribute(attribute).replace(/^\//, ''));
  });

  const visual = document.querySelector('.hero .visual');
  if (visual) {
    visual.innerHTML = `<div class="app-switch" aria-label="InstallerLab appearance preview">
      <div class="app-tabs" role="tablist">
        <button type="button" role="tab" aria-selected="true" data-shot="dark">VS Dark · InstallerLab</button>
        <button type="button" role="tab" aria-selected="false" data-shot="light">VS Light · InstallerLab</button>
      </div>
      <img class="app-shot" src="assets/screenshots/app-dark.png" alt="InstallerLab application — VS Dark theme">
    </div>`;
    const image = visual.querySelector('img');
    visual.querySelectorAll('[data-shot]').forEach(button => button.addEventListener('click', () => {
      const dark = button.dataset.shot === 'dark';
      image.src = `assets/screenshots/app-${dark ? 'dark' : 'light'}.png`;
      image.alt = `InstallerLab application — ${dark ? 'VS Dark' : 'VS Light'} theme`;
      visual.querySelectorAll('[data-shot]').forEach(item => item.setAttribute('aria-selected', String(item === button)));
    }));
  }

  const catalog = [
    ['Azure','Azure','free','community','azure','Fluent'],
    ['CanvasLight','Canvas Light','free','free','canvas-light','Editorial'],
    ['CompactClassic','Compact Classic','free','community','compact-classic','Technical'],
    ['Corporate','Corporate','free','community','corporate','Business'],
    ['FluentLight','Fluent Light','free','community','fluent-light','Fluent'],
    ['FocusLight','Focus Light','free','free','focus-light','Minimal'],
    ['Graphite','Graphite','free','community','graphite','Dark'],
    ['ModernDark','Modern Dark','free','community','modern-dark','Dark'],
    ['NewFlow','New Flow','free','free','new-flow','Dark'],
    ['Serene','Serene','free','community','serene','Soft'],
    ['Surface','Surface','free','free','surface','Fluent'],
    ['AeroGlass','Aero Glass','pro','pro','aero-glass','Glass'],
    ['AuroraDaylight','Aurora Daylight','pro','pro','aurora-daylight','Editorial'],
    ['AuroraPro','Aurora Pro','pro','pro','aurora-pro','Aurora'],
    ['Blueprint','Blueprint','pro','pro','blueprint','Technical'],
    ['BlueprintStudio','Blueprint Studio','pro','pro','blueprint-studio','Technical'],
    ['CosmicGlow','Cosmic Glow','pro','pro','cosmic-glow','Glow'],
    ['GeometricPro','Geometric Pro','pro','pro','geometric-pro','Technical'],
    ['GlassPro','Glass Pro','pro','pro','glass-pro','Glass'],
    ['HeroBanner','Hero Banner','pro','pro','hero-banner','Product'],
    ['Launchpad','Launchpad','pro','pro','launchpad','Product'],
    ['MidnightPro','Midnight Pro','pro','pro','midnight-pro','Dark'],
    ['NeonFlow','Neon Flow','pro','pro','neon-flow','Product'],
    ['Orbit','Orbit','pro','pro','orbit','Product'],
    ['PaperLight','Paper Light','pro','pro','paper-light','Editorial'],
    ['ProductDelivery','Product Delivery','pro','pro','product-delivery','Product'],
    ['SidebarWizard','Sidebar Wizard','pro','pro','sidebar-wizard','Technical'],
    ['SilkLight','Silk Light','pro','pro','silk-light','Minimal'],
    ['SoftwareStage','Software Stage','pro','pro','software-stage','Technical'],
    ['StudioCard','Studio Card','pro','pro','studio-card','Fluent'],
    ['Vivid','Vivid','pro','pro','vivid','Glow'],
    ['WaveFlow','Wave Flow','pro','pro','wave-flow','Product']
  ].map(([id,name,tier,folder,slug,style]) => ({
    id,name,tier,folder,slug,style,
    screenshot:`assets/screenshots/${slug}.png`,
    fallback:`assets/themes/${folder}/${id}.svg`
  }));

  const tiles = catalog.map(theme => `<article class="theme-tile" data-tier="${theme.tier}" data-style="${theme.style}" tabindex="0" aria-label="Open ${theme.name} preview">
    <div class="theme-shot-wrap">
      <img loading="lazy" decoding="async" src="${theme.screenshot}" data-fallback="${theme.fallback}" alt="${theme.name} installer theme preview">
      <span class="theme-style">${theme.style}</span>
    </div>
    <div class="theme-tile-meta"><strong>${theme.name}</strong><span class="theme-tier ${theme.tier}">${theme.tier === 'free' ? 'Free' : 'PRO'}</span></div>
  </article>`).join('');

  document.querySelector('#app').insertAdjacentHTML('beforeend', `<section class="theme-catalog" aria-labelledby="catalog-title">
    <div class="shell">
      <span class="eyebrow">Theme catalog</span>
      <h2 id="catalog-title">32 installer identities. One engine.</h2>
      <p>Explore the complete InstallerLab catalog. Every preview is backed by the real theme artwork and installer layout, with Free and PRO options designed for different product personalities.</p>
      <div class="catalog-toolbar" role="group" aria-label="Filter themes">
        <button class="active" data-filter="all">All · ${catalog.length}</button>
        <button data-filter="free">Free · ${catalog.filter(x => x.tier === 'free').length}</button>
        <button data-filter="pro">PRO · ${catalog.filter(x => x.tier === 'pro').length}</button>
      </div>
      <div class="theme-grid">${tiles}</div>
    </div>
  </section>`);

  document.querySelectorAll('.theme-tile img').forEach(image => {
    image.addEventListener('error', () => {
      if (image.dataset.fallback && image.src !== image.dataset.fallback) image.src = image.dataset.fallback;
    }, {once:true});
  });

  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('.theme-tile').forEach(tile => tile.hidden = filter !== 'all' && tile.dataset.tier !== filter);
    document.querySelectorAll('[data-filter]').forEach(item => item.classList.toggle('active', item === button));
  }));

  const openPreview = tile => {
    const image = tile.querySelector('img');
    const title = tile.querySelector('strong').textContent;
    const tier = tile.dataset.tier === 'free' ? 'Free' : 'PRO';
    const style = tile.dataset.style;
    document.body.insertAdjacentHTML('beforeend', `<div class="theme-dialog" role="dialog" aria-modal="true" aria-labelledby="theme-dialog-title">
      <div class="theme-dialog-card">
        <button class="theme-dialog-close" aria-label="Close preview">×</button>
        <div class="theme-dialog-visual"><img src="${image.src}" alt="${image.alt}"></div>
        <div class="theme-dialog-meta"><div><span>${style} · ${tier}</span><h3 id="theme-dialog-title">${title}</h3></div><small>InstallerLab theme preview</small></div>
      </div>
    </div>`);
    const dialog = document.querySelector('.theme-dialog');
    const close = () => { document.removeEventListener('keydown', keyClose); dialog.remove(); tile.focus(); };
    const keyClose = event => { if (event.key === 'Escape') close(); };
    dialog.querySelector('.theme-dialog-close').onclick = close;
    dialog.onclick = event => { if (event.target === dialog) close(); };
    document.addEventListener('keydown', keyClose);
    dialog.querySelector('.theme-dialog-close').focus();
  };

  document.querySelectorAll('.theme-tile').forEach(tile => {
    tile.onclick = () => openPreview(tile);
    tile.onkeydown = event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPreview(tile); }
    };
  });
})();
