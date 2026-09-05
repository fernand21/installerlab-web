(() => {
  const API = 'https://api.github.com/repos/fernand21/installerlab-web/issues?state=all&per_page=100&sort=updated&direction=desc';
  const copy = {
    en:{navFeatures:'Features',navDocs:'Documentation',navCommunity:'Community',navDownload:'Download',eyebrow:'INSTALLERLAB COMMUNITY',heroTitle:'A small place for people building Windows installers.',heroCopy:'Ask for help, share FSS snippets, show what you created, report a problem or propose the next feature. Community posts are public and transparent.',startPost:'Start a post →',browsePosts:'Browse recent posts',publicCommunity:'Public developer community',publicCommunityCopy:'Posts are stored publicly on GitHub and displayed here inside InstallerLab.',chooseTopic:'CHOOSE A TOPIC',categoriesTitle:'What do you want to talk about?',catAll:'All posts',catAllCopy:'Everything happening in the community',catHelp:'Help & Support',catHelpCopy:'Installation, builds and troubleshooting',catFss:'FSS Scripts',catFssCopy:'Share useful rules, patterns and examples',catShowcase:'Showcase',catShowcaseCopy:'Show the applications you distribute',catIdeas:'Ideas',catIdeasCopy:'Suggest features and workflow improvements',catBugs:'Bugs',catBugsCopy:'Report reproducible problems',catGeneral:'General',catGeneralCopy:'Anything else related to InstallerLab',latestEyebrow:'RECENT ACTIVITY',latestTitle:'Latest community posts',viewGithub:'View on GitHub ↗',loading:'Loading public posts…',emptyTitle:'No community posts yet.',emptyCopy:'Start the first conversation and it will appear here automatically.',errorTitle:'Community posts could not be loaded.',errorCopy:'You can still open the public community directly on GitHub.',rulesEyebrow:'COMMUNITY GUIDELINES',rulesTitle:'Useful, technical and respectful.',rulesCopy:'Share enough context to reproduce a problem, remove private keys or personal data before posting, and keep criticism focused on the software or workflow.',rule1:'✓ Reproducible details',rule2:'✓ FSS/code welcome',rule3:'✓ Screenshots welcome',rule4:'✓ Constructive feedback',footerCopy:'Windows installer tooling for developers.',support:'Support'},
    es:{navFeatures:'Funciones',navDocs:'Documentación',navCommunity:'Comunidad',navDownload:'Descargar',eyebrow:'COMUNIDAD INSTALLERLAB',heroTitle:'Un pequeño espacio para quienes crean instaladores de Windows.',heroCopy:'Pide ayuda, comparte fragmentos FSS, muestra lo que creaste, reporta un problema o propón la próxima función. Las publicaciones son públicas y transparentes.',startPost:'Crear publicación →',browsePosts:'Ver publicaciones recientes',publicCommunity:'Comunidad pública de desarrolladores',publicCommunityCopy:'Las publicaciones se guardan públicamente en GitHub y se muestran aquí dentro de InstallerLab.',chooseTopic:'ELIGE UN TEMA',categoriesTitle:'¿De qué quieres hablar?',catAll:'Todas',catAllCopy:'Todo lo que sucede en la comunidad',catHelp:'Ayuda y soporte',catHelpCopy:'Instalación, compilación y solución de problemas',catFss:'Scripts FSS',catFssCopy:'Comparte reglas, patrones y ejemplos útiles',catShowcase:'Showcase',catShowcaseCopy:'Muestra las aplicaciones que distribuyes',catIdeas:'Ideas',catIdeasCopy:'Sugiere funciones y mejoras del flujo',catBugs:'Errores',catBugsCopy:'Reporta problemas reproducibles',catGeneral:'General',catGeneralCopy:'Cualquier otro tema sobre InstallerLab',latestEyebrow:'ACTIVIDAD RECIENTE',latestTitle:'Últimas publicaciones',viewGithub:'Ver en GitHub ↗',loading:'Cargando publicaciones públicas…',emptyTitle:'Aún no hay publicaciones.',emptyCopy:'Inicia la primera conversación y aparecerá aquí automáticamente.',errorTitle:'No se pudieron cargar las publicaciones.',errorCopy:'Aun así puedes abrir la comunidad pública directamente en GitHub.',rulesEyebrow:'NORMAS DE LA COMUNIDAD',rulesTitle:'Útil, técnica y respetuosa.',rulesCopy:'Comparte suficiente contexto para reproducir un problema, elimina claves privadas o datos personales antes de publicar y mantén las críticas centradas en el software o el flujo de trabajo.',rule1:'✓ Detalles reproducibles',rule2:'✓ FSS/código bienvenidos',rule3:'✓ Capturas bienvenidas',rule4:'✓ Feedback constructivo',footerCopy:'Herramientas de instalación de Windows para desarrolladores.',support:'Soporte'}
  };
  let lang = (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es' ? 'es' : 'en';
  let posts = [];
  let filter = 'all';

  const q = s => document.querySelector(s);
  const qa = s => [...document.querySelectorAll(s)];
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':'&quot;',"'":'&#39;'}[c]));
  const strip = v => String(v ?? '').replace(/<!--.*?-->/gs,'').replace(/[#>*_`~\[\]()]/g,' ').replace(/\s+/g,' ').trim();
  const field = (body,label) => {
    const m = String(body||'').match(new RegExp(`###\\s*${label}\\s*\\r?\\n+([\\s\\S]*?)(?=\\r?\\n###|$)`,'i'));
    return (m?.[1] || '').replace(/<!--.*?-->/gs,'').trim();
  };
  const categoryOf = body => field(body,'Category \/ Categor[ií]a') || 'General';
  const summaryOf = body => field(body,'Post \/ Publicaci[oó]n') || field(body,'Details \/ Detalles') || '';
  const dateText = iso => new Intl.DateTimeFormat(lang === 'es' ? 'es-EC':'en-US',{year:'numeric',month:'short',day:'numeric'}).format(new Date(iso));

  function applyLanguage(){
    document.documentElement.lang = lang;
    localStorage.setItem('il-lang',lang);
    q('#community-lang').textContent = lang === 'es' ? 'ES' : 'EN';
    qa('[data-i18n]').forEach(el=>{ const key=el.dataset.i18n; if(copy[lang][key]) el.textContent=copy[lang][key]; });
    render();
  }

  function render(){
    const target=q('#community-posts');
    if(!target || !posts.length) return;
    const visible = posts.filter(p=>filter === 'all' || p.category === filter);
    if(!visible.length){
      target.hidden=true; q('#community-empty').hidden=false; return;
    }
    q('#community-empty').hidden=true;
    target.innerHTML = visible.map(p=>`<a class="post-card" href="${esc(p.url)}" target="_blank" rel="noreferrer"><div class="post-main"><div class="post-topline"><span class="post-category">${esc(p.category)}</span><span class="post-author">@${esc(p.user)}</span><span class="post-date">${esc(dateText(p.updated))}</span></div><h3>${esc(p.title)}</h3>${p.summary?`<p class="post-snippet">${esc(strip(p.summary).slice(0,240))}</p>`:''}</div><div class="post-meta"><span class="comment-count">💬 ${p.comments}</span><span>↗</span></div></a>`).join('');
    target.hidden=false;
  }

  qa('.category-card').forEach(btn=>btn.addEventListener('click',()=>{
    filter=btn.dataset.filter || 'all';
    qa('.category-card').forEach(x=>x.classList.toggle('active',x===btn));
    render();
  }));
  q('#community-lang').addEventListener('click',()=>{lang=lang==='en'?'es':'en';applyLanguage();});

  fetch(API,{headers:{Accept:'application/vnd.github+json'}})
    .then(r=>{if(!r.ok) throw new Error(String(r.status)); return r.json();})
    .then(items=>{
      posts=items.filter(i=>!i.pull_request && /^\[Community\]/i.test(i.title||'')).map(i=>({title:(i.title||'').replace(/^\[Community\]\s*/i,''),url:i.html_url,user:i.user?.login||'developer',comments:i.comments||0,updated:i.updated_at,category:categoryOf(i.body||''),summary:summaryOf(i.body||'')}));
      q('#community-loading').hidden=true;
      if(posts.length){q('#community-posts').hidden=false;render();} else q('#community-empty').hidden=false;
    })
    .catch(()=>{q('#community-loading').hidden=true;q('#community-error').hidden=false;});

  applyLanguage();
})();
