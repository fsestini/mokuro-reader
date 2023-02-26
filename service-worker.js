const cacheName = 'mokuro-web-cache-v2';

const precacheResources = [
  '.',
  'index.html',
  'css/mokuro.css',
  'css/yomichan.css',
  'js/dictionaries.js',
  'js/inject.js',
  'js/loader.js',
  'js/main.js',
  'js/mokuro.js',
  'js/panzoom.js',
  'js/yomichan.js',
  'app.webmanifest',
  'yomichan.html',

  'yomichan/ext/css/display.css',
  'yomichan/ext/css/display-pronunciation.css',
  'yomichan/ext/css/action-popup.css',
  'yomichan/ext/css/material.css',

  'yomichan/ext/js/language/dictionary-database.js',
  'yomichan/ext/js/language/dictionary-importer.js',
  'yomichan/ext/js/language/deinflector.js',
  'yomichan/ext/js/language/translator.js',
  'yomichan/ext/js/language/dictionary-importer-media-loader.js',
  'yomichan/ext/js/language/sandbox/japanese-util.js',
  'yomichan/ext/js/data/database.js',
  'yomichan/ext/js/data/json-schema.js',
  'yomichan/ext/js/core.js',
  'yomichan/ext/js/general/regex-util.js',
  'yomichan/ext/js/general/text-source-map.js',
  'yomichan/ext/js/display/display-generator.js',
  'yomichan/ext/js/display/display-content-manager.js',
  'yomichan/ext/js/display/sandbox/structured-content-generator.js',
  'yomichan/ext/js/display/sandbox/pronunciation-generator.js',
  'yomichan/ext/js/dom/html-template-collection.js',
  'yomichan/ext/js/language/sandbox/dictionary-data-util.js',
  'yomichan/ext/lib/jszip.min.js',
  'yomichan/ext/lib/wanakana.min.js'
];

self.addEventListener('install', (event) => {
  console.log('Service worker install event!');
  event.waitUntil(caches.open(cacheName)
    .then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (e) => {
  console.log('Service worker activate event!');
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === cacheName) {
            return;
          }
          return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {

  event.respondWith(caches.open(cacheName).then((cache) => {
    return fetch(event.request.url, { cache: "reload" })
      .then((fetchedResponse) => {
        cache.put(event.request, fetchedResponse.clone());

        return fetchedResponse;
      }).catch(() => {
        return cache.match(event.request.url);
      });
  }));

});
