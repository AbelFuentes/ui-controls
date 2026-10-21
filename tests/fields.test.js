import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import '../src/index.js';

const TAGS = ['ui-combobox', 'ui-date-picker', 'ui-empty-state', 'ui-file-upload', 'ui-stat', 'ui-tag-input', 'ui-text'];
const mk = (html) => { const d = document.createElement('div'); d.innerHTML = html; document.body.append(d); return d.firstElementChild; };
const tick = () => new Promise((r) => setTimeout(r, 0));
const key = (el, k, extra = {}) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...extra }));

beforeAll(() => {
  // jsdom no implementa la API de popover
  HTMLElement.prototype.showPopover = function () { this.setAttribute('data-open', ''); };
  HTMLElement.prototype.hidePopover = function () { this.removeAttribute('data-open'); };
});
afterEach(() => { document.body.innerHTML = ''; });

it('registra y conecta todos', () => {
  for (const t of TAGS) {
    expect(customElements.get(t), t).toBeTruthy();
    document.body.append(document.createElement(t));
  }
});

describe('ui-text', () => {
  it('encabezados exponen role y aria-level; level manda; sin variante no hay role', () => {
    const el = mk('<ui-text variant="h2">Título</ui-text>');
    expect(el.getAttribute('role')).toBe('heading');
    expect(el.getAttribute('aria-level')).toBe('2');
    el.setAttribute('level', '4');
    expect(el.getAttribute('aria-level')).toBe('4');
    el.setAttribute('variant', 'caption');
    el.removeAttribute('level');
    expect(el.hasAttribute('role')).toBe(false);
    const own = mk('<ui-text variant="h1" role="presentation">x</ui-text>');
    expect(own.getAttribute('role')).toBe('presentation');
  });
  it('lines fija --lines', () => {
    const el = mk('<ui-text lines="3">x</ui-text>');
    expect(el.style.getPropertyValue('--lines')).toBe('3');
    el.removeAttribute('lines');
    expect(el.style.getPropertyValue('--lines')).toBe('');
  });
});

describe('ui-empty-state', () => {
  it('muestra título y descripción y oculta lo vacío', async () => {
    const el = mk('<ui-empty-state heading="Sin datos" description="Crea el primero" level="3"></ui-empty-state>');
    await tick();
    const r = el.shadowRoot;
    expect(r.querySelector('.t').textContent).toBe('Sin datos');
    expect(r.querySelector('.t').getAttribute('aria-level')).toBe('3');
    expect(r.querySelector('.d').hidden).toBe(false);
    expect(r.querySelector('.ic').hidden).toBe(true);
    expect(r.querySelector('.a').hidden).toBe(true);
  });
});

describe('ui-stat', () => {
  const dl = (el) => el.shadowRoot.querySelector('.dl');
  it('deriva tendencia del signo del delta', () => {
    expect(dl(mk('<ui-stat label="A" value="1" delta="+12%"></ui-stat>')).className).toBe('dl up');
    expect(dl(mk('<ui-stat label="A" value="1" delta="-8%"></ui-stat>')).className).toBe('dl down');
    expect(dl(mk('<ui-stat label="A" value="1" delta="0%"></ui-stat>')).className).toBe('dl flat');
  });
  it('invert cambia el color pero no la flecha; trend manda; loading marca aria-busy', () => {
    const el = mk('<ui-stat label="Costos" value="9" delta="+5%" invert></ui-stat>');
    expect(dl(el).className).toBe('dl down');
    expect(dl(el).querySelector('svg').innerHTML).toContain('M7 14l5-5 5 5');
    el.setAttribute('trend', 'down');
    expect(dl(el).querySelector('svg').innerHTML).toContain('M7 10l5 5 5-5');
    el.setAttribute('loading', '');
    expect(el.shadowRoot.querySelector('.s').getAttribute('aria-busy')).toBe('true');
    expect(el.shadowRoot.querySelector('.val').textContent).toBe('9');
  });
});

