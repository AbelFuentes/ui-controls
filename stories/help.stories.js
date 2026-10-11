import { toast } from '../src/components/toast.js';
import { svg } from './_shared.js';

export default { title: 'Examples/HelpCenter', parameters: { layout: 'fullscreen' } };

const cats = [
  ['Primeros pasos', 'Crea tu cuenta y configura tu espacio', 'rocket', 12],
  ['Facturación', 'Planes, pagos y facturas', 'card', 9],
  ['Seguridad', 'Contraseñas, 2FA y accesos', 'shield', 7],
  ['Equipo', 'Roles, permisos e invitaciones', 'users', 10],
  ['Integraciones', 'Conecta tus herramientas', 'zap', 14],
  ['Cuenta', 'Perfil, avisos y preferencias', 'user', 8],
].map(([t, d, i, n]) => [t, d, i === 'rocket' ? 'zap' : i, n]);

const faqs = [
  ['¿Cómo cambio mi plan?', 'Ve a Ajustes → Facturación y elige el plan. El cambio se prorratea al instante.'],
  ['¿Puedo cancelar en cualquier momento?', 'Sí. Conservas el acceso hasta el final del periodo ya pagado.'],
  ['¿Cómo activo la verificación en dos pasos?', 'En Ajustes → Seguridad activa 2FA y escanea el código con tu app de autenticación.'],
  ['¿Cómo invito a mi equipo?', 'En Equipo pulsa «Invitar persona», escribe los correos y elige un rol.'],
  ['¿Dónde descargo mis facturas?', 'En Facturación → Historial puedes descargar cada factura en PDF.'],
  ['¿Qué integraciones existen?', 'Tenemos integraciones con Slack, GitHub, Google Drive y más de 30 herramientas.'],
];

export const Support = {
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        .hc section.hero{padding:4rem 1.25rem 5rem;text-align:center;color:#fff;
          background:linear-gradient(135deg,var(--ui-accent),var(--ui-accent-2))}
        .hc .hero h1{margin:0 0 .5rem;font-size:clamp(1.8rem,4vw,2.6rem);letter-spacing:-.02em}
        .hc .hero p{margin:0 0 1.5rem;opacity:.9}
        .hc .search{max-width:34rem;margin:0 auto}
        .hc .page{max-width:62rem;margin:-2.5rem auto 0;padding:0 1.25rem 4rem}
        .hc h2{margin:0;font-size:1.3rem}
        .hc .muted{color:var(--ui-muted)}
        .hc .ic{width:2.6rem;height:2.6rem;border-radius:.9rem;display:grid;place-items:center;color:#fff;margin-bottom:.8rem;
          background:linear-gradient(135deg,var(--ui-accent),var(--ui-accent-2))}
        .hc .cat strong{display:block;margin-bottom:.2rem}
        .hc .cat span{color:var(--ui-muted);font-size:.9rem}
      </style>
      <div class="hc">
        <section class="hero">
          <h1>¿En qué podemos ayudarte?</h1>
          <p>Busca en el centro de ayuda o explora por tema.</p>
          <ui-card class="search" padding="sm"><ui-input type="search" label="Buscar artículos"></ui-input></ui-card>
        </section>

        <div class="page">
          <ui-stack gap="xl">
            <ui-card padding="sm" variant="outlined" style="max-width:22rem;margin-left:auto">
              <div style="display:flex;align-items:center;gap:.7rem"><ui-badge tone="success" dot pulse>Operativo</ui-badge><span class="muted" style="font-size:.9rem">Todos los sistemas funcionan</span></div>
            </ui-card>

            <ui-grid min="15rem" gap="lg">
              ${cats.map(([t, d, ic, n]) => `
                <ui-card class="cat" interactive variant="outlined">
                  <div class="ic">${svg(ic, 20)}</div><strong>${t}</strong><span>${d}</span>
                  <ui-badge slot="footer" tone="neutral" size="sm">${n} artículos</ui-badge>
                </ui-card>`).join('')}
            </ui-grid>

            <ui-stack gap="lg">
              <h2>Preguntas frecuentes</h2>
              <ui-accordion class="faq"></ui-accordion>
              <ui-alert class="none" tone="info" hidden>No encontramos resultados. Prueba con otras palabras o escríbenos abajo.</ui-alert>
            </ui-stack>

            <ui-card padding="lg">
              <span slot="header">¿No encuentras lo que buscas?</span>
              <form novalidate>
                <ui-stack gap="lg">
                  <ui-grid min="14rem">
                    <ui-input name="email" type="email" label="Tu correo" required></ui-input>
                    <ui-select name="topic" label="Tema" required>
                      <option value="billing">Facturación</option><option value="tech">Problema técnico</option><option value="other">Otro</option>
                    </ui-select>
                  </ui-grid>
                  <ui-textarea name="msg" label="Cuéntanos qué pasa" required minlength="10" maxlength="500" autosize rows="3" maxrows="8"></ui-textarea>
                  <div><ui-button type="submit">Enviar mensaje</ui-button></div>
                </ui-stack>
              </form>
            </ui-card>
          </ui-stack>
        </div>
      </div>`;

    const $ = (s) => el.querySelector(s);
    const faq = $('.faq');
    const render = (q = '') => {
      const list = faqs.filter(([a, b]) => `${a} ${b}`.toLowerCase().includes(q));
      faq.replaceChildren(...list.map(([a, b], i) => {
        const s = document.createElement('section');
        s.dataset.title = a;
        s.textContent = b;
        if (i === 0 && !q) s.setAttribute('open', '');
        return s;
      }));
      faq.hidden = list.length === 0;
      $('.none').hidden = list.length > 0;
    };
    $('ui-input').addEventListener('input', (e) => render(e.currentTarget.value.trim().toLowerCase()));

    const form = $('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = [...form.querySelectorAll('ui-input, ui-select, ui-textarea')].find((f) => !f.checkValidity());
      if (bad) return bad.reportValidity();
      toast.success('Te responderemos en menos de 24 horas', { title: 'Mensaje enviado' });
      form.reset();
    });

    render();
    return el;
  },
};
