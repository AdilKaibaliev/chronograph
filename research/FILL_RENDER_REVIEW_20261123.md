# Dated fill rendering review, 23 November 2026

The published catalogue contains provincial polygons and dated ownership relations
that are not always included in their sovereign's aggregate outline. The renderer
previously hid every non-selected province. This removed, for example, Algeria,
Mali and Chad under French rule and Angola and Mozambique under Portuguese rule
in the 1950 map, despite their existing dated records and citations.

`province-gaps.cjs` compares every active province/parent geometry pair for every
year from 610 through 2026, using Clipper independently of the polygon-clipping
engine used to compile the display outlines. It stores only references to the
existing records; it does not move boundaries, add ownership claims, or change dates.

The renderer restores those records only outside existing sovereign fills and
previously identified uncertain boundaries. Provinces with the same owner share
one opacity group so overlapping records cannot darken a region. Conflicting
provincial reconstructions of different owners remain neutral and open both
profiles. Independence ends the inherited fill through the same dated relations.

Other fixes: observe route/place layer switches immediately; distinguish a route
tap from map dragging; avoid measuring all SVG labels when there are no local
Kyrgyz markers; preload runtime scripts without executing before data hydration;
use AbortController deadlines, including body reads and JSON fallback, without
requiring AbortSignal.timeout.

Validation includes dated render coverage, ownership transitions and route
interaction tests, complete coordinate inventory, regional offline map sheets,
the release checks, and published asset verification. Offline renders and VM
tests are not screenshots or performance timings from a live browser. The Windows
browser tool refused URL-policy enforcement during this review; final live
visual/mobile verification remains outstanding. This review is not a certification
of every historical boundary or of every profile's source coverage.
