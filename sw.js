/* Tailored Workout — offline support.
   Network first, so a new index.html is picked up as soon as you're online.
   If there's no signal (a gym basement), the last copy opens instead. */
const CACHE = 'tailored-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.add('./').catch(() => { }))); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./', copy)); }
      return res;
    }).catch(() => caches.match('./', { ignoreSearch: true }).then(r => r || caches.match(req, { ignoreSearch: true }))));
  }
});
