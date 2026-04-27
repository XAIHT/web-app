import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['api/boot.ts'],
  platform: 'node',
  bundle: true,
  format: 'esm',
  outdir: 'dist',
  banner: {
    js: 'import{createRequire}from"node:module";const require=createRequire(import.meta.url);',
  },
});
