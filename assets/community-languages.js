(() => {
  const REPO = 'https://github.com/fernand21/installerlab-web';
  const API = 'https://api.github.com/repos/fernand21/installerlab-web/issues?state=all&per_page=100&sort=created&direction=desc';
  const RATE_URL = `${REPO}/issues/new?template=user-experience.yml`;
  const LANGUAGES = ['English','Español','Français','Deutsch','Italiano','Português','Русский','中文','日本語','हिन्दी','Nederlands','Polski','한국어','Svenska','Türkçe','العربية','Dansk','Norsk','Suomi','Čeština'];
  let reviews = [];
  let loaded = false;

  const copy = {
    en:{kicker:'InstallerLab interface',title:'InstallerLab itself can be used in 20 interface languages.',lede:'Choose the language of the development environment separately from the languages included in the installers you generate. InstallerLab exposes 20 selectable UI languages, while generated installers can include up to 36 installer languages.',ui:'UI languages',setup:'installer languages',community:'Developer experiences',communityTitle:'Used InstallerLab? Rate it and tell other developers what you built.',communityBody:'Public reviews are submitted through GitHub Issues. Ratings and experiences can be read by anyone, so feedback stays transparent and easy to verify.',rate:'Rate InstallerLab',all:'See all experiences',ratings:'ratings',none:'No public ratings yet',first:'Be the first to share your experience with InstallerLab.',loading:'Loading public reviews…',verified:'Public GitHub review',source:'Reviews shown here come from public GitHub Issues.'},
    es:{kicker:'Interfaz de InstallerLab',title:'InstallerLab puede utilizarse en 20 idiomas de interfaz.',lede:'El idioma del entorno de desarrollo es independiente de los idiomas que incluyes en los instaladores que generas. InstallerLab ofrece 20 idiomas seleccionables para su propia interfaz, mientras los instaladores creados pueden incluir hasta 36 idiomas de instalación.',ui:'idiomas de interfaz',setup:'idiomas para instaladores',community:'Experiencias de desarrolladores',communityTitle:'¿Usaste InstallerLab? Califícalo y cuéntale a otros desarrolladores qué creaste.',communityBody:'Las opiniones públicas se envían mediante GitHub Issues. Cualquiera puede leer la calificación y la experiencia, por lo que el feedback permanece transparente y verificable.',rate:'Calificar InstallerLab',all:'Ver todas las experiencias',ratings:'calificaciones',none:'Aún no hay calificaciones públicas',first:'Sé la primera persona en compartir tu experiencia con InstallerLab.',loading:'Cargando opiniones públicas…',verified:'Opinión pública en GitHub',source:'Las opiniones mostradas aquí provienen de GitHub Issues públicos.'}
  };

  function currentLang(){ return (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es' ? 'es' : 'en'; }
  function esc(v){ return String(v ?? '').replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':'&quot;'}[c])); }
  function stars(n){ return `<span class="il-stars" aria-label="${n} out of 5">${'★'.repeat(n)}${'☆'.repeat(5-n)}</span>`; }
  function field(body,label){
    const pattern = new RegExp(`###\\s*${label}\\s*\\r?\\n+([\\s\\S]*?)(?=\\r?\\n###|$)`,'i');
    return (body.match(pattern)?.[1] || '').replace(/<!--.*?-->/gs,'').trim();
  }
  function rating(body){
    const raw = field(body,'Rating \/ Calificaci[oó]n');
    const fraction = raw.match(/([1-5])\s*\/\s*5/);
    if (fraction) return Number(fraction[1]);
    const count = (raw.match(/★/g)||[]).length;
    return count >= 1 && count <= 5 ? count : 0;
  }
  function average(){
    const rated = reviews.filter(r=>r.rating>0);
    return {rated, value:rated.length ? rated.reduce((s,r)=>s+r.rating,0)/rated.length : 0};
  }
  function markup(){
    const l = copy[currentLang()];
    const {rated,value} = average();
    const summary = rated.length
      ? `<div class="il-rating-summary"><strong>${value.toFixed(1)}</strong><div>${stars(Math.round(value))}<small>${rated.length} ${l.ratings}</small></div></div>`
      : `<div class="il-rating-summary"><strong>—</strong><div>${stars(0)}<small>${l.none}</small></div></div>`;
    const list = rated.length
      ? `<div class="il-review-list">${rated.slice(0,6).map(r=>`<a class="il-review" href="${r.url}" target="_blank" rel="noreferrer"><div class="il-review-top"><b>@${esc(r.user || 'developer')}</b>${stars(r.rating)}</div>${r.output ? `<small>${esc(r.output)}</small>`:''}<p>${esc((r.experience || r.title).slice(0,260))}</p><span>${l.verified} ↗</span></a>`).join('')}</div>`
      : `<div class="il-review-empty"><b>${loaded ? l.none : l.loading}</b><span>${l.first}</span></div>`;
    return `<section id="il-language-community" class="il-language-community">
      <article class="il-language-card">
        <p class="il-kicker">🌐 ${l.kicker}</p>
        <h2>${l.title}</h2>
        <p class="il-language-lede">${l.lede}</p>
        <div class="il-language-distinction"><span class="il-stat-pill"><strong>20</strong> ${l.ui}</span><span class="il-stat-pill"><strong>36</strong> ${l.setup}</span></div>
        <div class="il-language-grid">${LANGUAGES.map(name=>`<span class="il-language-chip">${name}</span>`).join('')}</div>
      </article>
      <article class="il-community-card">
        <div class="il-community-head"><div><p class="il-kicker">★ ${l.community}</p><h2>${l.communityTitle}</h2><p>${l.communityBody}</p></div>${summary}</div>
        <div class="il-community-actions"><a class="il-rate-button" href="${RATE_URL}" target="_blank" rel="noreferrer">${l.rate} ★</a><a class="il-all-reviews" href="${REPO}/issues?q=${encodeURIComponent('is:issue [Experience]')}" target="_blank" rel="noreferrer">${l.all} →</a></div>
        ${list}
        <p class="il-source-note"><strong>GitHub:</strong> ${l.source}</p>
      </article>
    </section>`;
  }
  function mount(){
    if (document.body?.dataset.page !== 'home') return;
    const footer = document.querySelector('footer');
    if (!footer) return;
    const existing = document.getElementById('il-language-community');
    if (existing) existing.outerHTML = markup();
    else footer.insertAdjacentHTML('beforebegin', markup());
  }

  fetch(API,{headers:{Accept:'application/vnd.github+json'}})
    .then(r=>r.ok?r.json():[])
    .then(items=>{
      reviews = items.filter(i=>!i.pull_request && /^\[Experience\]/i.test(i.title||'')).map(i=>({
        title:i.title||'', url:i.html_url, user:i.user?.login||'', rating:rating(i.body||''),
        output:field(i.body||'','What did you build\? \/ ¿Qué creaste\?'),
        experience:field(i.body||'','Your experience \/ Tu experiencia')
      }));
    })
    .catch(()=>{reviews=[];})
    .finally(()=>{loaded=true;mount();});

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',mount); else mount();
  new MutationObserver(()=>mount()).observe(document.documentElement,{subtree:true,childList:true});
  window.addEventListener('storage',mount);
})();
