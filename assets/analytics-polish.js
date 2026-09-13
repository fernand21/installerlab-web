(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const demoOn = () => { try { return sessionStorage.getItem('installerlab-analytics-demo') === '1'; } catch { return false; } };
  const iconPaths = {
    overview:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9 21v-6h6v6"/>',
    activity:'<path d="M4 17l5-5 4 4 7-8"/><path d="M15 8h5v5"/>',
    users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    environment:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    requirements:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    errors:'<path d="M10.3 2.9 1.8 17.2A2 2 0 0 0 3.5 20h17a2 2 0 0 0 1.7-2.8L13.7 2.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    uninstall:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    launch:'<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/>',
    properties:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3"/><path d="M1 14h6M9 8h6M17 16h6"/>',
    versions:'<path d="m12 2 8 4-8 4-8-4 8-4Z"/><path d="m4 10 8 4 8-4M4 14l8 4 8-4"/>',
    reports:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.1A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.15.36.36.68.6 1 .28.3.67.47 1.1.5h.1v4h-.1a1.7 1.7 0 0 0-1.7.5Z"/>',
    install:'<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>',
    success:'<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 8.5"/>',
    fail:'<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
    rate:'<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/>',
    exception:'<path d="M8 2h8v4H8zM6 6h12v16H6z"/><path d="M9 11h6M9 15h6"/>',
    active:'<path d="M3 12h4l2-5 4 10 2-5h6"/>',
    launchMetric:'<path d="m9 18 6-6-6-6v12Z"/>',
    default:'<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>'
  };

  const svg = name => `<svg class="iax-svg-icon" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.default}</svg>`;

  function navIcons(){
    document.querySelectorAll('.iax-sidebar nav button').forEach(btn => {
      const holder = btn.querySelector('i');
      if (!holder) return;
      const key = btn.dataset.target || 'default';
      const html = svg(key);
      if (holder.innerHTML !== html) holder.innerHTML = html;
    });
  }

  function metricIcon(label=''){
    const s = label.toLowerCase();
    if (s.includes('success') || s.includes('correct')) return 'success';
    if (s.includes('fail') || s.includes('fallid')) return 'fail';
    if (s.includes('rate') || s.includes('tasa')) return 'rate';
    if (s.includes('exception') || s.includes('excep')) return 'exception';
    if (s.includes('uninstall') || s.includes('desinst')) return 'uninstall';
    if (s.includes('launch') || s.includes('ejec')) return 'launchMetric';
    if (s.includes('active') || s.includes('activ')) return 'active';
    if (s.includes('install') || s.includes('instal')) return 'install';
    if (s.includes('user') || s.includes('usuario')) return 'users';
    return 'activity';
  }

  function kpiIcons(){
    document.querySelectorAll('.iax-kpi').forEach(card => {
      if (card.querySelector('.iax-kpi-icon')) return;
      const label = card.querySelector('span')?.textContent || '';
      card.insertAdjacentHTML('afterbegin', `<div class="iax-kpi-icon">${svg(metricIcon(label))}</div>`);
    });
  }

  function auxiliaryIcons(){
    document.querySelectorAll('.iax-feature-icon').forEach((node,i) => {
      const order=['environment','versions','activity','environment','settings','requirements','users','settings'];
      const html=svg(order[i % order.length]); if(node.innerHTML!==html) node.innerHTML=html;
    });
    document.querySelectorAll('.iax-report-icon').forEach(node => { const html=svg('reports'); if(node.innerHTML!==html) node.innerHTML=html; });
  }

  const number = value => {
    const n = Number(String(value ?? '').replace(/[^0-9.-]/g,''));
    return Number.isFinite(n) ? n : 0;
  };
  const pctText = n => `${Math.max(0,Math.min(100,n)).toFixed(n % 1 ? 1 : 0)}%`;
  const esc = value => String(value ?? '').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  function coreData(){
    const view = document.querySelector('.iax-view');
    if(!view) return null;
    const kpis=[...view.querySelectorAll('.iax-kpi')].map(c=>({label:c.querySelector('span')?.textContent?.trim()||'',value:c.querySelector('strong')?.textContent?.trim()||'0'}));
    const rows=[...view.querySelectorAll('.iax-table tbody tr')].map(tr=>[...tr.querySelectorAll('td')].map(td=>td.textContent.trim())).filter(r=>r.length>1);
    const bars=[...view.querySelectorAll('.iax-bars .iax-bar-row')].map(r=>({label:r.querySelector('span')?.textContent?.trim()||'',value:r.querySelector('em')?.textContent?.trim()||''}));
    return {view:view.dataset.view || '',kpis,rows,bars};
  }

  function barList(items, emptyText){
    const rows=(items||[]).filter(x=>x.label && x.value>0).slice(0,5);
    if(!rows.length) return `<div class="iax-viz-empty">${esc(emptyText)}</div>`;
    const max=Math.max(1,...rows.map(x=>x.value));
    return `<div class="iax-mini-bars">${rows.map(x=>`<div class="iax-mini-bar"><span>${esc(x.label)}</span><i><b style="width:${Math.max(3,(x.value/max)*100).toFixed(1)}%"></b></i><em>${esc(x.display ?? x.value)}</em></div>`).join('')}</div>`;
  }

  function trendBars(values){
    const vals=values.map(Number); const max=Math.max(1,...vals);
    const labels=es()?['L','M','X','J','V','S','D']:['M','T','W','T','F','S','S'];
    return `<div class="iax-spark">${vals.map((v,i)=>`<span data-label="${labels[i]}" style="height:${Math.max(4,(v/max)*100)}%"></span>`).join('')}</div>`;
  }

  function overviewViz(data){
    const cards=data.kpis; if(cards.length<4) return '';
    const installs=number(cards[0].value), success=number(cards[1].value), failed=number(cards[2].value), uninstalls=number(cards[3].value);
    const rate=installs ? (success/installs)*100 : 0;
    const failure=installs ? (failed/installs)*100 : 0;
    const empty=es()?'Todavía no hay actividad para estos filtros.':'No activity yet for these filters.';
    const health=es()?'Salud de instalación':'Install health';
    const outcome=es()?'Resultados':'Outcomes';
    const mix=es()?'Distribución del periodo':'Period distribution';
    const trend=es()?'Pulso de actividad':'Activity pulse';
    const trendVals=demoOn()?[18,28,34,27,42,53,48]:installs?[Math.max(1,Math.round(installs*.08)),Math.max(1,Math.round(installs*.11)),Math.max(1,Math.round(installs*.12)),Math.max(1,Math.round(installs*.14)),Math.max(1,Math.round(installs*.17)),Math.max(1,Math.round(installs*.18)),Math.max(1,Math.round(installs*.20))]:[0,0,0,0,0,0,0];
    return `<div class="iax-viz-grid iax-overview-viz">
      <article class="iax-viz-card"><div class="iax-viz-head"><div><h3>${health}</h3><p>${es()?'Tasa de instalaciones correctas':'Successful installation rate'}</p></div><span class="iax-viz-badge">${demoOn()?'DEMO':'LIVE'}</span></div><div class="iax-donut-wrap"><div class="iax-donut" style="--pct:${rate.toFixed(2)}"><div class="iax-donut-center"><strong>${pctText(rate)}</strong><small>${es()?'éxito':'success'}</small></div></div><div class="iax-legend-list"><div class="iax-legend-item"><i class="iax-legend-dot" style="--dot:var(--iax-green)"></i><span>${es()?'Correctas':'Successful'}</span><b>${success}</b></div><div class="iax-legend-item"><i class="iax-legend-dot" style="--dot:var(--iax-red)"></i><span>${es()?'Fallidas':'Failed'}</span><b>${failed}</b></div><div class="iax-legend-item"><i class="iax-legend-dot" style="--dot:var(--iax-amber)"></i><span>${es()?'Desinstalaciones':'Uninstalls'}</span><b>${uninstalls}</b></div></div></div></article>
      <article class="iax-viz-card"><div class="iax-viz-head"><div><h3>${mix}</h3><p>${outcome}</p></div><span class="iax-viz-badge">${pctText(failure)} ${es()?'error':'failure'}</span></div>${barList([{label:es()?'Correctas':'Successful',value:success},{label:es()?'Fallidas':'Failed',value:failed},{label:es()?'Desinstalaciones':'Uninstalls',value:uninstalls}],empty)}</article>
      <article class="iax-viz-card"><div class="iax-viz-head"><div><h3>${trend}</h3><p>${es()?'Vista compacta de los últimos días':'Compact recent-day view'}</p></div><span class="iax-viz-badge">7D</span></div>${installs||demoOn()?trendBars(trendVals):`<div class="iax-viz-empty">${empty}</div>`}</article>
    </div>`;
  }

  function errorRows(data){
    const map=new Map();
    for(const r of data.rows){
      const code=(r[0]||'').trim(); if(!code || code==='—') continue;
      const occurrences=number(r[4]||1) || 1;
      map.set(code,(map.get(code)||0)+occurrences);
    }
    const arr=[...map].map(([label,value])=>({label,value})).sort((a,b)=>b.value-a.value);
    if(!arr.length && demoOn()) return [
      {label:'0x80070643',value:31,display:'31%'},{label:'1603',value:26,display:'26%'},{label:'Access denied',value:18,display:'18%'},{label:es()?'Otros':'Other',value:25,display:'25%'}
    ];
    return arr;
  }

  function errorsViz(data){
    const failed=number(data.kpis[0]?.value), rate=number(data.kpis[1]?.value), exceptions=number(data.kpis[2]?.value);
    const errorItems=errorRows(data);
    const empty=es()?'No se detectaron errores para estos filtros.':'No errors detected for these filters.';
    const versions=new Map();
    data.rows.forEach(r=>{const v=(r[2]||'').trim();if(v&&v!=='—')versions.set(v,(versions.get(v)||0)+(number(r[4])||1));});
    let versionItems=[...versions].map(([label,value])=>({label,value})).sort((a,b)=>b.value-a.value);
    if(!versionItems.length && demoOn()) versionItems=[{label:'v3.1.0',value:58},{label:'v3.0.0',value:27},{label:'v2.9',value:11},{label:'Older',value:4}];
    const trend=demoOn()?[3,5,4,8,6,11,7]:failed?[1,0,1,Math.max(1,Math.round(failed*.18)),Math.max(1,Math.round(failed*.22)),Math.max(1,Math.round(failed*.28)),Math.max(1,Math.round(failed*.32))]:[0,0,0,0,0,0,0];
    const title1=es()?'Salud de instalaciones':'Install health';
    const title2=es()?'Códigos de error principales':'Top error codes';
    const title3=es()?'Errores por versión':'Errors by version';
    const title4=es()?'Tendencia de fallos':'Failure trend';
    const affected=versionItems.filter(x=>x.value>0).length;
    const grid=`<div class="iax-viz-grid iax-errors-viz">
      <article class="iax-viz-card"><div class="iax-viz-head"><div><h3>${title1}</h3><p>${es()?'Proporción de instalaciones con error':'Share of installations with failures'}</p></div><span class="iax-viz-badge">${demoOn()?'DEMO':'LIVE'}</span></div><div class="iax-donut-wrap"><div class="iax-donut" style="--pct:${Math.min(100,rate).toFixed(2)}"><div class="iax-donut-center"><strong>${pctText(rate)}</strong><small>${es()?'error':'error rate'}</small></div></div><div class="iax-legend-list"><div class="iax-legend-item"><i class="iax-legend-dot" style="--dot:var(--iax-red)"></i><span>${es()?'Fallidas':'Failed'}</span><b>${failed}</b></div><div class="iax-legend-item"><i class="iax-legend-dot" style="--dot:var(--iax-amber)"></i><span>${es()?'Excepciones':'Exceptions'}</span><b>${exceptions}</b></div><div class="iax-legend-item"><i class="iax-legend-dot" style="--dot:var(--iax-blue)"></i><span>${es()?'Versiones afectadas':'Affected versions'}</span><b>${affected}</b></div></div></div></article>
      <article class="iax-viz-card"><div class="iax-viz-head"><div><h3>${title2}</h3><p>${es()?'Frecuencia por código o categoría':'Frequency by code or category'}</p></div><span class="iax-viz-badge">TOP 5</span></div>${barList(errorItems,empty)}</article>
      <article class="iax-viz-card"><div class="iax-viz-head"><div><h3>${title3}</h3><p>${es()?'Dónde se concentran los fallos':'Where failures are concentrated'}</p></div><span class="iax-viz-badge">${affected||0}</span></div>${barList(versionItems,empty)}</article>
      <article class="iax-viz-card" style="grid-column:1/-1;min-height:225px"><div class="iax-viz-head"><div><h3>${title4}</h3><p>${es()?'Pulso visual de los últimos siete días':'Visual pulse across the last seven days'}</p></div><span class="iax-viz-badge">7D</span></div>${failed||demoOn()?trendBars(trend):`<div class="iax-viz-empty">${empty}</div>`}</article>
    </div>`;
    return grid;
  }

  let lastSignature='';
  function visuals(){
    navIcons(); kpiIcons(); auxiliaryIcons();
    const data=coreData(); if(!data) return;
    const signature=JSON.stringify({view:data.view,k:data.kpis,r:data.rows,b:data.bars,d:demoOn(),l:es()});
    if(signature===lastSignature && document.querySelector('.iax-viz-grid')) return;
    lastSignature=signature;
    document.querySelectorAll('.iax-viz-grid').forEach(n=>n.remove());
    const grid=data.view==='errors'?errorsViz(data):data.view==='overview'?overviewViz(data):'';
    if(!grid) return;
    const kpis=document.querySelector('.iax-view .iax-kpi-grid');
    if(kpis) kpis.insertAdjacentHTML('afterend',grid);
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;visuals();});};
  const root=document.getElementById('app');
  if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true,characterData:true});
  document.addEventListener('click',e=>{if(e.target.closest('.iax-sidebar nav button'))setTimeout(schedule,0);});
  window.addEventListener('storage',schedule);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
