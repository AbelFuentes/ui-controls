export default {
  title: 'Examples/Form',
  parameters: { layout: 'centered' },
};

export const Settings = {
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        .card{width:min(26rem,92vw);display:grid;gap:1.4rem;padding:1.75rem;border-radius:1.25rem;
          background:color-mix(in srgb,currentColor 6%,transparent);
          box-shadow:inset 0 0 0 1px color-mix(in srgb,currentColor 12%,transparent)}
        .row{display:flex;justify-content:space-between;align-items:center;gap:1rem}
        .field{display:grid;gap:.6rem}
        .field>span{font-size:.75rem;font-weight:600;opacity:.6;text-transform:uppercase;letter-spacing:.06em}
        .go{all:unset;cursor:pointer;text-align:center;padding:.8rem;border-radius:.8rem;font-weight:600;color:#fff;
          background:linear-gradient(135deg,var(--ui-accent,#6366f1),var(--ui-accent-2,#a855f7))}
        .go:focus-visible{outline:.15rem solid var(--ui-accent,#6366f1);outline-offset:.2rem}
        pre{margin:0;font-size:.8rem;opacity:.8;white-space:pre-wrap}
      </style>

      <form class="card">
        <h3 style="margin:0">Preferencias</h3>

        <div class="field"><span>Plan</span>
          <ui-radio-group name="plan" value="pro" orientation="horizontal" label="Plan">
            <ui-radio value="free">Free</ui-radio>
            <ui-radio value="pro">Pro</ui-radio>
            <ui-radio value="team">Team</ui-radio>
          </ui-radio-group>
        </div>

        <div class="field"><span>Facturación</span>
          <ui-segmented name="period" value="month" label="Facturación">
            <option value="month">Mensual</option>
            <option value="year">Anual</option>
          </ui-segmented>
        </div>

        <div class="field"><span>Volumen</span>
          <ui-slider name="volume" value="40" label="Volumen" style="width:100%"></ui-slider>
        </div>

        <div class="row">Notificaciones
          <ui-toggle name="notifications" checked label="Notificaciones"></ui-toggle>
        </div>

        <ui-checkbox name="terms" checked>Acepto los términos</ui-checkbox>

        <button class="go">Guardar</button>
        <pre class="out">Envía el formulario para ver los valores.</pre>
      </form>`;

    const form = el.querySelector('form');
    const out = el.querySelector('.out');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      out.textContent = JSON.stringify(Object.fromEntries(new FormData(form)), null, 2);
    });
    return el;
  },
};
