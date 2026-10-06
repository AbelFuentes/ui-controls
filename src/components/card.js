import { define } from '../core/define.js';
import { styles } from './card.styles.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

class UICard extends Base {
  static observedAttributes = ['interactive'];
  #card;
  #auto = false;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${styles}</style>
      <article class="card" part="card">
        <div class="media" part="media" data-s><slot name="media"></slot></div>
        <header class="header" part="header" data-s><slot name="header"></slot></header>
        <div class="body" part="body" data-s><slot></slot></div>
        <footer class="footer" part="footer" data-s><slot name="footer"></slot></footer>
      </article>`;
    this.#card = root.querySelector('.card');
    root.querySelectorAll('slot').forEach((s) => s.addEventListener('slotchange', () => this.#sync()));
    this.addEventListener('keydown', (e) => {
      if (!this.hasAttribute('interactive') || e.target !== this) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }

  connectedCallback() {
    this.#sync();
    this.#a11y();
  }
  attributeChangedCallback() { this.#a11y(); }

  #a11y() {
    if (this.hasAttribute('interactive')) {
      if (!this.hasAttribute('role') && !this.hasAttribute('tabindex')) {
        this.setAttribute('role', 'button');
        this.setAttribute('tabindex', '0');
        this.#auto = true;
      }
    } else if (this.#auto) {
      this.removeAttribute('role');
      this.removeAttribute('tabindex');
      this.#auto = false;
    }
  }

  #sync() {
    const root = this.shadowRoot;
    root.querySelectorAll('[data-s]').forEach((el) => {
      const nodes = el.querySelector('slot').assignedNodes({ flatten: true });
      el.hidden = !nodes.some((n) => n.nodeType === 1 || n.textContent.trim());
    });
    this.#card.classList.toggle('has-header', !root.querySelector('.header').hidden);
  }
}

define('ui-card', UICard);
export { UICard };
