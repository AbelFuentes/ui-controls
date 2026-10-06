import { define } from '../core/define.js';
import { styles } from './radio-group.styles.js';
import './radio.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const val = (r) => r.getAttribute('value') ?? '';

class UIRadioGroup extends Base {
  static formAssociated = true;
  static observedAttributes = ['value', 'label'];
  #internals;

  constructor() {
    super();
    this.#internals = this.attachInternals?.();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${styles}</style><slot></slot>`;
    root.querySelector('slot').addEventListener('slotchange', () => this.#sync());
    this.addEventListener('change', this.#onChange);
    this.addEventListener('keydown', this.#onKey);
  }

  get #radios() { return [...this.querySelectorAll('ui-radio')]; }

  get value() {
    const r = this.#radios.find((x) => x.hasAttribute('checked'));
    return r ? val(r) : '';
  }
  set value(v) { this.setAttribute('value', v); }

  connectedCallback() {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'radiogroup');
    this.#sync();
  }

  attributeChangedCallback(name, _, v) {
    if (name === 'value') this.#select(v ?? '');
    if (name === 'label') v ? this.setAttribute('aria-label', v) : this.removeAttribute('aria-label');
  }

  #sync() {
    const attr = this.getAttribute('value');
    attr !== null ? this.#select(attr) : this.#roving();
  }

  #select(value) {
    this.#radios.forEach((r) => r.toggleAttribute('checked', val(r) === value));
    this.#roving();
  }

  #roving() {
    const enabled = this.#radios.filter((r) => !r.hasAttribute('disabled'));
    const current = enabled.find((r) => r.hasAttribute('checked')) ?? enabled[0];
    this.#radios.forEach((r) => r.setAttribute('roving', r === current ? '0' : '-1'));
    this.#internals?.setFormValue(this.value || null);
  }

  #commit(value) {
    this.setAttribute('value', value);
    this.#select(value);
    this.dispatchEvent(new CustomEvent('change', { detail: { value }, bubbles: true, composed: true }));
  }

  #onChange = (e) => {
    const radio = e.target.closest?.('ui-radio');
    if (!radio) return;
    e.stopPropagation(); // el grupo emite su propio change
    this.#commit(val(radio));
  };

  #onKey = (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    const radios = this.#radios.filter((r) => !r.hasAttribute('disabled'));
    const i = radios.indexOf(e.target.closest?.('ui-radio'));
    if (i < 0) return;
    let next;
    if (e.key in step) next = radios[(i + step[e.key] + radios.length) % radios.length];
    else if (e.key === 'Home') next = radios[0];
    else if (e.key === 'End') next = radios.at(-1);
    else return;
    e.preventDefault();
    next.focus();
    if (val(next) !== this.value) this.#commit(val(next));
  };
}

define('ui-radio-group', UIRadioGroup);
export { UIRadioGroup };
