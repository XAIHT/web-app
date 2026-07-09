import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useT } from '@/i18n/context';

gsap.registerPlugin(ScrollTrigger);

export default function Tlamatini() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Navigation dark />
      <TlamatiniHero />
      <TlamatiniPresence />
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
  const t = useT();
  const h = t.tlamatini.hero;
  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={{ background: '#000' }}
    >
      <img
        src="/images/tlamatini/realistic-tlamatini.png"
        alt="Tlamatini"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(10,10,10,0.95) 100%)',
        }}
      />
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto pt-20">
        <span className="section-label block mb-4" style={{ color: '#c9a96e' }}>
          {h.label}
        </span>
        <h1
          className="font-extrabold mb-4"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 0.95 }}
        >
          TLAMATINI
        </h1>
        <p className="text-xl text-[#888] mb-2 font-light">
          {h.subtitle}
        </p>
        <p className="text-[#555] max-w-xl mx-auto" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
          {h.desc}
        </p>
      </div>
    </section>
  );
}

/* ─────────────────── Presence ─────────────────── */

function TlamatiniPresence() {
  const sectionRef = useRef<HTMLElement>(null);
  const t = useT();
  const p = t.tlamatini.presence;

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

  const panels = [
    { ...p.panels[0], type: 'image', src: '/images/tlamatini/shoulders-tlamatini.png' },
    { ...p.panels[1], type: 'video', src: '/images/tlamatini/lets-make-magic.mp4' },
    { ...p.panels[2], type: 'video', src: '/images/tlamatini/tlamatini-and-kyber.mp4' },
  ];

  return (
    <section
      ref={sectionRef}
      style={{ background: '#0a0a0a', padding: 'clamp(80px, 10vh, 120px) 0' }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="section-label reveal-item block mb-4">{p.label}</span>
          <h2
            className="reveal-item font-bold mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: 1.12 }}
          >
            {p.title}
          </h2>
          <p className="reveal-item text-[#888] mx-auto" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
            {p.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-8 items-stretch">
          <div className="reveal-item xaiht-card overflow-hidden min-w-0" style={{ padding: 0 }}>
            <img
              src="/images/tlamatini/hi-i-am-tlamatini.png"
              alt={p.spotlight.title}
              className="w-full object-cover"
              style={{ height: 'clamp(280px, 42vw, 520px)', borderBottom: '1px solid #222' }}
            />
            <div className="p-6">
              <span className="font-mono text-[10px] uppercase tracking-wider block mb-3" style={{ color: '#c9a96e' }}>
                {p.spotlight.kicker}
              </span>
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#f0f0f0' }}>
                {p.spotlight.title}
              </h3>
              <p className="text-[#888]" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
                {p.spotlight.desc}
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {p.chips.map((chip) => (
                  <span
                    key={chip}
                    className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded"
                    style={{ color: '#c9a96e', background: '#c9a96e15', border: '1px solid #c9a96e30' }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 min-w-0">
            {panels.map((panel) => (
              <div key={panel.title} className="reveal-item xaiht-card overflow-hidden min-w-0" style={{ padding: 0 }}>
                {panel.type === 'image' ? (
                  <img
                    src={panel.src}
                    alt={panel.title}
                    className="w-full h-44 object-cover"
                    style={{ borderBottom: '1px solid #222' }}
                  />
                ) : (
                  <video
                    src={panel.src}
                    className="w-full h-44 object-cover"
                    style={{ borderBottom: '1px solid #222' }}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                )}
                <div className="p-5">
                  <h3 className="text-base font-semibold mb-2" style={{ color: '#f0f0f0' }}>
                    {panel.title}
                  </h3>
                  <p className="text-[#888]" style={{ fontSize: '0.875rem', lineHeight: 1.55 }}>
                    {panel.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Overview ─────────────────── */

function TlamatiniOverview() {
  const sectionRef = useRef<HTMLElement>(null);
  const t = useT();
  const o = t.tlamatini.overview;

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
          <span className="section-label reveal-item block mb-4">{o.label}</span>
          <h2
            className="reveal-item font-bold mb-6"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
          >
            {o.title}
          </h2>
          <p className="reveal-item text-[#888] mb-4" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
            <strong style={{ color: '#f0f0f0' }}>{o.p1Strong}</strong>{o.p1Rest}
          </p>
          <p className="reveal-item text-[#888] mb-6" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
            {o.p2}
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
              {o.viewSource}
            </a>
          </div>
        </div>
        <div className="reveal-item">
          <img
            src="/images/tlamatini/realistic-tlamatini.png"
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
  const t = useT();
  const f = t.tlamatini.features;

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

  const featureImages = [
    '/images/tlamatini/realistic-tlamatini.png',
    '/images/tlamatini/tlamatini-drawings.png',
    '/images/tlamatini/agentic-advisor.mp4',
    '/images/tlamatini/lets-make-magic.mp4',
    '/images/tlamatini/torso-tlamatini.png',
    '/images/tlamatini/tlamatini-and-kyber.mp4',
    '/images/feature-chat.jpg',
    '/images/artifact-rag.jpg',
    '/images/feature-workflow.jpg',
    '/images/feature-agents.jpg',
    '/images/feature-chat.jpg',
    '/images/feature-chat.jpg',
  ];
  const features = f.items.map((item, i) => ({ ...item, image: featureImages[i] }));

  return (
    <section
      ref={sectionRef}
      id="features"
      style={{ background: '#0d0d0d', padding: 'clamp(80px, 10vh, 120px) 0' }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <span className="section-label reveal-item block mb-4">{f.label}</span>
        <h2
          className="reveal-item font-bold mb-10"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
        >
          {f.title}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="reveal-item xaiht-card overflow-hidden" style={{ padding: 0 }}>
              {feature.image.endsWith('.mp4') ? (
                <video
                  src={feature.image}
                  className="w-full h-48 object-cover"
                  style={{ borderBottom: '1px solid #222' }}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-48 object-cover"
                  style={{ borderBottom: '1px solid #222' }}
                />
              )}
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
  const t = useT();
  const inst = t.tlamatini.installation;

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

  const stepCode = [
    '# Option A: release installer, recommended\nhttps://github.com/XAIHT/Tlamatini/releases\n# Download the latest installer (.exe),\n# run the wizard, launch Tlamatini,\n# then open:\nhttp://127.0.0.1:8000/\n# Login: user / changeme\n# Updating later: About -> Check for updates\n\n# Option B: from source, for developers\ngit clone https://github.com/XAIHT/Tlamatini.git\ncd Tlamatini\npython -m venv venv && venv\\Scripts\\activate\npip install -r requirements.txt\npython Tlamatini/manage.py migrate\npython Tlamatini/manage.py runserver --noreload',
    '# Install Ollama for Windows\nhttps://ollama.com/download\n# Ollama serves the local embedding model\n# and the cloud chat models Tlamatini uses.',
    'ollama signin',
    '# Local embedding model\nollama pull nomic-embed-text\n\n# Cloud chat models\nollama pull kimi-k2.7-code:cloud\nollama pull qwen3.5:cloud',
    '# In the Tlamatini navbar:\nConfig -> Models\n# Set the Ollama model for each subsystem,\n# then click Save.\n\nConfig -> Access Keys Wizard\n# Local Ollama: leave token blank.\n# Remote Ollama: paste the Ollama token.\n# Add any cloud-CLI keys, then click Save.\n\n# Tick Multi-Turn and put Tlamatini to work.',
  ];
  const steps = inst.steps.map((step, i) => ({ ...step, code: stepCode[i] }));

  return (
    <section
      ref={sectionRef}
      id="installation"
      className="max-w-[1200px] mx-auto px-6"
      style={{ padding: 'clamp(80px, 10vh, 120px) 1.5rem' }}
    >
      <span className="section-label reveal-item block mb-4">{inst.label}</span>
      <h2
        className="reveal-item font-bold mb-8"
        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
      >
        {inst.title}
      </h2>
      <p className="reveal-item text-[#888] mb-8 max-w-2xl" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
        {inst.desc}
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
  const t = useT();
  const ag = t.tlamatini.agents;

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

  const agentGroupData = [
    { color: '#c9a96e', names: ['starter', 'ender', 'stopper', 'cleaner', 'sleeper', 'croner'] },
    { color: '#7a9e8e', names: ['raiser', 'forker', 'asker', 'counter'] },
    { color: '#9e9e9e', names: ['or', 'and', 'barrier'] },
    {
      color: '#8a9ec7',
      names: [
        'unrealer', 'blenderer', 'stm32er', 'esp32er', 'esphomer', 'arduiner',
        'discoverer', 'kalier', 'executer', 'pythonxer', 'sqler', 'mongoxer',
        'crawler', 'googler', 'playwrighter', 'apirer', 'gitter', 'reviewer',
        'analyzer', 'ssher', 'scper', 'dockerer', 'mcp-doctor', 'kuberneter',
        'pser', 'jenkinser', 'prompter', 'summarizer', 'file-interpreter',
        'file-extractor', 'image-interpreter', 'video-analyzer', 'j-decompiler', 'de-compresser',
        'mover', 'deleter', 'file-creator', 'shoter', 'globber', 'grepper',
        'editor', 'camcorder', 'recorder', 'whisperer', 'audioplayer',
        'videoplayer', 'talker', 'mouser', 'windower', 'keyboarder',
      ],
    },
    { color: '#c79e7a', names: ['kyber-keygen', 'kyber-cipher', 'kyber-decipher'] },
    { color: '#b08cc7', names: ['parametrizer', 'flowbacker', 'flowcreator', 'gatewayer', 'gateway-relayer', 'node-manager'] },
    {
      color: '#7a9e8e',
      names: ['notifier', 'emailer', 'recmailer', 'whatsapper', 'telegrammer', 'zavuerer', 'instant-messaging-doctor', 'monitor-log', 'monitor-netstat', 'flowhypervisor'],
    },
    { color: '#c9a96e', names: ['teletlamatini', 'acpxer'] },
  ];

  const agentGroups = agentGroupData.map((group, gi) => ({
    category: ag.groups[gi].category,
    color: group.color,
    agents: group.names.map((name, ai) => ({ name, desc: ag.groups[gi].agents[ai].desc })),
  }));

  return (
    <section
      ref={sectionRef}
      id="agents"
      style={{ background: '#0d0d0d', padding: 'clamp(80px, 10vh, 120px) 0' }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <span className="section-label reveal-item block mb-4">{ag.label}</span>
        <h2
          className="reveal-item font-bold mb-4"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
        >
          {ag.title}
        </h2>
        <p className="reveal-item text-[#888] mb-10 max-w-2xl" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
          {ag.desc}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentGroups.map((group) => (
            <div key={group.category} className="reveal-item xaiht-card" style={{ padding: '1.5rem' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ background: group.color }} />
                <h3 className="text-sm font-semibold" style={{ color: '#f0f0f0' }}>
                  {group.category} {ag.groupLabel}
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
  const tech = useT().tlamatini.techStack;

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

  const stack = tech.groups;

  return (
    <section
      ref={sectionRef}
      className="max-w-[1200px] mx-auto px-6"
      style={{ padding: 'clamp(80px, 10vh, 120px) 1.5rem' }}
    >
      <span className="section-label reveal-item block mb-4">{tech.label}</span>
      <h2
        className="reveal-item font-bold mb-8"
        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
      >
        {tech.title}
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
