import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function Tlamatini() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Navigation dark />
      <TlamatiniHero />
      <TlamatiniOverview />
      <TlamatiniFeatures />
      <TlamatiniInstallation />
      <TlamatiniAgents />
      <TlamatiniTechStack />
      <Footer />
    </div>
  );
}

/* ─────────────────── Hero ─────────────────── */

function TlamatiniHero() {
  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={{ background: '#000' }}
    >
      <img
        src="/images/hero-tlamatini.jpg"
        alt="Tlamatini"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(10,10,10,0.95) 100%)',
        }}
      />
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto pt-20">
        <span className="section-label block mb-4" style={{ color: '#c9a96e' }}>
          XAIHT / Projects
        </span>
        <h1
          className="font-extrabold mb-4"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 0.95 }}
        >
          TLAMATINI
        </h1>
        <p className="text-xl text-[#888] mb-2 font-light">
          Local-First AI Developer Assistant v1.17.0
        </p>
        <p className="text-[#555] max-w-xl mx-auto" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
          Hybrid RAG, self-knowledge, optional self-modify builds, native nested-folder context, live model configuration, safe DB backup and swap controls, ACPX-Skills catalog administration,
          79-tool, 4096-iteration Multi-Turn orchestration with Ask Execs approval gates, Windows 10|11 installed-app registration, strict Pythonxer execution, GPU-aware context loading, high-detail embedding opt-in, opt-in ACPX delegation, and a 74-agent workflow designer with Arduiner, ESP32er, STM32er, the webcam, microphone, speaker, and on-screen video media family, Kalier, the 53-command Unreal MCP surface, Playwrighter, Windower, Reviewer, and Analyzer.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────── Overview ─────────────────── */

