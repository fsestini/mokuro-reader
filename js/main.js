if ('serviceWorker' in navigator) {

  window.addEventListener('load', async () => {
    try {
      let reg = await navigator.serviceWorker.register('service-worker.js');

      console.log('Service worker registered!', reg);
    } catch (err) {
      console.log('Service worker registration failed: ', err);
    }
  });
}