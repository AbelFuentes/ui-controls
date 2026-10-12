import { describe, it, expect, vi, afterEach } from 'vitest';
import '../src/components/table.js';

const makeRows = () => [
  { id: 1, name: 'Ana', role: 'Diseño', score: 92 },
  { id: 2, name: 'Beto', role: 'Ingeniería', score: 78 },
  { id: 3, name: 'Carla', role: 'Producto', score: 85 },
];
const columns = [
  { key: 'name', label: 'Nombre', sortable: true },
  { key: 'role', label: 'Rol' },
  { key: 'score', label: 'Puntaje', sortable: true, align: 'right' },
];

function make({ attrs = {}, cols = columns, data = makeRows() } = {}) {
  const t = document.createElement('ui-table');
  for (const [k, v] of Object.entries(attrs)) t.setAttribute(k, v === true ? '' : v);
  t.columns = cols;
  t.rows = data;
  document.body.append(t);
  return { t, data };
}

const body = (t) => t.shadowRoot.querySelector('tbody');
const trs = (t) => [...body(t).children];
const click = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true }));
const key = (el, k) => {
  const e = new KeyboardEvent('keydown', { key: k, bubbles: true, composed: true, cancelable: true });
  el.dispatchEvent(e);
  return e;
};
const change = (el) => el.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }));

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-table · filas clickables', () => {
  it('click en una fila emite rowclick con { row, index }', () => {
    const { t, data } = make({ attrs: { clickable: true } });
    const fn = vi.fn();
    t.addEventListener('rowclick', fn);
    click(trs(t)[1]);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn.mock.calls[0][0].detail.row).toBe(data[1]); // misma referencia
    expect(fn.mock.calls[0][0].detail.index).toBe(1);
  });

  it('el evento sube (bubbles) y cruza el shadow DOM (composed)', () => {
    const { t } = make({ attrs: { clickable: true } });
    const fn = vi.fn();
    document.body.addEventListener('rowclick', fn);
    click(trs(t)[0]);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn.mock.calls[0][0].composed).toBe(true);
  });

  it('row e index reflejan el orden actual (no el de rows)', () => {
    const { t, data } = make({ attrs: { clickable: true, 'sort-key': 'name', 'sort-dir': 'desc' } });
    const fn = vi.fn();
    t.addEventListener('rowclick', fn);
    click(trs(t)[0]); // primera fila visible = Carla
    expect(fn.mock.calls[0][0].detail.row).toBe(data[2]);
    expect(fn.mock.calls[0][0].detail.index).toBe(0);
  });

  it.each([['Enter'], [' ']])('la tecla "%s" con la fila enfocada emite rowclick', (k) => {
    const { t, data } = make({ attrs: { clickable: true } });
    const fn = vi.fn();
    t.addEventListener('rowclick', fn);
    key(trs(t)[2], k);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn.mock.calls[0][0].detail.row).toBe(data[2]);
  });

  it('Espacio no hace scroll (preventDefault)', () => {
    const { t } = make({ attrs: { clickable: true } });
    expect(key(trs(t)[0], ' ').defaultPrevented).toBe(true);
  });

  it('las filas son enfocables: solo una con tabindex=0 y flechas/Home/End mueven el foco', () => {
    const { t } = make({ attrs: { clickable: true } });
    expect(trs(t).map((r) => r.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);

    key(trs(t)[0], 'ArrowDown');
    expect(t.shadowRoot.activeElement).toBe(trs(t)[1]);
    expect(trs(t).map((r) => r.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);

    key(trs(t)[1], 'End');
    expect(t.shadowRoot.activeElement).toBe(trs(t)[2]);
    key(trs(t)[2], 'Home');
    expect(t.shadowRoot.activeElement).toBe(trs(t)[0]);
  });

  it.each([['button'], ['a'], ['input']])('click dentro de <%s> en una celda no emite rowclick', (tag) => {
    const cols = [
      ...columns,
      {
        key: 'x', label: '',
        render: () => {
          const el = document.createElement(tag);
          if (tag === 'a') el.href = '#x';
          return el;
        },
      },
    ];
    const { t } = make({ attrs: { clickable: true }, cols });
    const rowFn = vi.fn();
    t.addEventListener('rowclick', rowFn);

    const inner = body(t).querySelector(tag);
    const own = vi.fn();
    inner.addEventListener('click', own);
    click(inner);

    expect(own).toHaveBeenCalledTimes(1); // el elemento sigue funcionando
    expect(rowFn).not.toHaveBeenCalled();
  });

  it('Enter sobre un botón dentro de la celda no emite rowclick', () => {
    const cols = [...columns, { key: 'x', label: '', render: () => document.createElement('button') }];
    const { t } = make({ attrs: { clickable: true }, cols });
    const fn = vi.fn();
    t.addEventListener('rowclick', fn);
    key(body(t).querySelector('button'), 'Enter');
    expect(fn).not.toHaveBeenCalled();
  });

  it('sin clickable no emite rowclick ni hace las filas enfocables', () => {
    const { t } = make();
    const fn = vi.fn();
    t.addEventListener('rowclick', fn);
    click(trs(t)[0]);
    key(trs(t)[0], 'Enter');
    expect(fn).not.toHaveBeenCalled();
    expect(trs(t).every((r) => !r.hasAttribute('tabindex'))).toBe(true);
  });

  it('agregar o quitar clickable después activa o apaga el comportamiento', () => {
    const { t } = make();
    const fn = vi.fn();
    t.addEventListener('rowclick', fn);

    t.setAttribute('clickable', '');
    click(trs(t)[0]);
    expect(fn).toHaveBeenCalledTimes(1);

    t.removeAttribute('clickable');
    click(trs(t)[0]);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('ui-table · sort y select siguen funcionando', () => {
  it('sort: ciclo asc → desc, emite sort y nunca rowclick', () => {
    const { t } = make({ attrs: { clickable: true } });
    const sortFn = vi.fn();
    const rowFn = vi.fn();
    t.addEventListener('sort', sortFn);
    t.addEventListener('rowclick', rowFn);

    click(t.shadowRoot.querySelector('.sort[data-key=name]'));
    expect(sortFn.mock.calls[0][0].detail).toEqual({ key: 'name', dir: 'asc' });
    expect(trs(t)[0].textContent).toContain('Ana');

    click(t.shadowRoot.querySelector('.sort[data-key=name]'));
    expect(sortFn.mock.calls[1][0].detail).toEqual({ key: 'name', dir: 'desc' });
    expect(trs(t)[0].textContent).toContain('Carla');

    expect(rowFn).not.toHaveBeenCalled();
  });

  it('select (varias): la casilla no emite rowclick y select trae { rows, keys }', () => {
    const { t, data } = make({ attrs: { clickable: true, selectable: true, 'row-key': 'id' } });
    const rowFn = vi.fn();
    const selFn = vi.fn();
    t.addEventListener('rowclick', rowFn);
    t.addEventListener('select', selFn);

    const cb = trs(t)[0].querySelector('.cb ui-checkbox');
    click(cb);
    expect(rowFn).not.toHaveBeenCalled();

    cb.checked = true;
    change(cb);
    expect(selFn.mock.calls[0][0].detail.keys).toEqual([1]);
    expect(t.selection).toEqual([data[0]]);
    expect(trs(t)[0].classList.contains('sel')).toBe(true);
  });

  it('selectable="single": usa radios, sin casilla maestra, y reemplaza la selección', () => {
    const { t, data } = make({ attrs: { selectable: 'single', 'row-key': 'id' } });
    expect(t.shadowRoot.querySelector('[data-all]')).toBeNull();
    expect(t.shadowRoot.querySelectorAll('tbody ui-radio')).toHaveLength(3);

    const selFn = vi.fn();
    t.addEventListener('select', selFn);
    change(trs(t)[0].querySelector('ui-radio'));
    change(trs(t)[1].querySelector('ui-radio'));

    expect(selFn.mock.calls.at(-1)[0].detail.rows).toEqual([data[1]]);
    expect(t.selectedKeys).toEqual([2]);
    expect(trs(t)[0].querySelector('ui-radio').checked).toBe(false);
    expect(trs(t)[1].querySelector('ui-radio').checked).toBe(true);
  });

  it('row-key: la selección sobrevive a reemplazar rows; sin row-key se pierde', () => {
    const withKey = make({ attrs: { selectable: true, 'row-key': 'id' } });
    const cb = trs(withKey.t)[0].querySelector('ui-checkbox');
    cb.checked = true;
    change(cb);
    withKey.t.rows = withKey.data.map((r) => ({ ...r })); // objetos nuevos
    expect(withKey.t.selectedKeys).toEqual([1]);
    expect(withKey.t.selection).toHaveLength(1);
    expect(trs(withKey.t)[0].classList.contains('sel')).toBe(true);

    const noKey = make({ attrs: { selectable: true } });
    const cb2 = trs(noKey.t)[0].querySelector('ui-checkbox');
    cb2.checked = true;
    change(cb2);
    noKey.t.rows = noKey.data.map((r) => ({ ...r }));
    expect(noKey.t.selection).toHaveLength(0);
  });

  it('clearSelection() limpia la selección', () => {
    const { t } = make({ attrs: { selectable: true, 'row-key': 'id' } });
    const cb = trs(t)[1].querySelector('ui-checkbox');
    cb.checked = true;
    change(cb);
    expect(t.selectedKeys).toEqual([2]);
    t.clearSelection();
    expect(t.selectedKeys).toEqual([]);
    expect(trs(t)[1].classList.contains('sel')).toBe(false);
  });
});

describe('ui-table · otros atributos', () => {
  it('loading marca aria-busy', () => {
    const { t } = make({ attrs: { loading: true } });
    const table = t.shadowRoot.querySelector('table');
    expect(table.getAttribute('aria-busy')).toBe('true');
    t.removeAttribute('loading');
    expect(table.getAttribute('aria-busy')).toBe('false');
  });

  it('manual-sort emite sort pero no reordena', () => {
    const { t } = make({ attrs: { 'manual-sort': true }, data: [makeRows()[1], makeRows()[0]] });
    const fn = vi.fn();
    t.addEventListener('sort', fn);
    click(t.shadowRoot.querySelector('.sort[data-key=name]'));
    expect(fn.mock.calls[0][0].detail).toEqual({ key: 'name', dir: 'asc' });
    expect(trs(t)[0].textContent).toContain('Beto'); // sin cambios
  });

  it('columnas hidden no se renderizan', () => {
    const { t } = make({ cols: [columns[0], { ...columns[1], hidden: true }, columns[2]] });
    expect(t.shadowRoot.querySelectorAll('thead th')).toHaveLength(2);
  });

  it('sortValue ordena por un valor distinto al mostrado', () => {
    const { t } = make({
      attrs: { 'sort-key': 'name', 'sort-dir': 'asc' },
      cols: [{ key: 'name', label: 'Nombre', sortable: true, sortValue: (r) => -r.score }, columns[1]],
    });
    expect(trs(t).map((r) => r.firstElementChild.textContent)).toEqual(['Ana', 'Carla', 'Beto']);
  });

  it('empty: texto personalizado y se oculta cuando hay filas', () => {
    const { t } = make({ attrs: { empty: 'Nada por aquí' }, data: [] });
    const empty = t.shadowRoot.querySelector('.empty');
    expect(t.shadowRoot.querySelector('.et').textContent).toBe('Nada por aquí');
    expect(empty.hidden).toBe(false);
    t.rows = makeRows();
    expect(empty.hidden).toBe(true);
  });
});
