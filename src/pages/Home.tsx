import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AsciiIntro from '@/components/AsciiIntro';
import { useT } from '@/i18n/context';

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
  const t = useT();
  const o = t.home.overview;

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
          <span className="section-label reveal-item block mb-4">{o.label}</span>
          <h1
            className="reveal-item font-extrabold mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.12 }}
          >
            {o.title}
          </h1>
          <p className="reveal-item text-[#888] mb-8" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
            {o.desc}
          </p>
          <div className="reveal-item flex items-center gap-4 flex-wrap">
            <a
              href="https://github.com/XAIHT/Tlamatini"
              target="_blank"
              rel="noopener noreferrer"
              className="xaiht-btn xaiht-btn-outline"
            >
              {o.viewGithub}
            </a>
            <Link to="/tlamatini" className="xaiht-btn xaiht-btn-filled">
              {o.documentation}
            </Link>
          </div>
        </div>

        {/* Right Column - Stats Card */}
        <div className="reveal-item min-w-0">
          <div className="xaiht-card">
            <img
              src="/images/tlamatini/torso-tlamatini.png"
              alt="Tlamatini"
              className="w-full rounded-lg object-cover mb-6"
              style={{ maxHeight: '300px', border: '1px solid #222' }}
            />
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: o.stats.agents, value: '88' },
                { label: o.stats.skills, value: '29' },
                { label: o.stats.version, value: 'v1.50.6' },
                { label: o.stats.iterations, value: '4096' },
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
  const t = useT();
  const v = t.home.vision;

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

  const icons: Record<string, ReactNode> = {
    vision: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    mission: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7a9e8e" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    concept: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  };

  const cards = v.cards.map((card) => ({ ...card, icon: icons[card.id] }));

  return (
    <section
      ref={sectionRef}
      id="vision"
      style={{ background: '#0d0d0d', padding: 'clamp(80px, 10vh, 120px) 0' }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <span className="section-label reveal-item block mb-4 text-center">{v.label}</span>
        <h2
          className="reveal-item font-bold text-center mb-4"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
        >
          {v.title}
        </h2>
        <p className="reveal-item text-[#888] text-center mb-12 max-w-2xl mx-auto">
          {v.desc}
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
  const t = useT();
  const a = t.home.architecture;
  const multiTurnColors = ['#c9a96e', '#7a9e8e', '#8a9ec7', '#c79e7a'];

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
          <div className="flex flex-col justify-center items-center min-h-screen w-full px-6 py-20">
            <div className="max-w-[1200px] mx-auto w-full text-center">
              <span className="section-label block mb-4">{a.overview.label}</span>
              <h2
                className="font-bold mb-6"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
              >
                {a.overview.title}
              </h2>
              <p className="text-[#888] mb-10 max-w-2xl mx-auto" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
                {a.overview.desc}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
                <div className="xaiht-card min-w-0">
                  <div className="mb-3 flex justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#f0f0f0' }}>
                    {a.overview.card1.title}
                  </h3>
                  <p className="text-[#888]" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                    {a.overview.card1.desc}
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
                    {a.overview.card2.title}
                  </h3>
                  <p className="text-[#888]" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                    {a.overview.card2.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 2 — RAG Pipeline */}
        <div className="page-layer" style={{ background: '#0d0d0d' }}>
          <div className="flex flex-col justify-center items-center min-h-screen w-full px-6 py-20">
            <div className="max-w-[1200px] mx-auto w-full text-center">
              <span className="section-label block mb-4">{a.rag.label}</span>
              <h2
                className="font-bold mb-6"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
              >
                {a.rag.title}
              </h2>
              <p className="text-[#888] mb-10 max-w-2xl mx-auto" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
                {a.rag.desc}
              </p>
              {/* Pipeline */}
              <div className="flex items-stretch justify-center gap-0 gap-y-4 flex-wrap lg:flex-nowrap max-w-5xl mx-auto w-full">
                {a.rag.nodes.map((node, i) => (
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
          <div className="flex flex-col justify-center items-center min-h-screen w-full px-6 py-20">
            <div className="max-w-[1200px] mx-auto w-full text-center">
              <span className="section-label block mb-4">{a.multiTurn.label}</span>
              <h2
                className="font-bold mb-6"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
              >
                {a.multiTurn.title}
              </h2>
              <p className="text-[#888] mb-10 max-w-2xl mx-auto" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
                {a.multiTurn.desc}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
                {a.multiTurn.items.map((item, i) => (
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
                      style={{ background: multiTurnColors[i] }}
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
  const t = useT();
  const w = t.home.workflow;

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

  const categoryColors = [
    '#c9a96e', '#7a9e8e', '#9e9e9e', '#8a9ec7', '#7a9e8e',
    '#c9a96e', '#c79e7a', '#b08cc7', '#c9a96e',
  ];
  const categories = t.tlamatini.agents.groups.map((group, i) => ({
    name: group.category,
    agents: group.agents.map(agent => agent.name).join(', '),
    color: categoryColors[i] ?? '#9e9e9e',
  }));

  return (
    <section
      ref={sectionRef}
      id="agents"
      className="max-w-[1200px] mx-auto px-6"
      style={{ padding: 'clamp(80px, 10vh, 120px) 1.5rem' }}
    >
      <span className="section-label reveal-item block mb-4">{w.label}</span>
      <h2
        className="reveal-item font-bold mb-8"
        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
      >
        {w.title}
      </h2>
      <div className="reveal-item xaiht-card" style={{ padding: '3rem' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10">
          {/* Left */}
          <div className="min-w-0">
            <p className="text-[#888] mb-6" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
              {w.desc}
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
  const t = useT();

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

  const toolColors: Record<string, string> = {
    visual_workflows: '#c9a96e', multi_turn: '#7a9e8e', human_control: '#c79e7a',
    truthful_reports: '#7a9e8e', flowcreator: '#c9a96e', acpx: '#b08cc7',
    external_mcps: '#b08cc7', skills: '#b08cc7', rag: '#8a9ec7',
    unrealer: '#c9a96e', blenderer: '#c9a96e', stm32er: '#7a9e8e',
    esp_firmware: '#7a9e8e', robotic_loop: '#8a9ec7', whisperer: '#8a9ec7',
    talker: '#c79e7a', media: '#8a9ec7', netspeed: '#7a9e8e',
    googler: '#8a9ec7', blue_hat: '#c79e7a', security_agents: '#c79e7a',
    codebase: '#7a9e8e', documents: '#8a9ec7', browser_desktop: '#c79e7a',
    messaging: '#7a9e8e', database: '#c79e7a', windows_delivery: '#9e9e9e',
    self_knowledge: '#9e9e9e', prompt_catalog: '#b08cc7', mcp_adder: '#b08cc7',
    dependable_runtime: '#7a9e8e',
  };
  const tools = t.home.tools.items.map(tool => ({
    ...tool,
    color: toolColors[tool.id] ?? '#9e9e9e',
  }));

  return (
    <section
      ref={sectionRef}
      id="tools"
      style={{ background: '#0d0d0d', padding: 'clamp(80px, 10vh, 120px) 0' }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <span className="section-label reveal-item block mb-4">{t.home.tools.label}</span>
        <h2
          className="reveal-item font-bold mb-8"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
        >
          {t.home.tools.title}
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
