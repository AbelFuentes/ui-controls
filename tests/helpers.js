import { readFileSync, readdirSync } from 'node:fs';

const dir = new URL('../src/components/', import.meta.url);

export const read = (rel) => readFileSync(new URL(`../${rel}`, import.meta.url), 'utf8');

export const componentFiles = readdirSync(dir)
  .filter((f) => f.endsWith('.js') && !f.endsWith('.styles.js'))
  .map((f) => f.slice(0, -3));

export const sourceTags = componentFiles
  .flatMap((f) => [...read(`src/components/${f}.js`).matchAll(/define\('(ui-[a-z-]+)'/g)].map((m) => m[1]))
  .sort();
