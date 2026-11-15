# Continuity across 609–610 CE

Reviewed 15 November 2026. The year 610 is the start of the original Islamic-history interface, not a worldwide foundation date for states.

## Presentation

The map retains its physical height, camera and common colour/label rules. The Kyrgyz-history footer remains in the layout before 610. Supplemental fills are placed below map labels. Both types of territories support selection, layer visibility, opacity and pointer dragging. Undated prophetic geography remains separate from dated political claims.

## Territorial evidence

The 22 territorial entries visible in 609 persist across the boundary. Nine common states use the existing reviewed 610 cartography in their final pre-610 source intervals. Makuria and Alwa use the corresponding reviewed world entries. Eleven previously lost societies continue through their available Cliopatria intervals, retaining the distinction between kingdoms and groups of urban polities. Later source names for Unified Silla, divided Chenla and later Maya centres are carried forward; no single Maya or Chenla empire is implied.

The Roman–Persian eastern theatre and Sui's western theatre retain the earlier reconstruction until the relevant 609 change. Stable surrounding outlines use a common reference. These are period reconstructions, not surveyed annual front lines. The transition test checks city control and geometry rather than claiming identical detail for the entire world catalogue. More local states and sites are catalogued in the original post-610 interface.

### Dated checks

- James Howard-Johnston, **Ḵosrow II**, Encyclopaedia Iranica: Dara was taken in 604, Theodosiopolis in 608 and Edessa in 609; Jerusalem fell in 614, and the Egyptian occupation belongs to 619–629. Thus Edessa, Dara and Theodosiopolis stay on the Persian side at both 609 and 610; Jerusalem and Alexandria remain Roman. [Research edition](https://www.iranicaonline.org/articles/khosrow-ii/).
- Yu Taishan, **The Sui Dynasty and the Western Regions**, Sino-Platonic Papers 247 (2014), pp. 1–2, discussing the **Suishu**: the campaign against Tuyuhun and establishment of four western commanderies belong to 609. This does not establish control over the whole Tibetan Plateau. [Research edition](https://sino-platonic.org/complete/spp247_sui_dynasty_western_regions.pdf).
- University of Warsaw, **Virtual Nubia**: Nobadia, Makuria and Alwa preceded 610. Union of Nobadia with Makuria is placed in the seventh century, probably its latter part; the atlas's source-frame limits must not be interpreted as an independently established exact annexation date. [Archaeological project](https://virtualnubia.uw.edu.pl/krolestwa-nubijskie).
- **Cliopatria v0.2.1**, polity dataset, with its existing attribution and license: `research/ancient-continuity.json.gz` records original source intervals and upstream SHA-256. Rebuild using `node scripts/ancient/build-continuity.cjs <reviewed-GeoJSON>`.

Overlapping coarse regional groupings are masked beneath named local polities. Where the Avar, Goguryeo or Nobadia reconstructions disagree with neighbouring reconstructions, a neutral selectable band explains the cartographic mismatch. This is not a claim of a historical dispute or a newly created state. Existing reviewed frontier symbols are retained. Further source-based frontier refinement remains possible; the release does not claim every ancient boundary is exact.

## Verification

`scripts/ancient/continuity-test.cjs` is part of the publication gate. It checks the 22 cross-boundary entities, generated-data consistency, nonempty valid coordinates, single active record per entity, intersections between supplemental states, Korean successor intervals and the dated city controls above. Desktop/mobile browser checks cover forward/back navigation, three languages, layer controls, card selection and unchanged camera/map dimensions.
