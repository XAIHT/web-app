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
