/* Cotizar form enhancements */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cotizar-form');
  if (!form) return;

  const emailInput = form.email;
  const phoneInput = form.telefono;

  // Al menos uno de los dos medios de contacto es obligatorio
  function checkContact() {
    const has = emailInput.value.trim() || phoneInput.value.trim();
    phoneInput.setCustomValidity(has ? '' : t('form.needcontact'));
  }
  emailInput.addEventListener('input', checkContact);
  phoneInput.addEventListener('input', checkContact);
  checkContact();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const email = emailInput.value.trim();
    const telefono = phoneInput.value.trim();
    if (!nombre || (!email && !telefono)) return;

    let key = 'form.thanks';               // email y móvil
    if (email && !telefono) key = 'form.thanks.nophone';
    if (!email && telefono) key = 'form.thanks.noemail';

    // Could integrate with Formspree / EmailJS here
    alert(t(key, { name: nombre, email: email, phone: telefono }));
    form.reset();
    checkContact();
  });
});
