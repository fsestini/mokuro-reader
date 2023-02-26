var dictionaryDatabase;

const mainProgress = document.getElementById("main-progress");
const subProgress = document.getElementById("sub-progress");
const exportProgress = document.getElementById("export-progress");

(async () => {
  dictionaryDatabase = new DictionaryDatabase();
  await dictionaryDatabase.prepare();
  await populateDictionaryList();
})();

async function populateDictionaryList() {
  const info = await dictionaryDatabase.getDictionaryInfo();
  const ul = document.getElementById("jisho-list");
  ul.innerHTML = "";
  for (i of info) {
    const li = document.createElement("li");
    li.innerText = i.title;
    ul.appendChild(li);
  }
}

async function importDictFromFile(file) {
  console.log(file);
  const archiveContent = await _readFile(file);

  const dictionaryImporter =
    createDictionaryImporter(() => { progressEvent = true; });
  mainProgress.style.display = "block";
  subProgress.style.display = "block"
  const { result, errors } = await dictionaryImporter.importDictionary(
    dictionaryDatabase,
    archiveContent,
    { prefixWildcardsSupported: true }
  );
  console.log(progressEvent);
  mainProgress.style.display = "none";
  subProgress.style.display = "none";
  await populateDictionaryList();
}

document.querySelector('input[name="dict-picker"]')
  .addEventListener('change', async (e) => {

    for (const file of e.target.files) {
      const file = e.target.files[0];
      await importDictFromFile(file);
    }
  });

function createDictionaryImporter(onProgress) {
  const dictionaryImporterMediaLoader = new DictionaryImporterMediaLoader();
  return new DictionaryImporter(dictionaryImporterMediaLoader, (...args) => {
    const { stepIndex, stepCount, index, count } = args[0];
    //console.log(stepIndex < stepCount);
    //console.log(index <= count);
    console.log(stepIndex + " " + stepCount + " " + index + " " + count);
    mainProgress.max = stepCount;
    mainProgress.value = stepIndex;
    subProgress.max = count;
    subProgress.value = index;
    if (typeof onProgress === 'function') {
      onProgress(...args);
    }
  });
}

function _readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}
