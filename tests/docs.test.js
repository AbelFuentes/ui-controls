import { describe, it, expect } from 'vitest';
import { sourceTags, read } from './helpers.js';

const FIELD = ['name', 'label', 'hint', 'error', 'required', 'disabled', 'size'];

// { 'ui-x': ['atributo', 'onevento', ...] } leído de los tipos de React
function propsByTag(dts) {
  const out = {};
  for (const [, tag, type] of dts.matchAll(/'(ui-[a-z-]+)':\s*(\w+Props);/g)) {
    const start = dts.indexOf(`type ${type} =`);
    if (start < 0) throw new Error(`no encuentro type ${type}`);
    let end = dts.indexOf('\ntype ', start + 1);
    if (end < 0) end = dts.indexOf('\ndeclare module', start);
    const block = dts.slice(start, end);
    const open = block.indexOf('& {');
    if (open < 0) throw new Error(`sin objeto de props en ${type}`);
    const names = new Set(/& Field &/.test(block) ? FIELD : []);
    let depth = 0;
    let cur = '';
    const flush = () => {
      const m = cur.match(/^\s*'?([a-z][\w-]*)'?\??\s*:/i);
      if (m) names.add(m[1]);
      cur = '';
    };
    for (let i = block.indexOf('{', open) + 1; i < block.length; i++) {
      const c = block[i];
      if ('{(<['.includes(c)) depth++;
      if ('})>]'.includes(c)) {
        if (depth === 0) break;
        depth--;
      }
      if (c === ';' && depth === 0) flush();
      else cur += c;
    }
    flush();
    out[tag] = [...names];
  }
  return out;
}

const sections = (md) => {
  const parts = md.split(/^## `(ui-[a-z-]+)`\s*$/m);
  const out = {};
  for (let i = 1; i < parts.length; i += 2) out[parts[i]] = parts[i + 1];
  return out;
};

describe('COMPONENTS.md (referencia para IA)', () => {
  const secs = sections(read('COMPONENTS.md'));

  it('documenta todos los componentes y solo esos', () => {
    expect(Object.keys(secs).sort()).toEqual(sourceTags);
  });

  it('cada sección trae un ejemplo con su etiqueta', () => {
    for (const [tag, body] of Object.entries(secs)) {
      if (tag === 'ui-toaster') continue; // se usa con toast(), no con la etiqueta
      expect(body, tag).toContain(`<${tag}`);
    }
  });

  it('todo atributo o evento tipado en react.d.ts aparece en su sección', () => {
    const props = propsByTag(read('src/react.d.ts'));
    const missing = [];
    for (const [tag, names] of Object.entries(props)) {
      for (const n of names) {
        const word = /^on[a-z]+$/.test(n) ? n.slice(2) : n; // onchange → change
        if (!secs[tag].includes(`\`${word}\``)) missing.push(`${tag}: ${word}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
