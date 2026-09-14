(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const endpoint = 'https://b4xapp.com/aplicaciones/installerlab/installerlab.php';
  const sessionKey = 'installerlab-account-session-v1';
  const params = new URLSearchParams(location.search);
  let trackId = (params.get('trackId') || params.get('track') || '').trim().toUpperCase();
  let controller = null;
  let serial = 0;
  let cache = null;
  let cacheKey = '';
  let cacheAt = 0;

  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const copy = () => es() ? {
    connect:'Conectar aplicación', connected:'MySQL', pending:'Cuenta requerida', loading:'Cargando historial…',
    error:'No se pudieron cargar los datos de Analytics.', prompt:'Introduce el TrackID del proyecto',
    invalid:'Introduce un TrackID válido.', login:'Inicia sesión para consultar Analytics.',
    banner:'Analytics conectado', live:'MYSQL', history:'Histórico permanente en MySQL'
  } : {
    connect:'Connect application', connected:'MySQL', pending:'Account required', loading:'Loading history…',
    error:'Analytics data could not be loaded.', prompt:'Enter the project TrackID',
    invalid:'Enter a valid TrackID.', login:'Sign in to view Analytics.',
    banner:'Analytics connected', live:'MYSQL', history:'Permanent history in MySQL'
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function session(){ try { return JSON.parse(localStorage.getItem(sessionKey) || 'null'); } catch { return null; } }
  function notice(){ let n=document.querySelector('.iax-live-notice'); if(n)return n; const w=document.querySelector('.iax-workspace'); if(!w)return null; n=document.createElement('div'); n.className='iax-live-notice'; n.setAttribute('role','status'); w.insertBefore(n,w.firstElementChild); return n; }

  function status(state,message=''){
    const t=copy();
    const label=state==='connected'?t.connected:state==='loading'?t.loading:t.pending;
    const backend=document.querySelector('.iax-backend'); if(backend) backend.innerHTML=`<i></i>${esc(label)}`;
    const side=document.querySelector('.iax-side-status small'); if(side) side.textContent=label;
    const title=document.querySelector('.iax-app-title span'); if(title) title.textContent=state==='connected'?t.live:label;
    const banner=document.querySelector('.iax-connect-banner'); if(state==='connected'){const b=banner?.querySelector('strong'); if(b)b.textContent=t.banner;}
    document.querySelector('.iax-app')?.classList.toggle('live-connected',state==='connected');
    const n=notice(); if(n){n.className=`iax-live-notice ${state}`; n.textContent=message; n.hidden=!message;}
  }

  function range(){ const i=document.querySelector('.iax-filterbar select')?.selectedIndex||0; if(i===3)return null; return new Date(Date.now()-(i===2?90:i===1?30:7)*86400000).toISOString(); }
  function key(){ return `${trackId}|${document.querySelector('.iax-filterbar select')?.selectedIndex||0}`; }
  function publish(data){ window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY=data; window.INSTALLERLAB_ANALYTICS_TRACK_ID=trackId; window.dispatchEvent(new CustomEvent('installerlab:analytics-summary',{detail:{data,trackId}})); }
  function sourceMessage(data){ return `${copy().history} · ${Number(data?.event_count ?? data?.recent_events?.length ?? 0)} events`; }

  async function fetchSummary(signal){
    const s=session();
    if(!s?.access_token){ const e=new Error(copy().login); e.code='LOGIN_REQUIRED'; throw e; }
    const u=new URL(endpoint);
    u.searchParams.set('action','analytics');
    u.searchParams.set('track_id',trackId);
    u.searchParams.set('to',new Date().toISOString());
    const from=range(); if(from)u.searchParams.set('from',from);
    const r=await fetch(u.toString(),{headers:{Authorization:`Bearer ${s.access_token}`},signal,cache:'no-store'});
    const d=await r.json().catch(()=>({}));
    if(!r.ok){ const e=new Error(d?.error||d?.response||copy().error); e.code=d?.code||''; throw e; }
    return d;
  }

  async function refresh(force=false){
    wire();
    if(!trackId){status('pending');return;}
    const k=key();
    if(!force&&cache&&cacheKey===k&&Date.now()-cacheAt<30000){status('connected',sourceMessage(cache));publish(cache);return;}
    controller?.abort(); controller=new AbortController(); const n=++serial; status('loading',copy().loading);
    try{ const d=await fetchSummary(controller.signal); if(n!==serial)return; cache=d; cacheKey=k; cacheAt=Date.now(); status('connected',sourceMessage(d)); publish(d); }
    catch(e){ if(e?.name==='AbortError'||n!==serial)return; console.warn('[InstallerLab Analytics MySQL]',e); status('error',e.message||copy().error); }
  }

  function choose(){
    const t=copy();
    if(!session()?.access_token){location.href='../account/';return;}
    const v=window.prompt(t.prompt,trackId||''); if(v===null)return;
    const clean=v.trim().toUpperCase();
    if(!/^IL-TRK-[0-9A-F]{24}$/.test(clean)){status('error',t.invalid);return;}
    trackId=clean; cache=null;
    const u=new URL(location.href); u.searchParams.set('trackId',clean); u.searchParams.delete('track'); history.pushState({trackId:clean},'',u);
    wire(); refresh(true);
  }

  function wire(){
    document.querySelectorAll('.iax-connect-banner button,.iax-side-foot button,.iax-picker').forEach(b=>{if(b.dataset.mysqlLive!=='1'){b.dataset.mysqlLive='1';b.addEventListener('click',choose)}b.disabled=false;});
    const p=document.querySelector('.iax-picker span'); if(p)p.textContent=trackId?`TrackID ${trackId}`:copy().connect;
  }

  document.addEventListener('change',e=>{if(e.target.closest('.iax-filterbar')){cache=null;refresh(true)}});
  document.addEventListener('click',e=>{if(e.target.closest('.iax-sidebar nav button'))setTimeout(()=>cache&&publish(cache),0)});
  window.addEventListener('popstate',()=>{const p=new URLSearchParams(location.search);trackId=(p.get('trackId')||p.get('track')||'').trim().toUpperCase();cache=null;refresh(true)});
  window.addEventListener('storage',()=>refresh(false));
  const root=document.getElementById('app'); if(root)new MutationObserver(()=>requestAnimationFrame(wire)).observe(root,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>refresh(false),{once:true});else refresh(false);
})();
