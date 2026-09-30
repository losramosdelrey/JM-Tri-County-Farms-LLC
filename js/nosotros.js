/* Nosotros page */
document.addEventListener('DOMContentLoaded', () => {
  // Counter animation for stats
  const stats = document.querySelectorAll('.stat strong');
  const animateValue = (el, end, suffix = '') => {
    let start = 0;
    const duration = 1500;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const value = Math.floor(progress * parseInt(end));
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const text = e.target.textContent;
        const num = parseInt(text);
        const suffix = text.replace(/[0-9]/g, '');
        animateValue(e.target, num, suffix);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => obs.observe(s));
});
