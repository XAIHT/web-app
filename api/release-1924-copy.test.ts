import { describe, expect, it } from 'vitest';
import { translations } from '@/i18n/translations';
import { editions } from '@/i18n/editions';
import { installationSteps } from '@/i18n/installation';

describe('1.92.4 download and companion guidance', () => {
  it.each(['en', 'es'] as const)('connects every %s setup step to instructions', lang => {
    const steps = installationSteps(lang);
    const ids = translations[lang].tlamatini.installation.steps.map(step => step.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids, 'configure_torrenter'].sort()).toEqual(Object.keys(steps).sort());
    for (const id of ids) expect(steps[id].trim().length).toBeGreaterThan(10);
    expect(steps.install_tlamatini).toContain(editions[lang].installerUrl);
    expect(steps.configure_torrenter).toContain('Panels -> Torrenter Workspace');
  });

  it.each(['en', 'es'] as const)('distinguishes accepting work from delivering files in %s', lang => {
    const tools = translations[lang].home.tools.items;
    const torrent = tools.find(tool => tool.id === 'torrenter')!.desc;
    expect(torrent).toMatch(/four metadata slots|cuatro búsquedas de metadatos/);
    expect(torrent).toMatch(/wait in the queue|esperan en cola/);
    expect(torrent).toMatch(/signed-in account|tu cuenta/);
    for (const term of ['Verified output', 'SHA-256', 'content_generated/Torrenter']) expect(torrent).toContain(term);
    const setup = installationSteps(lang).configure_torrenter;
    expect(setup).toMatch(/Waiting is not completion|Esperar no es completar/);
    expect(setup).toMatch(/If both fail|Si ambos destinos fallan/);
    expect(setup).toMatch(/Remove record keeps files|Remove record conserva archivos/);
  });

  it.each(['en', 'es'] as const)('keeps optional tray startup separate from services in %s', lang => {
    const tray = translations[lang].home.tools.items.find(tool => tool.id === 'tlachihuani')!.desc;
    for (const term of ['Start Services', 'Stop Services', 'XT']) expect(tray).toContain(term);
    expect(tray).toMatch(/separately|por separado/);
    expect(tray).toMatch(/gray|gris/);
    expect(tray).toMatch(/never starts downloads|nunca inicia descargas/);
    const setup = installationSteps(lang).configure_torrenter;
    expect(setup).toMatch(/Stopped \/ Manual|Detenidos \/ Manual/);
    expect(setup).toMatch(/No pairing code|Sin código de vinculación/);
  });

  it.each(['en', 'es'] as const)('keeps the companion separate from the 87 workflow agents in %s', lang => {
    const agents = translations[lang].tlamatini.agents.groups.flatMap(group => group.agents);
    expect(agents).toHaveLength(87);
    expect(agents.filter(agent => agent.name === 'Torrenter')).toHaveLength(1);
    expect(agents.some(agent => agent.name === 'Tlachihuani')).toBe(false);
    expect(translations[lang].tlamatini.features.items.some(feature => feature.id === 'torrenter')).toBe(true);
  });

  it.each(['en', 'es'] as const)('describes the readable README fix without allowing arbitrary binary files in %s', lang => {
    const editor = translations[lang].home.tools.items.find(tool => tool.id === 'pdf_canvas')!.desc;
    expect(editor).toContain('README');
    expect(editor).toMatch(/isolated control characters|caracteres de control aislados/);
    expect(editor).toMatch(/binary or malformed|binarios o mal codificados/);
  });
});
