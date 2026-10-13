# Shared frontiers and map painting — 1.23.0

This release addresses dated overlaps rather than changing the drawing order of
all states. The original catalogue remains an independent regression reference.
Reviewed geometry and relationships are applied by `shared-frontiers.cjs`.

## Geometry and dates

- Timurid, Aq Qoyunlu, Shaybanid and Safavid Khorasan use a common regional edge.
  Transfers in 1500, 1507, 1508 and 1510 update both the gaining and losing side.
  This is a regional reconstruction, not a surveyed Timurid frontier.
- Khalkha no longer retains the Inner Mongolian footprint after the 1636
  submission. Kashgaria retreats as Qing campaign contours change in 1876–1877;
  the remaining Khotan area is retained through 1877.
- Moscow/Russia does not cover the Kazan Khanate before the 1552 conquest.
- US/Canadian continental edges use the nineteenth-century treaty framework.
  Alaska remains Russian before 1867 and American thereafter. The reference
  generalises the coastal strip and islands; competing pre-1903 inland claims
  are not an independently reconstructed claim map.
- The continental USA after the Gadsden Purchase and the seceded states are
  complementary footprints. The Confederacy uses the eleven seceded states,
  with West Virginia separated in 1863. Census geometry supplies the geographic
  scaffold, not nineteenth-century political membership or battlefield control.
  Kentucky and Missouri are not coloured as Confederate states. Federal wartime
  occupation inside the seceded states is not a complete annual front map.
- Dated corrections cover the Pyrenees after the Bayonne treaties, the Portuguese
  mainland after 1801, Norway after the 1826 convention, the Amur/Ussuri frontier
  after 1860, the Brazil/Argentina/Uruguay edges, the 1938 Chaco settlement and
  Basutoland inside the South African exterior. Overseas possessions are retained.
- The western Iraq–Saudi section uses locations recorded in the joint survey of
  the 1922 Uqair protocol. The neutral zone to its east is outside this correction;
  it has not been retrospectively divided using today's national envelope.
- Missing relationships for Bukhara, Khiva, early Soviet republics, Turkestan,
  Kokand and Texas are dated explicitly. Soviet republics before December 1922
  are labelled associated republics, not provinces of an already existing USSR.

## Early Eurasian chronology

`legacy-frontiers.cjs` records corrections independently of the original source
catalogue. The compiler inserts a dated losing-side frame whenever the reviewed
neighbour changes. It does not interpolate a frontier between unverified dates.

- Sasanian territory retreats against the already dated Muslim acquisitions.
  Additional regional stages distinguish Nihavand (642), Isfahan (644) and the
  consolidation in Fars (650). Morony's *Arab Conquest of Iran* describes repeated
  submissions and rebellions; these atlas-scale outlines are not continuous
  surveyed lines of military control.
- The Ten Kingdoms shrink as Song expands; Liao and Jin lose the corresponding
  dated conquered territory. The disappearance of a dynasty uses the incoming
  regime's frame in the transition year.
- Ghazna's pre-999 domain no longer borrows Mahmud's later imperial extent.
  Seljuk frames distinguish Khorasan, the advance into western Iran, Baghdad in
  1055 and the western successor sultanate after Sanjar's death in 1157.
  Khwarazm's western conquests are dated to Tekish's campaigns in 1187–1194.
- The early migration of Yelü Dashi is contextual, followed by Balasaghun in
  1134 and Qatwan in 1141. Qarakhanid local rule after submission is an outline
  within Qara Khitai hegemony, not a second sovereign colour. Neither this model
  nor the references attest every edge of the steppe reconstructions.
- Egypt becomes Mamluk in 1250; the Syrian Ayyubid principalities remain until
  1260. The 1260 annual map shows the Mamluk outcome after Ayn Jalut, not every
  intra-year military occupation. Later Ayyubid vassal branches are not yet a
  comprehensive separate set of political profiles.

