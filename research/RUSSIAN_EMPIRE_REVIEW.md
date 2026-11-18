# Russian Empire: dated external-contour review

Review date: 18 November 2026. Scope: 1721–1917, with predecessor and recipient continuity where a correction crosses those dates.

The map is a regional historical reconstruction. Treaty dates and named places can be checked more precisely than the intervening generalized line. A continuous imperial envelope does not mean uniform administration, uncontested sovereignty, or the absence of wartime occupation.

## Confirmed corrections

| Period | Correction | Evidence |
| --- | --- | --- |
| 1915–1917 | Preserve the full Russian envelope when applying regional wartime frontier adjustments. A regional card previously replaced it and dropped Siberia and Pacific possessions. Keep occupation profiles separate. | Catalogue provenance and the continuity of the imperial territories; no new conquest inferred. |
| 1686–1792 | Restore the Kyiv enclave and left-bank Dnieper continuity; keep Cherkasy outside Russia before the 1793 partition. | Eternal Peace, 1686; Kyiv Regional Archaeological Museum, *Правобережна Київщина 1667–1772 рр.*, including the Rigelman map. |
| 1774–1792 | Separate the Bug–Dnipro steppe, Kinburn and Kerch/Yenikale acquisition from the 1783 annexation of Crimea and the 1792 Yassy frontier. | Treaty of Küçük Kaynarca, articles XVIII–XX, in *П. А. Румянцев. Сборник документов*, vol. II. |
| 1792–1812 | Do not place Bessarabia west of the Dniester inside Russia before the Treaty of Bucharest. Restore the opposing Ottoman contour. | Treaty of Bucharest, 1812; Presidential Library treaty history. |
| 1856–1878 | Distinguish the original Paris line from the 1857 protocols around Bolgrad. Retain Akkerman in Russia, transfer the southern district to Moldavia/Romania, and restore the 1878 line on both sides. | Paris Treaty, articles XX–XXI; Edward Hertslet, *The Map of Europe by Treaty*, plate 16; Berlin Treaty, article XLV. |
| 1804–1828 | Add Ganja from 1804, Karabakh from 1805, and the Gulistan settlement from 1813. Do not backdate Erivan or Nakhchivan from 1828. | Kurekchay Treaty, 1805; Gulistan Treaty, 1813, articles II–III; Elton L. Daniel, “Golestān Treaty”, *Encyclopaedia Iranica*. |
| 1855–1875 | Include Urup on the Russian side of the Shimoda boundary, then on the Japanese side of the 1875 exchange. Continue its recipient outline after 1917, including the Soviet and Russian periods. | Joint Japanese–Russian documentary collection, 1855 and 1875 treaties and 1945–1946 documents. |
| 1867 onward | Preserve Baranof Island after Alaska passes from Russia to the United States; it was missing from the coarse US reference. | Office of the Historian, *Purchase of Alaska, 1867*; shared land-coast geometry. |
| 1868–1887 | Remove the false Bukharan/Khivan extent around Merv before its Russian acquisition. Separate Panjdeh occupation in 1885 from the settled Afghan frontier in 1887. | U.S. Department of State, *International Boundary Study* no. 26 (revised), 1983; Daniel Balland, “Boundaries of Afghanistan”, *Encyclopaedia Iranica*. |
| 1913 and 1916 | Add Severnaya Zemlya after the 1913 expedition announcement. Remove the anachronistic eighteenth-century Russian fill on Wrangel Island; date the imperial sovereignty claim to 1916 and identify it as a claim in the event card. | Vilkitsky expedition report; Russian diplomatic circular, 1916, reproduced/discussed in *Legal Appraisals of Canada’s Arctic Sovereignty: Key Documents, 1905–56* and contemporary Wrangel documentation. |

The Bessarabian reconstruction is confined south of 48.3° N so it does not overwrite separate Khotin/Podolia corrections. Its 1856/1857 internal line is generalized from named localities on Hertslet’s map. Natural Earth river and land data supply a consistent drawing base; modern polygons do not by themselves establish historical sovereignty.

## Reproducible verification

`scripts/world/russia-empire-review-test.cjs` tests the delivered, coast-clipped `WORLD_HISTORY` data rather than an intermediate catalogue. It checks every imperial year 1721–1916, core-territory continuity, foreign-city exclusions, selected treaty transitions, receiving states, dependencies, the 1917/1918 handover and Urup continuity through 2026. The generated geometry carries a digest to prevent testing a stale build. Existing release checks remain required.

## Finer questions still outside this repair

- Azov's unfortified city possession after 1739 should not be enlarged into a whole southern province without a detailed contemporary map.
- The 1723–1735 Caspian acquisitions require distinguishing treaty claims, the Shah's refusal to ratify, and actual coastal occupation.
- Early New Siberian island discoveries/claims need separate island-level dating.
- Caucasian mountain control, the Verny military post and Pamir/Bukharan administration need finer treatment than the regional imperial envelope.

These points are not certified as exact boundaries by this review. They must not be silently converted into broad new territorial fills.

## Consulted editions and access points

- https://www.prlib.ru/history/619530
- https://koam.com.ua/pravoberezhna-kii-vshhina-1667-1772-rr/
- https://drevlit.ru/docs/russia/XVIII/1740-1760/Rumjancev_P_A/Sb_dok_tom_II/pril5445.php
- https://www.prlib.ru/history/619271
- https://content.ecf.org.il/files/M00934_TreatyOfParis1856English.pdf
- https://maproom.org/00/02/present.php?m=0016
- https://docs.historyrussia.org/ru/nodes/520083-otnosyaschiesya-k-rumynii-stati-berlinskogo-traktata-1-13-iyulya-1878-g
- https://justice.gov.az/documents/categories/1163/kurekcay-en.pdf
- https://justice.gov.az/documents/categories/1163/gulustan-en.pdf
- https://www.iranicaonline.org/articles/golestan-treaty/
- https://www.mofa.go.jp/region/europe/russia/territory/edition92/period1.html
- https://www.mofa.go.jp/region/europe/russia/territory/edition92/period2.html
- https://www.mofa.go.jp/region/europe/russia/territory/edition92/period3.html
- https://library.law.fsu.edu/Digital-Collections/LimitsinSeas/pdf/ibs026.pdf
- https://www.iranicaonline.org/articles/boundaries-iii/
- https://pubs.aina.ucalgary.ca/dcass/81350.pdf
- https://collections.dartmouth.edu/archive/text/stefansson-wrangel-tei/diplomatic/stefansson-wrangel-09-30-006-diplomatic.html

Public atlas cards retain bibliographic names without outbound source links, following the project's established presentation choice.
