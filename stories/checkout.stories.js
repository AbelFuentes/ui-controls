import { toast } from '../src/components/toast.js';
import { art, money, svg, wait } from './_shared.js';

export default { title: 'Examples/Checkout', parameters: { layout: 'fullscreen' } };

const items = [
  { name: 'Teclado mecánico', variant: 'Negro · Brown', price: 1890, qty: 1, c: ['#6366f1', '#a855f7'] },
  { name: 'Mouse inalámbrico', variant: 'Grafito', price: 690, qty: 2, c: ['#0ea5e9', '#6366f1'] },
  { name: 'Base para laptop', variant: 'Aluminio', price: 790, qty: 1, c: ['#10b981', '#06b6d4'] },
];

export const ThreeSteps = {
  render: () => {
    const el = document.createElement('div');
    const sub = items.reduce((s, i) => s + i.price * i.qty, 0);
    el.innerHTML = `
      <style>
        .co{max-width:70rem;margin:0 auto;padding:1.5rem 1.25rem 3rem}
        .co .top{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1.25rem}
        .co .logo{font-weight:800;font-size:1.15rem}
        .co .cols{display:grid;grid-template-columns:minmax(0,1fr) 22rem;gap:1.5rem;align-items:start}
        @media (max-width:880px){.co .cols{grid-template-columns:1fr}}
        .co h2{margin:0 0 .25rem;font-size:1.25rem}
        .co p{margin:0}
        .co .muted{color:var(--ui-muted)}
        .co .small{font-size:.85rem}
        .co .line{display:flex;justify-content:space-between;gap:1rem}
        .co .item{display:flex;gap:.8rem;align-items:center}
        .co .item img{width:3.2rem;height:3.2rem;border-radius:.8rem;object-fit:cover;flex:none}
        .co .item .n{flex:1;min-width:0}
        .co .total{font-weight:800;font-size:1.15rem}
        .co hr{border:0;border-top:1px solid var(--ui-border);margin:0;width:100%}
        .co .panel[hidden]{display:none}
        .co .promo{display:flex;gap:.5rem;align-items:flex-start}
        .co .promo ui-input{flex:1}
        .co ui-card.done::part(footer){display:none}
        .co .ok{place-items:center;text-align:center;display:grid;gap:1rem;padding:1.5rem 0}
        .co .badge{width:3.5rem;height:3.5rem;border-radius:50%;display:grid;place-items:center;color:#fff;
          background:linear-gradient(135deg,var(--ui-success),#06b6d4)}
      </style>
      <div class="co">
        <div class="top"><span class="logo">Tienda</span><ui-theme-switch size="sm"></ui-theme-switch></div>
        <ui-stepper value="1" clickable label="Pasos de compra" style="margin-bottom:1.5rem">
          <li data-description="¿A dónde enviamos?">Envío</li>
          <li data-description="¿Cómo pagas?">Pago</li>
          <li data-description="Confirma tu pedido">Revisión</li>
        </ui-stepper>

        <div class="cols">
          <ui-card class="main" padding="lg">
            <form novalidate>
              <section class="panel" data-step="1">
                <ui-stack gap="lg">
                  <div><h2>Datos de envío</h2><p class="muted">Te enviaremos la confirmación por correo.</p></div>
                  <ui-grid min="13rem">
                    <ui-input name="first" label="Nombre" required autocomplete="given-name"></ui-input>
                    <ui-input name="last" label="Apellido" required autocomplete="family-name"></ui-input>
                    <ui-input name="email" type="email" label="Correo" required autocomplete="email"></ui-input>
                    <ui-input name="phone" type="tel" label="Teléfono" autocomplete="tel"></ui-input>
                    <ui-input name="address" label="Dirección" required autocomplete="street-address" style="grid-column:1/-1"></ui-input>
                    <ui-input name="city" label="Ciudad" required></ui-input>
                    <ui-select name="state" label="Estado" required>
                      <option value="BC">Baja California</option><option value="CDMX">Ciudad de México</option>
                      <option value="JAL">Jalisco</option><option value="NL">Nuevo León</option>
                    </ui-select>
                    <ui-input name="zip" label="Código postal" required inputmode="numeric" maxlength="5" pattern="\\d{5}" hint="5 dígitos"></ui-input>
                  </ui-grid>
                  <ui-stack gap="sm">
                    <strong>Método de envío</strong>
                    <ui-radio-group name="ship" value="standard" label="Método de envío">
                      <ui-radio value="standard">Estándar · 3–5 días · Gratis</ui-radio>
                      <ui-radio value="express">Express · 1–2 días · ${money(149)}</ui-radio>
                    </ui-radio-group>
                  </ui-stack>
                </ui-stack>
              </section>

              <section class="panel" data-step="2" hidden>
                <ui-stack gap="lg">
                  <div><h2>Pago</h2><p class="muted">Tus datos viajan cifrados.</p></div>
                  <ui-segmented name="method" value="card" label="Método de pago">
                    <option value="card">Tarjeta</option><option value="transfer">Transferencia</option>
                  </ui-segmented>
                  <div class="cardf">
                    <ui-grid min="12rem">
                      <ui-input name="number" label="Número de tarjeta" required inputmode="numeric" maxlength="19" pattern="[0-9 ]{19}" style="grid-column:1/-1">
                        ${svg('card', 18, 'start')}
                      </ui-input>
                      <ui-input name="holder" label="Nombre en la tarjeta" required style="grid-column:1/-1"></ui-input>
                      <ui-input name="exp" label="Vence (MM/AA)" required maxlength="5" pattern="\\d{2}/\\d{2}"></ui-input>
                      <ui-input name="cvc" label="CVC" required inputmode="numeric" maxlength="4" pattern="\\d{3,4}"></ui-input>
                    </ui-grid>
                  </div>
                  <ui-alert class="tf" tone="info" hidden>Te mostraremos los datos de la transferencia al confirmar.</ui-alert>
                </ui-stack>
              </section>

              <section class="panel" data-step="3" hidden>
                <ui-stack gap="lg">
                  <div><h2>Revisa tu pedido</h2><p class="muted">Verifica que todo esté bien antes de pagar.</p></div>
                  <ui-card variant="soft" padding="sm"><div class="line"><span class="muted">Enviar a</span><strong class="rv-ship" style="text-align:right"></strong></div></ui-card>
                  <ui-card variant="soft" padding="sm"><div class="line"><span class="muted">Envío</span><strong class="rv-method"></strong></div></ui-card>
                  <ui-card variant="soft" padding="sm"><div class="line"><span class="muted">Pago</span><strong class="rv-pay"></strong></div></ui-card>
                  <ui-checkbox class="terms">Acepto los términos y la política de privacidad</ui-checkbox>
                </ui-stack>
              </section>

              <section class="panel ok" data-step="4" hidden>
                <div class="badge">${svg('check', 28)}</div>
                <h2>¡Gracias por tu compra!</h2>
                <p class="muted">Tu pedido <strong class="order"></strong> está en camino. Te enviamos el recibo por correo.</p>
                <ui-progress value="25" label="Preparando tu pedido" style="width:min(20rem,100%)"></ui-progress>
                <ui-button variant="outline" data-a="again">Seguir comprando</ui-button>
              </section>
            </form>
            <ui-button slot="footer" variant="ghost" data-a="back" hidden>Atrás</ui-button>
            <ui-button slot="footer" data-a="next" style="margin-left:auto">Continuar al pago</ui-button>
          </ui-card>

          <ui-card padding="lg">
            <span slot="header">Tu pedido</span>
            <ui-stack gap="lg">
              ${items.map((i) => `
                <div class="item">
                  <img alt="" src="${art(i.c[0], i.c[1], '', 120, 120)}" />
                  <div class="n"><strong>${i.name}</strong><div class="muted small">${i.variant} · x${i.qty}</div></div>
                  <span>${money(i.price * i.qty)}</span>
                </div>`).join('')}
              <hr />
              <div class="promo">
                <ui-input name="promo" label="Cupón" hint="Prueba VERANO10"></ui-input>
                <ui-button variant="outline" data-a="promo" style="margin-top:.2rem">Aplicar</ui-button>
              </div>
              <hr />
              <ui-stack gap="sm">
                <div class="line"><span class="muted">Subtotal</span><span>${money(sub)}</span></div>
                <div class="line"><span class="muted">Envío</span><span class="t-ship">Gratis</span></div>
                <div class="line"><span class="muted">Descuento</span><span class="t-disc">—</span></div>
                <div class="line total"><span>Total</span><span class="t-total"></span></div>
                <span class="muted small">Precios con IVA incluido</span>
              </ui-stack>
            </ui-stack>
          </ui-card>
        </div>
      </div>`;

    const $ = (s) => el.querySelector(s);
    const st = $('ui-stepper');
    const back = $('[data-a=back]');
    const next = $('[data-a=next]');
    const main = $('.main');
    const terms = $('.terms');
    const form = $('form');
    const panels = [...el.querySelectorAll('.panel')];
    let step = 1;
    let ship = 'standard';
    let promo = 0;

    const totals = () => {
      const shipping = ship === 'express' ? 149 : 0;
      const discount = Math.round(sub * promo);
      return { shipping, discount, total: sub + shipping - discount };
    };
    const val = (n) => new FormData(form).get(n) ?? '';

    const paint = () => {
      const t = totals();
      panels.forEach((p) => (p.hidden = Number(p.dataset.step) !== step));
      st.value = step;
      back.hidden = step === 1 || step === 4;
      next.hidden = step === 4;
      next.textContent = step === 1 ? 'Continuar al pago' : step === 2 ? 'Revisar pedido' : `Pagar ${money(t.total)}`;
      main.classList.toggle('done', step === 4);
      $('.t-ship').textContent = t.shipping ? money(t.shipping) : 'Gratis';
      $('.t-disc').textContent = t.discount ? `− ${money(t.discount)}` : '—';
      $('.t-total').textContent = money(t.total);
      if (step === 3) {
        const f = new FormData(form);
        const num = String(f.get('number') || '').replace(/\s/g, '');
        $('.rv-ship').textContent = `${f.get('first')} ${f.get('last')}, ${f.get('address')}, ${f.get('city')} ${f.get('zip')}`;
        $('.rv-method').textContent = ship === 'express' ? 'Express · 1–2 días' : 'Estándar · 3–5 días';
        $('.rv-pay').textContent = f.get('method') === 'transfer' ? 'Transferencia bancaria' : `Tarjeta terminada en ${num.slice(-4) || '····'}`;
      }
    };

    const check = (root) => {
      const bad = [...root.querySelectorAll('ui-input, ui-select')].find((f) => !f.checkValidity());
      if (bad) { bad.reportValidity(); return false; }
      return true;
    };

    next.addEventListener('click', async () => {
      if (step === 1 && !check($('[data-step="1"]'))) return;
      if (step === 2 && val('method') !== 'transfer' && !check($('.cardf'))) return;
      if (step === 3) {
        if (!terms.checked) return toast.warning('Acepta los términos para continuar', { title: 'Falta un paso' });
        next.loading = true;
        await wait(1400);
        next.loading = false;
        $('.order').textContent = `#${Math.floor(100000 + Math.random() * 900000)}`;
        step = 4;
        toast.success('Pago aprobado', { title: 'Gracias por tu compra' });
      } else step += 1;
      paint();
    });
    back.addEventListener('click', () => { step -= 1; paint(); });
    st.addEventListener('change', (e) => { step = e.detail.value; paint(); });
    $('ui-radio-group').addEventListener('change', (e) => { ship = e.detail.value; paint(); });
    $('ui-segmented').addEventListener('change', (e) => {
      const tr = e.detail.value === 'transfer';
      $('.cardf').hidden = tr;
      $('.tf').hidden = !tr;
    });
    $('[name=number]').addEventListener('input', (e) => {
      const i = e.currentTarget;
      i.value = i.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    });
    $('[data-a=promo]').onclick = () => {
      const code = $('[name=promo]').value.trim().toUpperCase();
      if (code !== 'VERANO10') return toast.danger('Código inválido', { title: 'Cupón' });
      promo = 0.1;
      toast.success('10% de descuento aplicado', { title: 'Cupón' });
      paint();
    };
    $('[data-a=again]').onclick = () => {
      step = 1; ship = 'standard'; promo = 0;
      form.reset();
      terms.checked = false;
      paint();
    };

    paint();
    return el;
  },
};
