(() => {
  const FEED = './discussions.json';
  const DISCUSSIONS = 'https://github.com/fernand21/installerlab-web/discussions';
  const NEW_DISCUSSION = `${DISCUSSIONS}/new/choose`;

  const copy = {
    en:{navFeatures:'Features',navDocs:'Documentation',navCommunity:'Community',navDownload:'Download',eyebrow:'INSTALLERLAB COMMUNITY',heroTitle:'A small place for people building Windows installers.',heroCopy:'Ask for help, share FSS snippets, show what you created, report a problem or propose the next feature. Topics and replies are powered by GitHub Discussions and shown here inside InstallerLab.',startPost:'Start a discussion →',browsePosts:'Browse recent discussions',publicCommunity:'Public developer community',publicCommunityCopy:'GitHub Discussions handles accounts, replies and moderation. InstallerLab mirrors the public conversations here automatically.',chooseTopic:'CHOOSE A TOPIC',categoriesTitle:'What do you want to talk about?',catAll:'All discussions',catAllCopy:'Everything happening in the community',catHelp:'Help & Support',catHelpCopy:'Installation, builds and troubleshooting',catFss:'FSS Scripts',catFssCopy:'Share useful rules, patterns and examples',catShowcase:'Showcase',catShowcaseCopy:'Show the applications you distribute',catIdeas:'Ideas',catIdeasCopy:'Suggest features and workflow improvements',catBugs:'Bugs',catBugsCopy:'Report reproducible problems',catGeneral:'General',catGeneralCopy:'Anything else related to InstallerLab',latestEyebrow:'RECENT ACTIVITY',latestTitle:'Latest community discussions',viewGithub:'Open Discussions on GitHub ↗',loading:'Loading public discussions…',emptyTitle:'No discussions yet.',emptyCopy:'Start the first conversation and it will appear here automatically.',errorTitle:'Community discussions could not be loaded.',errorCopy:'You can still open GitHub Discussions directly.',rulesEyebrow:'COMMUNITY GUIDELINES',rulesTitle:'Useful, technical and respectful.',rulesCopy:'Share enough context to reproduce a problem, remove private keys or personal data before posting, and keep criticism focused on the software or workflow.',rule1:'✓ Reproducible details',rule2:'✓ FSS/code welcome',rule3:'✓ Screenshots welcome',rule4:'✓ Constructive feedback',footerCopy:'Windows installer tooling for developers.',support:'Support',answered:'Answered'},
    es:{navFeatures:'Funciones',navDocs:'Documentación',navCommunity:'Comunidad',navDownload:'Descargar',eyebrow:'COMUNIDAD INSTALLERLAB',heroTitle:'Un pequeño espacio para quienes crean instaladores de Windows.',heroCopy:'Pide ayuda, comparte fragmentos FSS, muestra lo que creaste, reporta un problema o propón la próxima función. Los temas y respuestas funcionan con GitHub Discussions y se muestran aquí dentro de InstallerLab.',startPost:'Crear discusión →',browsePosts:'Ver discusiones recientes',publicCommunity:'Comunidad pública de desarrolladores',publicCommunityCopy:'GitHub Discussions se encarga de las cuentas, respuestas y moderación. InstallerLab refleja aquí automáticamente las conversaciones públicas.',chooseTopic:'ELIGE UN TEMA',categoriesTitle:'¿De qué quieres hablar?',catAll:'Todas',catAllCopy:'Todo lo que sucede en la comunidad',catHelp:'Ayuda y soporte',catHelpCopy:'Instalación, compilación y solución de problemas',catFss:'Scripts FSS',catFssCopy:'Comparte reglas, patrones y ejemplos útiles',catShowcase:'Showcase',catShowcaseCopy:'Muestra las aplicaciones que distribuyes',catIdeas:'Ideas',catIdeasCopy:'Sugiere funciones y mejoras del flujo',catBugs:'Errores',catBugsCopy:'Reporta problemas reproducibles',catGeneral:'General',catGeneralCopy:'Cualquier otro tema sobre InstallerLab',latestEyebrow:'ACTIVIDAD RECIENTE',latestTitle:'Últimas discusiones de la comunidad',viewGithub:'Abrir Discussions en GitHub ↗',loading:'Cargando discusiones públicas…',emptyTitle:'Aún no hay discusiones.',emptyCopy:'Inicia la primera conversación y aparecerá aquí automáticamente.',errorTitle:'No se pudieron cargar las discusiones.',errorCopy:'Aun así puedes abrir GitHub Discussions directamente.',rulesEyebrow:'NORMAS DE LA COMUNIDAD',rulesTitle:'Útil, técnica y respetuosa.',rulesCopy:'Comparte suficiente contexto para reproducir un problema, elimina claves privadas o datos personales antes de publicar y mantén las críticas centradas en el software o el flujo de trabajo.',rule1:'✓ Detalles reproducibles',rule2:'✓ FSS/código bienvenidos',rule3:'✓ Capturas bienvenidas',rule4:'✓ Feedback constructivo',footerCopy:'Herramientas de instalación de Windows para desarrolladores.',support:'Soporte',answered:'Resuelta'}
  };

  let lang = (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es' ? 'es' : 'en';
  let posts = [];
  let filter = 'all';

  const q = s => document.querySelector(s);
  const qa = s => [...document.querySelectorAll(s)];
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':'&quot;',"'":'&#39;'}[c]));
  const strip = v => String(v ?? '').replace(/\s+/g,' ').trim();
  const dateText = iso => new Intl.DateTimeFormat(lang === 'es' ? 'es-EC':'en-US',{year:'numeric',month:'short',day:'numeric'}).format(new Date(iso));

  function categoryFrom(item){
    const title = String(item.title || '').toLowerCase();
    if(/^\s*\[(fss|fss scripts?|script fss)\]/i.test(item.title || '')) return 'FSS Scripts';
    if(/^\s*\[(bug|bugs|error|errores?)\]/i.test(item.title || '')) return 'Bugs';
    if(/^\s*\[(help|support|ayuda|soporte)\]/i.test(item.title || '')) return 'Help & Support';
    if(/^\s*\[(showcase|show and tell)\]/i.test(item.title || '')) return 'Showcase';
    if(/^\s*\[(idea|ideas)\]/i.test(item.title || '')) return 'Ideas';

    const slug = String(item.categorySlug || '').toLowerCase();
    const nativeName = String(item.category || '').toLowerCase();
    if(slug === 'q-a' || nativeName === 'q&a' || nativeName.includes('question')) return 'Help & Support';
    if(slug === 'show-and-tell' || nativeName.includes('show and tell')) return 'Showcase';
    if(slug === 'ideas' || nativeName === 'ideas') return 'Ideas';
    if(title.includes(' bug ') || title.startsWith('bug:') || title.startsWith('error:')) return 'Bugs';
    return 'General';
  }

  function cleanTitle(title){
    return String(title || '').replace(/^\s*\[(?:fss|fss scripts?|script fss|bug|bugs|error|errores?|help|support|ayuda|soporte|showcase|show and tell|idea|ideas|general)\]\s*/i,'').trim();
  }

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
    target.innerHTML = visible.map(p=>`<a class="post-card" href="${esc(p.url)}" target="_blank" rel="noreferrer"><div class="post-main"><div class="post-topline"><span class="post-category">${esc(p.category)}</span>${p.answered?`<span class="post-category">✓ ${copy[lang].answered}</span>`:''}<span class="post-author">@${esc(p.user)}</span><span class="post-date">${esc(dateText(p.updated))}</span></div><h3>${esc(p.title)}</h3>${p.summary?`<p class="post-snippet">${esc(strip(p.summary).slice(0,260))}</p>`:''}</div><div class="post-meta"><span class="comment-count">💬 ${p.comments}</span><span>↗</span></div></a>`).join('');
    target.hidden=false;
  }

  qa('.category-card').forEach(btn=>btn.addEventListener('click',()=>{
    filter=btn.dataset.filter || 'all';
    qa('.category-card').forEach(x=>x.classList.toggle('active',x===btn));
    render();
  }));

  q('#community-lang').addEventListener('click',()=>{lang=lang==='en'?'es':'en';applyLanguage();});

  const newPost = q('#new-community-post');
  if(newPost) newPost.href = NEW_DISCUSSION;
  const githubLink = q('.posts-heading a');
  if(githubLink) githubLink.href = DISCUSSIONS;

  fetch(`${FEED}?v=${Date.now()}`, {cache:'no-store'})
    .then(r=>{if(!r.ok) throw new Error(String(r.status)); return r.json();})
    .then(payload=>{
      posts=(payload.discussions || []).map(item=>({
        title:cleanTitle(item.title),
        url:item.url,
        user:item.user || 'developer',
        comments:item.comments || 0,
        updated:item.updatedAt || item.createdAt,
        category:categoryFrom(item),
        summary:item.bodyText || '',
        answered:Boolean(item.answered)
      }));
      q('#community-loading').hidden=true;
      if(posts.length){q('#community-posts').hidden=false;render();} else q('#community-empty').hidden=false;
    })
    .catch(()=>{q('#community-loading').hidden=true;q('#community-error').hidden=false;});

  applyLanguage();
})();