describe('ui-combobox', () => {
  const make = (attrs = '') => mk(`<ui-combobox label="País" ${attrs}>
    <option value="mx">México</option><option value="co">Colombia</option><option value="pe" disabled>Perú</option><option value="ar">Argentina</option></ui-combobox>`);
  const input = (el) => el.shadowRoot.querySelector('input');
  const type = (el, text) => { const i = input(el); i.value = text; i.dispatchEvent(new Event('input', { bubbles: true, composed: true })); };
  const opts = (el) => [...el.shadowRoot.querySelectorAll('.opt')].map((o) => o.textContent);

  it('value muestra la etiqueta de la opción', () => {
    const el = make('value="co"');
    expect(input(el).value).toBe('Colombia');
    el.setAttribute('value', 'mx');
    expect(input(el).value).toBe('México');
    expect(el.value).toBe('mx');
  });

  it('filtra sin importar acentos ni mayúsculas y abre el menú', () => {
    const el = make();
    type(el, 'mexi');
    expect(el.shadowRoot.querySelector('.menu').hasAttribute('data-open')).toBe(true);
    expect(opts(el)).toEqual(['México']);
    expect(input(el).getAttribute('aria-expanded')).toBe('true');
    type(el, 'zzz');
    expect(el.shadowRoot.querySelector('.none').textContent).toBe('Sin resultados');
    el.setAttribute('empty', 'Nada');
    type(el, 'zzzz');
    expect(el.shadowRoot.querySelector('.none').textContent).toBe('Nada');
  });

  it('teclado: flecha abre, Enter elige y emite change {value,label}', () => {
    const el = make();
    const fn = vi.fn();
    el.addEventListener('change', fn);
    input(el).focus();
    key(input(el), 'ArrowDown');
    expect(opts(el)).toHaveLength(4);
    key(input(el), 'ArrowDown');
    key(input(el), 'Enter');
    expect(fn.mock.calls[0][0].detail).toEqual({ value: 'co', label: 'Colombia' });
    expect(el.value).toBe('co');
    expect(input(el).value).toBe('Colombia');
    expect(input(el).getAttribute('aria-expanded')).toBe('false');
  });

  it('las opciones deshabilitadas se saltan con el teclado', () => {
    const el = make();
    input(el).focus();
    key(input(el), 'ArrowDown');
    key(input(el), 'ArrowUp');
    key(input(el), 'ArrowUp');
    key(input(el), 'Enter');
    expect(el.value).toBe('co');
  });

  it('clic en una opción elige', () => {
    const el = make();
    type(el, 'a');
    el.shadowRoot.querySelectorAll('.opt')[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(el.value).toBeTruthy();
  });

  it('blur revierte el texto no confirmado; allow-custom lo conserva', () => {
    const el = make('value="mx"');
    type(el, 'basura');
    input(el).dispatchEvent(new Event('blur'));
    expect(input(el).value).toBe('México');
    expect(el.value).toBe('mx');

    const free = make('allow-custom');
    const fn = vi.fn();
    free.addEventListener('change', fn);
    type(free, 'Chile');
    key(input(free), 'Enter');
    expect(free.value).toBe('Chile');
    expect(fn.mock.calls[0][0].detail).toEqual({ value: 'Chile', label: 'Chile' });
  });

  it('clearable: el botón borra y emite change', () => {
    const el = make('value="mx" clearable');
    const clr = el.shadowRoot.querySelector('.clr');
    expect(clr.hidden).toBe(false);
    const fn = vi.fn();
    el.addEventListener('change', fn);
    clr.click();
    expect(el.value).toBe('');
    expect(input(el).value).toBe('');
    expect(fn.mock.calls[0][0].detail.value).toBe('');
  });

  it('Escape cierra el menú abierto', () => {
    const el = make();
    input(el).focus();
    key(input(el), 'ArrowDown');
    key(input(el), 'Escape');
    expect(el.shadowRoot.querySelector('.menu').hasAttribute('data-open')).toBe(false);
  });
});

describe('ui-date-picker', () => {
  const make = (attrs = '') => mk(`<ui-date-picker label="Fecha" locale="es-MX" ${attrs}></ui-date-picker>`);
  const days = (el) => [...el.shadowRoot.querySelectorAll('.day')];
  const day = (el, d) => el.shadowRoot.querySelector(`.day[data-d="${d}"]`);

  it('muestra la fecha formateada y valida el formato', () => {
    const el = make('value="2026-03-15"');
    expect(el.shadowRoot.querySelector('.val').textContent).toMatch(/2026/);
    expect(el.value).toBe('2026-03-15');
    expect(el.valueAsDate.getDate()).toBe(15);
    expect(make('value="15/03/2026"').value).toBe('');
  });

  it('abrir renderiza 42 días y enfoca la fecha seleccionada', () => {
    const spy = vi.spyOn(HTMLElement.prototype, 'focus'); // jsdom no actualiza activeElement dentro de shadow roots
    const el = make('value="2026-03-15"');
    el.open();
    expect(days(el)).toHaveLength(42);
    expect(day(el, '2026-03-15').getAttribute('aria-selected')).toBe('true');
    expect(spy.mock.contexts.at(-1)).toBe(day(el, '2026-03-15'));
    spy.mockRestore();
    expect(el.shadowRoot.querySelector('.ttl').textContent).toMatch(/Marzo de 2026/);
    expect(el.shadowRoot.querySelector('.pop').hasAttribute('data-open')).toBe(true);
  });

  it('elegir un día fija value, emite change y cierra', () => {
    const el = make('value="2026-03-15"');
    const fn = vi.fn();
    el.addEventListener('change', fn);
    el.open();
    day(el, '2026-03-20').click();
    expect(el.value).toBe('2026-03-20');
    expect(fn.mock.calls[0][0].detail).toEqual({ value: '2026-03-20' });
    expect(el.shadowRoot.querySelector('.pop').hasAttribute('data-open')).toBe(false);
  });

  it('teclado: flechas, RePág/AvPág y Escape', () => {
    const el = make('value="2026-03-15"');
    el.open();
    const focused = () => el.shadowRoot.querySelector('.day[tabindex="0"]').dataset.d;
    key(day(el, '2026-03-15'), 'ArrowRight');
    expect(focused()).toBe('2026-03-16');
    key(el.shadowRoot.querySelector('.day[tabindex="0"]'), 'ArrowDown');
    expect(focused()).toBe('2026-03-23');
    key(el.shadowRoot.querySelector('.day[tabindex="0"]'), 'PageDown');
    expect(focused()).toBe('2026-04-23');
    expect(el.shadowRoot.querySelector('.ttl').textContent).toMatch(/Abril de 2026/);
    key(el.shadowRoot.querySelector('.day[tabindex="0"]'), 'Escape');
    expect(el.shadowRoot.querySelector('.pop').hasAttribute('data-open')).toBe(false);
  });

  it('week-start: lunes por defecto, domingo con 0', () => {
    const el = make();
    el.open();
    const first = () => el.shadowRoot.querySelector('.dow').textContent.toLowerCase();
    expect(first()).toMatch(/^lu/);
    el.close(false);
    el.setAttribute('week-start', '0');
    el.open();
    expect(first()).toMatch(/^do/);
  });

  it('min y max deshabilitan días', () => {
    const el = make('value="2026-03-15" min="2026-03-10" max="2026-03-20"');
    el.open();
    expect(day(el, '2026-03-05').disabled).toBe(true);
    expect(day(el, '2026-03-25').disabled).toBe(true);
    expect(day(el, '2026-03-12').disabled).toBe(false);
    day(el, '2026-03-05').click();
    expect(el.value).toBe('2026-03-15');
  });

  it('clearable limpia el valor y los botones de mes cambian la vista', () => {
    const el = make('value="2026-03-15" clearable');
    const fn = vi.fn();
    el.addEventListener('change', fn);
    el.shadowRoot.querySelector('.clr').click();
    expect(el.value).toBe('');
    expect(fn.mock.calls[0][0].detail.value).toBe('');

    const nav = make('value="2026-03-15"');
    nav.open();
    nav.shadowRoot.querySelector('.next').click();
    expect(nav.shadowRoot.querySelector('.ttl').textContent).toMatch(/Abril/);
    nav.shadowRoot.querySelector('.prev').click();
    nav.shadowRoot.querySelector('.prev').click();
    expect(nav.shadowRoot.querySelector('.ttl').textContent).toMatch(/Febrero/);
  });
});

describe('ui-tag-input', () => {
  const make = (attrs = '') => mk(`<ui-tag-input label="Etiquetas" ${attrs}></ui-tag-input>`);
  const input = (el) => el.shadowRoot.querySelector('input');
  const chips = (el) => [...el.shadowRoot.querySelectorAll('.chip')].map((c) => c.firstElementChild.textContent);

  it('value inicial, tags y value como texto', () => {
    const el = make('value="a, b ,c"');
    expect(chips(el)).toEqual(['a', 'b', 'c']);
    expect(el.tags).toEqual(['a', 'b', 'c']);
    expect(el.value).toBe('a,b,c');
    el.tags = ['x', 'y'];
    expect(chips(el)).toEqual(['x', 'y']);
  });

  it('Enter agrega y emite add y change; la coma también', () => {
    const el = make();
    const add = vi.fn();
    const change = vi.fn();
    el.addEventListener('add', add);
    el.addEventListener('change', change);
    input(el).value = 'uno';
    key(input(el), 'Enter');
    input(el).value = 'dos';
    key(input(el), ',');
    expect(chips(el)).toEqual(['uno', 'dos']);
    expect(add.mock.calls[0][0].detail).toEqual({ tag: 'uno' });
    expect(change.mock.calls.at(-1)[0].detail).toEqual({ tags: ['uno', 'dos'] });
    expect(input(el).value).toBe('');
  });

  it('rechaza duplicados y respeta max (con evento reject)', () => {
    const el = make('max="2"');
    const rej = vi.fn();
    el.addEventListener('reject', rej);
    for (const t of ['a', 'a', 'b', 'c']) { input(el).value = t; key(input(el), 'Enter'); }
    expect(chips(el)).toEqual(['a', 'b']);
    expect(rej.mock.calls.map((c) => c[0].detail)).toEqual([{ tag: 'a', reason: 'duplicate' }, { tag: 'c', reason: 'max' }]);
    expect(el.shadowRoot.querySelector('.msg').textContent).toMatch(/Máximo 2/);
    const dup = make('allow-duplicates');
    for (const t of ['z', 'z']) { input(dup).value = t; key(input(dup), 'Enter'); }
    expect(dup.tags).toEqual(['z', 'z']);
  });

  it('pegar con comas separa en etiquetas y deja el resto escribiéndose', () => {
    const el = make();
    input(el).value = 'x, y, par';
    input(el).dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    expect(chips(el)).toEqual(['x', 'y']);
    expect(input(el).value).toBe(' par');
  });

  it('Backspace en vacío quita la última; la X quita una; blur confirma el texto', () => {
    const el = make('value="a,b,c"');
    const rm = vi.fn();
    el.addEventListener('remove', rm);
    key(input(el), 'Backspace');
    expect(chips(el)).toEqual(['a', 'b']);
    el.shadowRoot.querySelector('.x[data-i="0"]').click();
    expect(chips(el)).toEqual(['b']);
    expect(rm.mock.calls.map((c) => c[0].detail.tag)).toEqual(['c', 'a']);
    input(el).value = 'nuevo';
    input(el).dispatchEvent(new Event('blur'));
    expect(chips(el)).toEqual(['b', 'nuevo']);
  });
});

describe('ui-file-upload', () => {
  const file = (name, size = 10, type = 'text/plain') => {
    const f = new File(['x'], name, { type });
    Object.defineProperty(f, 'size', { value: size });
    return f;
  };
  const drop = (el, files) => {
    const e = new Event('drop', { bubbles: true, cancelable: true });
    e.dataTransfer = { files };
    el.shadowRoot.querySelector('.zone').dispatchEvent(e);
  };
  const items = (el) => [...el.shadowRoot.querySelectorAll('.it strong')].map((s) => s.textContent);

  it('modo simple: reemplaza el archivo y emite change', () => {
    const el = mk('<ui-file-upload label="Recibo"></ui-file-upload>');
    const fn = vi.fn();
    el.addEventListener('change', fn);
    drop(el, [file('a.txt')]);
    drop(el, [file('b.txt')]);
    expect(items(el)).toEqual(['b.txt']);
    expect(el.files).toHaveLength(1);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('multiple: acumula, evita repetidos y respeta max-files', () => {
    const el = mk('<ui-file-upload multiple max-files="2"></ui-file-upload>');
    const rej = vi.fn();
    el.addEventListener('reject', rej);
    const a = file('a.txt');
    drop(el, [a, a, file('b.txt'), file('c.txt')]);
    expect(items(el)).toEqual(['a.txt', 'b.txt']);
    expect(rej.mock.calls[0][0].detail.reason).toBe('count');
    expect(el.shadowRoot.querySelector('.msg').textContent).toMatch(/Máximo 2/);
  });

  it('accept y max-size rechazan con el motivo correcto', () => {
    const el = mk('<ui-file-upload accept="image/*,.pdf" max-size="1" multiple></ui-file-upload>');
    const rej = vi.fn();
    el.addEventListener('reject', rej);
    drop(el, [file('a.txt', 10, 'text/plain'), file('big.png', 2 * 1048576, 'image/png'), file('ok.png', 100, 'image/png'), file('doc.pdf', 100, 'application/pdf')]);
    expect(items(el)).toEqual(['ok.png', 'doc.pdf']);
    expect(rej.mock.calls.map((c) => c[0].detail.reason)).toEqual(['type', 'size']);
  });

  it('quitar un archivo y clear() emiten change; disabled ignora soltar archivos', () => {
    const el = mk('<ui-file-upload multiple></ui-file-upload>');
    drop(el, [file('a.txt'), file('b.txt')]);
    const fn = vi.fn();
    el.addEventListener('change', fn);
    el.shadowRoot.querySelector('.rm[data-i="0"]').click();
    expect(items(el)).toEqual(['b.txt']);
    el.clear();
    expect(el.files).toEqual([]);
    expect(fn).toHaveBeenCalledTimes(2);

    const off = mk('<ui-file-upload disabled></ui-file-upload>');
    drop(off, [file('a.txt')]);
    expect(off.files).toEqual([]);
  });

  it('el subtítulo resume accept, tamaño y límite', () => {
    const el = mk('<ui-file-upload accept=".pdf" max-size="5" multiple max-files="3" hint="Facturas"></ui-file-upload>');
    expect(el.shadowRoot.querySelector('.sub').textContent).toBe('Facturas · .pdf · máx. 5 MB · hasta 3 archivos');
  });
});
