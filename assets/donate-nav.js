(() => {
  'use strict';
  if (window.__INSTALLERLAB_GLOBAL_NAV_V4__) return;
  window.__INSTALLERLAB_GLOBAL_NAV_V4__ = true;

  const projectBase = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  const sessionKey = 'installerlab-account-session-v1';
  const urls = {
    home: projectBase,
    features: projectBase + 'features/',
    docs: projectBase + 'docs/',
    analytics: projectBase + 'analytics/',
    download: projectBase + 'download/',
    donate: projectBase + 'donate/',
    account: projectBase + 'account/',
    b4j: projectBase + 'b4j/',
    forum: projectBase + 'community/',
    support: projectBase + 'support/',
    faq: projectBase + 'faq/',
    changelog: projectBase + 'changelog/',
    about: projectBase + 'about/',
    github: 'https://github.com/fernand21/installerlab-web'
  };
  let scheduled = false;

  const isSpanish = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const readSession = () => { try { return JSON.parse(localStorage.getItem(sessionKey) || 'null'); } catch { return null; } };
  const chevron = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 7 5 5 5-5"/></svg>';
  const menuIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';

  function ensureStyles() {
    if (!document.querySelector('link[href*="assets/site.css"]')) {
      const core = document.createElement('link');
      core.rel = 'stylesheet';
      core.href = projectBase + 'assets/site.css?v=20260913-15';
      core.dataset.ilSiteCore = '1';
      document.head.appendChild(core);
    }
    if (!document.querySelector('link[data-il-nav-v2]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = projectBase + 'assets/nav-v2.css?v=20260913-3';
      link.dataset.ilNavV2 = '1';
      document.head.appendChild(link);
    }
  }

  function ensureHeader() {
    let nav = document.querySelector('.header .nav');
    if (nav) return nav;

    const oldCommunity = document.querySelector('.community-header');
    if (oldCommunity) oldCommunity.classList.add('il-legacy-header-hidden');

    const header = document.createElement('header');
    header.className = 'header il-universal-header';
    header.innerHTML = `<nav class="nav shell"><a class="brand" href="${urls.home}"><img src="${projectBase}assets/icon.png" alt="InstallerLab">InstallerLab</a><div class="links"></div><div class="actions"></div></nav>`;
    document.body.insertBefore(header, document.body.firstChild);
    return header.querySelector('.nav');
  }

  function firstName(session) {
    const u = session?.user;
    const full = u?.user_metadata?.full_name || u?.user_metadata?.name || '';
    return (full || u?.email || '').trim().split(/\s+|@/)[0] || '';
  }

  function avatar(session) {
    const u = session?.user;
    const url = u?.user_metadata?.avatar_url || u?.user_metadata?.picture || '';
    const name = firstName(session) || 'U';
    return url ? `<span class="il-nav-avatar"><img src="${String(url).replace(/"/g,'&quot;')}" alt=""></span>` : `<span class="il-nav-avatar">${name.charAt(0).toUpperCase()}</span>`;
  }

  function active(href) {
    const p = location.pathname.replace(/\/+$/, '/') || '/';
    try {
      const hp = new URL(href, location.origin).pathname.replace(/\/+$/, '/') || '/';
      if (hp === projectBase) return p === projectBase || p === projectBase.replace(/\/$/, '');
      return p.startsWith(hp);
    } catch { return false; }
  }

  function navLink(href, label) {
    return `<a href="${href}"${active(href) ? ' class="is-active" aria-current="page"' : ''}>${label}</a>`;
  }

  function menu(label, items) {
    const groupActive = items.some(item => item.href && !item.external && active(item.href));
    return `<div class="il-nav-group${groupActive ? ' is-current' : ''}"><button class="il-nav-trigger${groupActive ? ' is-active' : ''}" type="button" aria-expanded="false">${label}${chevron}</button><div class="il-popover">${items.map(item => `<a href="${item.href}"${item.external ? ' target="_blank" rel="noopener"' : ''}${active(item.href) ? ' class="is-active" aria-current="page"' : ''}>${item.label}${item.external ? ' ↗' : ''}</a>`).join('')}</div></div>`;
  }

  function buildLinks(links) {
    const es = isSpanish();
    const signature = `${es ? 'es' : 'en'}:${location.pathname}:v4`;
    if (links.dataset.ilNavSignature === signature) return;
    links.dataset.ilNavSignature = signature;

    const product = menu(es ? 'Producto' : 'Product', [
      { href: urls.features, label: es ? 'Funciones' : 'Features' },
      { href: urls.download, label: es ? 'Descargas' : 'Downloads' },
      { href: urls.changelog, label: 'Changelog' }
    ]);
    const resources = menu(es ? 'Recursos' : 'Resources', [
      { href: urls.docs, label: es ? 'Documentación' : 'Documentation' },
      { href: urls.b4j, label: 'B4J Portable' },
      { href: urls.support, label: es ? 'Soporte' : 'Support' },
      { href: urls.faq, label: es ? 'Preguntas frecuentes' : 'FAQ' }
    ]);
    const community = menu(es ? 'Comunidad' : 'Community', [
      { href: urls.forum, label: es ? 'Foro' : 'Forum' },
      { href: urls.github, label: 'GitHub', external: true },
      { href: urls.donate, label: es ? 'Apoyar InstallerLab' : 'Support InstallerLab' },
      { href: urls.about, label: es ? 'Acerca de' : 'About' }
    ]);

    links.innerHTML = [
      navLink(urls.home, es ? 'Inicio' : 'Home'),
      product,
      navLink(urls.analytics, 'Analytics'),
      resources,
      community
    ].join('');
  }

  function buildActions(actions) {
    const es = isSpanish();
    const session = readSession();
    const userName = firstName(session);
    const signature = `${es ? 'es' : 'en'}:${userName || 'guest'}:v4`;
    if (actions.dataset.ilNavSignature === signature) return;
    actions.dataset.ilNavSignature = signature;

    let lang = actions.querySelector('.lang');
    if (!lang) {
      lang = document.createElement('select');
      lang.className = 'lang';
      lang.setAttribute('aria-label', es ? 'Idioma' : 'Language');
      lang.innerHTML = '<option value="en">EN</option><option value="es">ES</option>';
      lang.addEventListener('change', e => {
        localStorage.setItem('il-lang', e.target.value);
        location.reload();
      });
    }
    lang.value = es ? 'es' : 'en';

    actions.innerHTML = '';
    actions.appendChild(lang);

    const cta = document.createElement('a');
    cta.className = 'button primary';
    cta.href = urls.download;
    cta.textContent = es ? 'Descargar' : 'Download';
    actions.appendChild(cta);

    if (session?.access_token) {
      const wrap = document.createElement('div');
      wrap.className = 'il-account-wrap';
      wrap.innerHTML = `<button class="il-account-trigger" type="button" aria-expanded="false">${avatar(session)}<span class="il-account-meta"><span>${userName || (es ? 'Cuenta' : 'Account')}</span><small>${es ? 'Mi cuenta' : 'My account'}</small></span>${chevron}</button><div class="il-popover"><a href="${urls.account}">${es ? 'Mi cuenta' : 'My Account'}</a><a href="${urls.analytics}">Analytics</a><a href="${urls.donate}">${es ? 'Supporter / Licencia' : 'Supporter / License'}</a><div class="il-popover-sep"></div><button type="button" data-il-signout>${es ? 'Cerrar sesión' : 'Sign out'}</button></div>`;
      actions.appendChild(wrap);
    } else {
      const signIn = document.createElement('a');
      signIn.className = 'il-signin';
      signIn.href = urls.account;
      signIn.textContent = es ? 'Iniciar sesión' : 'Sign in';
      actions.appendChild(signIn);
    }

    const toggle = document.createElement('button');
    toggle.className = 'il-nav-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', es ? 'Abrir menú' : 'Open menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = menuIcon;
    actions.appendChild(toggle);
  }

  function wire(nav) {
    if (nav.dataset.ilNavWired === '1') return;
    nav.dataset.ilNavWired = '1';
    nav.addEventListener('click', e => {
      const trigger = e.target.closest('.il-nav-trigger,.il-account-trigger');
      if (trigger) {
        const wrap = trigger.parentElement;
        const open = !wrap.classList.contains('is-open');
        nav.querySelectorAll('.il-nav-group.is-open,.il-account-wrap.is-open').forEach(x => {
          x.classList.remove('is-open');
          x.querySelector(':scope > button')?.setAttribute('aria-expanded','false');
        });
        wrap.classList.toggle('is-open', open);
        trigger.setAttribute('aria-expanded', String(open));
        e.stopPropagation();
        return;
      }
      const mobile = e.target.closest('.il-nav-toggle');
      if (mobile) {
        const links = nav.querySelector('.links');
        const open = !links.classList.contains('nav-open');
        links.classList.toggle('nav-open', open);
        mobile.setAttribute('aria-expanded', String(open));
        return;
      }
      const signout = e.target.closest('[data-il-signout]');
      if (signout) {
        localStorage.removeItem(sessionKey);
        window.dispatchEvent(new CustomEvent('installerlab:account-session', { detail:null }));
        location.href = urls.account;
        return;
      }
      if (e.target.closest('.links a')) nav.querySelector('.links')?.classList.remove('nav-open');
    });
  }

  function enhance() {
    ensureStyles();
    const nav = ensureHeader();
    if (!nav) return;
    const links = nav.querySelector('.links');
    const actions = nav.querySelector('.actions');
    if (!links || !actions) return;
    buildLinks(links);
    buildActions(actions);
    wire(nav);
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; enhance(); });
  }

  document.addEventListener('click', e => {
    if (e.target.closest('.il-nav-group,.il-account-wrap')) return;
    document.querySelectorAll('.il-nav-group.is-open,.il-account-wrap.is-open').forEach(x => {
      x.classList.remove('is-open');
      x.querySelector(':scope > button')?.setAttribute('aria-expanded','false');
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.il-nav-group.is-open,.il-account-wrap.is-open').forEach(x => x.classList.remove('is-open'));
    document.querySelector('.links.nav-open')?.classList.remove('nav-open');
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhance, { once:true }); else enhance();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('storage', schedule);
  window.addEventListener('installerlab:account-session', schedule);
})();
