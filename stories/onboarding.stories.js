import { toast } from '../src/components/toast.js';
import { svg } from './_shared.js';

export default { title: 'Examples/Onboarding', parameters: { layout: 'fullscreen' } };

const goals = [
  ['tasks', 'Organizar tareas', 'Listas, tableros y fechas', 'check'],
  ['team', 'Trabajar en equipo', 'Comentarios y menciones', 'users'],
  ['report', 'Medir resultados', 'Reportes y métricas', 'chart'],
  ['auto', 'Automatizar', 'Flujos sin código', 'zap'],
];

export const Setup = {
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        .ob{min-height:100vh;display:grid;place-items:center;padding:1.5rem;
          background:radial-gradient(50rem 26rem at 50% -10%,color-mix(in srgb,var(--ui-accent) 18%,transparent),transparent)}
        .ob h2{margin:0;font-size:1.4rem}
        .ob p{margin:0}
        .ob .muted{color:var(--ui-muted)}
        .ob .panel[hidden]{display:none}
        .ob .goal{text-align:left}
        .ob .goal .ic{width:2.4rem;height:2.4rem;border-radius:.8rem;display:grid;place-items:center;color:#fff;margin-bottom:.6rem;
          background:linear-gradient(135deg,var(--ui-accent),var(--ui-accent-2))}
        .ob .goal strong{display:block}
        .ob .goal span{color:var(--ui-muted);font-size:.85rem}
        .ob .row{display:flex;justify-content:space-between;align-items:center;gap:1rem}
        .ob .ok{place-items:center;text-align:center;display:grid;gap:1rem;padding:.5rem 0}
        .ob .badge{width:3.5rem;height:3.5rem;border-radius:50%;display:grid;place-items:center;color:#fff;
          background:linear-gradient(135deg,var(--ui-success),#06b6d4)}
        .ob ui-card.done::part(footer){display:none}
      </style>
      <div class="ob">
        <ui-card class="card" padding="lg" style="width:min(38rem,100%)">
          <ui-stack gap="lg">
            <ui-progress class="prog" value="25" label="Paso 1 de 4" show-value></ui-progress>

            <section class="panel" data-step="1">
              <ui-stack gap="lg">
                <div><h2>¿Qué quieres lograr?</h2><p class="muted">Elige todo lo que aplique.</p></div>
                <ui-grid min="14rem" gap="sm">
                  ${goals.map(([id, t, d, ic]) => `
                    <ui-card class="goal" data-goal="${id}" variant="outlined" padding="sm" interactive>
                      <div class="ic">${svg(ic, 20)}</div><strong>${t}</strong><span>${d}</span>
                    </ui-card>`).join('')}
                </ui-grid>
              </ui-stack>
            </section>

            <section class="panel" data-step="2" hidden>
              <ui-stack gap="lg">
                <div><h2>Crea tu espacio</h2><p class="muted">Podrás cambiarlo después.</p></div>
                <ui-input class="ws" label="Nombre del espacio" required hint="Por ejemplo, el nombre de tu empresa"></ui-input>
                <ui-select class="size" label="Tamaño del equipo" value="1-5">
                  <option value="1-5">1–5 personas</option><option value="6-20">6–20 personas</option><option value="21+">Más de 20</option>
                </ui-select>
                <ui-stack gap="sm"><strong>Uso principal</strong>
                  <ui-segmented class="use" value="team" label="Uso principal">
                    <option value="solo">Personal</option><option value="team">Equipo</option><option value="company">Empresa</option>
                  </ui-segmented>
                </ui-stack>
                <ui-slider class="load" label="Proyectos al mes" min="1" max="50" value="10" style="width:100%"></ui-slider>
              </ui-stack>
            </section>

            <section class="panel" data-step="3" hidden>
              <ui-stack gap="lg">
                <div><h2>Invita a tu equipo</h2><p class="muted">Un correo por línea. Puedes omitir este paso.</p></div>
                <ui-textarea class="mails" label="Correos" rows="4" autosize maxrows="8"></ui-textarea>
                <div class="row"><span>Enviar resumen semanal<br><span class="muted" style="font-size:.85rem">Los lunes por la mañana</span></span><ui-toggle checked label="Resumen semanal"></ui-toggle></div>
              </ui-stack>
            </section>

            <section class="panel ok" data-step="4" hidden>
              <div class="badge">${svg('check', 28)}</div>
              <h2>¡Todo listo!</h2>
              <p class="muted">Tu espacio <strong class="ws-name"></strong> está preparado.</p>
              <ui-stack direction="row" gap="sm" wrap justify="center" class="chosen"></ui-stack>
              <ui-button size="lg" data-a="go">Ir al panel</ui-button>
            </section>
          </ui-stack>
          <ui-button slot="footer" variant="ghost" data-a="skip">Omitir</ui-button>
          <ui-button slot="footer" variant="outline" data-a="back" hidden>Atrás</ui-button>
          <ui-button slot="footer" data-a="next" style="margin-left:auto">Continuar</ui-button>
        </ui-card>
      </div>`;

    const $ = (s) => el.querySelector(s);
    const panels = [...el.querySelectorAll('.panel')];
    const prog = $('.prog');
    const next = $('[data-a=next]');
    const back = $('[data-a=back]');
    const skip = $('[data-a=skip]');
    const picked = new Set();
    let step = 1;

    const paint = () => {
      panels.forEach((p) => (p.hidden = Number(p.dataset.step) !== step));
      prog.setAttribute('value', step * 25);
      prog.setAttribute('label', step === 4 ? 'Completado' : `Paso ${step} de 4`);
      back.hidden = step === 1 || step === 4;
      skip.hidden = step !== 3;
      next.hidden = step === 4;
      next.textContent = step === 3 ? 'Finalizar' : 'Continuar';
      $('.card').classList.toggle('done', step === 4);
      if (step === 4) {
        $('.ws-name').textContent = $('.ws').value;
        $('.chosen').innerHTML = [...picked].map((id) => `<ui-badge tone="accent">${goals.find((g) => g[0] === id)[1]}</ui-badge>`).join('');
      }
    };

    el.querySelectorAll('.goal').forEach((c) => {
      c.addEventListener('click', () => {
        const id = c.dataset.goal;
        picked.has(id) ? picked.delete(id) : picked.add(id);
        c.setAttribute('variant', picked.has(id) ? 'soft' : 'outlined');
      });
    });

    next.addEventListener('click', () => {
      if (step === 1 && picked.size === 0) return toast.warning('Elige al menos una opción', { title: 'Falta algo' });
      if (step === 2 && !$('.ws').checkValidity()) return $('.ws').reportValidity();
      step += 1;
      paint();
    });
    back.addEventListener('click', () => { step -= 1; paint(); });
    skip.addEventListener('click', () => { step = 4; paint(); });
    $('[data-a=go]').onclick = () => toast.success('Bienvenido a tu panel', { title: '¡Listo!' });

    paint();
    return el;
  },
};
