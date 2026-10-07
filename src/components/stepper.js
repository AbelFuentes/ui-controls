import { define } from '../core/define.js';
import { styles } from './stepper.styles.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

class UIStepper extends Base {
  static observedAttributes = ['value', 'clickable', 'label'];
  #list;
  #mo;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${styles}</style><ol part="list"></ol>`;
    this.#list = root.querySelector('ol');
    this.#mo = new MutationObserver(() => this.#build());

    this.#list.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li || !li.firstElementChild.classList.contains('act')) return;
      this.#commit([...this.#list.children].indexOf(li) + 1);
    });
    this.#list.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList?.contains('hit')) {
        e.preventDefault();
        e.target.click();
      }
    });
  }

  get #items() { return [...this.querySelectorAll(':scope > li')]; }

  // 1..n = paso actual · n+1 = todos completados
  get value() {
    const n = this.#items.length;
    const v = parseInt(this.getAttribute('value'), 10);
    return Math.min(n + 1, Math.max(1, Number.isFinite(v) ? v : 1));
  }
  set value(v) { this.setAttribute('value', String(v)); }

  next() { this.#commit(this.value + 1); }
  prev() { this.#commit(this.value - 1); }

  connectedCallback() {
    this.#mo.observe(this, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ['data-description'],
    });
    this.#build();
  }
  disconnectedCallback() { this.#mo.disconnect(); }

  attributeChangedCallback(name, _, v) {
    if (name === 'label') v ? this.#list.setAttribute('aria-label', v) : this.#list.removeAttribute('aria-label');
    else this.#paint();
  }

  #build() {
    this.#list.replaceChildren(...this.#items.map((src, i) => {
      const li = document.createElement('li');
      li.setAttribute('part', 'step');
      li.innerHTML = `
        <span class="hit" part="hit">
          <span class="node" part="node">
            <span class="fill"></span>
            <span class="num">${i + 1}</span>
            <svg class="check" viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9"/></svg>
          </span>
          <span class="text">
            <span class="label" part="label"></span>
            <span class="desc" part="desc"></span>
          </span>
        </span>`;
      li.querySelector('.label').textContent = src.textContent.trim();
      const desc = li.querySelector('.desc');
      if (src.dataset.description) desc.textContent = src.dataset.description;
      else desc.remove();
      return li;
    }));
    this.#paint();
  }

  #paint() {
    const cur = this.value;
    const clickable = this.hasAttribute('clickable');
    [...this.#list.children].forEach((li, i) => {
      const n = i + 1;
      const state = n < cur ? 'done' : n === cur ? 'current' : 'upcoming';
      li.className = state;
      state === 'current' ? li.setAttribute('aria-current', 'step') : li.removeAttribute('aria-current');
      const hit = li.firstElementChild;
      const act = clickable && n <= cur;
      hit.classList.toggle('act', act);
      if (act) { hit.setAttribute('role', 'button'); hit.tabIndex = 0; }
      else { hit.removeAttribute('role'); hit.removeAttribute('tabindex'); }
    });
  }

  #commit(v) {
    const n = Math.min(this.#items.length + 1, Math.max(1, v));
    if (n === this.value) return;
    this.setAttribute('value', String(n));
    this.dispatchEvent(new CustomEvent('change', { detail: { value: n }, bubbles: true, composed: true }));
  }
}

define('ui-stepper', UIStepper);
export { UIStepper };
