(() => {
  'use strict';
  const key = 'zhuji-aluminum-living-mirror-cabinet-option-two-v12';
  const previousKey = 'zhuji-aluminum-living-mirror-cabinet-option-two-v11';
  const modes = ['model', 'layout', 'bottom-plan', 'dimensions'];
  const requested = new URLSearchParams(location.search).get('view');
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(key) || localStorage.getItem(previousKey) || '{}') || {}; } catch {}
  const mode = modes.includes(requested) ? requested : 'model';
  window.openai = {
    widgetState: {
      privateContent: {
        ...saved.privateContent,
        modelId: 'tall-cabinet-option-two-v12',
        mode,
      },
    },
    setWidgetState(value) {
      this.widgetState = value;
      try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
      return Promise.resolve();
    },
  };
  document.addEventListener('DOMContentLoaded', () => {
    let height = 0;
    const reportSize = () => {
      const root = document.getElementById('tall-cabinet-frame');
      const next = Math.ceil(root.getBoundingClientRect().bottom + window.scrollY) + 8;
      if (next !== height && window.parent !== window) {
        height = next;
        window.parent.postMessage({ type: 'zhuji-cabinet-size', height }, location.origin);
      }
    };
    new ResizeObserver(reportSize).observe(document.getElementById('tall-cabinet-frame'));
    reportSize();
  });
})();
