(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'account') return;

  const cfg = window.INSTALLERLAB_ANALYTICS_CONFIG || {};
  const base = String(cfg.url || '').replace(/\/$/, '');
  const anon = String(cfg.publishableKey || '');
  const sessionKey = 'installerlab-account-session-v1';
  const pendingKey = 'installerlab-drive-oauth-pending';
  const providerKey = 'installerlab-drive-provider-token';
  const projectBase = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  const driveScope = 'https://www.googleapis.com/auth/drive.file';
  const oauth = location.hash.startsWith('#') ? new URLSearchParams(location.hash.slice(1)) : new URLSearchParams();
  const googleAccess = oauth.get('provider_token') || '';
  const googleRefresh = oauth.get('provider_' + 'refresh_token') || '';
  const pendingMode = sessionStorage.getItem(pendingKey) || '';

  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const copy = () => es() ? {
    connect:'Conectar Google Drive', reconnect:'Reconectar Google Drive', open:'Abrir carpeta InstallerLab', sync:'Sincronizar ahora', syncing:'Sincronizando…',
    ready:'Google Drive conectado. InstallerLab creó la estructura de carpetas.', fail:'No se pudo conectar Google Drive.', syncFail:'No se pudo sincronizar con Google Drive.',
    layout:'Drive conserva el histórico permanente; Supabase mantiene temporalmente los eventos recientes.', synced:'Todo está sincronizado', pending:n=>`${n} evento${n===1?'':'s'} pendiente${n===1?'':'s'} de sincronizar`,
    never:'Nunca', last:'Última sincronización', auto:'Acceso automático a Drive preparado', reauth:'Puede requerir reconexión para sincronizar automáticamente.'
  } : {
    connect:'Connect Google Drive', reconnect:'Reconnect Google Drive', open:'Open InstallerLab folder', sync:'Sync now', syncing:'Syncing…',
    ready:'Google Drive connected. InstallerLab created the folder structure.', fail:'Google Drive could not be connected.', syncFail:'Google Drive synchronization failed.',
    layout:'Drive keeps the permanent history; Supabase temporarily holds recent events.', synced:'Everything is synchronized', pending:n=>`${n} event${n===1?'':'s'} waiting to sync`,
    never:'Never', last:'Last synchronization', auto:'Automatic Drive access is ready', reauth:'Reconnect may be required for automatic synchronization.'
  };

  function session(){ try{return JSON.parse(localStorage.getItem(sessionKey)||'null');}catch{return null;} }
  function providerToken(){ return sessionStorage.getItem(providerKey) || ''; }

  async function edge(name,payload){
    const s=session(); if(!s?.access_token) throw new Error('InstallerLab session missing');
    const r=await fetch(`${base}/functions/v1/${name}`,{method:'POST',headers:{Authorization:`Bearer ${s.access_token}`,apikey:anon,'Content-Type':'application/json'},body:JSON.stringify(payload||{}),cache:'no-store'});
    const data=await r.json().catch(()=>({}));
    if(!r.ok){const e=new Error(data?.error||`HTTP ${r.status}`);e.code=data?.code||'';e.status=r.status;throw e;}
    return data;
  }

  function toast(message,bad=false){
    let n=document.getElementById('installerlab-drive-toast');
    if(!n){n=document.createElement('div');n.id='installerlab-drive-toast';n.style.cssText='position:fixed;right:22px;bottom:22px;z-index:99999;max-width:430px;padding:14px 16px;border-radius:14px;background:#0d2037;color:#eaf4ff;border:1px solid #2d79ba;box-shadow:0 18px 50px rgba(0,0,0,.35);font:600 14px/1.45 system-ui,sans-serif';document.body.appendChild(n);}
    n.textContent=message;n.style.borderColor=bad?'#c65353':'#2d79ba';
  }

  function startDriveOAuth(mode='connect'){
    sessionStorage.setItem(pendingKey,mode);
    const redirect=location.origin+projectBase+'account/';
    const u=new URL(`${base}/auth/v1/authorize`);
    u.searchParams.set('provider','google');u.searchParams.set('redirect_to',redirect);u.searchParams.set('scopes',driveScope);u.searchParams.set('access_type','offline');u.searchParams.set('prompt','consent');u.searchParams.set('include_granted_scopes','true');
    location.href=u.toString();
  }

  function findDriveCard(){return [...document.querySelectorAll('.account-card')].find(x=>/google drive/i.test(x.querySelector('h2')?.textContent||''))||null;}
  function fmt(value){if(!value)return copy().never;try{return new Intl.DateTimeFormat(es()?'es-EC':'en-US',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));}catch{return value;}}

  function renderStatus(card,data){
    const x=copy(),d=data?.drive||{},connected=Boolean(data?.connected),pending=Number(data?.pending_count||0),projects=Array.isArray(data?.projects)?data.projects:[];
    const latest=projects.map(p=>p.last_archive_at).filter(Boolean).sort().pop()||null;
    const status=card.querySelector('.account-status');
    if(status){status.className=`account-status ${connected?'ok':'warn'}`;status.innerHTML=`<i></i>${connected?(es()?'Conectado':'Connected'):(es()?'No conectado':'Not connected')}`;}
    const note=card.querySelector('.account-note');if(note)note.textContent=x.layout;
    const connectBtn=card.querySelector('button.account-btn');if(connectBtn){connectBtn.disabled=false;connectBtn.textContent=connected?x.reconnect:x.connect;connectBtn.onclick=()=>startDriveOAuth('connect');}
    let panel=card.querySelector('.drive-sync-panel');
    if(!panel){panel=document.createElement('div');panel.className='drive-sync-panel';(card.querySelector('.account-drive')||card).appendChild(panel);}
    panel.innerHTML=`<div class="drive-sync-state ${pending?'pending':'synced'}"><strong>${pending?x.pending(pending):x.synced}</strong><span>${x.last}: ${fmt(latest)}</span><small>${data?.server_refresh_ready?x.auto:x.reauth}</small></div><button type="button" class="account-btn primary drive-sync-button" ${connected?'':'disabled'}>${x.sync}</button>`;
    panel.querySelector('.drive-sync-button')?.addEventListener('click',()=>syncNow(card));
    let open=card.querySelector('.drive-open-link');
    if(connected&&d.root_folder_id){if(!open){open=document.createElement('a');open.className='account-btn drive-open-link';open.target='_blank';open.rel='noopener noreferrer';(card.querySelector('.account-drive')||card).appendChild(open);}open.href=`https://drive.google.com/drive/folders/${encodeURIComponent(d.root_folder_id)}`;open.textContent=x.open;}else open?.remove();
  }

  async function refreshStatus(card=findDriveCard()){
    if(!card||!session()?.access_token)return;
    try{const data=await edge('drive-archive',{action:'status'});renderStatus(card,data);card.dataset.driveReady='1';}catch(e){console.warn('[InstallerLab Drive status]',e);}
  }

  async function syncNow(card=findDriveCard()){
    if(!card)return;const x=copy(),btn=card.querySelector('.drive-sync-button');if(btn){btn.disabled=true;btn.textContent=x.syncing;}
    try{const data=await edge('drive-archive',{action:'sync',provider_token:providerToken()||undefined});toast(data.pending_count?x.pending(Number(data.pending_count)):x.synced);await refreshStatus(card);}
    catch(e){if(e?.code==='DRIVE_REAUTH_REQUIRED'){startDriveOAuth('sync');return;}toast(`${x.syncFail} ${e?.message||''}`.trim(),true);if(btn){btn.disabled=false;btn.textContent=x.sync;}}
  }

  async function completeOAuth(){
    if(!pendingMode)return;
    if(!googleAccess){sessionStorage.removeItem(pendingKey);toast(copy().fail,true);return;}
    sessionStorage.setItem(providerKey,googleAccess);
    for(let i=0;i<30&&!session()?.access_token;i++)await new Promise(r=>setTimeout(r,100));
    try{
      await edge('drive-api',{action:'connect',provider_token:googleAccess,provider_refresh_token:googleRefresh});
      if(pendingMode==='sync')await edge('drive-archive',{action:'sync',provider_token:googleAccess});
      sessionStorage.removeItem(pendingKey);toast(pendingMode==='sync'?copy().synced:copy().ready);setTimeout(()=>location.reload(),650);
    }catch(e){sessionStorage.removeItem(pendingKey);toast(`${pendingMode==='sync'?copy().syncFail:copy().fail} ${e?.message||''}`.trim(),true);}
  }

  let busy=false;
  function schedule(){if(busy)return;busy=true;requestAnimationFrame(async()=>{busy=false;const card=findDriveCard();if(card&&!card.dataset.driveReady)await refreshStatus(card);});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{completeOAuth();schedule();},{once:true});else{completeOAuth();schedule();}
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();
