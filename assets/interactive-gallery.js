(() => {
  if (document.body.dataset.page !== 'home') return;
  document.querySelectorAll('[href^="/"], [src^="/"]').forEach(element => {
    const attribute = element.hasAttribute('href') ? 'href' : 'src';
    element.setAttribute(attribute, element.getAttribute(attribute).replace(/^\//, ''));
  });
  const visual = document.querySelector('.hero .visual');
  if (visual) {
    visual.innerHTML = `<div class="app-switch" aria-label="InstallerLab appearance preview"><div class="app-tabs" role="tablist"><button type="button" role="tab" aria-selected="true" data-shot="dark">Dark interface</button><button type="button" role="tab" aria-selected="false" data-shot="light">Light interface</button></div><img class="app-shot" src="assets/screenshots/app-dark.png" alt="InstallerLab application in dark interface"></div>`;
    const image = visual.querySelector('img');
    visual.querySelectorAll('[data-shot]').forEach(button => button.addEventListener('click', () => {
      const dark = button.dataset.shot === 'dark';
      image.src = `assets/screenshots/app-${dark ? 'dark' : 'light'}.png`;
      image.alt = `InstallerLab application in ${dark ? 'dark' : 'light'} interface`;
      visual.querySelectorAll('[data-shot]').forEach(item => item.setAttribute('aria-selected', String(item === button)));
    }));
  }
  const themes = {community:['Azure','CompactClassic','Corporate','FluentLight','Graphite','ModernDark','Serene','Surface'],pro:['AeroGlass','Blueprint','CosmicGlow','GeometricPro','HeroBanner','NeonFlow','PaperLight','SidebarWizard','SilkLight','StudioCard','Vivid','WaveFlow']};
  const name = value => value.replace(/([A-Z])/g, ' $1').trim();
  const tiles = Object.entries(themes).flatMap(([tier, items]) => items.map(item => `<article class="theme-tile" data-tier="${tier}"><img loading="lazy" src="assets/themes/${tier}/${item}.svg" alt="${name(item)} installer theme preview"><div><strong>${name(item)}</strong><span>${tier === 'community' ? 'Free' : 'PRO'}</span></div></article>`)).join('');
  document.querySelector('#app').insertAdjacentHTML('beforeend', `<section class="theme-catalog" aria-labelledby="catalog-title"><div class="shell"><span class="eyebrow">Theme catalog</span><h2 id="catalog-title">Choose the visual language of your installer.</h2><p>Explore all 20 real SVG previews from the InstallerLab catalog. Community themes are free; PRO themes require licensing.</p><div class="catalog-toolbar" role="group" aria-label="Filter themes"><button class="active" data-filter="all">All · 20</button><button data-filter="community">Community · 8</button><button data-filter="pro">PRO · 12</button></div><div class="theme-grid">${tiles}</div></div></section>`);
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => { const filter = button.dataset.filter; document.querySelectorAll('.theme-tile').forEach(tile => tile.hidden = filter !== 'all' && tile.dataset.tier !== filter); document.querySelectorAll('[data-filter]').forEach(item => item.classList.toggle('active', item === button)); }));
})();
