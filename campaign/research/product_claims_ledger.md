# XAIHT / Tlamatini Product Claims Ledger

Snapshot date: 2026-07-15

Authoritative product root: `C:\Development\Tlamatini`

Website root: `C:\Development\XAIHT\web-app`

## Authority order

1. Live source and executable inventory.
2. Current Git tag and history.
3. Current generated project dossier.
4. README and Book for stable operator narrative.
5. Website copy only after reconciliation with the sources above.

## Approved current claims

| Claim | Evidence | Qualification |
| --- | --- | --- |
| Current resolved release is `v1.41.3` | `git describe --tags` and `agent/version.py` | HEAD is one documentation commit after the tag |
| 85 workflow agents | 85 directories under `Tlamatini/agent/agents/` containing `config.yaml`; generator `collect_context()` | Agent count is separate from tools and skills |
| 94 Multi-Turn tools | 62 wrapped chat-agent tools + 20 core Python tools + 12 ACPX/Skill tools from the live generator | Say `Multi-Turn tools`, not generic integrations |
| 27 skills | 27 directories under `Tlamatini/agent/skills_pkg/` containing `SKILL.md` | Skills are playbooks, not workflow agents |
| Local-first application and retrieval | Django/Channels app, SQLite, FAISS/BM25 stack in source and architecture docs | Configured model inference and external connectors may be remote |
| Visual workflow designer | ACP templates, JavaScript modules, flow compiler, `.flw` schema | Saved flows still depend on configured local tools and credentials |
| Human-gated execution | Ask Execs permission broker, Step-by-Step mode, hard-cancel run epoch | Gates work only when enabled and cannot replace user judgment |
| Direct Unreal Engine control | Unrealer plus XAIHT Unreal MCP fork and documented 53-command surface | Unreal Editor/plugin must be installed and reachable |
| One-prompt Unreal Engine 5.8 C++ scaffold | Unreal scaffold implementation and docs | Depends on local engine/toolchain availability |
| Direct Blender control | Blenderer and Blender MCP integration | Blender and its add-on/listener must be available |
| STM32 workflows | STM32er build/flash/observe path and safety preflight | Hardware, toolchain, and authorization remain user responsibilities |
| ESP32/ESP8266 PlatformIO workflows | ESP32er source and agent configuration | PlatformIO, board, port, and permissions must be configured |
| ESPHome and Arduino workflows | ESPHomer and Arduiner agents | Toolchains and compatible hardware are external dependencies |
| Tlamatini can speak and listen | Talker and Whisperer agents and tests | Models/devices must be installed and configured |
| Image and video interpretation | Triple-model Image-Interpreter and Video-Analyzer agents | Model output is probabilistic and must not be treated as a safety certification |
| External agent delegation | ACPX supports multiple coding-agent CLIs | Availability, licenses, credentials, and behavior belong to those providers |
| External MCP connectivity | Universal MCP manager supports stdio, HTTP, SSE, and WebSocket | External servers expand the attack and reliability surface |
| Plain-Python agents are inspectable | Agent source is shipped as readable Python | Readability does not guarantee safety |
| MIT-licensed core | Repository `LICENSE` | Third-party tools, models, services, and connectors keep their own terms |

## Current quantitative snapshot

Collected through `Tlamatini/agent/doc_generation/complete_project_docs.py::collect_context()`:

| Metric | Current value |
| --- | ---: |
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
| Frontend JavaScript modules | 32 |
| Frontend CSS files | 9 |
| Frontend HTML templates | 4 |
| Django migrations | 176 |

## Stale claims to remove from new campaign surfaces

- `v1.40.1` as the current release.
- `75 tools` as the current Multi-Turn total.
- `82 agents` or `84 agents` as the current workflow-agent total.
- `v1.26.0` as the current release when it appears in carried historical prose.
- Fixed third-party subscription prices as a durable value claim.
- Any statement that all inference is local.
- Any statement that Tlamatini guarantees security, correctness, authorization, or hardware safety.

## Required responsibility language

The workflow agents in `Tlamatini/agent/agents/` are plain-Python programs on purpose. They are readable, editable, and auditable operating code under the user's control. When a user enables, configures, modifies, chains, or runs them, their targets, prompts, credentials, files, systems, networks, devices, and consequences fall under that user's jurisdiction and responsibility.

Campaign copy may explain safeguards, but it must never use safeguards to erase this boundary.

## Research claims approved for the impact paper

These are contextual evidence, not measured Tlamatini outcomes.

| Evidence | Finding suitable for citation | Source |
| --- | --- | --- |
| Global occupational exposure | One in four workers is in an occupation with some GenAI exposure; transformation is more likely than full job automation | ILO Working Paper 140, 2025 |
| Customer-support field evidence | AI assistance increased issues resolved per hour by 14% on average and 34% for novice/low-skilled workers | NBER Working Paper 31161 |
| Professional writing experiment | Generative AI reduced completion time and improved output quality, with larger gains for weaker initial performers | Noy and Zhang, Science 381, 2023 |
| Connectivity boundary | About 6 billion people were online in 2025 while 2.2 billion remained offline | ITU Facts and Figures 2025 |
| Development foundations | Inclusive AI adoption depends on connectivity, compute, context, and competency | World Bank Digital Progress and Trends Report 2025 |
| AI market concentration | High-income countries dominate models, startups, and venture funding; open-source adaptation can broaden participation | World Bank 2025 and UNCTAD Technology and Innovation Report 2025 |
| Energy constraint | Data centers used about 415 TWh, or 1.5% of global electricity, in 2024 and are projected near 945 TWh by 2030 in the IEA base case | IEA Energy and AI, 2025 |
| Education governance | Human-centered validation, privacy protection, and teacher/student competencies are prerequisites | UNESCO guidance and competency frameworks |

## External research links

- ILO: https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure
- World Bank: https://www.worldbank.org/en/publication/dptr2025-ai-foundations/report
- ITU: https://www.itu.int/itu-d/reports/statistics/facts-figures-2025/
- NBER: https://www.nber.org/papers/w31161
- Science: https://doi.org/10.1126/science.adh2586
- IMF: https://www.imf.org/en/publications/staff-discussion-notes/issues/2024/01/14/gen-ai-artificial-intelligence-and-the-future-of-work-542379
- UNCTAD: https://unctad.org/system/files/official-document/tir2025overview_en.pdf
- IEA: https://www.iea.org/reports/energy-and-ai/executive-summary
- UNESCO: https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research

## Competitive research links

- OpenAI Codex: https://openai.com/index/gartner-2026-agentic-coding-leader/
- Anthropic Claude Code: https://www.anthropic.com/product/claude-code
- GitHub Copilot: https://github.com/features/copilot
- Cursor Background Agents: https://docs.cursor.com/background-agent
- n8n AI Agents: https://n8n.io/ai-agents/
- Dify: https://dify.ai/
- LangGraph: https://www.langchain.com/langgraph

