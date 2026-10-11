import { toast } from '../src/components/toast.js';
import { art, h, svg } from './_shared.js';

export default { title: 'Examples/Profile', parameters: { layout: 'fullscreen' } };

const posts = [
  ['Sistema de diseño en 30 días', '#6366f1', '#a855f7', 128],
  ['Notas sobre accesibilidad', '#10b981', '#06b6d4', 94],
  ['Del prototipo al producto', '#f97316', '#ef4444', 211],
  ['Micro-interacciones que importan', '#0ea5e9', '#6366f1', 76],
  ['Tipografía para dashboards', '#ec4899', '#f59e0b', 143],
  ['Mi flujo de trabajo en Figma', '#14b8a6', '#6366f1', 187],
];
const skills = [['Diseño de producto', 95], ['Prototipado', 88], ['Investigación', 76], ['Accesibilidad', 82]];

export const PublicProfile = {
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        .pf{max-width:62rem;margin:0 auto;padding:1.25rem}
        .pf .cover{display:block;width:100%;height:12rem;object-fit:cover;border-radius:1.25rem}
        .pf .head{display:flex;align-items:flex-end;gap:1rem;flex-wrap:wrap;padding:0 1.25rem;margin-top:-3.2rem}
        .pf .av{border-radius:50%;box-shadow:0 0 0 .3rem var(--ui-bg)}
        .pf .who{flex:1;min-width:12rem;padding-bottom:.25rem}
        .pf h1{margin:0;font-size:1.6rem}
        .pf p{margin:0}
        .pf .muted{color:var(--ui-muted)}
        .pf .cta{display:flex;gap:.6rem;align-items:center;padding-bottom:.25rem}
        .pf .stats{display:flex;gap:1.75rem;flex-wrap:wrap}
        .pf .stats strong{font-size:1.15rem}
        .pf .like{display:flex;align-items:center;gap:.3rem;font-size:.9rem}
        .pf .info{display:flex;justify-content:space-between;gap:1rem;padding:.7rem 0;border-bottom:1px solid var(--ui-border)}
        .pf .info:last-child{border:0}
      </style>
      <div class="pf"><div class="wrap"></div></div>`;
    const wrap = el.querySelector('.wrap');

    wrap.innerHTML = `
      <ui-stack gap="lg">
        <ui-skeleton variant="rect" height="192"></ui-skeleton>
        <div style="display:flex;gap:1rem;align-items:center">
          <ui-skeleton variant="circle" width="96"></ui-skeleton>
          <ui-skeleton variant="text" lines="2" style="flex:1"></ui-skeleton>
        </div>
        <ui-grid min="14rem"><ui-skeleton variant="rect" height="200"></ui-skeleton><ui-skeleton variant="rect" height="200"></ui-skeleton><ui-skeleton variant="rect" height="200"></ui-skeleton></ui-grid>
      </ui-stack>`;

    setTimeout(() => {
      let followers = 1284;
      let following = false;
      wrap.innerHTML = `
        <ui-stack gap="lg">
          <div>
            <img class="cover" alt="" src="${art('#6366f1', '#ec4899', '', 1200, 360)}" />
            <div class="head">
              <ui-avatar class="av" size="xl" name="Camila Reyes" status="online"></ui-avatar>
              <div class="who"><h1>Camila Reyes</h1><p class="muted">@camilareyes · Diseñadora de producto en Acme</p></div>
              <div class="cta">
                <ui-button data-a="follow">Seguir</ui-button>
                <ui-button variant="outline" data-a="msg">Mensaje</ui-button>
                <ui-dropdown placement="bottom-end">
                  <ui-button slot="trigger" icon variant="ghost" label="Más">${svg('more', 18)}</ui-button>
                  <option value="share">Compartir perfil</option><option value="report">Reportar</option>
                  <option data-separator></option><option value="block" data-danger>Bloquear</option>
                </ui-dropdown>
              </div>
            </div>
          </div>

          <div class="stats">
            <div><strong class="fc">${followers.toLocaleString('es-MX')}</strong> <span class="muted">seguidores</span></div>
            <div><strong>312</strong> <span class="muted">siguiendo</span></div>
            <div><strong>48</strong> <span class="muted">publicaciones</span></div>
          </div>
          <p style="max-width:42rem;line-height:1.6">Diseño productos digitales que se sienten simples. Me apasionan los sistemas de diseño, la accesibilidad y los detalles pequeños.</p>
          <ui-stack direction="row" gap="sm" wrap>
            <ui-badge tone="accent">Diseño de producto</ui-badge><ui-badge tone="success">Mentora</ui-badge>
            <ui-badge tone="neutral" variant="outline">Tijuana, MX</ui-badge>
          </ui-stack>

          <ui-tabs value="posts" label="Perfil">
            <section data-tab="posts" data-label="Publicaciones">
              <ui-grid min="15rem" gap="lg">
                ${posts.map(([t, a, b, n], i) => `
                  <ui-card variant="outlined" interactive>
                    <img slot="media" alt="" src="${art(a, b, '', 640, 360)}" />
                    <span slot="header">${t}</span>
                    <span class="muted" style="font-size:.9rem">Lectura de 5 min</span>
                    <div slot="footer" class="like">
                      <ui-button icon variant="ghost" size="sm" label="Me gusta" data-like="${i}">${svg('heart', 16)}</ui-button>
                      <span data-n="${i}">${n}</span>
                    </div>
                  </ui-card>`).join('')}
              </ui-grid>
            </section>
            <section data-tab="gallery" data-label="Galería">
              <ui-carousel per-view="2" loop label="Galería" style="--ui-carousel-aspect:4/3">
                ${posts.map(([t, a, b]) => `<img alt="${t}" src="${art(a, b, t.split(' ')[0], 640, 480)}" />`).join('')}
              </ui-carousel>
            </section>
            <section data-tab="about" data-label="Acerca de">
              <ui-grid min="20rem" gap="lg">
                <ui-card variant="outlined"><span slot="header">Información</span>
                  <div class="info"><span class="muted">Ubicación</span><span>Tijuana, México</span></div>
                  <div class="info"><span class="muted">Trabajo</span><span>Acme</span></div>
                  <div class="info"><span class="muted">Se unió</span><span>marzo de 2023</span></div>
                </ui-card>
                <ui-card variant="outlined"><span slot="header">Habilidades</span>
                  <ui-stack gap="lg">${skills.map(([s, v]) => `<ui-progress value="${v}" label="${s}" show-value size="sm"></ui-progress>`).join('')}</ui-stack>
                </ui-card>
              </ui-grid>
            </section>
          </ui-tabs>
        </ui-stack>`;

      const $ = (s) => wrap.querySelector(s);
      const follow = $('[data-a=follow]');
      follow.onclick = () => {
        following = !following;
        followers += following ? 1 : -1;
        follow.textContent = following ? 'Siguiendo' : 'Seguir';
        follow.setAttribute('variant', following ? 'outline' : 'solid');
        $('.fc').textContent = followers.toLocaleString('es-MX');
        if (following) toast.success('Ahora sigues a Camila');
      };
      $('[data-a=msg]').onclick = () => toast.info('Aquí abriría el chat', { title: 'Mensaje' });
      $('ui-dropdown').addEventListener('select', (e) => toast.info(`Acción: ${e.detail.value}`));

      wrap.querySelectorAll('[data-like]').forEach((b) => {
        let on = false;
        const n = wrap.querySelector(`[data-n="${b.dataset.like}"]`);
        b.onclick = () => {
          on = !on;
          n.textContent = Number(n.textContent) + (on ? 1 : -1);
          b.style.color = on ? 'var(--ui-danger)' : '';
          b.firstElementChild.setAttribute('fill', on ? 'currentColor' : 'none');
        };
      });
    }, 900);

    return el;
  },
};
