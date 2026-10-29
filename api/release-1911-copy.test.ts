import { describe, expect, it } from 'vitest';
import { translations } from '@/i18n/translations';
import { editions } from '@/i18n/editions';
import { installationSteps } from '@/i18n/installation';

describe('v1.91.1 release copy', () => {
  it.each(['en', 'es'] as const)('presents one released version in %s', lang => {
    const copy = translations[lang];
    expect(editions[lang].version).toBe('1.91.1');
    const content = JSON.stringify([copy, installationSteps(lang)]);
    expect(new Set(content.match(/v1\.\d+\.\d+/g))).toEqual(new Set(['v1.91.1']));
    expect(content).not.toMatch(/source[- ]only|source version|versión fuente|Ollama (?:Pro|Max)\b/i);
    expect(copy.liveEditor.intro).not.toMatch(/New in|Nuevo en/);
    expect(copy.tlamatini.agents.groups.flatMap(group => group.agents)).toHaveLength(86);
  });

  it.each(['en', 'es'] as const)('explains the Prompt Flow patch without inventing new operations in %s', lang => {
    const tools = translations[lang].home.tools.items;
    const flow = tools.find(tool => tool.id === 'prompt_flow')!.desc;
    for (const value of ['equals', 'YES/NO', 'Markdown', 'Prompt', 'Decision', 'Terminater']) {
      expect(flow).toContain(value);
    }
    expect(flow).toMatch(/eight executable operations|ocho operaciones ejecutables/);
    const context = tools.find(tool => tool.id === 'prompt_context')!.desc;
    expect(context).toMatch(/never another conversation|nunca otra conversación/);
    expect(context).toMatch(/usage belongs to the account|uso registrado pertenece a la cuenta/);
    expect(context).toMatch(/filename in the browser tab|nombre del archivo en la pestaña/);
    expect(tools.find(tool => tool.id === 'truthful_reports')!.desc).toContain('Prompt Flow');
  });

  it.each(['en', 'es'] as const)('describes enabled-agent aliases and deliberate messaging identity in %s', lang => {
    const tools = translations[lang].home.tools.items;
    const runtime = tools.find(tool => tool.id === 'dependable_runtime')!.desc;
    expect(runtime).toMatch(/enabled agent|agente habilitado/);
    expect(runtime).toMatch(/short name|nombre corto/);
    expect(runtime).toContain('terminater');
    const messaging = tools.find(tool => tool.id === 'messaging')!.desc;
    expect(messaging).toContain('using the bot');
    expect(messaging).toMatch(/outside quoted values|fuera de valores entre comillas/);
    expect(messaging).toMatch(/explicit provider choice still wins|provider explícito sigue teniendo prioridad/);
    expect(messaging).toMatch(/Telegram permissions|permisos de Telegram/);
    const telegrammer = translations[lang].tlamatini.agents.groups
      .flatMap(group => group.agents).find(agent => agent.name === 'Telegrammer')!;
    expect(telegrammer.desc).toContain('using the bot');
  });

  it('keeps Spanish pronunciation and voice selection specific to that edition', () => {
    const es = translations.es;
    const voice = es.home.tools.items.find(tool => tool.id === 'talker')!.desc;
    for (const text of ['Piper', 'mexicana', 'Orpheus', 'modelo inglés', 'Ángela', 'José',
      'María', 'es-MX', 'Latinoamérica', 'España', 'sin renombrar tu cuenta', 'código o rutas']) {
      expect(voice).toContain(text);
    }
    expect(voice).toContain('voces femeninas españolas disponibles');
    expect(es.tlamatini.presence.panels.find(panel => panel.id === 'friendly')!.desc).toContain('pronunciación');
    expect(es.tlamatini.agents.groups.flatMap(group => group.agents)
      .find(agent => agent.name === 'Talker')!.desc).toContain('Piper');
    expect(translations.en.home.tools.items.find(tool => tool.id === 'talker')!.desc).not.toContain('Piper');
  });
});
