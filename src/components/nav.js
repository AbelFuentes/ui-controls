import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const CHEV = '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
const filled = (slot) => slot.assignedNodes({ flatten: true }).some((n) => n.nodeType === 1 || n.textContent.trim());

/* ───────── ui-nav-item ───────── */
const itemCss = `
:host{display:block;font-size:var(--ui-nav-size,15px)}
:host([hidden]){display:none!important}
*{box-sizing:border-box}
[hidden]{display:none!important}
.item{all:unset;box-sizing:border-box;display:flex;align-items:center;gap:.75em;width:100%;padding:.6em .8em;border-radius:.75em;
  cursor:pointer;font-weight:500;line-height:1.3;color:inherit;opacity:.78;
  transition:background-color .2s,opacity .2s,color .2s}
.item:hover{opacity:1;background:color-mix(in srgb,currentColor 8%,transparent)}
.item:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:-.1em;opacity:1}
:host([active]) .item{opacity:1;font-weight:600;color:var(--ui-accent,#6366f1);
  background:color-mix(in srgb,var(--ui-accent,#6366f1) 12%,transparent)}
:host([disabled]) .item{opacity:.4;cursor:not-allowed;pointer-events:none}
.ico{display:grid;place-items:center;flex:none;width:1.3em;height:1.3em}
::slotted([slot=icon]){width:100%;height:100%}
.lbl{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.end{display:flex;align-items:center;gap:.4em;flex:none}
:host([orientation=horizontal]){display:inline-block}
:host([orientation=horizontal]) .item{width:auto}
:host([rail]) .lbl,:host([rail]) .end{display:none}
:host([rail]) .item{justify-content:center;padding:.65em}
@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}
`;

