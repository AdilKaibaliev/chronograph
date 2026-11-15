# Dated coasts and ice on the common timeline

This addition keeps the existing -350000–2026 historical timeline. It introduces a dated physical-geography reconstruction, not a second chronology or new political borders.

## Scientific data

Gowan, E. J. (2019, updated 19 April 2021). *Global ice sheet reconstruction for the past 80000 years*. PaleoMIST 1.0. PANGAEA. DOI [10.1594/PANGAEA.905800](https://doi.pangaea.de/10.1594/PANGAEA.905800), CC BY 4.0. Related article: Gowan et al., *Nature Communications* 12, 1199 (2021), DOI 10.1038/s41467-021-21469-w.

The downloaded source is `global_grid/reconstruction_0.25_degree.nc` from the original PANGAEA ZIP. Its SHA256 is recorded in the generated manifest. The author's April 2021 corrections to Alaska and earlier Antarctic grid corrections are included. The standard/minimal MIS 3 North America scenario is used; this is one published reconstruction, not a unique observed coastline.

The grid includes 33 frames at 2500-year spacing, from 80000 BP through 0 BP, on a 0.25° latitude/longitude grid. BP is measured from 1950, not from today's date. The calendar adapter observes the absence of year zero. For example, the 20000 BP model timestamp converts to historical year 18051 BCE. Dates and model resolution are explained in the interface; the coordinates do not assert annual accuracy.

## Transformation and limits

`scripts/ancient/paleogeography/build.py` extracts the zero-metre contour of the published paleotopography, including the author's regional relative sea-level and crustal-deformation model. Connected ocean basins are distinguished from isolated negative-elevation depressions. The latter retain the source's 0 BP reference, rather than being arbitrarily flooded by an ocean-level change. River courses and inland lake levels are not reconstructed by this product.

The grounded-ice mask uses the 10 m thickness contour to remove numerical edge noise. It does not represent seasonal snow, sea ice, or a complete inventory of mountain glaciers. Exposed shelf means ice-free model land outside the 0 BP reference. Outline simplification uses 0.035° tolerance; topology-preserving 0.0001° coordinate quantization prevents rounding from introducing self-intersections. Polygons below 0.008 square degrees are omitted from the display product. These are cartographic processing tolerances, not statements of historical accuracy.

The browser displays the nearest dated frame, explicitly labels its age, and does not interpolate annual coastlines. All 33 frames, from 80000 to 0 BP, are now available; the former artificial cutoff at 2500 BP is removed. After 1950 the last frame is explicitly labelled as a 1950 reference, not a present-day glacier survey. Before 80000 BP the map visibly states that the selected period has no reconstruction and uses a modern geographic base. No older ice sheet is extrapolated. The common map's southern latitude limit is preserved; Antarctica has a same-year polar inset in its regional card.

The persistent on-map legend explains green as exposed land now under the sea and white as grounded ice sheets. An ice overlay above political fills, below labels and with pointer events disabled, prevents state colours from hiding the ice sheets. Disabling the reconstruction or opening future/undated textual-place modes removes both the overlay and its colour key.

## Early Kyrgyz geographic references, 16 November 2026

The ca. 201 BCE Gekun source card now locates the Yenisei–Abakan and Khyargas Nuur geographic references named in the Kyrgyz section of *中国少数民族*, as republished by China's State Ethnic Affairs Commission (https://www.neac.gov.cn/seac/ztzl/kekzz/lsyg.shtml). Hollow dashed symbols locate named regions, not capitals, exact state boundaries or simultaneous surveyed settlements. The Shiji passage itself supplies only a northern campaign direction; the secondary geographic interpretation is explicitly separated from it. The mid-sixth-century Qigu card similarly locates the Yenisei–Abakan region with attribution to the existing Savinov source. Neither entry receives a political polygon or an invented migration route, and their original source-date windows remain unchanged.

## Educational interpretation

Eight regions explain Beringia, Doggerland, Sunda, Sahul, North American ice sheets, northern European ice sheets, Patagonia and Antarctica. Related archaeological evidence opens on the same timeline. Evidence locations are not connected by invented migration arrows. Wallacea remains a maritime crossing between Sunda and Sahul.

Independent contextual sources:

- Jakobsson et al. (2017), *Post-glacial flooding of the Bering Land Bridge dated to 11 cal ka BP based on new geophysical and sediment records*, *Climate of the Past* 13, 991–1005. https://cp.copernicus.org/articles/13/991/2017/
- Farmer et al. (2023), *The Bering Strait was flooded 10,000 years before the Last Glacial Maximum*, *PNAS* 120, e2206742119. https://doi.org/10.1073/pnas.2206742119
- Bird et al. (2019), *Early human settlement of Sahul was not an accident*, *Scientific Reports* 9, 8220. https://doi.org/10.1038/s41598-019-42946-9
- Allaby et al. (2026), *Early colonization before inundation consistent with northern glacial refugia in Southern Doggerland revealed by sedimentary ancient DNA*, *PNAS*, e2508402123. https://doi.org/10.1073/pnas.2508402123

Sediment-derived local flooding dates and global-model time slices are different evidence types. In particular, the Bering Strait's approximately 11000 BP inundation date is not an exact threshold computed from the coarse model grid. The interface keeps the explanatory evidence and the dated model frame distinct.

## Verification

- Every historical year round-trips through the BP conversion; older-than-source years are unavailable and post-1950 years are explicitly marked as reference use.
- All source frames have closed, bounded rings; antimeridian edges are checked, allowing only the legitimate polar closure.
- Independent geographic controls check Beringia, the Torres and Bass straits, Doggerland, Chicago and Stockholm ice cover, and persistent sea in Wallacea.
- A separate Shapely pass checks every exported polygon and re-tests control points after serialization.
- Local and production browser checks cover the common year controls, regional cards, all three languages, mobile layout, layer toggles, Antarctica, linked human evidence, and restoration of the original map outside the model's time coverage.
- Existing political data hashes and 609–610 continuity are checked separately. No existing country-boundary record is edited by this feature.
