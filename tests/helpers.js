import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();

export const read = (rel) => readFileSync(resolve(ROOT, rel), 'utf8');
export const exists = (rel) => existsSync(resolve(ROOT, rel));

export const componentFiles = readdirSync(resolve(ROOT, 'src/components'))
  .filter((f) => f.endsWith('.js') && !f.endsWith('.styles.js'))
  .map((f) => f.slice(0, -3));

export const sourceTags = componentFiles
  .flatMap((f) => [...read(`src/components/${f}.js`).matchAll(/define\('(ui-[a-z-]+)'/g)].map((m) => m[1]))
  .sort();
