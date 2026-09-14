(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const COLORS = ['#3db5ff','#56dfbd','#9c7cff','#ffbb57','#ff7474','#5f8dff'];
  const SUPPORTED = new Set(['overview','activity','users','environment','errors','uninstall','launch','versions']);

  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const C = () => es() ? {
    live:'Analítica en vivo', overview:'Resumen', overviewSub:'Salud de instalaciones, versiones, errores y uso a partir de la telemetría real que envía InstallerLab.',
    activity:'Actividad de instalación', activitySub:'Compara instalaciones iniciadas, correctas, fallidas, desinstalaciones y ejecuciones en el tiempo.',
    installations:'Instalaciones', installationsSub:'Equipos identificados por install_id, instalaciones activas, bajas y uso posterior.',
    environment:'Entorno real', environmentSub:'Solo datos que InstallerLab envía actualmente: Windows, arquitectura, idioma y tipo de paquete.',
    errors:'Errores de instalación', errorsSub:'Códigos y etapas reales recibidos en eventos de instalación fallida.',
    uninstall:'Desinstalaciones', uninstallSub:'Actividad de desinstalación registrada por versión y paquete.',
    launch:'Ejecuciones y uso', launchSub:'Eventos de lanzamiento registrados después de instalar la aplicación.',
    versions:'Versiones', versionsSub:'Compara adopción y resultados de instalación entre versiones reales de la aplicación.',
    installs:'Instalaciones', successful:'Correctas', failed:'Fallidas', uninstalls:'Desinstalaciones', active:'Activas', launches:'Ejecuciones', unique:'Instalaciones únicas', successRate:'Éxito', avgDuration:'Duración media', versionsCount:'Versiones',
    timeline:'Actividad por fecha', timelineSub:'Comparativa directa de los eventos recibidos.', health:'Salud de instalación', healthSub:'Correctas frente a fallidas.', recent:'Eventos recientes', recentSub:'Últimos eventos reales para este TrackID.',
    windows:'Versiones de Windows', windowsSub:'Distribución por windows_version.', architecture:'Arquitectura', architectureSub:'x64, x86, ARM64 u otros valores recibidos.', language:'Idioma', languageSub:'Distribución por language.', packages:'Tipos de paquete', packagesSub:'Setup EXE, MSI, Bundle, Portable u otros valores recibidos.',
    byVersion:'Rendimiento por versión', byVersionSub:'Iniciadas, correctas y fallidas por app_version.', errorCodes:'Códigos de error', errorCodesSub:'Agrupación por error_code.', stages:'Etapas', stagesSub:'Etapas de instalación donde se produjo el fallo.', noData:'Todavía no hay datos reales para estos filtros.',
    date:'Fecha', event:'Evento', version:'Versión', package:'Paquete', result:'Resultado', arch:'Arquitectura', windowsShort:'Windows', lang:'Idioma', duration:'Duración', code:'Código', stage:'Etapa',
    uniqueLaunch:'Instalaciones con ejecución', launchesPerInstall:'Ejecuciones / instalación', lastActivity:'Última actividad', affectedVersions:'Versiones afectadas', topCode:'Código principal', topStage:'Etapa principal',
    started:'Iniciadas', connected:'MySQL · datos reales', allTime:'Histórico real'
  } : {
    live:'Live analytics', overview:'Overview', overviewSub:'Install health, releases, errors and usage based only on telemetry actually sent by InstallerLab.',
    activity:'Install activity', activitySub:'Compare started, successful, failed, uninstall and launch events over time.',
    installations:'Installations', installationsSub:'Devices represented by install_id, active installs, removals and post-install usage.',
    environment:'Real environment', environmentSub:'Only data InstallerLab currently sends: Windows, architecture, language and package type.',
    errors:'Install errors', errorsSub:'Real error codes and stages received with failed install events.',
    uninstall:'Uninstalls', uninstallSub:'Recorded uninstall activity grouped by version and package.',
    launch:'Launch & usage', launchSub:'Launch events recorded after the application has been installed.',
    versions:'Versions', versionsSub:'Compare adoption and install results across real application versions.',
    installs:'Installs', successful:'Successful', failed:'Failed', uninstalls:'Uninstalls', active:'Active', launches:'Launches', unique:'Unique installs', successRate:'Success rate', avgDuration:'Avg duration', versionsCount:'Versions',
    timeline:'Activity over time', timelineSub:'Direct comparison of received events.', health:'Install health', healthSub:'Successful versus failed installs.', recent:'Recent events', recentSub:'Latest real events for this TrackID.',
    windows:'Windows versions', windowsSub:'Distribution by windows_version.', architecture:'Architecture', architectureSub:'x64, x86, ARM64 or other received values.', language:'Language', languageSub:'Distribution by language.', packages:'Package types', packagesSub:'Setup EXE, MSI, Bundle, Portable or other received values.',
    byVersion:'Release performance', byVersionSub:'Started, successful and failed installs by app_version.', errorCodes:'Error codes', errorCodesSub:'Grouped by error_code.', stages:'Stages', stagesSub:'Install stages where failures occurred.', noData:'No real data yet for these filters.',
    date:'Date', event:'Event', version:'Version', package:'Package', result:'Result', arch:'Architecture', windowsShort:'Windows', lang:'Language', duration:'Duration', code:'Code', stage:'Stage',
    uniqueLaunch:'Installs with launches', launchesPerInstall:'Launches / install', lastActivity:'Last activity', affectedVersions:'Affected versions', topCode:'Top code', topStage:'Top stage',
    started:'Started', connected:'MySQL · real data', allTime:'Real history'
  };

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const lower = v => String(v || '').toLowerCase();
  const eventsOf = d => Array.isArray(d?.events) ? d.events : Array.isArray(d?.recent_events) ? d.recent_events : [];
  const num = v => Number.isFinite(Number(v)) ? Number(v) : 0;
  const eventType = r => lower(r?.event_type);
  const isStarted = r => eventType(r) === 'install_started';
  const isSuccess = r => eventType(r) === 'install_succeeded';
  const isFailed = r => eventType(r) === 'install_failed' || lower(r?.result).includes('fail');
  const isUninstall = r => eventType(r).includes('uninstall');
  const isLaunch = r => eventType(r) === 'launch';

  function filteredEvents(data) {
    const rows = eventsOf(data);
    const selects = [...document.querySelectorAll('.iax-filterbar select')];
    const version = selects[1]?.selectedIndex > 0 ? selects[1].value : '';
    const pkg = selects[2]?.selectedIndex > 0 ? selects[2].value : '';
    const arch = selects[3]?.selectedIndex > 0 ? selects[3].value : '';
    return rows.filter(r => (!version || String(r.app_version || '') === version) && (!pkg || String(r.package_type || '') === pkg) && (!arch || String(r.architecture || '') === arch));
  }

  function metrics(rows) {
    const started = rows.filter(isStarted);
    const success = rows.filter(isSuccess);
    const failed = rows.filter(isFailed);
    const uninstalls = rows.filter(isUninstall);
    const launches = rows.filter(isLaunch);
    const allIds = new Set(rows.map(r => r.install_id).filter(Boolean));
    const successIds = new Set(success.map(r => r.install_id).filter(Boolean));
    const removedIds = new Set(uninstalls.map(r => r.install_id).filter(Boolean));
    let active = [...successIds].filter(id => !removedIds.has(id)).length;
    if (!active && success.length) active = Math.max(0, success.length - uninstalls.length);
    const durations = success.map(r => num(r.duration_ms)).filter(v => v > 0);
    const avg = durations.length ? Math.round(durations.reduce((a,b)=>a+b,0) / durations.length) : 0;
    return {
      started:started.length, success:success.length, failed:failed.length, uninstalls:uninstalls.length, launches:launches.length,
      unique:allIds.size, active, avg, rate:started.length ? (success.length / started.length) * 100 : 0,
      launchIds:new Set(launches.map(r=>r.install_id).filter(Boolean)).size
    };
  }

  function dateValue(v) {
    if (!v) return null;
    const raw = String(v).includes('T') ? String(v) : String(v).replace(' ', 'T');
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  function dayKey(v){const d=dateValue(v);return d?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';}
  function shortDate(k){const d=new Date(`${k}T00:00:00`);return Number.isNaN(d.getTime())?k:d.toLocaleDateString(undefined,{month:'short',day:'numeric'});}
  function fmtDate(v){const d=dateValue(v);return d?d.toLocaleString():'—';}
  function fmtDuration(ms){ms=num(ms);if(!ms)return '—';if(ms<1000)return `${ms} ms`;const s=ms/1000;return s<60?`${s.toFixed(s<10?1:0)} s`:`${(s/60).toFixed(1)} min`;}

  function group(rows, getter) {
    const m = new Map();
    for (const row of rows) {
      const key = String(getter(row) || '').trim();
      if (!key) continue;
      m.set(key, (m.get(key) || 0) + 1);
    }
    return [...m].map(([label,value])=>({label,value})).sort((a,b)=>b.value-a.value);
  }

  function header(title, subtitle) {
    const c=C();
    return `<div class="iax-real-head"><div><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div><span class="iax-real-chip">${esc(c.connected)}</span></div>`;
  }
  function kpi(label, value, note='') { return `<article class="iax-real-kpi"><span>${esc(label)}</span><strong>${esc(value)}</strong>${note?`<small>${esc(note)}</small>`:''}</article>`; }
  function card(title, subtitle, body, badge='LIVE') { return `<article class="iax-real-card"><div class="iax-real-card-head"><div><h3>${esc(title)}</h3>${subtitle?`<p>${esc(subtitle)}</p>`:''}</div>${badge?`<span class="iax-real-badge">${esc(badge)}</span>`:''}</div>${body}</article>`; }
  function empty(){return `<div class="iax-real-empty">${esc(C().noData)}</div>`;}

  function donut(title, subtitle, items) {
    const top = items.filter(x=>x.value>0).slice(0,6);
    if (!top.length) return card(title, subtitle, empty());
    const total = top.reduce((a,b)=>a+b.value,0) || 1;
    let cursor=0;
    const stops=[];
    top.forEach((x,i)=>{const start=cursor;cursor += x.value/total*100;stops.push(`${COLORS[i%COLORS.length]} ${start.toFixed(2)}% ${cursor.toFixed(2)}%`);});
    const legend = top.map((x,i)=>`<div class="iax-donut-legend-row"><i style="--swatch:${COLORS[i%COLORS.length]}"></i><span>${esc(x.label)}</span><b>${Math.round(x.value/total*100)}%</b></div>`).join('');
    return card(title, subtitle, `<div class="iax-donut-layout"><div class="iax-donut" style="--donut:conic-gradient(${stops.join(',')})"><div class="iax-donut-center"><strong>${total}</strong><small>events</small></div></div><div class="iax-donut-legend">${legend}</div></div>`);
  }

  function bars(title, subtitle, items, maxItems=7) {
    const rows=items.filter(x=>x.value>0).slice(0,maxItems);
    if(!rows.length)return card(title,subtitle,empty());
    const max=Math.max(1,...rows.map(x=>x.value));
    return card(title,subtitle,`<div class="iax-real-bars">${rows.map(x=>`<div class="iax-real-bar"><span title="${esc(x.label)}">${esc(x.label)}</span><i><b style="--w:${(x.value/max*100).toFixed(1)}%"></b></i><em>${x.value}</em></div>`).join('')}</div>`);
  }

  function lineChart(rows, kinds) {
    const byDay = new Map();
    for(const r of rows){const day=dayKey(r.event_at||r.created_at);if(!day)continue;if(!byDay.has(day))byDay.set(day,{});const o=byDay.get(day);for(const k of kinds){if(k.test(r))o[k.key]=(o[k.key]||0)+1;}}
    let days=[...byDay.keys()].sort();
    if(!days.length)return empty();
    if(days.length===1){const d=new Date(`${days[0]}T00:00:00`);const prev=new Date(d);prev.setDate(prev.getDate()-1);const next=new Date(d);next.setDate(next.getDate()+1);const key=x=>`${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`;days=[key(prev),days[0],key(next)];}
    const W=760,H=230,L=38,R=18,T=18,B=34;
    const allValues=[];for(const day of days)for(const k of kinds)allValues.push(byDay.get(day)?.[k.key]||0);
    const max=Math.max(1,...allValues);
    const x=i=>L+(days.length===1?0:(W-L-R)*i/(days.length-1));
    const y=v=>T+(H-T-B)*(1-v/max);
    const grid=[0,.25,.5,.75,1].map(f=>{const yy=T+(H-T-B)*f;const val=Math.round(max*(1-f));return `<line x1="${L}" y1="${yy}" x2="${W-R}" y2="${yy}"/><text x="4" y="${yy+3}" class="iax-line-axis">${val}</text>`;}).join('');
    const paths=kinds.map((k,ki)=>{const points=days.map((d,i)=>`${x(i)},${y(byDay.get(d)?.[k.key]||0)}`).join(' ');const dots=days.map((d,i)=>`<circle class="iax-line-dot" cx="${x(i)}" cy="${y(byDay.get(d)?.[k.key]||0)}" r="3.5" fill="${k.color}"/>`).join('');return `<polyline class="iax-line-path" points="${points}" stroke="${k.color}"/>${dots}`;}).join('');
    const step=Math.max(1,Math.ceil(days.length/7));
    const labels=days.map((d,i)=>i%step===0||i===days.length-1?`<text x="${x(i)}" y="${H-8}" text-anchor="middle" class="iax-line-axis">${esc(shortDate(d))}</text>`:'').join('');
    const legend=kinds.map(k=>`<span><i style="--dot:${k.color}"></i>${esc(k.label)}</span>`).join('');
    return `<div class="iax-real-chart"><svg class="iax-line-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><g class="iax-line-grid">${grid}</g>${paths}${labels}</svg><div class="iax-line-legend">${legend}</div></div>`;
  }

  const timelineKinds = () => {const c=C();return [
    {key:'started',label:c.started,color:'#3db5ff',test:isStarted},{key:'success',label:c.successful,color:'#56dfbd',test:isSuccess},{key:'failed',label:c.failed,color:'#ff7474',test:isFailed},{key:'uninstall',label:c.uninstalls,color:'#ffbb57',test:isUninstall},{key:'launch',label:c.launches,color:'#9c7cff',test:isLaunch}
  ];};

  function versionStats(rows){
    const map=new Map();
    for(const r of rows){const v=String(r.app_version||'').trim();if(!v)continue;const x=map.get(v)||{version:v,started:0,success:0,failed:0,launches:0};if(isStarted(r))x.started++;if(isSuccess(r))x.success++;if(isFailed(r))x.failed++;if(isLaunch(r))x.launches++;map.set(v,x);}
    return [...map.values()].sort((a,b)=>(b.started+b.success+b.failed+b.launches)-(a.started+a.success+a.failed+a.launches));
  }
  function versionComparison(rows){
    const c=C(), stats=versionStats(rows);
    if(!stats.length)return empty();
    const max=Math.max(1,...stats.flatMap(x=>[x.started,x.success,x.failed]));
    return `<div>${stats.slice(0,10).map(x=>`<div class="iax-version-row"><div class="iax-version-name">${esc(x.version)}</div><div class="iax-version-bars"><div class="iax-version-track" title="${esc(c.started)} ${x.started}"><b style="--w:${x.started/max*100}%;--fill:#3db5ff"></b></div><div class="iax-version-track" title="${esc(c.successful)} ${x.success}"><b style="--w:${x.success/max*100}%;--fill:#56dfbd"></b></div><div class="iax-version-track" title="${esc(c.failed)} ${x.failed}"><b style="--w:${x.failed/max*100}%;--fill:#ff7474"></b></div></div><div class="iax-version-meta">${x.success}/${x.started || 0} ${esc(c.successful)}<br>${x.failed} ${esc(c.failed)}</div></div>`).join('')}</div>`;
  }

  function table(rows, mode='events') {
    const c=C();
    if(!rows.length)return empty();
    if(mode==='errors'){
      return `<div class="iax-real-table-wrap"><table class="iax-real-table"><thead><tr><th>${c.date}</th><th>${c.code}</th><th>${c.stage}</th><th>${c.version}</th><th>${c.package}</th><th>${c.result}</th></tr></thead><tbody>${rows.slice(0,60).map(r=>`<tr><td>${esc(fmtDate(r.event_at))}</td><td>${esc(r.error_code||'—')}</td><td>${esc(r.stage||'—')}</td><td>${esc(r.app_version||'—')}</td><td>${esc(r.package_type||'—')}</td><td class="iax-result-bad">${esc(r.result||r.event_type||'—')}</td></tr>`).join('')}</tbody></table></div>`;
    }
    return `<div class="iax-real-table-wrap"><table class="iax-real-table"><thead><tr><th>${c.date}</th><th>${c.event}</th><th>${c.version}</th><th>${c.package}</th><th>${c.result}</th><th>${c.arch}</th><th>${c.windowsShort}</th><th>${c.lang}</th></tr></thead><tbody>${rows.slice(0,80).map(r=>`<tr><td>${esc(fmtDate(r.event_at))}</td><td><span class="iax-event-type">${esc(r.event_type||'—')}</span></td><td>${esc(r.app_version||'—')}</td><td>${esc(r.package_type||'—')}</td><td class="${isFailed(r)?'iax-result-bad':isSuccess(r)?'iax-result-ok':''}">${esc(r.result||'—')}</td><td>${esc(r.architecture||'—')}</td><td>${esc(r.windows_version||'—')}</td><td>${esc(r.language||'—')}</td></tr>`).join('')}</tbody></table></div>`;
  }

  function overview(data, rows){
    const c=C(), m=metrics(rows);
    return `<section class="iax-view iax-real-view" data-view="overview">${header(c.overview,c.overviewSub)}<div class="iax-real-kpis">${kpi(c.installs,m.started)}${kpi(c.successful,m.success,`${m.rate.toFixed(1)}% ${c.successRate.toLowerCase()}`)}${kpi(c.failed,m.failed)}${kpi(c.uninstalls,m.uninstalls)}${kpi(c.active,m.active)}${kpi(c.launches,m.launches)}</div><div class="iax-real-grid">${card(c.timeline,c.timelineSub,lineChart(rows,timelineKinds()))}${donut(c.health,c.healthSub,[{label:c.successful,value:m.success},{label:c.failed,value:m.failed}])}</div><div class="iax-real-grid equal">${card(c.byVersion,c.byVersionSub,versionComparison(rows))}${donut(c.packages,c.packagesSub,group(rows,r=>r.package_type))}</div>${card(c.recent,c.recentSub,table(rows))}</section>`;
  }

  function activity(data, rows){
    const c=C(),m=metrics(rows);
    return `<section class="iax-view iax-real-view" data-view="activity">${header(c.activity,c.activitySub)}<div class="iax-real-kpis">${kpi(c.started,m.started)}${kpi(c.successful,m.success)}${kpi(c.failed,m.failed)}${kpi(c.successRate,`${m.rate.toFixed(1)}%`)}${kpi(c.avgDuration,fmtDuration(m.avg))}${kpi(c.unique,m.unique)}</div>${card(c.timeline,c.timelineSub,lineChart(rows,timelineKinds()))}<div style="height:16px"></div>${card(c.recent,c.recentSub,table(rows))}</section>`;
  }

  function installations(data, rows){
    const c=C(),m=metrics(rows), success=rows.filter(isSuccess);
    const removed=rows.filter(isUninstall);
    return `<section class="iax-view iax-real-view" data-view="users">${header(c.installations,c.installationsSub)}<div class="iax-real-kpis">${kpi(c.unique,m.unique)}${kpi(c.active,m.active)}${kpi(c.uninstalls,m.uninstalls)}${kpi(c.launches,m.launches)}${kpi(c.successRate,`${m.rate.toFixed(1)}%`)}${kpi(c.avgDuration,fmtDuration(m.avg))}</div><div class="iax-real-grid equal">${donut(c.byVersion,c.byVersionSub,group(success,r=>r.app_version))}${donut(c.packages,c.packagesSub,group(success,r=>r.package_type))}</div>${card(c.recent,c.recentSub,table([...success,...removed].sort((a,b)=>(dateValue(b.event_at)?.getTime()||0)-(dateValue(a.event_at)?.getTime()||0))))}</section>`;
  }

  function environment(data, rows){
    const c=C();
    return `<section class="iax-view iax-real-view" data-view="environment">${header(c.environment,c.environmentSub)}<div class="iax-real-grid equal">${donut(c.windows,c.windowsSub,group(rows,r=>r.windows_version))}${donut(c.architecture,c.architectureSub,group(rows,r=>r.architecture))}${bars(c.language,c.languageSub,group(rows,r=>r.language))}${donut(c.packages,c.packagesSub,group(rows,r=>r.package_type))}</div></section>`;
  }

  function errors(data, rows){
    const c=C(),m=metrics(rows), failed=rows.filter(isFailed), codes=group(failed,r=>r.error_code||'Install failed'), stages=group(failed,r=>r.stage||'Unknown');
    return `<section class="iax-view iax-real-view" data-view="errors">${header(c.errors,c.errorsSub)}<div class="iax-real-kpis">${kpi(c.failed,failed.length)}${kpi(c.successRate,`${m.started?(failed.length/m.started*100).toFixed(1):'0.0'}%`,c.failed)}${kpi(c.topCode,codes[0]?.label||'—')}${kpi(c.topStage,stages[0]?.label||'—')}${kpi(c.affectedVersions,new Set(failed.map(r=>r.app_version).filter(Boolean)).size)}${kpi(c.avgDuration,fmtDuration(m.avg))}</div><div class="iax-real-grid equal">${bars(c.errorCodes,c.errorCodesSub,codes)}${bars(c.stages,c.stagesSub,stages)}</div>${card(c.recent,c.recentSub,table(failed,'errors'))}</section>`;
  }

  function uninstall(data, rows){
    const c=C(), u=rows.filter(isUninstall), versions=group(u,r=>r.app_version), pkgs=group(u,r=>r.package_type), last=u[0]?.event_at;
    const kinds=[{key:'uninstall',label:c.uninstalls,color:'#ffbb57',test:isUninstall}];
    return `<section class="iax-view iax-real-view" data-view="uninstall">${header(c.uninstall,c.uninstallSub)}<div class="iax-real-kpis">${kpi(c.uninstalls,u.length)}${kpi(c.affectedVersions,versions.length)}${kpi(c.packages,pkgs.length)}${kpi(c.lastActivity,last?fmtDate(last):'—')}</div><div class="iax-real-grid">${card(c.timeline,c.timelineSub,lineChart(u,kinds))}${donut(c.byVersion,c.byVersionSub,versions)}</div>${card(c.recent,c.recentSub,table(u))}</section>`;
  }

  function launch(data, rows){
    const c=C(), l=rows.filter(isLaunch), ids=new Set(l.map(r=>r.install_id).filter(Boolean)), per=ids.size?l.length/ids.size:0, last=l[0]?.event_at;
    const kinds=[{key:'launch',label:c.launches,color:'#9c7cff',test:isLaunch}];
    return `<section class="iax-view iax-real-view" data-view="launch">${header(c.launch,c.launchSub)}<div class="iax-real-kpis">${kpi(c.launches,l.length)}${kpi(c.uniqueLaunch,ids.size)}${kpi(c.launchesPerInstall,per.toFixed(1))}${kpi(c.lastActivity,last?fmtDate(last):'—')}</div><div class="iax-real-grid">${card(c.timeline,c.timelineSub,lineChart(l,kinds))}${donut(c.byVersion,c.byVersionSub,group(l,r=>r.app_version))}</div>${card(c.recent,c.recentSub,table(l))}</section>`;
  }

  function versions(data, rows){
    const c=C(), stats=versionStats(rows), latest=rows.find(r=>r.app_version)?.app_version||'—';
    return `<section class="iax-view iax-real-view" data-view="versions">${header(c.versions,c.versionsSub)}<div class="iax-real-kpis">${kpi(c.versionsCount,stats.length)}${kpi(c.version,latest)}${kpi(c.installs,rows.filter(isStarted).length)}${kpi(c.successful,rows.filter(isSuccess).length)}${kpi(c.failed,rows.filter(isFailed).length)}${kpi(c.launches,rows.filter(isLaunch).length)}</div><div class="iax-real-grid">${card(c.byVersion,c.byVersionSub,versionComparison(rows))}${donut(c.byVersion,c.byVersionSub,group(rows,r=>r.app_version))}</div></section>`;
  }

  function ensureNav(){
    const c=C();
    document.querySelectorAll('.iax-sidebar nav button').forEach(btn=>{
      const key=btn.dataset.target||'';
      if(!SUPPORTED.has(key)){btn.style.display='none';return;}
      btn.style.display='';
      const label=btn.querySelector('span');
      if(key==='users' && label)label.textContent=c.installations;
    });
    const title=document.querySelector('.iax-side-status span');
    if(title){title.textContent=c.live;title.dataset.realStatus='1';}
    const small=document.querySelector('.iax-side-status small');if(small)small.textContent='MySQL';
    const preview=document.querySelector('.iax-app-title span');if(preview)preview.textContent=c.connected.toUpperCase();
    document.querySelector('.iax-app')?.classList.add('real-analytics');
  }

  function currentView(){
    const active=document.querySelector('.iax-sidebar nav button.active');
    const key=active?.dataset.target||'overview';
    return SUPPORTED.has(key)?key:'overview';
  }

  function render(view=currentView(), data=window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY){
    ensureNav();
    if(!SUPPORTED.has(view))view='overview';
    const host=document.getElementById('iax-view-host');if(!host)return;
    const rows=filteredEvents(data||{});
    const makers={overview,activity,users:installations,environment,errors,uninstall,launch,versions};
    host.innerHTML=(makers[view]||overview)(data||{},rows);
    document.querySelectorAll('.iax-sidebar nav button').forEach(b=>b.classList.toggle('active',b.dataset.target===view));
    try{sessionStorage.setItem('installerlab-analytics-view',view);}catch{}
  }

  function boot(){
    ensureNav();
    let saved='overview';try{saved=sessionStorage.getItem('installerlab-analytics-view')||'overview';}catch{}
    if(!SUPPORTED.has(saved))saved='overview';
    render(saved);
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest('.iax-sidebar nav button');
    if(btn)setTimeout(()=>render(btn.dataset.target),0);
  });
  document.addEventListener('change',e=>{
    if(e.target.closest('.iax-filterbar'))setTimeout(()=>render(currentView()),0);
  });
  window.addEventListener('installerlab:analytics-summary',e=>requestAnimationFrame(()=>render(currentView(),e.detail?.data)));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
