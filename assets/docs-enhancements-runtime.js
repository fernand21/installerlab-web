(() => {
  const app = document.getElementById('app');
  if (!app || !('MutationObserver' in window)) return;
  let reloading = false;
  const observer = new MutationObserver(() => {
    if (reloading) return;
    if (app.dataset.docEnhancements === '1' && !document.getElementById('developer-priorities')) {
      reloading = true;
      location.reload();
    }
  });
  observer.observe(app, {childList:true, subtree:false});
})();
