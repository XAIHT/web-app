import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { translations } from '@/i18n/translations';
import { editions } from '@/i18n/editions';
import { installationSteps } from '@/i18n/installation';

const expectedAgentGroups = [
  ['Starter', 'Ender', 'Stopper', 'Cleaner', 'Sleeper', 'Croner'],
  ['Raiser', 'Forker', 'Asker', 'Counter'],
  ['AND', 'OR', 'Barrier'],
  [
    'Executer', 'Terminater', 'Pythonxer', 'SQLer', 'Mongoxer', 'Crawler', 'Googler',
    'Playwrighter', 'Apirer', 'Kalier', 'Discoverer', 'Nmapper', 'Unrealer',
    'Blenderer', 'STM32er', 'ESP32er', 'Arduiner', 'ESPHomer', 'Gitter',
    'Reviewer', 'Analyzer', 'SSHer', 'SCPer', 'Dockerer', 'MCP Doctor',
    'Instant Messaging Doctor', 'Kuberneter', 'PSer', 'Jenkinser', 'Prompter',
    'Summarizer', 'File-Interpreter', 'File-Extractor', 'Image-Interpreter',
    'Video-Analyzer', 'NetSpeed-Calculator', 'J-Decompiler', 'De-Compresser',
    'Mover', 'Deleter', 'File-Creator', 'Shoter', 'Globber', 'Grepper', 'PDFer',
    'PPTXer', 'LaTeXer', 'Editor', 'Camcorder', 'Recorder', 'Whisperer', 'AudioPlayer',
    'VideoPlayer', 'Talker', 'Mouser', 'Windower', 'Keyboarder',
  ],
  [
    'Notifier', 'Emailer', 'RecMailer', 'Whatsapper', 'Telegrammer',
    'Monitor-Log', 'Monitor Netstat', 'FlowHypervisor',
  ],
  ['Parametrizer', 'FlowBacker', 'FlowCreator'],
  ['Kyber-KeyGen', 'Kyber-Cipher', 'Kyber-DeCipher'],
  ['TeleTlamatini'],
  ['ACPXer'],
] as const;

const expectedToolIds = [
  'visual_workflows', 'prompt_flow', 'prompt_context', 'multi_turn', 'context_preview', 'compact_mode', 'human_control', 'drop_message', 'truthful_reports',
  'flowcreator', 'acpx', 'external_mcps', 'skills', 'rag', 'unrealer',
  'blenderer', 'stm32er', 'esp_firmware', 'robotic_loop', 'image_vision', 'analysis_recovery', 'whisperer',
  'mic_preferences', 'talker', 'media', 'netspeed', 'googler', 'crawler', 'blue_hat', 'security_agents',
  'codebase', 'documents', 'pdf_canvas', 'model_config', 'browser_desktop', 'messaging', 'database',
  'windows_delivery', 'self_knowledge', 'prompt_catalog', 'mcp_adder',
  'dependable_runtime',
] as const;

const expectedFeatureIds = [
  'security', 'netspeed', 'creative_engines', 'embedded', 'voice_vision',
  'documents', 'multi_turn', 'visual_workflows', 'external_mcps', 'acpx_skills',
  'research_rag', 'database', 'windows_delivery',
] as const;

const flattenAgentNames = (lang: 'en' | 'es') =>
  translations[lang].tlamatini.agents.groups.map((group) =>
    group.agents.map((agent) => agent.name),
  );

