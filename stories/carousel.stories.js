const palettes = [
  ['#6366f1', '#a855f7', 'Aurora'],
  ['#10b981', '#06b6d4', 'Bosque'],
  ['#f97316', '#ef4444', 'Atardecer'],
  ['#0ea5e9', '#6366f1', 'Océano'],
  ['#ec4899', '#f59e0b', 'Verano'],
];

const art = (a, b, t) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><circle cx="500" cy="90" r="120" fill="#fff" opacity=".18"/><circle cx="130" cy="300" r="160" fill="#fff" opacity=".12"/><text x="40" y="320" font-family="system-ui,sans-serif" font-size="44" font-weight="700" fill="#fff" opacity=".9">${t}</text></svg>`
  )}`;

const imgs = palettes.map(([a, b, t]) => `<img alt="${t}" src="${art(a, b, t)}" />`).join('');

const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== false && v !== '' && v != null)
    .map(([k, v]) => (v === true ? k : `${k}="${v}"`))
    .join(' ');

export default {
  title: 'Controls/Carousel',
  tags: ['autodocs'],
  argTypes: {
    'per-view': { control: { type: 'number', min: 1, max: 4 } },
    autoplay: { control: 'text', description: 'vacío = apagado · true = 5000ms · o milisegundos' },
    loop: { control: 'boolean' },
    'no-arrows': { control: 'boolean' },
    'no-dots': { control: 'boolean' },
  },
  args: { 'per-view': 1, autoplay: '', loop: false, 'no-arrows': false, 'no-dots': false },
  render: (a) => `<ui-carousel label="Galería" style="width:min(40rem,92vw)" ${attrs(a)}>${imgs}</ui-carousel>`,
};

export const Default = {};
export const Autoplay = { args: { autoplay: '3000', loop: true } };
export const Loop = { args: { loop: true } };
export const PerView = { args: { 'per-view': 3 } };
export const NoControls = { args: { 'no-arrows': true, 'no-dots': true } };

export const WithCards = {
  render: () => `
    <ui-carousel per-view="3" label="Destinos" style="width:min(60rem,92vw)">
      ${palettes
        .map(
          ([a, b, t]) => `
        <ui-card variant="outlined" interactive>
          <img slot="media" alt="" src="${art(a, b, t)}" />
          <span slot="header">${t}</span>
          Descubre destinos para cada estación del año.
        </ui-card>`
        )
        .join('')}
    </ui-carousel>`,
};

export const SquareAspect = {
  render: () => `
    <ui-carousel per-view="2" style="width:min(32rem,92vw);--ui-carousel-aspect:1/1">${imgs}</ui-carousel>`,
};

export const CustomGap = {
  render: () => `
    <ui-carousel per-view="2" style="width:min(40rem,92vw);--ui-carousel-gap:.4em">${imgs}</ui-carousel>`,
};

export const Events = {
  render: () => {
    const el = document.createElement('div');
    el.style.cssText = 'display:grid;gap:1rem;justify-items:center;width:min(40rem,92vw)';
    el.innerHTML = `
      <ui-carousel style="width:100%">${imgs}</ui-carousel>
      <div style="display:flex;gap:.75rem;align-items:center">
        <ui-button size="sm" variant="outline" data-a="first">Ir al inicio</ui-button>
        <ui-button size="sm" variant="outline" data-a="last">Ir al final</ui-button>
        <span class="out" style="font-size:.9rem;opacity:.7">Índice: 0</span>
      </div>`;
    const c = el.querySelector('ui-carousel');
    const out = el.querySelector('.out');
    c.addEventListener('change', (e) => (out.textContent = `Índice: ${e.detail.index}`));
    el.querySelector('[data-a=first]').onclick = () => c.goTo(0);
    el.querySelector('[data-a=last]').onclick = () => c.goTo(99);
    return el;
  },
};
