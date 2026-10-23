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
import TerminaterShowcase from '@/components/TerminaterShowcase';
import LiveEditorShowcase from '@/components/LiveEditorShowcase';
import { useLanguage } from '@/i18n/context';

const gallery = [
  ['01-command-the-whole-workspace.webp', 'One command surface across code, workflows, 3D, and hardware', 'Una superficie de mando para codigo, flujos, 3D y hardware'],
  ['02-know-the-codebase.webp', 'Decisions grounded in the codebase', 'Decisiones fundamentadas en el codigo'],
  ['03-turn-work-into-workflows.webp', 'Successful work becomes a reusable flow', 'El trabajo exitoso se convierte en un flujo reutilizable'],
  ['04-approve-observe-cancel.webp', 'Inspect, approve, or stop', 'Inspecciona, aprueba o detiene'],
  ['05-coordinate-frontier-agents.webp', 'External agents remain under review', 'Los agentes externos permanecen bajo revision'],
  ['06-unreal-engine-studio.webp', 'Real-time worlds under human direction', 'Mundos en tiempo real bajo direccion humana'],
  ['07-blender-product-studio.webp', '3D design connected to physical outcomes', 'Diseno 3D conectado con resultados fisicos'],
  ['08-small-game-team.webp', 'A release room for independent teams', 'Una sala de lanzamiento para equipos independientes'],
  ['09-stm32-robotics-bench.webp', 'Firmware, instruments, and repeatable motion', 'Firmware, instrumentos y movimiento repetible'],
  ['10-esp32-smart-agriculture.webp', 'Field decisions from real sensor evidence', 'Decisiones de campo con evidencia real de sensores'],
  ['11-esphome-building-operations.webp', 'Practical building operations', 'Operacion practica de edificios'],
  ['12-arduino-learning-lab.webp', 'Learning by building and testing', 'Aprender construyendo y probando'],
  ['13-video-analysis-robotics-loop.webp', 'Recorded evidence closes the robotics loop', 'La evidencia grabada cierra el bucle robotico'],
  ['14-voice-listening-accessibility.webp', 'Voice and listening expand professional access', 'Voz y escucha amplian el acceso profesional'],
  ['15-authorized-network-lab.webp', 'Security work begins with authorization', 'El trabajo de seguridad comienza con autorizacion'],
  ['16-mexico-small-manufacturer.webp', 'Less rework, more skilled judgment', 'Menos retrabajo, mas criterio especializado'],
  ['17-east-africa-solar-field-station.webp', 'Local experts keep critical power moving', 'Expertos locales mantienen la energia critica'],
  ['18-south-asia-maker-lab.webp', 'Affordable hardware moves from test to build', 'Hardware accesible pasa de prueba a produccion'],
  ['19-europe-industrial-maintenance.webp', 'Evidence supports maintenance before failure', 'La evidencia apoya el mantenimiento antes de la falla'],
  ['20-latin-america-creative-studio.webp', 'Creative delivery with technical control', 'Entrega creativa con control tecnico'],
] as const;

