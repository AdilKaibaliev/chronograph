# Natural geography before the PaleoMIST coverage

Prepared 2026-11-16. The atlas chronology remains 350000 BCE–2026 CE on one scale.

## Evidence and attribution

Krapp, M., Beyer, R. M., Edmundson, S. L., Valdes, P. J. & Manica, A. (2021). *A statistics-based reconstruction of high-resolution global terrestrial climate for the last 800,000 years*. Scientific Data 8, 228. DOI 10.1038/s41597-021-01009-3. The surface-mask methods section describes the land, ice and ocean categories.

Data: OSF, DOI 10.17605/OSF.IO/8N43X, https://osf.io/8n43x/; file `icesheets_000-800_cru.nc`, https://osf.io/download/6prf7/. CC BY 4.0, https://creativecommons.org/licenses/by/4.0/. Source SHA256 `722f7d964fb1b947563a0974026b7f8a289875393f5e52f9af6b46972f50d8d3`, 8,572,111 bytes. Attribution retained in map bibliography and manifests. Adaptation by Chronograph: categorical contour extraction, simplification and web packaging.

Use the dated `mask` variable, not the constant maximum-land mask. Classes 0 water, 1 land, 2 ice. Spatial grid 0.5 degrees; time spacing 1,000 years. Numeric negative ages are interpreted as BP according to the paper and global attributes, not as literal civil years from the NetCDF placeholder year-0000 time origin. BP is referenced to 1950. Civil chronology has no year zero.

272 frames from 352000 to 81000 BP extend the existing 33 PaleoMIST frames (80000–0 BP). The closest dated slice is displayed, with its age separate from the selected civil year. The oldest frame supports the first atlas year, 350000 BCE, without expanding its chronology. No extrapolation of the 80 ka map into earlier periods and no invented contour interpolation.

## Scope and model junctions

Krapp coast masks use Spratt–Lisiecki global sea level and ETOPO1 relief. Preserved inland lakes do not supply a dated history of lakes or rivers. Northern Hemisphere ice derives from CLIMBER-2/SICOPOLIS for 123–799 ka BP and ICE-6G for 0–122 ka BP. The global mask is not an independently resolved Southern Hemisphere ice chronology, nor a survey of individual mountain glaciers. This distinction is visible in the atlas guide.

The existing PaleoMIST marine coasts include glacial isostatic effects and have a finer 0.25-degree grid. They remain unchanged. Equal-area comparison of both processed source masks at 80 ka shows symmetric-difference/union fractions 0.07761 for land and 0.41884 for ice. The Krapp 80-to-81 ka change is much smaller (0.00173 land, 0.01448 ice). Therefore the junction is a **model change**, not evidence of an abrupt event. The guide and nearby timeline cards explain it. Do not conceal the difference by inventing intermediate ancient coastlines or claim the sources coincide. The earlier internal ICE-6G / CLIMBER junction is also retained as supplied.

## Processing and delivery

`scripts/ancient/paleogeography/build-older.py` verifies the source SHA256, extracts categorical land/ice polygons, intersects ice with land, simplifies by 0.035 degrees, rounds to 0.0001 degrees and validates rings. Green shelf polygons are dated land minus the same dataset's 0 BP land and dated ice. They are not spurious differences between differently resolved datasets.

Compressed research frames are committed; NetCDF and Python scientific dependencies are preparation-only and are not needed by Vercel. The release build verifies every decompressed SHA256 and emits immutable content-hashed JSON assets. Older geometry is loaded for the selected date, with adjacent frames prefetched and an eight-frame cache. Current geometry remains while loading, explicitly labelled with the displayed frame age. Out-of-order responses cannot replace the selected year; failed downloads expose a retry. The same geometry drives coast, ice, clipping and the polar view.

## Verification

Automated coverage checks every civil year in the atlas, nearest-frame selection, no year zero, source junctions, 305 frame geometries, closed finite rings, antimeridian handling and published data hashes. Existing geographic controls remain for Bering, Torres, Bass, North Sea, Chicago and Stockholm. Wallacea remains a sea crossing. Cache tests cover deduplication, late responses, failures/retry, frame identity and eviction. Local and production browser checks cover early frames, source junctions, rapid year changes, three languages, mobile layout, toggles and mode restoration.

These checks establish correct delivery of the cited reconstruction. They do not make model outlines equivalent to measured ancient coastlines or prove a date for human passage through a land bridge.
