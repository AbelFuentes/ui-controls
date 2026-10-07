import { toast } from '../src/components/toast.js';

export default { title: 'Examples/Landing', parameters: { layout: 'fullscreen' } };

const art = (a, b, t) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 440"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="960" height="440" fill="url(#g)"/><circle cx="780" cy="110" r="150" fill="#fff" opacity=".16"/><circle cx="160" cy="380" r="200" fill="#fff" opacity=".1"/><rect x="60" y="60" width="360" height="22" rx="11" fill="#fff" opacity=".5"/><rect x="60" y="100" width="240" height="14" rx="7" fill="#fff" opacity=".3"/><text x="60" y="390" font-family="system-ui,sans-serif" font-size="56" font-weight="800" fill="#fff" opacity=".92">${t}</text></svg>`
  )}`;

const shots = [
  ['#6366f1', '#a855f7', 'Panel'],
  ['#0ea5e9', '#6366f1', 'Reportes'],
  ['#10b981', '#06b6d4', 'Equipo'],
  ['#f97316', '#ef4444', 'Automatizaciones'],
];

const icon = (d) =>
  `<div class="ic"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg></div>`;

const features = [
  ['Rápido', 'Interfaz fluida con respuestas al instante.', 'M13 2L4 14h7l-1 8 9-12h-7z'],
  ['Seguro', 'Cifrado de extremo a extremo y SSO.', 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z'],
  ['Hecho con cariño', 'Detalles cuidados en cada componente.', 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z'],
  ['Modular', 'Usa solo lo que necesitas.', 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5'],
  ['Para developers', 'Web Components sin dependencias.', 'M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14'],
  ['Global', 'Soporte de idiomas y zonas horarias.', 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18'],
];

const quotes = [
  ['Ana López', 'Diseño', 'Pasamos de prototipo a producción en una semana.'],
  ['Beto Ruiz', 'Ingeniería', 'Los componentes funcionan en cualquier framework. Un sueño.'],
  ['Carla Gil', 'Producto', 'Nuestro equipo por fin habla el mismo idioma visual.'],
];

export const Marketing = {
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        .ld{overflow-x:hidden}
        .ld section{max-width:68rem;margin:0 auto;padding:3.5rem 1.25rem}
        .ld nav{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:.5rem;padding:.75rem 1.25rem;
          backdrop-filter:blur(14px);background:color-mix(in srgb,var(--ui-surface) 80%,transparent);
          border-bottom:1px solid var(--ui-border)}
        .ld .logo{font-weight:800;font-size:1.15rem;margin-right:auto}
        .ld h1{font-size:clamp(2.2rem,6vw,4rem);line-height:1.05;margin:0;letter-spacing:-.03em;font-weight:800}
        .ld h1 em{font-style:normal;background:linear-gradient(135deg,var(--ui-accent),var(--ui-accent-2));
          -webkit-background-clip:text;background-clip:text;color:transparent}
        .ld h2{margin:0;font-size:clamp(1.5rem,3.5vw,2.1rem);letter-spacing:-.02em}
        .ld .lead{margin:0;color:var(--ui-muted);font-size:1.1rem;max-width:36rem;line-height:1.6}
        .ld .ic{width:2.8rem;height:2.8rem;border-radius:.9rem;display:grid;place-items:center;color:#fff;margin-bottom:.9rem;
          background:linear-gradient(135deg,var(--ui-accent),var(--ui-accent-2))}
        .ld h3{margin:0 0 .4rem;font-size:1.05rem}
        .ld p{margin:0}
        .ld .muted{color:var(--ui-muted);line-height:1.55}
        .ld .stack-av{display:flex}
        .ld .stack-av ui-avatar{margin-left:-.5rem;border-radius:50%;box-shadow:0 0 0 .2rem var(--ui-bg)}
        .ld .stack-av ui-avatar:first-child{margin-left:0}
        .ld footer{border-top:1px solid var(--ui-border);color:var(--ui-muted);font-size:.9rem}
      </style>

      <div class="ld">
        <nav>
          <span class="logo">Aurora</span>
          <ui-button variant="ghost" size="sm">Producto</ui-button>
          <ui-button variant="ghost" size="sm">Precios</ui-button>
          <ui-button variant="ghost" size="sm">Docs</ui-button>
          <ui-theme-switch size="sm"></ui-theme-switch>
          <ui-button size="sm" pill>Empezar</ui-button>
        </nav>

        <section style="text-align:center">
          <ui-stack gap="lg" align="center">
            <ui-badge tone="accent" dot pulse>Nuevo · versión 2.0</ui-badge>
            <h1>Construye interfaces <em>hermosas</em> en minutos</h1>
            <p class="lead">Componentes atómicos, accesibles y listos para cualquier página. Sin dependencias.</p>
            <ui-stack direction="row" gap="sm" justify="center" wrap>
              <ui-button size="lg" pill data-a="cta">Probar gratis</ui-button>
              <ui-button size="lg" pill variant="outline">Ver demo</ui-button>
            </ui-stack>
            <ui-stack direction="row" gap="sm" align="center">
              <div class="stack-av">
                ${quotes.concat([['Dan Paz'], ['Eva Mar']]).map(([n]) => `<ui-avatar name="${n}" size="sm"></ui-avatar>`).join('')}
              </div>
              <span class="muted" style="font-size:.9rem">Más de 2,000 equipos ya lo usan</span>
            </ui-stack>
          </ui-stack>
        </section>

        <section style="padding-top:0">
          <ui-carousel autoplay="4500" loop label="Capturas del producto" style="--ui-carousel-aspect:960/440">
            ${shots.map(([a, b, t]) => `<img alt="${t}" src="${art(a, b, t)}" />`).join('')}
          </ui-carousel>
        </section>

        <section>
          <ui-stack gap="xl">
            <ui-stack gap="sm" align="center" style="text-align:center">
              <h2>Todo lo que necesitas</h2>
              <p class="lead">Un sistema completo, consistente y personalizable.</p>
            </ui-stack>
            <ui-grid min="15rem" gap="lg">
              ${features.map(([t, d, p]) => `
                <ui-card variant="outlined">
                  ${icon(p)}<h3>${t}</h3><p class="muted">${d}</p>
                </ui-card>`).join('')}
            </ui-grid>
          </ui-stack>
        </section>

        <section>
          <ui-stack gap="xl">
            <h2 style="text-align:center">Lo que dicen los equipos</h2>
            <ui-grid min="16rem" gap="lg">
              ${quotes.map(([n, r, q]) => `
                <ui-card>
                  <p style="line-height:1.6">“${q}”</p>
                  <div slot="footer" style="display:flex;align-items:center;gap:.7rem">
                    <ui-avatar name="${n}" size="sm"></ui-avatar>
                    <div><strong style="font-size:.9rem">${n}</strong><div class="muted" style="font-size:.8rem">${r}</div></div>
                  </div>
                </ui-card>`).join('')}
            </ui-grid>
          </ui-stack>
        </section>

        <section>
          <ui-card variant="soft" padding="lg">
            <ui-stack gap="lg" align="center" style="text-align:center">
              <h2>Empieza hoy</h2>
              <p class="lead">Déjanos tu correo y te enviamos acceso anticipado.</p>
              <form novalidate style="display:flex;gap:.75rem;width:min(30rem,100%);align-items:flex-start">
                <ui-input type="email" label="Correo" required style="flex:1"></ui-input>
                <ui-button type="submit" size="lg" style="margin-top:.1rem">Unirme</ui-button>
              </form>
            </ui-stack>
          </ui-card>
        </section>

        <footer>
          <section style="padding-block:1.5rem;display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap">
            <span>© Aurora</span>
            <ui-stack direction="row" gap="lg"><span>Privacidad</span><span>Términos</span><span>Contacto</span></ui-stack>
          </section>
        </footer>
      </div>`;

    el.querySelector('[data-a=cta]').onclick = () => toast.info('¡Gracias por tu interés!', { title: 'Aurora' });
    const form = el.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('ui-input');
      if (!input.checkValidity()) { input.reportValidity(); return; }
      toast.success('Te avisaremos pronto', { title: 'Estás en la lista' });
      input.value = '';
    });
    return el;
  },
};
