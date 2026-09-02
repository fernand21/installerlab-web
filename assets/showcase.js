(() => {
  const app = document.querySelector('#app');
  if (!app || document.body.dataset.page !== 'home') return;
  app.insertAdjacentHTML('beforeend', `
    <section class="showcase" aria-labelledby="themes-showcase-title">
      <div class="shell showcase-grid">
        <div>
          <span class="eyebrow">Visual themes</span>
          <h2 id="themes-showcase-title">A visual installer that looks like your product.</h2>
          <p>Choose an InstallerLab theme, adjust its presentation and preview the result before building the installer.</p>
          <ul class="showcase-list">
            <li>Community and PRO theme catalog</li>
            <li>Theme variants and custom accent where supported</li>
            <li>Brand image, background image and opacity controls</li>
          </ul>
          <a class="button" href="docs/#themes">Explore theme documentation →</a>
        </div>
        <figure class="product-shot">
          <img src="assets/screenshots/themes-panel.png" alt="InstallerLab Visual Themes panel with theme cards and installer preview" loading="lazy">
        </figure>
      </div>
    </section>`);
})();
