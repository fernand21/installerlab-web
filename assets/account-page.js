(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'account') return;

  const cfg = window.INSTALLERLAB_ANALYTICS_CONFIG || {};
  const base = String(cfg.url || '').replace(/\/$/, '');
  const anon = String(cfg.publishableKey || '');
  const sessionKey = 'installerlab-account-session-v1';
  const projectBase = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  let session = null;
  let summary = null;

  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const text = () => es() ? {
    kicker:'Cuenta InstallerLab', title:'Una cuenta para Analytics, proyectos y tu archivo en Drive.',
    intro:'InstallerLab Desktop continúa libre. La cuenta web se usa únicamente para los servicios online de Analytics.',
    free:'Gratis registrado', supporter:'Supporter', pro:'PRO', one:'1 aplicación Analytics', more:'Más aplicaciones Analytics', drive:'Archivo en Google Drive',
    signIn:'Iniciar sesión', create:'Crear cuenta', email:'Correo electrónico', password:'Contraseña', google:'Continuar con Google',
    signed:'Sesión iniciada', signOut:'Cerrar sesión', analytics:'Aplicaciones Analytics', add:'Agregar aplicación', appName:'Nombre de la aplicación', track:'TrackID', register:'Registrar TrackID',
    noApps:'Aún no has registrado una aplicación Analytics.', usage:'Uso de Analytics', account:'Cuenta', status:'Estado', driveTitle:'Google Drive', drivePending:'La conexión de Google Drive será la siguiente fase. La estructura de la cuenta ya reserva esta sección sin fingir una conexión que todavía no existe.',
    connectDrive:'Conectar Google Drive', archive:'Archivo automático', archiveText:'Los datos se enviarán a Drive y solo después de verificarlos se eliminarán de Supabase.',
    support:'Supporter / licencia', supportText:'El plan gratuito tendrá 1 aplicación. Supporters y usuarios PRO podrán registrar más aplicaciones sin quitar funciones al programa de escritorio.',
    pendingBackend:'La cuenta está lista, pero el esquema de permisos de Analytics aún debe instalarse en Supabase para registrar proyectos.',
    invalidTrack:'El TrackID debe tener el formato IL-TRK- seguido de 24 caracteres hexadecimales.',
    created:'Cuenta creada. Si Supabase solicita confirmación por correo, confirma el mensaje antes de iniciar sesión.',
    badLogin:'No se pudo iniciar sesión.', registered:'Aplicación registrada.', removed:'Aplicación eliminada de tu cuenta.', loading:'Cargando…', backendError:'El backend de cuentas todavía no está disponible.',
    freeDesc:'Analytics completo para una aplicación.', supporterDesc:'Más aplicaciones para quienes apoyan InstallerLab.', proDesc:'Más capacidad para usuarios con licencia PRO.'
  } : {
    kicker:'InstallerLab Account', title:'One account for Analytics, projects and your Drive archive.',
    intro:'InstallerLab Desktop remains free. The web account is used only for online Analytics services.',
    free:'Registered free', supporter:'Supporter', pro:'PRO', one:'1 Analytics application', more:'More Analytics applications', drive:'Google Drive archive',
    signIn:'Sign in', create:'Create account', email:'Email address', password:'Password', google:'Continue with Google',
    signed:'Signed in', signOut:'Sign out', analytics:'Analytics applications', add:'Add application', appName:'Application name', track:'TrackID', register:'Register TrackID',
    noApps:'You have not registered an Analytics application yet.', usage:'Analytics usage', account:'Account', status:'Status', driveTitle:'Google Drive', drivePending:'Google Drive connection is the next phase. The account structure already reserves this area without pretending a connection exists.',
    connectDrive:'Connect Google Drive', archive:'Automatic archive', archiveText:'Data will be sent to Drive and deleted from Supabase only after the archive has been verified.',
    support:'Supporter / license', supportText:'The free tier will include 1 application. Supporters and PRO users can register more applications without removing features from the desktop app.',
    pendingBackend:'The account is ready, but the Analytics entitlement schema still needs to be installed in Supabase before projects can be registered.',
    invalidTrack:'TrackID must use IL-TRK- followed by 24 hexadecimal characters.',
    created:'Account created. If Supabase requires email confirmation, confirm the message before signing in.',
    badLogin:'Unable to sign in.', registered:'Application registered.', removed:'Application removed from your account.', loading:'Loading…', backendError:'The account backend is not available yet.',
    freeDesc:'Complete Analytics for one application.', supporterDesc:'More applications for people who support InstallerLab.', proDesc:'More capacity for users with a PRO license.'
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const root = () => document.getElementById('app');

  function apiHeaders(token, json=true){
    const h = { apikey: anon, Authorization: `Bearer ${token || anon}` };
    if (json) h['Content-Type'] = 'application/json';
    return h;
  }

  function saveSession(value){
    session = value || null;
    if (session) localStorage.setItem(sessionKey, JSON.stringify(session));
    else localStorage.removeItem(sessionKey);
    window.dispatchEvent(new CustomEvent('installerlab:account-session', { detail: session }));
  }

  function readStoredSession(){
    try { return JSON.parse(localStorage.getItem(sessionKey) || 'null'); } catch { return null; }
  }

  function normalizeSession(data){
    if (!data?.access_token) return null;
    return {
      access_token:data.access_token,
      refresh_token:data.refresh_token || '',
      expires_at:data.expires_at || (Math.floor(Date.now()/1000) + Number(data.expires_in || 3600) - 30),
      user:data.user || null
    };
  }

  async function refreshIfNeeded(){
    session = readStoredSession();
    if (!session?.access_token) return null;
    if (Number(session.expires_at || 0) > Math.floor(Date.now()/1000) + 30) return session;
    if (!session.refresh_token) { saveSession(null); return null; }
    try {
      const r = await fetch(`${base}/auth/v1/token?grant_type=refresh_token`, { method:'POST', headers:apiHeaders(null), body:JSON.stringify({refresh_token:session.refresh_token}) });
      if (!r.ok) throw new Error('refresh');
      saveSession(normalizeSession(await r.json()));
      return session;
    } catch { saveSession(null); return null; }
  }

  function consumeOAuthHash(){
    if (!location.hash.includes('access_token=')) return;
    const p = new URLSearchParams(location.hash.slice(1));
    const access = p.get('access_token');
    if (!access) return;
    saveSession({
      access_token:access,
      refresh_token:p.get('refresh_token') || '',
      expires_at:Math.floor(Date.now()/1000) + Number(p.get('expires_in') || 3600) - 30,
      user:null
    });
    history.replaceState({}, '', location.pathname + location.search);
  }

  async function getUser(){
    if (!session?.access_token) return null;
    const r = await fetch(`${base}/auth/v1/user`, { headers:apiHeaders(session.access_token,false) });
    if (!r.ok) return null;
    const user = await r.json();
    session.user = user; saveSession(session); return user;
  }

  async function accountSummary(){
    if (!session?.access_token) return null;
    const r = await fetch(`${base}/rest/v1/rpc/account_summary`, { method:'POST', headers:apiHeaders(session.access_token), body:'{}' });
    if (!r.ok) throw new Error(`account_summary ${r.status}`);
    return r.json();
  }

  async function registerProject(trackId, appName){
    const r = await fetch(`${base}/rest/v1/rpc/register_analytics_project`, {
      method:'POST', headers:apiHeaders(session.access_token), body:JSON.stringify({p_track_id:trackId,p_app_name:appName || null})
    });
    const data = await r.json().catch(()=>null);
    if (!r.ok) throw new Error(data?.message || data?.hint || `HTTP ${r.status}`);
    return data;
  }

  async function removeProject(trackId){
    const r = await fetch(`${base}/rest/v1/rpc/remove_analytics_project`, {
      method:'POST', headers:apiHeaders(session.access_token), body:JSON.stringify({p_track_id:trackId})
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
  }

  function tierClass(tier){ return ['supporter','pro'].includes(String(tier).toLowerCase()) ? String(tier).toLowerCase() : 'free'; }

  function loginMarkup(t){
    return `<section class="account-shell">
      <div class="account-hero">
        <article class="account-card"><span class="account-kicker">${t.kicker}</span><h1>${t.title}</h1><p>${t.intro}</p><div class="account-actions"><a class="account-btn" href="${projectBase}analytics/">Analytics</a><a class="account-btn" href="${projectBase}donate/">${t.supporter}</a></div></article>
        <aside class="account-card"><div class="account-policy"><div><b>${t.free}</b><span>${t.one}</span></div><div><b>${t.supporter}</b><span>${t.more}</span></div><div><b>${t.pro}</b><span>${t.more}</span></div><div><b>Drive</b><span>${t.drive}</span></div></div></aside>
      </div>
      <div class="account-grid">
        <article class="account-card account-span-6"><div class="account-head"><div><span class="account-kicker">${t.account}</span><h2>${t.signIn}</h2></div></div>
          <form id="account-login" class="account-form"><label>${t.email}<input id="account-email" type="email" autocomplete="email" required></label><label>${t.password}<input id="account-password" type="password" autocomplete="current-password" minlength="6" required></label><div class="account-actions"><button class="account-btn primary" type="submit">${t.signIn}</button><button class="account-btn" type="button" id="account-signup">${t.create}</button><button class="account-btn" type="button" id="account-google">${t.google}</button></div><div id="account-message" class="account-message"></div></form>
        </article>
        <article class="account-card account-span-6"><div class="account-head"><div><span class="account-kicker">Analytics access</span><h2>${t.free}</h2></div><span class="account-badge free">1 APP</span></div><div class="account-tiers"><div class="account-tier"><h4>${t.free}</h4><strong>1</strong><p>${t.freeDesc}</p></div><div class="account-tier"><h4>${t.supporter}</h4><strong>+</strong><p>${t.supporterDesc}</p></div><div class="account-tier"><h4>${t.pro}</h4><strong>+</strong><p>${t.proDesc}</p></div></div></article>
      </div>
    </section>`;
  }

  function appRows(projects,t){
    if (!projects?.length) return `<div class="account-empty">${t.noApps}</div>`;
    return `<div class="account-apps">${projects.map(p=>`<div class="account-app"><div><h4>${esc(p.app_name || 'InstallerLab application')}</h4><code>${esc(p.track_id)}</code><small>${p.drive_file_id ? 'Drive ✓' : 'Drive —'}</small></div><div class="account-actions"><a class="account-btn" href="${projectBase}analytics/?trackId=${encodeURIComponent(p.track_id)}">Analytics</a><button class="account-btn danger" type="button" data-remove-track="${esc(p.track_id)}">×</button></div></div>`).join('')}</div>`;
  }

  function dashboardMarkup(user,data,t,backendReady){
    const e = data?.entitlement || {tier:'free',max_apps:1};
    const projects = Array.isArray(data?.projects) ? data.projects : [];
    const max = Math.max(1,Number(e.max_apps || 1));
    const used = projects.length;
    const pct = Math.min(100,Math.round((used/max)*100));
    const name = data?.profile?.display_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'InstallerLab user';
    const tier = String(e.tier || 'free').toLowerCase();
    return `<section class="account-shell">
      <div class="account-hero"><article class="account-card"><span class="account-kicker">${t.kicker}</span><div class="account-user"><div class="account-avatar">${esc(name.slice(0,1).toUpperCase())}</div><div><strong>${esc(name)}</strong><small>${esc(user?.email || '')}</small></div></div><div class="account-actions" style="margin-top:18px"><a class="account-btn primary" href="${projectBase}analytics/">Analytics</a><button class="account-btn" id="account-logout">${t.signOut}</button></div></article><aside class="account-card"><div class="account-head"><div><span class="account-kicker">${t.status}</span><h2>${t.signed}</h2></div><span class="account-badge ${tierClass(tier)}">${esc(tier.toUpperCase())}</span></div><div class="account-meter"><div class="account-meter-line"><span>${t.usage}</span><b>${used} / ${max}</b></div><div class="account-meter-track"><i style="width:${pct}%"></i></div></div></aside></div>
      ${backendReady?'':`<div class="account-note" style="margin-bottom:16px"><strong>Backend:</strong> ${t.pendingBackend}</div>`}
      <div class="account-grid">
        <article class="account-card account-span-8"><div class="account-head"><div><span class="account-kicker">Analytics</span><h2>${t.analytics}</h2></div><span class="account-badge ${tierClass(tier)}">${used}/${max}</span></div>${appRows(projects,t)}
          <form id="account-add-app" class="account-form" style="margin-top:18px"><div class="account-row"><label>${t.appName}<input id="account-app-name" maxlength="80" placeholder="My Application"></label><label>${t.track}<input id="account-track-id" maxlength="31" placeholder="IL-TRK-XXXXXXXXXXXXXXXXXXXXXXXX"></label></div><div class="account-actions"><button class="account-btn primary" type="submit" ${backendReady?'':'disabled'}>${t.register}</button></div><div id="project-message" class="account-message"></div></form>
        </article>
        <article class="account-card account-span-4"><div class="account-head"><div><span class="account-kicker">Archive</span><h2>${t.driveTitle}</h2></div><div class="account-status warn"><i></i>${data?.drive?.connected?'Connected':'Not connected'}</div></div><div class="account-drive"><div class="account-drive-box"><strong>${t.archive}</strong><span class="account-muted">${t.archiveText}</span></div><div class="account-note">${t.drivePending}</div><button class="account-btn" type="button" disabled>${t.connectDrive}</button></div></article>
        <article class="account-card account-span-12"><div class="account-head"><div><span class="account-kicker">Access policy</span><h2>${t.support}</h2></div><a class="account-btn" href="${projectBase}donate/">${t.supporter}</a></div><p class="account-muted">${t.supportText}</p><div class="account-tiers"><div class="account-tier"><h4>${t.free}</h4><strong>1</strong><p>${t.freeDesc}</p></div><div class="account-tier"><h4>${t.supporter}</h4><strong>5*</strong><p>${t.supporterDesc}</p></div><div class="account-tier"><h4>${t.pro}</h4><strong>10*</strong><p>${t.proDesc}</p></div></div><p class="account-muted" style="font-size:11px">* ${es()?'Los límites ampliados son la política inicial y quedarán controlados desde la web, no desde InstallerLab Desktop.':'Expanded limits are the initial policy and will be controlled by the website, not InstallerLab Desktop.'}</p></article>
      </div>
    </section>`;
  }

  function setMessage(id,msg,state=''){
    const n=document.getElementById(id); if(!n)return; n.textContent=msg||''; n.className=`account-message ${state}`;
  }

  async function render(){
    const t=text();
    await refreshIfNeeded();
    if (!session?.access_token) { root().innerHTML=loginMarkup(t); wireLogin(t); return; }
    let user=session.user || await getUser();
    if (!user) { saveSession(null); root().innerHTML=loginMarkup(t); wireLogin(t); return; }
    let backendReady=true;
    try { summary=await accountSummary(); } catch { backendReady=false; summary={profile:{display_name:user.user_metadata?.full_name||''},entitlement:{tier:'free',max_apps:1},projects:[],drive:{connected:false}}; }
    root().innerHTML=dashboardMarkup(user,summary,t,backendReady);
    wireDashboard(t,backendReady);
  }

  function wireLogin(t){
    const form=document.getElementById('account-login'); if(!form)return;
    form.addEventListener('submit',async e=>{
      e.preventDefault(); setMessage('account-message',t.loading);
      try{
        const email=document.getElementById('account-email').value.trim(); const password=document.getElementById('account-password').value;
        const r=await fetch(`${base}/auth/v1/token?grant_type=password`,{method:'POST',headers:apiHeaders(null),body:JSON.stringify({email,password})});
        const d=await r.json(); if(!r.ok)throw new Error(d?.msg||d?.message||t.badLogin);
        saveSession(normalizeSession(d)); await render();
      }catch(err){setMessage('account-message',err.message||t.badLogin,'error')}
    });
    document.getElementById('account-signup')?.addEventListener('click',async()=>{
      setMessage('account-message',t.loading);
      try{
        const email=document.getElementById('account-email').value.trim(); const password=document.getElementById('account-password').value;
        if(!email||password.length<6)throw new Error(t.badLogin);
        const r=await fetch(`${base}/auth/v1/signup`,{method:'POST',headers:apiHeaders(null),body:JSON.stringify({email,password})});
        const d=await r.json(); if(!r.ok)throw new Error(d?.msg||d?.message||t.badLogin);
        const s=normalizeSession(d); if(s){saveSession(s);await render()} else setMessage('account-message',t.created,'ok');
      }catch(err){setMessage('account-message',err.message||t.badLogin,'error')}
    });
    document.getElementById('account-google')?.addEventListener('click',()=>{
      const redirect=location.origin+projectBase+'account/';
      location.href=`${base}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirect)}`;
    });
  }

  function wireDashboard(t,backendReady){
    document.getElementById('account-logout')?.addEventListener('click',async()=>{
      try{await fetch(`${base}/auth/v1/logout`,{method:'POST',headers:apiHeaders(session.access_token,false)})}catch{}
      saveSession(null); summary=null; render();
    });
    document.getElementById('account-add-app')?.addEventListener('submit',async e=>{
      e.preventDefault(); if(!backendReady)return;
      const track=document.getElementById('account-track-id').value.trim().toUpperCase(); const name=document.getElementById('account-app-name').value.trim();
      if(!/^IL-TRK-[0-9A-F]{24}$/.test(track)){setMessage('project-message',t.invalidTrack,'error');return}
      setMessage('project-message',t.loading);
      try{await registerProject(track,name);setMessage('project-message',t.registered,'ok');setTimeout(render,250)}catch(err){setMessage('project-message',err.message||t.backendError,'error')}
    });
    document.querySelectorAll('[data-remove-track]').forEach(btn=>btn.addEventListener('click',async()=>{
      if(!backendReady)return; const track=btn.dataset.removeTrack; btn.disabled=true;
      try{await removeProject(track);await render()}catch{btn.disabled=false}
    }));
  }

  consumeOAuthHash();
  if (!base || !anon) {
    if (root()) root().innerHTML='<section class="account-shell"><div class="account-note">InstallerLab Analytics configuration is unavailable.</div></section>';
    return;
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',render,{once:true}); else setTimeout(render,0);
  window.addEventListener('storage',e=>{if(e.key===sessionKey||e.key==='il-lang')render()});
})();
