import { define } from '../core/define.js';
import './checkbox.js';
import './radio.js';
import './spinner.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const SORT = '<svg viewBox="0 0 24 24"><path class="u" d="M8 10l4-4 4 4"/><path class="d" d="M8 14l4 4 4-4"/></svg>';
// elementos que NO deben disparar rowclick al hacer click dentro de una celda
const SKIP = 'button, a[href], input, select, textarea, label, summary, [role=button], [role=checkbox], [role=switch], [contenteditable], ui-button, ui-checkbox, ui-input, ui-textarea, ui-select, ui-toggle, ui-radio, ui-radio-group, ui-segmented, ui-slider, ui-dropdown, .cb';
const CTL = '.cb > ui-checkbox, .cb > ui-radio';

const css = `
:host{display:block;font-size:var(--ui-table-size,15px)}
:host([hidden]){display:none!important}
*{box-sizing:border-box}
.box{position:relative}
.wrap{overflow:auto;max-height:var(--ui-table-max-height,none);border-radius:1.1em;background:var(--ui-surface,transparent);
  box-shadow:inset 0 0 0 1px var(--ui-border,color-mix(in srgb,currentColor 14%,transparent))}
table{width:100%;border-collapse:separate;border-spacing:0}
th,td{padding:.85em 1.1em;text-align:left;white-space:nowrap}
:host([compact]) th,:host([compact]) td{padding:.45em .85em}
thead th{position:sticky;top:0;z-index:1;font-size:.8em;font-weight:600;text-transform:uppercase;letter-spacing:.05em;
  color:var(--ui-muted,inherit);background:color-mix(in srgb,var(--ui-surface,Canvas) 94%,currentColor 6%);
  border-bottom:1px solid var(--ui-border,color-mix(in srgb,currentColor 14%,transparent))}
tbody td{border-bottom:1px solid var(--ui-border,color-mix(in srgb,currentColor 10%,transparent))}
tbody tr:last-child td{border-bottom:0}
tbody tr{transition:background-color .15s;outline:none}
tbody tr:hover{background:color-mix(in srgb,currentColor 5%,transparent)}
:host([striped]) tbody tr:nth-child(even){background:color-mix(in srgb,currentColor 3.5%,transparent)}
tbody tr.sel{background:color-mix(in srgb,var(--ui-accent,#6366f1) 11%,transparent)}
:host([clickable]) tbody tr{cursor:pointer}
:host([clickable]) tbody tr:hover{background:color-mix(in srgb,var(--ui-accent,#6366f1) 8%,transparent)}
:host([clickable]) tbody tr.sel:hover{background:color-mix(in srgb,var(--ui-accent,#6366f1) 16%,transparent)}
tbody tr:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:-.15em}
.cb{width:1%;padding-right:0}
.sort{all:unset;display:inline-flex;align-items:center;gap:.4em;cursor:pointer;font:inherit;text-transform:inherit;
  letter-spacing:inherit;color:inherit;border-radius:.4em}
.sort:hover{color:var(--ui-text,CanvasText)}
.sort:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.15em}
.sort svg{width:1.1em;height:1.1em;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.sort .u,.sort .d{opacity:.35;transition:opacity .2s}
th[aria-sort=ascending] .u,th[aria-sort=descending] .d{opacity:1;color:var(--ui-accent,#6366f1)}
th[aria-sort=ascending],th[aria-sort=descending]{color:var(--ui-text,CanvasText)}
.empty{padding:2.5em 1em;text-align:center;opacity:.55}
.busy{position:absolute;inset:0;z-index:2;display:none;place-items:center;border-radius:1.1em;
  background:color-mix(in srgb,var(--ui-surface,Canvas) 60%,transparent);backdrop-filter:blur(2px)}
:host([loading]) .busy{display:grid}
[hidden]{display:none!important}
@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}
`;

