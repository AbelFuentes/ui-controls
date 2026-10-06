import { define } from '../core/define.js';
import { styles } from './select.styles.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const TICK = '<svg class="tick" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';
const MISSING = 'Selecciona una opción';

class UISelect extends Base {
  static formAssociated = true;
  static observedAttributes = ['value', 'label', 'placeholder', 'hint', 'error', 'required', 'disabled'];
  #internals;
  #wrap; #field; #val; #label; #menu; #msg;
  #mo;
  #value = '';
  #initial;
  #open = false;
  #active = -1;
  #touched = false;
  #buf = '';
  #bufTimer;

  constructor() {
    super();
    this.#internals = this.attachInternals?.();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${styles}</style>
      <div class="wrap nolabel" part="wrap">
        <button class="field" part="field" type="button" role="combobox" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="lb" aria-labelledby="l v">
          <slot name="start"></slot>
          <span class="box">
            <span class="val" id="v" part="value"></span>
            <span class="label" id="l" part="label"></span>
          </span>
          <svg class="chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <ul class="menu" id="lb" part="menu" role="listbox" aria-labelledby="l"></ul>
      </div>
      <div class="msg" part="message" id="m" aria-live="polite"></div>`;
    this.#wrap = root.querySelector('.wrap');
    this.#field = root.querySelector('.field');
    this.#val = root.querySelector('.val');
    this.#label = root.querySelector('.label');
    this.#menu = root.querySelector('.menu');
    this.#msg = root.querySelector('.msg');

    this.#field.addEventListener('click', (e) => {
      if (e.detail === 0 && this.#open && this.#active >= 0) return this.#commit(this.#active); // Enter / Space
      this.#open ? this.#close() : this.#openMenu();
    });
    this.#field.addEventListener('keydown', this.#onKey);
    this.#field.addEventListener('blur', () => { this.#touched = true; this.#close(); this.#validate(); });

    this.#menu.addEventListener('mousedown', (e) => e.preventDefault()); // no pierde el foco
    this.#menu.addEventListener('click', (e) => {
      const li = e.target.closest('.opt');
      if (li) this.#commit([...this.#menu.children].indexOf(li));
    });
    this.#menu.addEventListener('mousemove', (e) => {
      const li = e.target.closest('.opt');
      const i = li ? [...this.#menu.children].indexOf(li) : -1;
      if (i >= 0 && i !== this.#active && li.getAttribute('aria-disabled') !== 'true') this.#setActive(i, false);
    });

    this.addEventListener('invalid', () => { this.#touched = true; this.#validate(); });
    this.#mo = new MutationObserver(() => this.#build());
  }

  get #options() { return [...this.querySelectorAll('option')]; }

  get value() { return this.#value; }
  set value(v) { this.setAttribute('value', v ?? ''); }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { this.toggleAttribute('disabled', !!v); }
  checkValidity() { return this.#internals?.checkValidity(); }
  reportValidity() { return this.#internals?.reportValidity(); }
  focus(opts) { this.#field.focus(opts); }

  connectedCallback() {
    this.#initial ??= this.getAttribute('value') ?? '';
    this.#mo.observe(this, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['value', 'disabled'] });
    this.#build();
  }
  disconnectedCallback() {
    this.#mo.disconnect();
    document.removeEventListener('pointerdown', this.#onDoc, true);
  }

  attributeChangedCallback(name, _, v) {
    if (name === 'value') this.#value = v ?? '';
    else if (name === 'label') {
      this.#label.textContent = v ?? '';
      this.#wrap.classList.toggle('nolabel', !v);
    } else if (name === 'disabled') {
      this.#field.disabled = this.disabled;
      if (this.disabled) this.#close();
    }
    this.#render();
  }

  formResetCallback() {
    this.#touched = false;
    this.#initial ? this.setAttribute('value', this.#initial) : this.removeAttribute('value');
  }
  formDisabledCallback(d) { this.#field.disabled = d || this.disabled; }

  #items() { return [...this.#menu.children]; }
  #enabled() { return this.#items().map((li, i) => (li.getAttribute('aria-disabled') === 'true' ? -1 : i)).filter((i) => i >= 0); }

  #build() {
    this.#menu.replaceChildren(...this.#options.map((o, i) => {
      const li = document.createElement('li');
      li.className = 'opt';
      li.part.add('option');
      li.id = `o${i}`;
      li.setAttribute('role', 'option');
      li.dataset.value = o.value;
      li.innerHTML = `<span></span>${TICK}`;
      li.firstChild.textContent = o.textContent.trim();
      if (o.disabled) li.setAttribute('aria-disabled', 'true');
      return li;
    }));
    this.#render();
  }

  #render() {
    const items = this.#items();
    const cur = items.find((li) => li.dataset.value === this.#value);
    items.forEach((li, i) => {
      li.setAttribute('aria-selected', String(li === cur));
      li.classList.toggle('active', this.#open && i === this.#active);
    });
    this.#wrap.classList.toggle('float', !!cur || this.#open);
    this.#val.textContent = cur ? cur.firstChild.textContent : this.getAttribute('placeholder') || '';
    this.#val.classList.toggle('ph', !cur);
    this.#validate();
  }

  #validate() {
    const err = this.getAttribute('error');
    const missing = this.hasAttribute('required') && !this.#value;
    const i = this.#internals;
    i?.setFormValue(this.#value || null);
    if (err) i?.setValidity({ customError: true }, err, this.#field);
    else if (missing) i?.setValidity({ valueMissing: true }, MISSING, this.#field);
    else i?.setValidity({});
    const shown = err || (this.#touched && missing ? MISSING : '');
    const text = shown || this.getAttribute('hint') || '';
    this.#msg.textContent = text;
    this.#msg.classList.toggle('err', !!shown);
    this.#wrap.classList.toggle('invalid', !!shown);
    this.#field.setAttribute('aria-invalid', String(!!shown));
    text ? this.#field.setAttribute('aria-describedby', 'm') : this.#field.removeAttribute('aria-describedby');
  }

  #onDoc = (e) => { if (!e.composedPath().includes(this)) this.#close(); };

  #openMenu() {
    if (this.#open || this.disabled) return;
    this.#open = true;
    const items = this.#items();
    let i = items.findIndex((li) => li.dataset.value === this.#value);
    if (i < 0 || items[i].getAttribute('aria-disabled') === 'true') i = this.#enabled()[0] ?? -1;
    this.#active = i;
    const r = this.#field.getBoundingClientRect();
    const h = this.#menu.offsetHeight;
    const below = innerHeight - r.bottom;
    this.#wrap.classList.toggle('up', below < h + 16 && r.top > below);
    this.#wrap.classList.add('open');
    this.#field.setAttribute('aria-expanded', 'true');
    document.addEventListener('pointerdown', this.#onDoc, true);
    this.#setActive(i, true);
  }

  #close() {
    if (!this.#open) return;
    this.#open = false;
    this.#active = -1;
    this.#wrap.classList.remove('open');
    this.#field.setAttribute('aria-expanded', 'false');
    this.#field.removeAttribute('aria-activedescendant');
    document.removeEventListener('pointerdown', this.#onDoc, true);
    this.#render();
  }

  #setActive(i, scroll = true) {
    this.#active = i;
    const li = this.#menu.children[i];
    li ? this.#field.setAttribute('aria-activedescendant', li.id) : this.#field.removeAttribute('aria-activedescendant');
    this.#render();
    if (li && scroll) {
      const m = this.#menu;
      if (li.offsetTop < m.scrollTop) m.scrollTop = li.offsetTop - 4;
      else if (li.offsetTop + li.offsetHeight > m.scrollTop + m.clientHeight)
        m.scrollTop = li.offsetTop + li.offsetHeight - m.clientHeight + 4;
    }
  }

  #move(dir) {
    const idx = this.#enabled();
    if (!idx.length) return;
    let pos = idx.indexOf(this.#active);
    pos = pos < 0 ? (dir > 0 ? 0 : idx.length - 1) : (pos + dir + idx.length) % idx.length;
    this.#setActive(idx[pos]);
  }

  #choose(i) {
    const li = this.#menu.children[i];
    if (!li || li.getAttribute('aria-disabled') === 'true') return;
    const v = li.dataset.value;
    if (v === this.#value) return;
    this.setAttribute('value', v);
    this.dispatchEvent(new CustomEvent('change', { detail: { value: v }, bubbles: true, composed: true }));
  }

  #commit(i) {
    this.#close();
    this.#choose(i);
  }

  #onKey = (e) => {
    const { key } = e;
    const enabled = this.#enabled();
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      e.preventDefault();
      if (!this.#open) return this.#openMenu();
      return this.#move(key === 'ArrowDown' ? 1 : -1);
    }
    if (key === 'Home' || key === 'End') {
      e.preventDefault();
      if (!this.#open) this.#openMenu();
      return this.#setActive(key === 'Home' ? enabled[0] : enabled.at(-1));
    }
    if (key === 'Escape' && this.#open) { e.preventDefault(); return this.#close(); }
    if (key === 'Tab') return this.#close();
    if (key.length === 1 && key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) this.#typeahead(key.toLowerCase());
  };

  #typeahead(ch) {
    clearTimeout(this.#bufTimer);
    this.#buf += ch;
    this.#bufTimer = setTimeout(() => (this.#buf = ''), 600);
    const items = this.#items();
    const from = this.#open ? this.#active : items.findIndex((li) => li.dataset.value === this.#value);
    const start = Math.max(from, 0) + (this.#buf.length === 1 ? 1 : 0);
    for (let n = 0; n < items.length; n++) {
      const i = (start + n) % items.length;
      const li = items[i];
      if (li.getAttribute('aria-disabled') !== 'true' && li.firstChild.textContent.toLowerCase().startsWith(this.#buf)) {
        this.#open ? this.#setActive(i) : this.#choose(i);
        return;
      }
    }
  }
}

define('ui-select', UISelect);
export { UISelect };
