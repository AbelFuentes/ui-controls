import { define } from '../core/define.js';
import { styles } from './carousel.styles.js';

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

class UICarousel extends Base {
  static observedAttributes = ['per-view', 'autoplay', 'loop', 'label'];
  #root; #track; #slot; #prev; #next; #dots;
  #idx = 0;
  #raf = 0;
  #hover = false;
  #drag = null;
  #suppress = false;
  #ro;
  #auto = new WeakSet();

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${styles}</style>
      <div class="root" part="root" role="region" aria-roledescription="carousel" aria-label="Carrusel">
        <div class="track" part="track" tabindex="0"><slot></slot></div>
        <button class="nav prev" part="prev" type="button" aria-label="Anterior">
          <svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>
        </button>
        <button class="nav next" part="next" type="button" aria-label="Siguiente">
          <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
        </button>
        <div class="dots" part="dots" role="group" aria-label="Diapositivas"></div>
      </div>`;
    this.#root = root.querySelector('.root');
    this.#track = root.querySelector('.track');
    this.#slot = root.querySelector('slot');
    this.#prev = root.querySelector('.prev');
    this.#next = root.querySelector('.next');
    this.#dots = root.querySelector('.dots');

    this.#slot.addEventListener('slotchange', () => { this.#decorate(); this.#rebuild(); });
    this.#track.addEventListener('scroll', () => {
      if (this.#raf) return;
      this.#raf = requestAnimationFrame(() => { this.#raf = 0; this.#update(true); });
    }, { passive: true });

    this.#prev.addEventListener('click', () => this.prev());
    this.#next.addEventListener('click', () => this.next());
    this.#dots.addEventListener('click', (e) => {
      const b = e.target.closest('.dot');
      if (b) this.#goTo(Number(b.dataset.i));
    });
    this.#dots.addEventListener('animationend', (e) => {
      if (e.animationName === 'fill') this.#goTo(this.#idx + 1, true);
    });

    this.#root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { this.#hover = true; this.#syncPaused(); } });
    this.#root.addEventListener('pointerleave', () => { this.#hover = false; this.#syncPaused(); });
    this.#root.addEventListener('focusin', () => this.#syncPaused());
    this.#root.addEventListener('focusout', () => this.#syncPaused());

    // arrastre con mouse (touch ya usa scroll nativo)
    this.#track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      this.#drag = { x: e.clientX, left: this.#track.scrollLeft, start: this.#idx, id: e.pointerId, moved: false };
    });
    this.#track.addEventListener('pointermove', (e) => {
      const d = this.#drag;
      if (!d) return;
      const dx = e.clientX - d.x;
      if (!d.moved && Math.abs(dx) > 5) {
        d.moved = true;
        this.#track.setPointerCapture(d.id);
        this.#track.classList.add('drag');
        this.#syncPaused();
      }
      if (d.moved) this.#track.scrollLeft = d.left - dx;
    });
    const end = (e) => {
      const d = this.#drag;
      if (!d) return;
      this.#drag = null;
      if (!d.moved) return;
      this.#track.classList.remove('drag');
      const dx = e.clientX - d.x;
      const dir = Math.abs(dx) > this.#track.clientWidth * 0.15 ? (dx < 0 ? 1 : -1) : 0;
      this.#goTo(Math.min(this.#max, Math.max(0, d.start + dir)));
      this.#suppress = true;
      setTimeout(() => (this.#suppress = false), 50);
      this.#syncPaused();
    };
    this.#track.addEventListener('pointerup', end);
    this.#track.addEventListener('pointercancel', end);
    this.addEventListener('click', (e) => {
      if (this.#suppress) { e.stopPropagation(); e.preventDefault(); }
    }, true);

    this.addEventListener('keydown', (e) => {
      if (e.target.closest?.('input,textarea,select')) return;
      if (e.key === 'ArrowRight') this.next();
      else if (e.key === 'ArrowLeft') this.prev();
      else if (e.key === 'Home') this.#goTo(0);
      else if (e.key === 'End') this.#goTo(this.#max);
      else return;
      e.preventDefault();
    });

    this.#ro = new ResizeObserver(() => {
      this.#rebuild();
      this.#track.scrollTo({ left: this.#offset(Math.min(this.#idx, this.#max)), behavior: 'instant' });
    });
  }

  get index() { return this.#idx; }
  set index(v) { this.#goTo(Number(v) || 0); }
  next() { this.#goTo(this.#idx + 1); }
  prev() { this.#goTo(this.#idx - 1); }
  goTo(i) { this.#goTo(i); }

  connectedCallback() {
    this.#ro.observe(this.#track);
    document.addEventListener('visibilitychange', this.#onVis);
    this.#decorate();
    this.#rebuild();
  }
  disconnectedCallback() {
    this.#ro.disconnect();
    document.removeEventListener('visibilitychange', this.#onVis);
  }

  attributeChangedCallback(name, _, v) {
    if (name === 'per-view') {
      v ? this.#root.style.setProperty('--pv', v) : this.#root.style.removeProperty('--pv');
      this.#rebuild();
    } else if (name === 'autoplay') this.#syncPlay();
    else if (name === 'loop') this.#paint();
    else if (name === 'label') this.#root.setAttribute('aria-label', v || 'Carrusel');
  }

  #onVis = () => this.#syncPaused();

  get #slides() { return this.#slot.assignedElements({ flatten: true }); }
  get #pv() {
    const v = parseFloat(getComputedStyle(this.#root).getPropertyValue('--pv'));
    return Math.max(1, Math.round(v) || 1);
  }
  get #max() { return Math.max(0, this.#slides.length - this.#pv); }

  #offset(i) {
    const s = this.#slides[i];
    if (!s) return 0;
    return s.getBoundingClientRect().left - this.#track.getBoundingClientRect().left + this.#track.scrollLeft;
  }

  #current() {
    const t = this.#track;
    const max = this.#max;
    if (t.scrollLeft >= t.scrollWidth - t.clientWidth - 2) return max;
    let best = 0;
    let dist = Infinity;
    for (let i = 0; i <= max; i++) {
      const d = Math.abs(this.#offset(i) - t.scrollLeft);
      if (d < dist) { dist = d; best = i; }
    }
    return best;
  }

  #goTo(i, wrap = false) {
    const max = this.#max;
    const loop = wrap || this.hasAttribute('loop');
    if (i > max) i = loop ? 0 : max;
    if (i < 0) i = loop ? max : 0;
    this.#track.scrollTo({ left: this.#offset(i), behavior: reduced() ? 'auto' : 'smooth' });
  }

  #decorate() {
    const slides = this.#slides;
    slides.forEach((s, i) => {
      if (!s.hasAttribute('aria-label') || this.#auto.has(s)) {
        s.setAttribute('aria-label', `${i + 1} de ${slides.length}`);
        this.#auto.add(s);
      }
      if (!s.hasAttribute('role')) s.setAttribute('role', 'group');
      if (!s.hasAttribute('aria-roledescription')) s.setAttribute('aria-roledescription', 'slide');
      if (s.tagName === 'IMG') s.draggable = false;
    });
  }

  #rebuild() {
    const count = this.#slides.length ? this.#max + 1 : 0;
    if (this.#dots.children.length !== count) {
      this.#dots.replaceChildren(...Array.from({ length: count }, (_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'dot';
        b.part.add('dot');
        b.dataset.i = i;
        b.setAttribute('aria-label', `Ir a la diapositiva ${i + 1}`);
        return b;
      }));
    }
    this.#dots.hidden = count <= 1;
    this.#idx = Math.min(this.#idx, this.#max);
    this.#paint();
    this.#syncPlay();
  }

  #update(emit) {
    const i = this.#current();
    const changed = i !== this.#idx;
    this.#idx = i;
    this.#paint();
    if (changed && emit) {
      this.dispatchEvent(new CustomEvent('change', { detail: { index: i }, bubbles: true, composed: true }));
    }
  }

  #paint() {
    const i = this.#idx;
    const loop = this.hasAttribute('loop');
    [...this.#dots.children].forEach((d, k) =>
      k === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current'));
    this.#prev.disabled = !loop && i <= 0;
    this.#next.disabled = !loop && i >= this.#max;
  }

  #syncPlay() {
    const attr = this.getAttribute('autoplay');
    const ms = attr === null ? 0 : parseInt(attr, 10) || 5000;
    const on = ms > 0 && !reduced() && this.#max > 0;
    this.#dots.style.setProperty('--dur', `${ms}ms`);
    this.#dots.classList.toggle('playing', on);
    this.#syncPaused();
  }

  #syncPaused() {
    const focused = this.shadowRoot.activeElement?.matches?.(':focus-visible');
    const paused = this.#hover || !!focused || !!this.#drag?.moved || document.hidden;
    this.#dots.classList.toggle('paused', paused);
  }
}

define('ui-carousel', UICarousel);
export { UICarousel };
