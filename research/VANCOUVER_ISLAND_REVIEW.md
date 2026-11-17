# Vancouver Island: treaty boundary and Canadian accession

Review: 17 November 2026. Prior production: 08930fc78bad27a9b541b9e66d0eeafef5694bea.

## Confirmed defects

The displayed island was missing from the British imperial fill after 1846
and the Canadian fill in 1871–1945. It appeared abruptly in 1946. The coarse
US/Oregon envelope also covered Victoria (123.4 W, 48.43 N), even in later
periods, while the generalized Canadian reference did not reach that point.

## Evidence and dates

- Treaty with Great Britain, 15 June 1846, US Statutes at Large 9, p. 869,
  Article I. The boundary follows the 49th parallel to the channel between
  Vancouver Island and the continent, then the straits to the Pacific. Thus
  the southern end of Vancouver Island is not divided at the 49th parallel.
  https://www.govinfo.gov/content/pkg/STATUTE-9/pdf/STATUTE-9-Pg869.pdf
- BC Laws, *Pre-Confederation BC Statutes*, explanatory note: island colony
  founded in 1849; mainland colony in 1858; union in 1866; capital moved to
  Victoria in 1868; British Columbia entered Canada on 20 July 1871.
  https://www.bclaws.gov.bc.ca/civix/document/id/hstats/hstats/explanatory%20note%20pre-confederation%20bc%20statutes%201869
- Canadian Heritage, *Historical boundaries of Canada*, independently confirms
  the 1871 accession.
  https://www.canada.ca/en/canadian-heritage/services/historical-boundaries-canada.html

## Implementation

Use the existing shared Natural Earth island coastline (165 vertices), rather
than an arbitrary rectangle or the 15-vertex national reference. Add it to the
British imperial outline 1846–1918 and Canada from 1871. Remove precisely that
island from the US and Oregon regional envelopes from 1846 onward. Existing
Dominion relationships, mainland boundaries and Indigenous cultural geography
remain unchanged. Events mark 1846, 1849 and 1866; the 1871 accession card now
explicitly includes the island and the exact accession date, in all languages.

## Verification and limits

Annual tests cover 1846–2026, four island points including Victoria south of
49N, the US/Oregon exclusion, and the adjacent Olympic Peninsula. Global dated
comparisons identify unintended changes and new political overlaps. This does
not resolve the San Juan channel dispute (settled separately in 1872), assign
British sovereignty before the 1846 settlement, or claim that a colonial treaty
extinguished Indigenous title. It does not certify the entire Canadian border.

The first annual test rejected the 2011 continuation: Oregon copied its raw
sketch instead of the reviewed 2010 geometry, reintroducing 0.0207085 square
degrees of overlap at Victoria. The continuation now retains that profile's
reviewed geometry. This prevents recurrence through 2026; the initial failed
build was not published.
