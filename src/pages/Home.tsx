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
      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-center">
        {/* Left Column */}
        <div>
          <span className="section-label reveal-item block mb-4">Overview</span>
          <h1
            className="reveal-item font-extrabold mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.95 }}
          >
            Tlamatini — The Cosmic Knowledge of Development
          </h1>
          <p className="reveal-item text-[#888] mb-8" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
            A sophisticated, locally-run AI developer assistant featuring an advanced
            Retrieval-Augmented Generation (RAG) system, a request-scoped Multi-Turn
            orchestration layer, a real-time web interface, a visual agentic workflow
            designer, and multi-model LLM support.
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
        <div className="reveal-item">
          <div className="xaiht-card">
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Agents', value: '57' },
                { label: 'Tools', value: '40+' },
                { label: 'Models', value: 'Multi' },
                { label: 'Runtime', value: 'Local' },
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
      subtitle: 'Ancient Wisdom, Future Power',
      description:
        'We envision a world where AI development is rooted completely under human knowledge and control, fused with cutting-edge technology to create something truly transformative. Tlamatini represents the convergence of human kowledege powered by AI in complete control of it, offering a powerful and intuitive tool for developers.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
    },
    {
      title: 'Mission',
      subtitle: 'Empowering Local-First AI',
      description:
        'To provide developers with a powerful, privacy-preserving AI assistant that runs entirely on local infrastructure. We believe in giving users complete control over their data and models while delivering enterprise-grade capabilities for code analysis, automation, and intelligent workflow design.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7a9e8e" strokeWidth="1.5">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      title: 'Concept',
      subtitle: 'El Saber Cosmico del Desarrollo',
      description:
        'Tlamatini — "El que sabe cosas" (The one who knows things) — is our flagship project combining AI architectural patterns completely in control and knowledge of the user. It is the first manifestation of the XAIHT vision: a locally-deployable AI system that understands your codebase, automates your workflows, and respects your privacy and control.',
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
          Vision, Mission & Concept
        </h2>
        <p className="reveal-item text-[#888] text-center mb-12 max-w-2xl mx-auto">
          The foundation of XAIHT — where ancestral wisdom meets future technology.
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
            <div className="max-w-[1200px] mx-auto w-full">
              <span className="section-label block mb-4">Architecture</span>
              <h2
                className="font-bold mb-6"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
              >
                Built for Local-First AI
              </h2>
              <p className="text-[#888] mb-10 max-w-2xl" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
                Tlamatini is built on a robust Django backend with WebSocket communication,
                integrating multiple LLM backends for flexible, privacy-preserving AI operations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="xaiht-card">
                  <div className="mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#f0f0f0' }}>
                    WebSocket Communication
                  </h3>
                  <p className="text-[#888]" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                    Real-time bidirectional messaging via Django Channels and Daphne ASGI server.
                    Instant responses with streaming token output and session persistence across
                    reconnections.
                  </p>
                </div>
                <div className="xaiht-card">
                  <div className="mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7a9e8e" strokeWidth="1.5">
                      <rect x="4" y="2" width="16" height="20" rx="2" />
                      <path d="M8 6h8M8 10h8M8 14h5" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#f0f0f0' }}>
                    LLM Backend
                  </h3>
                  <p className="text-[#888]" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                    Multi-model support including Ollama for local inference, Anthropic Claude
                    for cloud API, and Qwen for vision tasks. Configurable per-task model selection
                    with bearer token authentication.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 2 — RAG Pipeline */}
        <div className="page-layer" style={{ background: '#0d0d0d' }}>
          <div className="flex flex-col justify-center min-h-screen px-6 py-20">
            <div className="max-w-[1200px] mx-auto w-full">
              <span className="section-label block mb-4">RAG System</span>
              <h2
                className="font-bold mb-6"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
              >
                Advanced Retrieval-Augmented Generation
              </h2>
              <p className="text-[#888] mb-10 max-w-2xl" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
                A custom-built RAG pipeline that goes far beyond simple text retrieval —
                with metadata extraction, architectural classification, and intelligent context budgeting.
              </p>
              {/* Pipeline */}
              <div className="flex items-stretch gap-0 flex-wrap lg:flex-nowrap">
                {[
                  { name: 'Document Loader', desc: 'Multi-format parsing with size reporting' },
                  { name: 'Text Splitters', desc: 'Recursive chunking with overlap control' },
                  { name: 'FAISS + BM25', desc: 'Hybrid semantic + keyword retrieval' },
                  { name: 'Context Budget', desc: 'Intelligent token allocation' },
                ].map((node, i) => (
                  <div key={node.name} className="flex items-center flex-1 min-w-[200px]">
                    <div
                      className="flex-1 p-4 rounded-lg"
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
            <div className="max-w-[1200px] mx-auto w-full">
              <span className="section-label block mb-4">Multi-Turn</span>
              <h2
                className="font-bold mb-6"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
              >
                Request-Scoped Orchestration
              </h2>
              <p className="text-[#888] mb-10 max-w-2xl" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
                When Multi-Turn is enabled, the chat stack switches to a sophisticated
                orchestration path with global planning, selective tool binding, and
                headless runtime execution.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Global Execution Planner',
                    desc: 'Builds a request-scoped DAG with prefetch, execute, monitor, and answer nodes.',
                    color: '#c9a96e',
                  },
                  {
                    title: 'Capability Selection',
                    desc: 'Dynamic scoring and binding of only relevant tools, agents, and MCP contexts.',
                    color: '#7a9e8e',
                  },
                  {
                    title: 'Context Prefetch',
                    desc: 'Selectively fetches system and file MCP contexts before tool execution.',
                    color: '#8a9ec7',
                  },
                  {
                    title: 'Headless Runtime',
                    desc: 'Background wrapped-agent launches with suppression of visible console popups.',
                    color: '#c79e7a',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-5 rounded-lg"
                    style={{
                      background: '#111',
                      border: '1px solid #222',
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mb-3"
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
    { name: 'Control Agents', agents: 'Starter, Ender, Stopper, Cleaner', color: '#c9a96e' },
    { name: 'Monitoring Agents', agents: 'Monitor Log, Monitor Netstat, FlowHypervisor', color: '#7a9e8e' },
    { name: 'Notification Agents', agents: 'Notifier, Emailer, WhatsApp, Telegram', color: '#c79e7a' },
    { name: 'Action Agents', agents: 'Executer, Pythonxer, SSher, Gitter, Dockerer', color: '#8a9ec7' },
    { name: 'Logic Gates', agents: 'AND, OR, Forker, Asker, Counter', color: '#9e9e9e' },
    { name: 'Utility Agents', agents: 'Parametrizer, Barrier, Gatewayer, Googler', color: '#c9a96e' },
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
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-10">
          {/* Left */}
          <div>
            <p className="text-[#888] mb-6" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
              The Visual Agentic Workflow Designer lets you create automated workflows
              using drag-and-drop agents. 57 pre-built agent types for diverse automation
              tasks — from log monitoring to Docker management, from email notifications
              to conditional routing.
            </p>
            <img
              src="/images/feature-workflow.jpg"
              alt="Workflow Designer"
              className="w-full rounded-lg object-cover"
              style={{ maxHeight: '280px', border: '1px solid #222' }}
            />
          </div>
          {/* Right - Categories */}
          <div className="space-y-3">
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
                <div>
                  <h4 className="text-sm font-semibold" style={{ color: '#f0f0f0' }}>
                    {cat.name}
                  </h4>
                  <p className="font-mono text-[11px] text-[#888] mt-0.5">{cat.agents}</p>
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
    { name: 'get_current_time', desc: 'Returns current datetime', type: 'Core', color: '#c9a96e' },
    { name: 'execute_file', desc: 'Runs Python scripts in a new terminal', type: 'Core', color: '#c9a96e' },
    { name: 'opus_analyze_image', desc: 'Image analysis with Claude', type: 'Data', color: '#8a9ec7' },
    { name: 'chat_agent_executer', desc: 'Command execution agent', type: 'DevOps', color: '#7a9e8e' },
    { name: 'chat_agent_gitter', desc: 'Git operations agent', type: 'DevOps', color: '#7a9e8e' },
    { name: 'chat_agent_send_email', desc: 'Email notification agent', type: 'Notify', color: '#c79e7a' },
    { name: 'chat_agent_notifier', desc: 'Event notification agent', type: 'Notify', color: '#c79e7a' },
    { name: 'agent_parametrizer', desc: 'Interconnect engine for agent outputs', type: 'Utility', color: '#9e9e9e' },
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
          40+ Integrated Capabilities
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