class UINavItem extends Base {
  static observedAttributes = ['href', 'target', 'disabled', 'active', 'rail', 'label'];
  #el = null;
  #key = '';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style>${itemCss}</style>`;
  }

  get active() { return this.hasAttribute('active'); }
  set active(v) { this.toggleAttribute('active', !!v); }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { this.toggleAttribute('disabled', !!v); }

  connectedCallback() { this.#render(); }
  attributeChangedCallback() { this.#render(); }
  focus(opts) { this.#el?.focus(opts); }

  #render() {
    const link = this.hasAttribute('href') && !this.disabled;
    const tag = link ? 'a' : 'button';
    const key = `${tag}|${link ? this.getAttribute('href') : ''}|${this.getAttribute('target') ?? ''}`;
    if (key !== this.#key) {
      this.#key = key;
      const el = document.createElement(tag);
      el.className = 'item';
      el.setAttribute('part', 'item');
      if (link) {
        el.href = this.getAttribute('href');
        const t = this.getAttribute('target');
        if (t) { el.target = t; el.rel = 'noopener noreferrer'; }
      } else el.type = 'button';
      el.innerHTML = '<span class="ico" part="icon" hidden><slot name="icon"></slot></span>'
        + '<span class="lbl" part="label"><slot></slot></span>'
        + '<span class="end" part="end"><slot name="end"></slot></span>';
      el.querySelector('slot[name=icon]').addEventListener('slotchange', () => this.#icon());
      if (this.#el) this.#el.replaceWith(el);
      else this.shadowRoot.append(el);
      this.#el = el;
      this.#icon();
    }
    const el = this.#el;
    if (el.localName === 'button') el.disabled = this.disabled;
    this.active ? el.setAttribute('aria-current', 'page') : el.removeAttribute('aria-current');
    const rail = this.hasAttribute('rail');
    const name = this.getAttribute('label') || (rail ? this.textContent.trim() : '');
    name ? el.setAttribute('aria-label', name) : el.removeAttribute('aria-label');
    rail && name ? el.setAttribute('title', name) : el.removeAttribute('title');
  }

  #icon() {
    const ico = this.#el?.querySelector('.ico');
    if (ico) ico.hidden = !filled(ico.querySelector('slot'));
  }
}

/* ───────── ui-nav-group ───────── */
const groupCss = `
:host{display:block;font-size:var(--ui-nav-size,15px)}
:host([hidden]){display:none!important}
*{box-sizing:border-box}
.hd{all:unset;box-sizing:border-box;display:flex;align-items:center;gap:.5em;width:100%;padding:.8em .8em .35em;
  font-size:.75em;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--ui-muted,inherit);cursor:default;
  pointer-events:none}
:host([collapsible]) .hd{cursor:pointer;pointer-events:auto;border-radius:.6em}
:host([collapsible]) .hd:hover{color:var(--ui-text,inherit)}
.hd:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:-.1em}
.chev{display:none;margin-left:auto;width:1.2em;height:1.2em;fill:none;stroke:currentColor;stroke-width:2.2;
  stroke-linecap:round;stroke-linejoin:round;transition:transform .3s}
:host([collapsible]) .chev{display:block}
:host([collapsible][collapsed]) .chev{transform:rotate(-90deg)}
.panel{display:grid;grid-template-rows:1fr;visibility:visible;transition:grid-template-rows .3s cubic-bezier(.4,0,.2,1)}
:host([collapsible][collapsed]) .panel{grid-template-rows:0fr;visibility:hidden;transition:grid-template-rows .3s cubic-bezier(.4,0,.2,1),visibility 0s .3s}
.inner{overflow:hidden;min-height:0;display:grid;gap:.1em}
:host([orientation=horizontal]) .inner{display:flex;flex-wrap:wrap}
:host([rail]) .hd{display:none}
:host([rail][collapsed]) .panel{grid-template-rows:1fr;visibility:visible}
@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}
`;

class UINavGroup extends Base {
  static observedAttributes = ['label', 'collapsible', 'collapsed', 'rail', 'orientation'];
  #hd; #t; #inner;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${groupCss}</style>
      <button class="hd" part="heading" type="button" aria-expanded="true"><span class="t"></span>${CHEV}</button>
      <div class="panel" part="panel"><div class="inner" role="group"><slot></slot></div></div>`;
    this.#hd = root.querySelector('.hd');
    this.#t = root.querySelector('.t');
    this.#inner = root.querySelector('.inner');
    root.querySelector('slot').addEventListener('slotchange', () => this.#sync());
    this.#hd.addEventListener('click', () => {
      if (!this.hasAttribute('collapsible')) return;
      this.toggleAttribute('collapsed');
      this.dispatchEvent(new CustomEvent('toggle', { detail: { collapsed: this.hasAttribute('collapsed') }, bubbles: true, composed: true }));
    });
  }

  connectedCallback() { this.#sync(); }
  attributeChangedCallback() { this.#sync(); }

  #sync() {
    const label = this.getAttribute('label') ?? '';
    const collapsible = this.hasAttribute('collapsible');
    this.#t.textContent = label;
    this.#hd.hidden = !label;
    this.#hd.tabIndex = collapsible ? 0 : -1;
    this.#hd.setAttribute('aria-expanded', String(!(collapsible && this.hasAttribute('collapsed'))));
    label ? this.#inner.setAttribute('aria-label', label) : this.#inner.removeAttribute('aria-label');
    const rail = this.hasAttribute('rail');
    const horiz = this.getAttribute('orientation') === 'horizontal';
    this.querySelectorAll('ui-nav-item').forEach((i) => {
      i.toggleAttribute('rail', rail);
      horiz ? i.setAttribute('orientation', 'horizontal') : i.removeAttribute('orientation');
    });
  }
}

/* ───────── ui-nav ───────── */
const navCss = `
:host{display:block}
:host([hidden]){display:none!important}
.nav{display:grid;gap:.1em}
:host([orientation=horizontal]) .nav{display:flex;flex-wrap:wrap;gap:.25rem}
`;

class UINav extends Base {
  static observedAttributes = ['label', 'orientation', 'rail', 'value'];
  #nav;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${navCss}</style><nav class="nav" part="nav"><slot></slot></nav>`;
    this.#nav = root.querySelector('nav');
    root.querySelector('slot').addEventListener('slotchange', () => this.#sync());
    this.addEventListener('click', (e) => {
      const it = e.target.closest?.('ui-nav-item');
      if (!it || !this.contains(it) || it.hasAttribute('disabled') || !it.hasAttribute('value')) return;
      const v = it.getAttribute('value');
      if (v === this.value) return;
      this.setAttribute('value', v);
      this.dispatchEvent(new CustomEvent('change', { detail: { value: v }, bubbles: true, composed: true }));
    });
  }

  get value() { return this.getAttribute('value') ?? ''; }
  set value(v) { this.setAttribute('value', String(v)); }

  connectedCallback() { this.#sync(); }

  attributeChangedCallback(name, _, v) {
    if (name === 'label') v ? this.#nav.setAttribute('aria-label', v) : this.#nav.removeAttribute('aria-label');
    this.#sync();
  }

  #sync() {
    const rail = this.hasAttribute('rail');
    const horiz = this.getAttribute('orientation') === 'horizontal';
    this.querySelectorAll('ui-nav-item, ui-nav-group').forEach((n) => {
      n.toggleAttribute('rail', rail);
      horiz ? n.setAttribute('orientation', 'horizontal') : n.removeAttribute('orientation');
    });
    if (this.hasAttribute('value')) {
      this.querySelectorAll('ui-nav-item[value]').forEach((i) => i.toggleAttribute('active', i.getAttribute('value') === this.value));
    }
  }
}

define('ui-nav-item', UINavItem);
define('ui-nav-group', UINavGroup);
define('ui-nav', UINav);
export { UINav, UINavGroup, UINavItem };
