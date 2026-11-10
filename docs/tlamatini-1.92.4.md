# Website refresh — Tlamatini 1.92.4

Tlamatini **1.92.4** is the latest released version in both English and Spanish.
This refresh updates the existing website's content and preserves its layouts,
styles, animations, components, and edition-specific destinations.

## What visitors now find

- Matching release labels, Windows ZIPs, tagged source archives, and setup instructions for their selected edition.
- Torrenter metadata queuing beyond four active lookups, account-owned queues, seeds and peers, optional completion waits, and detailed activity logs.
- Verified output paths and SHA-256, the normal Windows Downloads/Torrenter destination, and the content_generated/Torrenter fallback. If both destinations fail, delivery reports an error.
- A separate Tlachihuani explanation: optional XT at sign-in, services stopped until the user starts them, gray/color status, Stop Services, shortcuts, and Windows uninstall integration.
- A sixth, optional setup step covering the companion installer and the first transfer. Existing Tlamatini login is used; no pairing codes.
- The readable README canvas fix, Executer browser-path handling, Private/Public log identity, paired version prediction, and separate build caches.
- Preserved prominence for Unreal Engine, Blender, STM32, ESP32, Talker, and Whisperer, with 87 workflow agents, 68 chat wrappers, 111 built-in tools, and 29 runtime skills. Tlachihuani is a companion, not another workflow agent.

## Product references

The copy was reconciled with both editions' README, BookOfTlamatini,
Tlamatini.md, docs/torrenter.md, and docs/changes/2026-11-08-v1.92.4.md,
and with Tlachihuani's README installation and tray-control guidance.
The release-number declaration follows Angela's one-version rule; it does not
create tags, upload binaries, or publish this website.

## Validation

Run npm run check, npm run lint, npm test, and npm run build.
The content suite checks bilingual parity, agent identities, current releases,
matching download destinations, setup-step coverage, and the distinction between
accepted, queued, and delivered downloads. Check /, /tlamatini, and /launch in
both languages and at desktop/mobile widths using a visible browser.

This pass does not test an installed desktop application, Google sign-in, or
remote release-asset availability. Source edits and the local production build
are separate from deploying to xaiht.org.

## Verified on 8 November 2026

TypeScript checking, ESLint, all **154 tests in 9 suites**, and the production
client/server build passed. The visible Chrome campaign passed **16 scenarios**:
three public routes in English and Spanish at 1440- and 390-pixel widths, plus
four card-visibility/language-switch/Back/reload checks. No body overflow was
measured in those cases. Full-desktop evidence was captured by Shoter; the
final Torrenter cards were checked after their reveal animations completed.
Vite reports a non-blocking chunk-size warning (approximately 786 kB before gzip).

No commit, push, or production deployment was performed.

## Release-link refresh — 9 November 2026

Both editions remain on the latest released version, **1.92.4**. The website
now shares that number through `LATEST_RELEASE` in `src/i18n/editions.ts`.
Edition-specific repositories and filenames remain separate. The download
section includes a visible, localized release-notes link using the existing
design. Its introduction highlights the example-prompt fixes described in
both releases. Setup copy focuses on installation, account sign-in, model
preparation, and the prompt catalog; it does not include plan or pricing copy.

The following destinations were checked against GitHub's release API responses,
including each uploaded asset's exact `browser_download_url`:

| Edition | Release notes | Windows installer ZIP |
| --- | --- | --- |
| English | [v1.92.4](https://github.com/XAIHT/Tlamatini/releases/tag/v1.92.4) | [Tlamatini_Release_v1.92.4_Win11x64.zip](https://github.com/XAIHT/Tlamatini/releases/download/v1.92.4/Tlamatini_Release_v1.92.4_Win11x64.zip) |
| Español | [v1.92.4](https://github.com/XAIHT/Tlamatini-Spanish/releases/tag/v1.92.4) | [Tlamatini-Spanish_Release_v1.92.4_Win11x64.zip](https://github.com/XAIHT/Tlamatini-Spanish/releases/download/v1.92.4/Tlamatini-Spanish_Release_v1.92.4_Win11x64.zip) |

Both responses report published, non-draft, non-prerelease releases. The English
asset is 1,468,007,701 bytes; the Spanish asset is 1,504,908,068 bytes. These
checks establish the release targets and uploaded metadata; the large ZIPs
were not downloaded or installed during this website task.

### Verification for this refresh

- TypeScript, ESLint, **162 tests in 10 suites**, and the production client/server
  build passed in a visible console. Vite retains its non-blocking chunk-size
  warning (900.71 kB for the main JavaScript chunk before gzip).
- Headed Chrome passed **31 visual scenarios**: `/`, `/tlamatini`, and `/launch`
  in English and Spanish at 1440, 390, and 320 pixels; release/setup sections
  in each combination; and language switching with reload, Back, and Forward.
- Download and release-note URLs matched the selected edition. No horizontal
  document overflow or JavaScript page errors were observed. Desktop and mobile
  screenshots were inspected, including the Spanish 320-pixel download section.
- The initial navigation check clicked the radio's tiny hidden input and failed
  its immediate state assertion. The retry clicks the visible language label,
  waits for the routed state, and verifies the URL, checked control, and content.
  Test reports are excluded from the preview watch list to prevent report writes
  from triggering reloads. No application language-selector change was needed.

Local evidence: `.cache/verification/site-release-1924-20261109/SUMMARY.html`,
`results.json`, `releases.json`, screenshots, and command logs. The browser
checks use the real local development site; the production build was separately
verified. Mobile checks emulate viewport sizes, not physical phones.
Google sign-in and desktop-installer execution are outside this website check.
No commit, push, or production deployment was performed.
