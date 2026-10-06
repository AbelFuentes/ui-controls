import { define } from '../core/define.js';
import { styles } from './tabs.styles.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

class UITabs extends Base {
  static observedAttributes = ['value', 'label'];
  #list;
  #ind;
  #mo;
  #ro;
  #ready = false;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${styles}</style>
      <div class="list" part="list" role="tablist"><span class="ind" part="indicator"></span></div>
      <div class="panel" part="panel"><slot name="active"></slot></div>`;
    this.#list = root.querySelector('.list');
    this.#ind = root.querySelector('.ind');
    this.#mo = new MutationObserver(() => this.#build());
    this.#ro = new ResizeObserver(() => this.#place());

    this.#list.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b && !b.disabled) this.#commit(b.dataset.value);
    });
    this.#list.addEventListener('keydown', this.#onKey);
  }

  get #panels() { return [...this.querySelectorAll(':scope > [data-tab]')]; }
  get #buttons() { return [...this.#list.querySelectorAll('button')]; }

  get value() {
    const ok = this.#panels.filter((p) => !p.hasAttribute('data-disabled'));
    const attr = this.getAttribute('value');
    return (ok.find((p) => p.dataset.tab === attr) ?? ok[0])?.dataset.tab ?? '';
  }
  set value(v) { this.setAttribute('value', v); }

  connectedCallback() {
    this.#mo.observe(this, {
      childList: true,
      attributes: true, attributeFilter: ['data-tab', 'data-label', 'data-disabled'],
      subtree: true,
    });
    this.#ro.observe(this.#list);
    this.#build();
  }
  disconnectedCallback() {
    this.#mo.disconnect();
    this.#ro.disconnect();
  }

  attributeChangedCallback(name, _, v) {
    if (name === 'label') v ? this.#list.setAttribute('aria-label', v) : this.#list.removeAttribute('aria-label');
    else this.#paint();
  }

  #build() {
    this.#buttons.forEach((b) => b.remove());
    const buttons = this.#panels.map((p) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tab';
      b.part.add('tab');
      b.setAttribute('role', 'tab');
      b.dataset.value = p.dataset.tab;
      b.textContent = p.dataset.label || p.dataset.tab;
      b.disabled = p.hasAttribute('data-disabled');
      return b;
    });
    this.#list.append(...buttons);
    this.#paint();
  }

  #paint() {
    const cur = this.value;
    this.#buttons.forEach((b) => {
      const on = b.dataset.value === cur;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    this.#panels.forEach((p) => {
      const on = p.dataset.tab === cur;
      p.setAttribute('role', 'tabpanel');
      p.setAttribute('aria-label', p.dataset.label || p.dataset.tab);
      if (on) { p.slot = 'active'; p.tabIndex = 0; }
      else { p.removeAttribute('slot'); p.removeAttribute('tabindex'); }
    });
    this.#place();
  }

  #place() {
    const b = this.#buttons.find((x) => x.getAttribute('aria-selected') === 'true');
    this.#ind.style.opacity = b ? '1' : '0';
    if (!b) return;
    this.#list.style.setProperty('--x', `${b.offsetLeft}px`);
    this.#list.style.setProperty('--w', `${b.offsetWidth}px`);
    if (!this.#ready) {
      this.#ready = true; // sin animación en el primer pintado
      requestAnimationFrame(() => requestAnimationFrame(() => this.#list.classList.add('ready')));
    }
  }

  #commit(value) {
    if (value === this.value) return;
    this.setAttribute('value', value);
    this.dispatchEvent(new CustomEvent('change', { detail: { value }, bubbles: true, composed: true }));
  }

  #onKey = (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 };
    const btns = this.#buttons.filter((b) => !b.disabled);
    const i = btns.indexOf(e.target);
    if (i < 0) return;
    let next;
    if (e.key in step) next = btns[(i + step[e.key] + btns.length) % btns.length];
    else if (e.key === 'Home') next = btns[0];
    else if (e.key === 'End') next = btns.at(-1);
    else return;
    e.preventDefault();
    next.focus();
    this.#commit(next.dataset.value);
  };
}

define('ui-tabs', UITabs);
export { UITabs };
