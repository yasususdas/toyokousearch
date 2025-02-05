const CACHE_NAME = "toyoko-search-cache-v3"; // キャッシュバージョンを更新
const urlsToCache = [
  "/",
  "/index.html",   // ログイン画面
  "/main.html",    // 地図画面
  "/css/style.css",
  "/css/loginpagestyle.css",
  "/js/main.js",
  "/js/loginpagescript.js",
  "/img/map.jpg",
  "/img/icon-192x192.png",
  "/img/icon-512x512.png"
];

// インストール時にキャッシュを作成
self.addEventListener("install", (event) => {
  console.log("Service Worker Installed");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 古いキャッシュを削除
self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("古いキャッシュを削除:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// オフライン時にキャッシュを返す
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});