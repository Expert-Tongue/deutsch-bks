// Deutsch für BKS: offline support.
// When you change any page, raise the version number so phones fetch the new files.
const VERSION = 'deutsch-bks-v3';
const CORE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'a1/',
  'a1/index.html',
  'a2/',
  'a2/index.html',
  'spiele/',
  'spiele/index.html',
  'spiele/artikel.html',
  'spiele/memory.html',
  'spiele/satzbau.html',
  'spiele/spiele.css',
  'spiele/spiele.js',
  'spiele/words.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-64.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Show the saved copy straight away, and refresh it in the background,
// so the app opens instantly (also offline) and picks up updates on the next visit.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isOwn = url.origin === self.location.origin;
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!isOwn && !isFont) return;

  event.respondWith(
    caches.open(VERSION).then(cache =>
      cache.match(req, { ignoreSearch: isOwn }).then(cached => {
        const network = fetch(req).then(res => {
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    )
  );
});
