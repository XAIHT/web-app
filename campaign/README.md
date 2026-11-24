# XAIHT Company Launch Campaign

This directory is the source of truth for the commercial launch of XAIHT and its flagship product, Tlamatini. The campaign is derived from the live Tlamatini repository, the current XAIHT website, the checked-in project dossier, and cited external research. It must never invent customers, revenue, benchmark results, certifications, or production deployments.

## Campaign thesis

**XAIHT builds intelligence that stays under human command.**

**Tlamatini is the local-first AI operator that knows the project, coordinates tools and other agents, and can act across software, creative engines, embedded hardware, media, and repeatable workflows.**

Primary launch line: **Your machine. Your agents. Your command.**

## Current product snapshot

Product documentation reconciled on **23 November 2026** from the English and Spanish development sources and the matching Tlachihuani/website evidence. **Tlamatini 1.97.0 remains the latest released version.** The documentation refresh does not change runtime code or version metadata. The existing website design is unchanged.

Multi-document Canvas supports explicit per-document context; merely opening a tab does not include it in a prompt. The signed-in website can send real prompts to a ready, locally approved account through XT and Remote-Controller. Phone prompt/answer, reload and approval display were confirmed for English. Denial/no-execution, cancellation, reconnect and other-edition phone acceptance remain unfinished. Ask Execs is selective; Netstat is exempt. The HTTPS website relay is not end-to-end or post-quantum encrypted and does not capture phone audio. See [remote behavior and evidence](../docs/remote-prompts.md).

| Metric | Current value |
| --- | ---: |
| Release | 1.97.0 |
| Tracked files | 1,920 |
| Effective authored lines | 385,010 |
| Physical text lines | 634,736 |
| Workflow agents | 87 |
| Wrapped chat-agent tools | 68 |
| Core Python tools | 21 |
| ACPX/Skill tools | 12 |
| MCP supervisor tools | 10 |
| Total built-in Multi-Turn tools | 111 |
| Skills | 29 |
| Requirements | 264 |
| Frontend JavaScript modules | 65 |
| Frontend CSS files | 31 |
| Frontend HTML templates | 10 |
| Django migrations | 226 |

## Deliverables

| Deliverable | Location | Gate |
| --- | --- | --- |
| Launch and go-to-market blueprint | `strategy/launch_blueprint.md` | Claims map to live evidence |
| Product claims ledger | `research/product_claims_ledger.md` | No stale or invented claims |
| Brand and visual system | `brand/brand_system.md` | One coherent XAIHT/Tlamatini identity |
| Commercial logo suite | `brand/logo/` | SVG master, PNG exports, monochrome variants |
| Advertising image gallery | `assets/gallery/` | At least 20 distinct, inspected campaign images |
| Campaign prompt and provenance ledger | `assets/prompts/` | One final prompt record per image |
| Launch website experience | `src/` and `public/images/campaign/` | Production build and responsive review |
| Investor pitch deck | `decks/XAIHT_Tlamatini_Investor_Pitch.pptx` | Rendered slide-by-slide with no overlap |
| Competition, threats, and opportunities deck | `decks/XAIHT_Competition_Threats_Opportunities.pptx` | Sourced comparison, no fabricated parity |
| Regional impact paper | `paper/Tlamatini_Global_Regional_Impact.pdf` | Methods, limitations, references, rendered QA |
| Source and documentation audit | `research/project_source_and_documentation_audit.md` | Records scope, authority, drift, and campaign implications |

## Truth rules

1. Git, current source, and executable inventory outrank old badges or copied marketing text.
2. Current capability and proposed commercial service are visibly separated.
3. Security, privacy, cost, productivity, and impact claims include scope and limitations.
4. Plain-Python agents are user-controlled operating code. The user owns authorization, credential scope, target selection, and operational jurisdiction.
5. The launch presents Tlamatini as an operator layer, not as a magical replacement for engineering judgment.
6. Regional impact estimates are scenarios, not forecasts, and must not be presented as measured Tlamatini outcomes.

## Regenerating the reviewed documents

The 23 November documentation pass preserves generator code. The existing paper
generator still contains July product-snapshot constants; this review supplied
the current version, inventory and cover metadata in memory. Future regeneration
must take the product values from the current ledger above, while retaining the
15 July dates of external research. The reviewed cover preserves the photograph's
aspect ratio and wraps the full title at word boundaries. Keep the Markdown
paper, extracted TXT, PDF and editable deck claims consistent, then render every
page and slide again.

The English and Spanish desktop guides at
`docs/changes/2026-11-23-hosted-remote-prompts.md` in their respective repositories
contain the shared PDF/PPTX chapter data and regeneration instructions. Those
instructions extend the existing architecture chapter rather than adding a tenth
contents entry. Preserve the dated atlas inventory when regenerating its current
remote-control supplement. A documentation regeneration does not change release
numbers or establish new runtime test results.