const copy = {
  en: {
    eyebrow: 'XAIHT presents Tlamatini v1.91.0',
    title: 'Command your work.',
    lead: 'A local-first AI operator for builders whose software touches engines, devices, media, networks, and the physical world.',
    source: 'Download Source',
    platform: 'Explore Tlamatini',
    proof: ['Workflow agents', 'Multi-Turn tools', 'Inspectable skills', 'Product version'],
    shiftLabel: 'The product thesis',
    shiftTitle: 'The next AI workspace must know the project and act across it.',
    shiftBody: 'Tlamatini controls Unreal Engine and Blender, works with STM32 and ESP32, speaks with Talker, and listens with Whisperer. In v1.91.0, set the pace in Live Editor and Terminater. Interactor guides your next line; optional browser narration explains each step. Choose who presses Enter and take your preferences into chat and both workflow panels. Bring 110 built-in Multi-Turn tools to work without giving up control.',
    capabilitiesLabel: 'One operator, six working surfaces',
    capabilitiesTitle: 'Built for the places where software becomes something real.',
    capabilityCopy: [
      ['Learn and build in the Live Editor', 'Interactor reads your unsaved work and guides your next field. Config -> Live Editor & Terminater sets 40–160 WPM, pauses, detail, suggestions, and cursor following. Try Standard or Guided learning in Preview without editing files or running commands. Your typing, Esc, or Stop interrupts her. Edit code and Markdown with Undo/Redo and Find/replace; native Save As writes to your chosen project folder with conflict checks. Globber, Grepper, Editor, and Mover work across files; PDFer, PPTXer, and LaTeXer create deliverables.'],
      ['Creative engines', 'Unreal Engine and Blender workflows connect intent to editable scenes and builds.'],
      ['Embedded systems', 'STM32, ESP32, ESPHome, and Arduino join firmware to real instruments, with working ESP32 and smart-home templates to start from.'],
      ['Voice and media', 'Talker speaks; Whisperer turns host-microphone speech into direct prompts or editable drafts. Optional browser narration explains teaching segments and commands before, during, or after typing; wait for speech to finish when you choose. Global mute and microphone listening take priority. Image-Interpreter accepts multi-image lists without duplicate files. Video-Analyzer fetches supported YouTube, Vimeo, and direct media links for timestamped transcripts and summaries.'],
      ['Human command', 'Terminater checks typed lines against the screen and flags unverified work. Use Esc to take over. In chat, say you will run commands: she leaves Enter to you and blocks other runners until you hand control back. Save I always press Enter to enforce manual execution across chat and flows. Set 20–160 WPM, shell, advisor, and waits; timeouts do not kill processes. Ask Execs, Step-by-Step, and Hard Cancel keep your choices explicit. About -> Usage waits for real data, never inventing a zero.'],
      ['Reusable orchestration', 'Connect 86 agents in .flw or use eight operations in .fpmt, including Terminater. Pass terminal output to the next step, collect User Input, and add static rich-text User Commentary. Open from Windows or drop into the right editor; opening never runs a flow. Terminal sessions survive page closure until Tlamatini exits; each prompt run keeps its own context.'],
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
    eyebrow: 'XAIHT presenta Tlamatini v1.91.0',
    title: 'Comanda tu trabajo.',
    lead: 'Una operadora de IA local-first para quienes construyen software que toca motores, dispositivos, medios, redes y el mundo fisico.',
    source: 'Descargar codigo',
    platform: 'Explorar Tlamatini',
    proof: ['Agentes de flujo', 'Herramientas Multi-Turn', 'Skills inspeccionables', 'Version actual'],
    shiftLabel: 'La tesis del producto',
    shiftTitle: 'El proximo espacio de IA debe conocer el proyecto y actuar en todo el.',
    shiftBody: 'Tlamatini controla Unreal Engine y Blender, trabaja con STM32 y ESP32, habla con Talker y escucha con Whisperer. En v1.91.0, elige el ritmo en Live Editor y Terminater. Interactor guia tu siguiente linea; la narracion opcional del navegador explica cada paso. Decide quien pulsa Enter y lleva tus preferencias al chat y ambos paneles de flujos. Pon 110 herramientas Multi-Turn a trabajar sin ceder tu control.',
    capabilitiesLabel: 'Una operadora, seis superficies de trabajo',
    capabilitiesTitle: 'Hecha para los lugares donde el software se vuelve algo real.',
    capabilityCopy: [
      ['Aprende y crea en Live Editor', 'Interactor lee el trabajo sin guardar y guia tu siguiente campo. Config -> Live Editor & Terminater ajusta 40–160 WPM, pausas, detalle, sugerencias y seguimiento. Prueba Standard o Guided learning en Preview sin editar archivos ni ejecutar comandos. Tu escritura, Esc o Stop la interrumpen. Edita codigo y Markdown con Undo/Redo y Find/replace; Save As nativo guarda en tu proyecto con comprobacion de conflictos. Globber, Grepper, Editor y Mover trabajan entre archivos; PDFer, PPTXer y LaTeXer crean entregables.'],
      ['Motores creativos', 'Unreal Engine y Blender conectan la intencion con escenas y builds editables.'],
      ['Sistemas embebidos', 'STM32, ESP32, ESPHome y Arduino unen firmware con instrumentos reales, partiendo de plantillas funcionales ESP32 y smart home.'],
      ['Voz y medios', 'Talker habla; Whisperer convierte la voz del microfono anfitrion en prompts o borradores editables. La narracion opcional del navegador explica lecciones y comandos antes, durante o despues de escribir; puedes esperar a que termine. El silencio global y la escucha del microfono tienen prioridad. Image-Interpreter admite listas sin duplicar archivos. Video-Analyzer descarga enlaces compatibles de YouTube, Vimeo y medios directos para transcripciones y resumenes con marcas de tiempo.'],
      ['Mando humano', 'Terminater comprueba las lineas en pantalla y senala trabajo no verificado. Esc toma el mando. Dile en chat que ejecutaras los comandos: deja Enter en tus manos y bloquea otros ejecutores hasta que devuelvas el control. Guarda I always press Enter para exigir ejecucion manual en chat y flujos. Ajusta 20–160 WPM, shell, advisor y esperas; agotar una espera no mata procesos. Ask Execs, Step-by-Step y Hard Cancel respetan tus decisiones. About -> Usage espera datos reales, nunca inventa un cero.'],
      ['Orquestacion reutilizable', 'Conecta 86 agentes en .flw o usa ocho operaciones en .fpmt, incluido Terminater. Pasa la salida al siguiente paso, recoge User Input y anade notas estaticas User Commentary. Abre desde Windows o suelta en el editor correcto; abrir nunca ejecuta. Las sesiones de terminal sobreviven al cierre de paginas hasta salir de Tlamatini; cada flujo de prompts conserva su contexto.'],
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
          <img src="/images/campaign/gallery/01-command-the-whole-workspace.webp" alt="Tlamatini and an engineer directing a connected engineering workspace" />
          <div className="launch-hero-scrim" />
          <div className="launch-shell launch-hero-content">
            <p className="launch-kicker">{c.eyebrow}</p>
            <h1>{c.title}</h1>
            <p className="launch-lead">{c.lead}</p>
            <div className="launch-actions">
              <a href="https://github.com/XAIHT/Tlamatini/archive/refs/tags/v1.91.0.zip" target="_blank" rel="noopener noreferrer" className="launch-button launch-button-primary">
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
            {['86', '110', '29', 'v1.91.0'].map((value, index) => (
              <div key={value}>
                <strong>{value}</strong>
                <span>{c.proof[index]}</span>
              </div>
            ))}
          </div>
        </section>

        <LiveEditorShowcase />
        <TerminaterShowcase />

        <section className="launch-band launch-thesis">
          <div className="launch-shell launch-two-col">
            <div>
              <p className="launch-kicker">{c.shiftLabel}</p>
              <h2>{c.shiftTitle}</h2>
              <p className="launch-body">{c.shiftBody}</p>
            </div>
            <figure className="launch-media">
              <img src="/images/campaign/gallery/02-know-the-codebase.webp" alt="Tlamatini leading an evidence-based code review" />
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
              <img src="/images/campaign/gallery/04-approve-observe-cancel.webp" alt="A human operator reviewing approval and stop controls with Tlamatini" />
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
          <img src="/images/campaign/gallery/00-tlamatini-master-reference.webp" alt="Tlamatini in a practical engineering studio" />
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
