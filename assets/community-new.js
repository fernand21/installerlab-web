(() => {
  const q=s=>document.querySelector(s);
  const qa=s=>[...document.querySelectorAll(s)];
  const DRAFT_KEY='installerlab-community-draft-v1';
  const base='https://github.com/fernand21/installerlab-web/discussions/new';

  const i18n={
    en:{navHome:'Home',navCommunity:'Community',navDocs:'Documentation',navDownload:'Download',back:'← Back to Community',eyebrow:'NEW DISCUSSION',title:'Start the conversation here.',intro:'Write your topic inside InstallerLab. GitHub is only used for account verification and the final publish step, so your draft stays here until you are ready.',topicType:'Topic type',area:'InstallerLab area',discussionTitle:'Discussion title',post:'Post',version:'InstallerLab version',windows:'Windows version',extra:'Links or extra context',draftSaved:'Draft saved locally in this browser.',publish:'Continue to publish →',clear:'Clear draft',publishNote:'InstallerLab prepares the complete post here. GitHub opens only for the signed-in user to confirm and publish it. If GitHub does not prefill the body, it is copied automatically so you can paste it with Ctrl+V.',previewEyebrow:'LIVE PREVIEW',previewTitle:'How your post will look',untitled:'Untitled discussion',previewEmpty:'Start writing and your formatted post will appear here.',readyTitle:'Your post is ready.',readyCopy:'The formatted discussion has been copied to your clipboard. GitHub will open the selected category so you can sign in if needed and press Start discussion.',openGithub:'Open GitHub and publish →',keepEditing:'Keep editing',clipboardHint:'If the body is not filled automatically on GitHub, press Ctrl+V in the Post field.'},
    es:{navHome:'Inicio',navCommunity:'Comunidad',navDocs:'Documentación',navDownload:'Descargar',back:'← Volver a Comunidad',eyebrow:'NUEVA DISCUSIÓN',title:'Empieza la conversación aquí.',intro:'Escribe tu tema dentro de InstallerLab. GitHub solo se usa para verificar la cuenta y el paso final de publicación, así que tu borrador permanece aquí hasta que estés listo.',topicType:'Tipo de tema',area:'Área de InstallerLab',discussionTitle:'Título de la discusión',post:'Publicación',version:'Versión de InstallerLab',windows:'Versión de Windows',extra:'Enlaces o contexto adicional',draftSaved:'Borrador guardado localmente en este navegador.',publish:'Continuar para publicar →',clear:'Borrar borrador',publishNote:'InstallerLab prepara aquí la publicación completa. GitHub se abre solo para que el usuario con sesión iniciada confirme y publique. Si GitHub no rellena el cuerpo automáticamente, se copia para que puedas pegarlo con Ctrl+V.',previewEyebrow:'VISTA PREVIA',previewTitle:'Así se verá tu publicación',untitled:'Discusión sin título',previewEmpty:'Empieza a escribir y aquí aparecerá la publicación formateada.',readyTitle:'Tu publicación está lista.',readyCopy:'La discusión formateada fue copiada al portapapeles. GitHub abrirá la categoría seleccionada para que inicies sesión si hace falta y pulses Start discussion.',openGithub:'Abrir GitHub y publicar →',keepEditing:'Seguir editando',clipboardHint:'Si el cuerpo no se rellena automáticamente en GitHub, pulsa Ctrl+V en el campo Publicación.'}
  };

  let lang=(localStorage.getItem('il-lang')||'en').toLowerCase()==='es'?'es':'en';
  let publishUrl='';

  const fields={
    type:q('#topic-type'),area:q('#area'),title:q('#discussion-title'),body:q('#discussion-body'),version:q('#app-version'),windows:q('#windows-version'),extra:q('#extra-context')
  };

  const categoryMap={general:'general',help:'q-a',fss:'general',showcase:'show-and-tell',ideas:'ideas',bugs:'general'};
  const prefixMap={general:'General',help:'Help',fss:'FSS',showcase:'Showcase',ideas:'Ideas',bugs:'Bug'};

  function current(){return{type:fields.type.value,area:fields.area.value,title:fields.title.value,body:fields.body.value,version:fields.version.value,windows:fields.windows.value,extra:fields.extra.value};}
  function save(){localStorage.setItem(DRAFT_KEY,JSON.stringify(current()));q('#draft-status').textContent=i18n[lang].draftSaved;}
  function load(){try{const d=JSON.parse(localStorage.getItem(DRAFT_KEY)||'{}');Object.keys(fields).forEach(k=>{if(d[k]!=null)fields[k].value=d[k];});}catch{}}
  function clear(){localStorage.removeItem(DRAFT_KEY);fields.type.value='general';fields.area.value='None';fields.title.value='';fields.body.value='';fields.version.value='';fields.windows.value='';fields.extra.value='';update();}

  function formatBody(){
    const d=current();
    const lines=[];
    lines.push(d.body.trim());
    if(d.area&&d.area!=='None')lines.push(`\n---\n**InstallerLab area:** ${d.area}`);
    if(d.version)lines.push(`**InstallerLab version:** ${d.version}`);
    if(d.windows)lines.push(`**Windows:** ${d.windows}`);
    if(d.extra)lines.push(`\n**Extra context:**\n${d.extra.trim()}`);
    return lines.filter(Boolean).join('\n');
  }

  function fullTitle(){const d=current();const t=d.title.trim();if(!t)return'';return `[${prefixMap[d.type]||'General'}] ${t}`;}

  function update(){
    const d=current();
    q('#title-count').textContent=String(d.title.length);
    q('#body-count').textContent=String(d.body.length);
    q('#preview-category').textContent=(fields.type.options[fields.type.selectedIndex]?.textContent||'GENERAL').toUpperCase();
    q('#preview-title').textContent=d.title.trim()||i18n[lang].untitled;
    const p=q('#preview-body');
    if(!d.body.trim()&&!d.extra.trim())p.textContent=i18n[lang].previewEmpty;
    else{
      p.textContent=d.body.trim();
      if(d.area&&d.area!=='None'){const s=document.createElement('span');s.className='meta-line';s.textContent=`InstallerLab: ${d.area}`;p.appendChild(s);}
      if(d.version){const s=document.createElement('span');s.className='meta-line';s.textContent=`Version: ${d.version}`;p.appendChild(s);}
      if(d.windows){const s=document.createElement('span');s.className='meta-line';s.textContent=`Windows: ${d.windows}`;p.appendChild(s);}
      if(d.extra){const s=document.createElement('span');s.className='meta-line';s.textContent=d.extra.trim();p.appendChild(s);}
    }
    save();
  }

  function applyLang(){
    document.documentElement.lang=lang;
    localStorage.setItem('il-lang',lang);
    q('#community-lang').textContent=lang==='es'?'ES':'EN';
    qa('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(i18n[lang][key])el.textContent=i18n[lang][key];});
    [...fields.type.options].forEach(o=>o.textContent=o.dataset[lang]||o.textContent);
    update();
  }

  async function copyText(text){try{await navigator.clipboard.writeText(text);return true;}catch{return false;}}

  q('#discussion-form').addEventListener('submit',async e=>{
    e.preventDefault();
    const d=current();
    if(!d.title.trim()){fields.title.focus();return;}
    if(!d.body.trim()){fields.body.focus();return;}
    save();
    const body=formatBody();
    await copyText(body);
    const cat=categoryMap[d.type]||'general';
    // category is supported by GitHub Discussions. title/body are also supplied as a best-effort convenience;
    // if GitHub ignores them the clipboard fallback keeps the user's post intact.
    const params=new URLSearchParams({category:cat,title:fullTitle(),body});
    publishUrl=`${base}?${params.toString()}`;
    q('#handoff').hidden=false;
  });

  q('#open-github').addEventListener('click',()=>{if(publishUrl)window.location.href=publishUrl;});
  q('#close-handoff').addEventListener('click',()=>q('#handoff').hidden=true);
  q('#clear-button').addEventListener('click',()=>{if(confirm(lang==='es'?'¿Borrar este borrador?':'Clear this draft?'))clear();});
  q('#community-lang').addEventListener('click',()=>{lang=lang==='en'?'es':'en';applyLang();});
  qa('input,textarea,select').forEach(el=>el.addEventListener('input',update));
  q('#handoff').addEventListener('click',e=>{if(e.target===q('#handoff'))q('#handoff').hidden=true;});

  load();
  applyLang();
})();
