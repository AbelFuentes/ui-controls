import { define } from '../core/define.js';
import { styles } from './toggle.styles.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

class UIToggle extends Base {
  static formAssociated = true;
  static observedAttributes = ['checked', 'disabled', 'label'];
  #btn;
  #internals;

  constructor() {
    super();
    this.#internals = this.attachInternals?.();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${styles}</style>
      <button class="track" part="track" role="switch" aria-checked="false">
        <span class="fill"></span>
        <span class="thumb" part="thumb">
          <svg class="check" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.8"/></svg>
        </span>
      </button>`;
    this.#btn = root.querySelector('button');
    this.#btn.addEventListener('click', () => {
      if (this.disabled) return;
      this.checked = !this.checked;
      this.dispatchEvent(new CustomEvent('change', {
        detail: { checked: this.checked }, bubbles: true, composed: true,
      }));
    });
  }

  get checked() { return this.hasAttribute('checked'); }
  set checked(v) { this.toggleAttribute('checked', !!v); }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { this.toggleAttribute('disabled', !!v); }

  connectedCallback() { this.#sync(); }

  attributeChangedCallback(name, _, v) {
    if (name === 'label') v ? this.#btn.setAttribute('aria-label', v) : this.#btn.removeAttribute('aria-label');
    if (name === 'disabled') this.#btn.disabled = this.disabled;
    this.#sync();
  }

  #sync() {
    this.#btn.setAttribute('aria-checked', String(this.checked));
    this.#internals?.setFormValue(this.checked ? (this.getAttribute('value') ?? 'on') : null);
  }
}

define('ui-toggle', UIToggle);
export { UIToggle };
