(() => {
  const FEED = '../discussions.json';
  const DATA = '../data/';
  const DISCUSSIONS = 'https://github.com/fernand21/installerlab-web/discussions';
  const SITE_TOPIC = 'https://fernand21.github.io/installerlab-web/community/topic/';

  const copy = {
    en:{navHome:'Home',navFeatures:'Features',navDocs:'Documentation',navCommunity:'Community',navDownload:'Download',backCommunity:'← Back to Community',loading:'Loading discussion…',errorTitle:'This discussion could not be loaded.',errorCopy:'You can still open it directly on GitHub.',replyGithub:'Reply on GitHub →',openGithub:'Open original discussion ↗',repliesEyebrow:'REPLIES',repliesTitle:'Community replies',noRepliesTitle:'No replies yet.',noRepliesCopy:'Be the first to continue the conversation on GitHub.',answered:'Answered',answer:'Accepted answer',viewReply:'Open on GitHub ↗',previous:'Previous discussion',next:'Next discussion',footerCopy:'Windows installer tooling for developers.',copyCode:'Copy',copied:'Copied!'},
    es:{navHome:'Inicio',navFeatures:'Funciones',navDocs:'Documentación',navCommunity:'Comunidad',navDownload:'Descargar',backCommunity:'← Volver a Comunidad',loading:'Cargando discusión…',errorTitle:'No se pudo cargar esta discusión.',errorCopy:'Aun así puedes abrirla directamente en GitHub.',replyGithub:'Responder en GitHub →',openGithub:'Abrir discusión original ↗',repliesEyebrow:'RESPUESTAS',repliesTitle:'Respuestas de la comunidad',noRepliesTitle:'Aún no hay respuestas.',noRepliesCopy:'Sé el primero en continuar la conversación en GitHub.',answered:'Resuelta',answer:'Respuesta aceptada',viewReply:'Abrir en GitHub ↗',previous:'Discusión anterior',next:'Discusión siguiente',footerCopy:'Herramientas de instalación de Windows para desarrolladores.',copyCode:'Copiar',copied:'¡Copiado!'}
  };

  let lang=(localStorage.getItem('il-lang')||'en').toLowerCase()==='es'?'es':'en';
  let topic=null;
  const q=s=>document.querySelector(s);
  const qa=s=>[...document.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':'&quot;',"'":'&#39;'}[c]));
  const dateText=iso=>iso?new Intl.DateTimeFormat(lang==='es'?'es-EC':'en-US',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(iso)):'';

  function safeGithubHtml(html,text){
    if(!html) return `<p>${esc(text||'').replace(/\n\n+/g,'</p><p>').replace(/\n/g,'<br>')}</p>`;
    const parsed=new DOMParser().parseFromString(`<div id="safe-root">${html}</div>`,'text/html');
    const root=parsed.querySelector('#safe-root');
    if(!root) return `<p>${esc(text||'')}</p>`;
    root.querySelectorAll('script,style,iframe,object,embed,form,input,button,textarea,select').forEach(n=>n.remove());
    root.querySelectorAll('*').forEach(el=>{
      [...el.attributes].forEach(a=>{
        const name=a.name.toLowerCase();
        const value=a.value.trim().toLowerCase();
        if(name.startsWith('on')||name==='style'||name==='srcdoc'||((name==='href'||name==='src')&&value.startsWith('javascript:'))) el.removeAttribute(a.name);
      });
      if(el.tagName==='A'){
        el.target='_blank';
        el.rel='noopener noreferrer';
      }
    });
    return root.innerHTML;
  }

  function slugify(text){
    return String(text||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)||'section';
  }

  function decorateGithubBody(root){
    if(!root) return;
    root.classList.add('rich-post');
    const used=new Set();
    root.querySelectorAll('h2,h3').forEach((h,i)=>{
      let id=slugify(h.textContent);
      while(used.has(id)||document.getElementById(id)) id=`${id}-${i+1}`;
      used.add(id);
      h.id=id;
      const a=document.createElement('a');
      a.className='heading-anchor';
      a.href=`#${id}`;
      a.textContent='#';
      a.title='Link to this section';
      a.target='_self';
      a.rel='';
      h.appendChild(a);
    });
    root.querySelectorAll('pre').forEach(pre=>{
      if(pre.parentElement?.classList.contains('code-shell')) return;
      const shell=document.createElement('div');
      shell.className='code-shell';
      pre.parentNode.insertBefore(shell,pre);
      shell.appendChild(pre);
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='code-copy';
      btn.textContent=copy[lang].copyCode;
      btn.addEventListener('click',async()=>{
        try{
          await navigator.clipboard.writeText(pre.innerText);
          btn.textContent=copy[lang].copied;
          btn.classList.add('copied');
          setTimeout(()=>{btn.textContent=copy[lang].copyCode;btn.classList.remove('copied');},1300);
        }catch{}
      });
      shell.appendChild(btn);
    });
    root.querySelectorAll('img').forEach(img=>{img.loading='lazy';img.decoding='async';});
  }

  function setDynamicSeo(){
    if(!topic) return;
    const clean=(topic.bodyText||'').replace(/\s+/g,' ').trim();
    const description=clean.slice(0,155)||'InstallerLab Community discussion for Windows installer developers.';
    document.title=`${topic.title} — InstallerLab Community`;
    const desc=document.querySelector('meta[name="description"]');
    if(desc) desc.content=description;
    let canonical=document.querySelector('link[rel="canonical"]');
    if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical);}
    canonical.href=`${SITE_TOPIC}?id=${encodeURIComponent(topic.number)}`;
    const metas=[['og:title',topic.title],['og:description',description],['og:url',canonical.href]];
    metas.forEach(([property,content])=>{
      let m=document.querySelector(`meta[property="${property}"]`);
      if(!m){m=document.createElement('meta');m.setAttribute('property',property);document.head.appendChild(m);}
      m.content=content;
    });
    let schema=q('#topic-schema');
    if(!schema){schema=document.createElement('script');schema.id='topic-schema';schema.type='application/ld+json';document.head.appendChild(schema);}
    schema.textContent=JSON.stringify({
      '@context':'https://schema.org',
      '@type':'DiscussionForumPosting',
      headline:topic.title||'InstallerLab Community',
      articleBody:topic.bodyText||'',
      datePublished:topic.createdAt||undefined,
      dateModified:topic.updatedAt||topic.createdAt||undefined,
      url:canonical.href,
      author:{'@type':'Person',name:topic.user||'InstallerLab Community'},
      interactionStatistic:{'@type':'InteractionCounter',interactionType:'https://schema.org/CommentAction',userInteractionCount:Number(topic.commentCount||0)},
      isPartOf:{'@type':'DiscussionForumPosting',name:'InstallerLab Community',url:'https://fernand21.github.io/installerlab-web/community/'}
    });
  }

  function applyLanguage(){
    document.documentElement.lang=lang;
    localStorage.setItem('il-lang',lang);
    q('#community-lang').textContent=lang==='es'?'ES':'EN';
    qa('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(copy[lang][key])el.textContent=copy[lang][key];});
    if(topic) renderTopic();
  }

  function authorBlock(user,avatar,date,isAnswer=false){
    const fallback='../../assets/icon.png';
    return `<div class="comment-author"><img class="comment-avatar" src="${esc(avatar||fallback)}" alt=""><div><strong>@${esc(user||'developer')}</strong><span>${esc(dateText(date))}</span>${isAnswer?`<span class="answer-label">✓ ${copy[lang].answer}</span>`:''}</div></div>`;
  }

  function renderComment(comment){
    const replies=(comment.replies||[]).map(reply=>`<div class="nested-reply">${authorBlock(reply.user,reply.avatar,reply.createdAt)}<div class="github-body comment-body">${safeGithubHtml(reply.bodyHTML,reply.bodyText)}</div></div>`).join('');
    return `<article class="comment-card${comment.isAnswer?' answer':''}"><div class="comment-head">${authorBlock(comment.user,comment.avatar,comment.createdAt,comment.isAnswer)}${comment.url?`<a class="comment-link" href="${esc(comment.url)}" target="_blank" rel="noreferrer">${copy[lang].viewReply}</a>`:''}</div><div class="github-body comment-body">${safeGithubHtml(comment.bodyHTML,comment.bodyText)}</div>${replies?`<div class="nested-replies">${replies}</div>`:''}</article>`;
  }

  function renderTopic(){
    q('#topic-category').textContent=topic.category||'General';
    q('#topic-number').textContent=`#${topic.number}`;
    q('#topic-title').textContent=topic.title||'InstallerLab Community';
    q('#topic-author').textContent=`@${topic.user||'developer'}`;
    q('#topic-date').textContent=dateText(topic.createdAt);
    q('#topic-avatar').src=topic.avatar||'../../assets/icon.png';
    q('#topic-body').innerHTML=safeGithubHtml(topic.bodyHTML,topic.bodyText);
    decorateGithubBody(q('#topic-body'));
    q('#open-on-github').href=topic.url||DISCUSSIONS;
    q('#reply-on-github').href=topic.url||DISCUSSIONS;
    q('#topic-answered').hidden=!topic.answered;
    q('#topic-answered').textContent=`✓ ${copy[lang].answered}`;
    q('#reply-count').textContent=String(topic.commentCount??(topic.comments||[]).length);

    const comments=q('#topic-comments');
    const list=topic.comments||[];
    comments.innerHTML=list.map(renderComment).join('');
    comments.querySelectorAll('.github-body').forEach(decorateGithubBody);
    q('#no-comments').hidden=list.length>0;
    setDynamicSeo();
  }

  function setupPager(feed){
    const list=feed.discussions||[];
    const index=list.findIndex(x=>Number(x.number)===Number(topic.number));
    if(index<0) return;
    const prev=list[index+1];
    const next=list[index-1];
    const prevEl=q('#prev-topic');
    const nextEl=q('#next-topic');
    if(prev){prevEl.hidden=false;prevEl.href=`./?id=${encodeURIComponent(prev.number)}`;prevEl.innerHTML=`<small>${copy[lang].previous}</small><strong>${esc(prev.title)}</strong>`;}
    if(next){nextEl.hidden=false;nextEl.href=`./?id=${encodeURIComponent(next.number)}`;nextEl.innerHTML=`<small>${copy[lang].next}</small><strong>${esc(next.title)}</strong>`;}
  }

  const id=new URLSearchParams(location.search).get('id')||new URLSearchParams(location.search).get('discussion');
  q('#community-lang').addEventListener('click',()=>{lang=lang==='en'?'es':'en';applyLanguage();});
  applyLanguage();

  if(!/^\d+$/.test(id||'')){
    q('#topic-loading').hidden=true;
    q('#topic-error').hidden=false;
    return;
  }

  Promise.all([
    fetch(`${DATA}${encodeURIComponent(id)}.json?v=${Date.now()}`,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(String(r.status));return r.json();}),
    fetch(`${FEED}?v=${Date.now()}`,{cache:'no-store'}).then(r=>r.ok?r.json():{discussions:[]}).catch(()=>({discussions:[]}))
  ]).then(([detail,feed])=>{
    topic=detail;
    q('#topic-loading').hidden=true;
    q('#topic-thread').hidden=false;
    renderTopic();
    setupPager(feed);
  }).catch(()=>{
    q('#topic-loading').hidden=true;
    q('#topic-error').hidden=false;
    const fallback=q('#topic-error');
    const a=document.createElement('a');
    a.className='secondary-button';
    a.href=`${DISCUSSIONS}/${encodeURIComponent(id)}`;
    a.target='_blank';
    a.rel='noreferrer';
    a.textContent=copy[lang].openGithub;
    fallback.append(a);
  });
})();
