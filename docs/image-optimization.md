# Website Image Optimization

## Scope

The October 14, 2026 migration converts all 32 public PNG/JPEG images to WebP:
five Tlamatini portraits, six feature/hero images, and 21 campaign gallery images.
Home, Tlamatini, Launch (including its dynamic gallery), and the README hero now
reference the converted files. Layout, CSS, image dimensions, aspect ratios,
captions, translations, animation, and lazy-loading behavior are unchanged.

Two SVG logos remain vectors: they are only 1,008 and 1,192 bytes and remain sharp
at every display size. Three MP4 videos retain their original format. Source
artwork, presentation assets, and document images outside `public/` are not web
payloads and are not converted or discarded.

## Measured Asset Savings

| Public raster assets | Before | After |
| --- | ---: | ---: |
| All 32 files | 69,253,080 bytes | 5,404,932 bytes |
| Decimal megabytes | 69.25 MB | 5.40 MB |

This removes 63,848,148 bytes, or **92.2%**, from the public raster collection.
It is not a claim that every visitor previously downloaded all 69.25 MB, nor a
promise of a fixed page-load time improvement. Each route requests its own images;
network speed, caching, videos, JavaScript, and image decoding also affect loading.
Full-resolution images still need similar decoded pixel memory.

Fresh, headed Chrome contexts produced the following image-response body totals
after scrolling each entire page, at both 1440px desktop and 390px mobile widths:

| Route | Original images | WebP images | Reduction |
| --- | ---: | ---: | ---: |
| `/` | 1,370,157 bytes | 155,960 bytes | 88.6% |
| `/tlamatini` | 25,476,079 bytes | 1,864,440 bytes | 92.7% |
| `/launch` | 43,524,744 bytes | 3,329,600 bytes | 92.4% |

These totals count each locally requested image URL once, include the unchanged
SVG logos, and exclude videos, HTML, fonts, and JavaScript. They measure image
payload reduction, not real-world loading duration or Core Web Vitals.

## Encoding and Preservation

- Sharp 0.35.5 performs the conversion locally; no artwork is uploaded.
- PNG artwork uses WebP quality 88; already-compressed JPEGs use quality 82.
  A quality-88 trial made several JPEGs larger, so the JPEG setting was measured
  separately. Every final WebP is smaller than its source.
- Encoding uses effort 6, smart chroma subsampling, and alpha quality 100. RGB
  compression is lossy, not pixel-identical; transparency is checked pixel-for-pixel.
- Original orientation and resolution are preserved, colors are converted to sRGB,
  and unnecessary source metadata is omitted. No image is cropped or resized.
- All originals are retained. The five portraits and 21 gallery PNGs already had
  byte-identical masters outside `public/`. The six JPEG masters are preserved in
  `assets/image-sources/`. Presentation-generation scripts keep their existing PNGs.

## Maintenance

```sh
npm run images:optimize
npm test
npm run build
```

`scripts/optimize-images.mjs` reads the original masters, writes WebP files under
`public/images/`, and regenerates `assets/image-manifest.json`. The manifest records
source/destination paths, dimensions, encoder settings, byte counts, and SHA-256
hashes. It is build-time tooling, not a browser dependency or a server-side image
service; ordinary builds use the generated static files without re-encoding them.

For a new image, add its master to the appropriate source directory (or explicit
portrait mapping), run the converter, update the page reference, and update the
expected inventory in `api/image-assets.test.ts`. Do not export WebP from an older
WebP: always regenerate from the original source to avoid cumulative quality loss.
Keep SVG and video assets outside the raster conversion pipeline.

## Verification and Deployment

`api/image-assets.test.ts` checks the complete public raster inventory, original
and output hashes, WebP file signatures/decoding, dimensions, exact alpha values,
file-size savings, and static/dynamic asset references. It also guards the SVG and
MP4 exceptions. The browser check exercises all three routes at desktop and mobile
sizes, including lazy images, and compares image geometry against the original
production build. The production server must serve each converted file with
`Content-Type: image/webp` and without missing-image responses.

The migration passed all 80 tests, ESLint, the production build, six desktop/mobile
route checks, and HTTP/MIME checks for all 32 assets. All tested image dimensions,
display sizes, horizontal positions, and alt text match the baseline, with no
horizontal page overflow or browser JavaScript errors. Six representative
original/WebP crops were also inspected at 100% resolution. The built CSS hash
is unchanged.

The repository's full type check still reports two unrelated errors in unchanged
files: `SidebarContextProps` is undefined in `src/components/ui/sidebar.tsx`, and
an `unknown` value is passed as a request body in `api/lib/http.ts`. The existing
Vite large-chunk warning also remains; this migration does not change application
logic or bundle splitting.

The new `.webp` URLs avoid reusing cached PNG/JPEG responses. Deploy the updated
application bundle and its public assets together through the existing release
process, then verify the deployed routes. Local tests do not update the live site.
This migration does not change server caching, code splitting, video delivery, or
responsive image sizing.
