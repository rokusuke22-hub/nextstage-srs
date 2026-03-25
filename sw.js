// ========================================
// ネクステSRS - Service Worker v1.0
// 作成日時: 2026-03-25T23:00:00+09:00
// ★No.15: キャッシュ名をシス単と分離
// ========================================

var CACHE_NAME = "nextstage-srs-v1";

self.addEventListener("install", function(e) {
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(name) {
          // ネクステSRSの古いキャッシュのみ削除（シス単のキャッシュは触らない）
          return name.startsWith("nextstage-srs-") && name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(e) {
  var url = e.request.url;
  // http/https以外のスキームはスキップ（chrome-extension://等のTypeError防止）
  if (!url.startsWith("http")) return;
  // GAS通信はそのまま通す
  if (url.includes("script.google.com") || url.includes("googleusercontent.com")) return;
  // 常にネットワークからフェッチ
  e.respondWith(
    fetch(e.request).catch(function() {
      return new Response("\u30aa\u30d5\u30e9\u30a4\u30f3\u3067\u3059\u3002\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u63a5\u7d9a\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002", {
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    })
  );
});
