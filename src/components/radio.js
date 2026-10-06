import { define } from '../core/define.js';
import { styles } from './radio.styles.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

class UIRadio extends Base {
  static observedAttributes = ['checked', 'disabled', 'label'];
  #btn;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${styles}</style>
      <button class="root" part="root" role="radio" aria-checked="false">
        <span class="circle" part="circle">
          <span class="fill"></span>
          <span class="dot"></span>
        </span>
        <slot></slot>
      </button>`;
    this.#btn = root.querySelector('button');
    this.#btn.addEventListener('click', () => {
      if (this.disabled || this.checked) return;
      this.checked = true;
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: this.value }, bubbles: true, composed: true,
      }));
    });
  }

  get value() { return this.getAttribute('value') ?? ''; }
  set value(v) { this.setAttribute('value', v); }
  get checked() { return this.hasAttribute('checked'); }
  set checked(v) { this.toggleAttribute('checked', !!v); }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { this.toggleAttribute('disabled', !!v); }

  set tabStop(v) { this.#btn.tabIndex = v ? 0 : -1; } // lo usa el grupo (roving tabindex)
  focus(opts) { this.#btn.focus(opts); }

  connectedCallback() { this.#sync(); }

  attributeChangedCallback(name, _, v) {
    if (name === 'label') v ? this.#btn.setAttribute('aria-label', v) : this.#btn.removeAttribute('aria-label');
    if (name === 'disabled') this.#btn.disabled = this.disabled;
    this.#sync();
  }

  #sync() {
    this.#btn.setAttribute('aria-checked', String(this.checked));
  }
}

define('ui-radio', UIRadio);
export { UIRadio };
