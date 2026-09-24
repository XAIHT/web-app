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
  'visual_workflows', 'multi_turn', 'human_control', 'truthful_reports',
  'flowcreator', 'acpx', 'external_mcps', 'skills', 'rag', 'unrealer',
  'blenderer', 'stm32er', 'esp_firmware', 'robotic_loop', 'whisperer',
  'talker', 'media', 'netspeed', 'googler', 'blue_hat', 'security_agents',
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

describe('Tlamatini v1.65.4 website truth contract', () => {
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

  it('advertises the published release, carried capabilities, and crown jewels', () => {
    const english = JSON.stringify(translations.en);
    for (const required of [
      'v1.65.4', '89 agents', '109 built-in Multi-Turn tools', '29 skills',
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
      expect(stack.title).toContain('v1.65.4');
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
      expect(copy.tlamatini.overview.p2).toContain('Context Governor');
      expect(copy.tlamatini.overview.p2).toContain('v1.65.4');
    }
    const setup = readFileSync(resolve('src/pages/Tlamatini.tsx'), 'utf8');
    expect(setup).toContain('ollama pull glm-5.3:cloud');
    expect(setup).toContain('ollama pull jcyhsiao/qwen3.5cloud:latest');
    expect(setup).toContain('ollama pull gemma4:cloud');
    expect(setup).toContain('38 settings in six categories');
    expect(setup).toContain('latest published release ZIP');
    expect(setup).not.toContain('ollama pull qwen3.5:cloud');
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
    expect(home).toContain("value: 'v1.65.4'");
    expect(launch).toContain("['89', '109', '29', 'v1.65.4']");
    expect(launch).toContain('PPTXer');
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
      /v1\.65\.5\b/i,
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
      /Ollama\s+(?:Pro|Max)/i,
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
