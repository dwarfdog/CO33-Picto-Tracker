// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  SERVICE WORKER — Offline-first caching strategy
//  Cache statique versionné + fallback réseau
// ══════════════════════════════════════════════════════

var CACHE_NAME = 'co33-picto-v9';

var ASSETS_TO_CACHE = [
  './',
  './CO33-Pictos.html',
  './style.css',
  './manifest.json',
  // JS — core
  './js/app.js',
  './js/utils.js',
  './js/state.js',
  './js/cards.js',
  './js/filters.js',
  './js/events.js',
  './js/boot.js',
  './js/i18n.js',
  './js/tooltip.js',
  './js/progress.js',
  './js/export-import.js',
  './js/ui-translate.js',
  './js/lumina-planner.js',
  './js/gameplay-expert.js',
  './js/dataset-changes.js',
  './js/character-builds.js',
  // JS — data
  './js/datas/skills-data.js',
  // Langues
  './lang/fr.js',
  './lang/en.js',
  // Fonts
  './assets/fonts/CormorantGaramond-300.ttf',
  './assets/fonts/CormorantGaramond-400.ttf',
  './assets/fonts/CormorantGaramond-600.ttf',
  './assets/fonts/CormorantGaramond-700.ttf',
  './assets/fonts/CormorantGaramond-Italic-300.ttf',
  './assets/fonts/CormorantGaramond-Italic-400.ttf',
  './assets/fonts/CormorantGaramond-Italic-600.ttf',
  './assets/fonts/Cinzel-400.ttf',
  './assets/fonts/Cinzel-600.ttf',
  './assets/fonts/Cinzel-700.ttf',
  './assets/fonts/IMFellEnglish-400.ttf',
  './assets/fonts/IMFellEnglish-Italic-400.ttf',
  // Images
  './docs/images/fluidicon.png'
];

// ── Installation : pré-cache des assets statiques ──
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

// ── Activation : nettoyage des anciens caches ──
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (name) {
            return name.startsWith('co33-picto-') && name !== CACHE_NAME;
          })
          .map(function (name) {
            return caches.delete(name);
          })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// ── Fetch : cache-first, fallback réseau ──
self.addEventListener('fetch', function (event) {
  // Ignorer les requêtes non-GET (POST, etc.)
  if (event.request.method !== 'GET') return;

  // Ignorer les requêtes cross-origin (analytics, CDN tiers, etc.)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(function (networkResponse) {
        // Ne pas cacher les réponses d'erreur
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Cacher la réponse réseau pour les prochaines fois
        var responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    }).catch(function () {
      // Si offline et pas en cache, retourner la page principale
      if (event.request.mode === 'navigate') {
        return caches.match('./CO33-Pictos.html');
      }
    })
  );
});
