import { define } from '../core/define.js';
import { styles } from './button.styles.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

class UIButton extends Base {
  static formAssociated = true;
  static observedAttributes = ['disabled', 'loading', 'label'];
  #internals;
  #btn;

  constructor() {
    super();
    this.#internals = this.attachInternals?.();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${styles}</style>
      <button class="btn" part="button" type="button">
        <span class="spin" aria-hidden="true"></span>
        <span class="content" part="content">
          <slot name="start"></slot><slot></slot><slot name="end"></slot>
        </span>
      </button>`;
    this.#btn = root.querySelector('button');
    this.#btn.addEventListener('click', (e) => {
      if (this.disabled || this.loading) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      const form = this.#internals?.form;
      if (this.type === 'submit') form?.requestSubmit();
      else if (this.type === 'reset') form?.reset();
    });
  }

  get type() { return this.getAttribute('type') ?? 'button'; }
  set type(v) { this.setAttribute('type', v); }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { this.toggleAttribute('disabled', !!v); }
  get loading() { return this.hasAttribute('loading'); }
  set loading(v) { this.toggleAttribute('loading', !!v); }

  focus(opts) { this.#btn.focus(opts); }

  attributeChangedCallback(name, _, v) {
    if (name === 'label') v ? this.#btn.setAttribute('aria-label', v) : this.#btn.removeAttribute('aria-label');
    this.#btn.disabled = this.disabled;
    this.#btn.setAttribute('aria-busy', String(this.loading));
  }
}

define('ui-button', UIButton);
export { UIButton };
