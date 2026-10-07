import { toast } from '../src/components/toast.js';

export default { title: 'Examples/Pricing', parameters: { layout: 'fullscreen' } };

const check = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="flex:none;color:var(--ui-success)"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';

const plans = [
  { id: 'free', name: 'Free', desc: 'Para empezar', m: 0, y: 0, features: ['1 proyecto', 'Comunidad', '5 GB de espacio'] },
  { id: 'pro', name: 'Pro', desc: 'Para creadores', m: 19, y: 15, popular: true,
    features: ['Proyectos ilimitados', 'Soporte prioritario', '100 GB de espacio', 'Exportación de datos'] },
  { id: 'team', name: 'Team', desc: 'Para equipos', m: 49, y: 39,
    features: ['Todo en Pro', 'Roles y permisos', 'SSO', '1 TB de espacio'] },
];

export const Plans = {
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        .pr{max-width:62rem;margin:0 auto;padding:3rem 1.25rem}
        .pr h1{margin:0;font-size:clamp(1.8rem,4vw,2.6rem);letter-spacing:-.02em}
        .pr .sub{margin:0;color:var(--ui-muted)}
        .pr ul{list-style:none;margin:1rem 0 0;padding:0;display:grid;gap:.6rem}
        .pr li{display:flex;gap:.6rem;align-items:center;font-size:.95rem}
        .pr .amount{font-size:2.6rem;font-weight:800;letter-spacing:-.03em;line-height:1}
        .pr .per{color:var(--ui-muted);font-size:.9rem}
        .pr .hot{border-radius:1.25em;box-shadow:0 0 0 2px var(--ui-accent),0 1.5rem 3rem -1rem color-mix(in srgb,var(--ui-accent) 55%,transparent)}
      </style>
      <div class="pr">
        <ui-stack gap="xl">
          <ui-stack gap="sm" align="center" style="text-align:center">
            <h1>Precios simples y transparentes</h1>
            <p class="sub">Cambia de plan o cancela cuando quieras.</p>
            <ui-stack direction="row" align="center" gap="sm">
              <ui-segmented value="month" label="Facturación">
                <option value="month">Mensual</option>
                <option value="year">Anual</option>
              </ui-segmented>
              <ui-badge tone="success" size="sm">Ahorra 20%</ui-badge>
            </ui-stack>
          </ui-stack>

          <ui-grid min="16rem" gap="lg">
            ${plans.map((p) => `
              <ui-card class="${p.popular ? 'hot' : ''}">
                <span slot="header" style="display:flex;align-items:center;gap:.6rem">
                  ${p.name}${p.popular ? '<ui-badge size="sm" variant="solid">Popular</ui-badge>' : ''}
                </span>
                <div class="sub" style="font-size:.9rem">${p.desc}</div>
                <div style="display:flex;align-items:baseline;gap:.5rem;margin-top:1rem">
                  <span class="amount" data-id="${p.id}">$${p.m}</span><span class="per">/mes</span>
                </div>
                <ul>${p.features.map((f) => `<li>${check}${f}</li>`).join('')}</ul>
                <ui-button slot="footer" block variant="${p.popular ? 'solid' : 'outline'}" data-plan="${p.name}" style="flex:1">
                  Elegir ${p.name}
                </ui-button>
              </ui-card>`).join('')}
          </ui-grid>

          <ui-accordion style="max-width:44rem;width:100%;margin:0 auto">
            <section data-title="¿Puedo cambiar de plan después?" open>Sí, puedes subir o bajar de plan en cualquier momento; el cobro se prorratea.</section>
            <section data-title="¿Hay periodo de prueba?">El plan Pro incluye 14 días de prueba sin tarjeta.</section>
            <section data-title="¿Qué métodos de pago aceptan?">Tarjetas de crédito y débito, y transferencia en planes anuales.</section>
          </ui-accordion>
        </ui-stack>
      </div>`;

    el.querySelector('ui-segmented').addEventListener('change', (e) => {
      const yearly = e.detail.value === 'year';
      el.querySelectorAll('.amount').forEach((n) => {
        const p = plans.find((x) => x.id === n.dataset.id);
        n.textContent = `$${yearly ? p.y : p.m}`;
      });
      el.querySelectorAll('.per').forEach((n) => (n.textContent = yearly ? '/mes, facturado anual' : '/mes'));
    });
    el.querySelectorAll('[data-plan]').forEach((b) => {
      b.onclick = () => toast.success(`Elegiste el plan ${b.dataset.plan}`, { title: 'Listo' });
    });
    return el;
  },
};
