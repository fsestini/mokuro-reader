const cacheName = 'mokuro-web-cache-v7';

const precacheResources = [
  '.',
  'index.html',
  'css/mokuro.css',
  'css/main.css',
  'js/dictionaries.js',
  'js/inject.js',
  'js/loader.js',
  'js/main.js',
  'js/mokuro.js',
  'js/panzoom.js',
  'js/yomichan.js',
  'js/library.js',
  'app.webmanifest',
  'yomichan.html',
  'mybulma/css/mystyles.css',
  'stack.png',
  'lib/jszip-utils.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js',

  'yomichan/ext/css/display.css',
  'yomichan/ext/css/display-pronunciation.css',
  'yomichan/ext/css/action-popup.css',
  'yomichan/ext/css/material.css',

  'yomichan/ext/display-templates.html',

  'yomichan/ext/data/schemas/dictionary-index-schema.json',
  'yomichan/ext/data/schemas/dictionary-term-bank-v1-schema.json',
  'yomichan/ext/data/schemas/dictionary-term-bank-v3-schema.json',
  'yomichan/ext/data/schemas/dictionary-term-meta-bank-v3-schema.json',
  'yomichan/ext/data/schemas/dictionary-kanji-bank-v1-schema.json',
  'yomichan/ext/data/schemas/dictionary-kanji-bank-v3-schema.json',
  'yomichan/ext/data/schemas/dictionary-kanji-meta-bank-v3-schema.json',
  'yomichan/ext/data/schemas/dictionary-tag-bank-v3-schema.json',

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
  'yomichan/ext/lib/wanakana.min.js',
  'yomichan/ext/lib/wanakana.min.js.map',

  'yomichan/ext/data/fonts/kanji-stroke-orders.ttf',
  'yomichan/ext/data/deinflect.json',

  'yomichan/ext/images/accessibility.svg',
  'yomichan/ext/images/add-term-kana.svg',
  'yomichan/ext/images/add-term-kanji.svg',
  'yomichan/ext/images/backup.svg',
  'yomichan/ext/images/book.svg',
  'yomichan/ext/images/checkbox-border.svg',
  'yomichan/ext/images/checkbox-check.svg',
  'yomichan/ext/images/checkbox-fill.svg',
  'yomichan/ext/images/checkmark.svg',
  'yomichan/ext/images/clipboard.svg',
  'yomichan/ext/images/cog.svg',
  'yomichan/ext/images/collapse.svg',
  'yomichan/ext/images/connection.svg',
  'yomichan/ext/images/cross.svg',
  'yomichan/ext/images/double-down-chevron.svg',
  'yomichan/ext/images/entry-current.svg',
  'yomichan/ext/images/exclamation-point-short.svg',
  'yomichan/ext/images/expand.svg',
  'yomichan/ext/images/external-link.svg',
  'yomichan/ext/images/hamburger-menu.svg',
  'yomichan/ext/images/hiragana-a.svg',
  'yomichan/ext/images/icon128.png',
  'yomichan/ext/images/icon16.png',
  'yomichan/ext/images/icon19.png',
  'yomichan/ext/images/icon32.png',
  'yomichan/ext/images/icon38.png',
  'yomichan/ext/images/icon48.png',
  'yomichan/ext/images/icon64.png',
  'yomichan/ext/images/kebab-menu.svg',
  'yomichan/ext/images/key.svg',
  'yomichan/ext/images/keyboard.svg',
  'yomichan/ext/images/left-chevron.svg',
  'yomichan/ext/images/lock.svg',
  'yomichan/ext/images/magnifying-glass.svg',
  'yomichan/ext/images/material-down-arrow.svg',
  'yomichan/ext/images/material-right-arrow.svg',
  'yomichan/ext/images/mouse.svg',
  'yomichan/ext/images/note-card.svg',
  'yomichan/ext/images/palette.svg',
  'yomichan/ext/images/play-audio.svg',
  'yomichan/ext/images/plus-circle-large.svg',
  'yomichan/ext/images/plus-circle-small.svg',
  'yomichan/ext/images/plus-thick.svg',
  'yomichan/ext/images/popup-size.svg',
  'yomichan/ext/images/popup.svg',
  'yomichan/ext/images/profile.svg',
  'yomichan/ext/images/question-mark-circle.svg',
  'yomichan/ext/images/question-mark-thick.svg',
  'yomichan/ext/images/question-mark.svg',
  'yomichan/ext/images/radio-button-dot.svg',
  'yomichan/ext/images/radio-button.svg',
  'yomichan/ext/images/right-chevron.svg',
  'yomichan/ext/images/scanning.svg',
  'yomichan/ext/images/sentence-parsing.svg',
  'yomichan/ext/images/source-term.svg',
  'yomichan/ext/images/speaker.svg',
  'yomichan/ext/images/spinner.svg',
  'yomichan/ext/images/tag.svg',
  'yomichan/ext/images/text-parsing.svg',
  'yomichan/ext/images/translation.svg',
  'yomichan/ext/images/up-arrow.svg',
  'yomichan/ext/images/view-note.svg',
  'yomichan/ext/images/window.svg',
  'yomichan/ext/images/yomichan-icon.svg'
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

function isCachable(url) {
  return url.endsWith('.js') || url.endsWith('.html') || url.endsWith('.css') || (precacheResources.some(res => url.endsWith(res)));
}

self.addEventListener('fetch', (event) => {

  event.respondWith(caches.open(cacheName).then((cache) => {
    return fetch(event.request.url, { cache: "reload" })
      .then((fetchedResponse) => {
        if (isCachable(event.request.url)) {
          cache.put(event.request, fetchedResponse.clone());
        }

        return fetchedResponse;
      }).catch(() => {
        return cache.match(event.request.url);
      });
  }));

});