- Rum now loses Nicaea and its western possessions in 1097; later regional
  frames distinguish the 1178 consolidation, Antalya in 1207, Sinop in 1214,
  Alanya in 1221 and the Erzurum region in 1230. The sultanate becomes a
  contextual dependency after 1243. These outlines do not reconstruct every
  neighbouring Anatolian principality or every intra-year change of control.

Reference bibliography and consulted entries: Michael G. Morony, *Arab Conquest of Iran*; C. E. Bosworth,
*Ghaznavids*, *Khwarazmshahs III*, *Sanjar*; *Tekiš b. Il Arslān* and István
Vásáry, *Qarā Ḵeṭāy*, in Encyclopaedia Iranica; Linda Komaroff and Suzan Yalman,
*The Art of the Ayyubid Period*; R. Stephen Humphreys, *From Saladin to the
Mongols*; the Cambridge histories of China, Iran and the Mongol Empire.

Sources checked on 13 October 2026 include:

- https://www.iranicaonline.org/articles/arab-ii/
- https://www.iranicaonline.org/articles/ghaznavids/
- https://www.iranicaonline.org/articles/iran-ii2-islamic-period-page-3/
- https://www.iranicaonline.org/articles/sanjar/
- https://www.iranicaonline.org/articles/tekis-b-il-arslan/
- https://www.iranicaonline.org/articles/qara-ketay/
- https://www.iranicaonline.org/articles/ayyubids/
- https://www.metmuseum.org/essays/the-art-of-the-ayyubid-period-ca-1171-1260
- https://www.iranicaonline.org/articles/saljuqs/saljuqs-iii/

These maintenance references are not rendered as external links in the atlas.

## Context and transitions

Contextual regions, political associations and dependent territories retain
clickable outlines and cards. Their tint is masked wherever a political state
already supplies the colour. Occupations retain hatching and a tint on uncovered
land. The mask also includes early Eurasian states. Colonial community cards do
not paint a second sovereign colour over the colonial polity.

Year changes do not clone and crossfade old and new borders. Only the new map is
painted, with a short opacity emphasis; reduced motion and rapid scrubbing are
respected. Dynasty succession years display the incoming dynasty once.

## Verification and remaining scope

The release checks exercise every year 610–2026 for dated features, geometry,
owners and references. `shared-frontiers-test.cjs` checks corrected neighbouring
pairs, independent city controls, ownership intervals and preservation of original
records. SVG renderer tests cover clickable context, occupation hatching and
uncovered land. Browser checks cover early and late dates, zoom, selection,
languages, playback and the 2010/2011 transition.

`legacy-frontiers-test.cjs` independently checks the delivered early geometry and
city controls. `frontier-audit.cjs` scans both timeline engines together, including
cross-engine pairs. Its remaining intersection candidates must be reviewed;
the report must never be described as zero overlaps if its list is not empty.

Final local release run: build plus 43 suites passed. The combined diagnostic
examined 1,417 years and 12,762 potentially intersecting frame pairs, with no
empty years or geometry-operation failures. It retains 969 intersection
candidates. These include known schematic borders requiring further review;
this release does not claim to have eliminated every historical inaccuracy.
Priorities include the Sasanian/Western Turkic frontier, Buyid/Samanid domains,
medieval European boundaries, early modern Asian boundaries and wartime fronts.

An intersection detector is a diagnostic, not a historical verdict. Military
occupation, claims, confederations and cultural regions may have overlapping
extents. Earlier local diagnostic files also omitted the separate early Eurasian
renderer. They must not be cited as proof that every historical border is exact.
Several pre-1946 regional sketches still require detailed source-by-source
research, especially medieval steppe frontiers, early modern India and wartime
fronts. A geometric pass does not complete that historical attestation.

Detailed modern narratives through 2026, comprehensive yearly control fronts,
and all disputed frontier claims remain distinct work in the roadmap.
