/* ========================================
   JM TRI COUNTY FARMS LLC - PWA Install
   Botón flotante + modal con instrucciones manuales
   ======================================== */
(function () {
  'use strict';

  let deferredPrompt = null;
  const installBtn = document.querySelector('.float-install');
  const modal = document.getElementById('installModal');
  const promptBtn = document.getElementById('installPromptBtn');

  const KEY = 'jm-pwa-installed';
  const TTL = 30 * 24 * 60 * 60 * 1000; // 30 días

  function isStandalone() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );
  }

  function isMobileUA() {
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  }

  function markInstalled() {
    try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
  }

  function wasInstalled() {
    try {
      const ts = parseInt(localStorage.getItem(KEY), 10);
      if (!ts) return false;
      if (Date.now() - ts > TTL) { localStorage.removeItem(KEY); return false; }
      return true;
    } catch (e) { return false; }
  }

  async function alreadyInstalled() {
    if (isStandalone()) return true;
    if (navigator.getInstalledRelatedApps) {
      try {
        const apps = await navigator.getInstalledRelatedApps();
        if (apps && apps.length) return true;
      } catch (e) { /* usar marca local */ }
    }
    return wasInstalled();
  }

  function showInstallBtn() {
    if (installBtn) installBtn.classList.add('show');
  }

  function hideInstallBtn() {
    if (installBtn) installBtn.classList.remove('show');
  }

  function openModal() {
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (promptBtn) promptBtn.style.display = deferredPrompt ? 'inline-flex' : 'none';
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  async function runNativePrompt() {
    if (!deferredPrompt) return false;
    const evt = deferredPrompt;
    deferredPrompt = null; // el evento solo se puede usar una vez
    try {
      evt.prompt();
      const { outcome } = await evt.userChoice;
      if (outcome === 'accepted') {
        markInstalled();
        hideInstallBtn();
        closeModal();
        return true;
      }
    } catch (e) {
      console.warn('[PWA Install]', e);
    }
    return false;
  }

  async function init() {
    if (isStandalone()) { markInstalled(); hideInstallBtn(); return; }

    // Sin evento nativo (p. ej. iOS) se muestra el botón con instrucciones manuales,
    // salvo que ya sepamos que la app está instalada
    if (isMobileUA() && !(await alreadyInstalled())) showInstallBtn();

    window.addEventListener('beforeinstallprompt', async (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (await alreadyInstalled()) { hideInstallBtn(); return; }
      showInstallBtn();
    });

    window.addEventListener('appinstalled', () => {
      markInstalled();
      deferredPrompt = null;
      hideInstallBtn();
      closeModal();
    });

    const mq = window.matchMedia('(display-mode: standalone)');
    const onChange = (ev) => { if (ev.matches) { markInstalled(); hideInstallBtn(); } };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  installBtn?.addEventListener('click', async () => {
    if (deferredPrompt) {
      const ok = await runNativePrompt();
      if (ok) return;
    }
    openModal();
  });

  promptBtn?.addEventListener('click', async () => {
    await runNativePrompt();
    closeModal();
  });

  modal?.querySelectorAll('[data-close-install]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
  });

  init();
})();
