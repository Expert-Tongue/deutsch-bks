// The list of course languages. It drives the start page, the "Andere Sprachen" cards,
// the games' language buttons and offline caching.
// To add a language: add one line here (keep alphabetical order by English name) and upload its folder.
//   code: folder name · short: games button · native: name in the language · de: German subtitle
//   open: "Open" in the language · en: speakers' language in English · match: phone language codes
self.LANGS=[
  {code:'sq', short:'Shqip', native:'Shqip', de:'Deutsch für Albanischsprachige', open:'Hap', en:'Albanian', match:['sq']},
  {code:'ar', short:'العربية', native:'العربية', rtl:'ar', de:'Deutsch für Arabischsprachige', open:'افتح', en:'Arabic', match:['ar']},
  {code:'bn', short:'বাংলা', native:'বাংলা', de:'Deutsch für Bengalischsprachige', open:'খুলুন', en:'Bengali', match:['bn']},
  {code:'bks',short:'BKS', native:'Bosanski · Hrvatski · Srpski', de:'Deutsch für BKS-Sprecher', open:'Otvori', en:'Bosnian, Croatian, Serbian', match:['bs','hr','sr','sh','cnr']},
  {code:'bg', short:'Български', native:'Български', de:'Deutsch für Bulgarischsprachige', open:'Отвори', en:'Bulgarian', match:['bg']},
  {code:'zh', short:'中文', native:'中文（简体）', de:'Deutsch für Chinesischsprachige', open:'打开', en:'Chinese', match:['zh']},
  {code:'en', short:'English', native:'English', de:'Deutsch für Englischsprachige', open:'Open', en:'English', match:['en']},
  {code:'fa', short:'فارسی', native:'فارسی · دری', rtl:'fa', de:'Deutsch für Persischsprachige', open:'باز کنید', en:'Farsi, Dari', match:['fa','prs']},
  {code:'fr', short:'Français', native:'Français', de:'Deutsch für Französischsprachige', open:'Ouvrir', en:'French', match:['fr']},
  {code:'el', short:'Ελληνικά', native:'Ελληνικά', de:'Deutsch für Griechischsprachige', open:'Άνοιγμα', en:'Greek', match:['el']},
  {code:'hi', short:'हिंदी', native:'हिंदी', de:'Deutsch für Hindisprachige', open:'खोलें', en:'Hindi', match:['hi']},
  {code:'hu', short:'Magyar', native:'Magyar', de:'Deutsch für Ungarischsprachige', open:'Megnyitás', en:'Hungarian', match:['hu']},
  {code:'it', short:'Italiano', native:'Italiano', de:'Deutsch für Italienischsprachige', open:'Apri', en:'Italian', match:['it']},
  {code:'ko', short:'한국어', native:'한국어', de:'Deutsch für Koreanischsprachige', open:'열기', en:'Korean', match:['ko']},
  {code:'ku', short:'Kurdî', native:'Kurdî (Kurmancî)', de:'Deutsch für Kurdischsprachige', open:'Veke', en:'Kurdish (Kurmanji)', match:['ku','kmr']},
  {code:'ml', short:'മലയാളം', native:'മലയാളം', de:'Deutsch für Malayalamsprachige', open:'തുറക്കുക', en:'Malayalam', match:['ml']},
  {code:'pl', short:'Polski', native:'Polski', de:'Deutsch für Polnischsprachige', open:'Otwórz', en:'Polish', match:['pl']},
  {code:'pt', short:'Português', native:'Português', de:'Deutsch für Portugiesischsprachige', open:'Abrir', en:'Portuguese', match:['pt']},
  {code:'ro', short:'Română', native:'Română', de:'Deutsch für Rumänischsprachige', open:'Deschide', en:'Romanian', match:['ro','mo']},
  {code:'ru', short:'Русский', native:'Русский', de:'Deutsch für Russischsprachige', open:'Открыть', en:'Russian', match:['ru']},
  {code:'es', short:'Español', native:'Español', de:'Deutsch für Spanischsprachige', open:'Abrir', en:'Spanish', match:['es']},
  {code:'tl', short:'Tagalog', native:'Tagalog / Filipino', de:'Deutsch für Tagalogsprachige', open:'Buksan', en:'Tagalog', match:['tl','fil']},
  {code:'th', short:'ไทย', native:'ภาษาไทย', de:'Deutsch für Thaisprachige', open:'เปิด', en:'Thai', match:['th']},
  {code:'tr', short:'Türkçe', native:'Türkçe', de:'Deutsch für Türkischsprachige', open:'Aç', en:'Turkish', match:['tr']},
  {code:'uk', short:'Українська', native:'Українська', de:'Deutsch für Ukrainischsprachige', open:'Відкрити', en:'Ukrainian', match:['uk']},
  {code:'ur', short:'اردو', native:'اردو', rtl:'ur', de:'Deutsch für Urdusprachige', open:'کھولیں', en:'Urdu', match:['ur']},
  {code:'vi', short:'Tiếng Việt', native:'Tiếng Việt', de:'Deutsch für Vietnamesischsprachige', open:'Mở', en:'Vietnamese', match:['vi']}
];
