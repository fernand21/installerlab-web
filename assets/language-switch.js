(() => {
  const languages = [['en','English'],['es','Español'],['fr','Français'],['de','Deutsch'],['it','Italiano'],['pt','Português'],['pt-BR','Português (Brasil)'],['nl','Nederlands'],['pl','Polski'],['cs','Čeština'],['sk','Slovenčina'],['hu','Magyar'],['ro','Română'],['bg','Български'],['hr','Hrvatski'],['sr','Srpski'],['sl','Slovenščina'],['el','Ελληνικά'],['tr','Türkçe'],['ru','Русский'],['uk','Українська'],['ar','العربية'],['he','עברית'],['hi','हिन्दी'],['bn','বাংলা'],['zh-CN','简体中文'],['zh-TW','繁體中文'],['ja','日本語'],['ko','한국어'],['id','Bahasa Indonesia'],['vi','Tiếng Việt'],['th','ไทย'],['sv','Svenska'],['da','Dansk'],['no','Norsk'],['fi','Suomi']];
  const select = document.querySelector('.lang');
  if (!select) return;
  select.innerHTML = languages.map(([code, name]) => `<option value="${code}">${name}</option>`).join('');
  const saved = localStorage.getItem('il-lang') || 'es';
  select.value = languages.some(([code]) => code === saved) ? saved : 'es';
  select.addEventListener('change', event => {
    event.stopImmediatePropagation();
    localStorage.setItem('il-lang', event.target.value);
    location.reload();
  }, true);
})();
