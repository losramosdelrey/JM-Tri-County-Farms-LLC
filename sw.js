/* JM Tri County Farms LLC Service Worker - Basic PWA offline support */
const CACHE_NAME = 'jm-tricounty-v6';
const ASSETS = [
  '/',
  '/index.html',
  '/servicios.html',
  '/nosotros.html',
  '/galeria.html',
  '/cotizar.html',
  '/offline.html',
  '/css/main.css',
  '/css/servicios.css',
  '/css/nosotros.css',
  '/css/galeria.css',
  '/css/cotizar.css',
  '/css/install.css',
  '/js/main.js',
  '/js/i18n.js',
  '/js/install.js',
  '/js/data.js',
  '/js/servicios.js',
  '/js/nosotros.js',
  '/js/galeria.js',
  '/js/cotizar.js',
  '/images/flags/es.svg',
  '/images/flags/us.svg',
  '/images/backgrounds/hero.jpg',
  '/images/backgrounds/hero-full.jpg',
  '/images/backgrounds/garden-1.jpg',
  '/images/backgrounds/garden-2.jpg',
  '/images/backgrounds/garden-3.jpg',
  '/images/galeria/g1.jpg',
  '/images/galeria/g2.jpg',
  '/images/galeria/g3.jpg',
  '/images/galeria/g4.jpg',
  '/images/galeria/g5.jpg',
  '/images/galeria/g6.jpg',
  '/images/servicios/about.jpg',
  '/images/banners/testimonios/cuca.webp',
  '/images/banners/testimonios/hombre.webp',
  '/images/banners/testimonios/rubia.webp',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => caches.match('/offline.html'));
    })
  );
});
