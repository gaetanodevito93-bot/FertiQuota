/* FertiQuota — Service Worker
 *
 * Rende l'app installabile e utilizzabile offline quando è servita via HTTP(S).
 * Non ha effetto se la pagina è aperta da file:// (i service worker richiedono
 * un contesto sicuro): in quel caso l'app funziona come sempre, senza cache.
 *
 * ⚠️ Ad ogni modifica del file dell'app, incrementa CACHE_VERSION: forza
 *    l'aggiornamento della cache e il ricaricamento della nuova versione.
 */
const CACHE_VERSION = 'v1.0.2';
const CACHE_NAME = 'fertiquota-' + CACHE_VERSION;

// Risorse dell'app shell (percorsi relativi allo scope del SW).
const APP_SHELL = [
  'index.html',
  'manifest.webmanifest',
  'fonts/inter-latin.woff2',
  'fonts/inter-latin-ext.woff2',
  'fonts/jetbrains-mono-latin.woff2',
  'fonts/jetbrains-mono-latin-ext.woff2',
  'icons/apple-touch-icon.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('fertiquota-') && k !== CACHE_NAME)
            .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Solo GET same-origin: le risorse dell'app shell e i font locali sono serviti dalla cache.
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  const isHTML = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    // Network-first con timeout 3.5 s: prende sempre l'ultima versione se online, altrimenti cache.
    const ac = typeof AbortController === 'function' ? new AbortController() : null;
    const tid = ac ? setTimeout(() => ac.abort(), 3500) : null;
    event.respondWith(
      fetch(req, ac ? { signal: ac.signal } : undefined)
        .then((res) => {
          if (tid) clearTimeout(tid);
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          if (tid) clearTimeout(tid);
          return caches.match(req).then((m) => m || caches.match('index.html'));
        })
    );
  } else {
    // Cache-first per asset statici (icone, manifest).
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached))
    );
  }
});
