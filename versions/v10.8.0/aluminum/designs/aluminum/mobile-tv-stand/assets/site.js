(() => {
  'use strict';

  // These are page links: browser history, deep links and modifier-click all work.
  document.querySelectorAll('.page-tab').forEach((link, index, links) => {
    link.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % links.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + links.length) % links.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = links.length - 1;
      if (next !== undefined) { event.preventDefault(); links[next].focus(); }
    });
  });

  const search = document.getElementById('material-search');
  const category = document.getElementById('material-category');
  if (search && category) {
    const rows = [...document.querySelectorAll('.materials-table tbody tr')];
    const filter = () => {
      const query = search.value.trim().toLocaleLowerCase();
      let count = 0;
      rows.forEach(row => {
        const visible = (!category.value || row.dataset.category === category.value) && row.dataset.search.toLocaleLowerCase().includes(query);
        row.hidden = !visible;
        if (visible) count += 1;
      });
      document.getElementById('filter-count').textContent = `${count} / ${rows.length} 项材料`;
      document.getElementById('no-results').hidden = count !== 0;
    };
    search.addEventListener('input', filter);
    category.addEventListener('change', filter);
  }

  function openHashTarget() {
    if (!location.hash) return;
    let target;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (_) { return; }
    if (!target) return;
    const chapter = target.closest('details');
    if (chapter) chapter.open = true;
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
  window.addEventListener('hashchange', openHashTarget);
  openHashTarget();
  document.querySelectorAll('.chapter-nav a').forEach(link => {
    link.addEventListener('click', () => {
      const target = document.getElementById(link.hash.slice(1));
      if (target?.tagName === 'DETAILS') target.open = true;
    });
  });
  if ('IntersectionObserver' in window) {
    const observed = new Map();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => observed.set(entry.target.id, entry.isIntersecting));
      const first = [...document.querySelectorAll('.material-section')].find(section => observed.get(section.id));
      if (!first) return;
      document.querySelectorAll('.chapter-nav a').forEach(link => link.classList.toggle('active', link.hash === '#' + first.id));
    }, { rootMargin: '-100px 0px -45% 0px' });
    document.querySelectorAll('.material-section').forEach(section => observer.observe(section));
  }

  const dialog = document.getElementById('drawing-dialog');
  let activeDrawing = null;
  document.querySelectorAll('[data-drawing]').forEach(button => {
    button.addEventListener('click', () => {
      const svg = document.querySelector('#tv-' + button.dataset.drawing + '-svg svg');
      if (!svg) return;
      activeDrawing = svg;
      document.getElementById('drawing-dialog-title').textContent = svg.querySelector('title')?.textContent || button.getAttribute('aria-label').replace(/^放大/, '');
      const clone = svg.cloneNode(true);
      const viewport = document.getElementById('drawing-dialog-content');
      viewport.replaceChildren(clone);
      dialog.showModal();
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { activeDrawing = null; });
  document.getElementById('download-drawing').addEventListener('click', () => {
    if (!activeDrawing) return;
    const svg = activeDrawing.cloneNode(true);
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    // Resolve colors so the standalone drawing does not depend on website CSS.
    const properties = ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'fill-opacity', 'opacity', 'font-family', 'font-size', 'font-weight'];
    const originals = [activeDrawing, ...activeDrawing.querySelectorAll('*')];
    [svg, ...svg.querySelectorAll('*')].forEach((element, index) => {
      const computed = getComputedStyle(originals[index]);
      element.setAttribute('style', properties.map(name => `${name}:${computed.getPropertyValue(name)}`).join(';'));
    });
    style.textContent = 'svg{background:#fff}';
    svg.prepend(style);
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '电视架-V9-' + document.getElementById('drawing-dialog-title').textContent + '.svg';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
