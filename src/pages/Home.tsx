import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AsciiIntro from '@/components/AsciiIntro';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────── Home Page ─────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Navigation />
      <AsciiIntro />
      <OverviewSection />
      <VisionMissionSection />
      <ArchitectureSection />
      <WorkflowSection />
      <ToolsSection />
      <Footer />
    </div>
  );
}

/* ─────────────────── Overview Section ─────────────────── */

function OverviewSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.reveal-item');
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
      },
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
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] gap-12 items-center">
        {/* Left Column */}
        <div className="min-w-0">
          <span className="section-label reveal-item block mb-4">Overview</span>
          <h1
            className="reveal-item font-extrabold mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.12 }}
          >
            Tlamatini — The AI Agentic Knowledge of a Senior Developer
          </h1>
          <p className="reveal-item text-[#888] mb-8" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
            A locally deployed AI developer assistant with hybrid RAG over your source,
            a Multi-Turn tool-calling loop, ACPX delegation to external coding-agent CLIs,
            in-app Config and DB menus, versioned .flw workflows with portable artifacts,
            a visual workflow designer with 61 drag-and-drop agent types, and GPU-aware context loading.
          </p>
          <div className="reveal-item flex items-center gap-4 flex-wrap">
            <a
              href="https://github.com/XAIHT/Tlamatini"
              target="_blank"
              rel="noopener noreferrer"
              className="xaiht-btn xaiht-btn-outline"
            >
              View on GitHub
            </a>
            <Link to="/tlamatini" className="xaiht-btn xaiht-btn-filled">
              Documentation
            </Link>
          </div>
        </div>

        {/* Right Column - Stats Card */}
        <div className="reveal-item min-w-0">
          <div className="xaiht-card">
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Agents', value: '61' },
                { label: 'ACPX Tools', value: '12' },
                { label: 'Flow Schema', value: 'v2' },
                { label: 'GPU Guard', value: 'Smart' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="font-extrabold mb-1"
                    style={{
                      fontSize: 'clamp(2rem, 5vw, 3rem)',
                      color: '#c9a96e',
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <span className="font-mono text-[11px] text-[#888] uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Vision / Mission / Concept ─────────────────── */

function VisionMissionSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.reveal-item');
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
      },
    });
    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  const cards = [
    {
      title: 'Vision',
      subtitle: 'Human Control, Tunable AI',
      description:
        'Tlamatini is built around the idea that developer AI should stay under the user\'s control: local context, explicit toggles, live model settings, safe database handling, inspectable workflows, and automation that can be saved, validated, and rerun.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
    },
    {
      title: 'Mission',
      subtitle: 'Make the Assistant a Doer',
      description:
        'The mission is to combine code-aware RAG, GPU-aware context loading, Multi-Turn orchestration, Exec Report audit tables, ACPX delegation, and versioned visual flows so developers can move from questions to repeatable machine actions.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7a9e8e" strokeWidth="1.5">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      title: 'Concept',
      subtitle: 'The One Who Knows',
      description:
        'Tlamatini means "one who knows." In practice, it reads your code, lets you tune models, endpoints, and database snapshots from the UI, calls tools, spawns external coding agents, and compiles chat or canvas ideas into versioned .flw workflows.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="vision"
      style={{ background: '#0d0d0d', padding: 'clamp(80px, 10vh, 120px) 0' }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <span className="section-label reveal-item block mb-4 text-center">XAIHT</span>
        <h2
          className="reveal-item font-bold text-center mb-4"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
        >
          Vision, Mission, Concept
        </h2>
        <p className="reveal-item text-[#888] text-center mb-12 max-w-2xl mx-auto">
          XAIHT's flagship project: local-first automation, grounded code understanding, and developer-controlled AI execution.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.title} className="xaiht-card reveal-item">
              <div className="mb-4">{card.icon}</div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: '#f0f0f0' }}>
                {card.title}
              </h3>
              <span
                className="font-mono text-[10px] uppercase tracking-wider block mb-3"
                style={{ color: '#c9a96e' }}
              >
                {card.subtitle}
              </span>
              <p className="text-[#888]" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Architecture Section ─────────────────── */

function ArchitectureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stackEl = stackRef.current;
    if (!stackEl || !sectionRef.current) return;

    const layers = gsap.utils.toArray<HTMLElement>('.page-layer', stackEl);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stackEl,
        start: 'top top',
        end: '+=300%',
        scrub: true,
        pin: true,
        snap: {
          snapTo: (progress: number) => {
            const snapPoints = [0, 0.333, 0.666, 1];
            return snapPoints.reduce((prev, curr) =>
              Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev
            );
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.inOut',
        },
      },
    });

    layers.forEach((layer, index) => {
      if (index === 0) return;
      tl.to(
        layer,
        {
          y: 0,
          duration: 1,
          ease: 'none',
        },
        index - 1
      );
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === stackEl) t.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} id="architecture">
      <div
        ref={stackRef}
        className="page-stack-wrapper"
        style={{ zIndex: 10 }}
      >
        {/* Layer 1 — Architecture Overview */}
        <div className="page-layer" style={{ background: '#0a0a0a' }}>
          <div className="flex flex-col justify-center min-h-screen px-6 py-20">
            <div className="max-w-[1200px] mx-auto w-full text-center">
              <span className="section-label block mb-4">Architecture</span>
              <h2
                className="font-bold mb-6"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
              >
                Built as a Local AI Control Plane
              </h2>
              <p className="text-[#888] mb-10 max-w-2xl mx-auto" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
                Tlamatini connects the browser, code context, Config and DB menus, Multi-Turn operator,
                versioned flow compiler, and ACPX runtime through one local command surface.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
                <div className="xaiht-card min-w-0">
                  <div className="mb-3 flex justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#f0f0f0' }}>
                    Chat, Config, DB, and Context
                  </h3>
                  <p className="text-[#888]" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                    The chat surface keeps Multi-Turn, Exec Report, ACPX, internet context,
                    Models / URLs Config dialogs, and Backup / Set DB controls close at hand
                    without asking users to hunt through files.
                  </p>
                </div>
                <div className="xaiht-card min-w-0">
                  <div className="mb-3 flex justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7a9e8e" strokeWidth="1.5">
                      <rect x="4" y="2" width="16" height="20" rx="2" />
                      <path d="M8 6h8M8 10h8M8 14h5" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#f0f0f0' }}>
                    LLM, ACPX, and GPU Guard
                  </h3>
                  <p className="text-[#888]" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                    Ollama, Claude, and Qwen cover the model surface, ACPX delegates to external
                    coding CLIs, and GPU hosts get a pre-flight warning before heavy embedding
                    loads can slow the machine down.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 2 — RAG Pipeline */}
        <div className="page-layer" style={{ background: '#0d0d0d' }}>
          <div className="flex flex-col justify-center min-h-screen px-6 py-20">
            <div className="max-w-[1200px] mx-auto w-full text-center">
              <span className="section-label block mb-4">RAG System</span>
              <h2
                className="font-bold mb-6"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
              >
                Advanced Retrieval-Augmented Generation
              </h2>
              <p className="text-[#888] mb-10 max-w-2xl mx-auto" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
                Hybrid retrieval combines FAISS vectors, BM25 keywords, Reciprocal Rank Fusion,
                code-aware metadata, a lighter default embedding model, GPU-aware pre-flight
                warnings, and a fallback path that keeps source access alive.
              </p>
              {/* Pipeline */}
              <div className="flex items-stretch justify-center gap-0 gap-y-4 flex-wrap lg:flex-nowrap max-w-5xl mx-auto w-full">
                {[
                  { name: 'Load Context', desc: 'Files, folders, or current canvas' },
                  { name: 'Nomic Default', desc: 'Light embedding footprint by default' },
                  { name: 'FAISS + BM25', desc: 'Hybrid retrieval with RRF fusion' },
                  { name: 'GPU Guard', desc: 'Warns before expensive embedding bursts' },
                ].map((node, i) => (
                  <div key={node.name} className="flex items-center flex-1 min-w-[200px] max-w-full">
                    <div
                      className="flex-1 min-w-0 p-4 rounded-lg"
                      style={{
                        background: '#111',
                        borderTop: '2px solid #c9a96e',
                        borderLeft: '1px solid #222',
                        borderRight: '1px solid #222',
                        borderBottom: '1px solid #222',
                      }}
                    >
                      <h4 className="text-sm font-semibold mb-1" style={{ color: '#f0f0f0' }}>
                        {node.name}
                      </h4>
                      <p className="font-mono text-[10px] text-[#888]">{node.desc}</p>
                    </div>
                    {i < 3 && <div className="pipeline-connector hidden lg:block" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Layer 3 — Multi-Turn Engine */}
        <div className="page-layer" style={{ background: '#0a0a0a' }}>
          <div className="flex flex-col justify-center min-h-screen px-6 py-20">
            <div className="max-w-[1200px] mx-auto w-full text-center">
              <span className="section-label block mb-4">Multi-Turn</span>
              <h2
                className="font-bold mb-6"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
              >
                Request-Scoped Orchestration
              </h2>
              <p className="text-[#888] mb-10 max-w-2xl mx-auto" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
                When Multi-Turn is enabled, the chat becomes an operator: a planner selects
                the relevant tools, watches the results, and turns successful work into reusable
                workflows.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
                {[
                  {
                    title: 'Global Execution Planner',
                    desc: 'Builds a request-scoped plan and binds a focused set of relevant tools.',
                    color: '#c9a96e',
                  },
                  {
                    title: 'Config-Aware Runtime',
                    desc: 'Uses the active Models and URLs settings from the same config path in source and frozen builds.',
                    color: '#7a9e8e',
                  },
                  {
                    title: 'Exec Report',
                    desc: 'Appends per-agent operation tables for state-changing tool calls before chat history is saved.',
                    color: '#8a9ec7',
                  },
                  {
                    title: 'Create Flow',
                    desc: 'Successful Multi-Turn runs can download a .flw file normalized by the backend contract layer.',
                    color: '#c79e7a',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-5 rounded-lg min-w-0"
                    style={{
                      background: '#111',
                      border: '1px solid #222',
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mb-3 mx-auto"
                      style={{ background: item.color }}
                    />
                    <h4 className="text-sm font-semibold mb-2" style={{ color: '#f0f0f0' }}>
                      {item.title}
                    </h4>
                    <p className="text-[#888]" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Workflow Section ─────────────────── */

function WorkflowSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.reveal-item');
    gsap.to(items, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 75%',
      },
    });
    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  const categories = [
    { name: 'Control', agents: 'Starter, Ender, Stopper, Cleaner, Sleeper, Croner', color: '#c9a96e' },
    { name: 'Routing', agents: 'Raiser, Forker, Asker, Counter', color: '#7a9e8e' },
    { name: 'Logic Gates', agents: 'OR, AND, Barrier', color: '#9e9e9e' },
    { name: 'Action', agents: 'Executer, Pythonxer, De-Compresser, Crawler, Googler, ACPXer, TeleTlamatini', color: '#8a9ec7' },
    { name: 'Cryptography', agents: 'Kyber-KeyGen, Kyber-Cipher, Kyber-DeCipher', color: '#c79e7a' },
    { name: 'Utility', agents: 'Parametrizer, FlowBacker, Gatewayer, Gateway-Relayer, Node-Manager', color: '#c9a96e' },
    { name: 'Terminal / Monitoring', agents: 'Monitor-Log, Monitor-Netstat, Emailer, RecMailer, FlowHypervisor', color: '#7a9e8e' },
    { name: 'AI / Design', agents: 'FlowCreator', color: '#b08cc7' },
  ];

  return (
    <section
      ref={sectionRef}
      id="agents"
      className="max-w-[1200px] mx-auto px-6"
      style={{ padding: 'clamp(80px, 10vh, 120px) 1.5rem' }}
    >
      <span className="section-label reveal-item block mb-4">Workflow Designer</span>
      <h2
        className="reveal-item font-bold mb-8"
        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
      >
        Drag, Drop, Orchestrate
      </h2>
      <div className="reveal-item xaiht-card" style={{ padding: '3rem' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10">
          {/* Left */}
          <div className="min-w-0">
            <p className="text-[#888] mb-6" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
              The Visual Workflow Designer lets you drag 61 agent types onto a canvas,
              wire them into versioned .flw workflows, preserve Parametrizer mappings as
              artifacts, validate the live graph, and run the same contract-aware compiler
              that powers chat-created flows.
            </p>
            <img
              src="/images/feature-workflow.jpg"
              alt="Workflow Designer"
              className="w-full rounded-lg object-cover"
              style={{ maxHeight: '280px', border: '1px solid #222' }}
            />
          </div>
          {/* Right - Categories */}
          <div className="space-y-3 min-w-0">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ background: cat.color }}
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold" style={{ color: '#f0f0f0' }}>
                    {cat.name}
                  </h4>
                  <p className="font-mono text-[11px] text-[#888] mt-0.5 break-words">{cat.agents}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Tools Section ─────────────────── */

function ToolsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.reveal-item');
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 75%',
      },
    });
    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  const tools = [
    { name: 'Config -> Models', desc: 'Tune model names from the chat UI with validation', type: 'Config', color: '#c9a96e' },
    { name: 'Config -> URLs', desc: 'Edit endpoint values without hand-editing JSON', type: 'Config', color: '#c9a96e' },
    { name: 'DB -> Backup database', desc: 'Snapshot the live SQLite database to a directory you choose', type: 'DB', color: '#c79e7a' },
    { name: 'DB -> Set DB', desc: 'Stage a database for the next clean Tlamatini start-up', type: 'DB', color: '#c79e7a' },
    { name: '.flw schemaVersion', desc: 'Keeps saved workflows portable with versioned artifacts', type: 'Flow', color: '#9e9e9e' },
    { name: 'De-Compresser', desc: 'Unpacks archives so downstream agents can work with the contents', type: 'Action', color: '#8a9ec7' },
    { name: 'embedding_guard', desc: 'Warns GPU hosts before heavy context embedding loads', type: 'RAG', color: '#8a9ec7' },
    { name: 'chat_agent_executer', desc: 'Wrapped workflow agent for shell operations', type: 'Runtime', color: '#7a9e8e' },
    { name: 'chat_agent_sleeper', desc: 'Wait primitive for smooth autonomous Multi-Turn flows', type: 'Runtime', color: '#7a9e8e' },
    { name: 'chat_agent_mouser', desc: 'Desktop pointer automation with click, drag, and scroll', type: 'Desktop', color: '#c79e7a' },
    { name: 'acp_spawn', desc: 'Start an external coding-agent CLI session', type: 'ACPX', color: '#b08cc7' },
    { name: 'acp_relay', desc: 'Pass one external agent answer to another in a single call', type: 'ACPX', color: '#b08cc7' },
    { name: 'invoke_skill', desc: 'Run registered SKILL.md packages through the SkillHarness', type: 'Skill', color: '#9e9e9e' },
  ];

  return (
    <section
      ref={sectionRef}
      id="tools"
      style={{ background: '#0d0d0d', padding: 'clamp(80px, 10vh, 120px) 0' }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <span className="section-label reveal-item block mb-4">Tools</span>
        <h2
          className="reveal-item font-bold mb-8"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
        >
          Tunable, Guarded, Agentic Tooling
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="reveal-item xaiht-card"
              style={{ padding: '1.5rem' }}
            >
              <h3 className="text-sm font-semibold mb-2" style={{ color: '#f0f0f0', fontFamily: "'IBM Plex Mono', monospace" }}>
                {tool.name}
              </h3>
              <p className="text-[#888] mb-3" style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                {tool.desc}
              </p>
              <span
                className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded"
                style={{ color: tool.color, background: `${tool.color}15` }}
              >
                {tool.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
