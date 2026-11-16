# Steppe contours and common cartographic styling — 2026-11-16

## Scope

The displayed Western/Eastern Turkic, Türgesh, Karluk and Qarakhanid outlines
formerly included continental segments with only 7–11 vertices. These are
replaced by dated reference or regional geometries before the existing shared
frontier rules run. The Kyrgyz heartland and ninth-century reach retain the
previously reviewed source reconstruction. Avar and first Turkic geometries in
the ancient catalogue already use detailed dated source polygons.

This review is not a claim that every frontier in every year is known precisely.
No spline, random coastline detail, interpolation between conquests, modern
international border, or province-by-proximity rule is used to invent history.

## Sources and editorial decisions

- Yuri Bregel, *An Historical Atlas of Central Asia* (Brill, 2003), maps 7–14
  and their facing explanations. Examined maps 7, 9, 10, 11 and 14 directly.
  Regional coverage and named places inform an independent reconstruction;
  the printed map artwork is not copied into the product.
- Peter B. Golden, *An Introduction to the History of the Turkic Peoples*.
- E. A. Davidovich, “The Karakhanids”, *History of Civilizations of Central Asia*,
  volume IV, part 1; Encyclopaedia Iranica, “Qarakhanid”.
- Bennett et al., *Cliopatria*, v0.2.1, CC BY 4.0,
  https://doi.org/10.5281/zenodo.13363121. The two selected early-seventh-century
  source features and source SHA-256 are retained in `turkic-contours.json`.

The Western/Eastern Turkic reference footprints are regional outlines, not a
claim to yearly surveyed borders. Existing Altai partition, Sasanian Khorasan,
Chinese acquisitions, local dependencies and 657 transition still take priority.
The Yenisei–Sayan population context before 648 can overlap Turkic hegemony:
it is not a separate sovereign fill and must not carve a hole in the latter.
From the existing 648 political phase, the separately filled Kyrgyz region
takes precedence over the Western Turkic reference envelope. The reviewed
Kyrgyz core and ninth-century reach are retained unchanged.
The early reference is not extended to a later successor dynasty.

Türgesh geometry distinguishes Semirechye and Dzungaria from expeditions to
Samarkand, the Oxus and the Tarim. Karluk geometry centres on Semirechye; the
existing 893 Taraz transfer remains a shared frontier. Qarakhanid geometry
includes Kashgar from the initial atlas frame, Transoxiana from 999 and Khotan
from 1006. It does not annex Turfan or the Altai. The political division of the
Qarakhanids is not redefined by this geometric revision.

Rejected direct imports: Cliopatria labels several 692–749 eastern-steppe
features “Türgesh”; its early Qarakhanid polygons omit Kashgar; some source
snapshot dates lag conquests. UC Merced's aligned derivative was examined as a
potential source but remains a development dataset and is not imported.

## Global rendering

Ancient, medieval and later state borders use the same restrained line weight;
selected states remain emphasised. Projected SVG coordinate precision is aligned
across both timeline engines, reducing zoomed edge quantisation. Source polygon
vertices, holes, islands and the dates of unrelated states are unchanged.

## Verification

`steppe-contours-test.cjs` checks named cities before/after dated acquisitions,
the non-overlapping east/west Turkic boundary and unchanged Kyrgyz/Mongol extents.
The standard release suite additionally checks every worldwide display frame,
yearly ownership, holes, coastline clipping and the 609/610 and 1299/1300 joins.
Visual review and publication results are recorded in the release report.
