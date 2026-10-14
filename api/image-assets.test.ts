import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

type ImageAsset = {
  source: string;
  destination: string;
  width: number;
  height: number;
  hasAlpha: boolean;
  sourceBytes: number;
  outputBytes: number;
  sourceSha256: string;
  outputSha256: string;
};

const manifest = JSON.parse(readFileSync(resolve('assets/image-manifest.json'), 'utf8')) as {
  sourceBytes: number;
  outputBytes: number;
  assets: ImageAsset[];
};
const hash = (buffer: Buffer) => createHash('sha256').update(buffer).digest('hex');
const files = (directory: string) => readdirSync(resolve(directory), { recursive: true })
  .map(String).map((file) => `${directory}/${file.replaceAll('\\', '/')}`);

describe('WebP delivery', () => {
  it('ships every raster image as WebP, without duplicate PNG/JPEG payloads', () => {
    const publicFiles = files('public/images');
    expect(publicFiles.filter((file) => /\.(png|jpe?g|gif|bmp|tiff?)$/i.test(file))).toEqual([]);
    expect(manifest.assets).toHaveLength(32);
    expect(new Set(manifest.assets.map((asset) => asset.destination)).size).toBe(32);
    expect(publicFiles.filter((file) => file.endsWith('.webp')).sort())
      .toEqual(manifest.assets.map((asset) => asset.destination).sort());
    expect(manifest.outputBytes).toBeLessThan(manifest.sourceBytes * 0.5);
    expect(manifest.sourceBytes).toBe(manifest.assets.reduce((sum, asset) => sum + asset.sourceBytes, 0));
    expect(manifest.outputBytes).toBe(manifest.assets.reduce((sum, asset) => sum + asset.outputBytes, 0));
  });

  for (const asset of manifest.assets) {
    it(`preserves the source, dimensions, and alpha of ${asset.destination}`, async () => {
      const source = readFileSync(resolve(asset.source));
      const output = readFileSync(resolve(asset.destination));
      expect(hash(source)).toBe(asset.sourceSha256);
      expect(hash(output)).toBe(asset.outputSha256);
      expect(source.length).toBe(asset.sourceBytes);
      expect(output.length).toBe(asset.outputBytes);
      expect(output.length).toBeLessThan(source.length);
      expect(output.toString('ascii', 0, 4)).toBe('RIFF');
      expect(output.toString('ascii', 8, 12)).toBe('WEBP');
      const original = await sharp(source).metadata();
      const metadata = await sharp(output).metadata();
      const swapped = original.orientation !== undefined && original.orientation >= 5 && original.orientation <= 8;
      expect(metadata.format).toBe('webp');
      expect(metadata.width).toBe(swapped ? original.height : original.width);
      expect(metadata.height).toBe(swapped ? original.width : original.height);
      expect(metadata.width).toBe(asset.width);
      expect(metadata.height).toBe(asset.height);
      expect(metadata.hasAlpha).toBe(asset.hasAlpha);
      const originalAlpha = await sharp(source).autoOrient().ensureAlpha().extractChannel('alpha').raw().toBuffer();
      const outputAlpha = await sharp(output).ensureAlpha().extractChannel('alpha').raw().toBuffer();
      expect(outputAlpha.equals(originalAlpha)).toBe(true);
      await expect(sharp(output).raw().toBuffer()).resolves.toBeInstanceOf(Buffer);
    });
  }

  it('resolves literal and dynamically assembled gallery references', () => {
    for (const file of [...files('src').filter((file) => /\.(tsx?|css)$/.test(file)), 'index.html', 'README.md']) {
      const source = readFileSync(resolve(file), 'utf8');
      expect(source, file).not.toMatch(/(?:public)?\/images\/[^\s'"`<>]*\.(?:png|jpe?g|gif)\b/i);
      for (const match of source.matchAll(/['"](\/images\/[^'"${}]+\.(?:webp|svg|mp4))['"]/g)) {
        expect(existsSync(resolve(`public${match[1]}`)), `${file}: ${match[1]}`).toBe(true);
      }
    }
    const gallery = readFileSync(resolve('src/pages/Launch.tsx'), 'utf8');
    const filenames = [...gallery.matchAll(/\['([^']+\.webp)'/g)].map((match) => match[1]);
    expect(filenames).toHaveLength(20);
    for (const filename of filenames) expect(existsSync(resolve('public/images/campaign/gallery', filename))).toBe(true);
  });

  it('keeps the small vector logos and videos in their native formats', () => {
    expect(files('public/images').filter((file) => file.endsWith('.svg'))).toHaveLength(2);
    expect(files('public/images').filter((file) => file.endsWith('.mp4'))).toHaveLength(3);
  });
});
