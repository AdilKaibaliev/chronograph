# Europe, 1601–1789: transition audit and cartographic decisions

Editorial record for `scripts/world/to1789-europe.cjs`, including the independent audit of the European supplement and its boundary coordination with `to1789-eurasia.cjs`. Reviewed 24 September 2026. This note records the checked transitions; it is not a claim that every European principality, campaign or temporary occupation has been reconstructed.

The module uses regional schematic cores and influence outlines. Polygon vertices are an editorial visual representation based on regional geography and the documented sequence of control, not digitised historical survey boundaries. Located city tests verify that the principal places change to the correct displayed authority. A passing point test does not make every point on the surrounding outline precise.

All new phases begin in or after 1601. Intervals are half-open: a phase ending in 1710 is last displayed in 1709; 1790 includes 1789. No data from 610–1600 were edited by this audit. Older geometries used as a starting point are cloned before revision.

## Central Europe and the Ottoman frontier

- **Buda, 1686:** the Buda/Budapest point `[19.04,47.5]` changes from the Ottoman layer to the Habsburg Hungarian layer in 1686. The following 1699 phase describes the Treaty of Karlowitz as confirmation of the principal conquests. The text explicitly keeps the Banat acquisition in 1718; it is not described as a 1699 acquisition. The territorial shape is a central Hungarian core, not the precise front line of every year of the war.
- **Morea, 1687–1715:** the Peloponnesian regional core changes to Venice in 1687 and returns to the Ottoman layer in 1715. The selected check point is `[22.4,37.5]`. The 1687 boundary represents the major campaign and regional change; it does not claim that every fortress surrendered on the same date. Karlowitz in 1699 is a diplomatic confirmation, not the beginning of Venetian occupation.
- **Transylvania, 1691:** the Diploma Leopoldinum supplies the administrative threshold. The phase retains the region’s distinct institutions while using the Habsburg colour. This is not presented as the abolition of Transylvania’s identity.
- **Silesia, 1742:** most of Silesia passes from Austria to Prussia. Wrocław `[17.04,51.10]` was originally also covered by a reused Commonwealth polygon; the audit removed that erroneous Polish overlap. It now belongs only to the Austrian layer in 1741 and only to Prussia in 1742. The outline represents the major transferred region, not every surviving Austrian Silesian enclave.

## Brandenburg–Prussia and the Commonwealth

- **1601–1617:** the Prussian profile displays only the Brandenburg core and is labelled Brandenburg.
- **1618–1700:** separate Brandenburg and Prussian duchy cores share a dynastic profile. The text retains the duchy’s Polish suzerainty until the 1657 treaties; a shared colour is not a claim of complete sovereign independence before then.
- **1701:** the profile receives its royal-period label. Silesia is added in 1742, West Prussia in 1772.
- **1667:** the Commonwealth’s eastern outline is reduced after Andrusovo. The phase distinguishes loss of Smolensk and the Dnieper left bank from the continuing existence of the Commonwealth.
- **1772:** the first partition changes the regional layers without abolishing the Commonwealth. Gdańsk `[18.65,54.35]` and Toruń `[18.60,53.01]` remain outside the Prussian layer. Lviv `[24.03,49.84]` passes to Habsburg Galicia. Kraków `[19.94,50.06]` remains Polish; a small urban core prevents its disappearance between the schematic Galician and Polish edges.
- **Latgale:** a separate regional polygon retains Daugavpils/Dvinsk and Rēzekne in the Commonwealth before 1772 and joins the Russian first-partition regional profile thereafter. Latgale must not be included in Russia’s 1721 acquisition of Swedish Livonia. This correction was coordinated with the author of the Russian Baltic layer.

The first-partition Russian profile is labelled “Eastern Belarus and Latgale · Russian Empire”. It describes acquired regions within the empire, not a separate sovereign state.

## Scandinavia, the Baltic and Finland

