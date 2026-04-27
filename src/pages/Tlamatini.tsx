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
          El Saber Cosmico del Desarrollo
        </p>
        <p className="text-[#555] max-w-xl mx-auto" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
          A sophisticated, locally-run AI developer assistant featuring an advanced RAG system,
          multi-turn orchestration, real-time web interface, and visual agentic workflow designer.
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
            The One Who Knows Things
          </h2>
          <p className="reveal-item text-[#888] mb-4" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
            <strong style={{ color: '#f0f0f0' }}>Tlamatini</strong> — from the Nahuatl "tlamatini" meaning
            "the one who knows things" — is a powerful, locally-deployed AI assistant built with Django.
            It provides a real-time, web-based interface for interacting with Large Language Models,
            designed as a comprehensive developer assistant.
          </p>
          <p className="reveal-item text-[#888] mb-6" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
            The system leverages a highly advanced, custom-built Retrieval-Augmented Generation (RAG)
            pipeline with detailed source-code analysis, metadata extraction, architectural role
            classification, and hybrid retrieval combining FAISS vector search with BM25 keyword matching.
          </p>
          <div className="reveal-item flex items-center gap-4 flex-wrap">
            <a
              href="https://github.com/XAIHT/Tlamatini"
              target="_blank"
              rel="noopener noreferrer"
              className="xaiht-btn xaiht-btn-filled"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
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
      title: 'Real-Time Chat Interface',
      description: 'WebSocket-based communication via Django Channels for instant responses. Syntax-highlighted code rendering with line numbers, canvas area for viewing and editing generated code, session persistence across reconnections.',
      image: '/images/feature-chat.jpg',
    },
    {
      title: 'Advanced RAG System',
      description: 'Dynamic context loading from local files or directories. Code-aware analysis parsing classes, functions, imports. Hybrid retrieval with FAISS + BM25 via Reciprocal Rank Fusion. Memory-insufficient context fallback.',
      image: '/images/artifact-rag.jpg',
    },
    {
      title: 'Visual Workflow Designer',
      description: 'Drag-and-drop agentic workflow creation with 57 pre-built agent types. Logic gates (AND/OR), conditional routing (Forker, Asker), real-time LED status indicators, undo/redo, save/load as .flw files.',
      image: '/images/feature-workflow.jpg',
    },
    {
      title: 'Multi-Model LLM Support',
      description: 'Ollama for local inference, Anthropic Claude for cloud API, Qwen for vision tasks. Configurable models for embedding, chat, image interpretation, and internet classification with bearer token authentication.',
      image: '/images/feature-agents.jpg',
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
    { label: 'Clone', code: 'git clone https://github.com/XAIHT/Tlamatini.git\ncd Tlamatini' },
    { label: 'Setup Environment', code: 'python -m venv venv\nsource venv/bin/activate  # Linux/macOS\nvenv\\Scripts\\activate   # Windows' },
    { label: 'Install Dependencies', code: 'pip install -r requirements.txt' },
    { label: 'Initialize Database', code: 'python Tlamatini/manage.py migrate\npython Tlamatini/manage.py createsuperuser' },
    { label: 'Run Application', code: 'python Tlamatini/manage.py runserver --noreload' },
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
        Get Tlamatini running in 5 minutes. Requires Python 3.12.10 (recommended) and Ollama for local LLM inference.
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
        { name: 'flowbacker', desc: 'Session backup and cleanup' },
        { name: 'barrier', desc: 'Synchronization barrier' },
      ],
    },
    {
      category: 'Monitoring',
      color: '#7a9e8e',
      agents: [
        { name: 'monitor_log', desc: 'LLM-based log file monitoring' },
        { name: 'monitor_netstat', desc: 'Network connection monitoring' },
        { name: 'flowhypervisor', desc: 'LLM anomaly detector' },
        { name: 'summarizer', desc: 'Log monitoring with LLM detection' },
      ],
    },
    {
      category: 'Notification',
      color: '#c79e7a',
      agents: [
        { name: 'notifier', desc: 'LangGraph event notification' },
        { name: 'emailer', desc: 'SMTP email sender' },
        { name: 'recmailer', desc: 'IMAP email receiver + LLM' },
        { name: 'whatsapper', desc: 'WhatsApp via TextMeBot' },
        { name: 'telegramer', desc: 'Telegram message sender' },
        { name: 'telegramrx', desc: 'Telegram receiver/monitor' },
      ],
    },
    {
      category: 'Action',
      color: '#8a9ec7',
      agents: [
        { name: 'executer', desc: 'Shell command execution' },
        { name: 'pythonxer', desc: 'Python script execution' },
        { name: 'sqler', desc: 'SQL Server query execution' },
        { name: 'mongoxer', desc: 'MongoDB script execution' },
        { name: 'ssher', desc: 'SSH remote commands' },
        { name: 'gitter', desc: 'Git operations' },
        { name: 'dockerer', desc: 'Docker container management' },
        { name: 'kuberneter', desc: 'Kubernetes command executor' },
      ],
    },
    {
      category: 'Logic',
      color: '#9e9e9e',
      agents: [
        { name: 'and', desc: 'AND logic gate (latched)' },
        { name: 'or', desc: 'OR logic gate' },
        { name: 'forker', desc: 'Automatic A/B path router' },
        { name: 'asker', desc: 'Interactive A/B path chooser' },
        { name: 'counter', desc: 'Persistent counter with routing' },
      ],
    },
    {
      category: 'Utility',
      color: '#b08cc7',
      agents: [
        { name: 'parametrizer', desc: 'Interconnection engine' },
        { name: 'gatewayer', desc: 'Inbound webhook gateway' },
        { name: 'node_manager', desc: 'Infrastructure registry' },
        { name: 'googler', desc: 'Google search agent' },
        { name: 'sleeper', desc: 'Delay execution' },
        { name: 'croner', desc: 'Time-scheduled trigger' },
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
          57 Pre-built Agent Types
        </h2>
        <p className="reveal-item text-[#888] mb-10 max-w-2xl" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
          The Visual Agentic Workflow Designer provides 57 pre-built agent types organized into
          control, monitoring, notification, action, logic, and utility categories.
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
    { category: 'Backend', items: ['Python 3.12.10', 'Django 5.2.4', 'Django Channels 4.1', 'Daphne (ASGI)'] },
    { category: 'AI / ML', items: ['LangChain 0.3.27', 'LangGraph 0.2.74', 'Ollama', 'FAISS', 'BM25'] },
    { category: 'LLM APIs', items: ['Anthropic Claude', 'Ollama REST API', 'MCP 1.25.0'] },
    { category: 'Database', items: ['SQLite (default)', 'Django ORM'] },
    { category: 'Communication', items: ['WebSockets', 'gRPC (grpcio 1.76.0)'] },
    { category: 'Frontend', items: ['HTML5', 'Bootstrap 5', 'JavaScript (modular)', 'jQuery', 'jQuery UI'] },
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
