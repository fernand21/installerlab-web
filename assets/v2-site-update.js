(() => {
  let queued=false;
  const l=()=>((localStorage.getItem('il-lang')||'es').toLowerCase()==='en'?'en':'es');
  const icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16v16H4z"/><path d="M8 12h8M12 8v8"/></svg>';
  function addBundleCard(grid,withLink){
    if(!grid||grid.querySelector('[data-v2-bundle]'))return;
    const es=l()==='es';
    const article=document.createElement('article');article.className='card';article.dataset.v2Bundle='1';
    article.innerHTML=`${icon}<h3>Bundle</h3><p>${es?'Bootstrapper WiX Burn que encadena prerequisitos EXE/MSI y el MSI principal en un único ejecutable.':'WiX Burn bootstrapper that chains EXE/MSI prerequisites and the main MSI into one executable.'}</p>${withLink?`<a href="${location.pathname.includes('/features/')?'../':''}docs/#bundle">${es?'Más información →':'Learn more →'}</a>`:''}`;
    grid.appendChild(article);
  }
  function apply(){
    const page=document.body.dataset.page||'home',es=l()==='es';
    if(page==='home'){
      const p=document.querySelector('.hero .hero-grid>div>p');if(p)p.textContent=es?'InstallerLab reúne Setup EXE, Portable, MSI y Bundle WiX Burn en un espacio de trabajo visual, usando el mismo proyecto FSS como fuente de configuración.':'InstallerLab brings Setup EXE, Portable, MSI and WiX Burn Bundle workflows into one visual workspace, all driven by the same FSS project.';
      const strip=document.querySelector('.build-strip');if(strip)strip.innerHTML='<i class="ok"></i> Build workspace · Setup EXE · Portable · MSI · Bundle';
      const grids=[...document.querySelectorAll('section .grid')];if(grids.length)addBundleCard(grids[0],true);
    }
    if(page==='features'){
      const hero=document.querySelector('.page-hero .shell p');if(hero)hero.textContent=es?'Setup EXE, Portable, MSI, Bundle WiX Burn y B4J Portable comparten el mismo proyecto visual/FSS, con backends separados y responsabilidades claras.':'Setup EXE, Portable, MSI, WiX Burn Bundle and B4J Portable share the same visual/FSS project while keeping separate backends and clear responsibilities.';
      addBundleCard(document.querySelector('main.content .grid'),false);
    }
    if(page==='faq'){
      const first=document.querySelector('.faq details:first-child p');if(first)first.textContent=es?'No para los flujos normales de Setup EXE, Portable, MSI o Bundle. B4J solo es necesario cuando construyes un proyecto B4J mediante B4J Portable.':'No for normal Setup EXE, Portable, MSI or Bundle workflows. B4J is only required when building a B4J project through B4J Portable.';
      const faq=document.querySelector('.faq');if(faq&&!faq.querySelector('[data-v2-wix-faq]')){const d=document.createElement('details');d.dataset.v2WixFaq='1';d.innerHTML=`<summary>${es?'¿Necesito WiX?':'Do I need WiX?'}</summary><p>${es?'Solo para crear MSI o Bundle. InstallerLab puede ejecutarse sin WiX, pero esas dos salidas requieren el CLI de WiX y sus extensiones BootstrapperApplications y Util en la máquina de build.':'Only when creating MSI or Bundle packages. InstallerLab can run without WiX, but those two outputs require the WiX CLI plus the BootstrapperApplications and Util extensions on the build machine.'}</p>`;faq.appendChild(d);}
    }
    if(page==='support'){
      document.querySelectorAll('code').forEach(c=>{if(c.textContent.includes('Build type:')&&!c.textContent.includes('Bundle'))c.textContent=c.textContent.replace('Build type: Setup EXE / Portable / MSI / B4J Portable','Build type: Setup EXE / Portable / MSI / Bundle / B4J Portable');});
    }
  }
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();
