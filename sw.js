// ========================================
// SRSテンプレート - Service Worker
// 作成日時: 2026-03-26T01:00:00+09:00
// ========================================
// ★ 展開時の変更箇所: CACHE_NAME を config.js の SW_CACHE_NAME と一致させる
// ========================================

var CACHE_NAME = "nextstage-srs-v1";

self.addEventListener("install", function(e) { self.skipWaiting(); });

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(names.filter(function(n) { return n !== CACHE_NAME; }).map(function(n) { return caches.delete(n); }));
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e) {
  var url = e.request.url;
  if (!url.startsWith("http")) return;
  if (url.includes("script.google.com") || url.includes("googleusercontent.com")) return;
  e.respondWith(fetch(e.request).catch(function() {
    return new Response("\u30aa\u30d5\u30e9\u30a4\u30f3\u3067\u3059", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }));
});
