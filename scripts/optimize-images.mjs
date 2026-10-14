import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const sources = [
  ['images_fro-mTlamatini/TorsoTlamatini.png', 'tlamatini/torso-tlamatini.webp'],
  ['images_fro-mTlamatini/TlamatiniDrawings.png', 'tlamatini/tlamatini-drawings.webp'],
  ['images_fro-mTlamatini/ShouldersUoTlamatini.png', 'tlamatini/shoulders-tlamatini.webp'],
  ['images_fro-mTlamatini/RealisticTlamatini.png', 'tlamatini/realistic-tlamatini.webp'],
  ['images_fro-mTlamatini/HiIamTlamatini.png', 'tlamatini/hi-i-am-tlamatini.webp'],
];

for (const [directory, target] of [
  ['assets/image-sources', ''],
  ['campaign/assets/gallery', 'campaign/gallery/'],
]) {
  for (const name of (await readdir(path.join(root, directory))).sort()) {
    if (/\.(png|jpe?g)$/i.test(name)) {
      sources.push([`${directory}/${name}`, `${target}${name.replace(/\.[^.]+$/, '.webp')}`]);
    }
  }
}

const encoding = { quality: 88, alphaQuality: 100, effort: 6, smartSubsample: true };
const jpegQuality = 82;
const assets = [];
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');

for (const [source, filename] of sources) {
  const input = await readFile(path.join(root, source));
  const original = await sharp(input).metadata();
  assert.ok(!original.pages || original.pages === 1, `Animated source needs a separate policy: ${source}`);
  const quality = original.format === 'jpeg' ? jpegQuality : encoding.quality;
  // Preserve the displayed orientation and resolution; only the encoding changes.
  const output = await sharp(input).autoOrient().toColourspace('srgb').webp({ ...encoding, quality }).toBuffer();
  const converted = await sharp(output).metadata();
  const swapped = original.orientation >= 5 && original.orientation <= 8;
  assert.equal(converted.width, swapped ? original.height : original.width);
  assert.equal(converted.height, swapped ? original.width : original.height);
  const originalAlpha = await sharp(input).autoOrient().ensureAlpha().extractChannel('alpha').raw().toBuffer();
  const convertedAlpha = await sharp(output).ensureAlpha().extractChannel('alpha').raw().toBuffer();
  assert.ok(originalAlpha.equals(convertedAlpha), `Transparency changed: ${source}`);
  assert.ok(output.length < input.length, `WebP is not smaller: ${source}`);
  const destination = `public/images/${filename}`;
  await mkdir(path.dirname(path.join(root, destination)), { recursive: true });
  await writeFile(path.join(root, destination), output);
  assets.push({ source, destination, width: converted.width, height: converted.height,
    hasAlpha: converted.hasAlpha, quality, sourceBytes: input.length, outputBytes: output.length,
    sourceSha256: digest(input), outputSha256: digest(output) });
  console.log(`${filename}: ${input.length} -> ${output.length} bytes`);
}

const sourceBytes = assets.reduce((total, asset) => total + asset.sourceBytes, 0);
const outputBytes = assets.reduce((total, asset) => total + asset.outputBytes, 0);
const report = { encoder: `sharp ${sharp.versions.sharp}`, encoding, jpegQuality, sourceBytes, outputBytes, assets };
await writeFile(path.join(root, 'assets/image-manifest.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`${assets.length} images: ${(sourceBytes / 1e6).toFixed(2)} MB -> ${(outputBytes / 1e6).toFixed(2)} MB (${(100 * (1 - outputBytes / sourceBytes)).toFixed(1)}% smaller)`);
