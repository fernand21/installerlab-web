(() => {
  let queued = false;
  const isES = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';

  const copy = es => es ? {
    product:'InstallerLab Analytics', preview:'INTERFAZ PREPARADA · BACKEND PENDIENTE',
    app:'Aplicación', noApp:'Sin aplicación conectada', connect:'Conectar aplicación', backend:'Backend no conectado',
    period:'Periodo', version:'Versión', package:'Paquete', platform:'Plataforma', reset:'Restablecer',
    periods:['Últimos 7 días','Últimos 30 días','Últimos 90 días','Todo el historial'], allVersions:'Todas', allPackages:'Todos', allPlatforms:'Todas',
    nav:[['overview','Resumen'],['activity','Actividad de instalación'],['users','Base de usuarios'],['environment','Entorno'],['requirements','Requisitos'],['errors','Errores de instalación'],['uninstall','Desinstalaciones'],['launch','Uso y ejecuciones'],['properties','Propiedades personalizadas'],['versions','Versiones'],['reports','Informes'],['settings','Configuración']],
    statusTitle:'Analytics listo para conectarse', statusText:'La interfaz ya está organizada como un panel de analítica real. Los valores permanecerán vacíos hasta conectar el backend de InstallerLab Analytics y recibir eventos de un TrackID.',
    noData:'Esperando datos reales', noDataText:'No se muestran números simulados. Cuando lleguen eventos, este bloque se actualizará automáticamente.',
    overview:'Resumen', overviewSub:'Estado general de instalación, adopción, errores y uso de la aplicación.',
    installs:'Instalaciones', successful:'Correctas', failed:'Fallidas', cancelled:'Canceladas', uninstalls:'Desinstalaciones', active:'Instalaciones activas', launches:'Ejecuciones', users:'Usuarios únicos',
    trend:'Tendencia de instalaciones', trendSub:'Instalaciones iniciadas, correctas, fallidas y desinstalaciones por periodo.',
    health:'Salud de la versión', healthSub:'Una vista rápida para detectar regresiones después de publicar una nueva versión.',
    adoption:'Adopción por versión', os:'Distribución de Windows', arch:'Arquitectura', language:'Idioma', recent:'Eventos recientes',
    recentCols:['Fecha','Versión','Paquete','Evento','Resultado','Sistema'],
    activity:'Actividad de instalación', activitySub:'Analiza el ciclo completo del instalador y compara resultados entre versiones y paquetes.',
    activityCols:['Fecha','Versión','Paquete','Estado','Duración','Arquitectura','Windows','Idioma'],
    funnel:'Embudo de instalación', started:'Iniciadas', completed:'Completadas', blocked:'Bloqueadas',
    userBase:'Base de usuarios', userBaseSub:'Mide instalaciones activas, upgrades y retención del producto sin confundir equipos con personas.',
    upgrades:'Actualizaciones', retained:'Retenidas', removed:'Retiradas',
    environment:'Entorno del sistema', environmentSub:'Conoce dónde se instala tu software para tomar mejores decisiones de compatibilidad.',
    envCards:[['Windows','Distribución por Windows 10/11 y versiones.'],['Tipo de plataforma','x86, x64 y ARM64.'],['Memoria física','Distribución de RAM disponible.'],['Adaptador gráfico','Familias de GPU detectadas.'],['Resolución','Resoluciones de pantalla más frecuentes.'],['Windows Installer','Versiones de MSI presentes.'],['Idioma del sistema','Idiomas configurados en Windows.'],['Escala DPI','100%, 125%, 150% y otras escalas.']],
    requirements:'Requisitos no cumplidos', requirementsSub:'Descubre por qué una instalación no pudo continuar antes de que se convierta en un ticket de soporte.',
    prereq:'Prerrequisitos ausentes', launchCond:'Condiciones bloqueantes', reqCols:['Requisito','Versión','Equipos afectados','Último evento'],
    errors:'Errores de instalación', errorsSub:'Agrupa fallos por versión, etapa y código para detectar regresiones rápidamente.',
    errorRate:'Tasa de error', exceptions:'Excepciones', errorCols:['Código','Etapa','Versión','Paquete','Ocurrencias','Último evento'],
    uninstallTitle:'Desinstalaciones y encuestas', uninstallSub:'Mide cuándo se elimina el producto y, cuando habilitemos encuestas, cuáles son los motivos principales.',
    surveyResponses:'Respuestas de encuesta', topReasons:'Motivos principales', surveySetup:'Configurar encuesta',
    launchTitle:'Uso y ejecuciones', launchSub:'Mide si el producto realmente se utiliza después de instalarse. Esta vista requerirá telemetría de ejecución opcional.',
    uniqueUsers:'Usuarios únicos', avgLaunches:'Ejecuciones por instalación', lastSeen:'Actividad reciente',
    properties:'Propiedades personalizadas', propertiesSub:'Analiza decisiones del instalador y datos técnicos que decidas registrar de forma explícita.',
    propertyCards:[['Build / edición','Compara Community, PRO, canal o edición.'],['Checkboxes','Estado de opciones elegidas durante la instalación.'],['Valores de campos','Agrupa valores permitidos de campos configurados.'],['Software detectado','Mide software o componentes relevantes.'],['Features instaladas','Analiza componentes opcionales seleccionados.'],['Tipo de proyecto','Application, Office Add-in o QGIS Plugin.']],
    versionsTitle:'Versiones y upgrades', versionsSub:'Sigue la adopción de releases y comprueba la eficiencia de tus rutas de actualización.',
    versionCols:['Versión','Instalaciones','Activas','Upgrades','Errores','Última actividad'],
    reports:'Informes y exportación', reportsSub:'Prepara vistas filtradas para soporte, QA, producto y publicación de releases.',
    reportCards:[['Informe de instalaciones','Actividad, resultado, versión y paquete.'],['Informe de errores','Códigos, etapas, versiones y tendencia.'],['Informe de entorno','Windows, arquitectura, idioma y hardware.'],['Informe de upgrades','Adopción y transición entre versiones.'],['Informe de desinstalación','Bajas y respuestas de encuesta.'],['Exportación','CSV/JSON cuando el backend esté conectado.']],
    settings:'Configuración de Analytics', settingsSub:'La identidad de Analytics permanece separada de AppId, ProductCode, UpgradeCode y licencias.',
    general:'General', trackId:'TrackID', trackHelp:'El TrackID agrupa eventos del proyecto. No identifica una licencia, usuario ni equipo.', tracking:'Tracking', trackingState:'Se controla desde el proyecto FSS / InstallerLab.',
    dataCollection:'Datos habilitados', dcItems:['Instalación','Desinstalación','Errores','Entorno'], ipFilter:'Filtro de pruebas', ipText:'Permitirá excluir tráfico de equipos o redes de QA para no contaminar informes.',
    team:'Acceso al dashboard', teamText:'La autenticación y equipos se habilitarán cuando el backend esté conectado.', unavailable:'Disponible al conectar backend',
    privacy:'Privacidad', privacyText:'Por diseño no necesitamos nombre, correo, HWID, Machine Code ni clave de licencia para las estadísticas de instalación.',
    emptyRows:'Todavía no hay eventos para mostrar.',
    view:'Ver detalles', coming:'Pendiente de backend',
    chartLegend:['Correctas','Fallidas','Desinstalaciones']
  } : {
    product:'InstallerLab Analytics', preview:'INTERFACE READY · BACKEND PENDING',
    app:'Application', noApp:'No application connected', connect:'Connect application', backend:'Backend not connected',
    period:'Period', version:'Version', package:'Package', platform:'Platform', reset:'Reset',
    periods:['Last 7 days','Last 30 days','Last 90 days','All time'], allVersions:'All', allPackages:'All', allPlatforms:'All',
    nav:[['overview','Overview'],['activity','Install activity'],['users','User base'],['environment','Environment'],['requirements','Requirements'],['errors','Install errors'],['uninstall','Uninstalls'],['launch','Launch & usage'],['properties','Custom properties'],['versions','Versions'],['reports','Reports'],['settings','Settings']],
    statusTitle:'Analytics ready to connect', statusText:'The interface is now organized as a real analytics dashboard. Values remain empty until the InstallerLab Analytics backend is connected and events arrive for a TrackID.',
    noData:'Waiting for real data', noDataText:'No simulated numbers are shown. When events arrive, this block will update automatically.',
    overview:'Overview', overviewSub:'A high-level view of installation health, adoption, errors and product usage.',
    installs:'Installs', successful:'Successful', failed:'Failed', cancelled:'Cancelled', uninstalls:'Uninstalls', active:'Active installs', launches:'Launches', users:'Unique users',
    trend:'Install trend', trendSub:'Started, successful, failed and uninstalled packages over the selected period.',
    health:'Release health', healthSub:'A quick view for spotting regressions after publishing a new version.',
    adoption:'Version adoption', os:'Windows distribution', arch:'Architecture', language:'Language', recent:'Recent events',
    recentCols:['Date','Version','Package','Event','Result','System'],
    activity:'Install activity', activitySub:'Analyze the full installer lifecycle and compare results across versions and packages.',
    activityCols:['Date','Version','Package','Status','Duration','Architecture','Windows','Language'],
    funnel:'Install funnel', started:'Started', completed:'Completed', blocked:'Blocked',
    userBase:'User base', userBaseSub:'Measure active installations, upgrades and retention without treating devices as people.',
    upgrades:'Upgrades', retained:'Retained', removed:'Removed',
    environment:'System environment', environmentSub:'Understand where your software is installed so compatibility decisions are based on evidence.',
    envCards:[['Windows','Distribution across Windows 10/11 and releases.'],['Platform type','x86, x64 and ARM64.'],['Physical memory','Distribution of available RAM.'],['Graphics adapter','Detected GPU families.'],['Screen resolution','Most common display resolutions.'],['Windows Installer','MSI versions found on systems.'],['System language','Windows language configuration.'],['DPI scale','100%, 125%, 150% and other scales.']],
    requirements:'Unfulfilled requirements', requirementsSub:'Find out why setup could not continue before it becomes a support ticket.',
    prereq:'Missing prerequisites', launchCond:'Blocking conditions', reqCols:['Requirement','Version','Affected systems','Last event'],
    errors:'Install errors', errorsSub:'Group failures by version, stage and code to identify regressions quickly.',
    errorRate:'Error rate', exceptions:'Exceptions', errorCols:['Code','Stage','Version','Package','Occurrences','Last event'],
    uninstallTitle:'Uninstalls & surveys', uninstallSub:'Measure when users remove the product and, once surveys are enabled, the most common reasons.',
    surveyResponses:'Survey responses', topReasons:'Top reasons', surveySetup:'Configure survey',
    launchTitle:'Launch & usage', launchSub:'Measure whether the product is actually used after installation. This view will require optional runtime telemetry.',
    uniqueUsers:'Unique users', avgLaunches:'Launches per install', lastSeen:'Recent activity',
    properties:'Custom properties', propertiesSub:'Analyze installer choices and technical data you explicitly decide to record.',
    propertyCards:[['Build / edition','Compare Community, PRO, channel or edition.'],['Checkboxes','State of installer options selected by users.'],['Field values','Group allowed values from configured fields.'],['Detected software','Measure relevant software or components.'],['Installed features','Analyze optional components selected.'],['Project type','Application, Office Add-in or QGIS Plugin.']],
    versionsTitle:'Versions & upgrades', versionsSub:'Track release adoption and validate how effectively users move between versions.',
    versionCols:['Version','Installs','Active','Upgrades','Errors','Last activity'],
    reports:'Reports & export', reportsSub:'Prepare filtered views for support, QA, product work and release decisions.',
    reportCards:[['Install report','Activity, result, version and package.'],['Error report','Codes, stages, versions and trend.'],['Environment report','Windows, architecture, language and hardware.'],['Upgrade report','Adoption and version transitions.'],['Uninstall report','Removals and survey responses.'],['Export','CSV/JSON once the backend is connected.']],
    settings:'Analytics settings', settingsSub:'Analytics identity remains separate from AppId, ProductCode, UpgradeCode and licensing.',
    general:'General', trackId:'TrackID', trackHelp:'TrackID groups project events. It does not identify a license, user or machine.', tracking:'Tracking', trackingState:'Controlled from the FSS project / InstallerLab.',
    dataCollection:'Enabled data', dcItems:['Install','Uninstall','Errors','Environment'], ipFilter:'Test traffic filter', ipText:'Will allow QA machines or networks to be excluded so reports are not polluted.',
    team:'Dashboard access', teamText:'Authentication and team access will be enabled when the backend is connected.', unavailable:'Available after backend connection',
    privacy:'Privacy', privacyText:'By design, installation statistics do not require a name, email, HWID, Machine Code or license key.',
    emptyRows:'No events to display yet.',
    view:'View details', coming:'Backend pending',
    chartLegend:['Successful','Failed','Uninstalls']
  };

  const metric = (label, hint='') => `<article class="iax-kpi"><span>${label}</span><strong>—</strong>${hint ? `<small>${hint}</small>` : '<small>&nbsp;</small>'}</article>`;
  const empty = t => `<div class="iax-empty"><div class="iax-empty-icon">⌁</div><strong>${t.noData}</strong><p>${t.noDataText}</p></div>`;
  const table = (cols, t) => `<div class="iax-tablewrap"><table class="iax-table"><thead><tr>${cols.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody><tr><td colspan="${cols.length}"><div class="iax-table-empty">${t.emptyRows}</div></td></tr></tbody></table></div>`;
  const placeholderChart = (t, title, subtitle='') => `<article class="iax-widget iax-chart-widget"><div class="iax-widget-head"><div><h3>${title}</h3>${subtitle?`<p>${subtitle}</p>`:''}</div><span class="iax-live-pill">${t.coming}</span></div><div class="iax-chart-stage"><svg viewBox="0 0 800 250" preserveAspectRatio="none" aria-hidden="true"><g class="grid"><line x1="0" y1="50" x2="800" y2="50"/><line x1="0" y1="100" x2="800" y2="100"/><line x1="0" y1="150" x2="800" y2="150"/><line x1="0" y1="200" x2="800" y2="200"/></g><path class="ghost-line one" d="M0 190 C120 165 170 180 260 140 S440 120 520 150 S680 95 800 105"/><path class="ghost-line two" d="M0 215 C130 205 190 190 270 198 S420 178 520 185 S690 160 800 170"/></svg><div class="iax-chart-empty">${t.noData}</div></div></article>`;
  const distribution = (title, t) => `<article class="iax-widget"><div class="iax-widget-head"><h3>${title}</h3><span class="iax-live-pill">${t.coming}</span></div><div class="iax-bars">${[72,55,38,24].map((w,i)=>`<div class="iax-bar-row"><span>—</span><i><b style="width:${w}%"></b></i><em>—</em></div>`).join('')}</div></article>`;

  function overview(t){
    return `<section class="iax-view" data-view="overview"><div class="iax-view-head"><div><h1>${t.overview}</h1><p>${t.overviewSub}</p></div></div>
      <div class="iax-kpi-grid">${metric(t.installs)}${metric(t.successful)}${metric(t.failed)}${metric(t.uninstalls)}${metric(t.active)}${metric(t.launches)}</div>
      <div class="iax-two-col">${placeholderChart(t,t.trend,t.trendSub)}<article class="iax-widget iax-health"><div class="iax-widget-head"><div><h3>${t.health}</h3><p>${t.healthSub}</p></div></div>${empty(t)}</article></div>
      <div class="iax-three-col">${distribution(t.adoption,t)}${distribution(t.os,t)}${distribution(t.arch,t)}</div>
      <article class="iax-widget"><div class="iax-widget-head"><h3>${t.recent}</h3><span class="iax-live-pill">${t.coming}</span></div>${table(t.recentCols,t)}</article>
    </section>`;
  }

  function activity(t){return `<section class="iax-view" data-view="activity"><div class="iax-view-head"><div><h1>${t.activity}</h1><p>${t.activitySub}</p></div></div><div class="iax-kpi-grid compact">${metric(t.started)}${metric(t.completed)}${metric(t.failed)}${metric(t.cancelled)}${metric(t.uninstalls)}</div><div class="iax-two-col">${placeholderChart(t,t.trend,t.activitySub)}<article class="iax-widget"><div class="iax-widget-head"><h3>${t.funnel}</h3></div>${empty(t)}</article></div><article class="iax-widget"><div class="iax-widget-head"><h3>${t.activity}</h3></div>${table(t.activityCols,t)}</article></section>`;}

  function users(t){return `<section class="iax-view" data-view="users"><div class="iax-view-head"><div><h1>${t.userBase}</h1><p>${t.userBaseSub}</p></div></div><div class="iax-kpi-grid compact">${metric(t.active)}${metric(t.upgrades)}${metric(t.retained)}${metric(t.removed)}${metric(t.users)}</div><div class="iax-two-col">${placeholderChart(t,t.userBase,t.userBaseSub)}${distribution(t.adoption,t)}</div></section>`;}

  function environment(t){return `<section class="iax-view" data-view="environment"><div class="iax-view-head"><div><h1>${t.environment}</h1><p>${t.environmentSub}</p></div></div><div class="iax-feature-grid">${t.envCards.map(c=>`<article class="iax-widget iax-feature"><div class="iax-feature-icon">◫</div><div><h3>${c[0]}</h3><p>${c[1]}</p></div><span>—</span></article>`).join('')}</div></section>`;}

  function requirements(t){return `<section class="iax-view" data-view="requirements"><div class="iax-view-head"><div><h1>${t.requirements}</h1><p>${t.requirementsSub}</p></div></div><div class="iax-kpi-grid compact">${metric(t.prereq)}${metric(t.launchCond)}${metric(t.blocked)}</div><div class="iax-two-col">${distribution(t.prereq,t)}${distribution(t.launchCond,t)}</div><article class="iax-widget">${table(t.reqCols,t)}</article></section>`;}

  function errors(t){return `<section class="iax-view" data-view="errors"><div class="iax-view-head"><div><h1>${t.errors}</h1><p>${t.errorsSub}</p></div></div><div class="iax-kpi-grid compact">${metric(t.failed)}${metric(t.errorRate)}${metric(t.exceptions)}</div><div class="iax-two-col">${placeholderChart(t,t.errors,t.errorsSub)}${distribution(t.errorRate,t)}</div><article class="iax-widget">${table(t.errorCols,t)}</article></section>`;}

  function uninstall(t){return `<section class="iax-view" data-view="uninstall"><div class="iax-view-head"><div><h1>${t.uninstallTitle}</h1><p>${t.uninstallSub}</p></div><button class="button iax-disabled-action" type="button" disabled>${t.surveySetup}</button></div><div class="iax-kpi-grid compact">${metric(t.uninstalls)}${metric(t.surveyResponses)}</div><div class="iax-two-col">${placeholderChart(t,t.uninstalls,t.uninstallSub)}${distribution(t.topReasons,t)}</div></section>`;}

  function launch(t){return `<section class="iax-view" data-view="launch"><div class="iax-view-head"><div><h1>${t.launchTitle}</h1><p>${t.launchSub}</p></div></div><div class="iax-kpi-grid compact">${metric(t.uniqueUsers)}${metric(t.launches)}${metric(t.avgLaunches)}${metric(t.lastSeen)}</div>${placeholderChart(t,t.launchTitle,t.launchSub)}</section>`;}

  function properties(t){return `<section class="iax-view" data-view="properties"><div class="iax-view-head"><div><h1>${t.properties}</h1><p>${t.propertiesSub}</p></div></div><div class="iax-feature-grid">${t.propertyCards.map(c=>`<article class="iax-widget iax-feature"><div class="iax-feature-icon">◇</div><div><h3>${c[0]}</h3><p>${c[1]}</p></div><span>—</span></article>`).join('')}</div></section>`;}

  function versions(t){return `<section class="iax-view" data-view="versions"><div class="iax-view-head"><div><h1>${t.versionsTitle}</h1><p>${t.versionsSub}</p></div></div><div class="iax-two-col">${placeholderChart(t,t.adoption,t.versionsSub)}${distribution(t.adoption,t)}</div><article class="iax-widget">${table(t.versionCols,t)}</article></section>`;}

  function reports(t){return `<section class="iax-view" data-view="reports"><div class="iax-view-head"><div><h1>${t.reports}</h1><p>${t.reportsSub}</p></div></div><div class="iax-report-grid">${t.reportCards.map(c=>`<article class="iax-widget iax-report"><div class="iax-report-icon">⇩</div><h3>${c[0]}</h3><p>${c[1]}</p><button type="button" disabled>${t.unavailable}</button></article>`).join('')}</div></section>`;}

  function settings(t){return `<section class="iax-view" data-view="settings"><div class="iax-view-head"><div><h1>${t.settings}</h1><p>${t.settingsSub}</p></div></div><div class="iax-settings-grid">
      <article class="iax-widget iax-setting-card"><h3>${t.general}</h3><label>${t.app}</label><div class="iax-readonly">${t.noApp}</div><label>${t.trackId}</label><div class="iax-readonly iax-mono">—</div><p>${t.trackHelp}</p><label>${t.tracking}</label><div class="iax-readonly">${t.trackingState}</div></article>
      <article class="iax-widget iax-setting-card"><h3>${t.dataCollection}</h3>${t.dcItems.map(x=>`<div class="iax-setting-row"><span>${x}</span><b>—</b></div>`).join('')}<p>${t.unavailable}</p></article>
      <article class="iax-widget iax-setting-card"><h3>${t.ipFilter}</h3><p>${t.ipText}</p><button class="button" type="button" disabled>${t.unavailable}</button></article>
      <article class="iax-widget iax-setting-card"><h3>${t.team}</h3><p>${t.teamText}</p><button class="button" type="button" disabled>${t.unavailable}</button></article>
      <article class="iax-widget iax-setting-card iax-setting-wide"><h3>${t.privacy}</h3><p>${t.privacyText}</p></article>
    </div></section>`;}

  function shell(t){
    return `<main class="iax-app" data-iax-lang="${isES()?'es':'en'}">
      <header class="iax-appbar"><div class="iax-app-title"><img src="../assets/icon.png" alt=""><div><strong>${t.product}</strong><span>${t.preview}</span></div></div><div class="iax-app-picker"><label>${t.app}</label><button type="button" class="iax-picker" disabled><span>${t.noApp}</span><b>⌄</b></button></div><div class="iax-backend"><i></i>${t.backend}</div></header>
      <div class="iax-shell">
        <aside class="iax-sidebar"><div class="iax-side-status"><span>${t.statusTitle}</span><small>${t.backend}</small></div><nav>${t.nav.map((n,i)=>`<button type="button" data-target="${n[0]}" class="${i===0?'active':''}"><i>${['⌂','↕','◎','▦','⚑','!','↩','▶','◇','⇧','⇩','⚙'][i]}</i><span>${n[1]}</span></button>`).join('')}</nav><div class="iax-side-foot"><button type="button" disabled>＋ ${t.connect}</button></div></aside>
        <div class="iax-workspace">
          <section class="iax-filterbar"><div><label>${t.period}</label><select><option>${t.periods[0]}</option>${t.periods.slice(1).map(x=>`<option>${x}</option>`).join('')}</select></div><div><label>${t.version}</label><select><option>${t.allVersions}</option></select></div><div><label>${t.package}</label><select><option>${t.allPackages}</option><option>Setup EXE</option><option>MSI</option><option>Bundle</option><option>Portable</option></select></div><div><label>${t.platform}</label><select><option>${t.allPlatforms}</option><option>x64</option><option>x86</option><option>ARM64</option></select></div><button type="button" class="iax-reset">↺ ${t.reset}</button></section>
          <div class="iax-connect-banner"><div><strong>${t.statusTitle}</strong><p>${t.statusText}</p></div><button class="button primary" type="button" disabled>${t.connect}</button></div>
          <div id="iax-view-host">${overview(t)}</div>
        </div>
      </div>
    </main>`;
  }

  function renderView(name,t){
    const host=document.getElementById('iax-view-host'); if(!host)return;
    const views={overview,activity,users,environment,requirements,errors,uninstall,launch,properties,versions,reports,settings};
    host.innerHTML=(views[name]||overview)(t);
    document.querySelectorAll('.iax-sidebar nav button').forEach(b=>b.classList.toggle('active',b.dataset.target===name));
    try{sessionStorage.setItem('installerlab-analytics-view',name);}catch{}
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function wire(t){
    document.querySelectorAll('.iax-sidebar nav button').forEach(btn=>btn.addEventListener('click',()=>renderView(btn.dataset.target,t)));
    document.querySelector('.iax-reset')?.addEventListener('click',()=>document.querySelectorAll('.iax-filterbar select').forEach(s=>s.selectedIndex=0));
    let saved='overview'; try{saved=sessionStorage.getItem('installerlab-analytics-view')||'overview';}catch{}
    if(saved!=='overview')renderView(saved,t);
  }

  function render(){
    if(document.body?.dataset?.page!=='analytics')return;
    const app=document.getElementById('app'); if(!app)return;
    const lang=isES()?'es':'en';
    if(app.querySelector('.iax-app')?.dataset?.iaxLang===lang)return;
    const t=copy(isES()); app.innerHTML=shell(t); wire(t);
  }

  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render();});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('storage',schedule);
})();
