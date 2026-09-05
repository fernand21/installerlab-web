(() => {
  if (document.body.dataset.page !== 'home') return;

  const visual = document.querySelector('.hero .visual');
  if (!visual) return;

  const shots = {
    dark: {
      src: 'assets/screenshots/app-dark.webp',
      fallback: 'assets/screenshots/app-dark.png',
      alt: 'InstallerLab Pro application interface in dark mode',
      label: 'Dark'
    },
    light: {
      src: 'assets/screenshots/app-light.webp',
      fallback: 'assets/screenshots/app-light.png',
      alt: 'InstallerLab Pro application interface in light mode',
      label: 'Light'
    }
  };

  let active = 'dark';

  visual.innerHTML = `
    <div class="app-preview" aria-label="InstallerLab Pro application preview">
      <div class="app-preview-head">
        <div class="app-preview-title">
          <span class="app-preview-kicker">InstallerLab Pro</span>
          <strong>Real application interface</strong>
        </div>
        <div class="app-preview-tabs" role="tablist" aria-label="Application appearance">
          <button type="button" role="tab" aria-selected="true" data-app-shot="dark"><span class="app-preview-dot" aria-hidden="true"></span>Dark</button>
          <button type="button" role="tab" aria-selected="false" data-app-shot="light"><span class="app-preview-dot" aria-hidden="true"></span>Light</button>
        </div>
      </div>
      <button class="app-shot-frame" type="button" aria-label="Open InstallerLab Pro dark mode screenshot">
        <img class="app-shot" src="${shots.dark.src}" alt="${shots.dark.alt}" decoding="async" fetchpriority="high">
      </button>
      <div class="app-preview-meta" aria-hidden="true">
        <span class="current"><span class="app-preview-status"></span>Current InstallerLab Pro UI</span>
        <span class="app-preview-hint">Click the screenshot to enlarge</span>
      </div>
    </div>`;

  const image = visual.querySelector('.app-shot');
  const frame = visual.querySelector('.app-shot-frame');
  const tabs = [...visual.querySelectorAll('[data-app-shot]')];

  image.addEventListener('error', () => {
    const fallback = shots[active].fallback;
    if (!image.src.endsWith(fallback)) image.src = fallback;
  });

  const preload = new Image();
  preload.src = shots.light.src;

  const selectShot = key => {
    if (!shots[key]) return;
    active = key;
    image.src = shots[key].src;
    image.alt = shots[key].alt;
    frame.setAttribute('aria-label', `Open InstallerLab Pro ${shots[key].label.toLowerCase()} mode screenshot`);
    tabs.forEach(tab => tab.setAttribute('aria-selected', String(tab.dataset.appShot === key)));
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => selectShot(tab.dataset.appShot));
    tab.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const next = active === 'dark' ? 'light' : 'dark';
      selectShot(next);
      tabs.find(item => item.dataset.appShot === next)?.focus();
    });
  });

  const openLightbox = () => {
    const previousFocus = document.activeElement;
    const dialog = document.createElement('div');
    dialog.className = 'app-lightbox';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', `InstallerLab Pro ${shots[active].label.toLowerCase()} mode screenshot`);
    dialog.innerHTML = `<button class="app-lightbox-close" type="button" aria-label="Close screenshot">×</button><div class="app-lightbox-inner"><img src="${image.src}" alt="${image.alt}"></div>`;
    document.body.appendChild(dialog);

    const closeButton = dialog.querySelector('.app-lightbox-close');
    const close = () => {
      document.removeEventListener('keydown', onKeydown);
      dialog.remove();
      previousFocus?.focus?.();
    };
    const onKeydown = event => {
      if (event.key === 'Escape') close();
    };

    dialog.addEventListener('click', event => {
      if (event.target === dialog) close();
    });
    closeButton.addEventListener('click', close);
    document.addEventListener('keydown', onKeydown);
    closeButton.focus();
  };

  frame.addEventListener('click', openLightbox);
})();
