(() => {
  const API = 'https://api.github.com/repos/fernand21/installerlab-web/releases?per_page=100';
  const RELEASES = 'https://github.com/fernand21/installerlab-web/releases';
  const FALLBACK = {
    tag_name: 'v1.0.0',
    name: 'InstallerLab v1.0.0 — First Public Release',
    html_url: 'https://github.com/fernand21/installerlab-web/releases/tag/v1.0.0',
    published_at: '2026-09-04T21:28:31Z',
    assets: [
      { name:'InstallerLab-Setup.exe', size:415354880, download_count:0, digest:'sha256:013ad2942dc0d31c5ad7bf9f23754216c4049d74ba657c771fb7d9812412b761', browser_download_url:'https://github.com/fernand21/installerlab-web/releases/download/v1.0.0/InstallerLab-Setup.exe' },
      { name:'InstallerLab-Setup.msi', size:307204836, download_count:0, digest:'sha256:052ad716261de56cf62cdbd3c21334891ef50d18a7c9fe3c7015283b1f46c814', browser_download_url:'https://github.com/fernand21/installerlab-web/releases/download/v1.0.0/InstallerLab-Setup.msi' },
      { name:'InstallerLab_Portable.exe', size:314655744, download_count:0, digest:'sha256:992d5e86722b3532573962cc833eddf5bba8401a511673b4a16e7ec07db40ebd', browser_download_url:'https://github.com/fernand21/installerlab-web/releases/download/v1.0.0/InstallerLab_Portable.exe' }
    ]
  };
  let dataPromise = null;
  let queued = false;

  const lang = () => (localStorage.getItem('il-lang') || 'es').toLowerCase() === 'en' ? 'en' : 'es';
  const fmt = n => new Intl.NumberFormat(lang()).format(Number(n || 0));
  const size = n => n ? `${(n / 1024 / 1024).toFixed(2)} MB` : '—';
  const date = value => value ? new Intl.DateTimeFormat(lang(), { year:'numeric', month:'long', day:'numeric' }).format(new Date(value)) : '';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const isPortable = a => /portable/i.test(a.name || '') && /\.exe$/i.test(a.name || '');
  const isMsi = a => /\.msi$/i.test(a.name || '');
  const isSetup = a => /\.exe$/i.test(a.name || '') && !isPortable(a);

  function getData() {
    if (dataPromise) return dataPromise;
    dataPromise = fetch(API, { headers:{ Accept:'application/vnd.github+json' } })
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`GitHub API ${r.status}`)))
      .then(list => {
        const published = (Array.isArray(list) ? list : []).filter(r => !r.draft && !r.prerelease);
        if (!published.length) throw new Error('No published releases');
        return { releases:published, live:true };
      })
      .catch(() => ({ releases:[FALLBACK], live:false }));
    return dataPromise;
  }

  function stats(releases) {
    const out = { total:0, setup:0, portable:0, msi:0 };
    releases.forEach(release => (release.assets || []).forEach(asset => {
      const count = Number(asset.download_count || 0);
      out.total += count;
      if (isPortable(asset)) out.portable += count;
      else if (isMsi(asset)) out.msi += count;
      else if (isSetup(asset)) out.setup += count;
    }));
    return out;
  }

  function digest(asset) {
    return asset?.digest ? asset.digest.replace(/^sha256:/i,'') : '';
  }

  function downloadCard(asset, type, title, copy, count, recommended=false) {
    if (!asset) return '';
    const l = lang();
    return `<article class="release-card${recommended ? ' recommended' : ''}">
      ${recommended ? `<span class="tag">${l === 'es' ? 'RECOMENDADO' : 'RECOMMENDED'}</span>` : ''}
      <div class="file-type">${type}</div>
      <h3>${title}</h3>
      <p>${copy}</p>
      <div class="release-meta">
        <span>${l === 'es' ? 'Archivo' : 'File'} <strong>${esc(asset.name)}</strong></span>
        <span>${l === 'es' ? 'Tamaño' : 'Size'} <strong>${size(asset.size)}</strong></span>
        <span>${l === 'es' ? 'Descargas' : 'Downloads'} <strong>↓ ${fmt(count)}</strong></span>
      </div>
      <a class="release-download" href="${esc(asset.browser_download_url)}">${l === 'es' ? 'Descargar directamente' : 'Direct download'} ↓</a>
      ${digest(asset) ? `<div class="release-hash" title="SHA-256">SHA-256 · ${digest(asset)}</div>` : ''}
    </article>`;
  }

  function renderDownload(releases, live) {
    if (document.body.dataset.page !== 'download') return;
    const main = document.querySelector('main.content');
    if (!main || main.dataset.releaseLive === '1') return;
    main.dataset.releaseLive = '1';
    const current = releases[0] || FALLBACK;
    const st = stats(releases);
    const setup = (current.assets || []).find(isSetup);
    const portable = (current.assets || []).find(isPortable);
    const msi = (current.assets || []).find(isMsi);
    const l = lang();
    const hero = document.querySelector('.page-hero .shell');
    if (hero) hero.innerHTML = l === 'es'
      ? `<span class="eyebrow">Descargas</span><h1>InstallerLab ${esc(current.tag_name)}</h1><p>Elige el formato que necesitas. Los botones descargan directamente los archivos oficiales publicados en GitHub Releases.</p>`
      : `<span class="eyebrow">Downloads</span><h1>InstallerLab ${esc(current.tag_name)}</h1><p>Choose the format you need. The buttons download the official files directly from GitHub Releases.</p>`;

    main.innerHTML = `<div class="release-live">
      <section class="release-hero">
        <div class="release-panel">
          <span class="release-kicker"><i></i>${l === 'es' ? 'Versión pública actual' : 'Current public release'}</span>
          <h2>${esc(current.name || `InstallerLab ${current.tag_name}`)}</h2>
          <p>${l === 'es'
            ? 'Setup EXE para la instalación normal, Portable EXE para ejecutar sin instalación tradicional y MSI para Windows Installer y despliegues administrados. Los tres pertenecen a la misma versión.'
            : 'Setup EXE for normal installation, Portable EXE for running without a traditional install, and MSI for Windows Installer and managed deployment. All three belong to the same release.'}</p>
          <div class="release-links"><a class="button" href="${esc(current.html_url || RELEASES)}" target="_blank" rel="noopener">${l === 'es' ? 'Ver Release en GitHub ↗' : 'View GitHub Release ↗'}</a><a class="button" href="${RELEASES}" target="_blank" rel="noopener">${l === 'es' ? 'Todas las versiones ↗' : 'All releases ↗'}</a></div>
        </div>
        <aside class="release-summary">
          <div class="release-total">↓ ${fmt(st.total)}</div>
          <div class="release-total-label">${l === 'es' ? 'descargas totales de archivos oficiales' : 'total official asset downloads'}</div>
          <div class="release-version-line"><span>${l === 'es' ? 'Publicada' : 'Published'} <strong>${date(current.published_at)}</strong></span><span>${live ? 'GitHub API · live' : (l === 'es' ? 'Datos de respaldo' : 'Fallback data')}</span></div>
        </aside>
      </section>

      <section class="release-grid">
        ${downloadCard(setup,'EXE',l === 'es' ? 'Setup EXE' : 'Setup EXE',l === 'es' ? 'La opción recomendada para la mayoría. Instala InstallerLab en Windows y registra la aplicación normalmente.' : 'Recommended for most users. Installs InstallerLab on Windows and registers the application normally.',st.setup,true)}
        ${downloadCard(portable,'EXE',l === 'es' ? 'Portable EXE' : 'Portable EXE',l === 'es' ? 'Ejecuta InstallerLab sin una instalación tradicional. Ideal para pruebas, USB o una carpeta de herramientas.' : 'Run InstallerLab without a traditional installation. Ideal for testing, USB drives or a tools folder.',st.portable)}
        ${downloadCard(msi,'MSI',l === 'es' ? 'Paquete MSI' : 'MSI package',l === 'es' ? 'Paquete Windows Installer generado desde el mismo proyecto. Útil para msiexec y escenarios de administración empresarial.' : 'Windows Installer package generated from the same project. Useful for msiexec and managed enterprise deployment.',st.msi)}
      </section>

      <div class="release-note">${l === 'es'
        ? '<strong>Importante:</strong> la edición Portable descargable de InstallerLab es distinta de la función PRO que permite <em>crear</em> portables de otras aplicaciones. InstallerLab sigue siendo gratuito; el apoyo PRO desde US$10 desbloquea esa función y 21 temas PRO para una máquina.'
        : '<strong>Important:</strong> the downloadable Portable edition of InstallerLab is different from the PRO feature that lets InstallerLab <em>create</em> portable packages for other applications. InstallerLab remains free; optional support from US$10 unlocks that feature and 21 PRO themes for one machine.'}</div>
    </div>`;
  }

  const v1Highlights = {
    es:[
      'Creación visual de instaladores Setup EXE.',
      'Editor visual y script FSS como una sola fuente de configuración.',
      'Generación de MSI desde el mismo proyecto, sin escribir WiX XML manualmente.',
      'Portable y flujo B4J Portable con el toolchain oficial de B4J.',
      'Accesos directos, registro, asociaciones de archivos y menús contextuales de Windows.',
      'Idiomas del instalador, temas, branding, acciones de instalación y limpieza.'
    ],
    en:[
      'Visual Setup EXE authoring.',
      'Visual editor and FSS script as one configuration source.',
      'MSI generation from the same project without writing WiX XML manually.',
      'Portable and B4J Portable workflow using the official B4J toolchain.',
      'Shortcuts, registry, file associations and Windows context menus.',
      'Installer languages, themes, branding, install actions and cleanup.'
    ]
  };

  function genericHighlights(release) {
    const lines = String(release.body || '').split(/\r?\n/)
      .map(x => x.trim())
      .filter(x => /^[-*]\s+/.test(x))
      .map(x => x.replace(/^[-*]\s+/, '').replace(/\*\*/g,''))
      .slice(0,6);
    return lines.length ? lines : [lang() === 'es' ? 'Consulta las notas completas de esta versión en GitHub.' : 'See the complete release notes on GitHub.'];
  }

  function renderChangelog(releases) {
    if (document.body.dataset.page !== 'changelog') return;
    const main = document.querySelector('main.content');
    if (!main || main.dataset.releaseLive === '1') return;
    main.dataset.releaseLive = '1';
    const l = lang();
    const hero = document.querySelector('.page-hero .shell');
    if (hero) hero.innerHTML = l === 'es'
      ? `<span class="eyebrow">Versiones</span><h1>Historial de InstallerLab.</h1><p>Cada versión pública, sus archivos oficiales y sus cambios principales.</p>`
      : `<span class="eyebrow">Releases</span><h1>InstallerLab release history.</h1><p>Every public release, its official assets and key changes.</p>`;

    main.innerHTML = `<div class="release-live"><div class="release-history">${releases.map((release,index) => {
      const highlights = release.tag_name === 'v1.0.0' ? v1Highlights[l] : genericHighlights(release);
      const assetDownloads = (release.assets || []).reduce((n,a) => n + Number(a.download_count || 0),0);
      return `<article class="release-history-card">
        <div class="release-history-head"><div><h2>${esc(release.name || release.tag_name)}</h2><p>${date(release.published_at)} · ↓ ${fmt(assetDownloads)} ${l === 'es' ? 'descargas' : 'downloads'}</p></div>${index === 0 ? `<span class="release-history-badge">${l === 'es' ? 'ACTUAL' : 'CURRENT'}</span>` : ''}</div>
        <ul class="release-highlights">${highlights.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
        <div class="release-assets-mini">${(release.assets || []).map(a => `<a href="${esc(a.browser_download_url)}">${esc(a.name)} · ${size(a.size)} · ↓ ${fmt(a.download_count)}</a>`).join('')}</div>
        <div class="release-links"><a class="button" href="${esc(release.html_url)}" target="_blank" rel="noopener">${l === 'es' ? 'Notas completas en GitHub ↗' : 'Full notes on GitHub ↗'}</a></div>
      </article>`;
    }).join('')}</div></div>`;
  }

  function enhanceHome(releases) {
    if (document.body.dataset.page !== 'home') return;
    const current = releases[0] || FALLBACK;
    const setup = (current.assets || []).find(isSetup);
    const st = stats(releases);
    const actions = document.querySelector('.hero-actions');
    if (!actions || actions.dataset.releaseLive === '1') return;
    actions.dataset.releaseLive = '1';
    const primary = actions.querySelector('a.button.primary');
    if (primary && setup) {
      primary.href = setup.browser_download_url;
      primary.textContent = lang() === 'es' ? `Descargar ${current.tag_name} →` : `Download ${current.tag_name} →`;
      primary.removeAttribute('target');
    }
    const badge = document.createElement('span');
    badge.className = 'home-live-counter';
    badge.textContent = `↓ ${fmt(st.total)} ${lang() === 'es' ? 'descargas' : 'downloads'}`;
    actions.appendChild(badge);
  }

  function apply() {
    getData().then(({releases,live}) => {
      renderDownload(releases,live);
      renderChangelog(releases);
      enhanceHome(releases);
    });
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; apply(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
  new MutationObserver(schedule).observe(document.documentElement,{ childList:true, subtree:true });
})();
