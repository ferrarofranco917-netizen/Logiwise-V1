window.KedrixOneAppFeedback = (() => {
  'use strict';

  let toastRegion = null;
  let dialogRoot = null;
  let lastFocus = null;

  function init(options = {}) {
    toastRegion = options.toastRegion || document.getElementById('toastRegion') || null;
    ensureDialogRoot();
  }

  function ensureDialogRoot() {
    if (dialogRoot) return dialogRoot;
    dialogRoot = document.createElement('section');
    dialogRoot.id = 'appFeedbackDialogRoot';
    dialogRoot.className = 'app-dialog-root';
    dialogRoot.setAttribute('hidden', 'hidden');
    document.body.appendChild(dialogRoot);
    return dialogRoot;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('\"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function showToast(message, options = {}) {
    if (!message) return null;
    const tone = String(options.tone || 'info');
    const duration = Number(options.duration || 2600);
    const region = toastRegion || document.getElementById('toastRegion');
    if (!region) return null;

    const el = document.createElement('div');
    el.className = `toast toast-${tone}`;
    el.textContent = String(message);
    region.appendChild(el);
    window.setTimeout(() => el.remove(), duration);
    return el;
  }

  function closeDialog() {
    if (!dialogRoot) return;
    dialogRoot.innerHTML = '';
    dialogRoot.setAttribute('hidden', 'hidden');
    document.body.classList.remove('dialog-open');
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus({ preventScroll: true });
    }
    lastFocus = null;
  }

  function confirm(options = {}) {
    ensureDialogRoot();

    const title = String(options.title || 'Conferma operazione');
    const message = String(options.message || 'Confermare l’operazione?');
    const confirmLabel = String(options.confirmLabel || 'Conferma');
    const cancelLabel = String(options.cancelLabel || 'Annulla');
    const tone = String(options.tone || 'warning');

    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRoot.removeAttribute('hidden');
    document.body.classList.add('dialog-open');
    dialogRoot.innerHTML = `
      <div class="app-dialog-backdrop" data-app-dialog-close="backdrop"></div>
      <div class="app-dialog app-dialog-${tone}" role="dialog" aria-modal="true" aria-labelledby="appDialogTitle" aria-describedby="appDialogMessage">
        <div class="app-dialog-kicker">Kedrix One</div>
        <h3 class="app-dialog-title" id="appDialogTitle">${escapeHtml(title)}</h3>
        <p class="app-dialog-message" id="appDialogMessage">${escapeHtml(message)}</p>
        <div class="app-dialog-actions">
          <button type="button" class="btn secondary" data-app-dialog-cancel="1">${escapeHtml(cancelLabel)}</button>
          <button type="button" class="btn" data-app-dialog-confirm="1">${escapeHtml(confirmLabel)}</button>
        </div>
      </div>`;

    return new Promise((resolve) => {
      const cleanup = (value) => {
        closeDialog();
        resolve(Boolean(value));
      };

      const onKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          cleanup(false);
        }
      };

      dialogRoot.querySelector('[data-app-dialog-cancel]')?.addEventListener('click', () => cleanup(false), { once: true });
      dialogRoot.querySelector('[data-app-dialog-confirm]')?.addEventListener('click', () => cleanup(true), { once: true });
      dialogRoot.querySelector('[data-app-dialog-close="backdrop"]')?.addEventListener('click', () => cleanup(false), { once: true });
      window.addEventListener('keydown', onKeyDown, { once: true });

      const confirmButton = dialogRoot.querySelector('[data-app-dialog-confirm]');
      if (confirmButton && typeof confirmButton.focus === 'function') {
        confirmButton.focus({ preventScroll: true });
      }
    });
  }

  return {
    init,
    showToast,
    confirm,
    closeDialog
  };
})();
