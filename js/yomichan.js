var dictionaryDatabase;
var translator;
var japaneseUtil;
// var dictMap = new Map();

(async () => {
  dictionaryDatabase = new DictionaryDatabase();
  await dictionaryDatabase.prepare();
  japaneseUtil = new JapaneseUtil(wanakana);
  translator = new Translator({
    japaneseUtil: japaneseUtil,
    database: dictionaryDatabase
  });
  const deinflectionReasions =
    await _fetchAsset('yomichan/ext/data/deinflect.json', true);
  translator.prepare(deinflectionReasions);

  // await prepareDictionaryMap();
})();

async function generateDictionaryMap() {
  var dictMap = new Map();
  const info = await dictionaryDatabase.getDictionaryInfo();
  const maxPriority = info.length;
  for (let i = 0; i < info.length; i++) {
    const d = info[i];
    const p = d.title == "JMdict (English)" ? maxPriority : i;
    dictMap.set(d.title, { index: i, priority: p });
  }
  return dictMap;
}

async function yomiQuery(query, yomicontainer) {
  const dictMap = await generateDictionaryMap();
  let termResults = await translator.findTerms('split', query, {
    enabledDictionaryMap: dictMap,
    mainDictionary: "JMdict (English)",
    excludeDictionaryDefinitions: null,
    sortFrequencyDictionary: null,
    deinflect: true,
    removeNonJapaneseCharacters: true,
    convertHalfWidthCharacters: 'false',
    convertNumericCharacters: 'false',
    convertAlphabeticCharacters: 'false',
    convertHiraganaToKatakana: 'false',
    convertKatakanaToHiragana: 'variant',
    collapseEmphaticSequences: 'true',
    textReplacements: [null],
    matchType: 'exact'
  })

  const _contentManager = new DisplayContentManager(null);
  const _displayGenerator = new DisplayGenerator({
    japaneseUtil,
    contentManager: _contentManager
  });
  await _displayGenerator.prepare();

  yomicontainer.innerHTML = "";
  const entries = termResults.dictionaryEntries;
  if (entries.length == 0) {
    yomicontainer.innerHTML = "No results"
  } else {
    for (r of entries) {
      // console.log(r.headwords[0].term);

      const node = _displayGenerator.createTermEntry(r);
      // console.log(node);
      yomicontainer.appendChild(node);
    }
  }
}

async function _fetchAsset(url, json = false) {
  const response = await fetch(url, {
    method: 'GET',
    //mode: 'no-cors',
    cache: 'default',
    credentials: 'omit',
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return await (json ? response.json() : response.text());
}