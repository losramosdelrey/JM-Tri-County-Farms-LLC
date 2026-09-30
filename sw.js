/* JM Tri County Farms LLC Service Worker - Basic PWA offline support */
const CACHE_NAME = 'jm-tricounty-v5';
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
