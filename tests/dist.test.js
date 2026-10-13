import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { sourceTags } from './helpers.js';

const entry = resolve(process.cwd(), 'dist/index.js');

describe.skipIf(!existsSync(entry))('dist (ya construido)', () => {
  it('importar dist registra todos los custom elements y se construyen', async () => {
    await import(pathToFileURL(entry).href);
    for (const t of sourceTags) {
      expect(customElements.get(t), t).toBeTruthy();
      expect(() => document.createElement(t), t).not.toThrow();
    }
  });
});
