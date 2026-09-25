# Eurasia, 1300–1453: editorial research and cartographic record

Prepared 24 September 2026 for the local Chronograph extension. This file is an editorial record. The public interface receives plain bibliographic titles from the source registry; URLs remain research metadata.

## Implemented scope

`scripts/world/late-eurasia.cjs` adds 42 entries and continues three existing entries (Japan, Korea and Angkor). It contributes 85 phases, 85 dated territorial frames, 17 located events and 32 bibliographic groups. All interface prose has Russian, English and Kyrgyz versions.

Coverage includes the Ottomans and surviving Roman domains, Yuan and Ming, Mongolian successor politics, the Ilkhanate and Iranian successor courts, the Timurids, Jochid and Chagatai domains, Moghulistan, Kyrgyz communities, Delhi and the Deccan, Japan and Korea, mainland Southeast Asia and Java, Iberian kingdoms, France and England, the Holy Roman Empire, Lithuania, Poland, Moscow, Novgorod, the Rasulids and Meccan sharifs. Egypt and al-Sham are supplied by the separate Africa module.

This is a regional overview, not an exhaustive register of every medieval polity. Italian and Scandinavian states, Scotland, detailed Balkan and Caucasian polities, Bengal and the Rajput states, Champa, and separate fifteenth-century Jochid successor khanates remain candidates for greater resolution. Their absence must not be interpreted as empty or politically inactive land.

## Time and geometry

- Intervals are half-open; `1454` as an end value includes the entire displayed year 1453. No new Eurasian entries begin before 1300. The three continued entries preserve their older phases.
- All polygons are editorial schematics of selected regional cores or areas of influence. They are **not** traced, surveyed or source-supplied frontier lines. `approx: true` and `geometry: schematic-regional-outline` remain on every frame.
- `polity` identifies a selected political core; it does not promise the full territorial extent of a ruler. `influence` is used for overlordship, competing claimants or decentralized political space. `cultural` identifies a historical community/region or multiple rival courts rather than a single state.
- Area size is not a measure of population, political sophistication, wealth or historical importance. Do not compute authoritative state areas from these polygons.
- Capitals and battlefield coordinates locate the named place. No conjectural campaign or Kyrgyz migration route is drawn.
- Conquest years are annual snapshots. A dated transition does not imply that all land inside a schematic frame changed hands on one day. Dates inherited from broad archaeological periods retain approximate presentation.

## Decisions requiring particular care

### Ottomans and ar-Rum

Stable IDs: `late-ottoman`, `late-rum`, `late-morea`.

Ottoman frames change at 1326, 1354, 1362, 1389, 1402, 1413, 1430 and 1453. The 1354 frame is a Gallipoli foothold, not the full later Balkan sphere. The interregnum is distinguished from a reunited sultanate. The northwestern/western Anatolian core does not extend south into the whole Karaman region. Constantinople remains outside every Ottoman polygon before 1453; the 1453 frame includes the city. The Morea survives as a separate entry after the capital falls.

The Edirne transition is a period marker; its precise conquest chronology is debated. The source used for the overview places its capital role in 1362. The displayed phase is approximate.

Research: Kate Fleet (ed.), *The Cambridge History of Turkey*, vol. 1, “Anatolia, 1300–1451”; OpenStax, *World History*, vol. 1, §17.1; Municipality of Thessaloniki, “Ottoman Period”.

- https://www.cambridge.org/core/books/abs/cambridge-history-of-turkey/anatolia-13001451/71691A45EAABF8F09B64EB28C1C680EB
- https://openstax.org/books/world-history-volume-1/pages/17-1-the-ottomans-and-the-mongols
- https://thessaloniki.gr/i-want-to-know-the-city/moments-in-history/ottoman-period/?lang=en

### Yuan, Ming and Mongolia

Stable IDs: `late-yuan`, `late-ming`, `late-mongol`.

The China and Mongolian cores separate in 1368. The first Ming frame omits the Kunming/Yunnan area; the next frame begins in 1382 following the conquest and institutional reorganization described in Chinese scholarship. The northern steppe is not filled as Ming territory. Beijing replaces Nanjing as the phase coordinate in 1421. Tibet, Taiwan and the whole northern steppe are not silently incorporated into Ming polygons. The frames do not claim to reproduce every campaign or outer garrison jurisdiction.

