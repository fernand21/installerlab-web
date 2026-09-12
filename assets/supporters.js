(() => {
  const BASE = location.pathname.includes('/installerlab-web/') ? '/installerlab-web/' : '/';
  const params = new URLSearchParams(location.search);
  const isSpanish = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  let dataCache = null;
  let queued = false;

  const demoRecord = {
    id:'INST-DEMO-00001',
    name:'John Smith',
    level:'Founding Supporter',
    issued:'September 2026',
    public:true
  };

  function t(es){
    return es ? {
      verified:'CERTIFICADO VERIFICADO',
      thanks:'Gracias por ayudar a mantener InstallerLab vivo.',
      part:'Tu apoyo forma parte de algo más grande: software más abierto, gratuito e independiente.',
      permanent:'Certificado permanente · no caduca',
      save:'Imprimir / Guardar PDF',
      share:'Compartir certificado',
      all:'Ver supporters',
      listTitle:'Supporters de InstallerLab',
      listIntro:'Cada persona de esta lista ayudó a mantener el proyecto activo. La publicación es siempre voluntaria.',
      none:'Los primeros supporters aparecerán aquí cuando autoricen su publicación.',
      invalid:'No se pudo verificar este certificado.',
      invalidText:'El Supporter ID no existe en el registro público actual. Comprueba el enlace o solicita una revisión.',
      back:'Volver a Support InstallerLab',
      hero:'Supporter Registry',
      heroTitle:'Gracias a quienes mantienen InstallerLab vivo.',
      heroText:'Cada aporte desde US$1 recibe un Supporter ID permanente y un certificado oficial que no caduca.',
      total:'supporters registrados',
      private:'Private Supporter',
      official:'Official Supporter',
      issued:'Issued',
      supporterId:'Supporter ID',
      certificate:'OFFICIAL SUPPORTER CERTIFICATE',
      recognizes:'This certificate recognizes',
      body:'as an official supporter of the InstallerLab independent development project.',
      verify:'Verify certificate',
      creator:'Creator of InstallerLab',
      footer:'Independent software. Brighter possibilities.',
      copied:'Enlace copiado al portapapeles.'
    } : {
      verified:'CERTIFICATE VERIFIED',
      thanks:'Thank you for helping keep InstallerLab alive.',
      part:'Your support is part of something bigger: a more open, free and independent software future.',
      permanent:'Permanent certificate · does not expire',
      save:'Print / Save PDF',
      share:'Share certificate',
      all:'View supporters',
      listTitle:'InstallerLab Supporters',
      listIntro:'Everyone listed here helped keep the project active. Public recognition is always optional.',
      none:'The first supporters will appear here when they choose public recognition.',
      invalid:'This certificate could not be verified.',
      invalidText:'The Supporter ID is not present in the current public registry. Check the link or request a review.',
      back:'Back to Support InstallerLab',
      hero:'Supporter Registry',
      heroTitle:'Thank you to everyone helping keep InstallerLab alive.',
      heroText:'Every contribution from US$1 receives a permanent Supporter ID and an official certificate that does not expire.',
      total:'registered supporters',
      private:'Private Supporter',
      official:'Official Supporter',
      issued:'Issued',
      supporterId:'Supporter ID',
      certificate:'OFFICIAL SUPPORTER CERTIFICATE',
      recognizes:'This certificate recognizes',
      body:'as an official supporter of the InstallerLab independent development project.',
      verify:'Verify certificate',
      creator:'Creator of InstallerLab',
      footer:'Independent software. Brighter possibilities.',
      copied:'Verification link copied to clipboard.'
    };
  }

  function esc(v){return String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  function loadData(){
    if(dataCache) return Promise.resolve(dataCache);
    return fetch(BASE+'supporters/data.json',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject(new Error('registry'))).then(d=>{
      if(!d || !Array.isArray(d.supporters)) d={goal:500,raised:0,supporters:[]};
      dataCache=d;return d;
    }).catch(()=>({goal:500,raised:0,supporters:[]}));
  }

  function verificationUrl(id,demo=false){
    return demo ? location.origin + BASE + 'supporters/?demo=1' : location.origin + BASE + 'supporters/?id=' + encodeURIComponent(id);
  }

  function certMarkup(record,es){
    const c=t(es), name=esc(record.name||c.private), level=esc(record.level||c.official), id=esc(record.id), issued=esc(record.issued||'2026');
    return `<div class="certificate-shell"><article class="supporter-certificate" id="printable-certificate">
      <div class="cert-brand"><img src="${BASE}assets/icon.png" alt=""><strong>INSTALLER<em>LAB</em></strong><span class="cert-tagline">Software · Freedom · A Brighter Tomorrow</span></div>
      <div class="cert-title">${c.certificate}</div>
      <div class="cert-recognizes">${c.recognizes}</div>
      <div class="cert-name">${name}</div>
      <div class="cert-body">${c.body}</div>
      <div class="cert-level">${level}</div>
      <div class="cert-id">${c.supporterId}: ${id}</div>
      <div class="cert-date">${c.issued}: ${issued}</div>
      <div class="cert-lifetime">PERMANENT · DOES NOT EXPIRE</div>
      <div class="cert-bottom">
        <div class="cert-signature"><div class="script">Fernando Arévalo</div><div class="line"></div><small>Fernando Arévalo<br>${c.creator}</small></div>
        <div class="cert-seal">Official<br>Supporter<br>★ ★ ★</div>
        <div class="cert-verify"><div class="cert-verify__qr" id="cert-qr"></div><small>${c.verify}</small></div>
      </div>
      <div class="cert-footer">${c.footer}</div>
    </article></div>`;
  }

  function renderQr(id,demo=false){
    const el=document.getElementById('cert-qr'); if(!el) return;
    const url=verificationUrl(id,demo);
    el.innerHTML='';
    if(window.QRCode){
      try{new QRCode(el,{text:url,width:160,height:160,colorDark:'#102845',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});return;}catch(e){}
    }
    const a=document.createElement('a');a.href=url;a.textContent='↗';a.title=url;a.style.cssText='font-size:2rem;color:#102845;text-decoration:none;font-weight:900';el.appendChild(a);
  }

  function confetti(){
    if(document.querySelector('.confetti-layer')) return;
    const layer=document.createElement('div');layer.className='confetti-layer';
    layer.innerHTML=Array.from({length:34},(_,i)=>`<i style="--i:${i}"></i>`).join('');
    document.body.appendChild(layer);setTimeout(()=>layer.remove(),3600);
  }

  function wireActions(record,es,demo=false){
    document.getElementById('print-certificate')?.addEventListener('click',()=>window.print());
    document.getElementById('share-certificate')?.addEventListener('click',async()=>{
      const c=t(es), url=verificationUrl(record.id,demo), text=`InstallerLab ${record.level||c.official} — ${record.id}`;
      try{
        if(navigator.share){await navigator.share({title:'InstallerLab Supporter Certificate',text,url});return;}
        await navigator.clipboard.writeText(url);alert(c.copied);
      }catch(e){}
    });
  }

  function verificationMarkup(record,es,demo){
    const c=t(es), name=esc(record.name||c.private), level=esc(record.level||c.official), id=esc(record.id), issued=esc(record.issued||'2026');
    return `<main class="supporters-page" data-supporters-rendered="${es?'es':'en'}">
      <section class="verification-card">
        <div class="verified-medal">✓</div>
        <h1>${c.verified}</h1>
        <p class="verified-copy"><strong>${name}</strong> · ${level}<br>${c.thanks}<br>${c.part}</p>
        <div class="verification-meta"><span>${c.supporterId}: ${id}</span><span>${c.issued}: ${issued}</span><span>${c.permanent}</span>${demo?'<span>DEMO</span>':''}</div>
      </section>
      ${certMarkup(record,es)}
      <div class="certificate-actions"><button id="print-certificate" class="primary" type="button">${c.save}</button><button id="share-certificate" type="button">${c.share}</button><a href="${BASE}supporters/">${c.all}</a><a href="${BASE}donate/">${c.back}</a></div>
    </main>`;
  }

  function invalidMarkup(es){const c=t(es);return `<main class="supporters-page"><div class="verify-missing"><h2>${c.invalid}</h2><p>${c.invalidText}</p><a class="button" href="${BASE}donate/">${c.back}</a></div></main>`;}

  function listMarkup(data,es){
    const c=t(es), publicList=data.supporters.filter(x=>x && x.public===true);
    return `<main class="supporters-page" data-supporters-rendered="${es?'es':'en'}">
      <section class="supporters-hero"><article class="supporters-panel"><span class="eyebrow">${c.hero}</span><h1>${c.heroTitle}</h1><p>${c.heroText}</p><a class="button primary" href="${BASE}donate/">${c.back}</a></article><aside class="supporters-panel supporters-summary"><div><strong>${data.supporters.length}</strong><span>${c.total}</span><p>${c.permanent}</p></div></aside></section>
      <section class="supporters-list-card"><h2>${c.listTitle}</h2><p>${c.listIntro}</p><div class="supporters-grid">${publicList.length?publicList.map(r=>`<a class="supporter-tile" href="${BASE}supporters/?id=${encodeURIComponent(r.id)}"><strong>${esc(r.name||c.private)}</strong><span>${esc(r.level||c.official)} · ${esc(r.id)}</span></a>`).join(''):`<div class="supporter-empty">${c.none}</div>`}</div></section>
    </main>`;
  }

  async function render(){
    if(document.body?.dataset?.page!=='supporters') return;
    const es=isSpanish(), app=document.getElementById('app'); if(!app) return;
    const current=document.querySelector('.supporters-page'); if(current?.dataset?.supportersRendered===(es?'es':'en')) return;
    const data=await loadData();
    if(params.get('demo')==='1'){
      app.innerHTML=verificationMarkup(demoRecord,es,true);renderQr(demoRecord.id,true);wireActions(demoRecord,es,true);confetti();return;
    }
    const requested=(params.get('id')||'').trim();
    if(requested){
      const record=data.supporters.find(x=>String(x.id||'').toLowerCase()===requested.toLowerCase());
      if(!record){app.innerHTML=invalidMarkup(es);return;}
      app.innerHTML=verificationMarkup(record,es,false);renderQr(record.id,false);wireActions(record,es,false);confetti();return;
    }
    app.innerHTML=listMarkup(data,es);
  }

  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('storage',()=>{dataCache=null;schedule()});
})();
