import { define } from '../core/define.js';
import { styles } from './slider.styles.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

class UISlider extends Base {
  static formAssociated = true;
  static observedAttributes = ['value', 'min', 'max', 'step', 'disabled', 'label'];
  #internals;
  #root;
  #track;
  #thumb;
  #tip;
  #dragging = false;
  #start = 0;

  constructor() {
    super();
    this.#internals = this.attachInternals?.();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${styles}</style>
      <div class="root" part="root">
        <div class="track" part="track">
          <div class="fill" part="fill"></div>
          <div class="thumb" part="thumb" role="slider" tabindex="0">
            <span class="tip" part="tip"></span>
          </div>
        </div>
      </div>`;
    this.#root = root.querySelector('.root');
    this.#track = root.querySelector('.track');
    this.#thumb = root.querySelector('.thumb');
    this.#tip = root.querySelector('.tip');

    this.#root.addEventListener('pointerdown', (e) => {
      if (this.disabled || e.button !== 0) return;
      this.#dragging = true;
      this.#start = this.value;
      this.#root.setPointerCapture(e.pointerId);
      this.#root.classList.add('drag');
      this.#thumb.focus();
      this.#update(this.#fromPointer(e));
    });
    this.#root.addEventListener('pointermove', (e) => {
      if (this.#dragging) this.#update(this.#fromPointer(e));
    });
    const end = () => {
      if (!this.#dragging) return;
      this.#dragging = false;
      this.#root.classList.remove('drag');
      if (this.value !== this.#start) this.#emit('change');
    };
    this.#root.addEventListener('pointerup', end);
    this.#root.addEventListener('pointercancel', end);
    this.#thumb.addEventListener('keydown', this.#onKey);
  }

  #num(name, fallback) {
    const v = parseFloat(this.getAttribute(name));
    return Number.isFinite(v) ? v : fallback;
  }
  get min() { return this.#num('min', 0); }
  get max() { return Math.max(this.min, this.#num('max', 100)); }
  get step() { const s = this.#num('step', 1); return s > 0 ? s : 1; }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { this.toggleAttribute('disabled', !!v); }
  get value() { return this.#snap(this.#num('value', this.min)); }
  set value(v) { this.setAttribute('value', String(v)); }

  #snap(v) {
    const { min, max, step } = this;
    const decimals = (String(step).split('.')[1] || '').length;
    const n = Math.round((v - min) / step) * step + min;
    return +Math.min(max, Math.max(min, n)).toFixed(decimals);
  }

  #fromPointer(e) {
    const r = this.#track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    return this.min + ratio * (this.max - this.min);
  }

  #update(raw) {
    const n = this.#snap(raw);
    if (n === this.value) return;
    this.setAttribute('value', String(n));
    this.#emit('input');
  }

  #emit(type) {
    this.dispatchEvent(new CustomEvent(type, { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  #onKey = (e) => {
    const { step, min, max } = this;
    const moves = {
      ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step,
      PageUp: step * 10, PageDown: -step * 10,
    };
    let next;
    if (e.key in moves) next = this.value + moves[e.key];
    else if (e.key === 'Home') next = min;
    else if (e.key === 'End') next = max;
    else return;
    e.preventDefault();
    const before = this.value;
    this.#update(next);
    if (this.value !== before) this.#emit('change');
  };

  connectedCallback() { this.#render(); }

  attributeChangedCallback(name, _, v) {
    if (name === 'label') v ? this.#thumb.setAttribute('aria-label', v) : this.#thumb.removeAttribute('aria-label');
    this.#render();
  }

  #render() {
    const { min, max, value } = this;
    this.#root.style.setProperty('--p', max === min ? 0 : (value - min) / (max - min));
    this.#thumb.setAttribute('aria-valuemin', min);
    this.#thumb.setAttribute('aria-valuemax', max);
    this.#thumb.setAttribute('aria-valuenow', value);
    this.#thumb.setAttribute('aria-disabled', String(this.disabled));
    this.#thumb.tabIndex = this.disabled ? -1 : 0;
    this.#tip.textContent = value;
    this.#internals?.setFormValue(String(value));
  }
}

define('ui-slider', UISlider);
export { UISlider };
