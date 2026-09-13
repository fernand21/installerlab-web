(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'account') return;

  const cfg = window.INSTALLERLAB_ANALYTICS_CONFIG || {};
  const base = String(cfg.url || '').replace(/\/$/, '');
  const anon = String(cfg.publishableKey || '');
  const sessionKey = 'installerlab-account-session-v1';
  const pendingKey = 'installerlab-drive-oauth-pending';
  const projectBase = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  const driveScope = 'https://www.googleapis.com/auth/drive.file';
  const oauth = location.hash.startsWith('#') ? new URLSearchParams(location.hash.slice(1)) : new URLSearchParams();
  const googleAccess = oauth.get('provider_token') || '';
  const googleRefresh = oauth.get('provider_' + 'refresh_token') || '';
  const wasPending = sessionStorage.getItem(pendingKey) === '1';

  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const copy = () => es() ? {
    connect:'Conectar Google Drive', reconnect:'Reconectar Google Drive', open:'Abrir carpeta InstallerLab',
    ready:'Google Drive conectado. InstallerLab creó la estructura de carpetas.',
    fail:'No se pudo conectar Google Drive.', layout:'InstallerLab → carpeta por aplicación/TrackID → hoja de Analytics.'
  } : {
    connect:'Connect Google Drive', reconnect:'Reconnect Google Drive', open:'Open InstallerLab folder',
    ready:'Google Drive connected. InstallerLab created the folder structure.',
    fail:'Google Drive could not be connected.', layout:'InstallerLab → one folder per application/TrackID → Analytics spreadsheet.'
  };

  function session() {
    try { return JSON.parse(localStorage.getItem(sessionKey) || 'null'); } catch { return null; }
  }

  async function edge(name, payload) {
    const s = session();
    if (!s?.access_token) throw new Error('InstallerLab session missing');
    const r = await fetch(`${base}/functions/v1/${name}`, {
      method:'POST',
      headers:{ Authorization:`Bearer ${s.access_token}`, apikey:anon, 'Content-Type':'application/json' },
      body:JSON.stringify(payload || {}),
      cache:'no-store'
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data?.error || `HTTP ${r.status}`);
    return data;
  }

  function toast(message, bad=false) {
    let n = document.getElementById('installerlab-drive-toast');
    if (!n) {
      n = document.createElement('div'); n.id='installerlab-drive-toast';
      n.style.cssText='position:fixed;right:22px;bottom:22px;z-index:99999;max-width:430px;padding:14px 16px;border-radius:14px;background:#0d2037;color:#eaf4ff;border:1px solid #2d79ba;box-shadow:0 18px 50px rgba(0,0,0,.35);font:600 14px/1.45 system-ui,sans-serif';
      document.body.appendChild(n);
    }
    n.textContent = message;
    n.style.borderColor = bad ? '#c65353' : '#2d79ba';
  }

  function startDriveOAuth() {
    sessionStorage.setItem(pendingKey,'1');
    const redirect = location.origin + projectBase + 'account/';
    const u = new URL(`${base}/auth/v1/authorize`);
    u.searchParams.set('provider','google');
    u.searchParams.set('redirect_to',redirect);
    u.searchParams.set('scopes',driveScope);
    u.searchParams.set('access_type','offline');
    u.searchParams.set('prompt','consent');
    u.searchParams.set('include_granted_scopes','true');
    location.href = u.toString();
  }

  async function getSummary() {
    return edge('account-api',{action:'summary'});
  }

  function findDriveCard() {
    return [...document.querySelectorAll('.account-card')].find(x => /google drive/i.test(x.querySelector('h2')?.textContent || '')) || null;
  }

  async function decorate() {
    const card = findDriveCard();
    if (!card || card.dataset.driveReady === '1' || !session()?.access_token) return;
    let data; try { data = await getSummary(); } catch { return; }
    card.dataset.driveReady='1';
    const d = data?.drive || {};
    const connected = Boolean(d.connected && d.root_folder_id);
    const x = copy();
    const status = card.querySelector('.account-status');
    if (status) status.innerHTML = `<i></i>${connected ? (es()?'Conectado':'Connected') : (es()?'No conectado':'Not connected')}`;
    const note = card.querySelector('.account-note'); if (note) note.textContent = x.layout;
    const btn = card.querySelector('button.account-btn');
    if (btn) { btn.disabled=false; btn.textContent=connected?x.reconnect:x.connect; btn.onclick=startDriveOAuth; }
    if (connected && !card.querySelector('.drive-open-link')) {
      const a=document.createElement('a'); a.className='account-btn primary drive-open-link'; a.target='_blank'; a.rel='noopener noreferrer';
      a.href=`https://drive.google.com/drive/folders/${encodeURIComponent(d.root_folder_id)}`; a.textContent=x.open;
      (card.querySelector('.account-drive') || card).appendChild(a);
    }
  }

  async function complete() {
    if (!wasPending) return;
    if (!googleAccess) { sessionStorage.removeItem(pendingKey); toast(copy().fail,true); return; }
    for (let i=0;i<30 && !session()?.access_token;i++) await new Promise(r=>setTimeout(r,100));
    try {
      await edge('drive-api',{ action:'connect', provider_token:googleAccess, provider_refresh_token:googleRefresh });
      sessionStorage.removeItem(pendingKey);
      toast(copy().ready);
      setTimeout(()=>location.reload(),700);
    } catch(e) {
      sessionStorage.removeItem(pendingKey);
      toast(`${copy().fail} ${e?.message || ''}`.trim(),true);
    }
  }

  let busy=false;
  function schedule(){ if(busy)return; busy=true; requestAnimationFrame(async()=>{busy=false; await decorate();}); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{complete();schedule();},{once:true});
  else { complete(); schedule(); }
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();
