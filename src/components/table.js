import { define } from '../core/define.js';
import './checkbox.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const SORT = '<svg viewBox="0 0 24 24"><path class="u" d="M8 10l4-4 4 4"/><path class="d" d="M8 14l4 4 4-4"/></svg>';
const css = `
:host{display:block;font-size:var(--ui-table-size,15px)}
:host([hidden]){display:none!important}
*{box-sizing:border-box}
.wrap{overflow:auto;max-height:var(--ui-table-max-height,none);border-radius:1.1em;background:var(--ui-surface,transparent);
  box-shadow:inset 0 0 0 1px var(--ui-border,color-mix(in srgb,currentColor 14%,transparent))}
table{width:100%;border-collapse:separate;border-spacing:0}
th,td{padding:.85em 1.1em;text-align:left;white-space:nowrap}
thead th{position:sticky;top:0;z-index:1;font-size:.8em;font-weight:600;text-transform:uppercase;letter-spacing:.05em;
  color:var(--ui-muted,inherit);background:color-mix(in srgb,var(--ui-surface,Canvas) 94%,currentColor 6%);
  border-bottom:1px solid var(--ui-border,color-mix(in srgb,currentColor 14%,transparent))}
tbody td{border-bottom:1px solid var(--ui-border,color-mix(in srgb,currentColor 10%,transparent))}
tbody tr:last-child td{border-bottom:0}
tbody tr{transition:background-color .15s}
tbody tr:hover{background:color-mix(in srgb,currentColor 5%,transparent)}
:host([striped]) tbody tr:nth-child(even){background:color-mix(in srgb,currentColor 3.5%,transparent)}
tbody tr.sel{background:color-mix(in srgb,var(--ui-accent,#6366f1) 11%,transparent)}
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
[hidden]{display:none!important}
@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}
`;

class UITable extends Base {
  static observedAttributes = ['selectable', 'empty'];
  #columns = [];
  #rows = [];
  #view = [];
  #sort = null;
  #sel = new Set();
  #head; #body; #empty;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <div class="wrap" part="wrap">
        <table part="table"><thead part="head"></thead><tbody part="body"></tbody></table>
        <div class="empty" part="empty"></div>
      </div>`;
    this.#head = root.querySelector('thead');
    this.#body = root.querySelector('tbody');
    this.#empty = root.querySelector('.empty');
    const wrap = root.querySelector('.wrap');

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

    wrap.addEventListener('change', (e) => {
      const cb = e.target.closest?.('ui-checkbox');
      if (!cb) return;
      e.stopPropagation();
      if (cb.hasAttribute('data-all')) this.#view.forEach((r) => (cb.checked ? this.#sel.add(r) : this.#sel.delete(r)));
      else {
        const r = this.#view[Number(cb.dataset.i)];
        cb.checked ? this.#sel.add(r) : this.#sel.delete(r);
      }
      this.#syncSel();
      this.dispatchEvent(new CustomEvent('select', { detail: { rows: this.selection }, bubbles: true, composed: true }));
    });
  }

  get columns() { return this.#columns; }
  set columns(v) { this.#columns = Array.isArray(v) ? v : []; this.#sort = null; this.#render(); }
  get rows() { return this.#rows; }
  set rows(v) {
    this.#rows = Array.isArray(v) ? v : [];
    this.#sel = new Set([...this.#sel].filter((r) => this.#rows.includes(r)));
    this.#render();
  }
  get selection() { return this.#rows.filter((r) => this.#sel.has(r)); }

  connectedCallback() { this.#render(); }
  attributeChangedCallback() { this.#render(); }

  #sorted() {
    if (!this.#sort) return [...this.#rows];
    const { key, dir } = this.#sort;
    return [...this.#rows].sort((a, b) => {
      const x = a[key];
      const y = b[key];
      const r = typeof x === 'number' && typeof y === 'number'
        ? x - y
        : String(x ?? '').localeCompare(String(y ?? ''), undefined, { numeric: true });
      return dir === 'asc' ? r : -r;
    });
  }

  #render() {
    const sel = this.hasAttribute('selectable');
    this.#view = this.#sorted();

    const tr = document.createElement('tr');
    if (sel) {
      const th = document.createElement('th');
      th.className = 'cb';
      th.innerHTML = '<ui-checkbox data-all label="Seleccionar todo"></ui-checkbox>';
      tr.append(th);
    }
    this.#columns.forEach((c) => {
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
      tr.append(th);
    });
    this.#head.replaceChildren(tr);

    this.#body.replaceChildren(...this.#view.map((row, i) => {
      const r = document.createElement('tr');
      if (sel) {
        const td = document.createElement('td');
        td.className = 'cb';
        td.innerHTML = `<ui-checkbox data-i="${i}" label="Seleccionar fila"></ui-checkbox>`;
        r.append(td);
      }
      this.#columns.forEach((c) => {
        const td = document.createElement('td');
        if (c.align) td.style.textAlign = c.align;
        const v = c.render ? c.render(row) : row[c.key];
        v instanceof Node ? td.append(v) : (td.textContent = v ?? '');
        r.append(td);
      });
      return r;
    }));

    this.#empty.textContent = this.getAttribute('empty') ?? 'Sin datos';
    this.#empty.hidden = this.#rows.length > 0;
    this.#syncSel();
  }

  #syncSel() {
    const rows = [...this.#body.children];
    let n = 0;
    rows.forEach((tr, i) => {
      const on = this.#sel.has(this.#view[i]);
      if (on) n++;
      tr.classList.toggle('sel', on);
      const cb = tr.querySelector('ui-checkbox');
      if (cb) cb.checked = on;
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
