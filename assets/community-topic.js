(() => {
  const FEED = '../discussions.json';
  const DATA = '../data/';
  const DISCUSSIONS = 'https://github.com/fernand21/installerlab-web/discussions';

  const copy = {
    en:{navHome:'Home',navFeatures:'Features',navDocs:'Documentation',navCommunity:'Community',navDownload:'Download',backCommunity:'← Back to Community',loading:'Loading discussion…',errorTitle:'This discussion could not be loaded.',errorCopy:'You can still open it directly on GitHub.',replyGithub:'Reply on GitHub →',openGithub:'Open original discussion ↗',repliesEyebrow:'REPLIES',repliesTitle:'Community replies',noRepliesTitle:'No replies yet.',noRepliesCopy:'Be the first to continue the conversation on GitHub.',answered:'Answered',answer:'Accepted answer',viewReply:'Open on GitHub ↗',previous:'Previous discussion',next:'Next discussion',footerCopy:'Windows installer tooling for developers.'},
    es:{navHome:'Inicio',navFeatures:'Funciones',navDocs:'Documentación',navCommunity:'Comunidad',navDownload:'Descargar',backCommunity:'← Volver a Comunidad',loading:'Cargando discusión…',errorTitle:'No se pudo cargar esta discusión.',errorCopy:'Aun así puedes abrirla directamente en GitHub.',replyGithub:'Responder en GitHub →',openGithub:'Abrir discusión original ↗',repliesEyebrow:'RESPUESTAS',repliesTitle:'Respuestas de la comunidad',noRepliesTitle:'Aún no hay respuestas.',noRepliesCopy:'Sé el primero en continuar la conversación en GitHub.',answered:'Resuelta',answer:'Respuesta aceptada',viewReply:'Abrir en GitHub ↗',previous:'Discusión anterior',next:'Discusión siguiente',footerCopy:'Herramientas de instalación de Windows para desarrolladores.'}
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
    q('#open-on-github').href=topic.url||DISCUSSIONS;
    q('#reply-on-github').href=topic.url||DISCUSSIONS;
    q('#topic-answered').hidden=!topic.answered;
    q('#topic-answered').textContent=`✓ ${copy[lang].answered}`;
    q('#reply-count').textContent=String(topic.commentCount??(topic.comments||[]).length);

    const comments=q('#topic-comments');
    const list=topic.comments||[];
    comments.innerHTML=list.map(renderComment).join('');
    q('#no-comments').hidden=list.length>0;

    document.title=`${topic.title} — InstallerLab Community`;
    const desc=document.querySelector('meta[name="description"]');
    if(desc && topic.bodyText) desc.content=topic.bodyText.replace(/\s+/g,' ').trim().slice(0,155);
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
