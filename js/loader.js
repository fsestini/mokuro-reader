const input = document.getElementById("filepick");
input.addEventListener('change', onFilePick);

var urls = [];

function createPage(url, mokuroData) {
  const page = document.createElement('div');
  page.classList.add('page');
  const pageContainer = document.createElement('div');
  pageContainer.classList.add('pageContainer');

  pageContainer.style.width = mokuroData.img_width;
  pageContainer.style.height = mokuroData.img_height;
  pageContainer.style.backgroundImage = "url(\"" + url + "\")";

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
  for (const url of urls) {
    URL.revokeObjectURL(url);
  }
  urls = [];
}

async function onFilePick(event) {
  purgePages();
  purgeURLs();

  var file = event.target.files[0];
  const jszip = new JSZip();
  var pages = [];
  const leftA = document.getElementById('leftAPage')

  const zip = await jszip.loadAsync(file) // .then(async function(zip) {
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
  
  for (const zipEntry of imgFiles) {
    var splitting = zipEntry.name.split('.');
    splitting[splitting.length - 1] = "json";
    const jsonFileName = splitting.join('.');

    const mokuroString = await zip.file(jsonFileName).async('string');
    const mokuroData = JSON.parse(mokuroString);
    const blob = await zipEntry.async('blob');
    const url = URL.createObjectURL(blob);
    urls.push(url);
    pages.push(createPage(url, mokuroData));
    // URL.revokeObjectURL(url);
    loadProgress.value = loadProgress.value + 1;
  }
  // });

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    page.id = "page" + i;
    pc.insertBefore(page, leftA);
  }

  storageKey = "mokuro_web_" + file.name;
  setupVolume();

  hideLoadProgress();
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