- **Tallinn/Reval:** northern Estonia was already under Swedish rule from 1561. The previous schematic Baltic outline omitted Tallinn even during the later Swedish period. The corrected northern Estonian core includes `[24.75,59.44]` from the new interval’s start in 1601.
- **Ingria, 1617:** a new Swedish phase starts with Stolbovo. This is separate from the earlier Estonian possession. Russia’s corresponding outline is coordinated in the Eurasian module.
- **Riga, 1621:** Riga `[24.105,56.95]` remains in the Commonwealth until its capture by Sweden in 1621. A small captured-city core is used for 1621–1628. The broader Livonian phase begins in 1629 with Altmark. The earlier implementation incorrectly delayed any Swedish Riga until 1629.
- **Latgale after Altmark:** it remains Polish-Lithuanian. The Swedish Livonian outline is kept north of the main Latgalian centres, rather than treating all modern Latvia as one transferred province.
- **Scania, 1658:** Malmö `[13.00,55.60]` changes from Denmark–Norway to Sweden under Roskilde. Copenhagen `[12.568,55.676]` remains Danish. The Danish island polygon was checked separately from Scania so that the strait does not create a spurious Swedish Copenhagen.
- **Neva mouth, 1703:** the Swedish Ingria outline is reduced around the mouth of the Neva when Russia takes the area and establishes Saint Petersburg. The phase does not anticipate the later treaty as the date of first Russian settlement.
- **Riga, Reval and Vyborg, 1710:** the Swedish profiles relinquish these centres after their capture. Russian occupation is coordinated in the Eurasian module. **1721** is retained as the Treaty of Nystad confirmation, not the beginning of their military occupation.
- **Southeastern Finland, 1743:** a further Swedish polygon change follows the Treaty of Åbo/Turku. Hamina/Fredrikshamn `[27.20,60.57]`, Lappeenranta/Villmanstrand `[28.19,61.06]` and Savonlinna/Nyslott `[28.88,61.87]` are excluded from the later Swedish core, with the corresponding acquisition assigned to the Russian module. The remaining Finnish lands are not prematurely made Russian.

The map distinguishes the principal durable transitions from the full course of wartime occupation. In particular, the regional Finnish representation is not a campaign map of all temporary occupations during 1713–1721 or 1741–1743.

## Italy and labels

The root-authored supplement distinguishes Spanish Naples to 1707, the Austrian viceroyalty in 1707–1734, and Bourbon rule from 1734. Tuscany’s eighteenth-century succession is treated separately from the general Austrian core. Venice remains a distinct republic throughout the represented interval, with the dated Morean addition and loss.

Area labels now use the state or regional name. Phrases such as “After the first partition”, “Annexation of Galicia” and “After the loss of Scania” remain phase headings; they are no longer printed as names of territories on the map. Brandenburg/Brandenburg–Prussia/Kingdom of Prussia receive their appropriate period labels.

## Bibliography and editorial URLs

The three root-supplied institutional source groups are retained in `to1789EuropeTransitions`:

