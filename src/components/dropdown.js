import { define } from '../core/define.js';
import { place } from '../core/position.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:inline-block;font-size:var(--ui-dropdown-size,15px)}
:host([hidden]){display:none!important}
*{box-sizing:border-box}
.menu{position:fixed;inset:auto;margin:0;padding:.35em;min-width:12em;max-width:min(24em,92vw);
  max-height:min(24em,70dvh);overflow:auto;border:0;border-radius:.95em;
  background:var(--ui-surface,Canvas);color:var(--ui-text,CanvasText);
  box-shadow:0 0 0 1px color-mix(in srgb,currentColor 14%,transparent),0 1em 2.5em rgb(0 0 0/.3)}
.menu:popover-open{animation:in .18s cubic-bezier(.2,.9,.3,1.2)}
@keyframes in{from{opacity:0;transform:scale(.96) translateY(-.3em)}}
.item{all:unset;box-sizing:border-box;display:flex;align-items:center;gap:1em;width:100%;padding:.6em .8em;
  border-radius:.6em;cursor:pointer;line-height:1.2;white-space:nowrap}
.item:hover,.item:focus-visible{background:color-mix(in srgb,var(--ui-accent,#6366f1) 14%,transparent)}
.item[aria-disabled=true]{opacity:.4;cursor:not-allowed;pointer-events:none}
.item.danger{color:var(--ui-danger,#ef4444)}
.item.danger:hover,.item.danger:focus-visible{background:color-mix(in srgb,var(--ui-danger,#ef4444) 14%,transparent)}
.kbd{margin-left:auto;opacity:.5;font-size:.85em}
.sep{height:1px;margin:.35em .3em;background:color-mix(in srgb,currentColor 12%,transparent)}
@media (prefers-reduced-motion:reduce){.menu{animation:none!important}}
`;

class UIDropdown extends Base {
  #slot; #menu; #mo;
  #isOpen = false;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${css}</style>
      <slot name="trigger"></slot>
      <div class="menu" part="menu" popover="manual" role="menu"></div>`;
    this.#slot = root.querySelector('slot');
    this.#menu = root.querySelector('.menu');

    this.#slot.addEventListener('slotchange', () => this.#aria());
    this.#slot.addEventListener('click', () => this.toggle());
    this.#slot.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); this.open(); }
    });
    this.#menu.addEventListener('keydown', this.#onKey);
    this.#menu.addEventListener('click', (e) => {
      const b = e.target.closest('.item');
      if (b && b.getAttribute('aria-disabled') !== 'true') this.#choose(b);
    });
    this.#mo = new MutationObserver((recs) => {
      const hit = recs.some((r) => {
        const el = r.target.nodeType === 1 ? r.target : r.target.parentElement;
        return el === this || el?.tagName === 'OPTION';
      });
      if (hit) this.#build();
    });
  }

  get #trigger() { return this.#slot.assignedElements({ flatten: true })[0]; }

  connectedCallback() {
    this.#mo.observe(this, { childList: true, subtree: true, characterData: true, attributes: true });
    this.#build();
    this.#aria();
  }
  disconnectedCallback() {
    this.#mo.disconnect();
    this.#unlisten();
  }

  toggle() { this.#isOpen ? this.close() : this.open(); }

  open() {
    if (this.#isOpen || this.hasAttribute('disabled')) return;
    this.#isOpen = true;
    this.#menu.showPopover();
    this.#place();
    this.#trigger?.setAttribute('aria-expanded', 'true');
    document.addEventListener('pointerdown', this.#onDoc, true);
    addEventListener('resize', this.#place);
    addEventListener('scroll', this.#place, true);
    this.#menu.querySelector('.item:not([aria-disabled=true])')?.focus();
  }

  close(refocus = true) {
    if (!this.#isOpen) return;
    this.#isOpen = false;
    this.#menu.hidePopover();
    this.#trigger?.setAttribute('aria-expanded', 'false');
    this.#unlisten();
    if (refocus) this.#trigger?.focus();
  }

  #unlisten() {
    document.removeEventListener('pointerdown', this.#onDoc, true);
    removeEventListener('resize', this.#place);
    removeEventListener('scroll', this.#place, true);
  }

  #place = () => {
    const t = this.#trigger;
    if (t && this.#isOpen) place(this.#menu, t, this.getAttribute('placement') || 'bottom-start');
  };

  #onDoc = (e) => { if (!e.composedPath().includes(this)) this.close(false); };

  #aria() {
    const t = this.#trigger;
    if (!t) return;
    t.setAttribute('aria-haspopup', 'menu');
    t.setAttribute('aria-expanded', String(this.#isOpen));
  }

  #build() {
    const mk = (tag, cls) => Object.assign(document.createElement(tag), { className: cls });
    this.#menu.replaceChildren(...[...this.querySelectorAll('option')].map((o) => {
      if (o.hasAttribute('data-separator')) {
        const s = mk('div', 'sep');
        s.setAttribute('role', 'separator');
        return s;
      }
      const b = mk('button', 'item');
      b.type = 'button';
      b.tabIndex = -1;
      b.setAttribute('part', 'item');
      b.setAttribute('role', 'menuitem');
      b.dataset.value = o.value || o.textContent.trim();
      const t = document.createElement('span');
      t.textContent = o.textContent.trim();
      b.append(t);
      if (o.dataset.shortcut) {
        const k = mk('span', 'kbd');
        k.textContent = o.dataset.shortcut;
        b.append(k);
      }
      if (o.hasAttribute('data-danger')) b.classList.add('danger');
      if (o.disabled) b.setAttribute('aria-disabled', 'true');
      return b;
    }));
  }

  #choose(btn) {
    this.close();
    this.dispatchEvent(new CustomEvent('select', { detail: { value: btn.dataset.value }, bubbles: true, composed: true }));
  }

  #onKey = (e) => {
    const items = [...this.#menu.querySelectorAll('.item:not([aria-disabled=true])')];
    const i = items.indexOf(this.shadowRoot.activeElement);
    let next;
    if (e.key === 'ArrowDown') next = items[(i + 1) % items.length];
    else if (e.key === 'ArrowUp') next = items[(i < 0 ? 0 : i) - 1 < 0 ? items.length - 1 : i - 1];
    else if (e.key === 'Home') next = items[0];
    else if (e.key === 'End') next = items.at(-1);
    else if (e.key === 'Escape') { e.preventDefault(); return this.close(); }
    else if (e.key === 'Tab') return this.close(false);
    else return;
    e.preventDefault();
    next?.focus();
  };
}

define('ui-dropdown', UIDropdown);
export { UIDropdown };
