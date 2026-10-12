# Chronograph 1.22.0 — cartographic repair

## Scope

The publication catalogue now has political and administrative frames for every year from 610 through 2026. Previously the data stopped in 2010 while the interface continued to 2026; a CSS rule hid the political layers after 2010. The rule is removed and a dated 2011–2026 continuation supplies geometry, ownership and labels.

This is a state/administrative map, not a daily map of military control. South Sudan is separated in 2011. Dated cards cover Eswatini, North Macedonia, the Taliban takeover, Syria's 2024 transition, Ukraine and Somaliland. Unrevised older narratives are explicitly labelled as historical background, rather than asserted to describe a later year's government. Recent history still needs deeper editorial coverage, including changing conflict-control areas.

## Historical repairs

- Complete generalised national envelopes for Iran, Afghanistan and Mongolia in the reviewed twentieth-century frames. Shared Asian edges, Tuva's dated incorporation, Japanese southern Sakhalin before 1945 and separate Tibetan administration are retained.
- The Chinese mainland remains continuous around Xinjiang; Manchukuo and Japanese occupation retain distinct statuses. Modern reference coastlines are not treated as documentary evidence of historical sovereignty.
- Nepal and Bhutan have their own 1919–1945 profiles and map footprints.
- Reciprocal edge corrections remove digitisation overshoot at the reviewed American borders without adding Newfoundland to Canada early or dropping US overseas possessions.
- Colonial-period community/regional polygons have a cultural category where the existing source cards describe communities inside other political entities.
- Yarkand/Altishahr dependency on the Dzungars and the duplicate Trebizond profile are represented through dated ownership, rather than competing independent fills.

The archived `catalog.cjs` is preserved as an independent regression baseline. `published-catalog.cjs` applies documented corrections and the modern continuation. The tests compare delivered data with this reviewed catalogue while retaining the previous historical fingerprints. Explicit control-point, partition, overlap, category and transition tests check the corrections independently.

## Source basis

- Foreign Relations of the United States, 1942, China, document 527; 1943, China, document 562; 1944, volume VI, document 577; 1950, volume V, document 836.
- United States Army, The Pacific and Adjacent Theaters, 1942.
- Treaty of Punakha, 1910; contemporary Nepal treaty context in FRUS.
- International Boundary Commission, History and Treaty of 1908.
- Arquivo Nacional do Brasil, Dionísio Evangelista de Castro Cerqueira; Fundação Alexandre de Gusmão, Obras do Barão do Rio Branco, volume V, Questões de limites.
- United Nations membership and treaty records; UNISFA; UNAMA, Human Rights in Afghanistan, 15 August 2021–15 June 2022; UN reports/statements on Syria, Prespa and Somaliland; General Assembly resolutions 68/262 and ES-11/4.
- Natural Earth provides the generalised reference geometry. It does not certify a treaty-scale historical boundary or resolve disputed territory.

Research URLs remain in source modules for maintenance; the public Sources interface continues to display plain titles.

## Verification and limits

The release checks all 1,417 annual map frames for missing geometry, duplicated identities, dates and missing owners; revised Asian frontiers for 1922–1945; American shared edges for 1919–1945; and political intersections and continuity for 2011–2026. Existing coast, imperial-outline, WWII occupation, 1299/1300 continuity, language, biography, future-event and animation tests remain active.

The global intersection diagnostic deliberately retains candidates: an intersection may mean occupation, overlordship, a cultural region or an approximate frontier needing further historical review. It is not safe to eliminate every intersection by assigning land to whichever polygon is drawn first. No claim is made that every historical boundary has been independently established at survey precision. Detailed pre-1946 frontier/occupation review remains an editorial task.

Browser and publication proof are stored in the versioned verification reports and release manifest. The short event-epicentre accent remains bounded; permanent city pulsing is not restored. The XXI-century filter and period-appropriate milestone strip work beyond 2010.
