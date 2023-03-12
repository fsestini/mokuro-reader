const input = document.getElementById("filepick");
input.addEventListener('change', onFilePick);

var allocatedObjectURLs = [];

function createBlankPage() {
  const page = document.createElement('div');
  page.classList.add('page');
  const pageContainer = document.createElement('div');
  pageContainer.classList.add('pageContainer');
  page.appendChild(pageContainer);
  return page;
}

function populatePage(page, url, mokuroData) {
  const pageContainer = page.getElementsByClassName('pageContainer')[0];

  pageContainer.style.backgroundImage = "url(\"" + url + "\")";
  pageContainer.style.width = mokuroData.img_width;
  pageContainer.style.height = mokuroData.img_height;

  var zindex = 12;
  for (const block of mokuroData.blocks) {
    const textBox = document.createElement('div');
    textBox.classList.add('textBox');
    textBox.style.left = block.box[0];
    textBox.style.top = block.box[1];
    textBox.style.width = block.box[2] - block.box[0];
    textBox.style.height = block.box[3] - block.box[1];
    textBox.style.fontSize =
      (block.font_size > 32 ? 32 : block.font_size) + "px";
    textBox.style.zIndex = zindex;
    if (block.vertical) {
      textBox.style.writingMode = "vertical-rl";
    }

    for (const line of block.lines) {
      const p = document.createElement('p');
      // p.innerText = line;
      
      for (let i = 0; i < line.length; i++) {
        const t = line[i];
        const s = document.createElement("span");
        s.innerText = t;
        s.onclick = e => {
          onSpanClick(s, e.clientX, e.clientY);
          console.log(e.clientX, e.clientY);
        };
        p.appendChild(s);
      }

      textBox.appendChild(p);
    }

    initTextBox(textBox);

    pageContainer.appendChild(textBox);
    zindex += 1;
  }
}

function createPage(url, mokuroData) {
  const page = document.createElement('div');
  page.classList.add('page');
  const pageContainer = document.createElement('div');
  pageContainer.classList.add('pageContainer');
  pageContainer.style.backgroundImage = "url(\"" + url + "\")";

  pageContainer.style.width = mokuroData.img_width;
  pageContainer.style.height = mokuroData.img_height;
  
  var zindex = 12;
  for (const block of mokuroData.blocks) {
    const textBox = document.createElement('div');
    textBox.classList.add('textBox');
    textBox.style.left = block.box[0];
    textBox.style.top = block.box[1];
    textBox.style.width = block.box[2] - block.box[0];
    textBox.style.height = block.box[3] - block.box[1];
    textBox.style.fontSize =
      (block.font_size > 32 ? 32 : block.font_size) + "px";
    textBox.style.zIndex = zindex;
    if (block.vertical) {
      textBox.style.writingMode = "vertical-rl";
    }

    for (const line of block.lines) {
      const p = document.createElement('p');
      p.innerText = line;
      textBox.appendChild(p);
    }

    pageContainer.appendChild(textBox);
    zindex += 1;
  }

  page.appendChild(pageContainer);
  return page;
}

function purgePages() {
  var pages = document.getElementsByClassName('page');
  while (pages[0]) {
    pages[0].parentNode.removeChild(pages[0]);
  }
}

function purgeURLs() {
  for (const url of allocatedObjectURLs) {
    URL.revokeObjectURL(url);
  }
  allocatedObjectURLs = [];
}

async function resetReader() {
  purgePages();
  // purgeURLs();
  await purgePromisedUrls();
}

var promisedPairs = [];

async function purgePromisedUrls() {
  promisedPairs.map(p => p.then(pair => {
    console.log('revoking url...');
    URL.revokeObjectURL(pair[0]);
  }));
}

async function asyncLoadFromZip(file) {
  const jszip = new JSZip();
  const zip = await jszip.loadAsync(file);
  var imgFiles = zip.filter((relativePath, file) => {
    const fileName = file.name;
    return fileName.endsWith('.jpg')
      || fileName.endsWith('.jpeg')
      || fileName.endsWith('.png');
  });
  imgFiles.sort((a, b) => a.name > b.name);

  promisedPairs = imgFiles.map(zipEntry => {
    var splitting = zipEntry.name.split('.');
    splitting[splitting.length - 1] = "json";
    const jsonFileName = splitting.join('.');
    const jsonPromise = zip.file(jsonFileName).async('string')
      .then(mokuroString => JSON.parse(mokuroString));
    const urlPromise = zipEntry.async('blob')
      .then(blob => URL.createObjectURL(blob));
    return Promise.all([urlPromise, jsonPromise]);
      //.then(values => return { imgUrl: values[0], ocrData: values[1] });
  });

  const leftA = document.getElementById('leftAPage')

  for (let i = 0; i < imgFiles.length; i++) {
    const page = createBlankPage();
    page.id = "page" + i;
    pc.insertBefore(page, leftA);
  }

  storageKey = "mokuro_web_" + file.name;
  setupVolume();
}

async function onPageAboutToShow(ix) {
  console.log('Page ' + ix + ' about to show.');
  const page = document.getElementById('page' + ix);
  if (!page.style.backgroundImage) {
    console.log('Awaiting data for page ' + ix + '...');
    const values = await promisedPairs[ix];
    console.log('Populating page ' + ix);
    populatePage(page, values[0], values[1]);
  }
  console.log('Page ' + ix + ' ready.');
}

async function loadFromZip(file) {
  const jszip = new JSZip();
  const zip = await jszip.loadAsync(file);
  var imgFiles = zip.filter((relativePath, file) => {
    const fileName = file.name;
    return fileName.endsWith('.jpg')
      || fileName.endsWith('.jpeg')
      || fileName.endsWith('.png');
  });
  imgFiles.sort((a, b) => a.name > b.name);

  showLoadProgress();
  loadProgress.max = imgFiles.length;
  loadProgress.value = 0;

  var pairs = [];

  for (const zipEntry of imgFiles) {
    var splitting = zipEntry.name.split('.');
    splitting[splitting.length - 1] = "json";
    const jsonFileName = splitting.join('.');

    const mokuroString = await zip.file(jsonFileName).async('string');
    const mokuroData = JSON.parse(mokuroString);

    const blob = await zipEntry.async('blob');
    const url = URL.createObjectURL(blob);
    allocatedObjectURLs.push(url);
    pairs.push({ imgUrl: url, ocrData: mokuroData });
    loadProgress.value = loadProgress.value + 1;
  }

  hideLoadProgress();

  populatePairs(pairs, file.name);
}

// { imgUrl: ..., ocrData: ... }
function populatePairs(pairs, key) {
  const leftA = document.getElementById('leftAPage')

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    const page = createPage(pair.imgUrl, pair.ocrData);
    page.id = "page" + i;
    pc.insertBefore(page, leftA);
  }

  storageKey = "mokuro_web_" + key;
  setupVolume();
}

async function onFilePick(event) {
  await resetReader();

  var file = event.target.files[0];
  await asyncLoadFromZip(file);
  // await loadFromZip(file);
}

const dimOverlay = document.getElementById('dimOverlay');
const loadPop = document.getElementById('load-progress-popup');
const loadProgress = document.getElementById('load-progress');

function showLoadProgress() {
  loadPop.style.display = 'block';
  dimOverlay.style.display = 'initial';
  pz.pause();
}

function hideLoadProgress() {
  loadPop.style.display = 'none';
  dimOverlay.style.display = 'none';
  pz.resume();
}