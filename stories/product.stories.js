import { toast } from '../src/components/toast.js';
import { art, icons, money, svg, wait } from './_shared.js';

export default { title: 'Examples/Product', parameters: { layout: 'fullscreen' } };

const imgs = [['#6366f1', '#a855f7', 'Frente'], ['#0ea5e9', '#6366f1', 'Lateral'], ['#10b981', '#06b6d4', 'Detalle'], ['#f97316', '#ef4444', 'Empaque']];
const related = [['Teclado compacto', 1290, '#ec4899', '#f59e0b'], ['Base para laptop', 790, '#10b981', '#06b6d4'], ['Mouse ergonómico', 890, '#0ea5e9', '#6366f1'], ['Hub USB-C', 650, '#14b8a6', '#6366f1'], ['Soporte monitor', 1190, '#f97316', '#ef4444']];
const dist = [[5, 62], [4, 24], [3, 8], [2, 4], [1, 2]];
const reviews = [
  ['Ana López', 5, 'Excelente calidad', 'El sonido de las teclas es increíble y el acabado se siente premium.'],
  ['Beto Ruiz', 4, 'Muy bueno', 'Cómodo para trabajar todo el día. Lo único: el cable podría ser más largo.'],
  ['Carla Gil', 5, 'Vale cada peso', 'Lo uso a diario y sigue como el primer día.'],
];
const specs = [
  { k: 'Conexión', v: 'USB-C · Bluetooth 5.1' }, { k: 'Layout', v: 'ANSI 75%' },
  { k: 'Batería', v: '4,000 mAh (hasta 90 h)' }, { k: 'Peso', v: '890 g' }, { k: 'Garantía', v: '2 años' },
];
const stars = (n) => Array.from({ length: 5 }, (_, i) =>
  `<svg viewBox="0 0 24 24" width="18" height="18" style="color:var(--ui-warning)" fill="${i < n ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linejoin="round" opacity="${i < n ? 1 : 0.35}"><path d="${icons.star}"/></svg>`).join('');

