/* ========================================
   JM TRI COUNTY FARMS LLC - PWA Install Prompt
   ======================================== */

let deferredPrompt = null;
const installBtn = document.querySelector('.float-install');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) {
    installBtn.classList.add('show');
  }
});

installBtn?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    installBtn.classList.remove('show');
  }
  deferredPrompt = null;
});

window.addEventListener('appinstalled', () => {
  if (installBtn) installBtn.classList.remove('show');
  deferredPrompt = null;
});
