import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { sourceTags, componentFiles, read } from './helpers.js';
import '../src/index.js';

describe('registro', () => {
  it('index.js registra todos los custom elements', () => {
    for (const t of sourceTags) expect(customElements.get(t), t).toBeTruthy();
  });

  it('todos los elementos se construyen sin lanzar', () => {
    for (const t of sourceTags) expect(() => document.createElement(t), t).not.toThrow();
  });

  it('index.js exporta todos los componentes', () => {
    const index = read('src/index.js');
    for (const f of componentFiles) expect(index, f).toContain(`./components/${f}.js`);
  });
});

describe('tipos y paquete', () => {
  const tagsIn = (src) => [...src.matchAll(/'(ui-[a-z-]+)':/g)].map((m) => m[1]).sort();

  it('index.d.ts y react.d.ts declaran todos los tags', () => {
    expect(tagsIn(read('src/index.d.ts'))).toEqual(sourceTags);
    expect(tagsIn(read('src/react.d.ts'))).toEqual(sourceTags);
  });

  it('package.json expone types y cada componente tiene export', () => {
    const p = JSON.parse(read('package.json'));
    expect(p.types).toBe('./src/index.d.ts');
    expect(p.files).toContain('src');
    for (const f of componentFiles) expect(p.exports[`./${f}`], f).toBeTruthy();
    for (const [k, v] of Object.entries(p.exports)) {
      if (k.endsWith('.css')) continue;
      expect(v.types, k).toBe('./src/index.d.ts');
      expect(existsSync(new URL(`../${v.default}`, import.meta.url)), k).toBe(true);
    }
    expect(existsSync(new URL('../src/index.d.ts', import.meta.url))).toBe(true);
    expect(existsSync(new URL('../src/react.d.ts', import.meta.url))).toBe(true);
  });
});