Research: Metropolitan Museum of Art, “Yuan Dynasty (1271–1368)”, *Arts of the Ming Dynasty*, *Defining Yongle*; Liu Xin, “明初云南的边防建设”, Yunnan Academy of Social Sciences.

- https://www.metmuseum.org/essays/yuan-dynasty-1271-1368
- https://www.metmuseum.org/exhibitions/listings/2009/arts-of-the-ming-dynasty
- https://www.metmuseum.org/exhibitions/listings/2005/yongle-imperial-art
- https://www.sky.yn.gov.cn/xsyj/zgsd/2064359992836409611

### Iranian and Central Asian successions

Stable IDs: `late-ilkhan`, `late-iran-successors`, `late-chagatai`, `late-transoxiana`, `late-moghulistan`, `late-timurid`, `late-jochi`, `late-qaraqoyunlu`, `late-aqqoyunlu`.

The unified Ilkhanate phase ends in 1335. The succeeding regional frame is explicitly a **cultural region of rival courts**, not one successor empire. Chagatai western and eastern domains separate in the mid-fourteenth century. Timur begins with Transoxiana in 1370; Herat enters the displayed core in 1381, before the broader Iranian frame of 1393. Raids into India, Syria and Anatolia do not become permanent Timurid possessions. After 1405 the frame contracts eastward; after 1447 it represents competing Timurid domains. The fragmented late Jochid zone is classified as influence, not a still-unified khanate.

Research: *Encyclopaedia Iranica*, articles “Il-Khanids i”, “Jalayerids”, “Mozaffarids”, “Chaghatay Dynasty i”, “Golden Horde”, “Herat iii”, “Aq Qoyunlu”; Metropolitan Museum of Art, “The Art of the Timurid Period”.

- https://www.iranicaonline.org/articles/il-khanids-i-dynastic-history/
- https://www.iranicaonline.org/articles/jalayerids/
- https://www.iranicaonline.org/articles/mozaffarids/
- https://www.iranicaonline.org/articles/chaghatay-dynasty/i-history/
- https://www.iranicaonline.org/articles/golden-horde/
- https://www.iranicaonline.org/articles/herat-iii/
- https://www.iranicaonline.org/articles/aq-qoyunlu-confederation/
- https://www.metmuseum.org/essays/the-art-of-the-timurid-period-ca-1370-1507

### Kyrgyz continuity and the limits of Chinese evidence

Stable IDs: `late-kyrgyz` and `late-kyrgyz-tianshan`; both have `kyrgyzHistory: true` and `centralAsia: true`.

The early Yenisei card uses the Chinese *Yuan shi* geography and annals: juan 63, 128 and 18. These describe the Kyrgyz region, garrisons, farming and relocations of particular groups. They do not establish a single total migration of the entire people from the Yenisei to the Tian Shan, nor an independently surviving medieval khaganate throughout this period.

For the fourteenth–fifteenth-century distinction between southern Siberian and Tian Shan Kyrgyz, the supplement is T. Tchoroev (Chorotegin), “The Kyrgyz”, in UNESCO, *History of Civilizations of Central Asia*, vol. V, 2003, pp. 110–112. This source is identified separately; its later synthesis is not represented as a statement taken from a Chinese chronicle. Both polygons are cultural community regions. Neither is a national boundary or an exact itinerary.

- https://zh.wikisource.org/wiki/元史/卷063
- https://zh.wikisource.org/wiki/元史/卷128
- https://zh.wikisource.org/wiki/元史/卷018
- https://unesdoc.unesco.org/ark:/48223/pf0000135091
- https://turuz.com/storage/Turkologi/Tarix/2015/History_Of_Civilizations_Of_Central_Asia_5.pdf

### South and East/Southeast Asia

