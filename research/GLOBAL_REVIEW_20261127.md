# Global audit and documented corrections — 27 November 2026

The technical census covers all 622 world profiles, 5,559 baseline phases,
6,149 dated area records and 2,023 baseline events, plus the 74 ancient profiles
and 702 ancient geometry records. It checks chronology, source references,
geometry validity, catalogue joins and annual rendering. It is not a claim that
every historical frontier has an independently surveyed, exact position.

## Baseline checks

- Ancient boundaries: 406 frames, 702 records, 817 candidate pairs; no invalid
  rings or visible political overlap in the audited ancient composition.
- Annual world composition: 610–2026 inclusive, 1,417 years, 2,834 mode/years,
  19,306 distinct visible pairs; none exceeded the 0.000005 square-degree
  numerical tolerance. The independent comparison uses Clipper, separately
  from the production polygon-clipping engine.
- Raw source-envelope audit: 20,150 candidate pairs and 1,046 geometry cases
  across 1,417 years. Some are unresolved frontier envelopes, dependencies or
  claims, not proof of double-painted sovereign land. These require historical
  adjudication; a blanket drawing priority would conceal the problem.
- Chronological gaps are retained when they represent interregna, conquest,
  expulsion or changes of administration. Examples include Mughal rule during
  the Sur period and Spanish New Mexico during the Pueblo Revolt.

## Documentary corrections in source-review-143.cjs

### Bordeaux and Gascony, 1420–1453

The French and English source polygons both contained Bordeaux. The duplicate
is removed before the French recovery of 1451. Annual snapshots now show the
1451 French recovery, the October 1452 English return and the final French
recovery in 1453. The 1452 return uses a regional Bordelais envelope around the
attested Bordeaux–Libourne–Castillon positions; it does not restore all earlier
English Gascony. The source provides places and control changes, not a village
by village surveyed line. The annual view represents the change reached during
the named year; event cards retain the month where established.

Sources: The Gascon Rolls Project, C 61/138–140, especially the introduction to
C 61/139; Anne Curry, *The Gascon Rolls and the End of English Gascony, 1451–1453*.

- https://www.gasconrolls.org/fr/edition/calendars/C61_139/document.html
- https://www.gasconrolls.org/fr/edition/calendars/C61_140/document.html
- https://www.gasconrolls.org/en/blog/the-gascon-rolls-and-the-end-of-english-gascony-1451-1453/

### New Netherland and English colonies, 1650–1664

The Hartford agreement divides Long Island at Oyster Bay and sets a mainland
line from the west side of Greenwich Bay for twenty miles. The repair removes
duplicate English-settlement areas from the Dutch envelope and transfers the
mapped eastern Long Island portion. It does not extend the twenty-mile treaty
line as an invented surveyed meridian through the northern hinterland.
New Amsterdam stays Dutch. Dutch property at Hartford, reserved in the treaty,
is distinguished from control of the whole Connecticut valley; the narrative
changes again with confiscation in 1654. New Haven's foundation is mapped in
1638. Pre-1650 competing colonial claims remain a separate research problem;
this revision does not certify their full outer extent.

Sources: *Articles of Agreement at Hartford*, 19 September 1650, in *New
Netherland Papers, c. 1650–1660*, pp. 3–4; Connecticut Secretary of the State,
*Selected Important Dates in Connecticut History*; Dwight Loomis and J. Gilbert
Calhoun, *The Judicial and Civil History of Connecticut* (1895).

- https://www.newnetherlandinstitute.org/application/files/9016/8416/7647/Bontemantel.pdf
- https://portal.ct.gov/sots/register-manual/section-i/selected-important-dates-in-connecticut-history-us-presidents-and-vice-presidents
- https://www.colonialwarsct.org/1731.htm
- https://www.cga.ct.gov/hco/books/The_Judicial_and_Civil_History_of_CT.pdf

The New Netherland PDF was available in the search index but its direct fetch
returned 404 during this audit; treaty terms were cross-checked against the
transcription and published colonial histories. The public atlas uses
bibliographic titles, not these research links.

### Basra, 1538–1590

The former Safavid regional polygon continued over Ottoman Basra. Remove only
the overlapping lower-Iraq envelope west of the Shatt al-Arab. Preserve
Safavid Khuzestan and the separately dated occupation of Basra in 1697–1701.
Distinguish renewed recognition of Ottoman suzerainty in 1538 from direct
garrison/provincial administration after Ayas Pasha's campaign of late
1545–1546. TDV dates entry to 26 December 1545; the study of the 1590 register
uses 1546. The card records that interval rather than concealing the distinction.

Sources: Yusuf Halaçoğlu, *Basra: Osmanlı Dönemi*, TDV İslâm Ansiklopedisi;
Fadime Demirdöğen, *XVI. Yüzyılda Basra Vakıfları (1590 Tarihli Tahrir Defterine
Göre)*, based on the cadastral register.

- https://islamansiklopedisi.org.tr/basra#2-osmanli-donemi
- https://dergipark.org.tr/en/pub/vakiflar/article/720013

### Nepal, 1919–1945

The 1919–1945 card prematurely described the treaty of 1923. Split both the
phase and area narrative at 1923 and add the signing at Kathmandu on 21 December.
Article 1 acknowledges the parties' internal and external independence; this
is not represented as Nepal's founding or its first existence as a state.
Geometry is unchanged.

Sources: *Treaty between the United Kingdom and Nepal*, Cmd. 2112 (1924),
Article 1; British Library IOR/L/PS/18/B383; *Foreign Relations of the United
States*, 1950, Volume V, document 836.

- https://archivenepal.s3.amazonaws.com/documents/1924_UK_and_Nepal_treaty.pdf
- https://searcharchives.bl.uk/catalog/040-000563531
- https://history.state.gov/historicaldocuments/frus1950v05/d836

## Regression coverage

`source-review-143-test.cjs` checks annual ownership at independent settlement
coordinates, retained neighbouring positions, later Basra occupation, all
three language narratives at the Nepal boundary, seven mapped events, every
profile's phase intervals, sources and area-to-narrative coverage. The old
published build fails the new Bordeaux control. Existing tests remain active;
the old-field guard permits changed titles/text only inside the exact sourced
French/English 1450–1452 and Dutch 1650–1663 windows.

## Repository maintenance

Eight merged, zero-ahead branches were removed. Eleven failed Vercel
deployments were moved to Recently Deleted, leaving the current production
deployment and successful rollback versions intact. Nine unused release ZIPs
under `downloads/` total 7,605,612 bytes and are removed from the current tree.
No Git history is rewritten: those archive blobs remain recoverable from
historical commits. Therefore this reduces fresh checkout/build inputs, not
the entire repository's historical object storage. Vercel physical storage
reclamation is controlled by its retention/deletion policy; no byte saving is
asserted without a provider measurement.
