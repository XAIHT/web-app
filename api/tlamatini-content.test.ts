import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { translations } from '@/i18n/translations';

const expectedAgentGroups = [
  ['Starter', 'Ender', 'Stopper', 'Cleaner', 'Sleeper', 'Croner'],
  ['Raiser', 'Forker', 'Asker', 'Counter'],
  ['AND', 'OR', 'Barrier'],
  [
    'Executer', 'Pythonxer', 'Sqler', 'Mongoxer', 'Crawler', 'Googler',
    'Playwrighter', 'Apirer', 'Kalier', 'Discoverer', 'Nmapper', 'Unrealer',
    'Blenderer', 'STM32er', 'ESP32er', 'Arduiner', 'ESPHomer', 'Gitter',
    'Reviewer', 'Analyzer', 'Ssher', 'Scper', 'Dockerer', 'MCP Doctor',
    'Instant Messaging Doctor', 'Kuberneter', 'Pser', 'Jenkinser', 'Prompter',
    'Summarizer', 'File-Interpreter', 'File-Extractor', 'Image-Interpreter',
    'Video-Analyzer', 'NetSpeed-Calculator', 'J-Decompiler', 'De-Compresser',
    'Mover', 'Deleter', 'File-Creator', 'Shoter', 'Globber', 'Grepper', 'PDFer',
    'PPTXer', 'LaTeXer', 'Editor', 'Camcorder', 'Recorder', 'Whisperer', 'AudioPlayer',
    'VideoPlayer', 'Talker', 'Mouser', 'Windower', 'Keyboarder',
  ],
  [
    'Notifier', 'Emailer', 'RecMailer', 'Whatsapper', 'Telegrammer', 'Zavuerer',
    'Monitor-Log', 'Monitor Netstat', 'FlowHypervisor',
  ],
  ['Parametrizer', 'FlowBacker', 'FlowCreator', 'Gatewayer', 'Gateway Relayer', 'NodeManager'],
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

describe('Tlamatini v1.77.0 website truth contract', () => {
  it('keeps the exact 89-agent catalog in nine authoritative families', () => {
    const english = flattenAgentNames('en');
    const spanish = flattenAgentNames('es');

    expect(english).toEqual(expectedAgentGroups);
    expect(spanish).toEqual(expectedAgentGroups);
    expect(english.flat()).toHaveLength(89);
    expect(new Set(english.flat()).size).toBe(89);
    expect(english.map((group) => group.length)).toEqual([6, 4, 3, 56, 9, 6, 3, 1, 1]);
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
      'v1.77.0', '89 agents', '109 built-in Multi-Turn tools', '29 skills',
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
      expect(stack.title).toContain('v1.77.0');
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
      expect(copy.tlamatini.overview.p2).toContain('v1.77.0');
    }
    const setup = readFileSync(resolve('src/pages/Tlamatini.tsx'), 'utf8');
    expect(setup).toContain('ollama pull glm-5.3:cloud');
    expect(setup).toContain('ollama pull mistral-large-3:675b-cloud');
    expect(setup).toContain('ollama pull gemma4:cloud');
    expect(setup).toContain('38 settings in six categories');
    expect(setup).toContain('Download the v1.77.0 release ZIP');
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
      expect(findTool('pdf_canvas')?.desc).toContain('Process images');
      expect(findTool('pdf_canvas')?.desc).toContain('Continue');
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
    expect(home).toContain("value: '89'");
    expect(home).toContain("value: 'v1.77.0'");
    expect(launch).toContain("['89', '109', '29', 'v1.77.0']");
    expect(launch).toContain('PPTXer');
  });

  it('distinguishes prompt diagrams from agent workflows in both languages', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const findTool = (id: string) => copy.home.tools.items.find((tool) => tool.id === id);
      const prompt = findTool('prompt_flow')?.desc ?? '';
      for (const operation of [
        'Prompt', 'Programmed Prompt', 'Decision', 'Feed embeddings',
        'Flush embeddings', 'Clean History', 'User Input', 'User Commentary',
        'Multi-Turn', 'ACPX', 'Play', 'Pause', 'Stop',
      ]) expect(prompt).toContain(operation);

      const context = findTool('prompt_context')?.desc ?? '';
      expect(context).toContain('{{last_output}}');
      expect(context).toContain('.fpmt');
      expect(context).toMatch(/opening never runs|abrir nunca ejecuta/);
      expect(context).toMatch(/remain open|manteniendo abiertos/);
      expect(context).toContain('5–95%');
      expect(prompt).toMatch(/seven executable operations|siete operaciones ejecutables/);
      expect(prompt).toMatch(/never execute|nunca se ejecutan/);
      expect(findTool('visual_workflows')?.desc).toContain('.flw');
      expect(copy.home.workflow.desc).toContain('.flw');
      expect(copy.home.workflow.desc).toContain('.fpmt');
      expect(copy.ascii.phrases.some((phrase) => phrase.includes('Prompt Flow Panel'))).toBe(true);
      expect(copy.tlamatini.features.items.find((feature) => feature.id === 'visual_workflows')?.description).toContain('.fpmt');
      expect(copy.tlamatini.agents.groups.flatMap((group) => group.agents)).toHaveLength(89);
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
      expect(findTool('pdf_canvas')?.desc).toMatch(/never loaded as incomplete context|nunca la carga como contexto incompleto/);
      expect(findTool('media')?.desc).toMatch(/reject failed observers|rechaza fallas de observación/);
    }
  });

  it('aligns menu locations and the published release update path', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      for (const label of ['Panels', 'Agentic Control Panel', 'Prompt Flow Panel', 'Config', 'Configure MCPs', 'Configure Agents']) {
        expect(copy.home.architecture.overview.card1.desc).toContain(label);
      }
      expect(copy.tlamatini.overview.p2).toContain('About -> Check for updates');
      expect(copy.tlamatini.installation.desc).toMatch(/delivers the published app|entrega la app publicada/);
    }
    const setup = readFileSync(resolve('src/pages/Tlamatini.tsx'), 'utf8');
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
      for (const label of ['Config -> Mic', 'Config -> Models -> Speech', 'Voice', 'beam/VAD']) {
        expect(mic).toContain(label);
      }
      expect(mic).toMatch(/this browser|este navegador/);
      expect(mic).toMatch(/next recording|próxima grabación/);
      expect(findTool('prompt_catalog')?.desc).toMatch(/separate from direct Mic|distintas del botón Mic/);
      expect(copy.tlamatini.presence.spotlight.desc).toMatch(/never submit|nunca envían/);
      expect(copy.tlamatini.presence.spotlight.desc).toContain('Silent');
      const agents = copy.tlamatini.agents.groups.flatMap((group) => group.agents);
      expect(agents.find((agent) => agent.name === 'Whisperer')?.desc).toMatch(/auto-send|autoenvío/);
      expect(copy.ascii.phrases.some((phrase) => phrase.includes('Config -> Mic'))).toBe(true);
    }
    const setup = readFileSync(resolve('src/pages/Tlamatini.tsx'), 'utf8');
    expect(setup).toContain('Config -> Mic');
    expect(setup).toContain('Send automatically (default)');
    expect(setup).toContain('Keep in the chat input');
    expect(setup).toContain('python -m pip install -r requirements.txt');
  });

  it('keeps the published installer current without overstating the capabilities', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      expect(copy.tlamatini.hero.subtitle).toContain('v1.77.0');
      expect(copy.tlamatini.installation.desc).toContain('v1.77.0');
      expect(copy.tlamatini.installation.desc).toContain('About -> Check for updates');
      expect(copy.tlamatini.hero.subtitle).toMatch(/\| v1\.77\.0$/);
      const packaging = copy.home.tools.items.find((tool) => tool.id === 'windows_delivery')?.desc ?? '';
      expect(packaging).toContain('89');
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
      expect(copy.ascii.phrases.some((phrase) => /Lip Movement|Labios Más Expresivos/.test(phrase))).toBe(true);
    }
  });

  it('uses v1.77.0 everywhere and identifies the published Windows release honestly', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      expect(copy.home.overview.stats.version).toBe(lang === 'en' ? 'Version' : 'Versión');
      expect(copy.home.overview.desc).toContain('v1.77.0');
      expect(copy.ascii.phrases).toContain('Tlamatini v1.77.0');
      expect(copy.tlamatini.hero.subtitle.match(/v\d+\.\d+\.\d+/g)).toEqual(['v1.77.0']);
      expect(copy.tlamatini.hero.subtitle).not.toMatch(/Source|Installer|Código|Instalador/);
      expect(copy.footer.ctaDesc).toContain('v1.77.0');
      const install = copy.tlamatini.installation.desc;
      expect(install).toContain('v1.77.0');
      expect(install).toContain('About -> Check for updates');
      expect(install).toMatch(/delivers the published app|entrega la app publicada/);
      expect(install).toMatch(/run her from source|ejecútala desde el código/);
      expect(install).toContain('Model Brain');
      expect(new Set(JSON.stringify(copy).match(/v1\.\d+\.\d+/g))).toEqual(new Set(['v1.77.0']));
    }
    const setup = readFileSync(resolve('src/pages/Tlamatini.tsx'), 'utf8');
    expect(setup).toContain('Tlamatini v1.77.0 Windows installer');
    expect(setup).toContain('Option B: run Tlamatini v1.77.0 from source');
    expect(setup).toContain('Requires Python 3.12.10 and Git');
    expect(setup).not.toMatch(/When published|earlier tag snapshot|Updates become available after publication/);
    const launch = readFileSync(resolve('src/pages/Launch.tsx'), 'utf8');
    expect(launch).toContain('XAIHT presents Tlamatini v1.77.0');
    expect(launch).toContain('XAIHT presenta Tlamatini v1.77.0');
    expect(launch).not.toMatch(/Source v1\.|Codigo v1\./);
    expect(readFileSync(resolve('src/pages/Home.tsx'), 'utf8')).toContain("value: 'v1.77.0'");
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
    const setup = readFileSync(resolve('src/pages/Tlamatini.tsx'), 'utf8');
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
      expect(self).toContain('28.9K');
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
      for (const value of ['Config -> Models', '38', '21', 'Save', 'Auto-tuning', 'Ollama']) {
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
    const setup = readFileSync(resolve('src/pages/Tlamatini.tsx'), 'utf8');
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
      for (const term of ['89', '.flw', '.fpmt', 'User Input', 'User Commentary', 'Run output', 'Windows']) expect(visual).toContain(term);
      expect(visual).toMatch(/never enter model context|nunca entran al contexto/);
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
      const documents = copy.tlamatini.features.items.find((item) => item.id === 'documents')?.description ?? '';
      expect(documents).toContain('.DEGRADED.pdf');
      expect(documents).toMatch(/verified PDF delivery|verificación del PDF entregado/);
      expect(documents).toMatch(/blocked destination|destino bloqueado/);
      expect(documents).toMatch(/actual saved path|ruta real/);
      const code = copy.home.tools.items.find((item) => item.id === 'codebase')?.desc ?? '';
      expect(code).toMatch(/same-name files may still be replaced|mismo nombre aún pueden reemplazarse/);
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
      expect(windows).toMatch(/logs stay plain text|log sigue en texto plano/);
      expect(windows).toMatch(/incomplete removal|retiros incompletos/);
      expect(windows).toMatch(/preserving user content|conservando contenido propio/);
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
      expect(copy.tlamatini.hero.desc).toMatch(/first person|primera persona/);
      expect(copy.tlamatini.overview.p2).toMatch(/Telegram.*older wording|Telegram.*texto anterior/);
      expect(copy.ascii.phrases.some((phrase) => /Greets You by Name|Saluda por Tu Nombre/.test(phrase))).toBe(true);
      const talker = copy.home.tools.items.find((tool) => tool.id === 'talker')?.desc ?? '';
      expect(talker).toContain('WAV');
      expect(talker).toMatch(/Separately|Por separado/);
      expect(talker).toMatch(/first-person status messages|mensajes cercanos en primera persona/);
    }
    const launch = readFileSync(resolve('src/pages/Launch.tsx'), 'utf8');
    expect(launch).toContain('she welcomes you by name');
    expect(launch).toContain('te recibe por tu nombre');
  });

  it('states which folders the new uninstaller preserves and which scratch it removes', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const windows = copy.tlamatini.features.items.find((item) => item.id === 'windows_delivery')?.description ?? '';
      for (const folder of ['application', 'applications', 'content_generated', 'context_files', 'doc_generated', 'Templates']) {
        expect(windows).toContain(folder);
      }
      expect(windows).toMatch(/whenever they contain files|cuando tienen archivos/);
      expect(windows).toMatch(/agents is always kept|siempre guarda agents/);
      expect(windows).toMatch(/Temp scratch is erased|borra Temp/);
      expect(windows).toMatch(/Locked files|archivos bloqueados/);
      expect(copy.ascii.phrases.some((phrase) => /New Installer.*Templates|Nuevo Instalador.*Templates/.test(phrase))).toBe(true);
    }
  });

  it('does not promise an uninstaller upgrade through the in-app updater', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      expect(copy.tlamatini.installation.desc).toMatch(/keeps your existing Uninstaller.exe|conserva tu Uninstaller.exe actual/);
      expect(copy.tlamatini.installation.desc).toMatch(/Run the new Installer|Ejecuta el nuevo Installer/);
      expect(copy.tlamatini.overview.p2).toMatch(/in-app updates retain the old uninstaller|updates internos mantienen el desinstalador anterior/);
      const windows = copy.home.tools.items.find((item) => item.id === 'windows_delivery')?.desc ?? '';
      expect(windows).toMatch(/In-app updates keep the existing Uninstaller.exe|updates internos mantienen Uninstaller.exe/);
    }
    const setup = readFileSync(resolve('src/pages/Tlamatini.tsx'), 'utf8');
    expect(setup).toContain('The in-app updater keeps your existing Uninstaller.exe');
    expect(setup).toContain('Run the new Installer to refresh the uninstaller too');
    expect(setup).toContain('not Temp scratch');
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
      /v1\.48\.2/i,
      /v1\.51\.\d+\b/i,
      /v1\.65\.\d+\b/i,
      /v1\.(?:70\.0|72\.\d|73\.\d|74\.\d|75\.\d|76\.\d)\b/i,
      /jcyhsiao\/qwen3\.5cloud:latest/i,
      /\b(?:87|88) (?:workflow[ -]?)?agents\b/i,
      /\b108 (?:built-in )?(?:Multi-Turn )?tools\b/i,
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
