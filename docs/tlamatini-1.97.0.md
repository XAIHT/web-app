# Website refresh — Tlamatini 1.97.0

**Tlamatini 1.97.0 is the latest released version** in English and Spanish.
The website uses one version with edition-specific release, installer, source
archive and documentation links. Its existing design, components, imagery and
animations are preserved.

## What visitors can discover

- **Several documents, one Canvas.** Up to 32 independent tabs for text, code,
  Markdown and PDFs. Each document keeps its editing or reading state.
- **Context is your choice.** Open documents are not automatically shared with
  chat. Explicitly accepted snapshots have context badges; editing or saving
  leaves the earlier snapshot until you choose Update context. Closing a tab
  does not remove its selected context; remove its context chip to do that.
- **Editing with clear ownership.** Dirty tabs carry an asterisk. Save, Refresh
  and Copy act on the active document. Interactor can switch documents while
  teaching; switching manually stops typing aimed at the previous document.
- **Save before leaving.** Dirty documents and pending saves participate in the
  browser's page-departure warning. Browser policy controls that warning; this
  is not autosave, tab restoration or recovery after a browser crash.
- **Speak directly.** The microphone beside Send replaces the former Voice
  Commands catalog section. Talker speaks and Whisperer listens and understands
  audio. Existing continuous playback and personal interaction settings remain.
- **Create beyond chat.** Unreal Engine and Blender control, STM32 and ESP32
  workflows, visible Terminater commands, and verified Torrenter downloads
  retain their prominent place in both languages.

The catalog remains 87 workflow agents, 68 chat-agent launchers, 111 built-in
Multi-Turn tools and 29 skills. Model capacity remains distinct from the Canvas
limit; 32 open tabs do not mean that every model can ingest all their contents.
Alt+PageUp/PageDown is the Canvas switching alternative when browser-reserved
Ctrl+Tab is not delivered to the page.

## Remote-control scope

The existing website's signed-in **Tlamatini-RC** page registers computers,
shows connection state and queues messages for acknowledgement by Tlachihuani.
That page is not advertised as a full remote desktop or as a post-quantum channel.
The separate Tlamatini account/device integration follows the edition's
Remote-Controller guide, with explicit access and execution approvals. Product
release notes and the current integration guide differ in their description of
transport availability; the public copy does not promise Internet or phone
microphone access on the basis of a release heading alone.

## Source references

- [English 1.97.0 release notes](https://github.com/XAIHT/Tlamatini/blob/v1.97.0/docs/changes/2026-11-21-v1.97.0.md)
- [Spanish 1.97.0 release notes](https://github.com/XAIHT/Tlamatini-Spanish/blob/v1.97.0/docs/changes/2026-11-21-v1.97.0.md)
- [Canvas behavior](https://github.com/XAIHT/Tlamatini/blob/v1.97.0/docs/canvas-editing.md)
- [Interactor](https://github.com/XAIHT/Tlamatini/blob/v1.97.0/docs/interactor.md)
- [Remote-Controller](https://github.com/XAIHT/Tlamatini/blob/v1.97.0/docs/remote-controller.md)

Version metadata lives in `src/i18n/editions.ts`; bilingual product copy in
`src/i18n/translations.ts`, `src/pages/Launch.tsx` and
`src/i18n/installation.ts`. Historical release notes preserve dated evidence.
The unrelated legacy `Tlamatini.version.txt` Windows-resource sample is not used
by this website's Vite/client/server build and is not its release source.

## Verification scope

Verification covers TypeScript, ESLint, the existing content/API test suite,
the production client/server build, and visible English/Spanish browser checks
on desktop and narrow mobile viewports. It includes language switching,
edition-specific links, Canvas descriptions, gallery controls, navigation and
layout. Website verification does not certify rebuilt Windows installers or
an authenticated end-to-end remote-control session.

## Validation — 2026-11-21

- `npm run check` and `npm run lint`: passed.
- `npm run test`: 180 tests passed across 11 files. The suite checks bilingual
  content, edition links, setup instructions, agent inventory and API behavior.
- `npm run build`: passed for the production client and server. Vite reports
  the existing large-chunk warning: the main JavaScript bundle is about 923 kB
  minified, 299 kB gzipped. Bundle splitting was not part of this content refresh.
- Visible Chrome review: 51 checkpoints across English and Spanish, including
  Home, Tlamatini and Launch at 1440, 390 and 320 CSS pixels; selected-edition
  links, installation disclosures, gallery tabs and lightboxes, anonymous
  access pages, and language switching through reload, Back and Forward.
- Supplementary visible review: 10 checkpoints covering actual playback of
  all three existing videos in both languages and the 320-pixel mobile menu,
  Escape handling and installation navigation. This resolved the concern raised
  by interrupted media requests in the first navigation-heavy run.
- No JavaScript page errors, horizontal page overflow or newly clipped copy
  appeared in those checks. Mobile command blocks retain their own horizontal
  scrolling. These are desktop Chrome viewport checks, not physical-phone tests.

The existing editor screenshots remain representative editing views; this
refresh does not replace them with new multi-tab product screenshots. The
dark theme, animations and small agent-table typography remain unchanged.

Local evidence is in
`C:\Development\XAIHT\artifacts\web-site-1970-20261121`: `checks.json`,
`visual-results.json`, `SUMMARY.html`, the supplementary `media-navigation`
report and full-desktop screenshots captured with Shoter.

### Public download availability

The site consistently uses **1.97.0** and the corresponding English or Spanish
repository URLs. On 2026-11-21, unauthenticated GitHub release API requests for
`XAIHT/Tlamatini/releases/tags/v1.97.0` and
`XAIHT/Tlamatini-Spanish/releases/tags/v1.97.0` both returned HTTP 404.
Consequently, the public installer assets could not be verified in this pass.
The site was not silently redirected to an older version. See
`release-links.json` in the local evidence directory for the observed results.

These changes were verified locally. No commit, push or production deployment
was performed.
