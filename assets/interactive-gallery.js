(() => {
  if (document.body.dataset.page !== 'home') return;
  document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="assets/gallery-overrides.css">');
  document.querySelectorAll('[href^="/"], [src^="/"]').forEach(element => {
    const attribute = element.hasAttribute('href') ? 'href' : 'src';
    element.setAttribute(attribute, element.getAttribute(attribute).replace(/^\//, ''));
  });
  const visual = document.querySelector('.hero .visual');
  if (visual) {
    visual.innerHTML = `<div class="app-switch" aria-label="InstallerLab appearance preview"><div class="app-tabs" role="tablist"><button type="button" role="tab" aria-selected="true" data-shot="dark">VS Dark · InstallerLab</button><button type="button" role="tab" aria-selected="false" data-shot="light">VS Light · InstallerLab</button></div><img class="app-shot" src="assets/screenshots/app-dark.png" alt="InstallerLab application — VS Dark theme"></div>`;
    const image = visual.querySelector('img');
    visual.querySelectorAll('[data-shot]').forEach(button => button.addEventListener('click', () => {
      const dark = button.dataset.shot === 'dark';
      image.src = `assets/screenshots/app-${dark ? 'dark' : 'light'}.png`;
      image.alt = `InstallerLab application — ${dark ? 'VS Dark' : 'VS Light'} theme`;
      visual.querySelectorAll('[data-shot]').forEach(item => item.setAttribute('aria-selected', String(item === button)));
    }));
  }
  const themes = {community:['Azure','CompactClassic','Corporate','FluentLight','Graphite','ModernDark','Serene','Surface'],pro:['AeroGlass','Blueprint','CosmicGlow','GeometricPro','HeroBanner','NeonFlow','PaperLight','SidebarWizard','SilkLight','StudioCard','Vivid','WaveFlow']};
  const name = value => value.replace(/([A-Z])/g, ' $1').trim();
  const tiles = Object.entries(themes).flatMap(([tier, items]) => items.map(item => `<article class="theme-tile" data-tier="${tier}"><img loading="lazy" src="assets/themes/${tier}/${item}.svg" alt="${name(item)} installer theme preview"><div><strong>${name(item)}</strong><span>${tier === 'community' ? 'Free' : 'PRO'}</span></div></article>`)).join('');
  document.querySelector('#app').insertAdjacentHTML('beforeend', `<section class="theme-catalog" aria-labelledby="catalog-title"><div class="shell"><span class="eyebrow">Theme catalog</span><h2 id="catalog-title">Choose the visual language of your installer.</h2><p>Explore all 20 real SVG previews from the InstallerLab catalog. Community themes are free; PRO themes require licensing.</p><div class="catalog-toolbar" role="group" aria-label="Filter themes"><button class="active" data-filter="all">All · 20</button><button data-filter="community">Community · 8</button><button data-filter="pro">PRO · 12</button></div><div class="theme-grid">${tiles}</div></div></section>`);
  const silkLightPreview = document.querySelector('img[alt="Silk Light installer theme preview"]');
  if (silkLightPreview) silkLightPreview.src = 'assets/screenshots/silk-light.png';
  const waveFlowPreview = document.querySelector('img[alt="Wave Flow installer theme preview"]');
  if (waveFlowPreview) waveFlowPreview.src = 'assets/screenshots/wave-flow.png';
  const aeroGlassPreview = document.querySelector('img[alt="Aero Glass installer theme preview"]');
  if (aeroGlassPreview) aeroGlassPreview.src = 'assets/screenshots/aero-glass.png';
  const azurePreview = document.querySelector('img[alt="Azure installer theme preview"]');
  if (azurePreview) azurePreview.src = 'assets/screenshots/azure.png';
  const compactClassicPreview = document.querySelector('img[alt="Compact Classic installer theme preview"]');
  if (compactClassicPreview) compactClassicPreview.src = 'assets/screenshots/compact-classic.png';
  const corporatePreview = document.querySelector('img[alt="Corporate installer theme preview"]');
  if (corporatePreview) corporatePreview.src = 'assets/screenshots/corporate.png';
  const fluentLightPreview = document.querySelector('img[alt="Fluent Light installer theme preview"]');
  if (fluentLightPreview) fluentLightPreview.src = 'assets/screenshots/fluent-light.png';
  const graphitePreview = document.querySelector('img[alt="Graphite installer theme preview"]');
  if (graphitePreview) graphitePreview.src = 'assets/screenshots/graphite.png';
  const modernDarkPreview = document.querySelector('img[alt="Modern Dark installer theme preview"]');
  if (modernDarkPreview) modernDarkPreview.src = 'assets/screenshots/modern-dark.png';
  const serenePreview = document.querySelector('img[alt="Serene installer theme preview"]');
  if (serenePreview) serenePreview.src = 'assets/screenshots/serene.png';
  const surfacePreview = document.querySelector('img[alt="Surface installer theme preview"]');
  if (surfacePreview) surfacePreview.src = 'assets/screenshots/surface.png';
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => { const filter = button.dataset.filter; document.querySelectorAll('.theme-tile').forEach(tile => tile.hidden = filter !== 'all' && tile.dataset.tier !== filter); document.querySelectorAll('[data-filter]').forEach(item => item.classList.toggle('active', item === button)); }));
  document.querySelectorAll('.theme-tile').forEach(tile => { tile.tabIndex = 0; const open = () => { const image = tile.querySelector('img'); const title = tile.querySelector('strong').textContent; document.body.insertAdjacentHTML('beforeend', `<div class="theme-dialog" role="dialog" aria-modal="true" aria-label="${title} preview"><div class="theme-dialog-card"><button class="theme-dialog-close" aria-label="Close preview">×</button><img src="${image.src}" alt="${image.alt}"><h3>${title}</h3></div></div>`); const dialog = document.querySelector('.theme-dialog'); const close = () => dialog.remove(); dialog.querySelector('.theme-dialog-close').onclick = close; dialog.onclick = event => { if (event.target === dialog) close(); }; document.onkeydown = event => { if (event.key === 'Escape') close(); }; }; tile.onclick = open; tile.onkeydown = event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } }; });
})();
