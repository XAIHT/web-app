import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { editions, isLang, localizePath } from '@/i18n/editions';
import { installationSteps } from '@/i18n/installation';
import { translations } from '@/i18n/translations';

describe('language selects the application edition', () => {
  it.each(['en', 'es'] as const)('keeps all %s product destinations in the correct repository', lang => {
    const e = editions[lang];
    const repository = lang === 'en' ? 'Tlamatini' : 'Tlamatini-Spanish';
    const base = `https://github.com/XAIHT/${repository}`;
    expect(e.repoUrl).toBe(base);
    expect(e.tag).toBe('v1.91.1');
    expect(e.releaseUrl).toBe(`${base}/releases/tag/${e.tag}`);
    expect(e.installerUrl).toBe(`${base}/releases/download/${e.tag}/${repository}_Release_${e.tag}_Win11x64.zip`);
    expect(e.sourceUrl).toBe(`${base}/archive/refs/tags/${e.tag}.zip`);
    expect(e.docsUrl).toBe(`${base}/blob/main/README.md`);
    expect(e.issuesUrl).toBe(`${base}/issues`);
    const steps = installationSteps(lang);
    expect(steps.install_tlamatini).toContain(e.installerUrl);
    expect(steps.install_tlamatini).toContain(e.sourceUrl);
    expect(steps.install_tlamatini).toContain(`cd ${e.sourceFolder}`);
    expect(steps.install_tlamatini).toContain('python.exe Tlamatini/manage.py createsuperuser');
    expect(steps.install_tlamatini).not.toContain('Activate.ps1');
    expect(translations[lang].edition.download).toContain(lang.toUpperCase());
    expect(translations[lang].edition.source).toContain(lang.toUpperCase());
  });

  it('translates instructions without translating commands, models, or filenames', () => {
    const es = installationSteps('es');
    expect(es.install_tlamatini).toContain('Opción A');
    expect(es.install_tlamatini).not.toContain('Option A');
    expect(es.install_tlamatini).toContain('Installer.exe');
    expect(es.configure_models).toContain('Acerca de -> Uso');
    expect(es.configure_models).toContain('Config -> Modelos');
    expect(es.sign_in_ollama).toBe('ollama signin');
    expect(es.download_models).toContain('ollama pull nomic-embed-text');
    expect(JSON.stringify(es)).not.toMatch(/github\.com\/XAIHT\/Tlamatini\//);
  });

  it('preserves routes, anchors, and unrelated query values in shareable URLs', () => {
    expect(localizePath('/tlamatini?campaign=launch#live-editor', 'es'))
      .toBe('/tlamatini?campaign=launch&lang=es#live-editor');
    expect(localizePath('/launch?lang=es#terminater', 'en'))
      .toBe('/launch?lang=en#terminater');
    expect(localizePath('/', 'es')).toBe('/?lang=es');
    expect(localizePath('/login?return=%2Ftlamatini', 'es')).toBe('/login?return=%2Ftlamatini&lang=es');
    for (const value of [null, '', 'fr', 'ES', 'es-MX']) expect(isLang(value)).toBe(false);
    expect(isLang('en')).toBe(true);
    expect(isLang('es')).toBe(true);
  });

  it('centralizes product URLs rather than hiding English-only links in components', () => {
    function files(dir: string): string[] {
      return readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
        entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]);
    }
    for (const path of files('src').filter(path => /\.tsx?$/.test(path) && !path.endsWith('editions.ts'))) {
      expect(readFileSync(path, 'utf8'), path).not.toMatch(/https:\/\/github\.com\/XAIHT\/Tlamatini/);
    }
  });
});
