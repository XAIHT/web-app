import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { translations } from '@/i18n/translations';

describe('Live Editor showcase', () => {
  it('features Live Editor before Terminater without removing either on any public page', () => {
    for (const page of ['Home', 'Tlamatini', 'Launch']) {
      const source = readFileSync(resolve(`src/pages/${page}.tsx`), 'utf8');
      expect(source.match(/<LiveEditorShowcase \/>/g)).toHaveLength(1);
      expect(source.match(/<TerminaterShowcase \/>/g)).toHaveLength(1);
      expect(source.indexOf('<LiveEditorShowcase />')).toBeLessThan(source.indexOf('<TerminaterShowcase />'));
    }
  });

  it.each(['en', 'es'] as const)('advertises three distinct product views in %s', lang => {
    const copy = translations[lang].liveEditor;
    expect(copy.title).toBe('Live Editor');
    expect(copy.label).toContain('v1.90.0');
    expect(copy.intro).toContain('Interactor');
    expect(copy.views.map(view => view.id)).toEqual(['editing', 'tutoring', 'markdown']);
    expect(copy.benefits).toHaveLength(3);
    for (const view of copy.views) {
      expect(view.alt.length).toBeGreaterThan(40);
      expect(view.label.length).toBeLessThanOrEqual(20);
      expect(view.desc.length).toBeLessThan(350);
    }
    expect(copy.views[1].desc).toMatch(/unsaved work|trabajo sin guardar/);
    expect(copy.views[1].desc).toMatch(/Optional suggestions|sugerencias opcionales/);
    expect(copy.views[2].desc).toContain('Markdown Source');
    expect(copy.views[2].desc).toContain('Preview');
    expect(copy.benefits[1].desc).toMatch(/never executes code|nunca ejecuta código/);
    expect(copy.benefits[2].desc).toContain('Save As');
    expect(copy.benefits[2].desc).toMatch(/save before closing|guarda antes de cerrar/);
    expect(copy.benefits[2].desc).toMatch(/conflicts|conflictos/);
    expect(copy.download).toContain('v1.90.0');
  });

  it('reuses the established gallery, accessible tabs and modal pattern', () => {
    const component = readFileSync(resolve('src/components/LiveEditorShowcase.tsx'), 'utf8');
    expect(component).toContain('id="live-editor"');
    expect(component).toContain('aria-labelledby="live-editor-title"');
    expect(component).toContain('<Tabs.List');
    expect(component).toContain('<DialogTitle>');
    expect(component).toContain('aria-label={c.enlarge}');
    expect(component).toContain("import './TerminaterShowcase.css'");
    expect(component).toContain('loading="lazy"');
    expect(component).toContain('decoding="async"');
    expect(component).toContain('href="#terminater"');
    expect(component).toContain('https://github.com/XAIHT/Tlamatini/releases/tag/v1.90.0');
  });

  it('ships real WebP assets at the declared dimensions with a small total payload', async () => {
    let totalBytes = 0;
    for (const view of translations.en.liveEditor.views) {
      const path = resolve(`public/images/live-editor/${view.id}.webp`);
      const metadata = await sharp(path).metadata();
      expect(metadata.format).toBe('webp');
      expect([metadata.width, metadata.height]).toEqual([1905, 1428]);
      totalBytes += statSync(path).size;
    }
    expect(totalBytes).toBeLessThan(300_000);
  });
});
