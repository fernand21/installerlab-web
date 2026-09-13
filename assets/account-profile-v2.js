(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'account') return;
  const key = 'installerlab-account-session-v1';
  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const base = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  const text = () => es() ? {
    active:'Cuenta activa', member:'Miembro desde', analytics:'Analytics', drive:'Google Drive', support:'Supporter / licencia', available:'disponible', available2:'disponibles', quick:'Acciones rápidas', open:'Abrir Analytics', add:'Conectar TrackID', supportBtn:'Apoyar InstallerLab', details:'Detalles de la cuenta', provider:'Acceso', email:'Correo', plan:'Plan', status:'Estado', connected:'Conectado', off:'No conectado', freeNote:'InstallerLab Desktop sigue libre; el límite corresponde solo a Analytics web.'
  } : {
    active:'Active account', member:'Member since', analytics:'Analytics', drive:'Google Drive', support:'Supporter / license', available:'available', available2:'available', quick:'Quick actions', open:'Open Analytics', add:'Connect TrackID', supportBtn:'Support InstallerLab', details:'Account details', provider:'Sign-in', email:'Email', plan:'Plan', status:'Status', connected:'Connected', off:'Not connected', freeNote:'InstallerLab Desktop remains free; this limit applies only to web Analytics.'
  };
  const getSession = () => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } };
  const fmt = d => { if (!d) return '—'; try { return new Intl.DateTimeFormat(es()?'es-EC':'en-US',{year:'numeric',month:'short',day:'numeric'}).format(new Date(d)); } catch { return '—'; } };

  function enhance() {
    const shell = document.querySelector('.account-shell');
    if (!shell || shell.dataset.profileV2 === '1') return;
    if (!document.getElementById('account-logout')) return;
    shell.dataset.profileV2 = '1';
    const x = text(), session = getSession(), user = session?.user || {};
    const hero = shell.querySelector('.account-hero');
    const heroCards = hero ? [...hero.children] : [];
    if (hero) hero.classList.add('account-top');
    if (heroCards[0]) heroCards[0].classList.add('account-profile-card');
    if (heroCards[1]) heroCards[1].classList.add('account-plan-card');

    const userBox = shell.querySelector('.account-user');
    if (userBox) {
      userBox.classList.add('account-profile-main');
      const copy = userBox.children[1];
      if (copy) copy.classList.add('account-profile-copy');
      const strong = copy?.querySelector('strong');
      if (strong) { const h1 = document.createElement('h1'); h1.textContent = strong.textContent; strong.replaceWith(h1); }
      copy?.querySelector('small')?.classList.add('account-email');
      const av = userBox.querySelector('.account-avatar');
      const pic = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
      if (av && pic) av.innerHTML = `<img src="${String(pic).replace(/"/g,'&quot;')}" alt="">`;
      const provider = (user?.app_metadata?.provider || 'email').toLowerCase() === 'google' ? 'Google' : 'Email';
      const meta = document.createElement('div');
      meta.className = 'account-profile-meta';
      meta.innerHTML = `<span class="account-pill"><i></i>${x.active}</span><span class="account-pill">${provider}</span><span class="account-pill">${x.member}: ${fmt(user?.created_at)}</span>`;
      copy?.appendChild(meta);
    }

    const meterText = shell.querySelector('.account-meter-line b')?.textContent || '0 / 1';
    const nums = meterText.match(/(\d+)\s*\/\s*(\d+)/);
    const used = nums ? Number(nums[1]) : 0, max = nums ? Number(nums[2]) : 1, left = Math.max(0,max-used);
    const tier = heroCards[1]?.querySelector('.account-badge')?.textContent?.trim() || 'FREE';
    const driveCard = shell.querySelector('.account-span-4');
    const driveOn = /connected|conectado/i.test(driveCard?.querySelector('.account-status')?.textContent || '') && !/not connected|no conectado/i.test(driveCard?.querySelector('.account-status')?.textContent || '');
    const grid = shell.querySelector('.account-grid');
    if (grid && !shell.querySelector('.account-summary-grid')) {
      const summary = document.createElement('div'); summary.className = 'account-summary-grid';
      summary.innerHTML = `<article class="account-card account-stat-card"><div class="account-stat-head"><span class="account-kicker">${x.analytics}</span><span class="account-stat-icon">↗</span></div><div class="account-stat-value">${used} / ${max}</div><div class="account-stat-note">${left} ${left===1?x.available:x.available2}</div></article><article class="account-card account-stat-card"><div class="account-stat-head"><span class="account-kicker">${x.drive}</span><span class="account-status ${driveOn?'ok':'warn'}"><i></i>${driveOn?x.connected:x.off}</span></div><div class="account-stat-value">${driveOn?'Ready':'—'}</div><div class="account-stat-note">${x.freeNote}</div></article><article class="account-card account-stat-card"><div class="account-stat-head"><span class="account-kicker">${x.support}</span><span class="account-badge">${tier}</span></div><div class="account-stat-value">${tier}</div><div class="account-stat-note">${x.freeNote}</div></article>`;
      grid.before(summary);
    }

    shell.querySelectorAll('.account-app').forEach(app => {
      const h4 = app.querySelector('h4');
      if (h4 && !h4.parentElement.classList.contains('account-app-title')) {
        const wrap = document.createElement('div'); wrap.className='account-app-title'; h4.before(wrap); wrap.append('<i class="account-app-dot"></i>'); wrap.appendChild(h4);
      }
    });
    const form = document.getElementById('account-add-app'); if (form) form.parentElement?.classList.add('account-form-wrap');

    if (grid && !document.getElementById('account-profile-details')) {
      const provider = (user?.app_metadata?.provider || 'email').toLowerCase()==='google'?'Google':'Email';
      grid.insertAdjacentHTML('beforeend', `<article class="account-card account-span-7"><div class="account-head"><div><span class="account-kicker">${x.quick}</span><h2>${x.quick}</h2></div></div><div class="account-quick"><a class="account-btn primary" href="${base}analytics/"><span>${x.open}</span><span>→</span></a><a class="account-btn" href="#account-add-app"><span>${x.add}</span><span>+</span></a><a class="account-btn" href="${base}donate/"><span>${x.supportBtn}</span><span>♡</span></a></div></article><article id="account-profile-details" class="account-card account-span-5"><div class="account-head"><div><span class="account-kicker">${x.details}</span><h2>${x.details}</h2></div></div><div class="account-details"><div class="account-detail"><span>${x.email}</span><b>${user?.email||'—'}</b></div><div class="account-detail"><span>${x.provider}</span><b>${provider}</b></div><div class="account-detail"><span>${x.plan}</span><b>${tier}</b></div><div class="account-detail"><span>${x.status}</span><b>${x.active}</b></div><div class="account-detail"><span>${x.member}</span><b>${fmt(user?.created_at)}</b></div></div></article>`);
    }
  }

  let queued=false; const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('storage',schedule); window.addEventListener('installerlab:account-session',schedule);
})();