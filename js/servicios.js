/* Servicios page enhancements */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.servicio-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });
});