class UITable extends Base {
  static observedAttributes = [
    'selectable', 'clickable', 'empty', 'loading', 'label', 'max-height',
    'row-key', 'sort-key', 'sort-dir', 'manual-sort',
  ];
  #columns = [];
  #rows = [];
  #view = [];
  #sort = null;
  #sel = new Set();
  #tab = 0;
  #table; #head; #body; #empty; #et;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <div class="box">
        <div class="wrap" part="wrap">
          <table part="table"><thead part="head"></thead><tbody part="body"></tbody></table>
          <div class="empty" part="empty"><slot name="empty"><span class="et"></span></slot></div>
        </div>
        <div class="busy" part="busy" aria-hidden="true"><ui-spinner></ui-spinner></div>
      </div>`;
    this.#table = root.querySelector('table');
    this.#head = root.querySelector('thead');
    this.#body = root.querySelector('tbody');
    this.#empty = root.querySelector('.empty');
    this.#et = root.querySelector('.et');
    const wrap = root.querySelector('.wrap');

    // orden
    wrap.addEventListener('click', (e) => {
      const b = e.target.closest('.sort');
      if (!b) return;
      const key = b.dataset.key;
      const cur = this.#sort;
      this.#sort = !cur || cur.key !== key ? { key, dir: 'asc' } : cur.dir === 'asc' ? { key, dir: 'desc' } : null;
      this.#render();
      this.#head.querySelector(`[data-key="${key}"]`)?.focus();
      this.dispatchEvent(new CustomEvent('sort', {
        detail: { key: this.#sort?.key ?? null, dir: this.#sort?.dir ?? null }, bubbles: true, composed: true,
      }));
    });

    // selección
    wrap.addEventListener('change', (e) => {
      const ctl = e.target.closest?.(CTL);
      if (!ctl) return;
      e.stopPropagation();
      if (ctl.localName === 'ui-radio') {
        this.#sel = new Set([this.#id(this.#view[Number(ctl.dataset.i)])]);
      } else if (ctl.hasAttribute('data-all')) {
        this.#view.forEach((r) => (ctl.checked ? this.#sel.add(this.#id(r)) : this.#sel.delete(this.#id(r))));
      } else {
        const id = this.#id(this.#view[Number(ctl.dataset.i)]);
        ctl.checked ? this.#sel.add(id) : this.#sel.delete(id);
      }
      this.#syncSel();
      this.#emitSelect();
    });

    // click en fila
    wrap.addEventListener('click', (e) => {
      if (!this.hasAttribute('clickable')) return;
      const tr = e.target.closest('tbody tr');
      if (!tr || !this.#body.contains(tr)) return;
      if (e.target.closest(SKIP)) return;
      this.#emitRow([...this.#body.children].indexOf(tr));
    });

    // teclado en fila (solo con el foco en la fila misma)
    wrap.addEventListener('keydown', (e) => {
      const tr = e.target;
      if (tr.tagName !== 'TR' || !this.#body.contains(tr) || !this.hasAttribute('clickable')) return;
      const rows = [...this.#body.children];
      const i = rows.indexOf(tr);
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // Espacio no debe hacer scroll
        this.#emitRow(i);
        return;
      }
      const to = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1
        : e.key === 'Home' ? 0 : e.key === 'End' ? rows.length - 1 : null;
      if (to == null || !rows[to]) return;
      e.preventDefault();
      this.#setTab(to);
      rows[to].focus();
    });

    wrap.addEventListener('focusin', (e) => {
      if (!this.hasAttribute('clickable') || e.target.tagName !== 'TR' || !this.#body.contains(e.target)) return;
      this.#setTab([...this.#body.children].indexOf(e.target));
    });
  }

  /* ───────── API ───────── */
  get columns() { return this.#columns; }
  set columns(v) {
    this.#columns = Array.isArray(v) ? v : [];
    if (this.#sort && !this.#columns.some((c) => c.key === this.#sort.key)) this.#sort = null;
    this.#render();
  }

  get rows() { return this.#rows; }
  set rows(v) {
    this.#rows = Array.isArray(v) ? v : [];
    if (!this.getAttribute('row-key')) {
      const alive = new Set(this.#rows);
      this.#sel = new Set([...this.#sel].filter((r) => alive.has(r)));
    }
    this.#render();
  }

  get selection() { return this.#rows.filter((r) => this.#sel.has(this.#id(r))); }
  set selection(v) {
    this.#sel = new Set((Array.isArray(v) ? v : []).map((r) => this.#id(r)));
    this.#syncSel();
  }
  get selectedKeys() { return [...this.#sel]; }
  clearSelection() {
    this.#sel = new Set();
    this.#syncSel();
  }

  /* ───────── ciclo de vida ───────── */
  connectedCallback() {
    this.#readSort();
    this.#render();
    this.#syncBusy();
  }

  attributeChangedCallback(name, _, v) {
    if (name === 'label') {
      v ? this.#table.setAttribute('aria-label', v) : this.#table.removeAttribute('aria-label');
      return;
    }
    if (name === 'max-height') {
      v ? this.style.setProperty('--ui-table-max-height', v) : this.style.removeProperty('--ui-table-max-height');
      return;
    }
    if (name === 'loading') return this.#syncBusy();
    if (name === 'empty') return this.#syncEmpty();
    if (name === 'sort-key' || name === 'sort-dir') this.#readSort();
    this.#render();
  }

  /* ───────── internos ───────── */
  get #mode() {
    const v = this.getAttribute('selectable');
    return v === null ? null : v === 'single' ? 'single' : 'multiple';
  }
  get #cols() { return this.#columns.filter((c) => !c.hidden); }

  #id(row) {
    const k = this.getAttribute('row-key');
    return k && row != null ? row[k] : row;
  }

  #readSort() {
    const key = this.getAttribute('sort-key');
    this.#sort = key ? { key, dir: this.getAttribute('sort-dir') === 'desc' ? 'desc' : 'asc' } : null;
  }

  #sorted() {
    const rows = [...this.#rows];
    if (!this.#sort || this.hasAttribute('manual-sort')) return rows;
    const { key, dir } = this.#sort;
    const col = this.#columns.find((c) => c.key === key);
    const val = (r) => (col?.sortValue ? col.sortValue(r) : r[key]);
    return rows.sort((a, b) => {
      const x = val(a);
      const y = val(b);
      const r = typeof x === 'number' && typeof y === 'number'
        ? x - y
        : String(x ?? '').localeCompare(String(y ?? ''), undefined, { numeric: true });
      return dir === 'asc' ? r : -r;
    });
  }

  #setTab(i) {
    [...this.#body.children].forEach((r, k) => (r.tabIndex = k === i ? 0 : -1));
    this.#tab = i;
  }

  #emitRow(index) {
    const row = this.#view[index];
    if (!row) return;
    this.dispatchEvent(new CustomEvent('rowclick', { detail: { row, index }, bubbles: true, composed: true }));
  }

  #emitSelect() {
    this.dispatchEvent(new CustomEvent('select', {
      detail: { rows: this.selection, keys: this.selectedKeys }, bubbles: true, composed: true,
    }));
  }

  #render() {
    const mode = this.#mode;
    const clickable = this.hasAttribute('clickable');
    const cols = this.#cols;
    this.#view = this.#sorted();

    const head = document.createElement('tr');
    if (mode) {
      const th = document.createElement('th');
      th.className = 'cb';
      if (mode === 'multiple') th.innerHTML = '<ui-checkbox data-all label="Seleccionar todo"></ui-checkbox>';
      head.append(th);
    }
    cols.forEach((c) => {
      const th = document.createElement('th');
      th.scope = 'col';
      if (c.align) th.style.textAlign = c.align;
      if (c.width) th.style.width = c.width;
      if (c.sortable) {
        const dir = this.#sort?.key === c.key ? this.#sort.dir : null;
        th.setAttribute('aria-sort', dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none');
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'sort';
        b.dataset.key = c.key;
        b.innerHTML = `<span></span>${SORT}`;
        b.firstChild.textContent = c.label ?? c.key;
        th.append(b);
      } else th.textContent = c.label ?? c.key;
      head.append(th);
    });
    this.#head.replaceChildren(head);

    const stop = Math.max(0, Math.min(this.#tab, this.#view.length - 1));
    this.#body.replaceChildren(...this.#view.map((row, i) => {
      const r = document.createElement('tr');
      if (clickable) r.tabIndex = i === stop ? 0 : -1;
      if (mode) {
        const td = document.createElement('td');
        td.className = 'cb';
        td.innerHTML = mode === 'multiple'
          ? `<ui-checkbox data-i="${i}" label="Seleccionar fila"></ui-checkbox>`
          : `<ui-radio data-i="${i}" label="Seleccionar fila"></ui-radio>`;
        r.append(td);
      }
      cols.forEach((c) => {
        const td = document.createElement('td');
        if (c.align) td.style.textAlign = c.align;
        const v = c.render ? c.render(row) : row[c.key];
        v instanceof Node ? td.append(v) : (td.textContent = v ?? '');
        r.append(td);
      });
      return r;
    }));

    this.#syncEmpty();
    this.#syncSel();
  }

  #syncEmpty() {
    this.#et.textContent = this.getAttribute('empty') ?? 'Sin datos';
    this.#empty.hidden = this.#rows.length > 0 || this.hasAttribute('loading');
  }

  #syncBusy() {
    this.#table.setAttribute('aria-busy', String(this.hasAttribute('loading')));
    this.#syncEmpty();
  }

  #syncSel() {
    let n = 0;
    [...this.#body.children].forEach((tr, i) => {
      const on = this.#sel.has(this.#id(this.#view[i]));
      if (on) n++;
      tr.classList.toggle('sel', on);
      const c = tr.querySelector(CTL);
      if (c) c.checked = on;
    });
    const all = this.#head.querySelector('[data-all]');
    if (all) {
      all.checked = n > 0 && n === this.#view.length;
      all.indeterminate = n > 0 && n < this.#view.length;
    }
  }
}

define('ui-table', UITable);
export { UITable };
