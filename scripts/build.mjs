import { build } from 'esbuild';
import { cpSync, readdirSync, rmSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });

const components = readdirSync('src/components')
  .filter((f) => f.endsWith('.js') && !f.endsWith('.styles.js'))
  .map((f) => `src/components/${f}`);

const common = { bundle: true, format: 'esm', target: 'es2022', logLevel: 'warning' };

// 1) ESM modular: un archivo por componente, sin minificar (el bundler del consumidor decide)
await build({
  ...common,
  entryPoints: ['src/index.js', 'src/core/theme.js', ...components],
  outdir: 'dist',
  outbase: 'src',
  splitting: true,
  chunkNames: 'chunks/[name]-[hash]',
  sourcemap: true,
});

// 2) Un solo archivo minificado para CDN / sin build
await build({
  ...common,
  entryPoints: { 'ui-controls.min': 'src/index.js' },
  outdir: 'dist',
  minify: true,
  sourcemap: true,
});

// 3) CSS y tipos
await build({ entryPoints: ['src/tokens.css'], outfile: 'dist/tokens.css', minify: true, logLevel: 'warning' });
cpSync('src/index.d.ts', 'dist/index.d.ts');
cpSync('src/react.d.ts', 'dist/react.d.ts');
console.log('✓ dist listo');
