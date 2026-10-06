import { define } from '../core/define.js';
import { styles } from './textarea.styles.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const PASS = ['disabled', 'readonly', 'required', 'maxlength', 'minlength', 'autocomplete', 'spellcheck'];

class UITextarea extends Base {
  static formAssociated = true;
  static observedAttributes = [...PASS, 'rows', 'autosize', 'maxrows', 'counter', 'value', 'placeholder', 'label', 'hint', 'error'];
  #internals;
  #field; #ta; #label; #msg; #count; #foot;
  #ro;
  #touched = false;
  #width = 0;

  constructor() {
    super();
    this.#internals = this.attachInternals?.();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${styles}</style>
      <div class="field nolabel" part="field">
        <div class="box">
          <textarea class="ta" part="textarea" id="t" rows="3" placeholder=" "></textarea>
          <label class="label" part="label" for="t"></label>
        </div>
      </div>
      <div class="foot empty" part="footer">
        <span class="msg" part="message" id="m" aria-live="polite"></span>
        <span class="count" part="counter"></span>
      </div>`;
    this.#field = root.querySelector('.field');
    this.#ta = root.querySelector('textarea');
    this.#label = root.querySelector('label');
    this.#msg = root.querySelector('.msg');
    this.#count = root.querySelector('.count');
    this.#foot = root.querySelector('.foot');

    this.#field.addEventListener('mousedown', (e) => {
      if (e.target !== this.#ta) { e.preventDefault(); this.#ta.focus(); }
    });
    this.#ta.addEventListener('input', () => this.#sync());
    this.#ta.addEventListener('change', () =>
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true })));
    this.#ta.addEventListener('blur', () => { this.#touched = true; this.#refresh(); });
    this.addEventListener('invalid', () => { this.#touched = true; this.#refresh(); });

    this.#ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      if (w !== this.#width) { this.#width = w; this.#fit(); }
    });
  }

  get value() { return this.#ta.value; }
  set value(v) { this.#ta.value = v ?? ''; this.#sync(); }
  get validity() { return this.#internals?.validity; }
  checkValidity() { return this.#internals?.checkValidity(); }
  reportValidity() { return this.#internals?.reportValidity(); }
  focus(opts) { this.#ta.focus(opts); }
  select() { this.#ta.select(); }

  connectedCallback() {
    this.#ro.observe(this);
    this.#sync();
  }
  disconnectedCallback() { this.#ro.disconnect(); }

  attributeChangedCallback(name, _, v) {
    if (PASS.includes(name)) v === null ? this.#ta.removeAttribute(name) : this.#ta.setAttribute(name, v);
    else if (name === 'rows') this.#ta.rows = parseInt(v, 10) > 0 ? parseInt(v, 10) : 3;
    else if (name === 'placeholder') this.#ta.placeholder = v || ' ';
    else if (name === 'label') {
      this.#label.textContent = v ?? '';
      this.#field.classList.toggle('nolabel', !v);
    } else if (name === 'value') this.#ta.value = v ?? '';
    this.#sync();
  }

  formResetCallback() {
    this.#ta.value = this.getAttribute('value') ?? '';
    this.#touched = false;
    this.#sync();
  }
  formDisabledCallback(d) { this.#ta.disabled = d || this.hasAttribute('disabled'); }

  #fit() {
    const ta = this.#ta;
    if (!this.hasAttribute('autosize')) { ta.style.height = ''; ta.style.overflowY = ''; return; }
    ta.style.height = 'auto';
    const cs = getComputedStyle(ta);
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
    const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const max = parseInt(this.getAttribute('maxrows'), 10);
    const limit = max > 0 ? max * lh + pad : Infinity;
    ta.style.height = `${Math.min(ta.scrollHeight, limit)}px`;
    ta.style.overflowY = ta.scrollHeight > limit ? 'auto' : 'hidden';
  }

  #sync() {
    const t = this.#ta;
    const err = this.getAttribute('error');
    this.#internals?.setFormValue(t.value);
    if (err) this.#internals?.setValidity({ customError: true }, err, t);
    else if (!t.validity.valid) this.#internals?.setValidity(t.validity, t.validationMessage, t);
    else this.#internals?.setValidity({});
    this.#fit();
    this.#refresh();
  }

  #refresh() {
    const t = this.#ta;
    const err = this.getAttribute('error') || (this.#touched && !t.validity.valid ? t.validationMessage : '');
    const text = err || this.getAttribute('hint') || '';
    this.#msg.textContent = text;
    this.#msg.classList.toggle('err', !!err);
    this.#field.classList.toggle('invalid', !!err);
    t.setAttribute('aria-invalid', String(!!err));
    text ? t.setAttribute('aria-describedby', 'm') : t.removeAttribute('aria-describedby');

    const max = parseInt(this.getAttribute('maxlength'), 10);
    const showCount = this.hasAttribute('counter') || max > 0;
    this.#count.textContent = showCount ? `${t.value.length}${max > 0 ? ` / ${max}` : ''}` : '';
    this.#count.classList.toggle('max', max > 0 && t.value.length >= max);
    this.#foot.classList.toggle('empty', !text && !showCount);
  }
}

define('ui-textarea', UITextarea);
export { UITextarea };
