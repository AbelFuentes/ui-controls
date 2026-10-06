export default {
  title: 'Examples/Wizard',
  parameters: { layout: 'centered' },
};

export const Onboarding = {
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        .card{width:min(30rem,92vw);display:grid;gap:1.75rem;padding:1.75rem;border-radius:1.25rem;
          background:color-mix(in srgb,currentColor 6%,transparent);
          box-shadow:inset 0 0 0 1px color-mix(in srgb,currentColor 12%,transparent)}
        .panel{display:grid;gap:1.25rem;min-height:12rem;align-content:start;animation:in .35s cubic-bezier(.2,.8,.2,1)}
        .panel[hidden]{display:none}
        @keyframes in{from{opacity:0;transform:translateY(.5rem)}}
        h3{margin:0}
        .field{display:grid;gap:.6rem}
        .field>span{font-size:.75rem;font-weight:600;opacity:.6;text-transform:uppercase;letter-spacing:.06em}
        .row{display:flex;justify-content:space-between;align-items:center;gap:1rem}
        .actions{display:flex;justify-content:space-between;gap:.75rem}
        .actions button[hidden]{display:none}
        .go,.ghost{all:unset;cursor:pointer;text-align:center;padding:.75rem 1.4rem;border-radius:.8rem;font-weight:600;
          transition:transform .15s,opacity .2s}
        .go{margin-left:auto;color:#fff;background:linear-gradient(135deg,var(--ui-accent,#6366f1),var(--ui-accent-2,#a855f7))}
        .ghost{box-shadow:inset 0 0 0 1px color-mix(in srgb,currentColor 25%,transparent)}
        .go:active,.ghost:active{transform:scale(.96)}
        .go[disabled]{opacity:.4;cursor:not-allowed}
        .go:focus-visible,.ghost:focus-visible{outline:.15rem solid var(--ui-accent,#6366f1);outline-offset:.2rem}
        pre{margin:0;padding:1rem;border-radius:.8rem;font:inherit;font-size:.9rem;line-height:1.7;
          background:color-mix(in srgb,currentColor 7%,transparent)}
        .done{place-items:center;text-align:center;align-content:center}
        .badge{width:3.5rem;height:3.5rem;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:1.6rem;
          background:linear-gradient(135deg,var(--ui-accent,#6366f1),var(--ui-accent-2,#a855f7))}
      </style>

      <form class="card">
        <ui-stepper clickable value="1" size="sm" label="Onboarding">
          <li>Plan</li><li>Ajustes</li><li>Confirmar</li>
        </ui-stepper>

        <section class="panel" data-step="1">
          <h3>Elige tu plan</h3>
          <ui-radio-group name="plan" value="pro" label="Plan">
            <ui-radio value="free">Free · para empezar</ui-radio>
            <ui-radio value="pro">Pro · para creadores</ui-radio>
            <ui-radio value="team">Team · para equipos</ui-radio>
          </ui-radio-group>
        </section>

        <section class="panel" data-step="2" hidden>
          <h3>Ajusta tu espacio</h3>
          <div class="field"><span>Facturación</span>
            <ui-segmented name="period" value="month" label="Facturación">
              <option value="month">Mensual</option>
              <option value="year">Anual</option>
            </ui-segmented>
          </div>
          <div class="field"><span>Asientos</span>
            <ui-slider name="seats" value="5" min="1" max="50" label="Asientos" style="width:100%"></ui-slider>
          </div>
          <div class="row">Notificaciones
            <ui-toggle name="notifications" checked label="Notificaciones"></ui-toggle>
          </div>
        </section>

        <section class="panel" data-step="3" hidden>
          <h3>Confirma tus datos</h3>
          <pre class="summary"></pre>
          <ui-checkbox name="terms">Acepto los términos</ui-checkbox>
        </section>

        <section class="panel done" data-step="4" hidden>
          <div class="badge">✓</div>
          <h3>¡Todo listo!</h3>
          <button type="button" class="ghost" data-a="reset">Reiniciar</button>
        </section>

        <div class="actions">
          <button type="button" class="ghost" data-a="back" hidden>Atrás</button>
          <button type="button" class="go" data-a="next">Siguiente</button>
        </div>
      </form>`;

    const form = el.querySelector('form');
    const st = el.querySelector('ui-stepper');
    const panels = [...el.querySelectorAll('.panel')];
    const back = el.querySelector('[data-a=back]');
    const next = el.querySelector('[data-a=next]');
    const terms = el.querySelector('ui-checkbox');
    const summary = el.querySelector('.summary');
    const LAST = 3;
    let step = 1;

    const render = () => {
      panels.forEach((p) => (p.hidden = Number(p.dataset.step) !== step));
      st.value = step;
      back.hidden = step === 1 || step === 4;
      next.hidden = step === 4;
      next.textContent = step === LAST ? 'Finalizar' : 'Siguiente';
      next.disabled = step === LAST && !terms.checked;
      if (step === LAST) {
        const d = Object.fromEntries(new FormData(form));
        summary.textContent =
          `Plan: ${d.plan}\nFacturación: ${d.period === 'year' ? 'anual' : 'mensual'}\n` +
          `Asientos: ${d.seats}\nNotificaciones: ${d.notifications ? 'sí' : 'no'}`;
      }
    };

    form.addEventListener('submit', (e) => e.preventDefault());
    st.addEventListener('change', (e) => { step = e.detail.value; render(); });
    terms.addEventListener('change', render);
    back.addEventListener('click', () => { step -= 1; render(); });
    next.addEventListener('click', () => { step += 1; render(); });
    el.querySelector('[data-a=reset]').addEventListener('click', () => {
      terms.checked = false;
      step = 1;
      render();
    });

    render();
    return el;
  },
};
