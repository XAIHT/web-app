import { describe, expect, it } from 'vitest';
import { translations } from '@/i18n/translations';
import { installationSteps } from '@/i18n/installation';

describe('v1.91.0 interaction settings marketing', () => {
  it.each(['en', 'es'] as const)('features the shared settings in the existing %s surfaces', lang => {
    const copy = translations[lang];
    for (const surface of [copy.liveEditor.intro, copy.tlamatini.overview.p2,
      copy.home.architecture.overview.card1.desc,
      copy.home.tools.items.find(item => item.id === 'codebase')!.desc]) {
      expect(surface).toContain('Config -> Live Editor & Terminater');
    }
    for (const tab of [lang === 'es' ? 'Editor en vivo' : 'Live Editor', 'Terminater', lang === 'es' ? 'Voz' : 'Voice']) {
      expect(copy.liveEditor.intro).toContain(tab);
    }
    expect(copy.liveEditor.benefits[1].desc).toContain('40–160 WPM');
    expect(copy.liveEditor.benefits[1].desc).toContain('0–3');
    expect(copy.terminater.intro).toContain('20–160 WPM');
    expect(copy.terminater.intro).toContain(lang === 'es' ? 'Yo siempre presiono Enter' : 'I always press Enter');
    expect(copy.ascii.phrases.some(phrase => phrase.includes('Config -> Live Editor & Terminater'))).toBe(true);
    expect(copy.liveEditor.views[1].desc).toContain(lang === 'es' ? 'Breve' : 'Brief');
    expect(copy.liveEditor.views[1].desc).toContain(lang === 'es' ? 'Equilibrado' : 'Balanced');
    expect(copy.liveEditor.views[1].desc).toContain(lang === 'es' ? 'Detallado' : 'Detailed');
  });

  it.each(['en', 'es'] as const)('explains safe previews and preference ownership in %s', lang => {
    const overview = translations[lang].tlamatini.overview.p2;
    for (const text of (lang === 'es' ? ['Estándar', 'Aprendizaje guiado', 'Vista previa', 'Guardar', 'Cancelar', 'Escape', 'Agentic Control Panel', 'Prompt Flow Panel'] : ['Standard', 'Guided learning', 'Preview', 'Save', 'Cancel', 'Escape', 'Agentic Control Panel', 'Prompt Flow Panel'])) {
      expect(overview).toContain(text);
    }
    expect(overview).toMatch(/without running a command or editing a file|sin ejecutar comandos ni editar archivos/);
    expect(overview).toMatch(/next action|siguiente acción/);
    expect(overview).toMatch(/appearance stays with your account in this browser|apariencia queda con tu cuenta en este navegador/);
    const editor = translations[lang].home.tools.items.find(item => item.id === 'codebase')!.desc;
    expect(editor).toMatch(/Opening settings stops active teaching|Abrir ajustes detiene la tutoría activa/);
    const terminal = translations[lang].home.tools.items.find(item => item.id === 'browser_desktop')!.desc;
    expect(terminal).toMatch(/without killing the process|sin matar el proceso/);
    expect(terminal).toMatch(/defaults affect new terminals|rigen en terminales nuevas/);
    const workflows = translations[lang].terminater.views[2].desc;
    expect(workflows).toMatch(/older flows keep explicit values|flujos anteriores conservan valores explícitos/);
    expect(workflows).toMatch(/Manual Enter and narration|Enter manual y narración/);
  });

  it.each(['en', 'es'] as const)('distinguishes optional browser narration from Talker in %s', lang => {
    const copy = translations[lang];
    expect(copy.terminater.benefits[1].desc).toMatch(/separate from Talker|distinta de Talker/);
    expect(copy.terminater.benefits[1].desc).toMatch(/mute and microphone listening take priority|silencio y escucha del micrófono tienen prioridad/);
    const voice = copy.home.tools.items.find(item => item.id === 'talker')!.desc;
    expect(voice).toContain(lang === 'es' ? 'Config -> Voz' : 'Config -> Voice');
    expect(voice).toContain('Continue without voice');
    expect(voice).toContain('Stop');
    expect(voice).toMatch(/secret-marked text and private handoff input are not narrated|no narra texto marcado secreto ni entradas privadas/);
    expect(voice).toMatch(/prevents overlapping speech|evita voces superpuestas/);
    expect(copy.terminater.benefits[1].desc).toMatch(/wait for narration to finish first|esperar a que termine la narración/);
  });

  it('keeps setup pinned to one version with explicit virtual-environment commands', () => {
    const setup = Object.values(installationSteps('en')).join('\n');
    expect(setup).toContain('releases/tag/v1.91.0');
    expect(setup).toContain('archive/refs/tags/v1.91.0.zip');
    expect(setup).toContain('python.exe Tlamatini/manage.py createsuperuser');
    expect(setup).toContain('change the password immediately');
    expect(setup).not.toContain('Activate.ps1');
    for (const value of ['Config -> Live Editor & Terminater', 'Use my defaults',
      '12-24 px', 'Preview runs no commands', 'Save applies behavior to the next action']) {
      expect(setup).toContain(value);
    }
    expect(setup).toContain('Tlamatini_Release_v1.91.0_Win11x64.zip');
    for (const lang of ['en', 'es'] as const) {
      expect(JSON.stringify(translations[lang])).not.toMatch(/Ollama (Pro|Max)\b|Pro\/Max|source version|versión fuente/i);
    }
  });
});
