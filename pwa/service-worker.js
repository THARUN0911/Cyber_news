const CACHE_NAME = 'cyber-news-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/CSS/style.css',
  '/js/feeds.js',
  '/js/app.js',
  '/js/sw-register.js',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = req.url;

  // For navigation requests, try network first then fallback to cache/offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return res;
      }).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // If request is to rss2json, let it go to network (avoid caching API responses)
  if (url.includes('rss2json.com')) {
    event.respondWith(fetch(req));
    return;
  }

  // For other requests, respond from cache, else network
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).catch(() => cached))
  );
});