describe('Tlamatini v1.91.0 website truth contract', () => {
  it('promotes Interactor without inventing an additional workflow agent', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const tutor = copy.home.tools.items.find(item => item.id === 'codebase')!;
      for (const surface of [copy.home.overview.desc, copy.tlamatini.hero.desc,
        copy.tlamatini.overview.p2, copy.footer.ctaDesc, tutor.name,
        copy.tlamatini.features.items.find(item => item.id === 'documents')!.description]) {
        expect(surface).toContain('Interactor');
      }
      for (const term of (lang === 'es' ? ['Multi-Turn', 'Editor en vivo', 'Continuar en el chat', 'Pedir una pista', 'Explicar la selección', 'Esc', 'Detener el tutor'] : ['Multi-Turn', 'Live editor', 'Continue', 'Another hint', 'Explain selection', 'Esc', 'Stop'])) {
        expect(tutor.desc).toContain(term);
      }
      expect(tutor.desc).toMatch(/live unsaved buffer|texto sin guardar/);
      expect(tutor.desc).toMatch(/no model call per keystroke|sin llamar al modelo por cada tecla/);
      expect(tutor.desc).toMatch(/typing never saves or executes|escribir nunca guarda ni ejecuta/);
      expect(tutor.desc).toMatch(/without replaying text|sin repetir texto/);
      expect(copy.ascii.phrases.some(phrase => phrase.includes('Interactor'))).toBe(true);
      expect(flattenAgentNames(lang).flat()).not.toContain('Interactor');
      expect(flattenAgentNames(lang).flat()).toHaveLength(86);
      expect(copy.home.architecture.multiTurn.desc).toContain('110');
    }
    const launch = readFileSync(resolve('src/pages/Launch.tsx'), 'utf8');
    expect(launch.match(/Interactor/g)?.length).toBeGreaterThanOrEqual(4);
  });

  it('describes editing and saving without claiming autosave or editable PDFs', () => {
    for (const lang of ['en', 'es'] as const) {
      const canvas = translations[lang].home.tools.items.find(item => item.id === 'pdf_canvas')!.desc;
      for (const term of (lang === 'es' ? ['JSON', 'Markdown', 'Deshacer/Rehacer', 'Buscar y reemplazar', 'Ajustar', 'Guardar como', 'Vista previa', 'Código'] : ['JSON', 'Markdown', 'Undo/Redo', 'Find/replace', 'Wrap', 'Save As', 'Preview', 'Source'])) {
        expect(canvas).toContain(term);
      }
      expect(canvas).toMatch(/local connections|conexiones locales/);
      expect(canvas).toMatch(/disk conflicts|conflictos en disco/);
      expect(canvas).toMatch(/encoding and line endings|codificación y saltos de línea/);
      expect(canvas).toMatch(/Cancelled saves keep your edits|Cancelar conserva tus cambios/);
      expect(canvas).toMatch(/Save before closing|Guarda antes de cerrar/);
      expect(canvas).toMatch(/PDFs remain read-only|PDFs son de solo lectura/);
      expect(canvas).toMatch(/Save copies the original|Guardar copia el original/);
      expect(canvas).toMatch(/asking before discarding edits|confirma antes de descartar cambios/);
    }
  });

  it('describes stronger terminal verification and user-run lessons', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const views = copy.terminater.views;
      expect(views[0].desc).toMatch(/terminal screen|línea en pantalla/);
      expect(views[1].desc).toContain('Enter');
      expect(views[1].desc).toMatch(/In chat|en chat/);
      expect(views[1].desc).toMatch(/until you hand execution back|hasta que le devuelvas el mando/);
      expect(copy.terminater.benefits[0].desc).toMatch(/correction attempt or a visible warning|intento de corrección o un aviso visible/);
      expect(views[0].desc).toMatch(/notes stay above the output|avisos quedan encima de la salida/);
      const agent = copy.tlamatini.agents.groups.flatMap(group => group.agents).find(item => item.name === 'Terminater')!;
      expect(agent.desc).toContain('Enter');
      expect(agent.desc).toMatch(/unverified work|trabajo no confirmado/);
    }
  });

  it('keeps account creation separate from editor tutoring and external notifications', () => {
    for (const lang of ['en', 'es'] as const) {
      const guide = translations[lang].home.tools.items.find(item => item.id === 'prompt_catalog')!.desc;
      expect(guide).toMatch(/passwords in the console, not chat|contraseñas en la consola, no en chat/);
      expect(guide).toMatch(/administrator account|cuenta administradora/);
      expect(guide).toMatch(/email field is not consent|email no autoriza/);
      expect(guide).toMatch(/Local Notifier|locales de Notifier/);
    }
  });

  it('routes source and installer downloads through the selected edition', () => {
    for (const path of ['src/components/Footer.tsx', 'src/pages/Launch.tsx', 'src/pages/Tlamatini.tsx']) {
      const source = readFileSync(resolve(path), 'utf8');
      expect(source).toContain('href={edition.sourceUrl}');
      expect(source).not.toContain('archive/refs/heads/');
      expect(source).not.toContain('Tlamatini_Source_v1.88.0');
    }
    for (const lang of ['en', 'es'] as const) {
      const edition = editions[lang];
      const installation = installationSteps(lang).install_tlamatini;
      expect(installation).toContain(edition.sourceUrl);
      expect(installation).toContain(edition.installerUrl);
      expect(installation).toContain(`cd ${edition.sourceFolder}`);
      expect(installation).toContain('$env:TLAMATINI_VERSION');
      expect(translations[lang].terminater.requirement).toBe('Windows 11 x64');
      expect(translations[lang].home.tools.items.find(item => item.id === 'browser_desktop')?.desc).toContain('Windows 11 x64');
    }
    for (const path of ['src/components/Navigation.tsx', 'src/components/Footer.tsx', 'src/pages/Home.tsx']) {
      expect(readFileSync(resolve(path), 'utf8')).toContain('href={edition.repoUrl}');
    }
    for (const path of ['src/components/LiveEditorShowcase.tsx', 'src/components/TerminaterShowcase.tsx']) {
      expect(readFileSync(resolve(path), 'utf8')).toContain('href={edition.installerUrl}');
    }
  });

  it('gives Terminater a bilingual visual showcase on every marketing route', () => {
    for (const lang of ['en', 'es'] as const) {
      const showcase = translations[lang].terminater;
      expect(showcase.title).toBe('Terminater');
      expect(showcase.label).toContain('v1.91.0');
      expect(showcase.views.map(view => view.id)).toEqual(['terminals', 'handover', 'workflows']);
      expect(showcase.benefits).toHaveLength(3);
      expect(showcase.views[1].desc).toContain('Esc');
      expect(showcase.views[2].desc).toContain('Prompt Flow Panel');
      for (const view of showcase.views) {
        expect(view.alt.length).toBeGreaterThan(40);
        expect(readFileSync(resolve(`public/images/terminater/${view.id}.webp`)).toString('ascii', 8, 12)).toBe('WEBP');
      }
    }
    for (const route of ['Home', 'Tlamatini', 'Launch']) {
      expect(readFileSync(resolve(`src/pages/${route}.tsx`), 'utf8')).toContain('<TerminaterShowcase />');
    }
  });

  it('keeps the exact 86-agent catalog in nine authoritative families', () => {
    const english = flattenAgentNames('en');
    const spanish = flattenAgentNames('es');

    expect(english).toEqual(expectedAgentGroups);
    expect(spanish).toEqual(expectedAgentGroups);
    expect(english.flat()).toHaveLength(86);
    expect(new Set(english.flat()).size).toBe(86);
    expect(english.map((group) => group.length)).toEqual([6, 4, 3, 57, 8, 3, 3, 1, 1]);
  });

  it('keeps titles, descriptions, types, and media joined by stable identifiers', () => {
    for (const lang of ['en', 'es'] as const) {
      const tools = translations[lang].home.tools.items;
      const features = translations[lang].tlamatini.features.items;
      expect(tools.map((tool) => tool.id)).toEqual(expectedToolIds);
      expect(features.map((feature) => feature.id)).toEqual(expectedFeatureIds);
      expect(new Set(tools.map((tool) => tool.id)).size).toBe(tools.length);
      expect(new Set(features.map((feature) => feature.id)).size).toBe(features.length);
      tools.forEach((tool) => {
        expect(tool.name.trim()).not.toBe('');
        expect(tool.desc.trim()).not.toBe('');
        expect(tool.type.trim()).not.toBe('');
      });
      features.forEach((feature) => {
        expect(feature.title.trim()).not.toBe('');
        expect(feature.description.trim()).not.toBe('');
      });
    }
  });

  it('advertises the current release and crown jewels', () => {
    const english = JSON.stringify(translations.en);
    for (const required of [
      'v1.91.0', '86 agents', '110 built-in Multi-Turn tools', '29 skills',
      'NetSpeed-Calculator', 'Blue-hat', 'WAL-safe', 'Googler', 'MCP Adder',
      'Unreal Engine', 'Blender', 'STM32er', 'ESP32er', 'Talker', 'Whisperer',
      'PPTXer', 'Context Governor', '256-call', 'Compact mode',
    ]) {
      expect(english).toContain(required);
    }
  });

  it('keeps the technology stack current and substantial in both languages', () => {
    for (const lang of ['en', 'es'] as const) {
      const stack = translations[lang].tlamatini.techStack;
      expect(stack.title).toContain('v1.91.0');
      expect(stack.groups).toHaveLength(6);
      stack.groups.forEach((group) => expect(group.items.length).toBeGreaterThanOrEqual(5));
    }

    const englishStack = JSON.stringify(translations.en.tlamatini.techStack);
    for (const required of [
      'Python 3.12.10', 'Django 5.2.15', 'Django Channels 4.1',
      'LangChain 0.3.30', 'LangGraph 0.2.74', 'FAISS 1.9', 'MCP SDK 1.28.1',
      'OpenCV 4.13', 'Playwright 1.52', 'PyInstaller 6.18', 'PDF.js 6.3.289',
    ]) {
      expect(englishStack).toContain(required);
    }
  });

  it('keeps voice-command boundaries and the current model setup in both languages', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const listening = copy.home.tools.items.find((tool) => tool.id === 'whisperer');
      const catalog = copy.home.tools.items.find((tool) => tool.id === 'prompt_catalog');
      expect(listening?.desc).toContain('3.5');
      expect(listening?.desc).toContain('300');
      expect(catalog?.desc).toContain('VOICE COMMANDS');
      expect(catalog?.desc).toContain('SPEAK YOUR PROMPT');
      expect(catalog?.desc).toMatch(/written confirmation|confirmación escrita/);
      expect(copy.tlamatini.presence.panels[0].desc).toContain('120');
      expect(copy.tlamatini.overview.p2).toContain('Prompt Flow Panel');
      expect(copy.tlamatini.overview.p2).toContain('v1.91.0');
    }
    const setup = Object.values(installationSteps('en')).join('\n');
    expect(setup).toContain('ollama pull glm-5.3:cloud');
    expect(setup).toContain('ollama pull mistral-large-3:675b-cloud');
    expect(setup).toContain('ollama pull gemma4:cloud');
    expect(setup).toContain('38 settings in six categories');
    expect(setup).toContain(editions.en.installerName);
    expect(setup).not.toContain('ollama pull qwen3.5:cloud');
    expect(setup).not.toContain('ollama pull jcyhsiao/qwen3.5cloud:latest');
    expect(setup).not.toContain('ollama pull kimi-k2.7-code:cloud');
  });

  it('keeps the new document, video, and model capabilities aligned in both languages', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const findTool = (id: string) => copy.home.tools.items.find((tool) => tool.id === id);
      const documents = findTool('documents')?.desc ?? '';
      for (const value of ['36', '17', '24', '20', '30']) expect(documents).toContain(value);
      expect(findTool('pdf_canvas')?.desc).toContain(lang === 'es' ? 'Procesar imágenes' : 'Process images');
      expect(findTool('pdf_canvas')?.desc).toContain(lang === 'es' ? 'Continuar' : 'Continue');
      expect(findTool('model_config')?.desc).toContain('38');
      expect(findTool('model_config')?.desc).toContain('21');
      expect(findTool('media')?.desc).toContain('Video-Analyzer');
      expect(copy.ascii.phrases.some((phrase) => phrase.includes('PPTXer'))).toBe(true);
      expect(copy.ascii.phrases.some((phrase) => phrase.includes('Unreal Engine'))).toBe(true);
      expect(copy.ascii.phrases.some((phrase) => phrase.includes('Blender'))).toBe(true);
      const agents = copy.tlamatini.agents.groups.flatMap((group) => group.agents);
      expect(agents.find((agent) => agent.name === 'PPTXer')?.desc).toContain('36');
      expect(agents.find((agent) => agent.name === 'Video-Analyzer')?.desc).toMatch(/audio|voz/i);
    }
  });

  it('keeps version and inventory claims consistent on the home and launch pages', () => {
    const home = readFileSync(resolve('src/pages/Home.tsx'), 'utf8');
    const launch = readFileSync(resolve('src/pages/Launch.tsx'), 'utf8');
    expect(home).toContain("value: '86'");
    expect(home).toContain("value: edition.tag");
    expect(launch).toContain("['86', '110', '29', edition.tag]");
    expect(launch).toContain('PPTXer');
  });

  it('distinguishes prompt diagrams from agent workflows in both languages', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const findTool = (id: string) => copy.home.tools.items.find((tool) => tool.id === id);
      const prompt = findTool('prompt_flow')?.desc ?? '';
      for (const operation of [
        'Prompt', 'Programmed Prompt', 'Decision', 'Feed embeddings',
        'Flush embeddings', 'Clean History', 'User Input', 'Terminater', 'User Commentary',
        'Multi-Turn', 'ACPX', 'Play', 'Pause', 'Stop',
      ]) expect(prompt).toContain(operation);

      const context = findTool('prompt_context')?.desc ?? '';
      expect(context).toContain('{{last_output}}');
      expect(context).toContain('.fpmt');
      expect(context).toMatch(/opening never runs|abrir nunca ejecuta/);
      expect(context).toMatch(/remain open|manteniendo abiertos/);
      expect(context).toContain('5–95%');
      expect(prompt).toMatch(/eight executable operations|ocho operaciones ejecutables/);
      expect(prompt).toMatch(/never execute|nunca se ejecutan/);
      expect(findTool('visual_workflows')?.desc).toContain('.flw');
      expect(copy.home.workflow.desc).toContain('.flw');
      expect(copy.home.workflow.desc).toContain('.fpmt');
      expect(copy.ascii.phrases.some((phrase) => phrase.includes('Prompt Flow Panel'))).toBe(true);
      expect(copy.tlamatini.features.items.find((feature) => feature.id === 'visual_workflows')?.description).toContain('.fpmt');
      expect(copy.tlamatini.agents.groups.flatMap((group) => group.agents)).toHaveLength(86);
    }
  });

  it('keeps vision failures explicit without claiming recovery stops', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const findTool = (id: string) => copy.home.tools.items.find((tool) => tool.id === id);
      const vision = findTool('image_vision')?.desc ?? '';
      for (const model of ['Mistral', 'Gemma', 'GLM']) expect(vision).toContain(model);
      const recovery = findTool('analysis_recovery')?.desc ?? '';
      expect(recovery).toContain('Fatal analysis errors');
      expect(recovery).toContain('Dismiss');
      expect(recovery).toMatch(/without.*cancelling|sin.*cancelar/);
      expect(recovery).toMatch(/retries|Reintentos/);
      expect(findTool('pdf_canvas')?.desc).toMatch(/never incomplete visual context|nunca contexto visual incompleto/);
      expect(findTool('media')?.desc).toMatch(/reject failed observers|rechaza fallas de observación/);
    }
  });

  it('aligns menu locations and the published release update path', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      for (const label of [lang === 'es' ? 'Paneles' : 'Panels', 'Config', lang === 'es' ? 'Vistas' : 'Views', lang === 'es' ? 'Restablecer distribución' : 'Reset layout']) {
        expect(copy.home.architecture.overview.card1.desc).toContain(label);
      }
      for (const label of ['Agentic Control Panel', 'Prompt Flow Panel']) {
        expect(copy.tlamatini.overview.p2).toContain(label);
      }
      expect(copy.tlamatini.overview.p2).toContain(lang === 'es' ? 'Acerca de -> Buscar actualizaciones' : 'About -> Check for updates');
      expect(copy.tlamatini.installation.desc).toMatch(/delivers the published app|entrega la app publicada/);
    }
    const setup = Object.values(installationSteps('en')).join('\n');
    expect(setup).toContain('Config -> Configure MCPs');
    expect(setup).toContain('Config -> Configure Agents');
    expect(setup).toContain('Panels -> Agentic Control Panel');
    expect(setup).toContain('Panels -> Prompt Flow Panel');
    const launch = readFileSync(resolve('src/pages/Launch.tsx'), 'utf8');
    expect(launch).toContain('Product version');
    expect(launch).not.toContain('Source version');
  });

  it('separates direct dictation, microphone preferences, and guided voice commands', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const findTool = (id: string) => copy.home.tools.items.find((tool) => tool.id === id);
      const direct = findTool('whisperer')?.desc ?? '';
      expect(direct).toMatch(/host microphone|micrófono del equipo/);
      expect(direct).toMatch(/automatically|automáticamente/);
      expect(direct).toMatch(/editable draft|borrador/);
      expect(direct).toMatch(/cloud engines receive your audio|motores cloud opcionales reciben tu audio/);
      expect(direct).toContain('CPU');
      const mic = findTool('mic_preferences')?.desc ?? '';
      for (const label of ['Config -> Mic', lang === 'es' ? 'Config -> Modelos -> Voz' : 'Config -> Models -> Speech', lang === 'es' ? 'Voz' : 'Voice', 'beam/VAD']) {
        expect(mic).toContain(label);
      }
      expect(mic).toMatch(/this browser|este navegador/);
      expect(mic).toMatch(/next recording|próxima grabación/);
      expect(findTool('prompt_catalog')?.desc).toMatch(/separate from direct Mic|distintas del botón Mic/);
      expect(copy.tlamatini.presence.spotlight.desc).toMatch(/never submit|nunca envían/);
      expect(copy.tlamatini.presence.spotlight.desc).toContain(lang === 'es' ? 'modo silencioso' : 'Silent');
      const agents = copy.tlamatini.agents.groups.flatMap((group) => group.agents);
      expect(agents.find((agent) => agent.name === 'Whisperer')?.desc).toMatch(/auto-send|autoenvío/);
      expect(copy.ascii.phrases.some((phrase) => phrase.includes('Config -> Mic'))).toBe(true);
    }
    const setup = Object.values(installationSteps('en')).join('\n');
    expect(setup).toContain('Config -> Mic');
    expect(setup).toContain('Send automatically (default)');
    expect(setup).toContain('Keep in the chat input');
    expect(setup).toContain('python.exe -m pip install -r requirements.txt');
  });

  it('keeps the published installer current without overstating the capabilities', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      expect(copy.tlamatini.hero.subtitle).toContain('v1.91.0');
      expect(copy.tlamatini.installation.desc).toContain('v1.91.0');
      expect(copy.tlamatini.installation.desc).toContain(lang === 'es' ? 'Acerca de -> Buscar actualizaciones' : 'About -> Check for updates');
      expect(copy.tlamatini.hero.subtitle).toMatch(/\| v1\.91\.0$/);
      const packaging = copy.home.tools.items.find((tool) => tool.id === 'windows_delivery')?.desc ?? '';
      expect(packaging).toContain('86');
      expect(packaging).toContain('ESPHome');
      expect(packaging).toMatch(/verify required files|verifican archivos requeridos/);
      const visibleCopy = JSON.stringify(copy);
      expect(visibleCopy).not.toMatch(/zero[- ]latency|latencia cero/i);
      expect(visibleCopy).not.toMatch(/prompts revisados|reviewed prompts/);
    }
  });

  it('distinguishes real main-chat token counts from pending estimates in both languages', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const feature = copy.tlamatini.features.items.find((item) => item.id === 'multi_turn')?.description ?? '';
      for (const term of ['Ollama', 'one-shot', 'Multi-Turn', 'REAL', 'est.']) {
        expect(feature).toContain(term);
      }
      expect(feature).toMatch(/main chat|chat principal/);
      const orchestration = copy.home.tools.items.find((item) => item.id === 'multi_turn')?.desc ?? '';
      expect(orchestration).toMatch(/each user|por usuario/);
      expect(copy.home.architecture.multiTurn.items[0].desc).toContain('Ollama');
      expect(copy.ascii.phrases.some((phrase) => /Real.*Ollama|Reales.*Ollama/.test(phrase))).toBe(true);
      const reliability = copy.home.tools.items.find((item) => item.id === 'dependable_runtime')?.desc ?? '';
      expect(reliability).toContain('Model Brain');
      expect(reliability).toContain('Files-Search');
      expect(reliability).toContain('System-Metrics');
    }
  });

  it('explains preview exclusions, probe consumption, caching, and opt-out', () => {
    for (const lang of ['en', 'es'] as const) {
      const preview = translations[lang].home.tools.items.find((item) => item.id === 'context_preview')?.desc ?? '';
      expect(preview).toMatch(/not included yet|Aún excluye/);
      expect(preview).toMatch(/question-specific context|contexto específico/);
      expect(preview).toMatch(/consume real tokens|consumen tokens reales/);
      expect(preview).toMatch(/cached counts|conteos en caché/);
      expect(preview).toMatch(/Disable probing|Desactívalas/);
      expect(preview).toContain('config.json');
      expect(preview).toContain('ACPX');
      expect(preview).toMatch(/excluded from the gauge|fuera del indicador/);
    }
  });

  it('advertises bounded three-tier search with honest outcomes and retained result coverage', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const search = copy.home.tools.items.find((item) => item.id === 'googler')?.desc ?? '';
      expect(search).toMatch(/six parallel HTTP|seis rutas HTTP paralelas/);
      expect(search).toMatch(/eight real-browser|ocho rutas de navegador/);
      expect(search).toMatch(/open-knowledge|fuentes abiertas/);
      expect(search).toMatch(/cooldowns|pausas entre motores/);
      expect(search).toContain('Cancel');
      expect(search).toMatch(/No CAPTCHA or access-control bypass|Sin evadir CAPTCHA ni controles de acceso/);
      const research = copy.tlamatini.features.items.find((item) => item.id === 'research_rag')?.description ?? '';
      expect(research).toMatch(/titles and URLs|títulos y URLs/);
      expect(research).toMatch(/shortened text|texto abreviado/);
      expect(research).toContain('Crawler');
      expect(research).toMatch(/malformed HTML|HTML mal formado/);
      expect(research).toMatch(/report fallback extraction|informan la extracción alternativa/);
    }
  });

  it('keeps Crawler scope, failure reporting, and JavaScript boundaries clear', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const crawler = copy.home.tools.items.find((item) => item.id === 'crawler')?.desc ?? '';
      expect(crawler).toMatch(/specified page by default|página indicada por defecto/);
      expect(crawler).toMatch(/page, size, and time limits|límites de páginas, tamaño y tiempo/);
      expect(crawler).toMatch(/not analyzed as content|no se analizan como contenido/);
      expect(crawler).toContain('JavaScript');
      expect(crawler).toContain('Playwrighter');
      const agents = copy.tlamatini.agents.groups.flatMap((group) => group.agents);
      expect(agents.find((agent) => agent.name === 'Crawler')?.desc).toMatch(/by default|por defecto/);
      expect(agents.find((agent) => agent.name === 'Googler')?.desc).toMatch(/three tiers|tres niveles/);
      expect(copy.ascii.phrases.some((phrase) => phrase.includes('Crawler'))).toBe(true);
      expect(JSON.stringify(copy)).not.toMatch(/invulnerable|unblockable|guaranteed access|nunca se bloquea/i);
    }
  });

  it('promotes clearer avatar lips without confusing browser speech with Talker', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const portrait = copy.tlamatini.presence.panels.find((panel) => panel.id === 'friendly')?.desc ?? '';
      expect(portrait).toMatch(/lips|labios/);
      expect(portrait).toMatch(/open-mouth artwork|apertura de su propio retrato/);
      expect(portrait).toMatch(/spoken text|texto hablado/);
      const speech = copy.home.tools.items.find((item) => item.id === 'talker')?.desc ?? '';
      expect(speech).toContain('WAV');
      expect(speech).toMatch(/Separately|Por separado/);
      expect(speech).toMatch(/without exaggerated motion|sin movimientos exagerados/);
      expect(copy.ascii.phrases.some((phrase) => /Avatar|Voice|Voz/.test(phrase))).toBe(true);
    }
  });

  it('keeps v1.91.0 consistent across the published release and source instructions', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      expect(copy.home.overview.stats.version).toBe(lang === 'en' ? 'Version' : 'Versión');
      expect(copy.home.overview.desc).toContain('v1.91.0');
      expect(copy.ascii.phrases).toContain('Tlamatini v1.91.0');
      expect(copy.tlamatini.hero.subtitle.match(/v\d+\.\d+\.\d+/g)).toEqual(['v1.91.0']);
      expect(copy.tlamatini.hero.subtitle).not.toMatch(/Source|Installer|Código|Instalador/);
      expect(copy.footer.ctaDesc).toContain('v1.91.0');
      const install = copy.tlamatini.installation.desc;
      expect(install).toContain('v1.91.0');
      expect(install).toContain(lang === 'es' ? 'Acerca de -> Buscar actualizaciones' : 'About -> Check for updates');
      expect(install).toMatch(/delivers the published app|entrega la app publicada/);
      expect(install).toMatch(/run her from source|ejecútala desde el código/);
      expect(install).toContain('Model Brain');
      expect(new Set(JSON.stringify(copy).match(/v1\.\d+\.\d+/g))).toEqual(new Set(['v1.91.0']));
    }
    const setup = Object.values(installationSteps('en')).join('\n');
    expect(setup).toContain('Tlamatini v1.91.0 Windows installer');
    expect(setup).toContain('Option B: run Tlamatini v1.91.0 from source');
    expect(setup).toContain('Setup verifies a recovery copy before changing files');
    expect(setup).toContain('Requires Python 3.12.10.');
    expect(setup).not.toMatch(/When published|earlier tag snapshot|Updates become available after publication/);
    const launch = readFileSync(resolve('src/pages/Launch.tsx'), 'utf8');
    expect(launch).toContain('XAIHT presents Tlamatini ${editions.en.tag}');
    expect(launch).toContain('XAIHT presenta Tlamatini ${editions.es.tag}');
    expect(launch).not.toMatch(/Source v1\.|Codigo v1\./);
    expect(readFileSync(resolve('src/pages/Home.tsx'), 'utf8')).toContain("value: edition.tag");
  });

  it('explains real Compact selections, capacity locks, and explicit restoration', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const compact = copy.home.tools.items.find((item) => item.id === 'compact_mode')?.desc ?? '';
      for (const term of ['Configure', 'System-Metrics', 'Files-Search', 'Current-Time', 'ON', 'OFF']) {
        expect(compact).toContain(term);
      }
      expect(compact).toMatch(/really unticks|desmarca realmente/);
      expect(compact).toMatch(/Tick back only|Reactiva sólo/);
      expect(compact).toMatch(/External MCPs stay paused|MCPs externos siguen pausados/);
      expect(compact).toMatch(/without a restart|sin reiniciar/);
      expect(compact).toMatch(/locks Compact ON|bloquea Compact en ON/);
      expect(compact).toMatch(/unlocks it but keeps your picks|desbloquea y conserva tu selección/);
      expect(compact).toMatch(/enables every row|activa todas las filas/);
      expect(compact).toMatch(/restores previously active External MCPs|restaura los MCPs externos antes activos/);
      expect(copy.ascii.phrases.some((phrase) => phrase.includes('Compact'))).toBe(true);
      expect(JSON.stringify(copy)).not.toMatch(/dialog and badge|diálogo y una insignia|restore Full mode and your enabled tools|recuperar Full y tus herramientas habilitadas/);
    }
    const setup = Object.values(installationSteps('en')).join('\n');
    expect(setup).toContain('Compact mode is a toolbar switch');
    expect(setup).toContain('Saved Configure choices apply without a restart');
  });

  it('shows estimated row costs separately from real counts and warns about cuts', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const models = copy.home.tools.items.find((item) => item.id === 'model_config')?.desc ?? '';
      expect(models).toMatch(/estimated token costs|costos estimados/);
      expect(models).toMatch(/saved tool choices|selección de herramientas/);
      const governor = copy.home.architecture.multiTurn.items[0].desc;
      for (const term of ['Ollama', 'CONTEXT-WINDOW', '100%', 'OVER', 'CUT']) expect(governor).toContain(term);
      const feature = copy.tlamatini.features.items.find((item) => item.id === 'multi_turn')?.description ?? '';
      for (const term of ['est.', 'REAL', 'OVER', 'CUT']) expect(feature).toContain(term);
      expect(feature).toMatch(/carries a warning|lleva un aviso/);
    }
  });

  it('qualifies Self-modify with model and build limits', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const self = copy.home.tools.items.find((item) => item.id === 'self_knowledge')?.desc ?? '';
      expect(self).toContain('Self-modify');
      expect(self).toMatch(/self-knowledge token cost|costo de tokens del autoconocimiento/);
      expect(self).not.toContain('28.9K');
      expect(self).toMatch(/source runs and builds|desde código o en builds/);
      expect(self).toMatch(/hidden otherwise|oculto en los demás/);
      expect(self).toMatch(/ON includes|ON incluye/);
      expect(self).toMatch(/locks the switch OFF|bloquea en OFF/);
      expect(self).toMatch(/without erasing your choice|sin borrar tu elección/);
      expect(self).toMatch(/larger model unlocks|mayor lo desbloquea/);
      expect(copy.ascii.phrases.some((phrase) => phrase.includes('Self-modify'))).toBe(true);
    }
  });

  it('covers chat and image reliability without promising infallibility', () => {
    for (const lang of ['en', 'es'] as const) {
      const runtime = translations[lang].home.tools.items.find((item) => item.id === 'dependable_runtime')?.desc ?? '';
      expect(runtime).toContain('Model Brain');
      expect(runtime).toMatch(/history summary fails|falla el resumen del historial/);
      expect(runtime).toMatch(/history is sent unsummarized|historial sin resumir/);
      expect(runtime).toContain('Cancel');
      expect(runtime).toContain('Ollama');
      expect(runtime).toMatch(/chat and image analysis|chat e imágenes/);
      expect(runtime).toMatch(/carries a warning|lleva un aviso/);
    }
  });

  it('explains Model Brain tuning, provenance, overrides, and model limits', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const models = copy.home.tools.items.find((item) => item.id === 'model_config');
      expect(models?.name).toContain('Model Brain');
      for (const value of [lang === 'es' ? 'Config -> Modelos' : 'Config -> Models', '38', '21', lang === 'es' ? 'Guardar' : 'Save', 'Auto-tuning', 'Ollama']) {
        expect(models?.desc).toContain(value);
      }
      expect(models?.desc).toMatch(/source of each value|origen de cada valor/);
      expect(models?.desc).toMatch(/vendor profiles|perfiles del fabricante/);
      expect(models?.desc).toMatch(/defaults|valores propios del modelo/);
      expect(models?.desc).toMatch(/Your overrides win|Tus ajustes prevalecen/);
      expect(models?.desc).toMatch(/respects model capacity|respeta la capacidad/);
      expect(models?.desc).toMatch(/learned profiles survive updates|perfiles aprendidos sobreviven a updates/);
      expect(models?.desc).toMatch(/configured servers and token|tus servidores y token/);
      expect(copy.home.architecture.overview.card1.desc).toContain('Model Brain');
      expect(copy.home.architecture.multiTurn.desc).toContain('Model Brain');
      expect(copy.ascii.phrases.some((phrase) => phrase.includes('Model Brain'))).toBe(true);
    }
    const setup = Object.values(installationSteps('en')).join('\n');
    expect(setup).toContain('Save opens the live Model Brain Auto-tuning dialog');
    expect(setup).toContain('Then reconnect chat when prompted');
    expect(setup).toContain('Save does not download models');
  });

  it('describes Drop as selective chat-history control, not an undo or a memory wipe', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const drop = copy.home.tools.items.find((item) => item.id === 'drop_message')?.desc ?? '';
      expect(drop).toMatch(/yours or hers|tuyo o suyo/);
      expect(drop).toMatch(/history she reads next|historial que ella leerá después/);
      expect(drop).toMatch(/No reconnect|Sin reconectar/);
      expect(drop).toMatch(/surrounding messages stay|mensajes alrededor permanecen/);
      expect(drop).toMatch(/Cancel is selected first|Cancel queda seleccionado/);
      expect(drop).toMatch(/blocked while she answers|bloquea mientras responde/);
      expect(drop).toMatch(/cannot be undone|No se puede deshacer/);
      expect(drop).toMatch(/both cards|ambas tarjetas/);
      expect(drop).toMatch(/completed work and separate External MCP memory remain|trabajo realizado y la memoria MCP externa permanecen/);
      expect(drop).toMatch(/Unsaved notices only clear from your screen|avisos sin guardar sólo se quitan de pantalla/);
      expect(copy.home.tools.items.find((item) => item.id === 'context_preview')?.desc).toContain('Drop');
      const orchestration = copy.tlamatini.features.items.find((item) => item.id === 'multi_turn')?.description ?? '';
      expect(orchestration).toMatch(/Save a Create Flow download before dropping|Descarga Create Flow antes de eliminar/);
      expect(copy.ascii.phrases.some((phrase) => phrase.includes('Drop'))).toBe(true);
      expect(copy.tlamatini.agents.groups.flatMap((group) => group.agents).some((agent) => agent.name === 'Drop')).toBe(false);
    }
  });


  it('preserves review notes and Windows flow-opening boundaries', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const visual = copy.tlamatini.features.items.find((item) => item.id === 'visual_workflows')?.description ?? '';
      for (const term of ['86', '.flw', '.fpmt', 'User Input', 'User Commentary', 'Run output', 'Windows']) expect(visual).toContain(term);
      expect(visual).toMatch(/never model context|nunca contexto del modelo/);
      const canvas = copy.home.tools.items.find((item) => item.id === 'visual_workflows')?.desc ?? '';
      expect(canvas).toMatch(/Opening never runs|Abrir nunca ejecuta/);
      expect(canvas).toMatch(/unsaved work requires confirmation|trabajo sin guardar requiere confirmación/);
      const windows = copy.tlamatini.features.items.find((item) => item.id === 'windows_delivery')?.description ?? '';
      expect(windows).toMatch(/respect your defaults|respetan tus preferencias/);
    }
  });

  it('covers actual document delivery, partial transfers, and append in both catalogs', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const documents = copy.home.tools.items.find((item) => item.id === 'documents')?.desc ?? '';
      expect(documents).toContain('.DEGRADED.pdf');
      expect(documents).toMatch(/Real PDFs are verified|Verifica PDFs/);
      expect(documents).toMatch(/blocked destination|destino bloqueado/);
      expect(documents).toMatch(/actual saved path|ruta real/);
      const code = copy.home.tools.items.find((item) => item.id === 'codebase')?.desc ?? '';
      expect(code).toMatch(/same-name files may be replaced|nombres iguales pueden reemplazarse/);
      const agents = copy.tlamatini.agents.groups.flatMap((group) => group.agents);
      expect(agents.find((agent) => agent.name === 'File-Creator')?.desc).toMatch(/appends|añade/);
      expect(agents.find((agent) => agent.name === 'Mover')?.desc).toMatch(/unrelated files|archivos ajenos/);
      expect(agents.find((agent) => agent.name === 'LaTeXer')?.desc).toContain('.DEGRADED.pdf');
    }
  });

  it('distinguishes main-model reasoning from bounded context helpers', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const loop = copy.home.tools.items.find((item) => item.id === 'multi_turn')?.desc ?? '';
      expect(loop).toMatch(/within one answer|dentro de una respuesta/);
      expect(loop).toMatch(/gauge counts it|indicador lo cuenta/);
      const runtime = copy.home.tools.items.find((item) => item.id === 'dependable_runtime')?.desc ?? '';
      expect(runtime).toMatch(/stall clock|reloj de espera/);
      expect(runtime).toMatch(/their own time limits|sus propios plazos/);
      const compact = copy.home.tools.items.find((item) => item.id === 'compact_mode')?.desc ?? '';
      expect(compact).toMatch(/Two chat tabs on different models|Dos pestañas con modelos distintos/);
    }
  });

  it('keeps PDF account failures and Windows lifecycle outcomes explicit', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const pdf = copy.home.tools.items.find((item) => item.id === 'pdf_canvas')?.desc ?? '';
      expect(pdf).toMatch(/another account|otra cuenta/);
      expect(pdf).toMatch(/failed step|paso fallido/);
      expect(pdf).toMatch(/reload|recargar/);
      const windows = copy.home.tools.items.find((item) => item.id === 'windows_delivery')?.desc ?? '';
      expect(windows).toMatch(/local log|log local/);
      expect(windows).toContain('Retry cleanup');
      expect(windows).toMatch(/nonempty project folders are kept|Conserva agentes y carpetas con proyectos/);
    }
  });

  it('states report-only security defaults without hiding the cost of exclusions', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const security = copy.tlamatini.features.items.find((item) => item.id === 'security')?.description ?? '';
      expect(security).toMatch(/report-only scans by default|análisis informativos por defecto/);
      expect(security).toContain('Armed');
      expect(security).toContain('ASR');
      expect(security).toContain('CFA');
      expect(security).toMatch(/reduce protection|reducen protección/);
      expect(security).toMatch(/no automatic rollback|no tienen reversión automática/);
    }
  });


  it('promotes personalized first-person chat without confusing it with model-generated answers', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const friendly = copy.tlamatini.presence.panels.find((panel) => panel.id === 'friendly')?.desc ?? '';
      expect(friendly).toMatch(/first name|primer nombre/);
      expect(friendly).toMatch(/username when no first name is set|usuario si no hay nombre/);
      expect(friendly).toMatch(/first-person status messages|mensajes de estado.*primera persona/);
      expect(copy.tlamatini.presence.desc).toMatch(/first-person|primera persona/);
      expect(copy.tlamatini.presence.desc).toMatch(/first-person status messages|mensajes en primera persona/);
      expect(copy.ascii.phrases.some((phrase) => /Greets You by Name|Saluda por Tu Nombre/.test(phrase))).toBe(true);
      const talker = copy.home.tools.items.find((tool) => tool.id === 'talker')?.desc ?? '';
      expect(talker).toContain('WAV');
      expect(talker).toMatch(/Separately|Por separado/);
      expect(talker).toMatch(/first-person status messages|mensajes cercanos en primera persona/);
    }
    const launch = readFileSync(resolve('src/pages/Launch.tsx'), 'utf8');
    expect(launch).toContain('About -> Usage waits for real data');
    expect(launch).toContain('Acerca de -> Uso espera datos reales');
  });

  it('states which folders the new uninstaller preserves and which scratch it removes', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const windows = copy.tlamatini.features.items.find((item) => item.id === 'windows_delivery')?.description ?? '';
      for (const folder of ['application', 'applications', 'content_generated', 'context_files', 'doc_generated', 'Templates']) {
        expect(windows).toContain(folder);
      }
      expect(windows).toMatch(/nonempty|con archivos/);
      expect(windows).toMatch(/keeps agents|Conserva agents/);
      expect(windows).toMatch(/Temp scratch goes|Borra Temp/);
      expect(windows).toMatch(/locked leftovers|restos bloqueados/);
      expect(copy.ascii.phrases.some((phrase) => /Recoverable Removal|Desinstalación Recuperable/.test(phrase))).toBe(true);
    }
  });

  it('does not promise an uninstaller upgrade through the in-app updater', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      expect(copy.tlamatini.installation.desc).toMatch(/keeps your existing Uninstaller.exe|conserva tu Uninstaller.exe actual/);
      expect(copy.tlamatini.installation.desc).toMatch(/Run the new Installer|Ejecuta el nuevo Installer/);
      expect(copy.tlamatini.features.items.find((item) => item.id === 'windows_delivery')?.description).toMatch(/in-app updates preserve it|updates internos lo conservan/);
      const windows = copy.home.tools.items.find((item) => item.id === 'windows_delivery')?.desc ?? '';
      expect(windows).toMatch(/In-app updates keep Uninstaller.exe|Conservan Uninstaller.exe/);
    }
    const setup = Object.values(installationSteps('en')).join('\n');
    expect(setup).toContain('The in-app updater keeps your existing Uninstaller.exe');
    expect(setup).toContain('Run the new Installer to refresh the uninstaller too');
    expect(setup).toContain('not Temp scratch');
  });


  it('promotes Usage while separating account balances from recorded chat activity', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const usage = copy.home.tools.items.find((item) => item.id === 'truthful_reports')?.desc ?? '';
      for (const label of [lang === 'es' ? 'Acerca de -> Uso' : 'About -> Usage', 'Cloud credits', 'Chat activity', 'Models', '7/30', 'Exec Report', 'ACPX']) {
        expect(usage).toContain(label);
      }
      expect(usage).toMatch(/while she answers|mientras ella responde/);
      expect(usage).toMatch(/configured Ollama balances|saldos Ollama/);
      expect(usage).toMatch(/since recording began|desde el inicio del registro/);
      expect(usage).toMatch(/not lifetime history or child-agent usage|no historial previo ni agentes secundarios/);
      expect(usage).toMatch(/never zero|no son cero/);
      expect(usage).toMatch(/cached for one minute|caché de un minuto/);
      expect(copy.ascii.phrases.some((phrase) => phrase.includes(lang === 'es' ? 'Acerca de -> Uso' : 'About -> Usage'))).toBe(true);
      const feature = copy.tlamatini.features.items.find((item) => item.id === 'multi_turn')?.description ?? '';
      expect(feature).toMatch(/monthly\/purchased balances|saldos mensuales\/comprados/);
      expect(feature).toMatch(/refill weeks\/date|semanas\/fecha de recarga/);
      expect(feature).toMatch(/not other apps or child agents|no otras apps ni agentes secundarios/);
      expect(usage).toMatch(/measured chat activity|actividad medida del chat/);
    }
  });

  it('makes Usage discoverable from setup without promising historical reconstruction', () => {
    const setup = Object.values(installationSteps('en')).join('\n');
    for (const required of [
      'About -> Usage', 'Cloud credits, Chat activity, and Models',
      'monthly balance is separate', 'not earlier history, external apps, or child agents',
      'Refresh works while Tlamatini answers', 'never assumed to be zero',
    ]) expect(setup).toContain(required);
    for (const lang of ['en', 'es'] as const) {
      expect(translations[lang].tlamatini.installation.desc).toContain(lang === 'es' ? 'Acerca de -> Uso' : 'About -> Usage');
    }
  });

  it('advertises floating-avatar composer controls without claiming a redesigned website', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const presence = copy.tlamatini.presence;
      expect(presence.desc).toMatch(/Float her portrait|Separa su retrato/);
      expect(presence.desc).toMatch(/portrait docked|avatar acoplado/);
      expect(presence.desc).toMatch(/pointer or keyboard|puntero o teclado/);
      expect(presence.desc).toContain(lang === 'es' ? 'Vistas -> Canvas' : 'Views -> Canvas');
      expect(presence.spotlight.desc).toContain('Config -> Mic');
      expect(copy.ascii.phrases.some((phrase) => phrase.includes('Reset Layout'))).toBe(true);
    }
  });

  it('describes the actual Image-Interpreter repair without inventing a new agent', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const vision = copy.home.tools.items.find((item) => item.id === 'image_vision')?.desc ?? '';
      expect(vision).toMatch(/comma-separated image paths|rutas separadas por comas/);
      expect(vision).toMatch(/repeated files are analyzed once|una vez cada archivo repetido/);
      expect(vision).toMatch(/unresolved entries are reported|informa entradas no resueltas/);
      expect(vision).toMatch(/existing filename containing a comma stays intact|respeta nombres de archivo existentes con comas/);
      for (const model of ['Mistral', 'Gemma', 'GLM']) expect(vision).toContain(model);
      const agents = copy.tlamatini.agents.groups.flatMap((group) => group.agents);
      expect(agents).toHaveLength(86);
      expect(agents.find((agent) => agent.name === 'Image-Interpreter')?.desc).toMatch(/without duplicates|sin duplicados/);
    }
  });

  it('uses the published Windows 11 x64 asset for installer instructions', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      expect(copy.tlamatini.installation.desc).toContain('Windows 11 x64');
      expect(copy.tlamatini.techStack.groups.flatMap((group) => group.items).some((item) => item.includes('Windows 11 x64'))).toBe(true);
      expect(copy.tlamatini.installation.desc).toContain(lang === 'es' ? 'Acerca de -> Uso' : 'About -> Usage');
      expect(JSON.stringify(copy)).not.toMatch(/source-only Usage|Usage.*awaiting rebuild|Windows 10[|/]11/);
    }
    const setup = Object.values(installationSteps('en')).join('\n');
    expect(setup).toContain('Download the Windows 11 x64 release asset');
  });

  it('includes video-link analysis in the release rather than retaining stale source-only labels', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const media = copy.home.tools.items.find((tool) => tool.id === 'media')?.desc ?? '';
      expect(media).toMatch(/Included in v1\.91\.0|Incluido en v1\.91\.0/);
      const surfaces = [
        media, copy.home.overview.desc, copy.tlamatini.hero.desc, copy.tlamatini.overview.p2,
        copy.footer.ctaDesc, copy.tlamatini.installation.desc,
        copy.tlamatini.features.items.find((item) => item.id === 'voice_vision')?.description ?? '',
        copy.tlamatini.agents.groups.flatMap((group) => group.agents).find((agent) => agent.name === 'Video-Analyzer')?.desc ?? '',
      ];
      for (const surface of surfaces) {
        expect(surface).not.toMatch(/source-only|sólo en código|not yet include|aún no incluye|requires.*source for now/i);
      }
    }
    const launch = readFileSync(resolve('src/pages/Launch.tsx'), 'utf8');
    expect(launch).not.toMatch(/v1\.79\.0|New in .* source:|Nuevo en el codigo/);
  });

  it('includes request validation in the release without stale source-only labels', () => {
    for (const lang of ['en', 'es'] as const) {
      const recovery = translations[lang].home.tools.items.find((tool) => tool.id === 'analysis_recovery')?.desc ?? '';
      expect(recovery).not.toMatch(/Source-only|sólo en código fuente|not in the.*installer|no en el instalador/);
      expect(recovery).toMatch(/invalid or incomplete|inválidas o incompletas/i);
      expect(recovery).toMatch(/without a fatal alert|sin alerta fatal/);
      expect(recovery).toMatch(/real failures still surface|fallas reales siguen visibles/);
    }
  });

  it('promotes Markdown preview without losing source fidelity or overstating offline support', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const markdown = copy.home.tools.items.find((tool) => tool.id === 'pdf_canvas')?.desc ?? '';
      for (const term of (lang === 'es' ? ['.md', '.markdown', 'Vista previa', 'Código', 'Elegir carpeta', 'Copiar', 'Usar como contexto', 'Guardar', 'CDN'] : ['.md', '.markdown', 'Preview', 'Source', 'Choose folder', 'Copy', 'Use as context', 'Save', 'CDN'])) {
        expect(markdown).toContain(term);
      }
      expect(markdown).toMatch(/original Markdown|Markdown original/);
      expect(markdown).toMatch(/relative images and linked Markdown|imágenes relativas y otros Markdown/);
      expect(markdown).toMatch(/remote images can still load from the web|imágenes remotas sí pueden cargar desde la web/);
      expect(markdown).not.toMatch(/Mermaid|never.*network|nunca.*internet/i);
      expect(copy.ascii.phrases.some((phrase) => phrase.includes('Markdown'))).toBe(true);
      expect(copy.tlamatini.techStack.groups.flatMap((group) => group.items).some((item) => item.includes('Markdown'))).toBe(true);
    }
  });

  it('describes move-based removal recovery with visible failure and ownership limits', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const windows = copy.home.tools.items.find((tool) => tool.id === 'windows_delivery')?.desc ?? '';
      for (const term of ['Retry', 'Change folder', 'Uninstaller.exe']) expect(windows).toContain(term);
      expect(windows).toMatch(/moves files into same-drive recovery|mueve archivos a recuperación en la misma unidad/);
      expect(windows).toMatch(/instead of copying|en vez de copiar/);
      expect(windows).toMatch(/rollback for reversible steps|reversión de pasos reversibles/);
      expect(windows).toContain('Retry cleanup');
      expect(windows).toMatch(/other apps stay open|otras apps quedan abiertas/);
      expect(windows).not.toMatch(/guaranteed rollback|zero data loss|never fails|nunca falla|garantiza.*recuperación/i);
    }
    const setup = Object.values(installationSteps('en')).join('\n');
    for (const term of ['Extract the complete ZIP', 'Keep pkg.zip beside Installer.exe', 'choose a destination, review, and click Install', 'Retry, Change folder, and a log path']) {
      expect(setup).toContain(term);
    }
  });

  it('describes the consistent product workspace without changing the website layout', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const overview = copy.tlamatini.overview.p2;
      for (const term of ['Prompt Flow Panel', 'Agentic Control Panel', 'PDF']) expect(overview).toContain(term);
      expect(overview).toMatch(/mouse or keyboard|ratón o teclado/);
      const visual = copy.tlamatini.features.items.find((item) => item.id === 'visual_workflows')?.description ?? '';
      expect(visual).toMatch(/every edge and corner|cada borde y esquina/);
      expect(visual).toMatch(/without changing canvas zoom|sin cambiar el zoom/);
    }
  });

  it('promotes supported video links with bounded downloads and traceable evidence', () => {
    for (const lang of ['en', 'es'] as const) {
      const media = translations[lang].home.tools.items.find((tool) => tool.id === 'media')?.desc ?? '';
      for (const term of ['Video-Analyzer', 'YouTube', 'Vimeo', 'ffmpeg', 'URL']) expect(media).toContain(term);
      expect(media).toMatch(/supported|compatible/);
      expect(media).toMatch(/one item, not a playlist|un elemento, no una playlist/);
      expect(media).toMatch(/downloads audio only|descarga sólo audio/);
      expect(media).toMatch(/never opens a microphone|nunca abre el micrófono/);
      expect(media).toMatch(/transcribe an audio file|transcribe un archivo de audio/);
      expect(media).toMatch(/two visual observers|dos observadores visuales/);
      expect(media).toMatch(/timestamped|marcas de tiempo/);
      expect(media).toMatch(/source title and URL|título y URL de origen/);
      expect(media).toMatch(/Reuse downloads|Reutiliza descargas/);
      expect(media).toMatch(/without a separate ffmpeg install|sin instalar ffmpeg aparte/);
      expect(media).toMatch(/Coverage limits|límites de cobertura/);
    }
  });

  it('describes downloader recovery and hardware selection without promising universal access', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const recovery = copy.home.tools.items.find((tool) => tool.id === 'analysis_recovery')?.desc ?? '';
      for (const term of ['GPU', 'CPU', 'Python']) expect(recovery).toContain(term);
      expect(recovery).toMatch(/one private downloader update and retry|una actualización privada del descargador y un reintento/);
      expect(recovery).toMatch(/without changing your Python|sin modificar tu Python/);
      expect(recovery).toMatch(/Sign-in|Inicio de sesión/);
      expect(recovery).toMatch(/unavailable media|medios no disponibles/);
      expect(recovery).toMatch(/network|red/);
      expect(recovery).toMatch(/timeout|tiempos agotados/);
      expect(recovery).not.toMatch(/invulnerable|never fails|nunca falla|bypass|sin restricciones/i);
      const video = copy.tlamatini.agents.groups.flatMap((group) => group.agents).find((agent) => agent.name === 'Video-Analyzer');
      expect(video?.desc).toMatch(/two independent verdicts|dos veredictos independientes/);
      expect(video?.desc).toMatch(/supported web links with source attribution|enlaces compatibles con su origen/);
    }
  });

  it('promotes file drops with routing, confirmation, and execution boundaries', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const tools = copy.home.tools.items;
      const drops = tools.find((tool) => tool.id === 'rag')?.desc ?? '';
      for (const term of ['25', 'PDF', 'Markdown', 'JSON', 'Context -> Set directory as context', 'FAISS + BM25']) {
        expect(drops).toContain(term);
      }
      expect(drops).toMatch(/not just extensions|no sólo la extensión/);
      expect(drops).toMatch(/guidance, not execution|orientación, no ejecución/);
      const mcp = tools.find((tool) => tool.id === 'external_mcps')?.desc ?? '';
      for (const term of ['Claude Desktop', 'VS Code', 'Zed', 'opencode', 'External -> MCPs']) {
        expect(mcp).toContain(term);
      }
      expect(mcp).toMatch(/signed-in page|página con sesión/);
      expect(mcp).toMatch(/program-launch warning|aviso de ejecución de programas/);
      expect(mcp).toMatch(/importing does not activate|importar no los activa/);
      const flows = tools.find((tool) => tool.id === 'visual_workflows')?.desc ?? '';
      expect(flows).toMatch(/Opening never runs|Abrir nunca ejecuta/);
      expect(flows).toMatch(/confirmation|confirmación/);
    }
  });

  it('describes Refresh as rereading rather than choosing or overwriting a file', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const canvas = copy.home.tools.items.find((tool) => tool.id === 'pdf_canvas')?.desc ?? '';
      for (const term of [lang === 'es' ? 'Actualizar' : 'Refresh', 'Markdown', 'PDF', 'zoom']) expect(canvas).toContain(term);
      expect(canvas).toMatch(/without a picker or writing|sin selector ni escritura/);
      expect(canvas).toMatch(/page, zoom, rotation, and scroll mode|página, zoom, rotación y modo de desplazamiento/);
      expect(canvas).toMatch(/Failed reads keep the previous document|Si falla la lectura, conserva el documento anterior/);
      expect(canvas).toMatch(/snapshot-only sources|copias sin acceso al original/);
      expect(copy.ascii.phrases.some((phrase) => phrase.includes(lang === 'es' ? 'Actualizar' : 'Refresh'))).toBe(true);
    }
  });

  it('keeps Views persistence and content-preserving layout reset clear', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const control = copy.tlamatini.presence.panels.find((panel) => panel.id === 'control')?.desc ?? '';
      for (const term of (lang === 'es' ? ['Vistas -> Canvas', 'Vistas -> Restablecer distribución'] : ['Views -> Canvas', 'Views -> Reset layout'])) expect(control).toContain(term);
      expect(control).toMatch(/document, draft, history, or loaded context|documento, borrador, historial ni contexto/);
      expect(control).toMatch(/per account in this browser|por cuenta en este navegador/);
      expect(control).toMatch(/syncs tabs|sincroniza pestañas/);
      expect(control).toMatch(/Opening a file reveals the canvas|Abrir un archivo revela el lienzo/);
      expect(control).toMatch(/showing it keeps her docked|al mostrarlo sigue acoplada/);
      expect(control).toMatch(/without clearing content|sin borrar contenido/);
      const portrait = copy.tlamatini.presence.panels.find((panel) => panel.id === 'friendly')?.desc ?? '';
      expect(portrait).toMatch(/centered over the whole Mic-to-Send row|centrado sobre toda la fila de Mic a Enviar/);
      expect(portrait).toContain('120');
      expect(copy.home.architecture.overview.card1.desc).toContain(lang === 'es' ? 'Vistas' : 'Views');
      expect(copy.ascii.phrases.some((phrase) => phrase.includes('Reset Layout'))).toBe(true);
    }
  });

  it('keeps fixed-height slide summaries concise for the existing mobile layout', () => {
    for (const lang of ['en', 'es'] as const) {
      const { overview, multiTurn } = translations[lang].home.architecture;
      expect(overview.desc.length).toBeLessThanOrEqual(90);
      for (const card of [overview.card1, overview.card2]) {
        expect(card.title.length).toBeLessThanOrEqual(30);
        expect(card.desc.length).toBeLessThanOrEqual(150);
      }
      expect(multiTurn.desc.length).toBeLessThanOrEqual(60);
      for (const item of multiTurn.items) {
        expect(item.desc.length).toBeLessThanOrEqual(70);
      }
    }
  });

  it('promotes Terminater across the banner, pages, agent catalog, and workflow surfaces', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      for (const surface of [
        copy.home.overview.desc, copy.home.architecture.overview.desc,
        copy.home.workflow.desc, copy.footer.ctaDesc, copy.tlamatini.hero.desc,
        copy.tlamatini.overview.p2, copy.tlamatini.agents.desc,
        copy.tlamatini.features.items.find((item) => item.id === 'visual_workflows')?.description ?? '',
      ]) expect(surface).toContain('Terminater');
      expect(copy.ascii.phrases.some((phrase) => phrase.includes('Terminater'))).toBe(true);
      expect(copy.home.architecture.overview.card1.desc).toContain(lang === 'es' ? 'Vistas -> Terminals' : 'Views -> Terminals');
      const terminal = copy.home.tools.items.find((item) => item.id === 'browser_desktop')!;
      expect(terminal.name).toContain('Terminater');
      for (const term of ['CMD', 'PowerShell', 'Esc', 'Ask Execs', 'Windows 11 x64']) {
        expect(terminal.desc).toContain(term);
      }
      expect(terminal.desc).toMatch(/key by key|tecla a tecla/);
      expect(terminal.desc).toMatch(/Secret command records are masked|Los registros secretos se ocultan/);
      expect(terminal.desc).toMatch(/echoed output can remain visible|la salida del programa puede seguir visible/);
      expect(terminal.desc).toMatch(/until Tlamatini exits|hasta salir de Tlamatini/);
      expect(terminal.desc).toMatch(/can be aborted|pueden abortarse/);
      const agent = copy.tlamatini.agents.groups.flatMap((group) => group.agents).find((item) => item.name === 'Terminater');
      expect(agent?.desc).toContain('Esc');
    }
    expect(readFileSync(resolve('src/pages/Launch.tsx'), 'utf8')).toContain('Terminater');
  });

  it('explains broader searches, folder-safe moves, and current configuration gates', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const code = copy.home.tools.items.find((item) => item.id === 'codebase')!.desc;
      expect(code).toMatch(/brace sets|grupos entre llaves/);
      expect(code).toMatch(/pattern lists|listas de patrones/);
      expect(code).toMatch(/new folder destination|carpetas de destino nuevas/);
      expect(code).toMatch(/explicit file targets still rename|destinos de archivo explícitos permiten renombrar/);
      expect(copy.tlamatini.agents.desc).toContain(lang === 'es' ? 'Configurar Agents' : 'Configure Agents');
      expect(copy.home.tools.items.find((item) => item.id === 'documents')?.desc).toContain('Architecture atlas');
    }
  });

  it('keeps Usage readiness and public/private packaging boundaries explicit', () => {
    for (const lang of ['en', 'es'] as const) {
      const tools = translations[lang].home.tools.items;
      const usage = tools.find((item) => item.id === 'truthful_reports')!.desc;
      for (const term of ['Checking usage', 'Connection details']) expect(usage).toContain(term);
      expect(usage).toMatch(/automatic retries|reintentos automáticos/);
      expect(usage).toMatch(/only the account name is missing|sólo falta el nombre de cuenta/);
      const windows = tools.find((item) => item.id === 'windows_delivery')!.desc;
      expect(windows).toMatch(/without duplicate|sin duplicar/);
      expect(windows).toMatch(/Public packages exclude private MCP catalogs and key vaults|paquetes públicos excluyen catálogos MCP privados y bóvedas de llaves/);
      expect(windows).toMatch(/private builds can carry your own|builds privados pueden llevar tus/);
    }
  });

  it('rejects stale releases, removed guardian claims, plan copy, and positional text joins', () => {
    const visibleSource = [
      'src/i18n/translations.ts',
      'src/pages/Home.tsx',
      'src/pages/Tlamatini.tsx',
      'src/pages/Launch.tsx',
      'src/components/Footer.tsx',
      'src/components/Navigation.tsx',
    ].map((file) => readFileSync(resolve(file), 'utf8')).join('\n');

    for (const forbidden of [
      /v1\.(?:78|79|80|82|83|84|85|86|87|88|89)\.\d+\b/i,
      /source[- ]only|source version|versión (?:del |de )?código fuente/i,
      /v1\.48\.2/i,
      /v1\.51\.\d+\b/i,
      /v1\.65\.\d+\b/i,
      /v1\.(?:70\.0|72\.\d|73\.\d|74\.\d|75\.\d|76\.\d|77\.\d|78\.\d|79\.\d|80\.\d|81\.\d)\b/i,
      /jcyhsiao\/qwen3\.5cloud:latest/i,
      /\b(?:85|87|88|89) (?:workflow[ -]?)?agents\b/i,
      /Zavu(?:erer)?|Gatewayer|Gateway[- ]Relayer|Node[- ]?Manager/i,
      /\b(?:Sqler|Ssher|Scper|Pser)\b/,
      /seven executable operations|siete operaciones ejecutables/i,
      /\b(?:108|109) (?:built-in )?(?:Multi-Turn )?tools\b/i,
      /\b66 wrapped\b/i,
      /\b10 (?:seconds|segundos) (?:of |de )?silenc/i,
      /\b75 tools\b/i,
      /\b28 (?:runtime )?(?:skill|SKILL\.md)/i,
      /startup (?:database )?guardian/i,
      /protected database startup/i,
      /guardi[aá]n (?:de base de datos|de arranque)/i,
      /Ollama\s+(?:Pro|Max)\b/i,
      /(?:Pro|Max)[ -]?plan/i,
    ]) {
      expect(visibleSource).not.toMatch(forbidden);
    }

    expect(visibleSource).not.toMatch(/items\[i\]/);
    expect(visibleSource).not.toMatch(/descriptions\[i\]/);
    expect(visibleSource).not.toMatch(/featureImages\[i\]/);
    expect(visibleSource).not.toMatch(/stepCode\[i\]/);
  });
});
