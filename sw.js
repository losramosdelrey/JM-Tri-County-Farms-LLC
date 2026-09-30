/* JM Tri County Farms LLC - Service Worker
 * v7: rutas relativas (funciona en raíz o subcarpeta), HTML network-first,
 *     precache tolerante a fallos y fallback offline solo para páginas.
 */
const VERSION = 'v7';
const CACHE_NAME = 'jm-tricounty-' + VERSION;
const ASSETS = [
  './',
  './index.html',
  './servicios.html',
  './nosotros.html',
  './galeria.html',
  './cotizar.html',
  './offline.html',
  './css/main.css',
  './css/servicios.css',
  './css/nosotros.css',
  './css/galeria.css',
  './css/cotizar.css',
  './css/install.css',
  './js/main.js',
  './js/i18n.js',
  './js/install.js',
  './js/data.js',
  './js/servicios.js',
  './js/nosotros.js',
  './js/galeria.js',
  './js/cotizar.js',
  './images/flags/es.svg',
  './images/flags/us.svg',
  './images/backgrounds/hero.jpg',
  './images/backgrounds/hero-full.jpg',
  './images/backgrounds/garden-1.jpg',
  './images/backgrounds/garden-2.jpg',
  './images/backgrounds/garden-3.jpg',
  './images/galeria/g1.jpg',
  './images/galeria/g2.jpg',
  './images/galeria/g3.jpg',
  './images/galeria/g4.jpg',
  './images/galeria/g5.jpg',
  './images/galeria/g6.jpg',
  './images/servicios/about.jpg',
  './images/banners/testimonios/cuca.webp',
  './images/banners/testimonios/hombre.webp',
  './images/banners/testimonios/rubia.webp',
  './manifest.json',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(ASSETS.map((url) => cache.add(url).catch(() => {})))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('jm-tricounty-') && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Páginas: red primero (contenido fresco), caché si no hay conexión
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(async () =>
          (await caches.match(req, { ignoreSearch: true })) ||
          (await caches.match('./offline.html'))
        )
    );
    return;
  }

  // Recursos: caché primero, y se guardan al vuelo
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
