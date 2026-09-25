# Africa, 1454–1600: research and editorial decisions

Prepared 24 September 2026. Data file: `scripts/world/early-africa.cjs`. This is a local extension; it does not deploy the site.

The module reviews all 29 African profiles active in 1453 and adds 13 profiles. It contributes 91 phases, 85 territorial frames, 24 located milestones and 20 source groups. Every phase has Russian, English and Kyrgyz text and three learning fields: government, economy and society.

## Interpretation of the map

- Years are annual snapshots; intervals are half-open and end at 1601 to include 1600. A transition during a year does not imply that every point changed hands on 1 January.
- Outlines are authored, schematic regional cores. They are not traced from a surveyed or scholarly boundary dataset. Every frame retains `approx: true` and `geometry: schematic-regional-outline`.
- `influence` distinguishes tributary relationships, military occupations, divided authority and decentralized government from selected political cores. Cities, ports and old inhabited sites use `settlement` where appropriate. Oromo communities use `cultural`.
- Specific regional cards do not imply independent states. The Ottoman provinces of Egypt/al-Sham, Algiers, Tunis and Tripoli share the Ottoman Eurasian colour `#bc815a`. Local provincial administration is described in their text.
- No speculative campaign or migration routes are drawn. Shimbra Kure and Wayna Daga are placed in their historical regions, with approximate location metadata; these are not claimed as excavated battlefield coordinates.
- This is a regional educational overview. It does not yet enumerate every Hausa, Mossi, Senegambian, Akan, Great Lakes or Central African polity; Ndongo, the early Portuguese Angolan foothold and finer inland boundaries warrant a subsequent content pass. Uncoloured land must not be described as uninhabited or politically inactive.

## Western Sudan

**IDs:** `mali`, `gao`, `timbuktu-late`, `djenne-late`, `early-songhay-dendi`.

Mali survives in its Manden heartland throughout the interval. Gao’s territorial frames change with Sonni Ali’s accession, Timbuktu in 1468, Djenné around 1473, the Askia succession in 1493 and the Moroccan victory in 1591. The final Gao frame is a town under occupation, not an immortal Songhay empire. Dendi preserves the resistance and successor history downriver. Moroccan colour marks the occupied Niger towns without inventing a continuous state corridor across the Sahara.

The Djenné date is deliberately approximate: the Rice University/OpenStax overview gives 1473, while other accessible syntheses differ. The card does not present this as an exact archaeological date. The module does not copy a maximal Songhay claim covering the entire Atlantic-to-Kano belt as uniformly administered territory.

Evidence:

