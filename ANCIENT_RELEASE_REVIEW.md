# Ancient-world overview, 7000 BCE–610 CE

Prepared 14 November 2026. This release adds a selected source-based overview to the existing 610–2026 atlas. It does not claim complete global political coverage or surveyed ancient frontiers.

## Content and calendar

90 three-language records: prehistoric societies and sites, ancient cities and states, six environmental records, five reviewed Kyrgyz source/context cards, and twelve unchanged early phases of the existing world catalogue. Signed historical years have no year zero. The year form, URL, slider, labels and playback cross directly between 1 BCE and 1 CE. Playback stops at both content and territorial change dates.

The early Kyrgyz cards distinguish the Gegun notice in Shiji 110, Jiankun and Zhizhi in Hanshu 94B, the Weilue passage transmitted in Sanguozhi 30, Qigu under Muqan in Zhou shu 50, and Tashtyk archaeological context. Composition dates, approximate event dates and ethnic attribution are separate. No unsupported pre-610 migration route or Kyrgyz state polygon is drawn. See KYRGYZ_PRE610_REVIEW.md and research/kyrgyz-pre610.json.

## Territorial reconstruction

72 selected entities and 681 dated geometry records from Cliopatria v0.2.1 (Seshat Global History Databank; Bennett et al., Scientific Data 12, 247, 2025; DOI 10.1038/s41597-025-04516-9). Derivative data are attributed under CC BY 4.0 in the interface. research/ancient-boundaries.json.gz contains JSON only; scripts/ancient/load-boundaries.cjs decompresses it during build.

Reproduction: node scripts/ancient/build-boundaries.cjs PATH_TO_cliopatria_polities_only_v021.geojson. The upstream file hash is preserved in the dataset. The upstream archive is not copied into this repository.

Corrections include Cyprus in 58/48/30 BCE; Vandal raids in Rome and Campania excluded from sovereign territory; Babylon in 539 BCE; Persian, Macedonian, Ptolemaic and Roman transitions in Egypt; and the Roman imperial title from 27 BCE. Frankish regional areas share an aggregate plural label. Small digitisation overlaps become neutral boundary bands; they are not arbitrarily awarded to one state. Larger unresolved overlap causes generation to fail.

The geometric audit covers 405 change frames and 763 candidate pairs, with no invalid geometry or remaining intersecting state fills above its tolerance. That is a technical property, not proof of exact historical boundaries. The original resolution is coarse. It does not resolve shorelines at Constantinople or every Central Asian dependency. An anachronistic upstream Western Regions protectorate at 600 and a misleading Great Yuan/Dayuan label were not imported. Early Kyrgyz polygons were excluded.

## Physical geography

Doggerland inundation, Lake Mega-Chad high and low phases, Sutlej/Ghaggar channel history, and the former Ahramat branch of the Nile are dated environmental annotations. Their small blue rings locate the subject; they do not depict its geographic extent. The base coastline remains modern, explicitly stated in the legend. Complete time-varying coastline and river/lake polygons are not part of this release. Sources are held in scripts/ancient/neolithic.cjs; source names appear in the interface.

## Continuity and validation

Before 610, the ancient renderer hides later territorial layers. From 610, the existing renderer and historical data remain in control. Twelve inherited early phase cards retain their text, coordinates and intervals. The 609/610 switch is tested in three languages; its independently sourced geometries have different resolution, so identical outlines are not claimed. The older 17-entity start-at-610 inventory is not evidence that those entities were founded in 610.

Required checks: scripts/ancient/test.cjs (calendar, content, references, inherited phases and playback stops), scripts/ancient/boundary-test.cjs (geometry and dated ownership), the existing full release-check.cjs, and SEO asset/data round-trip. Browser checks cover three languages, 7000 BCE, 539 BCE, 1 BCE/CE, 609/610, modern 2026, Kyrgyz cards, environmental filters, future/history mode and narrow-screen controls. A static ancient guide is generated in each atlas language and included in the sitemap.

Publication must be confirmed by the actual Vercel Ready deployment and live asset hashes; local readiness is not a publication receipt.
