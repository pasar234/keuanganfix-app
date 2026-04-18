const CACHE_NAME = 'stok-v6-pwa';
const ASSETS = [
  '/StripPwa/',
  '/StripPwa/index.html',
  '/StripPwa/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Coba cache aset lokal saja, abaikan yang gagal (seperti CDN)
      for (const asset of ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.log('Gagal cache:', asset, err);
        }
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) return res;
      // Jangan ganggu request ke CDN atau eksternal
      return fetch(e.request);
    })
  );
});
