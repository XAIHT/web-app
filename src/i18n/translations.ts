/**
 * Full bilingual content dictionary for the XAIHT site.
 *
 * `en` is authored first and its shape becomes the `Translations` type, so the
 * `es` object is checked against it at compile time — if a key is missing or
 * mistyped in Spanish, `tsc` fails. Brand and feature names (Tlamatini, XAIHT,
 * Multi-Turn, Ask Execs, ACPX, RAG, FAISS, the agent identifiers, tool menu
 * paths, version tags) are intentionally kept untranslated in both languages.
 *
 * Translatable text lives here; structural data that never changes between
 * languages (colors, icons, images, shell snippets, agent identifiers) stays
 * in the components and is zipped with these strings by index.
 */

export type Lang = 'en' | 'es';

const en = {
  nav: {
    overview: 'Overview',
    architecture: 'Architecture',
    agents: 'Agents',
    tools: 'Tools',
    features: 'Features',
    installation: 'Installation',
    tlamatini: 'Tlamatini',
    home: 'Home',
    github: 'GitHub',
    login: 'Login',
    logout: 'Logout',
    user: 'User',
    language: 'Language',
    switchToEnglish: 'Switch to English',
    switchToSpanish: 'Cambiar a Español',
  },

  ascii: {
    phrases: [
      'eXtended Artificial Intelligence Humanly Tempered',
      '( XAIHT )',
      'Tlamatini v1.17.0',
      'Local-First AI',
      '53 Unreal MCP Commands',
      'Multi-Turn Operation',
      '79 Multi-Turn Tools',
      '27 Skill Packages',
      '74 Workflow Agents',
      'Ask Execs Approval Gate',
      'Windows 10|11 Installed App',
      'Bullet-Proof Carried-Python Installer',
      '4096 Iteration Ceiling',
      'Unreal Engine MCP',
      'Zero-Config STM32 MCP',
      'STM32F4x Firmware Automation',
      'ESP32er PlatformIO Bridge',
      'Arduiner Arduino CLI Bridge',
      'Webcam + Microphone Capture',
      'On-Screen Video Playback',
      'Self-Modifiable Builds',
      'Native Context Picker',
      'Kalier Configured Kali Bridge',
      'Playwrighter Browser Automation',
      'Windower Desktop Control',
      'Commit-Aware Reviewer',
      'High-Detail Embedding',
      'Reviewer + Analyzer',
      'Visual Workflows',
    ],
  },

  home: {
    overview: {
      label: 'Overview',
      title: 'Tlamatini — The AI Agentic Knowledge of a Senior Developer',
      desc: 'Tlamatini v1.17.0 is a locally deployed, self-aware, Unreal Engine-enabled AI developer assistant with hybrid RAG over your source, a 79-tool, 4096-iteration Multi-Turn loop, Ask Execs approval gates before state-changing tool execution, a bullet-proof one-click installer that carries its own Python 3.12.10 so end users install only Ollama and the models, Windows 10|11 installed-app registration for familiar uninstall paths, opt-in ACPX delegation to external coding-agent CLIs, the ACPX-Skills menu for 27 skill packages, in-app Config and DB menus, native nested-folder context loading, reusable .flw workflows, 74 drag-and-drop agent types, STM32er critical-mission firmware automation, ESP32er PlatformIO firmware build / upload / monitor flows, Arduiner Arduino-CLI firmware build / upload / monitor flows, a full media-I/O family for webcam, microphone, speaker, and on-screen video capture and playback, Kalier authorized Kali assessment workflows, the 53-command Unreal MCP surface, Playwrighter real-browser automation, Windower desktop control, strict Pythonxer correctness gates, compile-checked file execution, commit-aware Reviewer and Analyzer gates, high-detail embedding opt-in, GPU-aware context loading, and her own self-knowledge map.',
      viewGithub: 'View on GitHub',
      documentation: 'Documentation',
      stats: {
        agents: 'Agents',
        skills: 'Skills',
        version: 'Version',
        iterations: 'Iterations',
      },
    },
    vision: {
      label: 'XAIHT',
      title: 'Vision, Mission, Concept',
      desc: "XAIHT's flagship project: local-first automation, grounded code understanding, and developer-controlled AI execution.",
      cards: [
        {
          title: 'Vision',
          subtitle: 'Human Control, Tunable AI',
          description:
            "Tlamatini is built around the idea that developer AI should stay under the user's control: local context, explicit toggles, Ask Execs approvals, Windows uninstall registration for installed builds, live model settings, safe database handling, inspectable workflows, ACPX-Skills catalog control, Unreal Engine-aware work, STM32F4x, ESP32, and Arduino firmware paths with preflight checks, webcam, microphone, speaker, and on-screen video capture and playback, strict Python execution gates, opt-in external routes, review and analysis gates, and her own self-knowledge map.",
        },
        {
          title: 'Mission',
          subtitle: 'Make the Assistant a Doer',
          description:
            'The mission is to combine code-aware RAG, native nested-folder context loading, Unreal Engine-enabled project assistance, STM32F4x, ESP32, and Arduino firmware automation, webcam, microphone, speaker, and on-screen video capture and playback, tunable embedding depth, GPU-aware context loading, 79-tool / 4096-iteration Multi-Turn orchestration, Ask Execs checkpoints, Pythonxer correctness gates, honest foreground execution, Windows 10|11 uninstall readiness, Exec Report audit tables, opt-in ACPX delegation, skill-catalog administration, Windower desktop control, commit-aware Reviewer and Analyzer quality gates, and visual flows.',
        },
        {
          title: 'Concept',
          subtitle: 'The One Who Knows',
          description:
            'Tlamatini means "one who knows." In practice, she reads your code, Unreal Engine projects, STM32 firmware goals, ESP32 PlatformIO projects, and Arduino sketches, can watch a webcam, hear a microphone, and play sound and video back, protects loaded project context from being confused with her self-knowledge, lets you tune models, endpoints, database snapshots, and skills from the UI, reviews diffs, scans for risk, and compiles chat or canvas ideas into reusable .flw workflows.',
        },
      ],
    },
    architecture: {
      overview: {
        label: 'Architecture',
        title: 'Built as a Local AI Control Plane',
        desc: 'Tlamatini connects the browser, native project context picker, self-knowledge map, Config, DB, and ACPX-Skills menus, Multi-Turn operator with Ask Execs approval gates, Windows installed-app registration, Flow Compiler, Unreal MCP, STM32 Template Project MCP, ESP32er PlatformIO automation, Arduiner Arduino-CLI automation, the webcam, microphone, speaker, and on-screen video media family, and ACPX runtime through one local command surface.',
        card1: {
          title: 'Chat, Config, DB, Skills, and Context',
          desc: 'The chat surface keeps Multi-Turn, Ask Execs, Exec Report, ACPX, internet context, native nested-folder context, Models / URLs Config dialogs, DB controls, and ACPX-Skills Browse / Configure / Diagnostics / Reload close at hand without asking users to hunt through files.',
        },
        card2: {
          title: 'LLM, ACPX, Skills, and GPU Guard',
          desc: 'Ollama, Claude, and Qwen cover the model surface, ACPX delegates to external coding CLIs only when selected, STM32er guards ST-LINK firmware work, ESP32er drives PlatformIO builds and uploads, Arduiner drives Arduino-CLI builds and uploads, Kalier reaches the configured Kali server, Playwrighter drives real browser flows, Windower commands whole windows, the media family captures webcam, microphone, and screen and plays sound and video back, SkillHarness runs markdown playbooks, Tlamatini carries her self-knowledge into every chain, and GPU hosts get a pre-flight warning before heavy embedding loads can slow the machine down.',
        },
      },
      rag: {
        label: 'RAG System',
        title: 'Advanced Retrieval-Augmented Generation',
        desc: 'Hybrid retrieval combines FAISS vectors, BM25 keywords, Reciprocal Rank Fusion, code-aware metadata for source and Unreal Engine projects, a lighter default embedding model, native nested-folder selection, loaded-context priority over her private self-knowledge, GPU-aware pre-flight warnings, and a fallback path that keeps source access alive.',
        nodes: [
          { name: 'Load Context', desc: 'Native picker for nested folders' },
          { name: 'Nomic Default', desc: 'Light default with high-detail opt-in' },
          { name: 'FAISS + BM25', desc: 'Hybrid retrieval with RRF fusion' },
          { name: 'Context Priority', desc: 'Loaded projects outrank self-knowledge' },
        ],
      },
      multiTurn: {
        label: 'Multi-Turn',
        title: 'Request-Scoped Orchestration',
        desc: 'When Multi-Turn is enabled, the chat becomes an operator: a planner selects the relevant tools, Ask Execs can pause state-changing calls for human approval, Pythonxer rejects broken scripts early, and successful work becomes reusable workflows.',
        items: [
          {
            title: 'Global Execution Planner',
            desc: 'Builds a request-scoped plan and binds a focused set of relevant tools across long autonomous runs.',
          },
          {
            title: 'Ask Execs Gate',
            desc: 'Pauses before state-changing Tool, MCP, Agent, or Skill calls so the operator can proceed or deny.',
          },
          {
            title: 'Exec Report',
            desc: 'Appends per-agent operation tables for state-changing tool calls before chat history is saved.',
          },
          {
            title: 'Create Flow',
            desc: 'Successful Multi-Turn runs can download a .flw file normalized by the backend contract layer.',
          },
        ],
      },
    },
    workflow: {
      label: 'Workflow Designer',
      title: 'Drag, Drop, Orchestrate',
      desc: 'The Visual Workflow Designer lets you drag 74 agent types onto a canvas, wire them into reusable .flw workflows, preserve Parametrizer mappings, validate the live graph, build and flash STM32F4x firmware through a preflighted MCP bridge, build and upload ESP32 firmware through PlatformIO, build and upload Arduino firmware through the Arduino CLI, capture webcam, microphone, and screen and play sound and video back, run authorized Kali assessments through a configured server, drive 53-command Unreal MCP projects, drive real browser flows, command desktop windows, review diffs, scan for security findings, add human approval checkpoints, and bring repeatable agentic automation to Unreal Engine-enabled project work.',
      categories: [
        { name: 'Control' },
        { name: 'Routing' },
        { name: 'Logic Gates' },
        { name: 'Action' },
        { name: 'Cryptography' },
        { name: 'Utility' },
        { name: 'Terminal / Monitoring' },
        { name: 'AI / Design' },
      ],
    },
    tools: {
      label: 'Tools',
      title: 'Tunable, Guarded, Agentic Tooling',
      items: [
        { desc: 'Tune model names from the chat UI with validation', type: 'Config' },
        { desc: 'Edit endpoint values, including Kali, STM32 MCP, ESP32 PlatformIO, and Arduino CLI defaults, without hand-editing JSON', type: 'Config' },
        { desc: 'Snapshot the live SQLite database to a directory you choose', type: 'DB' },
        { desc: 'Stage a database for the next clean Tlamatini start-up', type: 'DB' },
        { desc: 'Inspect all 27 skill bodies, permissions, inputs, outputs, and budgets before use', type: 'Skills' },
        { desc: 'Enable or hide skills from the planner with the same feel as Tools and MCPs', type: 'Skills' },
        { desc: 'Catch missing tools, MCPs, ACPX agents, and orphan skill rows before runtime', type: 'Skills' },
        { desc: 'Rescan SKILL.md packages without restarting Tlamatini', type: 'Skills' },
        { desc: 'Installed builds appear where Windows 10|11 users expect to remove applications', type: 'Installer' },
        { desc: 'Prompt before each state-changing Multi-Turn Tool, MCP, Agent, or Skill call, then proceed or fail safe', type: 'Runtime' },
        { desc: 'Drive the public XAIHT Unreal MCP fork with 53 editor commands across nine categories', type: 'Game Dev' },
        { desc: 'Scaffold, build, flash, and observe STM32F4x firmware with zero-config MCP bootstrap and fail-safe hardware preflight', type: 'Embedded' },
        { desc: 'Scaffold, build, upload, and monitor ESP32 firmware through zero-config PlatformIO Core automation', type: 'Embedded' },
        { desc: 'Scaffold, build, upload, and monitor Arduino, AVR, and SAMD firmware through zero-config Arduino-CLI automation, selected by FQBN', type: 'Embedded' },
        { desc: 'Capture a photo or a video segment from a system webcam, saved with a collision-proof name', type: 'Media' },
        { desc: 'Record microphone audio to a WAV file with selectable device, sample rate, and software gain', type: 'Media' },
        { desc: 'Play an audio file through the speakers with a software volume and a play-for-N-seconds loop or truncate', type: 'Media' },
        { desc: 'Play a video file with sound on a chosen display, with fullscreen, aspect, and play-for-N-seconds control', type: 'Media' },
        { desc: 'Drive a real browser through scripted logins, forms, assertions, screenshots, and downloads', type: 'Browser' },
        { desc: 'Focus, move, resize, tile, maximize, minimize, and close Windows app windows by title', type: 'Desktop' },
        { desc: 'Coordinate authorized Kali Linux recon through the configured MCP-Kali-Server URL', type: 'Security' },
        { desc: 'Save workflows so they can be loaded and run again', type: 'Flow' },
        { desc: 'Reviews diffs with commit-state awareness and an APPROVE, REQUEST_CHANGES, or COMMENT verdict', type: 'Canvas Agent' },
        { desc: 'Runs deterministic static-analysis, secret, and dependency scans as a workflow gate', type: 'Canvas Agent' },
        { desc: 'Compresses or decompresses archives so downstream agents can work with the contents', type: 'Action' },
        { desc: 'Warns GPU hosts before heavy context embedding loads and keeps context loading humane', type: 'RAG' },
        { desc: 'A broad action surface with approval checkpoints, a 4096-iteration ceiling, and a 256 tool-call hard stop', type: 'Runtime' },
        { desc: 'Compile and Ruff checks stop broken Python before execution while downstream flow control stays explicit', type: 'Runtime' },
        { desc: 'Visible script windows open only when requested, with compile checks before launch', type: 'Runtime' },
        { desc: 'Wrapped workflow agent for shell operations', type: 'Runtime' },
        { desc: 'Wait primitive for smooth autonomous Multi-Turn flows', type: 'Runtime' },
        { desc: 'Desktop pointer automation with click, drag, and scroll', type: 'Desktop' },
        { desc: 'Start an external coding-agent CLI session', type: 'ACPX' },
        { desc: 'Pass one external agent answer to another in a single call', type: 'ACPX' },
        { desc: 'Run enabled SKILL.md packages through the SkillHarness, including commit-aware code-review and security-audit', type: 'Skill' },
      ],
    },
  },

  footer: {
    ctaTitle: 'Run Tlamatini on Your Own Machine',
    ctaDesc: 'Tlamatini v1.17.0 makes installation bullet-proof — the one-click installer carries its own Python 3.12.10, plus Java, Git, and Playwright browsers, so you install only Ollama and the models. It rides on the recent media-I/O family — Camcorder webcam capture, Recorder microphone capture, AudioPlayer speaker playback, and VideoPlayer on-screen video with sound — plus Arduiner, ESP32er, and STM32er firmware bridges, Windows 10|11 installed-app registration, Ask Execs approval gates, strict Pythonxer execution, Hybrid RAG, live Config, DB, and ACPX-Skills controls, 79-tool Multi-Turn orchestration, GPU-aware context loading, 27 skills, and 74 workflow agents.',
    viewSource: 'View Source',
    documentation: 'Documentation',
    github: 'GitHub',
    reportIssue: 'Report Issue',
    builtWith: 'Built with Django Channels + Ollama',
  },

  login: {
    title: 'Welcome to XAIHT',
    desc: 'Sign in to access your XAIHT account and keep project preferences available across sessions.',
    signIn: 'Sign in with Google',
    oauthNote: 'Authentication is handled via Google OAuth 2.0.',
  },

  notFound: {
    message: 'This XAIHT page is not available.',
    back: 'Back to XAIHT',
  },

  tlamatini: {
    hero: {
      label: 'XAIHT / Projects',
      subtitle: 'Local-First AI Developer Assistant v1.17.0',
      desc: 'Hybrid RAG, self-knowledge, optional self-modify builds, native nested-folder context, live model configuration, safe DB backup and swap controls, ACPX-Skills catalog administration, 79-tool, 4096-iteration Multi-Turn orchestration with Ask Execs approval gates, Windows 10|11 installed-app registration, strict Pythonxer execution, GPU-aware context loading, high-detail embedding opt-in, opt-in ACPX delegation, and a 74-agent workflow designer with Arduiner, ESP32er, STM32er, the webcam, microphone, speaker, and on-screen video media family, Kalier, the 53-command Unreal MCP surface, Playwrighter, Windower, Reviewer, and Analyzer.',
    },
    overview: {
      label: 'Project Overview',
      title: 'One Who Knows, One Who Can Act',
      p1Strong: 'Tlamatini',
      p1Rest: ' means "one who knows." She is a local app you run on your own machine, combining code-aware retrieval, her own self-knowledge map, live configuration, database snapshot controls, Windows installed-app polish, ACPX-Skills catalog control, guarded tool execution, opt-in external coding-agent delegation, Unreal Engine-enabled project work, STM32, ESP32, and Arduino firmware automation, webcam, microphone, speaker, and on-screen video capture and playback, commit-aware code review, security analysis, and a visual automation canvas.',
      p2: 'The v1.17.0 build makes getting started bullet-proof: the one-click installer now carries its own self-contained Python 3.12.10 — along with Java, Git, and the Playwright browsers — so an end user installs only Ollama and the models, with nothing else to set up. The recent media-I/O family still rounds out her senses — Camcorder webcam capture, Recorder microphone capture, AudioPlayer speaker playback, and VideoPlayer on-screen video with sound — alongside Arduiner, ESP32er, and STM32er firmware automation. She carries 74 agents, 79 Multi-Turn tools, 27 skills, three microcontroller bridges, Unreal Engine support, ACPX-Skills, Config, DB, GPU warnings, self-knowledge, and saved .flw files close to the operator.',
      viewSource: 'View Source',
    },
    features: {
      label: 'Key Features',
      title: 'Capabilities at a Glance',
      items: [
        {
          title: 'Unreal Engine Enabled',
          description: 'Tlamatini brings local RAG, 4096-iteration action, external-agent delegation, and reusable workflow automation into Unreal Engine project work, including the 53-command XAIHT Unreal MCP fork.',
        },
        {
          title: 'Critical-Mission STM32er',
          description: 'STM32er lets Tlamatini scaffold, author, build, flash, and observe STM32F4x firmware with zero-config MCP bootstrap, STM32CubeIDE toolchains, ST-LINK validation, serial/SWD observation, and a fail-safe preflight before hardware-changing actions.',
        },
        {
          title: 'ESP32er PlatformIO Bridge',
          description: 'ESP32er lets Tlamatini scaffold, build, upload, and monitor ESP32 or ESP8266 firmware through PlatformIO Core, with first-run bootstrap, board and serial checks, and no IDE required.',
        },
        {
          title: 'Arduiner Arduino CLI Bridge',
          description: 'Arduiner is the third microcontroller agent: it scaffolds, builds, uploads, and monitors Arduino, AVR, and SAMD firmware through the zero-config Arduino CLI, picks the board by FQBN, auto-installs the matching core, and runs a fail-safe preflight before touching hardware.',
        },
        {
          title: 'Webcam, Mic, and Media Playback',
          description: 'A full media-I/O family rounds out the senses: Camcorder captures the webcam, Recorder captures the microphone, AudioPlayer plays sound through the speakers, and VideoPlayer plays video with audio on any display — the on-screen and audible companions to screen-capturing Shoter.',
        },
        {
          title: 'Multi-Turn Chat Operator',
          description: 'A chat surface with independent toggles for Multi-Turn, Ask Execs, Exec Report, ACPX, and internet context. She can choose from 79 tools, pause for approval, reject broken Python early, and turn successful work into repeatable flows.',
        },
        {
          title: 'Windows Installed-App Polish',
          description: 'Packaged builds register as installed Windows 10|11 applications, so users can remove Tlamatini through the familiar system uninstall experience instead of hunting for a folder.',
        },
        {
          title: 'Hybrid RAG with GPU Guard',
          description: 'Directory, file, or canvas context is grounded through FAISS + BM25 retrieval. Native nested-folder picking reaches deep projects, loaded context outranks her self-knowledge, and high-detail embeddings stay guarded by GPU pre-flight warnings.',
        },
        {
          title: 'Visual Workflow Designer',
          description: 'Drag-and-drop workflow creation with 74 agent types, .flw save/load, live Validate, Start-time compilation, ESP32er PlatformIO flows, STM32er firmware pipelines, Arduiner Arduino-CLI flows, webcam, microphone, speaker, and on-screen video media nodes, Kalier assessment runs, Playwrighter browser flows, Windower desktop-window control, strict Pythonxer paths, 53-command Unrealer flows, Reviewer, Analyzer, FlowCreator, and FlowHypervisor.',
        },
        {
          title: 'ACPX External Delegation',
          description: 'ACPX delegates to external coding-agent CLIs when you choose, while ACPX-Skills gives the operator Browse, Configure, Diagnostics, and Reload controls for 27 SKILL.md packages, including commit-aware code-review, security-audit, and kali-pentest.',
        },
        {
          title: 'Config, DB, and ACPX-Skills Menus',
          description: 'Validated Models, URLs, Kali, STM32 MCP, ESP32 PlatformIO, and Arduino CLI settings, native context picking, live SQLite backup / Set DB controls, and skill enablement diagnostics sit together as operator-grade controls.',
        },
      ],
    },
    installation: {
      label: 'Quick Start',
      title: 'Installation',
      desc: 'The one-click installer is bullet-proof — it carries its own Python 3.12.10, Java, Git, and Playwright browsers, so end users install only Ollama and the models. Prefer source? Run from a clone with Python 3.12.10 and Ollama using the steps below. Either way, installed builds register with Windows 10|11 uninstall mechanisms, while Config, native context picking, DB snapshots, and the zero-config ESP32er PlatformIO and Arduiner Arduino-CLI bootstraps stay available inside Tlamatini.',
      steps: [
        { label: 'Install Ollama' },
        { label: 'Pull Default Models' },
        { label: 'Clone Source' },
        { label: 'Setup Environment' },
        { label: 'Initialize Database' },
        { label: 'Run Application' },
      ],
    },
    agents: {
      label: 'Agent Ecosystem',
      title: '74 Workflow-Agent Types',
      desc: 'The catalog spans control, routing, logic, action, cryptography, utility, terminal monitoring, and AI design agents, including Arduiner, ESP32er, STM32er, the Camcorder, Recorder, AudioPlayer, and VideoPlayer media family, Kalier, Playwrighter, Windower, TeleTlamatini, WhatsTlamatini, ACPXer, 53-command Unrealer, commit-aware Reviewer, Analyzer, De-Compresser, strict Pythonxer, FlowCreator, 27 ACPX-Skills packages, Ask Execs approval around state-changing Multi-Turn execution, her self-knowledge map, Windows installed-app polish, and GPU-aware context safeguards around the RAG entry point.',
      groupLabel: 'Agents',
      groups: [
        {
          category: 'Control',
          agents: [
            { desc: 'Initiates workflow execution' },
            { desc: 'Terminates agents, launches post-cleanup' },
            { desc: 'Pattern-based agent terminator' },
            { desc: 'Post-termination cleanup' },
            { desc: 'Waits duration_ms before continuing' },
            { desc: 'Scheduled HH:MM trigger' },
          ],
        },
        {
          category: 'Routing',
          agents: [
            { desc: 'Event-driven downstream launcher' },
            { desc: 'Automatic A/B path router' },
            { desc: 'Interactive A/B browser choice' },
            { desc: 'Persistent threshold router' },
          ],
        },
        {
          category: 'Logic Gates',
          agents: [
            { desc: 'Fires when either source completes' },
            { desc: 'Fires when both sources complete' },
            { desc: 'Generalized all-sources gate' },
          ],
        },
        {
          category: 'Action',
          agents: [
            { desc: 'Shell command execution' },
            { desc: 'Inline Python with compile and Ruff gating' },
            { desc: 'LLM prompt to log' },
            { desc: 'LLM log polling and one-shot summaries' },
            { desc: 'Raw web crawl and analysis' },
            { desc: 'Google search via Playwright' },
            { desc: 'Scripted browser flows with assertions' },
            { desc: 'Structured HTTP request agent' },
            { desc: 'Local Git operations' },
            { desc: 'SSH remote commands' },
            { desc: 'SCP file transfer' },
            { desc: 'Docker command runner' },
            { desc: 'Kubernetes command runner' },
            { desc: 'Semantic process finder' },
            { desc: 'Jenkins pipeline trigger' },
            { desc: 'SQL Server query execution' },
            { desc: 'MongoDB script execution' },
            { desc: 'Move or copy files' },
            { desc: 'Delete files with exclusions' },
            { desc: 'Screenshot capture' },
            { desc: 'Webcam photo and video capture' },
            { desc: 'Microphone audio capture to WAV' },
            { desc: 'Audio playback to speakers' },
            { desc: 'On-screen video playback with sound' },
            { desc: 'Click, drag, scroll, locate images' },
            { desc: 'Typing and hotkey chords' },
            { desc: 'Focus, arrange, resize, and close windows' },
            { desc: 'Write file content' },
            { desc: 'Parse DOCX, PPTX, XLSX, PDF' },
            { desc: 'Raw text extraction with fallback' },
            { desc: 'Compress or decompress archives' },
            { desc: 'Vision analysis of images' },
            { desc: 'JAR/WAR/CLASS decompilation' },
            { desc: 'Outbound Telegram message' },
            { desc: 'Telegram bridge to Tlamatini chat' },
            { desc: 'WhatsApp bridge via Cloud API' },
            { desc: 'Visual ACPX session lifecycle' },
            { desc: 'Unreal Engine MCP bridge with 53 commands' },
            { desc: 'Critical-mission STM32F4x firmware bridge' },
            { desc: 'PlatformIO ESP32 firmware bridge' },
            { desc: 'Arduino CLI firmware bridge (AVR / SAMD)' },
            { desc: 'Commit-state-aware diff review verdict' },
            { desc: 'Static-analysis and security findings gate' },
            { desc: 'Configured Kali Linux assessment bridge' },
          ],
        },
        {
          category: 'Cryptography',
          agents: [
            { desc: 'CRYSTALS-Kyber key pair' },
            { desc: 'Kyber encapsulation + AES encryption' },
            { desc: 'Kyber decapsulation + AES decryption' },
          ],
        },
        {
          category: 'Utility',
          agents: [
            { desc: 'Maps source logs into target config' },
            { desc: 'Backs up session logs and configs' },
            { desc: 'Inbound webhook and folder-drop ingress' },
            { desc: 'Provider webhook bridge' },
            { desc: 'Live infrastructure registry' },
          ],
        },
        {
          category: 'Terminal / Monitoring',
          agents: [
            { desc: 'LLM-powered log monitor' },
            { desc: 'LLM-powered port monitor' },
            { desc: 'SMTP email sender' },
            { desc: 'IMAP receiver with LLM analysis' },
            { desc: 'Browser notification and sound' },
            { desc: 'WhatsApp via TextMeBot' },
            { desc: 'Telegram receiver' },
            { desc: 'LLM watchdog over running agents' },
          ],
        },
        {
          category: 'AI / Design',
          agents: [{ desc: 'LLM designs flows from objectives' }],
        },
      ],
    },
    techStack: {
      label: 'Technology',
      title: 'Technology Stack',
      groups: [
        {
          category: 'Backend',
          items: ['Python 3.12.10', 'Django', 'Django Channels', 'Daphne ASGI'],
        },
        {
          category: 'RAG',
          items: ['FAISS', 'BM25', 'Native nested-folder picker', 'Loaded-context priority', 'High-detail embedding opt-in', 'GPU pre-flight warning'],
        },
        {
          category: 'LLM Backends',
          items: ['Ollama', 'Anthropic Claude API', 'Qwen vision', 'Configurable model tags'],
        },
        {
          category: 'Agent Runtime',
          items: ['79 Multi-Turn tools', 'Ask Execs approval gate', 'Pythonxer strict gate', '4096-iteration executor', '256 tool-call hard stop', 'ACPX external CLIs', 'ESP32er PlatformIO bridge', 'STM32er firmware bridge', 'Arduiner Arduino-CLI bridge', 'Camcorder / Recorder capture', 'AudioPlayer / VideoPlayer playback', 'Kalier configured Kali bridge', 'Playwrighter browser automation', 'Windower desktop control', '27 SKILL.md packages'],
        },
        {
          category: 'Workflow Runtime',
          items: ['Flow Compiler', 'Agent Contract registry', 'Reusable .flw workflows', 'ESP32 build / upload / monitor flows', 'STM32F4x build / flash / observe flows', 'Arduino build / upload / monitor flows', 'Webcam / microphone capture nodes', 'Speaker / on-screen video playback nodes', 'Kalier assessment pipelines', 'Playwrighter browser flows', 'Windower window control', 'Commit-aware Reviewer / Analyzer gates', '53-command Unreal MCP', 'Source and frozen modes'],
        },
        {
          category: 'Interfaces',
          items: ['Windows 10|11 uninstall registration', 'Config Models dialog', 'Config URLs with Kali, STM32 MCP, ESP32 PlatformIO, and Arduino CLI settings', 'Native context picker', 'DB Backup / Set DB menu', 'ACPX-Skills Browse / Configure', 'Diagnostics / Reload Registry', 'WebSockets'],
        },
      ],
    },
  },
};

