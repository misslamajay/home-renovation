/* Preserve model view preferences on this device. No external service is used. */
(() => {
  const key = 'tv-stand-v9-view';
  let widgetState = null;
  try { widgetState = JSON.parse(localStorage.getItem(key)); } catch (_) { /* Storage may be unavailable. */ }
  window.openai = {
    widgetState,
    setWidgetState(value) {
      this.widgetState = value;
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* View remains usable without storage. */ }
      return Promise.resolve();
    }
  };
})();
