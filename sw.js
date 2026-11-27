// Deutsch · Expert Tongue: offline support.
// When you change any page, raise the version number so phones fetch the new files.
const VERSION = 'deutsch-bks-v32';
importScripts('languages.js');

// The shell every learner needs. Each language's own pages are added when that language is opened.
const CORE = [
  './', 'index.html', 'about.html', 'manifest.webmanifest', 'languages.js', 'a1/', 'a1/index.html', 'a2/', 'a2/index.html',
  'core/a1.js', 'core/a1.css', 'core/a2.js', 'core/a2.css', 'core/home.js',
  'spiele/', 'spiele/index.html', 'spiele/artikel.html', 'spiele/memory.html', 'spiele/satzbau.html',
  'spiele/spiele.css', 'spiele/spiele.js', 'spiele/words.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-64.png'
];
const CODES = self.LANGS.map(x => x.code);
// Extra pages that belong to one language only (BKS: Debs's class)
const EXTRA = { bks: ['bks/kurs/', 'bks/kurs/index.html', 'bks/kurs/kurs.css', 'bks/kurs/lektion-1-weil.html', 'bks/kurs/lektion-1-wo-wohin.html', 'bks/kurs/lektion-1-bildkarten.html'] };
const langFiles = l => [
  `${l}/`, `${l}/index.html`, `${l}/manifest.webmanifest`,
  `${l}/a1/`, `${l}/a1/index.html`, `${l}/a1/data.js`,
  `${l}/a2/`, `${l}/a2/index.html`, `${l}/a2/data.js`,
  `spiele/words-${l}.js`, ...(EXTRA[l] || [])
];
// Which language does this address belong to? ('bks/a1/' -> 'bks')
function langOf(url) {
  const path = new URL(url, self.registration.scope).href.slice(self.registration.scope.length);
  const seg = path.split('/')[0];
  return CODES.includes(seg) ? seg : null;
}
const cached = new Set();
function cacheLang(l) {
  if (!l || cached.has(l)) return Promise.resolve();
  cached.add(l);
  return caches.open(VERSION).then(c => Promise.all(langFiles(l).map(f => c.add(new Request(f, { cache: 'reload' })).catch(() => {}))));
}

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Keep every language this phone already had offline, and the ones open right now
    const langs = new Set();
    for (const k of await caches.keys()) {
      if (k === VERSION) continue;
      for (const r of await (await caches.open(k)).keys()) { const l = langOf(r.url); if (l) langs.add(l); }
    }
    for (const c of await self.clients.matchAll({ includeUncontrolled: true })) { const l = langOf(c.url); if (l) langs.add(l); }
    await Promise.all([...langs].map(cacheLang));
    await Promise.all((await caches.keys()).filter(k => k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
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
  // Opening a language saves all of its pages for offline use
  if (isOwn && req.mode === 'navigate') event.waitUntil(cacheLang(langOf(req.url)));

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
