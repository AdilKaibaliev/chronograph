# Anatolian frontier review — 1.26.0

Reviewed on 27 October 2026. This release corrects three specific defects; it does not certify every historical boundary in the atlas.

- The inherited Great Seljuk triangle reached Ankara and the Black Sea coast. Its western Anatolian extension is removed while eastern acquisitions and the existing Iranian, Mesopotamian and Syrian reconstruction are retained. The Roman outline shares the resulting eastern edge. The battle of Manzikert is not represented as an immediate annexation of the whole peninsula.
- The Latin and Nicaean states now use one regional Asian extent and dated, complementary boundaries. The 1214 frame reaches Adramyttion; 1225 retains the Nicomedian coastal area; the Asian Latin extent ends in 1235. Constantinople stays Latin until the succession in 1261. The initial 1204 frame summarizes the first winter's campaign, rather than claiming a day-by-day front.
- The final Rum frame no longer revives western holdings lost in 1097. Its 1299 geometry inherits the last reviewed dependent-state extent and retains its Mongol relationship.

## Research

- Andrew Peacock, **Saljuqs III: Saljuqs of Rum**, Encyclopaedia Iranica: [article](https://www.iranicaonline.org/articles/saljuqs/saljuqs-iii/).
- David Durand-Guédy, **Malekšāh**, Encyclopaedia Iranica: [article](https://www.iranicaonline.org/articles/maleksah/).
- Carole Hillenbrand, **Turkish Myth and Muslim Symbol: The Battle of Manzikert**, Edinburgh University Press, 2007: [book record](https://www.jstor.org/stable/10.3366/j.ctt1r2bzf).
- Foundation of the Hellenic World, **The Latin Empire of Constantinople (1204–1261)**: [historical chronology](https://www.ime.gr/chronos/projects/fragokratia/en/webpages/konst_gen.html).
- Foundation of the Hellenic World, **Politics in the Late Byzantine Period: Expansion of the Borders**: [treaty geography](https://www.ime.gr/CHRONOS/10/en/p/pa2/pa2b.html).
- Ahmet Güneş, **İznik**, TDV İslâm Ansiklopedisi: [article](https://islamansiklopedisi.org.tr/iznik).

The website displays bibliographic titles without external source links, as requested. Research links are retained here for maintenance. Narratives are available in Russian, English and Kyrgyz.

## Precision and remaining work

The coordinates are an atlas-scale reconstruction anchored to cities and regional descriptions, not digitized treaty surveys. Local Turkish principalities, changes in Syrian lordship, Nicaean acquisitions in the Balkans and every campaign in 1204–1214 require further reconstruction. The two city headlands at Constantinople and Chalcedon are partly omitted by the generalized land mask; tests require the exact city in the source polygon and rendered land within 3 km. This exception does not apply to inland frontier controls.

## Verification

`scripts/world/anatolian-review-test.cjs` checks 37 independent settlement expectations, 28 distinct shared-edge combinations, the 1298/1299 endpoint and all three languages. The existing early-frontier test checks 238 edge combinations and 38 controls. Full regression and browser results are saved in `verification-126-release.txt` and `verification-126-browser.json`. Diagnostic overlap counts are not counts of adjudicated historical errors.
