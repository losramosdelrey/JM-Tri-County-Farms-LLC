/* ========================================
   JM TRI COUNTY FARMS LLC - PWA Install
   Premium install flow with modal fallback
   ======================================== */

let deferredPrompt = null;
const installBtn = document.querySelector('.float-install');
const modal = document.getElementById('installModal');
const promptBtn = document.getElementById('installPromptBtn');

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function isMobileUA() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function showInstallBtn() {
  if (installBtn && !isStandalone()) installBtn.classList.add('show');
}

function hideInstallBtn() {
  if (installBtn) installBtn.classList.remove('show');
}

function openModal() {
  if (!modal) return;
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (promptBtn) {
    promptBtn.style.display = deferredPrompt ? 'inline-flex' : 'none';
  }
}

function closeModal() {
  if (!modal) return;
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (!isStandalone() && isMobileUA()) {
  showInstallBtn();
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallBtn();
});

async function runNativePrompt() {
  if (!deferredPrompt) return false;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  if (outcome === 'accepted') {
    hideInstallBtn();
    closeModal();
    return true;
  }
  return false;
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
});

modal?.querySelectorAll('[data-close-install]').forEach((el) => {
  el.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
});

window.addEventListener('appinstalled', () => {
  hideInstallBtn();
  deferredPrompt = null;
  closeModal();
});
