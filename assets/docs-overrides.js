(() => {
  const themeNote = [...document.querySelectorAll('article p')].find((item) => item.textContent.includes('built-in catalog currently contains 20 themes'));
  if (themeNote) themeNote.textContent = themeNote.textContent.replace('built-in catalog currently contains 20 themes', 'The built-in catalog currently contains 26 themes: 11 free themes and 15 PRO themes');
})();
