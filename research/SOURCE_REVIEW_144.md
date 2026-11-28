# Historical boundary and chronology review — 28 November 2026

This review changes six existing profiles. It does not certify every frontier in the atlas as a surveyed historical boundary.

## Confirmed corrections

| Place / date | Evidence | Applied correction |
|---|---|---|
| Vitebsk, 1710–1771 | I. P. Shamyakin (ed.), *Vitebsk: Encyclopaedic Reference* (1988); S. Yu. Zhitenev, *History of Russian Orthodox Pilgrimage in the 10th–17th Centuries*, p. 137; Presidential Library, Andrusovo | Remove the Russian duplicate inside the already mapped Commonwealth region around Vitebsk. The 1708 campaign is not an annexation. The 1772 Russian transfer is preserved, as are Smolensk, Riga and the separately researched Kyiv enclave. |
| Kirkuk, 1625–1629 | Ahmet Gündüz, “Kerkük”, TDV İslâm Ansiklopedisi | Continue the existing 1624 Safavid city-and-approaches envelope until the Ottoman recovery in 1630. Mosul's 1625 recovery and Baghdad's 1638 recovery remain separate. Add a trilingual 1630 event at Kirkuk. |
| Erbil, 1638 | Sâmî es-Sakkâr, “Erbil”, citing the 1638 Ottoman campaign journal, ed. Halil Sahillioğlu (1965), p. 25 | Remove the Safavid duplicate from the existing Erbil regional envelope for 1638. Do not extrapolate the journal's evidence to earlier contested campaign years. |
| Safavid chronology, 1638/1639 | Rhoads Murphey, “Kasrışîrin Antlaşması”, citing Naîmâ III, 420–429 and Feridun Bey II, 217–219 | Split the former 1638–1722 phase. The 1638 card describes the fall of Baghdad; the treaty card starts in 1639 and gives 17 May. Apply the same text to map areas, outlines and all three languages. |
| Santa Ana and Chalatenango, 1838–1945 | Salvadoran Constitution of 12 June 1824, Articles 4 and 6; municipal archive description of Santa Ana; University of El Salvador historical account of Chalatenango | Remove Guatemalan / Honduran duplicate fills only inside the attested Salvadoran town interiors. Preserve the federal period and disputed international-border sectors. |

## Source access

- [Zhitenev, p. 137, Russian Heritage Institute](https://heritage-institute.ru/wp-content/uploads/2016/07/zhitenyov-s.yu.-istoriya-russkogo-pravoslavnogo-palomnichestva-v-x-xvii-vekah.pdf).
- [Presidential Library: Andrusovo](https://www.prlib.ru/history/619017).
- [Gündüz: Kerkük](https://islamansiklopedisi.org.tr/kerkuk).
- [Es-Sakkâr: Erbil](https://islamansiklopedisi.org.tr/erbil).
- [Murphey: Kasrışîrin Antlaşması](https://islamansiklopedisi.org.tr/kasrisirin-antlasmasi).
- [1824 constitution, documentary transcription](https://www.cervantesvirtual.com/portales/constituciones_hispanoamericanas/obra-visor/constitucion-politica-de-la-republica-de-el-salvador-de-1824/html/9215c899-4b99-40cf-8960-f18fb644c894_2.html).
- [Santa Ana municipal archive description](https://censoarchivos.cultura.gob.es/CensoGuia/imprimirDetalleArchivo.htm?id=49191): indexed description consulted; direct fetch subsequently rate-limited. Santa Ana's 1824 city status is also documented in the [Salvadoran Ministry of Education's teaching material](https://www.mined.gob.sv/nawat/modulos/taksalis_5/Amatzin%205.pdf).
- [University of El Salvador: historical section on Chalatenango](https://repositorio.ues.edu.sv/bitstreams/eeb2b0f8-a36f-4cd7-bacd-c2fddad9912e/download).

No long quotations were added. Public cards display bibliography titles; research URLs remain provenance metadata.

## Geometry and limits

The Vitebsk correction reuses the Commonwealth's existing edge within 28–32° E, 54.5–55.9° N. It does not introduce a modern Belarusian border. Kirkuk and Erbil reuse the atlas's existing regional envelopes. The Salvadoran changes are deliberately restricted to town interiors: they are not a retroactive application of the 1992 ICJ boundary judgment to 1838. Exact rural boundaries need historical maps and arbitration records before wider correction.

Open research includes Nevel/Velizh/Sebezh around the 1667 and 1678 settlements, Erbil during the earlier campaigns, and the wider nineteenth-century Central American frontier. These are not automatically resolved by drawing priority. Raw overlap candidates include claims and dependencies, so their count is not a count of proven errors.

## Verification design

`source-review-144-test.cjs` first fails against the previous publication on Russian ownership at Vitebsk in 1710. It then checks annual city ownership, unaffected controls (Smolensk, Kyiv, Riga), Kirkuk/Mosul/Baghdad's distinct dates, Salvadoran interiors, trilingual phase boundaries and the event. Existing release tests continue checking the complete catalogue, all annual visible-territory intersections, temporal transitions, ancient geometry, multilingual rendering and public packaging.

The original-catalogue guards allow only the six documented Safavid phase fields within 1638–1721 and the matching area text/title. All unrelated original data remains guarded. Release and public verification results are recorded outside the source tree in `outputs/source-review-144`.
