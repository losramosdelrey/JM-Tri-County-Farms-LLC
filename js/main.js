/* ========================================
   JM TRI COUNTY FARMS LLC - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Header scroll effect
  const header = document.querySelector('header');
  const scrollTopBtn = document.querySelector('.float-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header?.classList.add('scrolled');
      scrollTopBtn?.classList.add('visible');
    } else {
      header?.classList.remove('scrolled');
      scrollTopBtn?.classList.remove('visible');
    }
  });

  // Mobile menu
  const menuToggle = document.querySelector('.menu-toggle');
  const navMobile = document.querySelector('.nav-mobile');
  const overlay = document.querySelector('.overlay');

  function closeMenu() {
    menuToggle?.classList.remove('active');
    navMobile?.classList.remove('open');
    overlay?.classList.remove('show');
    document.body.style.overflow = '';
  }

  menuToggle?.addEventListener('click', () => {
    const isOpen = navMobile?.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      menuToggle.classList.add('active');
      navMobile?.classList.add('open');
      overlay?.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  });

  overlay?.addEventListener('click', closeMenu);
  navMobile?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Scroll to top
  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('visible');
        observer.unobserve(el);
        // Terminada la animación se libera .reveal: así el hover y sus transiciones funcionan normal
        setTimeout(() => {
          el.classList.remove('reveal', 'visible', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4');
          el.style.transitionDelay = '';
        }, 2000);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));

  // Contact form
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = form.querySelector('[name="nombre"]')?.value || t('form.defname');
      alert(t('form.thanks', { name: nombre, phone: '+1 (561) 667-0705' }));
      form.reset();
    });
  }

  // Page enter animation
  document.body.classList.add('page-enter');
});


/* ========================================
   Transiciones entre páginas (telón verde)
   ======================================== */
(function () {
  var file = location.pathname.split('/').pop().replace('.html', '');
  document.documentElement.setAttribute('data-page', file || 'index');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var curtain = document.createElement('div');
  curtain.className = 'page-curtain cover';
  curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = '<span class="curtain-logo">JM <span>Tri County Farms LLC</span></span>';
  document.body.appendChild(curtain);

  function reveal() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { curtain.classList.remove('cover'); });
    });
  }
  if (document.readyState === 'complete') reveal();
  else window.addEventListener('load', reveal);
  setTimeout(reveal, 1500); // seguridad: nunca dejar la pantalla tapada

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) curtain.classList.remove('cover'); // volver atrás (bfcache)
  });

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    if (/^(tel:|mailto:|javascript:|#)/.test(a.getAttribute('href'))) return;
    var u = new URL(a.href, location.href);
    if (u.origin !== location.origin) return;
    if (u.pathname === location.pathname && u.search === location.search) return;
    e.preventDefault();
    curtain.classList.add('cover');
    setTimeout(function () { location.href = u.href; }, reduce ? 0 : 560);
  });
})();