function TlamatiniOverview() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.reveal-item');
    gsap.to(items, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });
    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="overview"
      className="max-w-[1200px] mx-auto px-6"
      style={{ padding: 'clamp(80px, 10vh, 120px) 1.5rem' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="section-label reveal-item block mb-4">Project Overview</span>
          <h2
            className="reveal-item font-bold mb-6"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
          >
            One Who Knows, One Who Can Act
          </h2>
          <p className="reveal-item text-[#888] mb-4" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
            <strong style={{ color: '#f0f0f0' }}>Tlamatini</strong> means "one who knows." She is a
            local app you run on your own machine, combining code-aware retrieval,
            her own self-knowledge map, live configuration, database snapshot controls, Windows installed-app polish, ACPX-Skills catalog control, guarded tool execution, opt-in external coding-agent delegation, Unreal Engine-enabled project work, STM32, ESP32, and Arduino firmware automation, webcam, microphone, speaker, and on-screen video capture and playback, commit-aware code review, security analysis, and a visual automation canvas.
          </p>
          <p className="reveal-item text-[#888] mb-6" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
            The v1.17.0 build makes getting started bullet-proof: the one-click installer now carries its own self-contained Python 3.12.10 — along with Java, Git, and the Playwright browsers — so an end user installs only Ollama and the models, with nothing else to set up. The recent media-I/O family still rounds out her senses — Camcorder webcam capture, Recorder microphone capture, AudioPlayer speaker playback, and VideoPlayer on-screen video with sound — alongside Arduiner, ESP32er, and STM32er firmware automation.
            She carries 74 agents, 79 Multi-Turn tools, 27 skills, three microcontroller bridges, Unreal Engine support, ACPX-Skills, Config, DB, GPU warnings, self-knowledge, and saved .flw files close to the operator.
          </p>
          <div className="reveal-item flex items-center gap-4 flex-wrap">
            <a
              href="https://github.com/XAIHT/Tlamatini"
              target="_blank"
              rel="noopener noreferrer"
              className="xaiht-btn xaiht-btn-filled"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              View Source
            </a>
          </div>
        </div>
        <div className="reveal-item">
          <img
            src="/images/artifact-rag.jpg"
            alt="Tlamatini RAG System"
            className="w-full rounded-lg object-cover"
            style={{ border: '1px solid #222', maxHeight: '400px' }}
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Features ─────────────────── */

function TlamatiniFeatures() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.reveal-item');
    gsap.to(items, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });
    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  const features = [
    {
      title: 'Unreal Engine Enabled',
      description: 'Tlamatini brings local RAG, 4096-iteration action, external-agent delegation, and reusable workflow automation into Unreal Engine project work, including the 53-command XAIHT Unreal MCP fork.',
      image: '/images/feature-workflow.jpg',
    },
    {
      title: 'Critical-Mission STM32er',
      description: 'STM32er lets Tlamatini scaffold, author, build, flash, and observe STM32F4x firmware with zero-config MCP bootstrap, STM32CubeIDE toolchains, ST-LINK validation, serial/SWD observation, and a fail-safe preflight before hardware-changing actions.',
      image: '/images/feature-agents.jpg',
    },
    {
      title: 'ESP32er PlatformIO Bridge',
      description: 'ESP32er lets Tlamatini scaffold, build, upload, and monitor ESP32 or ESP8266 firmware through PlatformIO Core, with first-run bootstrap, board and serial checks, and no IDE required.',
      image: '/images/feature-agents.jpg',
    },
    {
      title: 'Arduiner Arduino CLI Bridge',
      description: 'Arduiner is the third microcontroller agent: it scaffolds, builds, uploads, and monitors Arduino, AVR, and SAMD firmware through the zero-config Arduino CLI, picks the board by FQBN, auto-installs the matching core, and runs a fail-safe preflight before touching hardware.',
      image: '/images/feature-agents.jpg',
    },
    {
      title: 'Webcam, Mic, and Media Playback',
      description: 'A full media-I/O family rounds out the senses: Camcorder captures the webcam, Recorder captures the microphone, AudioPlayer plays sound through the speakers, and VideoPlayer plays video with audio on any display — the on-screen and audible companions to screen-capturing Shoter.',
      image: '/images/feature-chat.jpg',
    },
    {
      title: 'Multi-Turn Chat Operator',
      description: 'A chat surface with independent toggles for Multi-Turn, Ask Execs, Exec Report, ACPX, and internet context. She can choose from 79 tools, pause for approval, reject broken Python early, and turn successful work into repeatable flows.',
      image: '/images/feature-chat.jpg',
    },
    {
      title: 'Windows Installed-App Polish',
      description: 'Packaged builds register as installed Windows 10|11 applications, so users can remove Tlamatini through the familiar system uninstall experience instead of hunting for a folder.',
      image: '/images/feature-chat.jpg',
    },
    {
      title: 'Hybrid RAG with GPU Guard',
      description: 'Directory, file, or canvas context is grounded through FAISS + BM25 retrieval. Native nested-folder picking reaches deep projects, loaded context outranks her self-knowledge, and high-detail embeddings stay guarded by GPU pre-flight warnings.',
      image: '/images/artifact-rag.jpg',
    },
    {
      title: 'Visual Workflow Designer',
      description: 'Drag-and-drop workflow creation with 74 agent types, .flw save/load, live Validate, Start-time compilation, ESP32er PlatformIO flows, STM32er firmware pipelines, Arduiner Arduino-CLI flows, webcam, microphone, speaker, and on-screen video media nodes, Kalier assessment runs, Playwrighter browser flows, Windower desktop-window control, strict Pythonxer paths, 53-command Unrealer flows, Reviewer, Analyzer, FlowCreator, and FlowHypervisor.',
      image: '/images/feature-workflow.jpg',
    },
    {
      title: 'ACPX External Delegation',
      description: 'ACPX delegates to external coding-agent CLIs when you choose, while ACPX-Skills gives the operator Browse, Configure, Diagnostics, and Reload controls for 27 SKILL.md packages, including commit-aware code-review, security-audit, and kali-pentest.',
      image: '/images/feature-agents.jpg',
    },
    {
      title: 'Config, DB, and ACPX-Skills Menus',
      description: 'Validated Models, URLs, Kali, STM32 MCP, ESP32 PlatformIO, and Arduino CLI settings, native context picking, live SQLite backup / Set DB controls, and skill enablement diagnostics sit together as operator-grade controls.',
      image: '/images/feature-chat.jpg',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="features"
      style={{ background: '#0d0d0d', padding: 'clamp(80px, 10vh, 120px) 0' }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <span className="section-label reveal-item block mb-4">Key Features</span>
        <h2
          className="reveal-item font-bold mb-10"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
        >
          Capabilities at a Glance
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="reveal-item xaiht-card overflow-hidden" style={{ padding: 0 }}>
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-48 object-cover"
                style={{ borderBottom: '1px solid #222' }}
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#f0f0f0' }}>
                  {feature.title}
                </h3>
                <p className="text-[#888]" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Installation ─────────────────── */

function TlamatiniInstallation() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.reveal-item');
    gsap.to(items, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });
    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  const steps = [
    { label: 'Install Ollama', code: 'irm https://ollama.com/install.ps1 |\n  iex\nollama --version' },
    { label: 'Pull Default Models', code: 'ollama pull Nomic-Embed-Text:latest\nollama pull glm-5.1:cloud\nollama pull qwen3.5:cloud\nollama pull gpt-oss:120b-cloud\nollama pull qwen3.5:397b-cloud' },
    { label: 'Clone Source', code: 'git clone --depth 1 `\nhttps://github.com/XAIHT/Tlamatini\ncd Tlamatini' },
    { label: 'Setup Environment', code: 'python -m venv venv\nsource venv/bin/activate  # Linux/macOS\nvenv\\Scripts\\activate   # Windows\npip install -r requirements.txt' },
    { label: 'Initialize Database', code: 'python Tlamatini/manage.py migrate\npython Tlamatini/manage.py `\n  createsuperuser\npython Tlamatini/manage.py `\n  collectstatic --noinput' },
    { label: 'Run Application', code: 'python Tlamatini/manage.py `\n  runserver --noreload' },
  ];

  return (
    <section
      ref={sectionRef}
      id="installation"
      className="max-w-[1200px] mx-auto px-6"
      style={{ padding: 'clamp(80px, 10vh, 120px) 1.5rem' }}
    >
      <span className="section-label reveal-item block mb-4">Quick Start</span>
      <h2
        className="reveal-item font-bold mb-8"
        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
      >
        Installation
      </h2>
      <p className="reveal-item text-[#888] mb-8 max-w-2xl" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
        The one-click installer is bullet-proof — it carries its own Python 3.12.10, Java, Git, and Playwright browsers, so end users install only Ollama and the models. Prefer source? Run from a clone with Python 3.12.10 and Ollama using the steps below. Either way, installed builds register with Windows 10|11 uninstall mechanisms, while Config, native context picking, DB snapshots, and the zero-config ESP32er PlatformIO and Arduiner Arduino-CLI bootstraps stay available inside Tlamatini.
      </p>
      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={step.label} className="reveal-item">
            <div className="flex items-center gap-3 mb-2">
              <span
                className="font-mono text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: '#c9a96e20', color: '#c9a96e' }}
              >
                {i + 1}
              </span>
              <span className="text-sm font-medium" style={{ color: '#f0f0f0' }}>
                {step.label}
              </span>
            </div>
            <pre
              className="p-4 rounded-lg overflow-x-auto ml-9"
              style={{
                background: '#0d0d0d',
                border: '1px solid #222',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.8125rem',
                lineHeight: 1.7,
                color: '#c9a96e',
              }}
            >
              <code>{step.code}</code>
            </pre>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────── Agents ─────────────────── */

function TlamatiniAgents() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.reveal-item');
    gsap.to(items, {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 75%' },
    });
    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  const agentGroups = [
    {
      category: 'Control',
      color: '#c9a96e',
      agents: [
        { name: 'starter', desc: 'Initiates workflow execution' },
        { name: 'ender', desc: 'Terminates agents, launches post-cleanup' },
        { name: 'stopper', desc: 'Pattern-based agent terminator' },
        { name: 'cleaner', desc: 'Post-termination cleanup' },
        { name: 'sleeper', desc: 'Waits duration_ms before continuing' },
        { name: 'croner', desc: 'Scheduled HH:MM trigger' },
      ],
    },
    {
      category: 'Routing',
      color: '#7a9e8e',
      agents: [
        { name: 'raiser', desc: 'Event-driven downstream launcher' },
        { name: 'forker', desc: 'Automatic A/B path router' },
        { name: 'asker', desc: 'Interactive A/B browser choice' },
        { name: 'counter', desc: 'Persistent threshold router' },
      ],
    },
    {
      category: 'Logic Gates',
      color: '#9e9e9e',
      agents: [
        { name: 'or', desc: 'Fires when either source completes' },
        { name: 'and', desc: 'Fires when both sources complete' },
        { name: 'barrier', desc: 'Generalized all-sources gate' },
      ],
    },
    {
      category: 'Action',
      color: '#8a9ec7',
      agents: [
        { name: 'executer', desc: 'Shell command execution' },
        { name: 'pythonxer', desc: 'Inline Python with compile and Ruff gating' },
        { name: 'prompter', desc: 'LLM prompt to log' },
        { name: 'summarizer', desc: 'LLM log polling and one-shot summaries' },
        { name: 'crawler', desc: 'Raw web crawl and analysis' },
        { name: 'googler', desc: 'Google search via Playwright' },
        { name: 'playwrighter', desc: 'Scripted browser flows with assertions' },
        { name: 'apirer', desc: 'Structured HTTP request agent' },
        { name: 'gitter', desc: 'Local Git operations' },
        { name: 'ssher', desc: 'SSH remote commands' },
        { name: 'scper', desc: 'SCP file transfer' },
        { name: 'dockerer', desc: 'Docker command runner' },
        { name: 'kuberneter', desc: 'Kubernetes command runner' },
        { name: 'pser', desc: 'Semantic process finder' },
        { name: 'jenkinser', desc: 'Jenkins pipeline trigger' },
        { name: 'sqler', desc: 'SQL Server query execution' },
        { name: 'mongoxer', desc: 'MongoDB script execution' },
        { name: 'mover', desc: 'Move or copy files' },
        { name: 'deleter', desc: 'Delete files with exclusions' },
        { name: 'shoter', desc: 'Screenshot capture' },
        { name: 'camcorder', desc: 'Webcam photo and video capture' },
        { name: 'recorder', desc: 'Microphone audio capture to WAV' },
        { name: 'audioplayer', desc: 'Audio playback to speakers' },
        { name: 'videoplayer', desc: 'On-screen video playback with sound' },
        { name: 'mouser', desc: 'Click, drag, scroll, locate images' },
        { name: 'keyboarder', desc: 'Typing and hotkey chords' },
        { name: 'windower', desc: 'Focus, arrange, resize, and close windows' },
        { name: 'file-creator', desc: 'Write file content' },
        { name: 'file-interpreter', desc: 'Parse DOCX, PPTX, XLSX, PDF' },
        { name: 'file-extractor', desc: 'Raw text extraction with fallback' },
        { name: 'de-compresser', desc: 'Compress or decompress archives' },
        { name: 'image-interpreter', desc: 'Vision analysis of images' },
        { name: 'j-decompiler', desc: 'JAR/WAR/CLASS decompilation' },
        { name: 'telegramer', desc: 'Outbound Telegram message' },
        { name: 'teletlamatini', desc: 'Telegram bridge to Tlamatini chat' },
        { name: 'whatstlamatini', desc: 'WhatsApp bridge via Cloud API' },
        { name: 'acpxer', desc: 'Visual ACPX session lifecycle' },
        { name: 'unrealer', desc: 'Unreal Engine MCP bridge with 53 commands' },
        { name: 'stm32er', desc: 'Critical-mission STM32F4x firmware bridge' },
        { name: 'esp32er', desc: 'PlatformIO ESP32 firmware bridge' },
        { name: 'arduiner', desc: 'Arduino CLI firmware bridge (AVR / SAMD)' },
        { name: 'reviewer', desc: 'Commit-state-aware diff review verdict' },
        { name: 'analyzer', desc: 'Static-analysis and security findings gate' },
        { name: 'kalier', desc: 'Configured Kali Linux assessment bridge' },
      ],
    },
    {
      category: 'Cryptography',
      color: '#c79e7a',
      agents: [
        { name: 'kyber-keygen', desc: 'CRYSTALS-Kyber key pair' },
        { name: 'kyber-cipher', desc: 'Kyber encapsulation + AES encryption' },
        { name: 'kyber-decipher', desc: 'Kyber decapsulation + AES decryption' },
      ],
    },
    {
      category: 'Utility',
      color: '#b08cc7',
      agents: [
        { name: 'parametrizer', desc: 'Maps source logs into target config' },
        { name: 'flowbacker', desc: 'Backs up session logs and configs' },
        { name: 'gatewayer', desc: 'Inbound webhook and folder-drop ingress' },
        { name: 'gateway-relayer', desc: 'Provider webhook bridge' },
        { name: 'node-manager', desc: 'Live infrastructure registry' },
      ],
    },
    {
      category: 'Terminal / Monitoring',
      color: '#7a9e8e',
      agents: [
        { name: 'monitor-log', desc: 'LLM-powered log monitor' },
        { name: 'monitor-netstat', desc: 'LLM-powered port monitor' },
        { name: 'emailer', desc: 'SMTP email sender' },
        { name: 'recmailer', desc: 'IMAP receiver with LLM analysis' },
        { name: 'notifier', desc: 'Browser notification and sound' },
        { name: 'whatsapper', desc: 'WhatsApp via TextMeBot' },
        { name: 'telegramrx', desc: 'Telegram receiver' },
        { name: 'flowhypervisor', desc: 'LLM watchdog over running agents' },
      ],
    },
    {
      category: 'AI / Design',
      color: '#c9a96e',
      agents: [
        { name: 'flowcreator', desc: 'LLM designs flows from objectives' },
      ],
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="agents"
      style={{ background: '#0d0d0d', padding: 'clamp(80px, 10vh, 120px) 0' }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <span className="section-label reveal-item block mb-4">Agent Ecosystem</span>
        <h2
          className="reveal-item font-bold mb-4"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
        >
          74 Workflow-Agent Types
        </h2>
        <p className="reveal-item text-[#888] mb-10 max-w-2xl" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
          The catalog spans control, routing, logic, action, cryptography, utility,
          terminal monitoring, and AI design agents, including Arduiner, ESP32er, STM32er, the Camcorder, Recorder, AudioPlayer, and VideoPlayer media family, Kalier, Playwrighter, Windower, TeleTlamatini, WhatsTlamatini,
          ACPXer, 53-command Unrealer, commit-aware Reviewer, Analyzer, De-Compresser, strict Pythonxer, FlowCreator, 27 ACPX-Skills packages, Ask Execs approval around state-changing Multi-Turn execution, her self-knowledge map, Windows installed-app polish, and GPU-aware context safeguards around the RAG entry point.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentGroups.map((group) => (
            <div key={group.category} className="reveal-item xaiht-card" style={{ padding: '1.5rem' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ background: group.color }} />
                <h3 className="text-sm font-semibold" style={{ color: '#f0f0f0' }}>
                  {group.category} Agents
                </h3>
              </div>
              <div className="space-y-2">
                {group.agents.map((agent) => (
                  <div
                    key={agent.name}
                    className="flex items-start gap-2"
                  >
                    <code
                      className="text-[11px] shrink-0 mt-0.5"
                      style={{
                        color: group.color,
                        fontFamily: "'IBM Plex Mono', monospace",
                      }}
                    >
                      {agent.name}
                    </code>
                    <span className="text-[11px] text-[#555]">{agent.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Tech Stack ─────────────────── */

function TlamatiniTechStack() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.reveal-item');
    gsap.to(items, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });
    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  const stack = [
    { category: 'Backend', items: ['Python 3.12.10', 'Django', 'Django Channels', 'Daphne ASGI'] },
    { category: 'RAG', items: ['FAISS', 'BM25', 'Native nested-folder picker', 'Loaded-context priority', 'High-detail embedding opt-in', 'GPU pre-flight warning'] },
    { category: 'LLM Backends', items: ['Ollama', 'Anthropic Claude API', 'Qwen vision', 'Configurable model tags'] },
    { category: 'Agent Runtime', items: ['79 Multi-Turn tools', 'Ask Execs approval gate', 'Pythonxer strict gate', '4096-iteration executor', '256 tool-call hard stop', 'ACPX external CLIs', 'ESP32er PlatformIO bridge', 'STM32er firmware bridge', 'Arduiner Arduino-CLI bridge', 'Camcorder / Recorder capture', 'AudioPlayer / VideoPlayer playback', 'Kalier configured Kali bridge', 'Playwrighter browser automation', 'Windower desktop control', '27 SKILL.md packages'] },
    { category: 'Workflow Runtime', items: ['Flow Compiler', 'Agent Contract registry', 'Reusable .flw workflows', 'ESP32 build / upload / monitor flows', 'STM32F4x build / flash / observe flows', 'Arduino build / upload / monitor flows', 'Webcam / microphone capture nodes', 'Speaker / on-screen video playback nodes', 'Kalier assessment pipelines', 'Playwrighter browser flows', 'Windower window control', 'Commit-aware Reviewer / Analyzer gates', '53-command Unreal MCP', 'Source and frozen modes'] },
    { category: 'Interfaces', items: ['Windows 10|11 uninstall registration', 'Config Models dialog', 'Config URLs with Kali, STM32 MCP, ESP32 PlatformIO, and Arduino CLI settings', 'Native context picker', 'DB Backup / Set DB menu', 'ACPX-Skills Browse / Configure', 'Diagnostics / Reload Registry', 'WebSockets'] },
  ];

  return (
    <section
      ref={sectionRef}
      className="max-w-[1200px] mx-auto px-6"
      style={{ padding: 'clamp(80px, 10vh, 120px) 1.5rem' }}
    >
      <span className="section-label reveal-item block mb-4">Technology</span>
      <h2
        className="reveal-item font-bold mb-8"
        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
      >
        Technology Stack
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stack.map((group) => (
          <div key={group.category} className="reveal-item xaiht-card" style={{ padding: '1.5rem' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#c9a96e' }}>
              {group.category}
            </h3>
            <ul className="space-y-1.5">
              {group.items.map((item) => (
                <li key={item} className="text-[#888] text-sm flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#444]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