export const Detail = {
  render: () => {
    const arrive = new Date(Date.now() + 3 * 864e5).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        .pd{max-width:68rem;margin:0 auto;padding:1.5rem 1.25rem 4rem}
        .pd .top{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1.25rem}
        .pd .cols{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:2rem;align-items:start}
        @media (max-width:820px){.pd .cols{grid-template-columns:1fr}}
        .pd h1{margin:0;font-size:1.9rem;letter-spacing:-.02em}
        .pd p{margin:0;line-height:1.6}
        .pd .muted{color:var(--ui-muted)}
        .pd .price{font-size:2rem;font-weight:800;letter-spacing:-.02em}
        .pd .old{text-decoration:line-through;color:var(--ui-muted)}
        .pd .line{display:flex;align-items:center;gap:.6rem;flex-wrap:wrap}
        .pd .ck{display:flex;gap:.6rem;align-items:center;margin-bottom:.5rem}
        .pd .ck svg{color:var(--ui-success);flex:none}
        .pd .bars{display:grid;gap:.7rem}
        .pd .rev{padding:1rem 0;border-bottom:1px solid var(--ui-border)}
        .pd .rev:last-child{border:0}
        .pd h2{margin:0;font-size:1.3rem}
      </style>
      <div class="pd">
        <div class="top">
          <ui-breadcrumb label="Ruta"><a href="#">Inicio</a><a href="#">Periféricos</a><span>Teclado mecánico</span></ui-breadcrumb>
          <div class="line"><ui-theme-switch size="sm"></ui-theme-switch><ui-badge tone="accent" variant="solid" size="sm" class="cart">${svg('cart', 14)} 0</ui-badge></div>
        </div>

        <ui-stack gap="xl">
          <div class="cols">
            <ui-carousel label="Fotos del producto" loop style="--ui-carousel-aspect:4/3">
              ${imgs.map(([a, b, t]) => `<img alt="${t}" src="${art(a, b, t, 800, 600)}" />`).join('')}
            </ui-carousel>

            <ui-stack gap="lg">
              <ui-stack gap="sm">
                <div class="line"><ui-badge tone="success" size="sm">Nuevo</ui-badge><ui-badge tone="neutral" size="sm" variant="outline">Envío gratis</ui-badge></div>
                <h1>Teclado mecánico 75%</h1>
                <div class="line">${stars(4)}<span class="muted" style="font-size:.9rem">4.6 · 128 reseñas</span></div>
              </ui-stack>
              <div class="line"><span class="price">${money(1890)}</span><span class="old">${money(2190)}</span><ui-badge tone="danger" size="sm">-14%</ui-badge></div>
              <p class="muted">Hot-swap, gasket mount y retroiluminación RGB. Perfecto para escribir y programar.</p>

              <ui-stack gap="sm"><strong>Color</strong>
                <ui-segmented value="black" label="Color"><option value="black">Negro</option><option value="white">Blanco</option><option value="blue">Azul</option></ui-segmented>
              </ui-stack>
              <ui-stack gap="sm"><strong>Tipo de switch</strong>
                <ui-radio-group value="brown" orientation="horizontal" label="Switch">
                  <ui-radio value="red">Red</ui-radio><ui-radio value="brown">Brown</ui-radio><ui-radio value="blue">Blue</ui-radio>
                </ui-radio-group>
              </ui-stack>

              <div class="line" style="align-items:flex-start">
                <ui-input class="qty" type="number" label="Cantidad" value="1" min="1" max="10" style="width:8rem"></ui-input>
                <ui-button data-a="add" size="lg" style="flex:1;margin-top:.1rem">${svg('cart', 18, 'start')}Agregar al carrito</ui-button>
                <ui-tooltip text="Guardar en favoritos" placement="top">
                  <ui-button icon variant="outline" size="lg" label="Favoritos" data-a="fav" style="margin-top:.1rem">${svg('heart', 18)}</ui-button>
                </ui-tooltip>
              </div>
              <ui-alert tone="info"><span slot="title">Llega el ${arrive}</span>Envío gratis a todo México en pedidos mayores a ${money(1500)}.</ui-alert>
            </ui-stack>
          </div>

          <ui-tabs value="desc" label="Detalles del producto">
            <section data-tab="desc" data-label="Descripción">
              <ui-stack gap="sm" style="max-width:40rem">
                ${['Estructura de aluminio CNC', 'Switches hot-swap de 5 pines', 'Batería para hasta 90 horas', 'Compatible con macOS, Windows y Linux']
                  .map((t) => `<div class="ck">${svg('check', 18)}<span>${t}</span></div>`).join('')}
              </ui-stack>
            </section>
            <section data-tab="specs" data-label="Especificaciones"><ui-table class="specs" compact></ui-table></section>
            <section data-tab="reviews" data-label="Reseñas (128)">
              <ui-grid min="20rem" gap="lg">
                <ui-stack gap="lg">
                  <div class="line"><span class="price">4.6</span>${stars(5)}</div>
                  <div class="bars">${dist.map(([n, v]) => `<ui-progress value="${v}" label="${n} ★" show-value size="sm"></ui-progress>`).join('')}</div>
                </ui-stack>
                <div>
                  ${reviews.map(([n, s, t, b]) => `
                    <div class="rev">
                      <div class="line"><ui-avatar name="${n}" size="sm"></ui-avatar><strong>${n}</strong><span style="margin-left:auto">${stars(s)}</span></div>
                      <p style="margin-top:.6rem"><strong>${t}</strong></p><p class="muted">${b}</p>
                    </div>`).join('')}
                </div>
              </ui-grid>
            </section>
          </ui-tabs>

          <ui-stack gap="lg">
            <h2>También te puede interesar</h2>
            <ui-carousel per-view="3" label="Relacionados" style="--ui-carousel-aspect:4/3">
              ${related.map(([t, p, a, b]) => `
                <ui-card variant="outlined" interactive>
                  <img slot="media" alt="" src="${art(a, b, '', 640, 480)}" />
                  <span slot="header">${t}</span><strong>${money(p)}</strong>
                </ui-card>`).join('')}
            </ui-carousel>
          </ui-stack>
        </ui-stack>
      </div>`;

    const $ = (s) => el.querySelector(s);
    const add = $('[data-a=add]');
    let count = 0;
    add.onclick = async () => {
      add.loading = true;
      await wait(900);
      add.loading = false;
      count += Number($('.qty').value) || 1;
      $('.cart').innerHTML = `${svg('cart', 14)} ${count}`;
      toast.success('Agregado al carrito', { title: 'Teclado mecánico 75%' });
    };
    let fav = false;
    $('[data-a=fav]').onclick = (e) => {
      fav = !fav;
      e.currentTarget.style.color = fav ? 'var(--ui-danger)' : '';
      e.currentTarget.firstElementChild.setAttribute('fill', fav ? 'currentColor' : 'none');
      toast.info(fav ? 'Guardado en favoritos' : 'Quitado de favoritos');
    };

    const sp = $('.specs');
    sp.columns = [{ key: 'k', label: 'Característica' }, { key: 'v', label: 'Detalle' }];
    sp.rows = specs;
    return el;
  },
};
