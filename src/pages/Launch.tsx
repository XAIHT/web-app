import { Link } from 'react-router';
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Code2,
  Cpu,
  ExternalLink,
  Mic2,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLanguage } from '@/i18n/context';

const gallery = [
  ['01-command-the-whole-workspace.png', 'One command surface across code, workflows, 3D, and hardware', 'Una superficie de mando para codigo, flujos, 3D y hardware'],
  ['02-know-the-codebase.png', 'Decisions grounded in the codebase', 'Decisiones fundamentadas en el codigo'],
  ['03-turn-work-into-workflows.png', 'Successful work becomes a reusable flow', 'El trabajo exitoso se convierte en un flujo reutilizable'],
  ['04-approve-observe-cancel.png', 'Inspect, approve, or stop', 'Inspecciona, aprueba o detiene'],
  ['05-coordinate-frontier-agents.png', 'External agents remain under review', 'Los agentes externos permanecen bajo revision'],
  ['06-unreal-engine-studio.png', 'Real-time worlds under human direction', 'Mundos en tiempo real bajo direccion humana'],
  ['07-blender-product-studio.png', '3D design connected to physical outcomes', 'Diseno 3D conectado con resultados fisicos'],
  ['08-small-game-team.png', 'A release room for independent teams', 'Una sala de lanzamiento para equipos independientes'],
  ['09-stm32-robotics-bench.png', 'Firmware, instruments, and repeatable motion', 'Firmware, instrumentos y movimiento repetible'],
  ['10-esp32-smart-agriculture.png', 'Field decisions from real sensor evidence', 'Decisiones de campo con evidencia real de sensores'],
  ['11-esphome-building-operations.png', 'Practical building operations', 'Operacion practica de edificios'],
  ['12-arduino-learning-lab.png', 'Learning by building and testing', 'Aprender construyendo y probando'],
  ['13-video-analysis-robotics-loop.png', 'Recorded evidence closes the robotics loop', 'La evidencia grabada cierra el bucle robotico'],
  ['14-voice-listening-accessibility.png', 'Voice and listening expand professional access', 'Voz y escucha amplian el acceso profesional'],
  ['15-authorized-network-lab.png', 'Security work begins with authorization', 'El trabajo de seguridad comienza con autorizacion'],
  ['16-mexico-small-manufacturer.png', 'Less rework, more skilled judgment', 'Menos retrabajo, mas criterio especializado'],
  ['17-east-africa-solar-field-station.png', 'Local experts keep critical power moving', 'Expertos locales mantienen la energia critica'],
  ['18-south-asia-maker-lab.png', 'Affordable hardware moves from test to build', 'Hardware accesible pasa de prueba a produccion'],
  ['19-europe-industrial-maintenance.png', 'Evidence supports maintenance before failure', 'La evidencia apoya el mantenimiento antes de la falla'],
  ['20-latin-america-creative-studio.png', 'Creative delivery with technical control', 'Entrega creativa con control tecnico'],
] as const;

