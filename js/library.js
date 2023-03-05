// let notifier = new AWN({ icons: { enabled: false } });

// (async () => {
//   loadState();
//   // serverUrl = "http://100.90.249.88:8080";
//   serverUrl = state.serverAddress;
//   container = document.getElementById("entries");
//   bcul = document.getElementById("bcul");
//   await refreshLibrary();
// })();

async function onFetchRequest(e) {
  const serverTextBox = document.getElementById('serverTextBox');
  await refreshLibrary(serverTextBox.value);
}

async function refreshLibrary(serverUrl) {
  const container = document.getElementById("entries");
  const bcul = document.getElementById("bcul");
  const manager = new LibraryDisplayManager(serverUrl, container, bcul);

  const tree = await fetchLibrary(serverUrl);
  console.log(tree.length);
  manager.populate(tree);
}

class LibraryDisplayManager {

  // let serverUrl;
  // let container;
  // let bcul;

  constructor(serverUrl, container, breadCrumbs) {
    this.serverUrl = serverUrl;
    this.container = container;
    this.bcul = breadCrumbs;
  }

  populate(tree) {
    this.bcul.innerHTML = "";
    const li = this.createBCLabel([], tree, "Library");
    li.classList.add("is-active");
    this.bcul.appendChild(li);
    this.populateContainer([], tree);
  }

  populateContainer(path, treePreview) {
    this.container.innerHTML = "";
    for (const node of treePreview) {
      const entry = this.createEntry(path, node);
      this.container.appendChild(entry);
    }
  }

  deactivateBCItems() {
    const items = this.bcul.getElementsByTagName("li");
    for (const item of items) {
      item.classList.remove("is-active");
    }
  }

  // fetchDOM(url) {
  //   return fetch(url)
  //     .then((response) => response.text())
  //     .then((html) => {
  //       var el = document.createElement('html');
  //       el.innerHTML = html;
  //       return el;
  //     });
  // }

  _getUrlInfo(path, node) {
    const baseURL = this.serverUrl + "/" + path.join('/') + '/';
    var imgs = [];
    var jsons = [];
    var pairs = [];

    for (const fn of node.imageFileNames) {
      const url = baseURL + node.title + '/' + fn;
      imgs.push({name: fn, url: url});
    }

    for (const fn of node.jsonFileNames) {
      const url = baseURL + '_ocr/' + node.title + '/' + fn;
      jsons.push({name: fn, url: url});
    }

    for (let i = 0; i < imgs.length; i++) {
      const imgInfo = imgs[i];
      const jsonInfo = jsons[i];
      pairs.push({fst: imgInfo, snd: jsonInfo});
    }
    return pairs;
  }

  _generateZip(path, node, callback) {
    // const baseURL = this.serverUrl + "/" + path.join('/') + '/';
    const infos = this._getUrlInfo(path, node);
    var zip = new JSZip();

    for (const info of infos) {
      const imgInfo = info.fst;
      const jsonInfo = info.snd;
      zip.file(imgInfo.name, urlToPromise(imgInfo.url), { binary: true });
      zip.file(jsonInfo.name, urlToPromise(jsonInfo.url), { binary: true });
    }

    zip.generateAsync({ type: "blob" }, callback)
      .then(function callback(blob) {
        const archiveName = path.join(' - ') + ' - ' + node.title + ".zip";
        saveAs(blob, archiveName);
      }, function (e) {
        alert(e);
      });
  }

  async _generateUrlOcrPairs(path, node) {
    const infos = this._getUrlInfo(path, node);
    var pairs = [];

    for (const info of infos) {
      const jsonUrl = info.snd.url;
      const mokuroString = 
        await fetch(jsonUrl, { mode: "cors" })
               .then((response) => response.text());
      const mokuroData = JSON.parse(mokuroString);
      pairs.push({ imgUrl: info.fst.url, ocrData: mokuroData });
    }

    return pairs;
  }

  createEntry(path, node) {
    const entry = document.createElement("div");
    entry.classList.add("entry");
    const p = document.createElement("p");
    
    switch (node.kind) {
      case "collection":
        const stack = document.createElement("img");
        stack.src = "stack.png";
        stack.classList.add("stack-img");
        entry.appendChild(stack);
        entry.onclick = e => {
          const newPath = path.concat([node.title]);
          const li = this.createBCLabel(newPath, node.children, node.title);
          this.deactivateBCItems();
          li.classList.add("is-active");
          this.bcul.appendChild(li);
          this.populateContainer(newPath, node.children);
        };
        break;
      case "archive":
        entry.onclick = async e => {
          // resetReader();
          // const pairs = await this._generateUrlOcrPairs(path, node);
          // const key = path.join('_') + '_' + node.title;
          // populatePairs(pairs, key);
          // returnFromPopup();
          this._generateZip(path, node, (metadata) => {
            console.log(metadata.currentFile);
            p.innerText = Math.floor(metadata.percent) + '%';
          });
        };
        break;
    }

    const img = document.createElement("img");
    // img.src = this.serverUrl + "/library/" + node.previewImg;
    img.src = node.previewImg;
    entry.appendChild(img);
    p.innerText = node.title;
    entry.appendChild(p);
    return entry;
  }

  createBCLabel(path, collection, title) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.innerText = title;
    a.onclick = e => {
      while (this.bcul.children[this.bcul.children.length - 1] != li) {
        this.bcul.removeChild(this.bcul.children[this.bcul.children.length - 1]);
      }
      li.classList.add("is-active");
      this.populateContainer(path, collection);
    };
    li.appendChild(a);
    return li;
  }


}

function urlToPromise(url) {
  return new Promise(function (resolve, reject) {
    JSZipUtils.getBinaryContent(url, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}