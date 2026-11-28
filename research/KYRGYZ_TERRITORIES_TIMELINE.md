# Kyrgyz territories on the common atlas timeline

2026-11-28

This release applies a common presentation to existing reviewed Kyrgyz geography. It does not introduce new historical border claims or interpolate invented annual conquests.

## Evidence and periods

The catalog is compiled from the dated EMPIRES keyframes, WORLD_HISTORY phases and areas, KYRGYZ_FRONTIERS residence records, and ANCIENT_PREVIEW geographic references. Each displayed record retains its source titles and Russian, English and Kyrgyz text.

- Ancient Chinese attestations stay geographic reference points. They are not converted into a state polygon.
- The Yenisei core, ninth-century khaganate and its wider reconstructed military-political reach are separate types. The influence ring is not labelled sovereign territory.
- The early Yuan-period Yenisei geometry continues across 1299/1300. Sourced seventeenth-century uluses have dated residence areas.
- Muhammad Kyrgyz, later valleys and Pamir communities use the existing reviewed regional outlines. Marker-only Tian Shan phases remain markers rather than reviving rejected broad cultural polygons.
- Soviet autonomous and union-republic periods use dated administrative geography clipped to their contemporaneous parent. Independent Kyrgyzstan begins in 1991. Modern compact residence regions and diaspora markers remain available through the existing residence panel.

## Rendering

The main atlas year drives 67 records in 55 intervals. No separate timeline is introduced. Green fill marks domains or the state, lighter dashed areas mark residence, dash-dot outlines mark autonomy or a union republic, and gold hatching marks wider influence. The ninth-century map legend uses these same colors.

Category unions are clipped against already painted categories to prevent double fill. Source geography is preserved; only derived presentation geometry is clipped. Background world states, contemporary events, dated migration routes and city communities remain on the same map.

Territory selection moves only the camera. Previous/next territory controls change the common atlas year. The map uses a short opacity transition on a change of interval and respects reduced-motion preferences. Unchanged years reuse existing SVG paths. Sources are available in the selected territory card.

## Validation

`kyrgyz-territories-test.cjs` checks 1,427 years, geometry validity, intersections between presentation categories, dates, the 1299/1300 seam and earliest reference-only evidence. `kyrgyz-territories-ui-test.cjs` checks the common year, cached paths, navigation, three languages, layer toggles, future-mode exclusion and panel attachment. Both are required by `release-check.cjs`; existing release gates remain required.

This is a presentation and continuity release, not a declaration that every historical outline has exact modern survey precision.
