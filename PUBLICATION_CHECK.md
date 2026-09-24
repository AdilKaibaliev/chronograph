# Publication record

## Educational world atlas — 2026-09-24

The owner explicitly authorised publication after validation. This release adds the 610–1299 world catalogue: 87 profiles, 141 phases, 140 regional outlines, 103 mapped events and teaching notes for 27 societies, in three languages. Region selection leaves all active territories visible worldwide. The Society view supports search by society and activity. Contiguous Almohad outlines are merged to avoid artificial internal borders.

Publication uses one GitHub main update and the existing Vercel integration. All catalogue, rendering, chronology, translation, biography and future-event checks run as part of the build. Source citations remain plain publication titles. Server logs and local working files are excluded from the release.

The following records document earlier releases. The previous production commit is a7106547a9eeb1649964990e610805588113600f.

## Map-first future events — 2026-09-19

- GitHub main: a7106547a9eeb1649964990e610805588113600f
- Vercel deployment: 24r1pucrz6B7yW6KKH8mpMKaRDY9; GitHub integration reports successful completion.
- Future events now start on the map, including reopening the section and loading older illustration URLs. The map button comes first; illustrations open on request.
- Build, future catalogue, illustration, i18n and support checks passed.
- Public browser verified the default map, button order, illustration opening and return to map. No console errors observed.

## Illustrated future events — 2026-09-19

Published to production after owner approval.

- GitHub main: a7d5ee4b7305e203a7d8dfbaa6c60182a1cdaab7
- Vercel deployment: 4DAB9xUto29WQk4SPVciTUZLYaN6
- Vercel status reported through the GitHub integration: success, "Deployment has completed".
- Public site: https://www.chronographatlas.com/
- 12 changed files verified against their Git blob hashes before updating main; no force update.
- Local build and future, illustration, translation and support checks passed.
- Public browser: all 82 cards listed; buildings scene seeks to 100%; return-to-al-Sham route remains on the map; illustration/map toggle and RU/EN/KY captions work; no console errors observed.

See `ILLUSTRATIONS_REVIEW.md` for the full local validation of all 82 scenes.

## Geography and complete excerpts publication — 2026-09-18

GitHub main: e2c44942c31b2ae7b9fd21ac59953d1db38340eb
Vercel deployment: EybFEzHWpED7FoXNnpwjbvnWykoK — Ready
Deployment URL: https://chronograph-ly9diwk3w-adils-projects-7b8d0e6c.vercel.app
Public URL: https://www.chronographatlas.com/

Added geography for eight cards, including Kisra's Sasanian mainland core and Ctesiphon, the completion of Hasan's reconciliation at Kufa, and Ammar's death in the Siffin battle area. Historical dates and named geography sources are separate from prophetic quotations. Thirty-eight entries now have mapped places; 44 have explicit unlocated/world-overview states rather than fabricated pins.

Bukhari 3176 now shows its complete six-sign passage in all five associated cards. Restored full context for Muslim 2128b and Bukhari 7132, and the false-announcement sentence in Muslim 2897.

Validation passed: build, all 82 future-event records and exact Arabic excerpts, geography source metadata, historical date preservation, Sasanian polygon containment/exclusions, sequence graph, JavaScript syntax, historical/i18n preservation, 157116 translation audit checks, support behavior.

Public browser checks:
- Existing Ammar deep link with fview=1,0,0 now focuses Siffin and shows 657 CE / 37 AH.
- Hasan shows Kufa and 661 CE / 41 AH; RU, EN and KY cards inspected.
- Kisra shows the entire shaded Sasanian mainland core, a Ctesiphon marker, and a clear period label; city and territory labels do not overlap.
- Full Bukhari 3176 passage visibly includes all six items and the final banner numbers.
- Switching to an unlocated card removes old markers and shaded territory; the al-Malhama shortcut restores Dabiq, Medina and their schematic direction.
- No browser console errors observed.
- Desktop 1292 x 912: document height 912, timeline bottom 900; territory fully inside the map.
- Mobile 390 x 844: document 390 x 844, timeline bottom 837; internal panel scrolling, no page overflow. Viewport override restored afterward.

Vercel regenerates index.html from source. Run node scripts/i18n/build.cjs from the project root after edits. The release ZIP includes the regenerated index.html and all source files.
