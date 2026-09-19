# Future-event illustrations — release, 2026-09-19

Built and tested locally; production publication authorized by the owner on 2026-09-19. Deployment completion is tracked separately from this pre-publication review.

## Coverage and content

- 82 of 82 catalogue cards have explicit scene definitions, organized into 29 reusable visual families with event-specific variants and captions.
- RU, EN and KY captions and controls; original quoted Arabic and translations remain in the article.
- Known locations remain on the existing map. Unknown places are not assigned coordinates by the artwork. Scene coordinates describe a diagram, not a geographic reconstruction.
- Prophets are not portrayed. Scenes with an unspecified appearance use abstract motifs. Generic people symbols and armies do not encode modern national, ethnic or religious stereotypes.
- The translation and original excerpt now precede the geography section.
- Existing historical data and the entire future catalogue are unchanged. Catalogue SHA-256 (JSON serialization): e2d36b45736b0b3c5b7692a59b9a3468e49cd7c64c3c3f325f54cce1cf6197c4.

## Interaction

- Illustration / Map view switch; a place chip opens and focuses its location.
- Fourteen-second scene playback, pause, replay and native keyboard-accessible seek slider.
- No automatic scene playback or looping; reduced-motion preference shows the completed frame.
- Browsing cards stops scene playback; scene playback stops card browsing. Page visibility loss pauses both.
- Changing the event resets the animation; switching view or language preserves its position and pauses it.
- The view is stored as `presentation=illustration|map` in the URL. Historical map state remains independent.
- Scene animation does not trigger unnecessary full-page translation passes.

## Verification

Passed build and regression suites: future catalogue, illustrations, i18n, support, biographies, history, unified Mongol map.

Illustration tests render 492 states across 82 events, validate all language captions, reject invalid geometry and unexpected active content, check that every scene changes, verify that the five towers grow monotonically and change leader, and confirm that the women/caretaker scene retains exactly 50 + 1 symbols.

Browser checks: all 82 cards opened with a visible illustration, a nonempty scene and a reset seek position. No console errors observed. Checked play/pause/seek, search and keyboard clearing, switching modes, RU/EN/KY, and Kisra's territory with map/illustration switching. Corrected arc geometry and caretaker contrast during visual review.

Viewport checks: 1440 × 950, 390 × 844 and 320 × 740. Document dimensions match the viewport; no page overflow. Scene controls and the card navigation stay visible; the hadith panel scrolls internally.

This is presentation and regression verification, not a new independent scholarly review of the complete hadith catalogue.

## Build

Run `node scripts/i18n/build.cjs` from the project root. Vercel's existing build command now includes the illustration tests, so a later authorized publication regenerates the same code from source.
