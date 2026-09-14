(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const icons = {
    overview: `
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/>
      <rect x="13.5" y="3.5" width="7" height="4.5" rx="1.6"/>
      <rect x="13.5" y="10.5" width="7" height="10" rx="1.6"/>
      <rect x="3.5" y="13" width="7" height="7.5" rx="1.6"/>`,

    activity: `
      <path d="M4 18.5h16"/>
      <path d="M6 15.5V11"/>
      <path d="M11 15.5V7.5"/>
      <path d="M16 15.5V4.5"/>
      <path d="m5 8 4-3 4 2 6-4"/>
      <path d="M16.5 3H19v2.5"/>`,

    users: `
      <circle cx="9" cy="8" r="3.25"/>
      <path d="M3.5 20v-1.5A5.5 5.5 0 0 1 9 13h0a5.5 5.5 0 0 1 5.5 5.5V20"/>
      <path d="M16 6.2a3 3 0 0 1 0 5.6"/>
      <path d="M16.5 14.3a4.8 4.8 0 0 1 4 4.7v1"/>`,

    environment: `
      <rect x="3" y="4" width="18" height="13" rx="2.2"/>
      <path d="M8 21h8"/>
      <path d="M12 17v4"/>
      <path d="M7 8h4M7 11h7"/>`,

    requirements: `
      <rect x="5" y="4" width="14" height="17" rx="2"/>
      <path d="M9 4.5V3h6v1.5"/>
      <path d="m8.5 10 1.8 1.8 3.2-3.6"/>
      <path d="M14.5 10h2"/>
      <path d="m8.5 15 1.8 1.8 3.2-3.6"/>
      <path d="M14.5 15h2"/>`,

    errors: `
      <path d="M10.2 3.5 2.5 17.2A2.1 2.1 0 0 0 4.3 20.5h15.4a2.1 2.1 0 0 0 1.8-3.3L13.8 3.5a2.05 2.05 0 0 0-3.6 0Z"/>
      <path d="M12 8.5v5"/>
      <path d="M12 17h.01"/>`,

    uninstall: `
      <path d="M4 8.5 12 4l8 4.5-8 4.5-8-4.5Z"/>
      <path d="M4 8.5V16l8 4 8-4V8.5"/>
      <path d="M12 13v7"/>
      <path d="m8.5 15.5 3.5 3.5 3.5-3.5"/>`,

    launch: `
      <circle cx="12" cy="12" r="9"/>
      <path d="m10 8.2 5.7 3.8-5.7 3.8V8.2Z"/>
      <path d="M18.5 5.5 20 4"/>`,

    properties: `
      <path d="M4 7h9"/><path d="M17 7h3"/>
      <circle cx="15" cy="7" r="2"/>
      <path d="M4 12h3"/><path d="M11 12h9"/>
      <circle cx="9" cy="12" r="2"/>
      <path d="M4 17h8"/><path d="M16 17h4"/>
      <circle cx="14" cy="17" r="2"/>`,

    versions: `
      <path d="m12 3 8 4-8 4-8-4 8-4Z"/>
      <path d="m4 12 8 4 8-4"/>
      <path d="m4 17 8 4 8-4"/>`,

    reports: `
      <path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/>
      <path d="M14 3v5h5"/>
      <path d="M8 16v-3M12 16v-6M16 16v-4"/>`,

    settings: `
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.7 1.7 0 0 0 .35 1.9l.05.05-2.85 2.85-.05-.05A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.9.35l-.05.05-2.85-2.85.05-.05A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.1A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.35-1.9l-.05-.05L7.05 3.8l.05.05A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1a1.7 1.7 0 0 0 1.6 1.5 1.7 1.7 0 0 0 1.9-.35l.05-.05 2.85 2.85-.05.05A1.7 1.7 0 0 0 19.4 9c.15.36.36.68.6 1 .28.3.67.47 1.1.5h.1v4h-.1a1.7 1.7 0 0 0-1.7.5Z"/>`
  };

  const svg = key => `<svg class="iax-nav-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[key] || icons.overview}</svg>`;

  function installStyle() {
    if (document.getElementById('iax-nav-icon-style')) return;
    const style = document.createElement('style');
    style.id = 'iax-nav-icon-style';
    style.textContent = `
      .iax-sidebar nav button > i.iax-nav-icon {
        width: 26px;
        height: 26px;
        min-width: 26px;
        display: inline-grid;
        place-items: center;
        border-radius: 8px;
        color: #63bcff;
        font-style: normal;
        line-height: 1;
        transition: color .18s ease, background .18s ease, border-color .18s ease, transform .18s ease, filter .18s ease;
      }
      .iax-sidebar nav button > i.iax-nav-icon .iax-nav-svg {
        width: 19px;
        height: 19px;
        display: block;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.75;
        stroke-linecap: round;
        stroke-linejoin: round;
        vector-effect: non-scaling-stroke;
      }
      .iax-sidebar nav button:hover > i.iax-nav-icon {
        color: #8bd2ff;
        background: rgba(69, 174, 255, .08);
        transform: translateY(-1px);
      }
      .iax-sidebar nav button.active > i.iax-nav-icon {
        color: #57c3ff;
        background: rgba(48, 166, 255, .13);
        box-shadow: inset 0 0 0 1px rgba(82, 188, 255, .16);
        filter: drop-shadow(0 0 5px rgba(69, 184, 255, .18));
      }
    `;
    document.head.appendChild(style);
  }

  function applyIcons() {
    installStyle();
    document.querySelectorAll('.iax-sidebar nav button').forEach(button => {
      const holder = button.querySelector('i');
      if (!holder) return;
      const key = button.dataset.target || 'overview';
      const markup = svg(key);
      holder.classList.add('iax-nav-icon');
      if (holder.innerHTML !== markup) holder.innerHTML = markup;
    });
  }

  const schedule = () => requestAnimationFrame(applyIcons);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }

  document.addEventListener('click', event => {
    if (event.target.closest('.iax-sidebar nav button')) setTimeout(applyIcons, 0);
  });

  document.addEventListener('change', event => {
    if (event.target.closest('.lang')) {
      setTimeout(applyIcons, 0);
      setTimeout(applyIcons, 120);
    }
  });

  window.addEventListener('installerlab:analytics-summary', schedule);
})();
