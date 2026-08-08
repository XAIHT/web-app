# XAIHT / Tlamatini Source and Documentation Audit

Snapshot date: 2026-07-15

## Scope

The campaign analysis covered two working repositories:

- Product source: `C:\Development\Tlamatini`.
- Public website: `C:\Development\XAIHT\web-app`.

The review reconciled live source, Git state, Markdown documentation, generated PDF/PPTX dossiers, website implementation, public copy, and current visual assets. Existing uncommitted work in both repositories was treated as user-owned and preserved.

## Authoritative product state

The live documentation generator in `Tlamatini/agent/doc_generation/complete_project_docs.py` reported:

| Measure | Verified value |
| --- | ---: |
| Release | `v1.41.3` |
| Tracked files | 839 |
| Effective authored lines | 176,259 |
| Physical text lines | 248,443 |
| Workflow agents | 85 |
| Wrapped chat-agent tools | 62 |
| Core Python tools | 20 |
| ACPX/Skill tools | 12 |
| Total Multi-Turn tools | 94 |
| Skills | 27 |
| Requirements | 79 |
| JavaScript modules | 32 |
| CSS files | 9 |
| HTML templates | 4 |
| Django migrations | 176 |

Authority order used throughout the campaign:

1. Live source and executable inventory.
2. Current Git tag and history.
3. Current generated PDF/PPTX dossier.
4. README and Book for stable operator narrative.
5. Website copy after reconciliation.

## Markdown documentation review

The Tlamatini repository contains 160 tracked Markdown files. They span:

- Primary handbooks: `README.md`, `BookOfTlamatini.md`, `CLAUDE.md`, `GEMINI.md`, and `KIMI.md`.
- Architecture and operating guides: `ACPX.md`, `TLAMATINI_MCP.md`, `VERSIONING.md`, `agents_descriptions.md`, and `docs/claude/`.
- Agent, skill, MCP, messaging, hardware, release, performance, and companion-app documentation.
- Project memory and historical implementation notes under `.claude/memory/`.
- Agent-local READMEs and all 27 `SKILL.md` packages.

All tracked Markdown paths were indexed before the campaign narrative was written. The longest and most authoritative prose surfaces were then reconciled against source counts rather than accepted as static truth.

Key findings:

- The README and Book already carry the clear user-jurisdiction disclaimer for plain-Python agents. The campaign preserves that boundary and does not turn readability into a safety guarantee.
- Static handbook and copied website surfaces still carried `v1.40.1`, `75 tools`, or older agent totals in places. New campaign assets use the live `v1.41.3`, 94 Multi-Turn tools, 85 workflow agents, and 27 skills.
- Historical planning, release, and performance documents are valuable provenance, but they do not override current source state.
- Capability breadth is unusually high, but many paths depend on external applications, boards, credentials, models, connectors, or local toolchains. Every commercial claim therefore includes a boundary or prerequisite.

## PDF and PPTX review

The Tlamatini repository tracks two PDFs and one PPTX:

- `tlamatini_app_summary.pdf`: current 56-page generated project dossier.
- `Tlamatini/agent/doc_generation/test_output.pdf`: one-page generator test artifact, not a product dossier.
- `Tlamatini_eXtended_Artificial_Intelligence_Humanly_Tempered.pptx`: current 142-slide technical dossier.

The current dossier uses the live generator inventory, records release deltas and responsibility language, and includes a complete project tree. Its generated counts were used as the quantitative campaign baseline. The new commercial decks do not replace this technical dossier; they serve different audiences and preserve editable slide objects plus rendered QA evidence.

## Product architecture conclusions

The source and documentation converge on five commercially important product surfaces:

1. **Project intelligence:** hybrid FAISS/BM25 retrieval, source context, native folder selection, and self-knowledge.
2. **Human-commanded execution:** Multi-Turn, Ask Execs, Step-by-Step, execution reports, cancellation, and reusable `.flw` output.
3. **Real-world bridges:** Unreal Engine, Blender, STM32, ESP32, ESPHome, Arduino, browser, desktop, voice, image, audio, video, messaging, and authorized network tooling.
4. **External-agent coordination:** ACPX command-line delegation and MCP-based tool exchange.
5. **Inspectable extension:** readable plain-Python agents and `SKILL.md` playbooks under explicit user jurisdiction.

This supports the launch category: **human-commanded AI operations for builders whose software touches the real world**.

## Website implementation review

The website is a React 19 / Vite application with three original routes (`/`, `/tlamatini`, `/login`), a bilingual English/Spanish content dictionary, GSAP-enhanced product sections, and a dark gold/jade visual vocabulary.

Pre-campaign findings:

- Public copy was rich but dense and still used stale `v1.40.1` and 75-tool figures.
- The visual system mixed science-fiction Mesoamerican structures with a glossy illustrated Tlamatini character, weakening commercial consistency.
- There was no dedicated launch route, campaign gallery, commercial identity system, or investor-facing narrative.

Campaign implementation:

- Added `/launch` as a bilingual, full-bleed campaign experience.
- Added the commercial XAIHT/Tlamatini logo system and a consistent adult technical-operator identity.
- Added 20 distinct campaign scenes plus one master reference.
- Updated public release/tool claims to `v1.41.3` and 94 Multi-Turn tools.
- Preserved existing site architecture and the user-owned deleted documentation snapshots.

## Claims and impact boundaries

The campaign does not claim customers, revenue, market share, certifications, benchmark leadership, production deployments, or measured Tlamatini productivity effects.

External scientific and economic evidence is used only to establish context:

- Occupational exposure and likely transformation from ILO.
- Task-level productivity evidence from NBER and Science.
- Connectivity constraints from ITU.
- Connectivity, compute, context, and competency from the World Bank.
- Employment exposure from IMF.
- AI concentration from UNCTAD.
- Data-center electricity demand from IEA.
- Human-centered education and research governance from UNESCO.

The impact paper explicitly separates these observed findings from Tlamatini scenarios and proposes tests that can falsify the campaign hypotheses.

## Final campaign implication

Tlamatini should not be launched as a generic autonomous assistant. Its credible position is an inspectable operator layer that knows a project, acts across heterogeneous technical surfaces, coordinates external agents, captures successful workflows, and leaves authorization and consequences with the human operator.

