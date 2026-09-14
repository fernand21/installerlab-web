(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const endpoint = 'https://b4xapp.com/aplicaciones/installerlab/installerlab.php';
  const params = new URLSearchParams(location.search);
  let trackId = (params.get('trackId') || params.get('track') || '').trim().toUpperCase();
  let controller = null;
  let serial = 0;
  let cache = null;
  let cacheKey = '';
  let cacheAt = 0;
  const REQUEST_TIMEOUT_MS = 8000;

  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const copy = () => es() ? {
    connect:'Conectar aplicación', connected:'MySQL', loading:'Cargando…', pending:'Selecciona una aplicación',
    errorLabel:'Sin conexión', emptyLabel:'Sin datos', timeout:'El servidor tardó demasiado en responder.',
    error:'No se pudieron cargar los datos de Analytics.', prompt:'Introduce el TrackID del proyecto',
    invalid:'Introduce un TrackID válido.', banner:'Analytics conectado', live:'MYSQL',
    history:'Histórico permanente en MySQL', noData:'No hay datos para este periodo.', events:'eventos'
  } : {
    connect:'Connect application', connected:'MySQL', loading:'Loading…', pending:'Select an application',
    errorLabel:'Connection unavailable', emptyLabel:'No data', timeout:'The server took too long to respond.',
    error:'Analytics data could not be loaded.', prompt:'Enter the project TrackID',
    invalid:'Enter a valid TrackID.', banner:'Analytics connected', live:'MYSQL',
    history:'Permanent history in MySQL', noData:'No data for this period.', events:'events'
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function notice(){
    let n=document.querySelector('.iax-live-notice');
    if(n)return n;
    const w=document.querySelector('.iax-workspace');
    if(!w)return null;
    n=document.createElement('div');
    n.className='iax-live-notice';
    n.setAttribute('role','status');
    w.insertBefore(n,w.firstElementChild);
    return n;
  }

  function labelFor(state){
    const t=copy();
    if(state==='connected') return t.connected;
    if(state==='loading') return t.loading;
    if(state==='empty') return t.emptyLabel;
    if(state==='error') return t.errorLabel;
    return t.pending;
  }

  function status(state,message=''){
    const t=copy();
    const label=labelFor(state);
    const backend=document.querySelector('.iax-backend');
    if(backend) backend.innerHTML=`<i></i>${esc(label)}`;
    const side=document.querySelector('.iax-side-status small');
    if(side) side.textContent=label;
    const title=document.querySelector('.iax-app-title span');
    if(title) title.textContent=(state==='connected'||state==='empty')?t.live:label;
    const banner=document.querySelector('.iax-connect-banner');
    if(state==='connected'||state==='empty'){
      const b=banner?.querySelector('strong');
      if(b)b.textContent=state==='empty'?t.noData:t.banner;
    }
    document.querySelector('.iax-app')?.classList.toggle('live-connected',state==='connected'||state==='empty');
    const n=notice();
    if(n){
      n.className=`iax-live-notice ${state==='empty'?'connected':state}`;
      n.textContent=message;
      n.hidden=!message;
    }
  }

  function range(){
    const i=document.querySelector('.iax-filterbar select')?.selectedIndex||0;
    if(i===3)return null;
    return new Date(Date.now()-(i===2?90:i===1?30:7)*86400000).toISOString();
  }

  function key(){return `${trackId}|${document.querySelector('.iax-filterbar select')?.selectedIndex||0}`;}

  function emptySummary(extra={}){
    return {
      ok:true,
      storage_mode:'mysql',
      event_count:0,
      installs:0,
      started:0,
      successful:0,
      failed:0,
      uninstalls:0,
      launches:0,
      active_installs:0,
      unique_installs:0,
      success_rate:0,
      avg_install_duration_ms:0,
      versions:[], platforms:[], windows:[], packages:[], languages:[], errors:[], recent_events:[],
      ...extra
    };
  }

  function normalize(data){
    if(!data || typeof data!=='object') return emptySummary();
    const d={...emptySummary(),...data};
    for(const k of ['versions','platforms','windows','packages','languages','errors','recent_events']){
      if(!Array.isArray(d[k])) d[k]=[];
    }
    d.event_count=Number.isFinite(Number(d.event_count))?Number(d.event_count):d.recent_events.length;
    return d;
  }

  function publish(data){
    const normalized=normalize(data);
    window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY=normalized;
    window.INSTALLERLAB_ANALYTICS_TRACK_ID=trackId;
    window.dispatchEvent(new CustomEvent('installerlab:analytics-summary',{detail:{data:normalized,trackId}}));
  }

  function sourceMessage(data){
    const n=Number(data?.event_count ?? data?.recent_events?.length ?? 0);
    return `${copy().history} · ${n} ${copy().events}`;
  }

  async function fetchSummary(signal){
    const u=new URL(endpoint);
    u.searchParams.set('action','analytics');
    u.searchParams.set('track_id',trackId);
    u.searchParams.set('to',new Date().toISOString());
    const from=range();
    if(from)u.searchParams.set('from',from);

    let r;
    try{
      r=await fetch(u.toString(),{signal,cache:'no-store',mode:'cors'});
    }catch(err){
      const e=new Error(err?.name==='AbortError'?copy().timeout:copy().error);
      e.code=err?.name==='AbortError'?'TIMEOUT':'NETWORK_ERROR';
      throw e;
    }

    const raw=await r.text();
    let d={};
    try{d=raw?JSON.parse(raw):{};}catch{
      const e=new Error(copy().error);
      e.code='INVALID_JSON';
      throw e;
    }
    if(!r.ok){
      const e=new Error(d?.error||d?.response||copy().error);
      e.code=d?.code||`HTTP_${r.status}`;
      throw e;
    }
    return normalize(d);
  }

  async function refresh(force=false){
    wire();
    if(!trackId){
      publish(emptySummary());
      status('pending');
      return;
    }

    const k=key();
    if(!force&&cache&&cacheKey===k&&Date.now()-cacheAt<30000){
      const count=Number(cache.event_count||0);
      status(count>0?'connected':'empty',count>0?sourceMessage(cache):copy().noData);
      publish(cache);
      return;
    }

    controller?.abort();
    controller=new AbortController();
    const thisController=controller;
    const n=++serial;
    const timer=setTimeout(()=>thisController.abort(),REQUEST_TIMEOUT_MS);
    status('loading',copy().loading);

    try{
      const d=await fetchSummary(thisController.signal);
      if(n!==serial)return;
      cache=d;
      cacheKey=k;
      cacheAt=Date.now();
      const count=Number(d.event_count||0);
      status(count>0?'connected':'empty',count>0?sourceMessage(d):copy().noData);
      publish(d);
    }catch(e){
      if(n!==serial)return;
      console.warn('[InstallerLab Analytics MySQL]',e);
      cache=null;
      publish(emptySummary({unavailable:true,error_code:e?.code||'UNKNOWN'}));
      status('error',e?.message||copy().error);
    }finally{
      clearTimeout(timer);
    }
  }

  function choose(){
    const t=copy();
    const v=window.prompt(t.prompt,trackId||'');
    if(v===null)return;
    const clean=v.trim().toUpperCase();
    if(!/^IL-TRK-[0-9A-F]{24}$/.test(clean)){
      status('error',t.invalid);
      return;
    }
    trackId=clean;
    cache=null;
    const u=new URL(location.href);
    u.searchParams.set('trackId',clean);
    u.searchParams.delete('track');
    history.pushState({trackId:clean},'',u);
    wire();
    refresh(true);
  }

  function wire(){
    document.querySelectorAll('.iax-connect-banner button,.iax-side-foot button,.iax-picker').forEach(b=>{
      if(b.dataset.mysqlLive!=='1'){
        b.dataset.mysqlLive='1';
        b.addEventListener('click',choose);
      }
      b.disabled=false;
    });
    const p=document.querySelector('.iax-picker span');
    if(p)p.textContent=trackId?`TrackID ${trackId}`:copy().connect;
  }

  document.addEventListener('change',e=>{if(e.target.closest('.iax-filterbar')){cache=null;refresh(true);}});
  document.addEventListener('click',e=>{if(e.target.closest('.iax-sidebar nav button'))setTimeout(()=>publish(cache||emptySummary()),0);});
  window.addEventListener('popstate',()=>{
    const p=new URLSearchParams(location.search);
    trackId=(p.get('trackId')||p.get('track')||'').trim().toUpperCase();
    cache=null;
    refresh(true);
  });
  const root=document.getElementById('app');
  if(root)new MutationObserver(()=>requestAnimationFrame(wire)).observe(root,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>refresh(false),{once:true});
  else refresh(false);
})();