Delhi’s temporary southern influence is not retained over independent Vijayanagara and Bahmani territories after 1347. The Bahmani capital changes from Gulbarga to Bidar. Japan’s competing courts and the later Ashikaga period are distinct. Goryeo ends at the 1392 Joseon transition. Đại Việt separates Trần, Hồ, Ming occupation and early Lê phases. Sukhothai ends at its incorporation into Ayutthaya in 1438.

Angkor’s 1431 transition is not presented as the sudden disappearance of its population. Majapahit is a Java core; overseas relationships are not colored as direct possession of the entire archipelago. The post-Bagan Irrawaddy frame describes several competing courts and is a cultural region, not a fictitious unified Burma.

Research: *Encyclopaedia Iranica*, “Delhi Sultanate i”, “Bahmanid Dynasty”, “Gulbarga”, “Bidar”; Metropolitan Museum of Art essays and regional chronologies; UNESCO dossiers for Hampi, Ayutthaya, Trowulan, Melaka, Thang Long and the Hồ citadel; Alison K. Carter et al., “Temple Occupation and the Tempo of Collapse at Angkor Wat, Cambodia”, *PNAS* 116 (2019).

- https://www.iranicaonline.org/articles/delhi-sultanate/delhi-sultanate-i-political-and-cultural-history/
- https://www.metmuseum.org/essays/islamic-art-of-the-deccan
- https://whc.unesco.org/en/list/241/
- https://www.metmuseum.org/essays/muromachi-period-1392-1573
- https://www.metmuseum.org/exhibitions/listings/2009/korean-renaissance
- https://doi.org/10.1073/pnas.1821879116
- https://whc.unesco.org/en/list/576/
- https://whc.unesco.org/en/tentativelists/5466/
- https://82nd-and-fifth.metmuseum.org/toah/ht/07/sse.html
- https://82nd-and-fifth.metmuseum.org/toah/ht/08/sse.html

### Europe, Yemen and the Hijaz

France’s broad royal sphere is distinguished from a direct administrative frontier. Separate English frames show Gascony and Normandy; Normandy changes in 1450 and Gascony in 1453. Calais remains English. The Holy Roman Empire is a decentralized central-European core, supported by the primary Golden Bull of 1356. Lithuania and Poland remain distinct under dynastic union. Iberia is not retroactively labeled a unified Spain. Moscow and Novgorod are selected regional cores, not their full maximum later extents.

Rasulid Yemen remains separate from the northern Zaydi imams. The Meccan sharifs’ local sphere is not a second independent pan-Arabian empire; its dependence on and bargaining with Mamluk Cairo are stated. No Mamluk or Ceuta duplicate was added.

Research: Royal Armouries, “The Hundred Years’ War 1337–1453”; the National Archives; Met regional chronologies and Nasrid essay; *German History in Documents and Images*, Golden Bull translation; UNESCO Moscow/Novgorod/Vilnius dossiers; the Palace of the Grand Dukes of Lithuania; Peter B. Golden, “Rasulid Hexaglot”; John L. Meloy, *Imperial Power and Maritime Trade: Mecca and Cairo in the Later Middle Ages*.

- https://royalarmouries.org/objects-and-stories/stories/the-hundred-years-war-1337-1453
- https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/the-golden-bull-1356
- https://www.metmuseum.org/essays/the-art-of-the-nasrid-period-1232-1492
- https://www.valdovurumai.lt/en/palace-history/i/5363/important-dates/
- https://www.iranicaonline.org/articles/rasulid-hexaglot/
- https://chicagostudiesonthemiddleeast.uchicago.edu/mecca.html

## Verification

- Node syntax validation passed.
- The full world catalog test passed after integration: 150 entries, 331 phases, 143 events, 343 frames, 179 source groups; all three languages and all years 610–1453 checked.
- Separate geometry assertions checked every Ottoman frame/year before 1453 against Constantinople, its inclusion in 1453, Kunming’s exclusion/inclusion at 1368/1382, exclusion of Lhasa/Ulaanbaatar/Taipei from Ming territory, and the Herat transition at 1381.
- Structural tests validate active phase/area coverage, finite coordinates, nondegenerate rings, existing source references, unique IDs and nonempty translations. They are not a scholarly certification of every outline. Browser, global build and pre-1300 regression checks are handled by the parent integration task.
