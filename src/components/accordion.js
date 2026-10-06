import { define } from '../core/define.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const css = `
:host{display:block;font-size:var(--ui-accordion-size,16px)}
:host([hidden]){display:none!important}
*{box-sizing:border-box}
.list{border-radius:1.1em;overflow:hidden;background:var(--ui-surface,transparent);
  box-shadow:inset 0 0 0 1px var(--ui-border,color-mix(in srgb,currentColor 14%,transparent))}
.item+.item{border-top:1px solid var(--ui-border,color-mix(in srgb,currentColor 14%,transparent))}
h3{margin:0;font:inherit}
.hd{all:unset;box-sizing:border-box;display:flex;align-items:center;gap:1em;width:100%;padding:1.1em 1.25em;cursor:pointer;
  font-weight:600;line-height:1.3;transition:background-color .2s}
.hd:hover{background:color-mix(in srgb,currentColor 5%,transparent)}
.hd:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:-.15em}
.hd[aria-disabled=true]{opacity:.4;cursor:not-allowed}
.chev{margin-left:auto;flex:none;width:1.2em;height:1.2em;fill:none;stroke:currentColor;stroke-width:2;
  stroke-linecap:round;stroke-linejoin:round;opacity:.6;transition:transform .35s cubic-bezier(.34,1.4,.5,1),color .2s}
.open .chev{transform:rotate(180deg);color:var(--ui-accent,#6366f1);opacity:1}
.panel{display:grid;grid-template-rows:0fr;visibility:hidden;
  transition:grid-template-rows .35s cubic-bezier(.4,0,.2,1),visibility 0s .35s}
.open .panel{grid-template-rows:1fr;visibility:visible;transition-delay:0s}
.inner{overflow:hidden;min-height:0}
.content{padding:0 1.25em 1.2em;line-height:1.6;opacity:.85}
@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}
`;

class UIAccordion extends Base {
  #list; #mo;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${css}</style><div class="list" part="list"></div>`;
    this.#list = root.querySelector('.list');
    this.#list.addEventListener('click', (e) => {
      const b = e.target.closest('.hd');
      if (b) this.#toggle(this.#headers.indexOf(b));
    });
    this.#list.addEventListener('keydown', (e) => {
      const hs = this.#headers.filter((h) => h.getAttribute('aria-disabled') !== 'true');
      const i = hs.indexOf(e.target);
      if (i < 0) return;
      let n;
      if (e.key === 'ArrowDown') n = hs[(i + 1) % hs.length];
      else if (e.key === 'ArrowUp') n = hs[(i - 1 + hs.length) % hs.length];
      else if (e.key === 'Home') n = hs[0];
      else if (e.key === 'End') n = hs.at(-1);
      else return;
      e.preventDefault();
      n.focus();
    });
    this.#mo = new MutationObserver((recs) =>
      recs.some((r) => r.target === this && r.type === 'childList') ? this.#build() : this.#paint());
  }

  get #items() { return [...this.children]; }
  get #headers() { return [...this.#list.querySelectorAll('.hd')]; }

  connectedCallback() {
    this.#mo.observe(this, { childList: true, subtree: true, attributes: true,
      attributeFilter: ['open', 'data-title', 'data-disabled'] });
    this.#build();
  }
  disconnectedCallback() { this.#mo.disconnect(); }

  #build() {
    this.#list.replaceChildren(...this.#items.map((p, i) => {
      p.slot = `p${i}`;
      const div = document.createElement('div');
      div.className = 'item';
      div.part.add('item');
      div.innerHTML = `
        <h3><button class="hd" part="header" type="button" id="h${i}" aria-controls="r${i}" aria-expanded="false">
          <span class="t"></span>
          <svg class="chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
        </button></h3>
        <div class="panel" id="r${i}" role="region" aria-labelledby="h${i}">
          <div class="inner"><div class="content" part="content"><slot name="p${i}"></slot></div></div>
        </div>`;
      return div;
    }));
    this.#paint();
  }

  #paint() {
    const items = this.#items;
    [...this.#list.children].forEach((div, i) => {
      const p = items[i];
      if (!p) return;
      const open = p.hasAttribute('open');
      const b = div.querySelector('.hd');
      div.classList.toggle('open', open);
      b.setAttribute('aria-expanded', String(open));
      p.hasAttribute('data-disabled') ? b.setAttribute('aria-disabled', 'true') : b.removeAttribute('aria-disabled');
      div.querySelector('.t').textContent = p.dataset.title || `Item ${i + 1}`;
    });
  }

  #toggle(i) {
    const items = this.#items;
    const p = items[i];
    if (!p || p.hasAttribute('data-disabled')) return;
    const open = !p.hasAttribute('open');
    if (open && !this.hasAttribute('multiple')) items.forEach((o) => o !== p && o.removeAttribute('open'));
    p.toggleAttribute('open', open);
    this.#paint();
    this.dispatchEvent(new CustomEvent('change', { detail: { index: i, open }, bubbles: true, composed: true }));
  }
}

define('ui-accordion', UIAccordion);
export { UIAccordion };
