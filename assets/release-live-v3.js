(() => {
  const API='https://api.github.com/repos/fernand21/installerlab-web/releases?per_page=100';
  const RELEASES='https://github.com/fernand21/installerlab-web/releases';
  const FALLBACK={tag_name:'v3.1.0',name:'InstallerLab v3.1.0 — CLI Fixes & Bundle Improvements',html_url:'https://github.com/fernand21/installerlab-web/releases/tag/v3.1.0',published_at:'2026-09-12T19:26:27Z',assets:[
    {name:'InstallerLab-Setup.exe',size:512619520,download_count:0,digest:'sha256:83b1e2852f1a292b0790acc73d1e1f1f95a60b46107d3a60a13c4b1420405165',browser_download_url:'https://github.com/fernand21/installerlab-web/releases/download/v3.1.0/InstallerLab-Setup.exe'},
    {name:'InstallerLab-Setup.msi',size:405644551,download_count:0,digest:'sha256:8128e9acb41bd389be4e485bf3d29b80e3790827ec2797c150550e1d81322c3b',browser_download_url:'https://github.com/fernand21/installerlab-web/releases/download/v3.1.0/InstallerLab-Setup.msi'},
    {name:'InstallerLab_Bundle.exe',size:409016400,download_count:0,digest:'sha256:923244f5ae73d5e45b4ac71c83d8de35a0534b6d5bd3fb233f8664b87c136068',browser_download_url:'https://github.com/fernand21/installerlab-web/releases/download/v3.1.0/InstallerLab_Bundle.exe'},
    {name:'InstallerLab_Portable.exe',size:413036032,download_count:0,digest:'sha256:dad8edb3c71cd0081d732619b881d5ead31374dc81b35f17cff8d6aa3cd97dc5',browser_download_url:'https://github.com/fernand21/installerlab-web/releases/download/v3.1.0/InstallerLab_Portable.exe'}]};
  let promise=null,queued=false;
  const lang=()=>((localStorage.getItem('il-lang')||'es').toLowerCase()==='en'?'en':'es');
  const fmt=n=>new Intl.NumberFormat(lang()).format(Number(n||0));
  const size=n=>n?`${(n/1024/1024).toFixed(2)} MB`:'—';
  const date=v=>v?new Intl.DateTimeFormat(lang(),{year:'numeric',month:'long',day:'numeric'}).format(new Date(v)):'';
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const isPortable=a=>/portable/i.test(a?.name||'')&&/\.exe$/i.test(a?.name||'');
  const isBundle=a=>/bundle/i.test(a?.name||'')&&/\.exe$/i.test(a?.name||'');
  const isMsi=a=>/\.msi$/i.test(a?.name||'');
  const isSetup=a=>/\.exe$/i.test(a?.name||'')&&!isPortable(a)&&!isBundle(a);
  const digest=a=>a?.digest?a.digest.replace(/^sha256:/i,''):'';
  const version=r=>(r?.tag_name||'').replace(/^v/i,'')||'3.1.0';

  function latest(releases){
    const stable=(releases||[]).filter(r=>!r.draft&&!r.prerelease);
    if(!stable.length)return FALLBACK;
    return stable.slice().sort((a,b)=>new Date(b.published_at||b.created_at||0)-new Date(a.published_at||a.created_at||0))[0]||FALLBACK;
  }

  function getData(){
    if(promise)return promise;
    promise=fetch(API,{headers:{Accept:'application/vnd.github+json'}})
      .then(r=>r.ok?r.json():Promise.reject())
      .then(list=>{
        const releases=(Array.isArray(list)?list:[]).filter(r=>!r.draft&&!r.prerelease)
          .sort((a,b)=>new Date(b.published_at||b.created_at||0)-new Date(a.published_at||a.created_at||0));
        if(!releases.length)throw 0;
        return{releases,live:true};
      })
      .catch(()=>({releases:[FALLBACK],live:false}));
    return promise;
  }

  function stats(releases){
    const out={total:0,setup:0,bundle:0,portable:0,msi:0};
    releases.forEach(r=>(r.assets||[]).forEach(a=>{
      const n=Number(a.download_count||0); out.total+=n;
      if(isPortable(a))out.portable+=n; else if(isBundle(a))out.bundle+=n; else if(isMsi(a))out.msi+=n; else if(isSetup(a))out.setup+=n;
    }));
    return out;
  }

  function updateStructuredData(current,setup){
    const v=version(current);
    const data={
      '@context':'https://schema.org','@type':'SoftwareApplication',name:'InstallerLab',applicationCategory:'DeveloperApplication',operatingSystem:'Windows',softwareVersion:v,isAccessibleForFree:true,url:'https://installerlab.website/',downloadUrl:setup?.browser_download_url||current.html_url||RELEASES,offers:{'@type':'Offer',price:'0',priceCurrency:'USD'}
    };
    let node=document.getElementById('installerlab-software-schema')||document.querySelector('script[type="application/ld+json"]');
    if(node)node.textContent=JSON.stringify(data);
  }

  function card(asset,type,title,copy,count,badge=''){
    if(!asset)return''; const l=lang();
    return `<article class="release-card${badge==='recommended'?' recommended':''}">${badge?`<span class="tag">${badge==='recommended'?(l==='es'?'RECOMENDADO':'RECOMMENDED'):'V3'}</span>`:''}<div class="file-type">${type}</div><h3>${title}</h3><p>${copy}</p><div class="release-meta"><span>${l==='es'?'Archivo':'File'} <strong>${esc(asset.name)}</strong></span><span>${l==='es'?'Tamaño':'Size'} <strong>${size(asset.size)}</strong></span><span>${l==='es'?'Descargas':'Downloads'} <strong>↓ ${fmt(count)}</strong></span></div><a class="release-download" href="${esc(asset.browser_download_url)}">${l==='es'?'Descargar directamente':'Direct download'} ↓</a>${digest(asset)?`<div class="release-hash" title="SHA-256">SHA-256 · ${digest(asset)}</div>`:''}</article>`;
  }

  function renderDownload(releases,live){
    if(document.body.dataset.page!=='download')return;
    const main=document.querySelector('main.content'); if(!main)return;
    const current=latest(releases),v=version(current),st=stats(releases),assets=current.assets||[],l=lang();
    const setup=assets.find(isSetup),bundle=assets.find(isBundle),portable=assets.find(isPortable),msi=assets.find(isMsi);
    document.title=`Download InstallerLab v${v} — Setup EXE, Bundle, Portable & MSI`;
    updateStructuredData(current,setup);
    const hero=document.querySelector('.page-hero .shell');
    if(hero)hero.innerHTML=l==='es'?`<span class="eyebrow">Descargas</span><h1>InstallerLab v${esc(v)}</h1><p>Setup EXE, Bundle, Portable EXE y MSI oficiales de la versión actual, con tamaños, SHA-256 y contadores sincronizados con GitHub Releases.</p>`:`<span class="eyebrow">Downloads</span><h1>InstallerLab v${esc(v)}</h1><p>Official current Setup EXE, Bundle, Portable EXE and MSI downloads with sizes, SHA-256 and counters synchronized with GitHub Releases.</p>`;
    main.innerHTML=`<div class="release-live"><section class="release-hero"><div class="release-panel"><span class="release-kicker"><i></i>${l==='es'?'Versión pública actual':'Current public release'}</span><h2>${esc(current.name||current.tag_name)}</h2><p>${l==='es'?'La página toma automáticamente la última release pública estable de GitHub y muestra sus cuatro formatos oficiales.':'This page automatically follows the latest public stable GitHub release and shows its four official formats.'}</p><div class="release-links"><a class="button" href="${esc(current.html_url||RELEASES)}" target="_blank" rel="noopener">${l==='es'?`Ver v${esc(v)} en GitHub ↗`:`View v${esc(v)} on GitHub ↗`}</a><a class="button" href="${RELEASES}" target="_blank" rel="noopener">${l==='es'?'Todas las versiones ↗':'All releases ↗'}</a></div></div><aside class="release-summary"><div class="release-total">↓ ${fmt(st.total)}</div><div class="release-total-label">${l==='es'?'descargas totales de archivos oficiales':'total official asset downloads'}</div><div class="release-version-line"><span>${l==='es'?'Publicada':'Published'} <strong>${date(current.published_at)}</strong></span><span>${live?'GitHub API · live':(l==='es'?'Datos de respaldo':'fallback data')}</span></div></aside></section><section class="release-grid">
      ${card(setup,'EXE','Setup EXE',l==='es'?'Recomendado para una instalación normal.':'Recommended for a normal installation.',st.setup,'recommended')}
      ${card(bundle,'BUNDLE','Bundle EXE',l==='es'?'Bootstrapper WiX Burn de InstallerLab.':'InstallerLab WiX Burn bootstrapper.',st.bundle,'new')}
      ${card(portable,'EXE','Portable EXE',l==='es'?'Ejecuta InstallerLab sin instalación tradicional.':'Runs InstallerLab without a traditional installation.',st.portable)}
      ${card(msi,'MSI',l==='es'?'Paquete MSI':'MSI package',l==='es'?'Windows Installer real generado por el backend WiX.':'Real Windows Installer package generated by the WiX backend.',st.msi)}
      </section><div class="release-note">${l==='es'?'<strong>Sincronización automática:</strong> cuando publiques una nueva release estable en GitHub, esta página usará esa versión y sus assets sin quedar fijada a v3.0.0.':'<strong>Automatic synchronization:</strong> when a new stable GitHub release is published, this page will follow that version and its assets instead of remaining pinned to v3.0.0.'}</div></div>`;
  }

  const H={
    'v3.1.0':{
      es:['Correcciones del flujo CLI headless y del resultado final de build.','Mejoras del backend Bundle y su integración con el ciclo MSI.','El éxito del CLI espera al artefacto solicitado antes de devolver el resultado.','Comportamiento más seguro para scripts, CI y herramientas externas.'],
      en:['Headless CLI build-flow and final-result fixes.','Bundle backend improvements and tighter MSI lifecycle integration.','CLI success waits for the requested artifact before reporting completion.','Safer behavior for scripts, CI and external tooling.']
    },
    'v3.0.0':{
      es:['Office Add-ins VBA para Excel, Word y PowerPoint como proyectos especializados.','QGIS Python Plugins desde carpeta/ZIP con perfil, PluginId y lifecycle especializado.','Smart Build Targets según ProjectType.','CLI headless para analyze, build y SBOM.','SBOM en CycloneDX y SPDX.','Firma Authenticode mediante SignTool.','Windows Services dentro del modelo FSS.','MSI y Bundle reutilizando la arquitectura especializada.'],
      en:['Specialized Excel, Word and PowerPoint VBA Office Add-in projects.','QGIS Python Plugins from folder/ZIP with profile, PluginId and specialized lifecycle.','Smart Build Targets based on ProjectType.','Headless CLI for analyze, build and SBOM.','CycloneDX and SPDX SBOM generation.','Authenticode signing through SignTool.','Windows Services in the FSS model.','MSI and Bundle reuse of specialized architecture.']
    },
    'v2.0.0':{es:['WiX Burn Bundle como salida de primera clase.','FSS Analyzer e importación ISS → FSS.','Mejoras del backend MSI y pipeline ZERO-TRASH.'],en:['First-class WiX Burn Bundle output.','FSS Analyzer and ISS → FSS import.','MSI backend improvements and ZERO-TRASH pipeline.']}
  };

  function generic(r){
    const lines=String(r.body||'').split(/\r?\n/).map(x=>x.trim()).filter(x=>/^[-*]\s+/.test(x)).map(x=>x.replace(/^[-*]\s+/,'').replace(/\*\*/g,'')).slice(0,8);
    return lines.length?lines:[lang()==='es'?'Consulta las notas completas en GitHub.':'See full notes on GitHub.'];
  }

  function renderChangelog(releases){
    if(document.body.dataset.page!=='changelog')return;
    const main=document.querySelector('main.content');if(!main)return;
    const current=latest(releases),v=version(current),l=lang();
    document.title=`InstallerLab v${v} — ${l==='es'?'historial de versiones':'release history'}`;
    const hero=document.querySelector('.page-hero .shell');
    if(hero)hero.innerHTML=l==='es'?`<span class="eyebrow">Versiones</span><h1>InstallerLab v${esc(v)} y versiones anteriores.</h1><p>Historial público con artefactos oficiales y cambios principales.</p>`:`<span class="eyebrow">Releases</span><h1>InstallerLab v${esc(v)} and previous releases.</h1><p>Public history with official assets and major changes.</p>`;
    main.innerHTML=`<div class="release-live"><div class="release-history">${releases.map((r,i)=>{const h=H[r.tag_name]?.[l]||generic(r),downloads=(r.assets||[]).reduce((n,a)=>n+Number(a.download_count||0),0);return `<article class="release-history-card"><div class="release-history-head"><div><h2>${esc(r.name||r.tag_name)}</h2><p>${date(r.published_at)} · ↓ ${fmt(downloads)} ${l==='es'?'descargas':'downloads'}</p></div>${r.tag_name===current.tag_name?`<span class="release-history-badge">${l==='es'?'ACTUAL':'CURRENT'}</span>`:''}</div><ul class="release-highlights">${h.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="release-assets-mini">${(r.assets||[]).map(a=>`<a href="${esc(a.browser_download_url)}">${esc(a.name)} · ${size(a.size)} · ↓ ${fmt(a.download_count)}</a>`).join('')}</div><div class="release-links"><a class="button" href="${esc(r.html_url)}" target="_blank" rel="noopener">${l==='es'?'Notas completas en GitHub ↗':'Full notes on GitHub ↗'}</a></div></article>`;}).join('')}</div></div>`;
  }

  function home(releases){
    if(document.body.dataset.page!=='home')return;
    const current=latest(releases),v=version(current),setup=(current.assets||[]).find(isSetup),st=stats(releases),actions=document.querySelector('.hero-actions');
    if(!actions)return;
    const primary=actions.querySelector('a.button.primary');
    if(primary&&setup){primary.href=setup.browser_download_url;primary.textContent=lang()==='es'?`Descargar v${v} →`:`Download v${v} →`;}
    updateStructuredData(current,setup);
    let counter=actions.querySelector('.home-live-counter');
    if(!counter){counter=document.createElement('span');counter.className='home-live-counter';actions.appendChild(counter);}
    counter.textContent=`↓ ${fmt(st.total)} ${lang()==='es'?'descargas':'downloads'}`;
  }

  function apply(){getData().then(({releases,live})=>{renderDownload(releases,live);renderChangelog(releases);home(releases);});}
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();
