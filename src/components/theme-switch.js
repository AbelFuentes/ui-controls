import { define } from '../core/define.js';
import { getTheme, setTheme } from '../core/theme.js';
import { styles } from './theme-switch.styles.js';

const stars = [
  ['.55em', '.55em', '0s'], ['1.2em', '1.45em', '.7s'], ['1.9em', '.4em', '1.3s'],
  ['2.5em', '1.2em', '.4s'], ['.9em', '1.05em', '1.9s'], ['2.1em', '1.75em', '1s'],
];

class UIThemeSwitch extends HTMLElement {
  static observedAttributes = ['label'];
  #btn;
  #onTheme = (e) => this.#sync(e.detail.theme);

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${styles}</style>
      <button class="track" part="track" role="switch" aria-checked="false" aria-label="Modo oscuro">
        <span class="bg day"></span>
        <span class="bg night">
          ${stars.map(([x, y, t]) => `<i class="star" style="--x:${x};--y:${y};--t:${t}"></i>`).join('')}
        </span>
        <i class="cloud back"></i><i class="cloud"></i>
        <span class="thumb" part="thumb">
          <span class="face"><i class="crater c1"></i><i class="crater c2"></i><i class="crater c3"></i></span>
        </span>
      </button>`;
    this.#btn = root.querySelector('button');
    this.#btn.addEventListener('click', (e) => {
      const r = this.#btn.getBoundingClientRect();
      const origin = e.detail
        ? { x: e.clientX, y: e.clientY }
        : { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      setTheme(this.#btn.getAttribute('aria-checked') === 'true' ? 'light' : 'dark', { origin });
    });
  }

  connectedCallback() {
    this.#sync(getTheme());
    window.addEventListener('ui-theme-change', this.#onTheme);
  }
  disconnectedCallback() {
    window.removeEventListener('ui-theme-change', this.#onTheme);
  }
  attributeChangedCallback(name, _, v) {
    if (name === 'label' && v) this.#btn.setAttribute('aria-label', v);
  }
  #sync(theme) {
    this.#btn.setAttribute('aria-checked', String(theme === 'dark'));
  }
}

define('ui-theme-switch', UIThemeSwitch);
export { UIThemeSwitch };
