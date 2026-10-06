import { define } from '../core/define.js';
import { styles } from './segmented.styles.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

class UISegmented extends Base {
  static formAssociated = true;
  static observedAttributes = ['value', 'disabled', 'label'];
  #internals;
  #track;
  #pill;
  #mo;
  #ro;
  #ready = false;

  constructor() {
    super();
    this.#internals = this.attachInternals?.();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${styles}</style>
      <div class="track" part="track" role="radiogroup">
        <span class="pill" part="pill"></span>
      </div>`;
    this.#track = root.querySelector('.track');
    this.#pill = root.querySelector('.pill');
    this.#track.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b && !b.disabled) this.#commit(b.dataset.value);
    });
    this.#track.addEventListener('keydown', this.#onKey);
    this.#mo = new MutationObserver(() => this.#render());
    this.#ro = new ResizeObserver(() => this.#place());
  }

  get #options() { return [...this.querySelectorAll('option')]; }

  get value() { return this.#current(this.#options); }
  set value(v) { this.setAttribute('value', v); }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { this.toggleAttribute('disabled', !!v); }

  connectedCallback() {
    this.#mo.observe(this, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ['value', 'disabled'],
    });
    this.#ro.observe(this.#track);
    this.#render();
  }

  disconnectedCallback() {
    this.#mo.disconnect();
    this.#ro.disconnect();
  }

  attributeChangedCallback(name, _, v) {
    if (name === 'label') v ? this.#track.setAttribute('aria-label', v) : this.#track.removeAttribute('aria-label');
    else this.#render();
  }

  #current(opts) {
    const attr = this.getAttribute('value');
    const o = opts.find((x) => x.value === attr) ?? opts.find((x) => !x.disabled);
    return o ? o.value : '';
  }

  #render() {
    const opts = this.#options;
    const cur = this.#current(opts);
    const focused = this.shadowRoot.activeElement?.dataset?.value;

    this.#track.querySelectorAll('button').forEach((b) => b.remove());
    const buttons = opts.map((o) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt';
      b.part.add('option');
      b.setAttribute('role', 'radio');
      b.dataset.value = o.value;
      b.textContent = o.textContent.trim();
      b.disabled = o.disabled || this.disabled;
      b.setAttribute('aria-checked', String(o.value === cur));
      b.tabIndex = o.value === cur ? 0 : -1;
      return b;
    });
    this.#track.append(...buttons);
    if (focused !== undefined) buttons.find((b) => b.dataset.value === focused)?.focus();

    this.#internals?.setFormValue(cur || null);
    this.#place();
  }

  #place() {
    const b = this.#track.querySelector('[aria-checked=true]');
    this.#pill.style.opacity = b ? '1' : '0';
    if (!b) return;
    this.#track.style.setProperty('--x', `${b.offsetLeft}px`);
    this.#track.style.setProperty('--w', `${b.offsetWidth}px`);
    if (!this.#ready) {
      this.#ready = true; // sin animación en el primer pintado
      requestAnimationFrame(() => requestAnimationFrame(() => this.#track.classList.add('ready')));
    }
  }

  #commit(value) {
    if (value === this.value) return;
    this.setAttribute('value', value);
    this.dispatchEvent(new CustomEvent('change', { detail: { value }, bubbles: true, composed: true }));
  }

  #onKey = (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    const btns = [...this.#track.querySelectorAll('button:not(:disabled)')];
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

define('ui-segmented', UISegmented);
export { UISegmented };
