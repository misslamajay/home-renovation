(() => {
  if (window.parent === window || new URLSearchParams(location.search).get('embed') !== '1') return;
  document.documentElement.dataset.embedded = 'true';
  const style = document.createElement('style');
  style.textContent = `
    html[data-embedded] body { min-height: 0; }
    html[data-embedded] .site-header,
    html[data-embedded] .page-intro,
    html[data-embedded] .site-footer,
    html[data-embedded] .skip-link { display: none; }
    html[data-embedded] .content-width { width: 100%; max-width: none; margin: 0; }
    html[data-embedded] main { padding-top: 0; }
    html[data-embedded] .review-notice { margin-top: 0; }
    html[data-embedded] .dialog-panel { max-height: 90vh; }
  `;
  document.head.append(style);
  let previousHeight = 0;
  const resize = () => {
    const height = Math.ceil(document.body.getBoundingClientRect().height);
    if (height === previousHeight) return;
    previousHeight = height;
    parent.postMessage({ type: 'zhuji-design-size', height }, location.origin);
  };
  new ResizeObserver(resize).observe(document.body);
  addEventListener('load', resize);
  const views = { 'index.html': 'model', 'dimensions.html': 'dimensions', 'materials.html': 'materials' };
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || link.target === '_blank' || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = new URL(link.href), current = new URL(location.href);
    if (target.origin !== current.origin || target.pathname.slice(0, target.pathname.lastIndexOf('/')) !== current.pathname.slice(0, current.pathname.lastIndexOf('/'))) return;
    const view = views[target.pathname.split('/').pop()];
    if (!view || target.pathname === current.pathname) return;
    event.preventDefault();
    parent.postMessage({ type: 'zhuji-design-view', project: 'mobile-tv-stand', view, anchor: target.hash.slice(1) }, location.origin);
  });
})();
