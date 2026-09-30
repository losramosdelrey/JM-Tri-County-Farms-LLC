/* Cotizar form enhancements */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cotizar-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    if (!nombre || !telefono) return;
    // Could integrate with Formspree / EmailJS here
    alert(t('form.thanks', { name: nombre, phone: telefono }));
    form.reset();
  });
});
