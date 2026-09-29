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
  'visual_workflows', 'prompt_flow', 'prompt_context', 'multi_turn', 'context_preview', 'human_control', 'truthful_reports',
  'flowcreator', 'acpx', 'external_mcps', 'skills', 'rag', 'unrealer',
  'blenderer', 'stm32er', 'esp_firmware', 'robotic_loop', 'image_vision', 'analysis_recovery', 'whisperer',
  'mic_preferences', 'talker', 'media', 'netspeed', 'googler', 'blue_hat', 'security_agents',
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

describe('Tlamatini v1.72.1 website truth contract', () => {
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

  it('advertises the current release, carried capabilities, and crown jewels', () => {
    const english = JSON.stringify(translations.en);
    for (const required of [
      'v1.72.1', '89 agents', '109 built-in Multi-Turn tools', '29 skills',
      'NetSpeed-Calculator', 'Blue-hat', 'WAL-safe', 'Googler', 'MCP Adder',
      'Unreal Engine', 'Blender', 'STM32er', 'ESP32er', 'Talker', 'Whisperer',
      'PPTXer', 'Context Governor', '256-call',
    ]) {
      expect(english).toContain(required);
    }
  });

  it('keeps the technology stack current and substantial in both languages', () => {
    for (const lang of ['en', 'es'] as const) {
      const stack = translations[lang].tlamatini.techStack;
      expect(stack.title).toContain('v1.72.1');
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
      expect(copy.tlamatini.overview.p2).toContain('v1.72.1');
    }
    const setup = readFileSync(resolve('src/pages/Tlamatini.tsx'), 'utf8');
    expect(setup).toContain('ollama pull glm-5.3:cloud');
    expect(setup).toContain('ollama pull mistral-large-3:675b-cloud');
    expect(setup).toContain('ollama pull gemma4:cloud');
    expect(setup).toContain('38 settings in six categories');
    expect(setup).toContain('latest published release ZIP');
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
    expect(home).toContain("value: 'v1.72.1'");
    expect(launch).toContain("['89', '109', '29', 'v1.72.1']");
    expect(launch).toContain('PPTXer');
  });

  it('distinguishes prompt diagrams from agent workflows in both languages', () => {
    for (const lang of ['en', 'es'] as const) {
      const copy = translations[lang];
      const findTool = (id: string) => copy.home.tools.items.find((tool) => tool.id === id);
      const prompt = findTool('prompt_flow')?.desc ?? '';
      for (const operation of [
        'Prompt', 'Programmed Prompt', 'Decision', 'Feed embeddings',
        'Flush embeddings', 'Clean History', 'User Commentary',
        'Multi-Turn', 'ACPX', 'Play', 'Pause', 'Stop',
      ]) expect(prompt).toContain(operation);

      const context = findTool('prompt_context')?.desc ?? '';
      expect(context).toContain('{{last_output}}');
      expect(context).toContain('.fpmt');
      expect(context).toMatch(/opening never runs|abrir nunca ejecuta/);
      expect(context).toMatch(/remain open|manteniendo abiertos/);
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
      expect(copy.tlamatini.installation.desc).toMatch(/latest published Windows release|última versión Windows publicada/);
    }
    const setup = readFileSync(resolve('src/pages/Tlamatini.tsx'), 'utf8');
    expect(setup).toContain('Config -> Configure MCPs');
    expect(setup).toContain('Config -> Configure Agents');
    expect(setup).toContain('Panels -> Agentic Control Panel');
    expect(setup).toContain('Panels -> Prompt Flow Panel');
    const launch = readFileSync(resolve('src/pages/Launch.tsx'), 'utf8');
    expect(launch).toContain('Current release');
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
      expect(copy.tlamatini.hero.subtitle).toContain('v1.72.1');
      expect(copy.tlamatini.installation.desc).toContain('v1.72.1');
      expect(copy.tlamatini.installation.desc).toContain('About -> Check for updates');
      expect(copy.tlamatini.hero.subtitle).not.toMatch(/Source|Código/);
      const packaging = copy.home.tools.items.find((tool) => tool.id === 'windows_delivery')?.desc ?? '';
      expect(packaging).toContain('89');
      expect(packaging).toContain('ESPHome');
      expect(packaging).toMatch(/Missing or changed|ausentes o modificados/);
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
      expect(reliability).toMatch(/no longer sent twice|ya no se envían dos veces/);
      expect(reliability).toMatch(/system-context filler|relleno de contexto del sistema/);
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
      /v1\.(?:70\.0|72\.0)\b/i,
      /jcyhsiao\/qwen3\.5cloud:latest/i,
      /\b(?:87|88) (?:workflow[ -]?)?agents\b/i,
      /\b108 (?:built-in )?(?:Multi-Turn )?tools\b/i,
      /\b66 wrapped\b/i,
      /\b10 (?:seconds|segundos) (?:of |de )?silenc/i,
      /latest.source (?:voice|opens|turns|adds)/i,
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
