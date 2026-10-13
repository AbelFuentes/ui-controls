import { describe, it, expect } from 'vitest';
import { sourceTags, componentFiles, read, exists } from './helpers.js';
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
  const pkg = () => JSON.parse(read('package.json'));

  it('index.d.ts y react.d.ts declaran todos los tags', () => {
    expect(tagsIn(read('src/index.d.ts'))).toEqual(sourceTags);
    expect(tagsIn(read('src/react.d.ts'))).toEqual(sourceTags);
  });

  it('package.json publica dist (no src) y expone types', () => {
    const p = pkg();
    expect(p.types).toBe('./dist/index.d.ts');
    expect(p.files).toEqual(['dist']);
    expect(p.sideEffects).toBeUndefined(); // los chunks de dist registran elementos
    for (const f of componentFiles) expect(p.exports[`./${f}`], f).toBeTruthy();
    for (const [k, v] of Object.entries(p.exports)) {
      if (k.endsWith('.css')) { expect(v, k).toBe('./dist/tokens.css'); continue; }
      expect(v.types, k).toBe('./dist/index.d.ts');
      expect(v.default.startsWith('./dist/'), k).toBe(true);
    }
  });

  it.skipIf(!exists('dist/index.js'))('dist contiene todo lo que exporta package.json', () => {
    for (const v of Object.values(pkg().exports)) {
      const f = typeof v === 'string' ? v : v.default;
      expect(exists(f), f).toBe(true);
    }
    expect(exists('dist/index.d.ts')).toBe(true);
    expect(exists('dist/react.d.ts')).toBe(true);
    expect(exists('dist/ui-controls.min.js')).toBe(true);
  });
});
