import { define } from '../core/define.js';
import { styles } from './input.styles.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const PASS = ['disabled', 'readonly', 'required', 'maxlength', 'minlength', 'min', 'max', 'step',
  'pattern', 'autocomplete', 'inputmode'];
const EYE = '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>';
const EYE_OFF = '<path d="M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.4 6.5C3.8 8.1 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.2-1"/>';

class UIInput extends Base {
  static formAssociated = true;
  static observedAttributes = [...PASS, 'type', 'value', 'placeholder', 'label', 'hint', 'error'];
  #internals;
  #field;
  #input;
  #label;
  #msg;
  #eye;
  #touched = false;
  #shown = false;

  constructor() {
    super();
    this.#internals = this.attachInternals?.();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${styles}</style>
      <div class="field nolabel" part="field">
        <slot name="start"></slot>
        <div class="box">
          <input class="input" part="input" id="i" placeholder=" " />
          <label class="label" part="label" for="i"></label>
        </div>
        <button class="eye" part="toggle" type="button" aria-label="Mostrar contraseña" hidden>
          <svg viewBox="0 0 24 24">${EYE}</svg>
        </button>
        <slot name="end"></slot>
      </div>
      <div class="msg" part="message" id="m" aria-live="polite"></div>`;
    this.#field = root.querySelector('.field');
    this.#input = root.querySelector('input');
    this.#label = root.querySelector('label');
    this.#msg = root.querySelector('.msg');
    this.#eye = root.querySelector('.eye');

    this.#input.addEventListener('input', () => this.#sync());
    this.#input.addEventListener('change', () =>
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true })));
    this.#input.addEventListener('blur', () => { this.#touched = true; this.#refresh(); });
    this.#eye.addEventListener('click', () => {
      this.#shown = !this.#shown;
      this.#applyType();
      this.#eye.querySelector('svg').innerHTML = this.#shown ? EYE_OFF : EYE;
      this.#eye.setAttribute('aria-label', this.#shown ? 'Ocultar contraseña' : 'Mostrar contraseña');
      this.#input.focus();
    });
    this.addEventListener('invalid', () => { this.#touched = true; this.#refresh(); });
  }

  get value() { return this.#input.value; }
  set value(v) { this.#input.value = v ?? ''; this.#sync(); }
  get type() { return this.getAttribute('type') ?? 'text'; }
  set type(v) { this.setAttribute('type', String(v)); }
  get validity() { return this.#internals?.validity; }
  checkValidity() { return this.#internals?.checkValidity(); }
  reportValidity() { return this.#internals?.reportValidity(); }
  focus(opts) { this.#input.focus(opts); }
  select() { this.#input.select(); }

  connectedCallback() { this.#sync(); }

  attributeChangedCallback(name, _, v) {
    if (PASS.includes(name)) v === null ? this.#input.removeAttribute(name) : this.#input.setAttribute(name, v);
    else if (name === 'type') this.#applyType();
    else if (name === 'placeholder') this.#input.placeholder = v || ' ';
    else if (name === 'label') {
      this.#label.textContent = v ?? '';
      this.#field.classList.toggle('nolabel', !v);
    } else if (name === 'value') this.#input.value = v ?? '';
    this.#sync();
  }

  formResetCallback() {
    this.#input.value = this.getAttribute('value') ?? '';
    this.#touched = false;
    this.#sync();
  }
  formDisabledCallback(disabled) {
    this.#input.disabled = disabled || this.hasAttribute('disabled');
  }

  #applyType() {
    const t = this.type;
    const pw = t === 'password';
    this.#eye.hidden = !pw;
    this.#input.type = pw && this.#shown ? 'text' : t;
  }

  #sync() {
    const i = this.#input;
    const err = this.getAttribute('error');
    this.#internals?.setFormValue(i.value);
    if (err) this.#internals?.setValidity({ customError: true }, err, i);
    else if (!i.validity.valid) this.#internals?.setValidity(i.validity, i.validationMessage, i);
    else this.#internals?.setValidity({});
    this.#refresh();
  }

  #refresh() {
    const i = this.#input;
    const err = this.getAttribute('error') || (this.#touched && !i.validity.valid ? i.validationMessage : '');
    const text = err || this.getAttribute('hint') || '';
    this.#msg.textContent = text;
    this.#msg.classList.toggle('err', !!err);
    this.#field.classList.toggle('invalid', !!err);
    i.setAttribute('aria-invalid', String(!!err));
    text ? i.setAttribute('aria-describedby', 'm') : i.removeAttribute('aria-describedby');
  }
}

define('ui-input', UIInput);
export { UIInput };
