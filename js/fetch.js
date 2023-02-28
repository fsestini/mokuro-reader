async function fetchAnchorLabels(url) {
  console.log('fetching anchors: ' + url);
  return fetch(url, { mode: "cors" })
    .then((response) => response.text())
    .then((html) => {
      var el = document.createElement('html');
      el.innerHTML = html;
      const anchors = el.getElementsByTagName("a");
      return Array.from(anchors)
        .map(a => a.innerText)
        .filter(l => !(l.startsWith(".")));
    });
}

function isImageFile(fileName) {
  return fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png');
}

async function fetchLibrary(url) {
  console.log('fetching library: ' + url);
  const labels = await fetchAnchorLabels(url);
  const validLabels =
    labels.filter(l => l.endsWith('/') || l.endsWith('.html'));
  const dirLabels = validLabels.filter(l => l.endsWith('/'));
  const fileLabels = validLabels.filter(l => l.endsWith('.html'));
  const promises = dirLabels.map(async (l) => {
    const title = l.slice(0, -1);
    const newUrl = url + "/" + title;
    
    if (fileLabels.includes(title + ".html")) {
      const fileLabels = await fetchAnchorLabels(newUrl);
      if (fileLabels.length > 0) {
        const firstFile = fileLabels.sort()[0];
        const imageFiles = fileLabels.filter(x => isImageFile(x));

        const jsonUrl = url + "/_ocr/" + title;
        const jsonLabels = await fetchAnchorLabels(jsonUrl);
        const jsonFiles = jsonLabels.filter(x => x.endsWith('.json'));
        const entry = {
          title: title,
          kind: "archive",
          // url: newUrl + ".html",
          imageFileNames: imageFiles,
          jsonFileNames: jsonFiles,
          previewImg: newUrl + "/" + firstFile
        };
        return [entry];
      } else {
        return [];
      }
    } else {
      const cs = await fetchLibrary(newUrl);
      if (cs.length > 0) {
        const img = cs[0].previewImg;
        const entry = {
          title: title,
          kind: "collection",
          children: cs,
          previewImg: img
        };
        return [entry];
      } else {
        return [];
      }
    }
  });
  const result = await Promise.all(promises);
  return result.flat();
}