const copy = {
  en: {
    eyebrow: 'XAIHT presents Tlamatini v1.48.15',
    title: 'Command the whole workspace.',
    lead: 'A local-first AI operator for builders whose software touches engines, devices, media, networks, and the physical world.',
    source: 'View source',
    platform: 'Explore Tlamatini',
    proof: ['Workflow agents', 'Multi-Turn tools', 'Inspectable skills', 'Current release'],
    shiftLabel: 'The product thesis',
    shiftTitle: 'The next AI workspace must know the project and act across it.',
    shiftBody: 'Tlamatini combines code-aware retrieval, guarded execution, 107 built-in Multi-Turn tools, visual workflows, external-agent coordination, private External-MCP runtimes, and direct creative and embedded tooling. The operator keeps the right to inspect, approve, deny, or stop.',
    capabilitiesLabel: 'One operator, six working surfaces',
    capabilitiesTitle: 'Built for the places where software becomes something real.',
    capabilityCopy: [
      ['Codebase intelligence', 'Hybrid retrieval, file tools, PDF and LaTeX authoring, review, analysis, and reusable project context.'],
      ['Creative engines', 'Unreal Engine and Blender workflows connect intent to editable scenes and builds.'],
      ['Embedded systems', 'STM32, ESP32, ESPHome, and Arduino paths join firmware to real instruments.'],
      ['Voice and media', 'Talker, Whisperer, image interpretation, recording, playback, and video verdicts.'],
      ['Human command', 'Ask Execs, Step-by-Step, execution reports, and explicit stop points.'],
      ['Reusable orchestration', 'Successful Multi-Turn work can become a visible, inspectable .flw workflow.'],
    ],
    commandLabel: 'Humanly tempered',
    commandTitle: 'Capability is not permission.',
    commandBody: 'Tlamatini can coordinate powerful tools, but the user remains the operator and bears responsibility for agents they configure or run. Security and network actions must be explicitly authorized.',
    commandPoints: ['Inspect before execution', 'Approve or deny state-changing work', 'Keep evidence and execution reports', 'Cancel when conditions change'],
    galleryLabel: 'Campaign gallery',
    galleryTitle: 'One identity. Many builders. Real work.',
    galleryBody: 'Twenty original campaign scenes position Tlamatini as a calm senior operator beside the people making the decision.',
    evidenceLabel: 'Why this category matters',
    evidenceTitle: 'AI access is expanding while infrastructure, skills, and control remain uneven.',
    evidenceItems: [
      ['ILO', 'One in four workers has some GenAI exposure; transformation is more likely than full automation.'],
      ['ITU', 'About 6 billion people are online, while 2.2 billion remain offline.'],
      ['NBER', 'A field study found a 14% average productivity gain and larger gains for less-experienced workers.'],
      ['IEA', 'Data-centre electricity demand is projected to more than double by 2030.'],
    ],
    close: 'Build with the person still in command.',
    closeBody: 'Open source, local-first, and designed for inspectable action across the whole workspace.',
  },
  es: {
    eyebrow: 'XAIHT presenta Tlamatini v1.48.15',
    title: 'Comanda todo el espacio de trabajo.',
    lead: 'Una operadora de IA local-first para quienes construyen software que toca motores, dispositivos, medios, redes y el mundo fisico.',
    source: 'Ver codigo',
    platform: 'Explorar Tlamatini',
    proof: ['Agentes de flujo', 'Herramientas Multi-Turn', 'Skills inspeccionables', 'Version actual'],
    shiftLabel: 'La tesis del producto',
    shiftTitle: 'El proximo espacio de IA debe conocer el proyecto y actuar en todo el.',
    shiftBody: 'Tlamatini combina recuperacion consciente del codigo, ejecucion protegida, 107 herramientas Multi-Turn integradas, flujos visuales, coordinacion de agentes externos, runtimes privados para External MCPs y herramientas creativas y embebidas directas. El operador conserva el derecho de inspeccionar, aprobar, negar o detener.',
    capabilitiesLabel: 'Una operadora, seis superficies de trabajo',
    capabilitiesTitle: 'Hecha para los lugares donde el software se vuelve algo real.',
    capabilityCopy: [
      ['Inteligencia del codigo', 'Recuperacion hibrida, archivos, autoria PDF y LaTeX, revision, analisis y contexto reutilizable.'],
      ['Motores creativos', 'Unreal Engine y Blender conectan la intencion con escenas y builds editables.'],
      ['Sistemas embebidos', 'STM32, ESP32, ESPHome y Arduino unen firmware con instrumentos reales.'],
      ['Voz y medios', 'Talker, Whisperer, interpretacion visual, grabacion, reproduccion y veredictos de video.'],
      ['Mando humano', 'Ask Execs, Step-by-Step, reportes de ejecucion y puntos explicitos de parada.'],
      ['Orquestacion reutilizable', 'El trabajo Multi-Turn exitoso puede volverse un flujo .flw visible e inspeccionable.'],
    ],
    commandLabel: 'Humanamente templada',
    commandTitle: 'Capacidad no significa permiso.',
    commandBody: 'Tlamatini coordina herramientas potentes, pero el usuario sigue siendo el operador y asume la responsabilidad de los agentes que configura o ejecuta. Las acciones de seguridad y red requieren autorizacion explicita.',
    commandPoints: ['Inspecciona antes de ejecutar', 'Aprueba o niega cambios de estado', 'Conserva evidencia y reportes', 'Cancela cuando cambien las condiciones'],
    galleryLabel: 'Galeria de campana',
    galleryTitle: 'Una identidad. Muchas personas. Trabajo real.',
    galleryBody: 'Veinte escenas originales presentan a Tlamatini como una operadora senior y serena al lado de quien toma la decision.',
    evidenceLabel: 'Por que importa esta categoria',
    evidenceTitle: 'El acceso a IA crece mientras infraestructura, habilidades y control siguen siendo desiguales.',
    evidenceItems: [
      ['OIT', 'Una de cada cuatro personas trabajadoras tiene alguna exposicion a IA generativa; la transformacion es mas probable que la automatizacion total.'],
      ['UIT', 'Cerca de 6 mil millones de personas estan conectadas y 2.2 mil millones siguen desconectadas.'],
      ['NBER', 'Un estudio de campo encontro 14% de ganancia promedio y mayores beneficios para personal con menos experiencia.'],
      ['IEA', 'La demanda electrica de centros de datos podria mas que duplicarse para 2030.'],
    ],
    close: 'Construye con la persona todavia al mando.',
    closeBody: 'Codigo abierto, local-first y disenada para accion inspeccionable en todo el espacio de trabajo.',
  },
};

