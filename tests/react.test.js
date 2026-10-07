import { describe, it, expect, vi, afterEach } from 'vitest';
import { createElement as h, act } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/index.js';

const roots = [];
const mount = async (node) => {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  roots.push({ root, container });
  await act(async () => root.render(node));
  return { container, root };
};

afterEach(async () => {
  for (const { root, container } of roots.splice(0)) {
    await act(async () => root.unmount());
    container.remove();
  }
  vi.restoreAllMocks();
});

describe('React 19 + custom elements', () => {
  it('ui-input: type/label/required/disabled sin errores', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container, root } = await mount(
      h('ui-input', { type: 'email', label: 'Correo', placeholder: 'a@b.c', required: true, disabled: false, autocomplete: 'email' })
    );
    const el = container.querySelector('ui-input');
    expect(el.type).toBe('email');
    expect(el.getAttribute('label')).toBe('Correo');
    expect(el.hasAttribute('required')).toBe(true);
    expect(el.hasAttribute('disabled')).toBe(false);

    await act(async () => root.render(h('ui-input', { type: 'password', label: 'Correo' })));
    expect(el.type).toBe('password');
    expect(el.hasAttribute('required')).toBe(false);
    expect(errors).not.toHaveBeenCalled();
  });

  it('ui-input: value controlado y onInput', async () => {
    const onInput = vi.fn();
    const { container } = await mount(h('ui-input', { label: 'Nombre', value: 'Abel', onInput }));
    const el = container.querySelector('ui-input');
    expect(el.value).toBe('Abel');

    const inner = el.shadowRoot.querySelector('input');
    inner.value = 'Abel F';
    await act(async () => inner.dispatchEvent(new Event('input', { bubbles: true, composed: true })));
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(el.value).toBe('Abel F');
  });

  it('eventos propios en minúsculas (onchange) llegan a React', async () => {
    const onchange = vi.fn();
    const { container } = await mount(h('ui-input', { label: 'x', onchange }));
    const el = container.querySelector('ui-input');
    await act(async () => el.dispatchEvent(new Event('change', { bubbles: true, composed: true })));
    expect(onchange).toHaveBeenCalledTimes(1);
  });

  it('ui-slider y ui-pagination aceptan props numéricas (antes: readonly)', async () => {
    const { container } = await mount(
      h('div', null,
        h('ui-slider', { min: 0, max: 50, step: 5, value: 10 }),
        h('ui-pagination', { pages: 20, page: 3 }))
    );
    const s = container.querySelector('ui-slider');
    expect([s.min, s.max, s.step, s.value]).toEqual([0, 50, 5, 10]);
    const p = container.querySelector('ui-pagination');
    expect([p.pages, p.page]).toEqual([20, 3]);
  });

  it('ui-button: type/block/loading', async () => {
    const { container } = await mount(h('ui-button', { type: 'submit', block: true, loading: false }, 'Entrar'));
    const el = container.querySelector('ui-button');
    expect(el.type).toBe('submit');
    expect(el.hasAttribute('block')).toBe(true);
    expect(el.hasAttribute('loading')).toBe(false);
  });
});