1. German Historical Institute, *German History in Documents and Images*: [The Partitions of Poland, 1772–1795](https://germanhistorydocs.org/en/the-holy-roman-empire-1648-1815/the-partitions-of-poland-1772-1795). This is used with the Deutsches Historisches Museum’s [Die Teilung Polens](https://www.dhm.de/archiv/ausstellungen/deutsche-polen/die_teilung_polens.html), retained in `to1789Poland`.
2. *Die Welt der Habsburger*: [The War of Austrian Succession](https://www.habsburger.net/en/chapter/war-austrian-succession), [Tuscany as a Habsburg secundogeniture](https://www.habsburger.net/en/chapter/tuscany-habsburg-secundogeniture), and [The Battle for the Spanish Inheritance](https://www.habsburger.net/en/chapter/battle-spanish-inheritance). These support the Silesian and Italian dynastic transitions.
3. Consiglio Nazionale delle Ricerche, *RiMe*: [Naples during the Austrian viceroyalty, 1707–1734](https://rime.cnr.it/index.php/rime/article/view/175).

The independent Baltic audit adds `to1789BalticAudit`:

- Latvian Ministry of Foreign Affairs, [History of Polish-Latvian Relations](https://www2.mfa.gov.lv/en/poland/embassy-of-latvia/history-of-polish-latvian-relations): Riga captured in 1621; Altmark in 1629; Latgale retained by the Commonwealth.
- *Ajalooline Ajakiri: The Estonian Historical Journal*, University of Tartu, [The capitulation of Tallinn and the Harju-Viru knighthood to Sweden in 1561](https://ojs.utlib.ee/index.php/EAA/article/view/AA.2017.1.02).
- National Archives of Estonia, *Tuna*, [Tallinn’s military obligations and Swedish garrison](https://tuna.ra.ee/tallinna-sojalised-kohustused-ja-rootsi-garnison-16-sajandi-lopul-ja-17-sajandi-esimesel-kolmandikul-lk-9-36/).
- National Archives of Finland, [Vanha Suomi](https://portti.kansallisarkisto.fi/arkistojen-portti/vanha-suomi): the 1721 and 1743 acquisitions and the institutions of Hamina, Lappeenranta and Savonlinna.
- Lund University Library, [De la Gardie archive guide](https://www.alvin-portal.org/alvin/attachment/document/alvin-record%3A80347/ATTACHMENT-0002.pdf): Stolbovo and the Ingria/Kexholm archival context.

Supporting root/Eurasia source groups:

- Hungarian Research Centre for the Humanities, [Buda Castle after 1686](https://budavar.abtk.hu/en/the-history-of-the-site/the-history-of-buda-castle-after-1686.html?showall=); C. A. Macartney, [Hungary: A Short History](https://mek.oszk.hu/02000/02086/02086.htm).
- Marika Sardar, Metropolitan Museum of Art, [The Greater Ottoman Empire, 1600–1800](https://www.metmuseum.org/zh/essays/the-greater-ottoman-empire-1600-1800); TDV İslâm Ansiklopedisi, [Karlofça](https://islamansiklopedisi.org.tr/karlofca).
- National Museum of Denmark, [Frederik III](https://natmus.dk/historisk-viden/temaer/kongeraekken/frederik-3/) and [the Swedish wars](https://natmus.dk/historisk-viden/danmark/renaessance-1536-1660/stormen-paa-koebenhavn-og-ahlefeldts-partisan/).
- [Treaty of Nystad, 1721, historical document collection](https://docs.historyrussia.org/ru/nodes/335720-nishtadtskiy-mirnyy-dogovor-mezhdu-rossiey-i-shvetsiey-30-avgusta-1721-g); Saint Petersburg Institute of History, [300 years of the Treaty of Nystad](https://spbiiran.ru/300-let-nishtadtskomu-miru/).

The bibliography shown to visitors contains titles, not direct links. The URLs above are retained for editorial verification.

## Checks performed

- The final audited European module contains 13 profiles and 41 new phases; syntax validation passed.
- All displayed centres in those phases were checked against their own polygons; none was outside.
- New polygon rings were checked for proper self-crossing edges; none was found.
- Explicit before/after point tests passed for Buda 1685/1686; Morea 1686/1687/1714/1715; Wrocław 1741/1742; Gdańsk, Toruń, Lviv and Kraków 1771/1772; Copenhagen and Malmö 1657/1658; Riga 1601/1621/1629; and Tallinn 1601/1629.
- The Swedish removal of the Baltic centres in 1710 and southeastern Finnish centres in 1743 was checked locally. The reciprocal Russian polygons were handed to the Eurasian module author and are part of the root task’s integrated tests; the local European check alone was not presented as proof of those separately edited polygons.
- No deployment was performed by this audit.