const capabilityIcons = [Code2, Boxes, Cpu, Mic2, ShieldCheck, Workflow];
const evidenceLinks = [
  'https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure',
  'https://www.itu.int/itu-d/reports/statistics/facts-figures-2025/',
  'https://www.nber.org/papers/w31161',
  'https://www.iea.org/reports/energy-and-ai/executive-summary',
];

export default function Launch() {
  const { lang } = useLanguage();
  const c = copy[lang];

  return (
    <div className="launch-page">
      <Navigation dark />
      <main>
        <section className="launch-hero">
          <img src="/images/campaign/gallery/01-command-the-whole-workspace.png" alt="Tlamatini and an engineer directing a connected engineering workspace" />
          <div className="launch-hero-scrim" />
          <div className="launch-shell launch-hero-content">
            <p className="launch-kicker">{c.eyebrow}</p>
            <h1>{c.title}</h1>
            <p className="launch-lead">{c.lead}</p>
            <div className="launch-actions">
              <a href="https://github.com/XAIHT/Tlamatini" target="_blank" rel="noopener noreferrer" className="launch-button launch-button-primary">
                {c.source}<ExternalLink size={17} />
              </a>
              <Link to="/tlamatini" className="launch-button launch-button-secondary">
                {c.platform}<ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        <section className="launch-proof" aria-label="Verified product inventory">
          <div className="launch-shell launch-proof-grid">
            {['87', '107', '28', 'v1.48.15'].map((value, index) => (
              <div key={value}>
                <strong>{value}</strong>
                <span>{c.proof[index]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="launch-band launch-thesis">
          <div className="launch-shell launch-two-col">
            <div>
              <p className="launch-kicker">{c.shiftLabel}</p>
              <h2>{c.shiftTitle}</h2>
              <p className="launch-body">{c.shiftBody}</p>
            </div>
            <figure className="launch-media">
              <img src="/images/campaign/gallery/02-know-the-codebase.png" alt="Tlamatini leading an evidence-based code review" />
            </figure>
          </div>
        </section>

        <section className="launch-band launch-capabilities">
          <div className="launch-shell">
            <p className="launch-kicker">{c.capabilitiesLabel}</p>
            <h2>{c.capabilitiesTitle}</h2>
            <div className="launch-capability-grid">
              {c.capabilityCopy.map(([title, body], index) => {
                const Icon = capabilityIcons[index];
                return (
                  <article key={title}>
                    <Icon size={23} aria-hidden="true" />
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="launch-band launch-command">
          <div className="launch-shell launch-command-grid">
            <figure className="launch-media launch-media-tall">
              <img src="/images/campaign/gallery/04-approve-observe-cancel.png" alt="A human operator reviewing approval and stop controls with Tlamatini" />
            </figure>
            <div>
              <p className="launch-kicker">{c.commandLabel}</p>
              <h2>{c.commandTitle}</h2>
              <p className="launch-body">{c.commandBody}</p>
              <ul className="launch-checks">
                {c.commandPoints.map((point) => <li key={point}><CheckCircle2 size={19} />{point}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="launch-band launch-gallery-section">
          <div className="launch-shell">
            <p className="launch-kicker">{c.galleryLabel}</p>
            <h2>{c.galleryTitle}</h2>
            <p className="launch-body launch-gallery-intro">{c.galleryBody}</p>
            <div className="launch-gallery">
              {gallery.map(([file, enCaption, esCaption], index) => (
                <figure key={file} className={index === 0 || index === 10 ? 'launch-gallery-wide' : ''}>
                  <img src={`/images/campaign/gallery/${file}`} alt={lang === 'es' ? esCaption : enCaption} loading={index > 3 ? 'lazy' : 'eager'} />
                  <figcaption><span>{String(index + 1).padStart(2, '0')}</span>{lang === 'es' ? esCaption : enCaption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="launch-band launch-evidence">
          <div className="launch-shell">
            <p className="launch-kicker">{c.evidenceLabel}</p>
            <h2>{c.evidenceTitle}</h2>
            <div className="launch-evidence-grid">
              {c.evidenceItems.map(([source, finding], index) => (
                <a key={source} href={evidenceLinks[index]} target="_blank" rel="noopener noreferrer">
                  <span>{source}<ExternalLink size={14} /></span>
                  <p>{finding}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="launch-close">
          <img src="/images/campaign/gallery/00-tlamatini-master-reference.png" alt="Tlamatini in a practical engineering studio" />
          <div className="launch-close-scrim" />
          <div className="launch-shell launch-close-content">
            <img src="/images/campaign/xaiht-tlamatini-lockup.svg" alt="XAIHT Tlamatini" className="launch-lockup" />
            <h2>{c.close}</h2>
            <p>{c.closeBody}</p>
            <Link to="/tlamatini" className="launch-button launch-button-primary">{c.platform}<ArrowRight size={17} /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