- John O. Hunwick, *Timbuktu and the Songhay Empire: al-Saʿdi’s Taʾrikh al-sudan down to 1613 and Other Contemporary Documents*, Brill, 1999. [Publisher book preview](https://books.google.com/books/about/Timbuktu_and_the_Songhay_Empire.html?id=7L4TVckuppUC).
- Rice University/OpenStax, [The Songhai Empire](https://openstax.org/books/world-history-volume-2/pages/3-2-the-songhai-empire).
- Metropolitan Museum of Art, [Western and Central Sudan, 1400–1600](https://82nd-and-fifth.metmuseum.org/toah/ht/08/afu.html) and [Sahel: Art and Empires](https://www.metmuseum.org/exhibitions/sahel-art-empire-sahara).

## Lake Chad and the Nile

**IDs:** `kanem`, `bornu-late`, `dongola`, `alwa`, `early-funj`.

Bornu's west-of-lake capital and later regional influence are distinguished from Bulala Kanem. Renewed Bornu campaigning does not erase every Bulala centre. Idris Alauma’s approximate period marker follows Dierk Lange’s 1564 chronology; competing scholarly regnal chronologies exist. It is not used to assert a precise year of death. The located diplomatic milestone uses documented 1576–1578 Ottoman correspondence rather than inventing a travel route.

The conventional 1504 foundation date for the Funj replaces Alwa’s political profile. It is approximate, not a claim that Soba’s entire population disappeared on that date. Dongola remains an inhabited settlement and is not prolonged as medieval Makuria.

Evidence:

- Ahmad ibn Furtu, *A Sudanic Chronicle: The Borno Expeditions of Idris Alauma (1564–1576)*, edited and translated by Dierk Lange, Franz Steiner, 1987; B. G. Martin, [Maî Idrîs of Bornu and the Ottoman Turks, 1576–78](https://www.cambridge.org/core/journals/international-journal-of-middle-east-studies/article/abs/mai-idris-of-bornu-and-the-ottoman-turks-157678/F5206F26778715286BE4CC3E15450D9A).
- P. M. Holt, *The Sudan of the Three Niles: The Funj Chronicle, 910–1288/1504–1871*, Brill, 1999; [UNESCO Sudanese Cultural Heritage Sites](https://sudan.un.org/sites/default/files/2019-10/180520_WH%20sites%20Final%20en_0.pdf).
- The pre-existing source group `lateDongola`, Polish Centre of Mediterranean Archaeology, University of Warsaw, supplies the settlement continuity.

## Egypt and al-Sham

**IDs:** `mamluk-late`, `early-ottoman-egypt-sham`, `cairo`.

The map separates the two conquest years: al-Sham changes in 1516 after Marj Dabiq; Egypt remains Mamluk in that snapshot and changes in 1517. After 1517 no independent Mamluk state remains. Cairo’s urban and scholarly life continues, as do influential Mamluk military households under Ottoman government.

The 1454 frame consciously preserves the earlier selected Mamluk outline, rather than shrinking it simply because the dataset crosses a release boundary. Coordination with the Eurasian module reserves Anatolian and Iraqi Ottoman expansion for that module and uses a common imperial colour.

Evidence: Metropolitan Museum of Art, [The Art of the Mamluk Period (1250–1517)](https://www.metmuseum.org/essays/the-art-of-the-mamluk-period-1250-1517); Ira M. Lapidus, *Islamic Societies to the Nineteenth Century*, [chapter 28](https://www.cambridge.org/core/books/abs/islamic-societies-to-the-nineteenth-century/libya-tunisia-algeria-and-morocco-from-the-thirteenth-to-the-nineteenth-centuries/BC566434A319CE7054B34432EE033507).

## Maghreb and Mediterranean strongholds

**IDs:** `marinid`, `early-fez`, `early-wattasid`, `early-saadi`, `zayyanid`, `early-algiers`, `hafsid`, `early-ottoman-tunis`, `early-tripoli`, `ceuta-late`, `marrakesh`, `kairouan`.

Marinid rule ends in 1465; local Fez rule bridges the interval to the Wattasids in 1472. Saadian stages distinguish the Sous movement, Marrakesh in 1524, Fez in 1549 and Ahmad al-Mansur after 1578. The short Wattasid restoration and Saadian recovery both occurred in 1554: the annual map retains the restored Saadian situation, while the text states both events. It does not invent a whole-year surviving Wattasid state.

The early Algiers profile distinguishes the Barbarossa brothers’ local power from Ottoman allegiance. Following McDougall, the allegiance phase begins in 1519, rather than treating every event in 1516 as completed Ottoman provincial annexation. The unstable 1519–1529 decade is mapped as influence; its text expressly mentions Khayr al-Din's temporary displacement. Finer annual Kuku/Algiers ownership is a resolution limit of this overview. Zayyanid Tlemcen ends in 1554. Oran is not claimed as an ordinary Ottoman district.

Tunis alternates: Ottoman 1534, restored Hafsids under Spanish protection from 1535, Ottoman 1569, restored Hafsids in 1573, definitive Ottoman conquest in 1574. No Hafsid polity persists after 1574. Tripoli separately changes from local rule to Spanish occupation in 1510, Hospitaller government in 1530 and Ottoman rule in 1551. These port occupations are not painted as conquest of all modern Libya. Ceuta retains Portuguese administration after the Iberian union of crowns.

Evidence:

- Jamil M. Abun-Nasr, [A History of the Maghrib in the Islamic Period](https://doi.org/10.1017/CBO9780511608100), Cambridge, 1987.
- Eloy Martín Corrales, *Muslims in Spain, 1492–1814*, chapter 3, Brill, 2021, [Library of Congress copy](https://tile.loc.gov/storage-services/master/gdc/gdcebookspublic/20/20/04/61/45/2020046145/2020046145.pdf).
- James McDougall, *A History of Algeria*, [chapter 1](https://doi.org/10.1017/9781139029230.003), Cambridge, 2017.
- Leïla Temime Blili, [The Regency of Tunis, 1535–1666](https://www.jstor.org/stable/j.ctv2ks6xjw), American University in Cairo Press, 2021; [Museum With No Frontiers timeline](https://islamicart.museumwnf.org/hcr_result.php?country=tn&end_date=1800&lng=en&start_date=1500).

## Ethiopia, Adal, Awsa and Oromo communities

**IDs:** `ethiopia`, `adal-late`, `early-awsa`, `early-oromo`, `lalibela`.

Adal’s pre-war region expands in 1529, with a wider military influence frame from 1531 to 1543. Christian royal power contracts and then re-expands after Wayna Daga. Overlapping military influence is intentional; neither side’s wartime outline is a surveyed administrative frontier. Adal’s broad state frame ends in 1577, followed by Awsa and the continued town of Harar. Lalibela continues as a religious centre.

Oromo communities do not appear from nowhere in 1522. The module provides a southern community region from the start of the new interval, then a wider cultural region for the later sixteenth-century movements. Mohammed Hassen’s reassessment of earlier presence is preferred over a single outward arrow claiming a universal migration route.

Evidence:

- ʿArab Faqih, *Futuh al-Habasha*, translated by Paul Lester Stenhouse with Richard Pankhurst’s annotations, Tsehai, 2003; Metropolitan Museum of Art, [African Christianity in Ethiopia](https://www.metmuseum.org/essays/african-christianity-in-ethiopia).
- Mohammed Hassen, [The Oromo and the Christian Kingdom of Ethiopia, 1300–1700](https://doi.org/10.1017/9781782045809), Boydell & Brewer, 2015, especially chapters 3–5.
- Nicholas M. T. Tait, *Archaeological Ceramics as Chronological Indicators on Islamic Sites in Eastern Ethiopia*, Exeter thesis, 2020, historical overview. [Repository PDF](https://ore.exeter.ac.uk/repository/bitstream/handle/10871/121775/TaitN_TPC.pdf?isAllowed=y&sequence=2). The indexed text gives the 1577 move; direct PDF retrieval was restricted during this pass. [UNESCO Harar](https://whc.unesco.org/en/list/1189/).

## Swahili coast, Congo, southern Africa and Madagascar

Kilwa is occupied in 1505 and its Portuguese garrison leaves in **1512**, not 1507. The Gulbenkian research catalogue gives the fort's seven-year occupation. The 1507 date is used for the Portuguese establishment on Mozambique Island. Mombasa is not represented as continuously occupied after the 1505 attack; the fortified Portuguese presence is strengthened with Fort Jesus beginning in 1593. Gedi remains inhabited through 1600; final abandonment is later.

Benin's 1486 contacts and sixteenth-century court remain the history of an independent African state. Kongo's 1491 baptism and Afonso's letters do not turn Kongo into a Portuguese colony. The text mentions the coercive and destabilising slave trade rather than equating all exchange with benign cultural contact.

Great Zimbabwe remains a smaller inhabited site, not its old empire. Parts of the site continued in use even after the political peak. Khami/Torwa and Mutapa continue as distinct regional powers. Madagascar's later highland outline represents fortified communities, not a prematurely unified island kingdom.

Evidence:

- Gulbenkian HPIP, [Fort, Kilwa Kisiwani](https://hpip.org/en/heritage/details/2009); [UNESCO Kilwa](https://whc.unesco.org/en/list/144/).
- [UNESCO Fort Jesus](https://whc.unesco.org/en/list/1295/), [Island of Mozambique](https://whc.unesco.org/en/list/599/), [Gedi nomination](https://whc.unesco.org/document/199048).
- Metropolitan Museum, [Seated Portuguese Figure](https://www.metmuseum.org/art/collection/search/316502); Cambridge Museum of Archaeology and Anthropology, [Kingdom of Benin](https://maa.cam.ac.uk/schools/resources/african-collections-schools-resources/kingdom-benin).
- [UNESCO/ICOMOS Kongo evaluation](https://whc.unesco.org/archive/2017/whc17-41com-inf8B1-en.pdf); Malyn Newitt (ed.), [Christianity in the Kongo](https://www.cambridge.org/core/books/abs/portuguese-in-west-africa-14151670/christianity-in-the-kongo/B4656F226EE7B26AAB67437D29B597E8), including translated Afonso correspondence.
- [UNESCO Great Zimbabwe](https://whc.unesco.org/en/list/364/), [Khami](https://whc.unesco.org/en/list/365/), [Thimlich Ohinga nomination's comparative discussion](https://whc.unesco.org/document/165555).
- Edward A. Alpers, [Ivory and Slaves in East Central Africa](https://www.ucpress.edu/books/ivory-and-slaves-in-east-central-africa/paper), originally 1975; [ICOMOS Ambohimanga evaluation](https://whc.unesco.org/document/1118).

These sources were consulted through available primary-document editions, scholarly excerpts, museum essays and heritage dossiers. This record does not claim a complete reading of every cited multi-volume history.

## Verification performed

- `node --check scripts/world/early-africa.cjs` passed.
- Isolated module execution with `{start:1454,max:1600}` passed.
- All 844 old displayed years, 610–1453: selected phase content, entry metadata, coordinates and territorial frames are unchanged (future phases excluded from the comparison).
- All 147 new years, 1454–1600: no overlapping area frame per entry and no area without an active profile.
- Every old African profile active in 1453 has a consciously authored continuation in 1454; later closures occur at their historical transition.
- All new phases have nonempty RU/EN/KY text, source references and all three learning fields. All polygons have finite coordinates; checked for degeneracy and self-intersection.
- Specific point tests passed: Timbuktu outside Gao's core in 1467 and inside in 1468; outside its former imperial frame in 1591; Cairo Mamluk in 1516 and Ottoman in 1517; Damascus Ottoman in 1516; Hafsid Tunis absent and Ottoman Tunis present in 1574; Kilwa's Portuguese colour present in 1505–1511 and absent from 1512.
- Event categories normalize to supported UI kinds: politics, war, diplomacy and culture.
- Global build and browser verification belong to the parent integration task. No deployment performed.
