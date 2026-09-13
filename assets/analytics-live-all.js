(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const es = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const num = value => Number.isFinite(Number(value)) ? Number(value) : 0;
  const text = value => value === null || value === undefined || value === '' ? '—' : String(value);
  const array = value => Array.isArray(value) ? value : [];
  const firstArray = (d, ...keys) => { for (const key of keys) if (Array.isArray(d?.[key])) return d[key]; return []; };
  const obj = value => {
    if (value && typeof value === 'object' && !Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim().startsWith('{')) { try { return JSON.parse(value); } catch {} }
    return {};
  };
  const systemOf = row => obj(row?.system || row?.environment || row?.system_info);
  const metaOf = row => obj(row?.metadata || row?.properties || row?.custom_properties || row?.custom);
  const pick = (source, ...keys) => { for (const key of keys) if (source?.[key] !== undefined && source?.[key] !== null && source?.[key] !== '') return source[key]; return null; };
  const dateText = value => { if (!value) return '—'; const d = new Date(value); return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString(); };
  const eventType = row => String(row?.event_type || row?.type || row?.event || '').toLowerCase();
  const resultOf = row => String(row?.result || row?.status || '').toLowerCase();
  const isFailure = row => /fail|error|exception|blocked/.test(resultOf(row)) || /error|exception|failed/.test(eventType(row));
  const isUninstall = row => /uninstall|remove/.test(eventType(row));
  const isLaunch = row => /launch|run|start_app/.test(eventType(row));
  const isUpgrade = row => /upgrade|update/.test(eventType(row));
  const isRequirement = row => /requirement|prereq|prerequisite|blocked/.test(eventType(row));

  const copy = () => es() ? {
    noData:'Sin datos para este periodo.', enabled:'Activo', disabled:'Inactivo', unknown:'Desconocido',
    recent:'Reciente', never:'—', success:'Correctas', failed:'Fallidas', installs:'Instalaciones',
    surveys:'Encuestas', affected:'Afectados', last:'Último evento'
  } : {
    noData:'No data for this period.', enabled:'Enabled', disabled:'Disabled', unknown:'Unknown',
    recent:'Recent', never:'—', success:'Successful', failed:'Failed', installs:'Installs',
    surveys:'Surveys', affected:'Affected', last:'Last event'
  };

  function rowsOf(d){ return firstArray(d, 'recent_events', 'events', 'recent'); }

  function group(rows, getter){
    const map = new Map();
    for (const row of rows) {
      const raw = getter(row);
      const label = raw === null || raw === undefined || raw === '' ? '' : String(raw).trim();
      if (!label || label === '—') continue;
      map.set(label, (map.get(label) || 0) + 1);
    }
    return [...map].map(([label,value]) => ({label,value})).sort((a,b)=>b.value-a.value);
  }

  function normalizeDistribution(rows){
    return array(rows).map(row => ({
      label:text(row?.label ?? row?.name ?? row?.version ?? row?.key),
      value:num(row?.value ?? row?.count ?? row?.installs ?? row?.total),
      installs:num(row?.installs ?? row?.value ?? row?.count ?? row?.total),
      active:num(row?.active ?? row?.active_installs), upgrades:num(row?.upgrades), errors:num(row?.errors ?? row?.failed),
      last_event:row?.last_event || row?.last_activity || row?.event_at
    })).filter(row => row.label !== '—');
  }

  function currentFilters(){
    const selects = [...document.querySelectorAll('.iax-filterbar select')];
    return {
      version: selects[1]?.selectedIndex > 0 ? selects[1].value : '',
      package: selects[2]?.selectedIndex > 0 ? selects[2].value : '',
      platform: selects[3]?.selectedIndex > 0 ? selects[3].value : ''
    };
  }

  function filteredEvents(d){
    const f = currentFilters();
    return rowsOf(d).filter(row => {
      const s = systemOf(row);
      const version = text(row?.app_version || row?.version);
      const pkg = text(row?.package_type || row?.package);
      const platform = text(pick(s,'architecture','platform','arch') || row?.architecture || row?.platform);
      return (!f.version || version === f.version) && (!f.package || pkg === f.package) && (!f.platform || platform === f.platform);
    });
  }

  function fillSelect(select, values){
    if (!select || !values.length) return;
    const old = select.value;
    const first = select.options[0]?.textContent || 'All';
    const unique = [...new Set(values.map(String).map(v=>v.trim()).filter(v=>v && v !== '—'))];
    select.innerHTML = `<option>${esc(first)}</option>${unique.map(v=>`<option>${esc(v)}</option>`).join('')}`;
    if ([...select.options].some(o => o.value === old)) select.value = old;
  }

  function populateFilters(d){
    const events = rowsOf(d), selects = [...document.querySelectorAll('.iax-filterbar select')];
    const versions = normalizeDistribution(firstArray(d,'versions','version_distribution')).map(x=>x.label);
    const packages = normalizeDistribution(firstArray(d,'packages','package_distribution')).map(x=>x.label);
    const platforms = normalizeDistribution(firstArray(d,'platforms','architectures','architecture_distribution')).map(x=>x.label);
    fillSelect(selects[1], versions.length ? versions : events.map(r=>r?.app_version || r?.version).filter(Boolean));
    fillSelect(selects[2], packages.length ? packages : events.map(r=>r?.package_type || r?.package).filter(Boolean));
    fillSelect(selects[3], platforms.length ? platforms : events.map(r=>pick(systemOf(r),'architecture','platform','arch') || r?.architecture || r?.platform).filter(Boolean));
  }

  function setKpis(values){
    document.querySelectorAll('.iax-view .iax-kpi strong').forEach((node,index)=>{
      if (values[index] === undefined) return;
      const value = text(values[index]);
      if (node.textContent !== value) node.textContent = value;
      node.classList.add('iax-live-value');
    });
  }

  function setBars(container, rows){
    if (!container) return;
    const values = normalizeDistribution(rows).slice(0,4);
    const max = Math.max(1,...values.map(x=>x.value || x.installs));
    container.querySelectorAll('.iax-bar-row').forEach((row,index)=>{
      const item=values[index], label=row.querySelector('span'), value=row.querySelector('em'), fill=row.querySelector('b');
      if (!item) { if(label) label.textContent='—'; if(value) value.textContent='—'; if(fill) fill.style.width='0%'; return; }
      const n=item.value || item.installs;
      if(label) label.textContent=item.label; if(value) value.textContent=String(n); if(fill) fill.style.width=`${Math.max(3,Math.round(n/max*100))}%`;
    });
  }

  function renderTable(rows, colCount, mapper){
    const tbody=document.querySelector('.iax-view .iax-table tbody');
    if(!tbody) return;
    if(!rows.length){tbody.innerHTML=`<tr><td colspan="${colCount}"><div class="iax-table-empty">${esc(copy().noData)}</div></td></tr>`;return;}
    tbody.innerHTML=rows.slice(0,80).map(row=>`<tr>${mapper(row).slice(0,colCount).map(v=>`<td>${esc(text(v))}</td>`).join('')}</tr>`).join('');
  }

  function renderActivity(d){
    const events=filteredEvents(d), installs=num(d.installs), successful=num(d.successful), failed=num(d.failed), uninstalls=num(d.uninstalls);
    const cancelled=num(d.cancelled || d.canceled || events.filter(r=>/cancel/.test(resultOf(r)) || /cancel/.test(eventType(r))).length);
    setKpis([installs,successful,failed,cancelled,uninstalls]);
    renderTable(events,8,row=>{const s=systemOf(row), m=metaOf(row); return [dateText(row.event_at),row.app_version||row.version,row.package_type||row.package,row.result||row.status||row.event_type,pick(row,'duration','duration_ms')||pick(m,'duration','duration_ms'),pick(s,'architecture','platform','arch'),pick(s,'windows_version','os_version','windows'),pick(s,'language','system_language','locale')];});
  }

  function uniqueInstallations(events){
    const ids=new Set();
    for(const row of events){const id=pick(row,'installation_id','install_id','client_id','anonymous_id','device_id');if(id)ids.add(String(id));}
    return ids.size;
  }

  function renderUsers(d){
    const events=filteredEvents(d), active=num(d.active_installs), uninstalls=num(d.uninstalls);
    const upgrades=num(d.upgrades || events.filter(isUpgrade).length);
    const unique=num(d.unique_users || d.unique_installs || d.users || uniqueInstallations(events) || active);
    const retained=num(d.retained || d.retained_installs || Math.max(0,active-uninstalls));
    setKpis([active,upgrades,retained,uninstalls,unique]);
    const bars=document.querySelectorAll('.iax-view[data-view="users"] .iax-bars');
    setBars(bars[0],firstArray(d,'versions','version_distribution'));
  }

  function topSummary(rows, fallback='—'){
    const vals=normalizeDistribution(rows); if(!vals.length) return fallback;
    const total=vals.reduce((a,b)=>a+b.value,0) || 1, top=vals[0];
    return `${top.label} · ${Math.round(top.value/total*100)}%`;
  }

  function renderEnvironment(d){
    const events=filteredEvents(d);
    const windows=normalizeDistribution(firstArray(d,'windows','windows_distribution'));
    const platforms=normalizeDistribution(firstArray(d,'platforms','architectures','architecture_distribution'));
    const ram=group(events,r=>pick(systemOf(r),'memory_gb','ram_gb','physical_memory','ram'));
    const gpu=group(events,r=>pick(systemOf(r),'gpu','graphics_adapter','graphics','video_controller'));
    const resolution=group(events,r=>pick(systemOf(r),'screen_resolution','resolution'));
    const msi=group(events,r=>pick(systemOf(r),'windows_installer','msi_version','windows_installer_version'));
    const language=normalizeDistribution(firstArray(d,'languages','language_distribution')).length ? normalizeDistribution(firstArray(d,'languages','language_distribution')) : group(events,r=>pick(systemOf(r),'language','system_language','locale'));
    const dpi=group(events,r=>pick(systemOf(r),'dpi_scale','scale','dpi'));
    const values=[topSummary(windows),topSummary(platforms),topSummary(ram),topSummary(gpu),topSummary(resolution),topSummary(msi),topSummary(language),topSummary(dpi)];
    document.querySelectorAll('.iax-view[data-view="environment"] .iax-feature > span').forEach((node,i)=>{if(values[i]){node.textContent=values[i];node.classList.add('iax-live-value');}});
  }

  function requirementRows(d){
    const explicit=firstArray(d,'requirements','missing_requirements','prerequisites','blocked_requirements');
    if(explicit.length) return explicit.map(r=>({label:r.label||r.requirement||r.name||r.code||'—',version:r.version||r.required_version||'—',value:num(r.value||r.count||r.affected||r.systems),last:r.last_event||r.event_at}));
    const grouped=new Map();
    for(const row of filteredEvents(d).filter(isRequirement)){
      const m=metaOf(row), label=text(pick(row,'requirement','prerequisite','code')||pick(m,'requirement','prerequisite','condition'));
      const key=`${label}|${row.app_version||'—'}`, old=grouped.get(key)||{label,version:row.app_version||'—',value:0,last:row.event_at}; old.value++; if(row.event_at)old.last=row.event_at; grouped.set(key,old);
    }
    return [...grouped.values()];
  }

  function renderRequirements(d){
    const rows=requirementRows(d), missing=num(d.missing_prerequisites || d.prerequisite_failures || rows.reduce((a,b)=>a+b.value,0)), blocked=num(d.blocked || d.blocking_conditions || filteredEvents(d).filter(r=>/blocked/.test(resultOf(r))).length);
    setKpis([missing,blocked,missing+blocked]);
    const bars=document.querySelectorAll('.iax-view[data-view="requirements"] .iax-bars'); setBars(bars[0],rows); setBars(bars[1],rows);
    renderTable(rows,4,r=>[r.label,r.version,r.value,dateText(r.last)]);
  }

  function errorRows(d){
    const explicit=firstArray(d,'errors','error_codes','install_errors');
    if(explicit.length) return explicit.map(r=>({code:r.code||r.error_code||r.label||'—',stage:r.stage||r.install_stage||'—',version:r.version||r.app_version||'—',package:r.package||r.package_type||'—',value:num(r.value||r.count||r.occurrences||1),last:r.last_event||r.event_at}));
    const map=new Map();
    for(const row of filteredEvents(d).filter(isFailure)){
      const m=metaOf(row), code=text(pick(row,'error_code','code')||pick(m,'error_code','code','exception')||row.result), stage=text(pick(row,'stage','install_stage')||pick(m,'stage','install_stage'));
      const version=text(row.app_version||row.version), pkg=text(row.package_type||row.package), key=[code,stage,version,pkg].join('|'); const old=map.get(key)||{code,stage,version,package:pkg,value:0,last:row.event_at}; old.value++; if(row.event_at)old.last=row.event_at; map.set(key,old);
    }
    return [...map.values()].sort((a,b)=>b.value-a.value);
  }

  function renderErrors(d){
    const errors=errorRows(d), installs=num(d.installs), failed=num(d.failed || errors.reduce((a,b)=>a+b.value,0));
    const exceptions=num(d.exceptions || filteredEvents(d).filter(r=>/exception/.test(eventType(r)) || /exception/.test(resultOf(r))).length);
    setKpis([failed,installs?`${(failed/installs*100).toFixed(2)}%`:'0%',exceptions]);
    const bars=document.querySelectorAll('.iax-view[data-view="errors"] .iax-bars'); setBars(bars[0],errors.map(r=>({label:r.code,value:r.value})));
    renderTable(errors,6,r=>[r.code,r.stage,r.version,r.package,r.value,dateText(r.last)]);
  }

  function renderUninstall(d){
    const events=filteredEvents(d), uninstallEvents=events.filter(isUninstall), uninstalls=num(d.uninstalls || uninstallEvents.length);
    const surveys=firstArray(d,'uninstall_surveys','surveys','survey_responses');
    setKpis([uninstalls,num(d.survey_responses || surveys.length)]);
    let reasons=normalizeDistribution(firstArray(d,'uninstall_reasons','reasons'));
    if(!reasons.length) reasons=group(uninstallEvents,r=>pick(r,'reason','uninstall_reason')||pick(metaOf(r),'reason','uninstall_reason'));
    setBars(document.querySelector('.iax-view[data-view="uninstall"] .iax-bars'),reasons);
  }

  function renderLaunch(d){
    const events=filteredEvents(d), launches=num(d.launches || events.filter(isLaunch).length), active=num(d.active_installs), users=num(d.unique_users || d.unique_installs || uniqueInstallations(events) || active);
    const last=events.filter(isLaunch).map(r=>r.event_at).filter(Boolean).sort().pop();
    setKpis([users,launches,users?(launches/users).toFixed(1):'0',last?dateText(last):'—']);
  }

  function renderProperties(d){
    const events=filteredEvents(d), explicit=obj(d.properties || d.custom_properties || d.property_summary);
    const metas=events.map(metaOf).filter(m=>Object.keys(m).length);
    const countKeys=(regex)=>{const s=new Set(); for(const m of metas) for(const [k,v] of Object.entries(m)) if(regex.test(k) && v!==null && v!==undefined && v!=='') s.add(`${k}:${typeof v==='object'?JSON.stringify(v):v}`); return s.size;};
    const values=[
      num(explicit.build_edition || explicit.build || explicit.edition || countKeys(/build|edition|channel/i)),
      num(explicit.checkboxes || countKeys(/check|option|selected/i)),
      num(explicit.fields || explicit.field_values || countKeys(/field|value/i)),
      num(explicit.detected_software || explicit.software || countKeys(/software|detected|product/i)),
      num(explicit.features || explicit.installed_features || countKeys(/feature|component/i)),
      num(explicit.project_type || explicit.project_types || countKeys(/project.?type|type/i))
    ];
    document.querySelectorAll('.iax-view[data-view="properties"] .iax-feature > span').forEach((node,i)=>{node.textContent=values[i]?String(values[i]):'—'; if(values[i])node.classList.add('iax-live-value');});
  }

  function renderVersions(d){
    const versions=normalizeDistribution(firstArray(d,'versions','version_distribution'));
    setBars(document.querySelector('.iax-view[data-view="versions"] .iax-bars'),versions);
    renderTable(versions,6,r=>[r.label,r.installs||r.value,r.active||'—',r.upgrades||'—',r.errors||'—',dateText(r.last_event)]);
  }

  function renderSettings(d,trackId){
    const ro=document.querySelectorAll('.iax-view[data-view="settings"] .iax-readonly');
    if(ro[0])ro[0].textContent=d.app_name||d.application_name||copy().recent;
    if(ro[1])ro[1].textContent=trackId||window.INSTALLERLAB_ANALYTICS_TRACK_ID||'—';
    if(ro[2])ro[2].textContent=d.tracking_enabled===false?copy().disabled:copy().enabled;
    const cfg=obj(d.tracking || d.analytics_config || d.data_collection);
    const rows=document.querySelectorAll('.iax-view[data-view="settings"] .iax-setting-row b');
    const flags=[pick(cfg,'install','track_install','TrackInstall'),pick(cfg,'uninstall','track_uninstall','TrackUninstall'),pick(cfg,'errors','track_errors','TrackErrors'),pick(cfg,'environment','track_environment','TrackEnvironment')];
    rows.forEach((node,i)=>{if(flags[i]!==null)node.textContent=flags[i]===false?copy().disabled:copy().enabled;});
  }

  function apply(detail){
    const d=detail?.data || window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY; if(!d) return;
    populateFilters(d);
    const view=document.querySelector('.iax-view')?.dataset?.view || 'overview';
    if(view==='activity')renderActivity(d);
    else if(view==='users')renderUsers(d);
    else if(view==='environment')renderEnvironment(d);
    else if(view==='requirements')renderRequirements(d);
    else if(view==='errors')renderErrors(d);
    else if(view==='uninstall')renderUninstall(d);
    else if(view==='launch')renderLaunch(d);
    else if(view==='properties')renderProperties(d);
    else if(view==='versions')renderVersions(d);
    else if(view==='settings')renderSettings(d,detail?.trackId);
    document.querySelectorAll('.iax-live-pill').forEach(node=>node.textContent='LIVE');
  }

  window.addEventListener('installerlab:analytics-summary',event=>requestAnimationFrame(()=>apply(event.detail)));
  document.addEventListener('click',event=>{if(event.target.closest('.iax-sidebar nav button'))setTimeout(()=>apply({data:window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY,trackId:window.INSTALLERLAB_ANALYTICS_TRACK_ID}),0);});
  document.addEventListener('change',event=>{if(event.target.closest('.iax-filterbar'))setTimeout(()=>apply({data:window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY,trackId:window.INSTALLERLAB_ANALYTICS_TRACK_ID}),0);});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>apply({data:window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY,trackId:window.INSTALLERLAB_ANALYTICS_TRACK_ID}),{once:true});
  else apply({data:window.INSTALLERLAB_ANALYTICS_LIVE_SUMMARY,trackId:window.INSTALLERLAB_ANALYTICS_TRACK_ID});
})();