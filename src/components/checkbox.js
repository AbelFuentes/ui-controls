import { define } from '../core/define.js';
import { styles } from './checkbox.styles.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

class UICheckbox extends Base {
  static formAssociated = true;
  static observedAttributes = ['checked', 'indeterminate', 'disabled', 'label'];
  #btn;
  #internals;

  constructor() {
    super();
    this.#internals = this.attachInternals?.();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${styles}</style>
      <button class="root" part="root" role="checkbox" aria-checked="false">
        <span class="box" part="box">
          <span class="fill"></span>
          <svg viewBox="0 0 24 24">
            <path class="tick" d="M6 12.5l4 4 8-9"/>
            <path class="dash" d="M7 12h10"/>
          </svg>
        </span>
        <slot></slot>
      </button>`;
    this.#btn = root.querySelector('button');
    this.#btn.addEventListener('click', () => {
      if (this.disabled) return;
      this.indeterminate = false;
      this.checked = !this.checked;
      this.dispatchEvent(new CustomEvent('change', {
        detail: { checked: this.checked }, bubbles: true, composed: true,
      }));
    });
  }

  get checked() { return this.hasAttribute('checked'); }
  set checked(v) { this.toggleAttribute('checked', !!v); }
  get indeterminate() { return this.hasAttribute('indeterminate'); }
  set indeterminate(v) { this.toggleAttribute('indeterminate', !!v); }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { this.toggleAttribute('disabled', !!v); }

  connectedCallback() { this.#sync(); }

  attributeChangedCallback(name, _, v) {
    if (name === 'label') v ? this.#btn.setAttribute('aria-label', v) : this.#btn.removeAttribute('aria-label');
    if (name === 'disabled') this.#btn.disabled = this.disabled;
    this.#sync();
  }

  #sync() {
    this.#btn.setAttribute('aria-checked', this.indeterminate ? 'mixed' : String(this.checked));
    this.#internals?.setFormValue(this.checked ? (this.getAttribute('value') ?? 'on') : null);
  }
}

define('ui-checkbox', UICheckbox);
export { UICheckbox };
