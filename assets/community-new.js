(() => {
  const q=s=>document.querySelector(s);
  const qa=s=>[...document.querySelectorAll(s)];
  const DRAFT_KEY='installerlab-community-draft-v2';
  const base='https://github.com/fernand21/installerlab-web/discussions/new';
  const MAX_IMAGES=6;
  const MAX_IMAGE_BYTES=8*1024*1024;

  const i18n={
    en:{navHome:'Home',navCommunity:'Community',navDocs:'Documentation',navDownload:'Download',back:'← Back to Community',eyebrow:'NEW DISCUSSION',title:'Make your post look great.',intro:'Use Markdown, code blocks, links, quotes, lists and images with a live preview. GitHub is only used for account verification and the final publish step.',topicType:'Topic type',area:'InstallerLab area',discussionTitle:'Discussion title',post:'Post',markdownHelp:'Markdown supported: bold, italic, headings, lists, quotes, links, images and code blocks.',imagesTitle:'Images ready for your post',imagesNote:'Local images are previewed here. At the final GitHub confirmation, paste/upload them so GitHub can host them securely.',version:'InstallerLab version',windows:'Windows version',extra:'Links or extra context',draftSaved:'Draft saved locally in this browser.',publish:'Continue to publish →',clear:'Clear draft',publishNote:'InstallerLab prepares the complete Markdown post here. GitHub opens only for the signed-in user to confirm and publish it.',previewEyebrow:'LIVE PREVIEW',previewTitle:'How your post will look',untitled:'Untitled discussion',previewEmpty:'Start writing and your formatted post will appear here.',readyTitle:'Your post is ready.',readyCopy:'The formatted Markdown was copied to your clipboard. GitHub will open the selected category so you can confirm and publish it.',imageHandoffTitle:'You also added local images.',imageHandoffCopy:'Upload or paste those images in GitHub before pressing Start discussion. The text is already copied.',openGithub:'Open GitHub and publish →',keepEditing:'Keep editing',clipboardHint:'If GitHub does not fill the body automatically, press Ctrl+V in the Post field.',remove:'Remove',imageAlt:'Image description',tooManyImages:'You can stage up to 6 images.',imageTooLarge:'Each image must be 8 MB or smaller.',badImage:'That file is not a supported image.'},
    es:{navHome:'Inicio',navCommunity:'Comunidad',navDocs:'Documentación',navDownload:'Descargar',back:'← Volver a Comunidad',eyebrow:'NUEVA DISCUSIÓN',title:'Haz que tu publicación se vea genial.',intro:'Usa Markdown, bloques de código, enlaces, citas, listas e imágenes con vista previa en vivo. GitHub solo se usa para verificar la cuenta y el paso final de publicación.',topicType:'Tipo de tema',area:'Área de InstallerLab',discussionTitle:'Título de la discusión',post:'Publicación',markdownHelp:'Compatible con Markdown: negrilla, cursiva, títulos, listas, citas, enlaces, imágenes y bloques de código.',imagesTitle:'Imágenes listas para tu publicación',imagesNote:'Las imágenes locales se previsualizan aquí. En la confirmación final de GitHub, pégalas o súbelas para que GitHub las aloje de forma segura.',version:'Versión de InstallerLab',windows:'Versión de Windows',extra:'Enlaces o contexto adicional',draftSaved:'Borrador guardado localmente en este navegador.',publish:'Continuar para publicar →',clear:'Borrar borrador',publishNote:'InstallerLab prepara aquí la publicación Markdown completa. GitHub se abre solo para que el usuario con sesión iniciada confirme y publique.',previewEyebrow:'VISTA PREVIA',previewTitle:'Así se verá tu publicación',untitled:'Discusión sin título',previewEmpty:'Empieza a escribir y aquí aparecerá la publicación formateada.',readyTitle:'Tu publicación está lista.',readyCopy:'El Markdown formateado fue copiado al portapapeles. GitHub abrirá la categoría seleccionada para que confirmes y publiques.',imageHandoffTitle:'También agregaste imágenes locales.',imageHandoffCopy:'Sube o pega esas imágenes en GitHub antes de pulsar Start discussion. El texto ya está copiado.',openGithub:'Abrir GitHub y publicar →',keepEditing:'Seguir editando',clipboardHint:'Si GitHub no rellena el cuerpo automáticamente, pulsa Ctrl+V en el campo Publicación.',remove:'Quitar',imageAlt:'Descripción de la imagen',tooManyImages:'Puedes preparar hasta 6 imágenes.',imageTooLarge:'Cada imagen debe pesar 8 MB o menos.',badImage:'Ese archivo no es una imagen compatible.'}
  };

  let lang=(localStorage.getItem('il-lang')||'en').toLowerCase()==='es'?'es':'en';
  let publishUrl='';
  let localImages=[];

  const fields={type:q('#topic-type'),area:q('#area'),title:q('#discussion-title'),body:q('#discussion-body'),version:q('#app-version'),windows:q('#windows-version'),extra:q('#extra-context')};
  const categoryMap={general:'general',help:'q-a',fss:'general',showcase:'show-and-tell',ideas:'ideas',bugs:'general'};
  const prefixMap={general:'General',help:'Help',fss:'FSS',showcase:'Showcase',ideas:'Ideas',bugs:'Bug'};

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl=u=>{try{const x=new URL(String(u).trim(),location.href);return ['http:','https:'].includes(x.protocol)?x.href:'#';}catch{return'#';}};

  function current(){return{type:fields.type.value,area:fields.area.value,title:fields.title.value,body:fields.body.value,version:fields.version.value,windows:fields.windows.value,extra:fields.extra.value};}
  function save(){localStorage.setItem(DRAFT_KEY,JSON.stringify(current()));q('#draft-status').textContent=i18n[lang].draftSaved;}
  function load(){try{const d=JSON.parse(localStorage.getItem(DRAFT_KEY)||'{}');Object.keys(fields).forEach(k=>{if(d[k]!=null)fields[k].value=d[k];});}catch{}}
  function clear(){localStorage.removeItem(DRAFT_KEY);fields.type.value='general';fields.area.value='None';fields.title.value='';fields.body.value='';fields.version.value='';fields.windows.value='';fields.extra.value='';localImages.forEach(x=>URL.revokeObjectURL(x.url));localImages=[];renderImages();update();}

  function formatBody(){
    const d=current(),lines=[];
    lines.push(d.body.trim());
    if(d.area&&d.area!=='None')lines.push(`\n---\n**InstallerLab area:** ${d.area}`);
    if(d.version)lines.push(`**InstallerLab version:** ${d.version}`);
    if(d.windows)lines.push(`**Windows:** ${d.windows}`);
    if(d.extra)lines.push(`\n**Extra context:**\n${d.extra.trim()}`);
    return lines.filter(Boolean).join('\n');
  }

  function fullTitle(){const d=current(),t=d.title.trim();return t?`[${prefixMap[d.type]||'General'}] ${t}`:'';}

  function inlineMarkdown(raw){
    let s=esc(raw);
    s=s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,(_,a,u)=>{const url=safeUrl(u.replace(/&amp;/g,'&'));return url==='#'?`![${a}](${esc(u)})`:`<img src="${esc(url)}" alt="${a}" loading="lazy">`;});
    s=s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,t,u)=>{const url=safeUrl(u.replace(/&amp;/g,'&'));return url==='#'?t:`<a href="${esc(url)}" target="_blank" rel="noreferrer">${t}</a>`;});
    s=s.replace(/`([^`]+)`/g,'<code>$1</code>');
    s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
    s=s.replace(/~~([^~]+)~~/g,'<del>$1</del>');
    s=s.replace(/(^|[^*])\*([^*\n]+)\*/g,'$1<em>$2</em>');
    return s;
  }

  function renderMarkdown(md){
    const blocks=[];
    md=String(md||'').replace(/```([\w+-]*)\n?([\s\S]*?)```/g,(_,langName,code)=>{const id=`@@CODE${blocks.length}@@`;blocks.push(`<pre><code${langName?` data-language="${esc(langName)}"`:''}>${esc(code.replace(/^\n|\n$/g,''))}</code></pre>`);return id;});
    const lines=md.split(/\r?\n/),out=[];
    let list=null,paragraph=[];
    const flushP=()=>{if(paragraph.length){out.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);paragraph=[];}};
    const closeList=()=>{if(list){out.push(`</${list}>`);list=null;}};
    for(const line of lines){
      const t=line.trim();
      if(/^@@CODE\d+@@$/.test(t)){flushP();closeList();out.push(t);continue;}
      if(!t){flushP();closeList();continue;}
      if(/^---+$/.test(t)){flushP();closeList();out.push('<hr>');continue;}
      let m;
      if((m=t.match(/^(#{1,3})\s+(.+)/))){flushP();closeList();const n=m[1].length+1;out.push(`<h${n}>${inlineMarkdown(m[2])}</h${n}>`);continue;}
      if((m=t.match(/^>\s?(.*)/))){flushP();closeList();out.push(`<blockquote>${inlineMarkdown(m[1])}</blockquote>`);continue;}
      if((m=t.match(/^[-*]\s+(.+)/))){flushP();if(list!=='ul'){closeList();list='ul';out.push('<ul>');}out.push(`<li>${inlineMarkdown(m[1])}</li>`);continue;}
      if((m=t.match(/^\d+[.)]\s+(.+)/))){flushP();if(list!=='ol'){closeList();list='ol';out.push('<ol>');}out.push(`<li>${inlineMarkdown(m[1])}</li>`);continue;}
      closeList();paragraph.push(t);
    }
    flushP();closeList();
    let html=out.join('');
    blocks.forEach((b,i)=>{html=html.replace(`@@CODE${i}@@`,b);});
    return html;
  }

  function update(){
    const d=current();
    q('#title-count').textContent=String(d.title.length);q('#body-count').textContent=String(d.body.length);
    q('#preview-category').textContent=(fields.type.options[fields.type.selectedIndex]?.textContent||'GENERAL').toUpperCase();
    q('#preview-title').textContent=d.title.trim()||i18n[lang].untitled;
    const p=q('#preview-body');
    if(!d.body.trim()&&!d.extra.trim())p.innerHTML=`<p>${esc(i18n[lang].previewEmpty)}</p>`;
    else{
      p.innerHTML=renderMarkdown(d.body.trim());
      const meta=[];
      if(d.area&&d.area!=='None')meta.push(`<span class="meta-line"><strong>InstallerLab:</strong> ${esc(d.area)}</span>`);
      if(d.version)meta.push(`<span class="meta-line"><strong>Version:</strong> ${esc(d.version)}</span>`);
      if(d.windows)meta.push(`<span class="meta-line"><strong>Windows:</strong> ${esc(d.windows)}</span>`);
      if(d.extra)meta.push(`<div class="extra-preview">${renderMarkdown(d.extra.trim())}</div>`);
      p.insertAdjacentHTML('beforeend',meta.join(''));
    }
    save();
  }

  function applyLang(){
    document.documentElement.lang=lang;localStorage.setItem('il-lang',lang);q('#community-lang').textContent=lang==='es'?'ES':'EN';
    qa('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(i18n[lang][key])el.textContent=i18n[lang][key];});
    [...fields.type.options].forEach(o=>o.textContent=o.dataset[lang]||o.textContent);
    renderImages();update();
  }

  function replaceSelection(before,after='',placeholder='text'){
    const el=fields.body,start=el.selectionStart,end=el.selectionEnd,selected=el.value.slice(start,end)||placeholder;
    el.setRangeText(before+selected+after,start,end,'select');
    el.focus();update();
  }
  function prefixLines(prefix){
    const el=fields.body,start=el.selectionStart,end=el.selectionEnd;
    const selected=el.value.slice(start,end)||'item';
    const result=selected.split('\n').map((line,i)=>typeof prefix==='function'?prefix(line,i):prefix+line).join('\n');
    el.setRangeText(result,start,end,'select');el.focus();update();
  }
  function toolbar(action){
    switch(action){
      case'bold':replaceSelection('**','**','bold text');break;
      case'italic':replaceSelection('*','*','italic text');break;
      case'strike':replaceSelection('~~','~~','strikethrough');break;
      case'h2':prefixLines('## ');break;
      case'quote':prefixLines('> ');break;
      case'ul':prefixLines('- ');break;
      case'ol':prefixLines((line,i)=>`${i+1}. ${line}`);break;
      case'code':replaceSelection('`','`','code');break;
      case'block':replaceSelection('```\n','\n```','code here');break;
      case'link':{const u=prompt(lang==='es'?'URL del enlace':'Link URL','https://');if(u)replaceSelection('[',`](${u})`,'link text');break;}
      case'image-url':{const u=prompt(lang==='es'?'URL pública de la imagen':'Public image URL','https://');if(u)replaceSelection('![',`](${u})`,'image description');break;}
    }
  }

  function stageFiles(files){
    for(const file of files){
      if(localImages.length>=MAX_IMAGES){alert(i18n[lang].tooManyImages);break;}
      if(!/^image\/(png|jpeg|webp|gif)$/i.test(file.type)){alert(i18n[lang].badImage);continue;}
      if(file.size>MAX_IMAGE_BYTES){alert(i18n[lang].imageTooLarge);continue;}
      localImages.push({id:crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`,file,url:URL.createObjectURL(file),alt:file.name.replace(/\.[^.]+$/,'')});
    }
    renderImages();
  }

  function renderImages(){
    const box=q('#image-staging'),list=q('#image-list'),preview=q('#preview-images');
    box.hidden=!localImages.length;
    list.innerHTML=localImages.map(x=>`<div class="image-chip" data-id="${esc(x.id)}"><img src="${esc(x.url)}" alt=""><div><input class="image-alt" value="${esc(x.alt)}" aria-label="${esc(i18n[lang].imageAlt)}"><small>${esc(x.file.name)} · ${(x.file.size/1024/1024).toFixed(1)} MB</small></div><button type="button" class="remove-image" title="${esc(i18n[lang].remove)}">×</button></div>`).join('');
    preview.innerHTML=localImages.map(x=>`<figure><img src="${esc(x.url)}" alt="${esc(x.alt)}"><figcaption>${esc(x.alt)}</figcaption></figure>`).join('');
  }

  async function copyText(text){try{await navigator.clipboard.writeText(text);return true;}catch{return false;}}

  qa('[data-md]').forEach(btn=>btn.addEventListener('click',()=>toolbar(btn.dataset.md)));
  q('#image-picker-button').addEventListener('click',()=>q('#image-picker').click());
  q('#image-picker').addEventListener('change',e=>{stageFiles([...e.target.files]);e.target.value='';});
  q('#image-list').addEventListener('click',e=>{const card=e.target.closest('.image-chip');if(!card)return;const x=localImages.find(i=>i.id===card.dataset.id);if(!x)return;if(e.target.classList.contains('remove-image')){URL.revokeObjectURL(x.url);localImages=localImages.filter(i=>i!==x);renderImages();}});
  q('#image-list').addEventListener('input',e=>{if(!e.target.classList.contains('image-alt'))return;const card=e.target.closest('.image-chip');const x=localImages.find(i=>i.id===card?.dataset.id);if(x){x.alt=e.target.value;renderImages();}});

  fields.body.addEventListener('keydown',e=>{
    if(!(e.ctrlKey||e.metaKey))return;
    const k=e.key.toLowerCase();
    if(k==='b'){e.preventDefault();toolbar('bold');}
    else if(k==='i'){e.preventDefault();toolbar('italic');}
    else if(k==='k'){e.preventDefault();toolbar('link');}
  });
  fields.body.addEventListener('paste',e=>{const imgs=[...(e.clipboardData?.files||[])].filter(f=>f.type.startsWith('image/'));if(imgs.length){e.preventDefault();stageFiles(imgs);}});
  fields.body.addEventListener('dragover',e=>{if([...(e.dataTransfer?.items||[])].some(x=>x.kind==='file')){e.preventDefault();fields.body.classList.add('drop-ready');}});
  fields.body.addEventListener('dragleave',()=>fields.body.classList.remove('drop-ready'));
  fields.body.addEventListener('drop',e=>{const imgs=[...(e.dataTransfer?.files||[])].filter(f=>f.type.startsWith('image/'));fields.body.classList.remove('drop-ready');if(imgs.length){e.preventDefault();stageFiles(imgs);}});

  q('#discussion-form').addEventListener('submit',async e=>{
    e.preventDefault();const d=current();if(!d.title.trim()){fields.title.focus();return;}if(!d.body.trim()){fields.body.focus();return;}
    save();const body=formatBody();await copyText(body);const cat=categoryMap[d.type]||'general';
    publishUrl=`${base}?${new URLSearchParams({category:cat,title:fullTitle(),body}).toString()}`;
    q('#image-handoff-note').hidden=!localImages.length;q('#handoff').hidden=false;
  });

  q('#open-github').addEventListener('click',()=>{if(publishUrl)window.location.href=publishUrl;});
  q('#close-handoff').addEventListener('click',()=>q('#handoff').hidden=true);
  q('#clear-button').addEventListener('click',()=>{if(confirm(lang==='es'?'¿Borrar este borrador?':'Clear this draft?'))clear();});
  q('#community-lang').addEventListener('click',()=>{lang=lang==='en'?'es':'en';applyLang();});
  qa('input,textarea,select').forEach(el=>{if(el.id!=='image-picker')el.addEventListener('input',update);});
  q('#handoff').addEventListener('click',e=>{if(e.target===q('#handoff'))q('#handoff').hidden=true;});

  load();applyLang();renderImages();
})();