export type Translations = typeof en;

const es: Translations = {
  nav: {
    overview: 'Resumen',
    architecture: 'Arquitectura',
    agents: 'Agentes',
    tools: 'Herramientas',
    features: 'Características',
    installation: 'Instalación',
    tlamatini: 'Tlamatini',
    home: 'Inicio',
    github: 'GitHub',
    login: 'Acceder',
    logout: 'Salir',
    user: 'Usuario',
    language: 'Idioma',
    switchToEnglish: 'Switch to English',
    switchToSpanish: 'Cambiar a Español',
  },

  ascii: {
    phrases: [
      'Inteligencia Artificial eXtendida y Humanamente Templada',
      '( XAIHT )',
      'Tlamatini v1.17.0',
      'IA Local Primero',
      '53 Comandos Unreal MCP',
      'Operación Multi-Turn',
      '79 Herramientas Multi-Turn',
      '27 Paquetes de Skills',
      '74 Agentes de Flujo',
      'Compuerta de Aprobación Ask Execs',
      'App Instalada en Windows 10|11',
      'Instalador a Prueba de Balas con Python Integrado',
      'Techo de 4096 Iteraciones',
      'Unreal Engine MCP',
      'STM32 MCP Sin Configuración',
      'Automatización de Firmware STM32F4x',
      'Puente PlatformIO ESP32er',
      'Puente Arduino CLI Arduiner',
      'Captura de Webcam + Micrófono',
      'Reproducción de Video en Pantalla',
      'Compilaciones Auto-Modificables',
      'Selector de Contexto Nativo',
      'Puente Kali Configurado Kalier',
      'Automatización de Navegador Playwrighter',
      'Control de Escritorio Windower',
      'Reviewer Consciente del Commit',
      'Embedding de Alto Detalle',
      'Reviewer + Analyzer',
      'Flujos de Trabajo Visuales',
    ],
  },

  home: {
    overview: {
      label: 'Resumen',
      title: 'Tlamatini — El Conocimiento Agéntico de IA de un Desarrollador Sénior',
      desc: 'Tlamatini v1.17.0 es un asistente de desarrollo con IA desplegado localmente, autoconsciente y habilitado para Unreal Engine, con RAG híbrido sobre tu código fuente, un bucle Multi-Turn de 79 herramientas y 4096 iteraciones, compuertas de aprobación Ask Execs antes de ejecutar herramientas que cambian el estado, un instalador a prueba de balas de un solo clic que lleva su propio Python 3.12.10 para que los usuarios finales instalen únicamente Ollama y los modelos, registro como aplicación instalada en Windows 10|11 para rutas de desinstalación familiares, delegación opcional ACPX a CLIs de agentes de programación externos, el menú ACPX-Skills para 27 paquetes de skills, menús Config y DB integrados, carga nativa de contexto de carpetas anidadas, flujos de trabajo .flw reutilizables, 74 tipos de agentes para arrastrar y soltar, automatización de firmware de misión crítica STM32er, flujos de compilación / carga / monitoreo de firmware PlatformIO ESP32er, flujos de compilación / carga / monitoreo de firmware Arduino-CLI Arduiner, una familia completa de E/S multimedia para captura y reproducción de webcam, micrófono, altavoz y video en pantalla, flujos de evaluación Kali autorizados Kalier, la superficie de 53 comandos Unreal MCP, automatización de navegador real Playwrighter, control de escritorio Windower, estrictas compuertas de corrección Pythonxer, ejecución de archivos verificada por compilación, compuertas Reviewer y Analyzer conscientes del commit, opción de embedding de alto detalle, carga de contexto consciente de la GPU y su propio mapa de autoconocimiento.',
      viewGithub: 'Ver en GitHub',
      documentation: 'Documentación',
      stats: {
        agents: 'Agentes',
        skills: 'Skills',
        version: 'Versión',
        iterations: 'Iteraciones',
      },
    },
    vision: {
      label: 'XAIHT',
      title: 'Visión, Misión, Concepto',
      desc: 'El proyecto insignia de XAIHT: automatización local primero, comprensión de código fundamentada y ejecución de IA controlada por el desarrollador.',
      cards: [
        {
          title: 'Visión',
          subtitle: 'Control Humano, IA Ajustable',
          description:
            'Tlamatini se construye en torno a la idea de que la IA para desarrolladores debe permanecer bajo el control del usuario: contexto local, interruptores explícitos, aprobaciones Ask Execs, registro de desinstalación en Windows para compilaciones instaladas, ajustes de modelos en vivo, manejo seguro de la base de datos, flujos de trabajo inspeccionables, control del catálogo ACPX-Skills, trabajo consciente de Unreal Engine, rutas de firmware STM32F4x, ESP32 y Arduino con verificaciones previas, captura y reproducción de webcam, micrófono, altavoz y video en pantalla, estrictas compuertas de ejecución de Python, rutas externas opcionales, compuertas de revisión y análisis, y su propio mapa de autoconocimiento.',
        },
        {
          title: 'Misión',
          subtitle: 'Convertir al Asistente en un Hacedor',
          description:
            'La misión es combinar RAG consciente del código, carga nativa de contexto de carpetas anidadas, asistencia de proyectos habilitada para Unreal Engine, automatización de firmware STM32F4x, ESP32 y Arduino, captura y reproducción de webcam, micrófono, altavoz y video en pantalla, profundidad de embedding ajustable, carga de contexto consciente de la GPU, orquestación Multi-Turn de 79 herramientas / 4096 iteraciones, puntos de control Ask Execs, compuertas de corrección Pythonxer, ejecución honesta en primer plano, preparación para la desinstalación en Windows 10|11, tablas de auditoría Exec Report, delegación opcional ACPX, administración del catálogo de skills, control de escritorio Windower, compuertas de calidad Reviewer y Analyzer conscientes del commit, y flujos visuales.',
        },
        {
          title: 'Concepto',
          subtitle: 'La Que Sabe',
          description:
            'Tlamatini significa «la que sabe». En la práctica, lee tu código, proyectos de Unreal Engine, objetivos de firmware STM32, proyectos PlatformIO de ESP32 y bocetos de Arduino, puede observar una webcam, escuchar un micrófono y reproducir sonido y video, protege el contexto de proyecto cargado para que no se confunda con su autoconocimiento, te permite ajustar modelos, endpoints, instantáneas de base de datos y skills desde la interfaz, revisa diffs, busca riesgos y compila ideas del chat o del lienzo en flujos de trabajo .flw reutilizables.',
        },
      ],
    },
    architecture: {
      overview: {
        label: 'Arquitectura',
        title: 'Construida como un Plano de Control de IA Local',
        desc: 'Tlamatini conecta el navegador, el selector nativo de contexto de proyectos, el mapa de autoconocimiento, los menús Config, DB y ACPX-Skills, el operador Multi-Turn con compuertas de aprobación Ask Execs, el registro como aplicación instalada en Windows, el Flow Compiler, Unreal MCP, el STM32 Template Project MCP, la automatización PlatformIO ESP32er, la automatización Arduino-CLI Arduiner, la familia multimedia de webcam, micrófono, altavoz y video en pantalla, y el entorno de ejecución ACPX a través de una sola superficie de comandos local.',
        card1: {
          title: 'Chat, Config, DB, Skills y Contexto',
          desc: 'La superficie de chat mantiene a mano Multi-Turn, Ask Execs, Exec Report, ACPX, contexto de internet, contexto nativo de carpetas anidadas, los diálogos Config de Modelos / URLs, los controles de DB y el ACPX-Skills Browse / Configure / Diagnostics / Reload, sin pedir a los usuarios que busquen entre archivos.',
        },
        card2: {
          title: 'LLM, ACPX, Skills y Guardia de GPU',
          desc: 'Ollama, Claude y Qwen cubren la superficie de modelos, ACPX delega en CLIs de programación externas solo cuando se selecciona, STM32er protege el trabajo de firmware ST-LINK, ESP32er impulsa compilaciones y cargas de PlatformIO, Arduiner impulsa compilaciones y cargas de Arduino-CLI, Kalier alcanza el servidor Kali configurado, Playwrighter impulsa flujos de navegador reales, Windower comanda ventanas completas, la familia multimedia captura webcam, micrófono y pantalla y reproduce sonido y video, SkillHarness ejecuta playbooks en markdown, Tlamatini lleva su autoconocimiento a cada cadena, y los hosts con GPU reciben una advertencia previa antes de que las cargas pesadas de embedding ralenticen la máquina.',
        },
      },
      rag: {
        label: 'Sistema RAG',
        title: 'Generación Aumentada por Recuperación Avanzada',
        desc: 'La recuperación híbrida combina vectores FAISS, palabras clave BM25, Fusión de Rango Recíproco, metadatos conscientes del código para proyectos de fuente y de Unreal Engine, un modelo de embedding por defecto más ligero, selección nativa de carpetas anidadas, prioridad del contexto cargado sobre su autoconocimiento privado, advertencias previas conscientes de la GPU y una ruta de respaldo que mantiene vivo el acceso a la fuente.',
        nodes: [
          { name: 'Cargar Contexto', desc: 'Selector nativo de carpetas anidadas' },
          { name: 'Nomic por Defecto', desc: 'Ligero por defecto con opción de alto detalle' },
          { name: 'FAISS + BM25', desc: 'Recuperación híbrida con fusión RRF' },
          { name: 'Prioridad de Contexto', desc: 'Los proyectos cargados superan al autoconocimiento' },
        ],
      },
      multiTurn: {
        label: 'Multi-Turn',
        title: 'Orquestación con Alcance por Petición',
        desc: 'Cuando Multi-Turn está habilitado, el chat se convierte en un operador: un planificador selecciona las herramientas relevantes, Ask Execs puede pausar las llamadas que cambian el estado para aprobación humana, Pythonxer rechaza pronto los scripts defectuosos y el trabajo exitoso se convierte en flujos de trabajo reutilizables.',
        items: [
          {
            title: 'Planificador de Ejecución Global',
            desc: 'Construye un plan con alcance por petición y vincula un conjunto enfocado de herramientas relevantes a lo largo de ejecuciones autónomas prolongadas.',
          },
          {
            title: 'Compuerta Ask Execs',
            desc: 'Se pausa antes de las llamadas a Tool, MCP, Agent o Skill que cambian el estado para que el operador pueda continuar o denegar.',
          },
          {
            title: 'Exec Report',
            desc: 'Agrega tablas de operaciones por agente para las llamadas a herramientas que cambian el estado antes de guardar el historial del chat.',
          },
          {
            title: 'Crear Flujo',
            desc: 'Las ejecuciones Multi-Turn exitosas pueden descargar un archivo .flw normalizado por la capa de contratos del backend.',
          },
        ],
      },
    },
    workflow: {
      label: 'Diseñador de Flujos',
      title: 'Arrastra, Suelta, Orquesta',
      desc: 'El Diseñador Visual de Flujos te permite arrastrar 74 tipos de agentes a un lienzo, conectarlos en flujos de trabajo .flw reutilizables, preservar los mapeos de Parametrizer, validar el grafo en vivo, compilar y flashear firmware STM32F4x a través de un puente MCP con verificación previa, compilar y cargar firmware ESP32 mediante PlatformIO, compilar y cargar firmware Arduino mediante el Arduino CLI, capturar webcam, micrófono y pantalla y reproducir sonido y video, ejecutar evaluaciones Kali autorizadas a través de un servidor configurado, impulsar proyectos Unreal MCP de 53 comandos, impulsar flujos de navegador reales, comandar ventanas de escritorio, revisar diffs, buscar hallazgos de seguridad, agregar puntos de control de aprobación humana y llevar automatización agéntica repetible al trabajo de proyectos habilitados para Unreal Engine.',
      categories: [
        { name: 'Control' },
        { name: 'Enrutamiento' },
        { name: 'Compuertas Lógicas' },
        { name: 'Acción' },
        { name: 'Criptografía' },
        { name: 'Utilidad' },
        { name: 'Terminal / Monitoreo' },
        { name: 'IA / Diseño' },
      ],
    },
    tools: {
      label: 'Herramientas',
      title: 'Herramientas Agénticas, Ajustables y Protegidas',
      items: [
        { desc: 'Ajusta los nombres de los modelos desde la interfaz de chat con validación', type: 'Config' },
        { desc: 'Edita los valores de los endpoints, incluidos los predeterminados de Kali, STM32 MCP, ESP32 PlatformIO y Arduino CLI, sin editar JSON a mano', type: 'Config' },
        { desc: 'Toma una instantánea de la base de datos SQLite en vivo en un directorio que elijas', type: 'DB' },
        { desc: 'Prepara una base de datos para el próximo arranque limpio de Tlamatini', type: 'DB' },
        { desc: 'Inspecciona los 27 cuerpos de skills, permisos, entradas, salidas y presupuestos antes de usarlos', type: 'Skills' },
        { desc: 'Habilita u oculta skills del planificador con la misma sensación que Tools y MCPs', type: 'Skills' },
        { desc: 'Detecta herramientas, MCPs, agentes ACPX faltantes y filas de skills huérfanas antes del tiempo de ejecución', type: 'Skills' },
        { desc: 'Vuelve a escanear los paquetes SKILL.md sin reiniciar Tlamatini', type: 'Skills' },
        { desc: 'Las compilaciones instaladas aparecen donde los usuarios de Windows 10|11 esperan eliminar aplicaciones', type: 'Instalador' },
        { desc: 'Pregunta antes de cada llamada Multi-Turn a Tool, MCP, Agent o Skill que cambia el estado, y luego continúa o falla de forma segura', type: 'Runtime' },
        { desc: 'Impulsa el fork público XAIHT de Unreal MCP con 53 comandos de editor en nueve categorías', type: 'Game Dev' },
        { desc: 'Genera, compila, flashea y observa firmware STM32F4x con arranque MCP sin configuración y verificación previa de hardware a prueba de fallos', type: 'Embebido' },
        { desc: 'Genera, compila, carga y monitorea firmware ESP32 mediante automatización PlatformIO Core sin configuración', type: 'Embebido' },
        { desc: 'Genera, compila, carga y monitorea firmware Arduino, AVR y SAMD mediante automatización Arduino-CLI sin configuración, seleccionado por FQBN', type: 'Embebido' },
        { desc: 'Captura una foto o un segmento de video desde una webcam del sistema, guardado con un nombre a prueba de colisiones', type: 'Multimedia' },
        { desc: 'Graba audio del micrófono en un archivo WAV con dispositivo, frecuencia de muestreo y ganancia por software seleccionables', type: 'Multimedia' },
        { desc: 'Reproduce un archivo de audio por los altavoces con volumen por software y un bucle o recorte de reproducción de N segundos', type: 'Multimedia' },
        { desc: 'Reproduce un archivo de video con sonido en una pantalla elegida, con control de pantalla completa, relación de aspecto y reproducción de N segundos', type: 'Multimedia' },
        { desc: 'Impulsa un navegador real a través de inicios de sesión, formularios, aserciones, capturas de pantalla y descargas con scripts', type: 'Navegador' },
        { desc: 'Enfoca, mueve, redimensiona, ordena, maximiza, minimiza y cierra ventanas de apps de Windows por título', type: 'Escritorio' },
        { desc: 'Coordina reconocimiento autorizado de Kali Linux mediante la URL configurada de MCP-Kali-Server', type: 'Seguridad' },
        { desc: 'Guarda flujos de trabajo para poder cargarlos y ejecutarlos de nuevo', type: 'Flujo' },
        { desc: 'Revisa diffs con conciencia del estado del commit y un veredicto APPROVE, REQUEST_CHANGES o COMMENT', type: 'Agente de Lienzo' },
        { desc: 'Ejecuta análisis estático determinista, escaneos de secretos y de dependencias como una compuerta del flujo', type: 'Agente de Lienzo' },
        { desc: 'Comprime o descomprime archivos para que los agentes posteriores puedan trabajar con el contenido', type: 'Acción' },
        { desc: 'Advierte a los hosts con GPU antes de cargas pesadas de embedding de contexto y mantiene humana la carga de contexto', type: 'RAG' },
        { desc: 'Una amplia superficie de acción con puntos de control de aprobación, un techo de 4096 iteraciones y un tope estricto de 256 llamadas a herramientas', type: 'Runtime' },
        { desc: 'Las verificaciones de compilación y Ruff detienen el Python defectuoso antes de la ejecución, mientras el control de flujo posterior se mantiene explícito', type: 'Runtime' },
        { desc: 'Las ventanas de script visibles se abren solo cuando se solicita, con verificaciones de compilación antes del lanzamiento', type: 'Runtime' },
        { desc: 'Agente de flujo envuelto para operaciones de shell', type: 'Runtime' },
        { desc: 'Primitiva de espera para flujos Multi-Turn autónomos y fluidos', type: 'Runtime' },
        { desc: 'Automatización del puntero de escritorio con clic, arrastre y desplazamiento', type: 'Escritorio' },
        { desc: 'Inicia una sesión de CLI de un agente de programación externo', type: 'ACPX' },
        { desc: 'Pasa la respuesta de un agente externo a otro en una sola llamada', type: 'ACPX' },
        { desc: 'Ejecuta paquetes SKILL.md habilitados a través del SkillHarness, incluidos code-review y security-audit conscientes del commit', type: 'Skill' },
      ],
    },
  },

  footer: {
    ctaTitle: 'Ejecuta Tlamatini en Tu Propia Máquina',
    ctaDesc: 'Tlamatini v1.17.0 hace que la instalación sea a prueba de balas: el instalador de un solo clic lleva su propio Python 3.12.10, además de Java, Git y los navegadores de Playwright, así que solo instalas Ollama y los modelos. Se apoya en la reciente familia de E/S multimedia —captura de webcam Camcorder, captura de micrófono Recorder, reproducción por altavoz AudioPlayer y video en pantalla con sonido VideoPlayer—, además de los puentes de firmware Arduiner, ESP32er y STM32er, registro como aplicación instalada en Windows 10|11, compuertas de aprobación Ask Execs, ejecución estricta Pythonxer, RAG híbrido, controles en vivo de Config, DB y ACPX-Skills, orquestación Multi-Turn de 79 herramientas, carga de contexto consciente de la GPU, 27 skills y 74 agentes de flujo.',
    viewSource: 'Ver Código Fuente',
    documentation: 'Documentación',
    github: 'GitHub',
    reportIssue: 'Reportar Problema',
    builtWith: 'Construido con Django Channels + Ollama',
  },

  login: {
    title: 'Bienvenido a XAIHT',
    desc: 'Inicia sesión para acceder a tu cuenta de XAIHT y mantener las preferencias del proyecto disponibles entre sesiones.',
    signIn: 'Iniciar sesión con Google',
    oauthNote: 'La autenticación se gestiona mediante Google OAuth 2.0.',
  },

  notFound: {
    message: 'Esta página de XAIHT no está disponible.',
    back: 'Volver a XAIHT',
  },

  tlamatini: {
    hero: {
      label: 'XAIHT / Proyectos',
      subtitle: 'Asistente de Desarrollo con IA, Local Primero v1.17.0',
      desc: 'RAG híbrido, autoconocimiento, compilaciones auto-modificables opcionales, contexto nativo de carpetas anidadas, configuración de modelos en vivo, controles seguros de respaldo e intercambio de DB, administración del catálogo ACPX-Skills, orquestación Multi-Turn de 79 herramientas y 4096 iteraciones con compuertas de aprobación Ask Execs, registro como aplicación instalada en Windows 10|11, ejecución estricta Pythonxer, carga de contexto consciente de la GPU, opción de embedding de alto detalle, delegación opcional ACPX y un diseñador de flujos de 74 agentes con Arduiner, ESP32er, STM32er, la familia multimedia de webcam, micrófono, altavoz y video en pantalla, Kalier, la superficie de 53 comandos Unreal MCP, Playwrighter, Windower, Reviewer y Analyzer.',
    },
    overview: {
      label: 'Resumen del Proyecto',
      title: 'La Que Sabe, La Que Puede Actuar',
      p1Strong: 'Tlamatini',
      p1Rest: ' significa «la que sabe». Es una aplicación local que ejecutas en tu propia máquina, combinando recuperación consciente del código, su propio mapa de autoconocimiento, configuración en vivo, controles de instantáneas de base de datos, pulido como aplicación instalada en Windows, control del catálogo ACPX-Skills, ejecución protegida de herramientas, delegación opcional a agentes de programación externos, trabajo de proyectos habilitado para Unreal Engine, automatización de firmware STM32, ESP32 y Arduino, captura y reproducción de webcam, micrófono, altavoz y video en pantalla, revisión de código consciente del commit, análisis de seguridad y un lienzo de automatización visual.',
      p2: 'La compilación v1.17.0 hace que comenzar sea a prueba de balas: el instalador de un solo clic ahora lleva su propio Python 3.12.10 autocontenido —junto con Java, Git y los navegadores de Playwright— para que el usuario final instale únicamente Ollama y los modelos, sin nada más que configurar. La reciente familia de E/S multimedia sigue completando sus sentidos —captura de webcam Camcorder, captura de micrófono Recorder, reproducción por altavoz AudioPlayer y video en pantalla con sonido VideoPlayer—, junto con la automatización de firmware Arduiner, ESP32er y STM32er. Lleva 74 agentes, 79 herramientas Multi-Turn, 27 skills, tres puentes de microcontroladores, soporte de Unreal Engine, ACPX-Skills, Config, DB, advertencias de GPU, autoconocimiento y archivos .flw guardados al alcance del operador.',
      viewSource: 'Ver Código Fuente',
    },
    features: {
      label: 'Características Clave',
      title: 'Capacidades de un Vistazo',
      items: [
        {
          title: 'Habilitada para Unreal Engine',
          description: 'Tlamatini lleva RAG local, acción de 4096 iteraciones, delegación a agentes externos y automatización de flujos de trabajo reutilizable al trabajo de proyectos de Unreal Engine, incluido el fork XAIHT de Unreal MCP de 53 comandos.',
        },
        {
          title: 'STM32er de Misión Crítica',
          description: 'STM32er permite a Tlamatini generar, escribir, compilar, flashear y observar firmware STM32F4x con arranque MCP sin configuración, cadenas de herramientas STM32CubeIDE, validación ST-LINK, observación serial/SWD y una verificación previa a prueba de fallos antes de acciones que modifican el hardware.',
        },
        {
          title: 'Puente PlatformIO ESP32er',
          description: 'ESP32er permite a Tlamatini generar, compilar, cargar y monitorear firmware ESP32 o ESP8266 mediante PlatformIO Core, con arranque en la primera ejecución, verificaciones de placa y serial, y sin necesidad de un IDE.',
        },
        {
          title: 'Puente Arduino CLI Arduiner',
          description: 'Arduiner es el tercer agente de microcontroladores: genera, compila, carga y monitorea firmware Arduino, AVR y SAMD mediante el Arduino CLI sin configuración, elige la placa por FQBN, instala automáticamente el core correspondiente y ejecuta una verificación previa a prueba de fallos antes de tocar el hardware.',
        },
        {
          title: 'Webcam, Micrófono y Reproducción Multimedia',
          description: 'Una familia completa de E/S multimedia completa los sentidos: Camcorder captura la webcam, Recorder captura el micrófono, AudioPlayer reproduce sonido por los altavoces y VideoPlayer reproduce video con audio en cualquier pantalla, los compañeros en pantalla y audibles del Shoter que captura la pantalla.',
        },
        {
          title: 'Operador de Chat Multi-Turn',
          description: 'Una superficie de chat con interruptores independientes para Multi-Turn, Ask Execs, Exec Report, ACPX y contexto de internet. Puede elegir entre 79 herramientas, pausar para aprobación, rechazar pronto el Python defectuoso y convertir el trabajo exitoso en flujos repetibles.',
        },
        {
          title: 'Pulido como Aplicación Instalada en Windows',
          description: 'Las compilaciones empaquetadas se registran como aplicaciones instaladas de Windows 10|11, para que los usuarios puedan eliminar Tlamatini mediante la experiencia de desinstalación familiar del sistema en lugar de buscar una carpeta.',
        },
        {
          title: 'RAG Híbrido con Guardia de GPU',
          description: 'El contexto de directorio, archivo o lienzo se fundamenta mediante recuperación FAISS + BM25. La selección nativa de carpetas anidadas alcanza proyectos profundos, el contexto cargado supera a su autoconocimiento y los embeddings de alto detalle permanecen protegidos por advertencias previas de la GPU.',
        },
        {
          title: 'Diseñador Visual de Flujos',
          description: 'Creación de flujos de trabajo de arrastrar y soltar con 74 tipos de agentes, guardar/cargar .flw, Validate en vivo, compilación al inicio, flujos PlatformIO ESP32er, pipelines de firmware STM32er, flujos Arduino-CLI Arduiner, nodos multimedia de webcam, micrófono, altavoz y video en pantalla, ejecuciones de evaluación Kalier, flujos de navegador Playwrighter, control de ventanas de escritorio Windower, rutas estrictas Pythonxer, flujos Unrealer de 53 comandos, Reviewer, Analyzer, FlowCreator y FlowHypervisor.',
        },
        {
          title: 'Delegación Externa ACPX',
          description: 'ACPX delega en CLIs de agentes de programación externos cuando lo eliges, mientras que ACPX-Skills da al operador controles Browse, Configure, Diagnostics y Reload para 27 paquetes SKILL.md, incluidos code-review, security-audit y kali-pentest conscientes del commit.',
        },
        {
          title: 'Menús Config, DB y ACPX-Skills',
          description: 'Ajustes validados de Modelos, URLs, Kali, STM32 MCP, ESP32 PlatformIO y Arduino CLI, selección nativa de contexto, controles en vivo de respaldo SQLite / Set DB y diagnósticos de habilitación de skills se reúnen como controles de nivel operador.',
        },
      ],
    },
    installation: {
      label: 'Inicio Rápido',
      title: 'Instalación',
      desc: 'El instalador de un solo clic es a prueba de balas: lleva su propio Python 3.12.10, Java, Git y los navegadores de Playwright, así que los usuarios finales instalan únicamente Ollama y los modelos. ¿Prefieres el código fuente? Ejecútalo desde un clon con Python 3.12.10 y Ollama usando los pasos a continuación. De cualquier forma, las compilaciones instaladas se registran con los mecanismos de desinstalación de Windows 10|11, mientras que Config, la selección nativa de contexto, las instantáneas de DB y los arranques sin configuración de PlatformIO ESP32er y Arduino-CLI Arduiner permanecen disponibles dentro de Tlamatini.',
      steps: [
        { label: 'Instalar Ollama' },
        { label: 'Descargar Modelos por Defecto' },
        { label: 'Clonar el Código Fuente' },
        { label: 'Configurar el Entorno' },
        { label: 'Inicializar la Base de Datos' },
        { label: 'Ejecutar la Aplicación' },
      ],
    },
    agents: {
      label: 'Ecosistema de Agentes',
      title: '74 Tipos de Agentes de Flujo',
      desc: 'El catálogo abarca agentes de control, enrutamiento, lógica, acción, criptografía, utilidad, monitoreo de terminal y diseño de IA, incluidos Arduiner, ESP32er, STM32er, la familia multimedia Camcorder, Recorder, AudioPlayer y VideoPlayer, Kalier, Playwrighter, Windower, TeleTlamatini, WhatsTlamatini, ACPXer, Unrealer de 53 comandos, Reviewer consciente del commit, Analyzer, De-Compresser, Pythonxer estricto, FlowCreator, 27 paquetes ACPX-Skills, aprobación Ask Execs en torno a la ejecución Multi-Turn que cambia el estado, su mapa de autoconocimiento, pulido como aplicación instalada en Windows y salvaguardas de contexto conscientes de la GPU en torno al punto de entrada del RAG.',
      groupLabel: 'Agentes',
      groups: [
        {
          category: 'Control',
          agents: [
            { desc: 'Inicia la ejecución del flujo de trabajo' },
            { desc: 'Termina agentes, lanza la limpieza posterior' },
            { desc: 'Terminador de agentes basado en patrones' },
            { desc: 'Limpieza posterior a la terminación' },
            { desc: 'Espera duration_ms antes de continuar' },
            { desc: 'Disparador programado HH:MM' },
          ],
        },
        {
          category: 'Enrutamiento',
          agents: [
            { desc: 'Lanzador descendente impulsado por eventos' },
            { desc: 'Enrutador automático de rutas A/B' },
            { desc: 'Elección interactiva A/B en el navegador' },
            { desc: 'Enrutador de umbral persistente' },
          ],
        },
        {
          category: 'Compuertas Lógicas',
          agents: [
            { desc: 'Se dispara cuando cualquiera de las fuentes se completa' },
            { desc: 'Se dispara cuando ambas fuentes se completan' },
            { desc: 'Compuerta generalizada de todas las fuentes' },
          ],
        },
        {
          category: 'Acción',
          agents: [
            { desc: 'Ejecución de comandos de shell' },
            { desc: 'Python en línea con verificación de compilación y Ruff' },
            { desc: 'Prompt de LLM al log' },
            { desc: 'Sondeo de logs de LLM y resúmenes de un solo paso' },
            { desc: 'Rastreo web sin procesar y análisis' },
            { desc: 'Búsqueda en Google mediante Playwright' },
            { desc: 'Flujos de navegador con scripts y aserciones' },
            { desc: 'Agente estructurado de peticiones HTTP' },
            { desc: 'Operaciones Git locales' },
            { desc: 'Comandos remotos SSH' },
            { desc: 'Transferencia de archivos SCP' },
            { desc: 'Ejecutor de comandos Docker' },
            { desc: 'Ejecutor de comandos Kubernetes' },
            { desc: 'Buscador semántico de procesos' },
            { desc: 'Disparador de pipelines de Jenkins' },
            { desc: 'Ejecución de consultas SQL Server' },
            { desc: 'Ejecución de scripts MongoDB' },
            { desc: 'Mover o copiar archivos' },
            { desc: 'Eliminar archivos con exclusiones' },
            { desc: 'Captura de pantalla' },
            { desc: 'Captura de foto y video de webcam' },
            { desc: 'Captura de audio de micrófono a WAV' },
            { desc: 'Reproducción de audio por altavoces' },
            { desc: 'Reproducción de video en pantalla con sonido' },
            { desc: 'Clic, arrastre, desplazamiento, localizar imágenes' },
            { desc: 'Escritura y combinaciones de teclas rápidas' },
            { desc: 'Enfocar, organizar, redimensionar y cerrar ventanas' },
            { desc: 'Escribir contenido de archivos' },
            { desc: 'Analizar DOCX, PPTX, XLSX, PDF' },
            { desc: 'Extracción de texto sin procesar con respaldo' },
            { desc: 'Comprimir o descomprimir archivos' },
            { desc: 'Análisis de visión de imágenes' },
            { desc: 'Descompilación de JAR/WAR/CLASS' },
            { desc: 'Mensaje saliente de Telegram' },
            { desc: 'Puente de Telegram al chat de Tlamatini' },
            { desc: 'Puente de WhatsApp mediante Cloud API' },
            { desc: 'Ciclo de vida visual de sesión ACPX' },
            { desc: 'Puente Unreal Engine MCP con 53 comandos' },
            { desc: 'Puente de firmware STM32F4x de misión crítica' },
            { desc: 'Puente de firmware ESP32 PlatformIO' },
            { desc: 'Puente de firmware Arduino CLI (AVR / SAMD)' },
            { desc: 'Veredicto de revisión de diff consciente del estado del commit' },
            { desc: 'Compuerta de hallazgos de análisis estático y seguridad' },
            { desc: 'Puente de evaluación Kali Linux configurado' },
          ],
        },
        {
          category: 'Criptografía',
          agents: [
            { desc: 'Par de claves CRYSTALS-Kyber' },
            { desc: 'Encapsulación Kyber + cifrado AES' },
            { desc: 'Desencapsulación Kyber + descifrado AES' },
          ],
        },
        {
          category: 'Utilidad',
          agents: [
            { desc: 'Mapea logs de origen en la configuración de destino' },
            { desc: 'Respalda logs de sesión y configuraciones' },
            { desc: 'Ingreso por webhook entrante y carpeta de entrega' },
            { desc: 'Puente de webhooks de proveedores' },
            { desc: 'Registro de infraestructura en vivo' },
          ],
        },
        {
          category: 'Terminal / Monitoreo',
          agents: [
            { desc: 'Monitor de logs impulsado por LLM' },
            { desc: 'Monitor de puertos impulsado por LLM' },
            { desc: 'Emisor de correo SMTP' },
            { desc: 'Receptor IMAP con análisis de LLM' },
            { desc: 'Notificación de navegador y sonido' },
            { desc: 'WhatsApp mediante TextMeBot' },
            { desc: 'Receptor de Telegram' },
            { desc: 'Vigilante LLM sobre agentes en ejecución' },
          ],
        },
        {
          category: 'IA / Diseño',
          agents: [{ desc: 'El LLM diseña flujos a partir de objetivos' }],
        },
      ],
    },
    techStack: {
      label: 'Tecnología',
      title: 'Pila Tecnológica',
      groups: [
        {
          category: 'Backend',
          items: ['Python 3.12.10', 'Django', 'Django Channels', 'Daphne ASGI'],
        },
        {
          category: 'RAG',
          items: ['FAISS', 'BM25', 'Selector nativo de carpetas anidadas', 'Prioridad del contexto cargado', 'Opción de embedding de alto detalle', 'Advertencia previa de GPU'],
        },
        {
          category: 'Backends de LLM',
          items: ['Ollama', 'API de Anthropic Claude', 'Visión Qwen', 'Etiquetas de modelo configurables'],
        },
        {
          category: 'Entorno de Agentes',
          items: ['79 herramientas Multi-Turn', 'Compuerta de aprobación Ask Execs', 'Compuerta estricta Pythonxer', 'Ejecutor de 4096 iteraciones', 'Tope estricto de 256 llamadas a herramientas', 'CLIs externas ACPX', 'Puente PlatformIO ESP32er', 'Puente de firmware STM32er', 'Puente Arduino-CLI Arduiner', 'Captura Camcorder / Recorder', 'Reproducción AudioPlayer / VideoPlayer', 'Puente Kali configurado Kalier', 'Automatización de navegador Playwrighter', 'Control de escritorio Windower', '27 paquetes SKILL.md'],
        },
        {
          category: 'Entorno de Flujos',
          items: ['Flow Compiler', 'Registro de contratos de agentes', 'Flujos de trabajo .flw reutilizables', 'Flujos ESP32 de compilación / carga / monitoreo', 'Flujos STM32F4x de compilación / flasheo / observación', 'Flujos Arduino de compilación / carga / monitoreo', 'Nodos de captura de webcam / micrófono', 'Nodos de reproducción por altavoz / video en pantalla', 'Pipelines de evaluación Kalier', 'Flujos de navegador Playwrighter', 'Control de ventanas Windower', 'Compuertas Reviewer / Analyzer conscientes del commit', 'Unreal MCP de 53 comandos', 'Modos de fuente y congelado'],
        },
        {
          category: 'Interfaces',
          items: ['Registro de desinstalación en Windows 10|11', 'Diálogo Config de Modelos', 'Config de URLs con ajustes de Kali, STM32 MCP, ESP32 PlatformIO y Arduino CLI', 'Selector nativo de contexto', 'Menú DB Backup / Set DB', 'ACPX-Skills Browse / Configure', 'Diagnostics / Reload Registry', 'WebSockets'],
        },
      ],
    },
  },
};

export const translations: Record<Lang, Translations> = { en, es };
