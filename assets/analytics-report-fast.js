(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'analytics') return;

  const isES = () => (localStorage.getItem('il-lang') || 'en').toLowerCase() === 'es';
  const demoOn = () => { try { return sessionStorage.getItem('installerlab-analytics-demo') === '1'; } catch { return false; } };
  const h = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  const text = () => isES() ? {
    button:'Informe PDF', popup:'El navegador bloqueó la vista previa del informe. Permite ventanas emergentes para este sitio.',
    title:'Informe de Analítica de Despliegue', subtitle:'InstallerLab Analytics', save:'Guardar como PDF', close:'Cerrar',
    generated:'Generado', source:'Fuente', live:'Datos en vivo', demo:'Datos demo', disconnected:'Sin conexión',
    app:'Aplicación', track:'TrackID', view:'Vista', filters:'Filtros aplicados', summary:'Resumen ejecutivo', distributions:'Distribuciones', detail:'Actividad reciente', privacy:'Privacidad',
    privacyText:'InstallerLab Analytics utiliza datos técnicos de despliegue. TrackID identifica el flujo de analítica del proyecto y no una licencia, usuario o equipo.',
    hint:'Para crear el PDF, pulsa “Guardar como PDF” y selecciona “Guardar como PDF” en el diálogo de impresión.'
  } : {
    button:'PDF Report', popup:'The browser blocked the report preview. Allow pop-ups for this site.',
    title:'Deployment Analytics Report', subtitle:'InstallerLab Analytics', save:'Save as PDF', close:'Close',
    generated:'Generated', source:'Source', live:'Live data', demo:'Demo data', disconnected:'Not connected',
    app:'Application', track:'TrackID', view:'View', filters:'Applied filters', summary:'Executive summary', distributions:'Distributions', detail:'Recent activity', privacy:'Privacy',
    privacyText:'InstallerLab Analytics uses technical deployment data. TrackID identifies the project analytics stream, not a license, user or device.',
    hint:'To create the PDF, click “Save as PDF” and choose “Save as PDF” in the browser print dialog.'
  };

  function snapshot() {
    const q = new URLSearchParams(location.search);
    const t = text();
    const track = q.get('trackId') || q.get('track') || '';
    const appName = document.querySelector('.iax-picker span')?.textContent?.trim() || '-';
    const viewTitle = document.querySelector('.iax-view-head h1')?.textContent?.trim() || '-';
    const source = demoOn() ? t.demo : document.querySelector('.iax-app')?.classList.contains('live-connected') ? t.live : t.disconnected;
    const filterLabels = [...document.querySelectorAll('.iax-filterbar label')].map(x => x.textContent.trim());
    const filters = [...document.querySelectorAll('.iax-filterbar select')].map((s,i) => ({
      label: filterLabels[i] || `Filter ${i+1}`,
      value: s.selectedOptions?.[0]?.textContent?.trim() || '-'
    }));
    const metrics = [...document.querySelectorAll('.iax-view .iax-kpi')].map(card => ({
      label: card.querySelector('span')?.textContent?.trim() || '',
      value: card.querySelector('strong')?.textContent?.trim() || '-'
    })).filter(x => x.label);
    const distributions = [...document.querySelectorAll('.iax-view .iax-bars')].map(bars => ({
      title: bars.closest('.iax-widget')?.querySelector('.iax-widget-head h3')?.textContent?.trim() || '',
      rows: [...bars.querySelectorAll('.iax-bar-row')].map(row => ({
        label: row.querySelector('span')?.textContent?.trim() || '-',
        value: row.querySelector('em')?.textContent?.trim() || '-'
      })).filter(x => x.label !== '-' || x.value !== '-')
    })).filter(x => x.rows.length);
    const table = document.querySelector('.iax-view .iax-table');
    const headers = table ? [...table.querySelectorAll('thead th')].map(x => x.textContent.trim()) : [];
    const rows = table ? [...table.querySelectorAll('tbody tr')].map(tr => [...tr.querySelectorAll('td')].map(td => td.textContent.trim())).filter(r => r.length > 1).slice(0,30) : [];
    return {track, appName, viewTitle, source, filters, metrics, distributions, headers, rows};
  }

  function buildHtml(data) {
    const t = text();
    const metrics = data.metrics.map(m => `<div class="metric"><span>${h(m.label)}</span><strong>${h(m.value)}</strong></div>`).join('');
    const filters = data.filters.map(f => `<div><b>${h(f.label)}</b><span>${h(f.value)}</span></div>`).join('');
    const distributions = data.distributions.map(d => `<section class="dist"><h3>${h(d.title || t.distributions)}</h3>${d.rows.map(r => `<div class="row"><span>${h(r.label)}</span><strong>${h(r.value)}</strong></div>`).join('')}</section>`).join('');
    const head = data.headers.length ? `<thead><tr>${data.headers.slice(0,6).map(x => `<th>${h(x)}</th>`).join('')}</tr></thead>` : '';
    const body = data.rows.length ? `<tbody>${data.rows.map(r => `<tr>${r.slice(0,6).map(x => `<td>${h(x)}</td>`).join('')}</tr>`).join('')}</tbody>` : '';
    const table = data.rows.length ? `<section class="block"><h2>${t.detail}</h2><table>${head}${body}</table></section>` : '';

    return `<!doctype html><html><head><meta charset="utf-8"><title>${h(t.title)}</title><style>
      *{box-sizing:border-box}body{margin:0;background:#eef3f8;color:#1f3042;font-family:Arial,Helvetica,sans-serif}.toolbar{position:sticky;top:0;z-index:3;display:flex;gap:10px;justify-content:flex-end;padding:12px 20px;background:#0a1f37}.toolbar button{border:0;border-radius:8px;padding:10px 14px;font-weight:700;cursor:pointer}.toolbar .primary{background:#2f83dc;color:#fff}.toolbar .secondary{background:#e7edf4;color:#18304a}.report{width:210mm;min-height:297mm;margin:22px auto;background:#fff;box-shadow:0 10px 35px rgba(0,0,0,.12)}.hero{padding:34px 42px;background:#0a1f37;color:#fff;border-bottom:4px solid #2f83dc}.hero small{display:block;color:#85c2ff;font-weight:700;letter-spacing:.12em}.hero h1{margin:9px 0 3px;font-size:28px}.hero p{margin:0;color:#c6d8e9}.meta{display:grid;grid-template-columns:1fr 1fr;gap:8px 32px;padding:24px 42px;border-bottom:1px solid #dde6ef;font-size:13px}.meta b{display:inline-block;min-width:90px;color:#65788b}.content{padding:26px 42px 42px}.hint{margin:0 0 20px;padding:12px 14px;border-radius:8px;background:#eef7ff;border:1px solid #cfe5fa;color:#47627d;font-size:12px}.block{margin-top:25px;break-inside:avoid}.block h2,.dist h3{margin:0 0 12px;color:#0a1f37}.filters{display:grid;grid-template-columns:1fr 1fr;gap:10px}.filters div{padding:10px 12px;border:1px solid #e0e7ee;border-radius:8px}.filters b,.filters span{display:block}.filters b{font-size:11px;color:#71849a}.filters span{margin-top:4px;font-size:13px}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.metric{padding:14px;border:1px solid #dce6ef;border-left:4px solid #2f83dc;border-radius:8px}.metric span{display:block;font-size:11px;color:#72859a;text-transform:uppercase}.metric strong{display:block;margin-top:6px;font-size:24px;color:#1e6db9}.dists{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.dist{padding:14px;border:1px solid #e0e7ee;border-radius:8px}.dist h3{font-size:14px}.row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eef2f6;font-size:12px}.row:last-child{border-bottom:0}table{width:100%;border-collapse:collapse;font-size:10px}th,td{padding:8px 6px;border-bottom:1px solid #e5ebf0;text-align:left;vertical-align:top}th{color:#65798f;background:#f5f8fb}.privacy{margin-top:28px;padding:15px;border-radius:8px;background:#f7f9fb;color:#5d7287;font-size:12px}.footer{padding:14px 42px;border-top:1px solid #e3e9ef;color:#8090a0;font-size:10px}
      @page{size:A4;margin:10mm}@media print{body{background:#fff}.toolbar{display:none}.report{width:auto;min-height:auto;margin:0;box-shadow:none}.hint{display:none}.hero{-webkit-print-color-adjust:exact;print-color-adjust:exact}.metric,.dist,.filters div{break-inside:avoid}}
      @media(max-width:850px){.report{width:100%;margin:0}.meta,.filters,.metrics,.dists{grid-template-columns:1fr}.hero,.meta,.content,.footer{padding-left:20px;padding-right:20px}}
    </style></head><body><div class="toolbar"><button class="secondary" onclick="window.close()">${h(t.close)}</button><button class="primary" onclick="window.print()">${h(t.save)}</button></div><main class="report"><header class="hero"><small>INSTALLERLAB ANALYTICS</small><h1>${h(t.title)}</h1><p>${h(t.subtitle)}</p></header><section class="meta"><div><b>${h(t.app)}</b>${h(data.appName)}</div><div><b>${h(t.generated)}</b>${h(new Date().toLocaleString(isES()?'es-EC':'en-US'))}</div><div><b>${h(t.track)}</b>${h(data.track || '-')}</div><div><b>${h(t.source)}</b>${h(data.source)}</div><div><b>${h(t.view)}</b>${h(data.viewTitle)}</div></section><div class="content"><p class="hint">${h(t.hint)}</p><section class="block"><h2>${h(t.filters)}</h2><div class="filters">${filters}</div></section><section class="block"><h2>${h(t.summary)}</h2><div class="metrics">${metrics || '<div class="metric"><span>—</span><strong>—</strong></div>'}</div></section>${distributions ? `<section class="block"><h2>${h(t.distributions)}</h2><div class="dists">${distributions}</div></section>` : ''}${table}<section class="privacy"><b>${h(t.privacy)}</b><br>${h(t.privacyText)}</section></div><footer class="footer">InstallerLab Analytics · installerlab.website</footer></main></body></html>`;
  }

  function openReport() {
    const popup = window.open('', 'InstallerLabAnalyticsReport', 'width=1050,height=850,scrollbars=yes,resizable=yes');
    if (!popup) { alert(text().popup); return; }
    const data = snapshot();
    popup.document.open();
    popup.document.write(buildHtml(data));
    popup.document.close();
    popup.focus();
  }

  function ensureButton() {
    const bar = document.querySelector('.iax-appbar');
    if (!bar) return false;
    let button = bar.querySelector('.iax-report-pdf');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'iax-report-pdf';
      const demo = bar.querySelector('.iax-demo-toggle');
      if (demo) demo.insertAdjacentElement('afterend', button); else bar.appendChild(button);
      button.addEventListener('click', openReport);
    }
    const label = text().button;
    if (button.textContent !== label) button.textContent = label;
    return true;
  }

  let attempts = 0;
  const timer = setInterval(() => { attempts++; if (ensureButton() || attempts > 30) clearInterval(timer); }, 100);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureButton, {once:true}); else ensureButton();
})();
