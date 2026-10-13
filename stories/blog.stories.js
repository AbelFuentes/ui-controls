import { toast } from '../src/components/toast.js';
import { art, h, svg } from './_shared.js';

export default { title: 'Examples/Blog', parameters: { layout: 'fullscreen' } };

const toc = [
  ['intro', 'Por qué importa'],
  ['atomos', 'Piensa en átomos'],
  ['tokens', 'Tokens primero'],
  ['accesible', 'Accesibilidad desde el día uno'],
  ['cierre', 'Cierre'],
];
const related = [
  ['Del prototipo al producto', '#f97316', '#ef4444', '6 min'],
  ['Tipografía para dashboards', '#ec4899', '#f59e0b', '4 min'],
  ['Micro-interacciones que importan', '#0ea5e9', '#6366f1', '5 min'],
];
const seed = [
  ['Beto Ruiz', 'hace 2 h', 'Excelente artículo. Lo de los tokens primero me ahorró mucho trabajo.'],
  ['Carla Gil', 'hace 5 h', '¿Tienen un ejemplo con temas claro y oscuro?'],
];

export const Article = {
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        .bl nav{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:.5rem;padding:.75rem 1.25rem;
          backdrop-filter:blur(14px);background:color-mix(in srgb,var(--ui-surface) 82%,transparent);
          border-bottom:1px solid var(--ui-border)}
        .bl .logo{font-weight:800;font-size:1.1rem;margin-right:auto}
        .bl .wrap{max-width:62rem;margin:0 auto;padding:2rem 1.25rem 4rem}
        .bl .muted{color:var(--ui-muted)}
        .bl .small{font-size:.85rem}
        .bl h1{margin:0;font-size:clamp(1.9rem,4.5vw,2.8rem);line-height:1.1;letter-spacing:-.03em}
        .bl .lead{margin:0;font-size:1.2rem;line-height:1.6;color:var(--ui-muted)}
        .bl .meta{display:flex;align-items:center;gap:.8rem;flex-wrap:wrap}
        .bl .sp{flex:1}
        .bl .cover{display:block;width:100%;aspect-ratio:16/7;object-fit:cover;border-radius:1.25rem}
        .bl .cols{display:grid;grid-template-columns:minmax(0,1fr) 13rem;gap:3rem;align-items:start}
        @media (max-width:960px){.bl .cols{grid-template-columns:1fr}.bl .toc{display:none}}
        .bl .art{max-width:44rem}
        .bl .art h2{margin:2.4rem 0 .7rem;font-size:1.5rem;letter-spacing:-.01em;scroll-margin-top:5rem}
        .bl .art h2:first-child{margin-top:0}
        .bl .art p{margin:0 0 1.1rem;font-size:1.05rem;line-height:1.8}
        .bl .art blockquote{margin:1.6rem 0;padding:.3rem 1.25rem;border-left:.25rem solid var(--ui-accent);
          color:var(--ui-muted);font-size:1.15rem;font-style:italic;line-height:1.6}
        .bl .art pre{margin:1.4rem 0;padding:1rem 1.2rem;border-radius:1rem;overflow:auto;font-size:.88rem;line-height:1.6;
          background:color-mix(in srgb,currentColor 7%,transparent)}
        .bl .toc{position:sticky;top:5rem;display:grid;gap:.15rem;font-size:.9rem}
        .bl .toc strong{margin-bottom:.4rem;font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;color:var(--ui-muted)}
        .bl .toc a{color:var(--ui-muted);text-decoration:none;padding:.35rem .75rem;border-left:2px solid var(--ui-border);
          transition:color .2s,border-color .2s}
        .bl .toc a:hover{color:var(--ui-text)}
        .bl .toc a.on{color:var(--ui-accent);border-color:var(--ui-accent);font-weight:600}
        .bl .cm{display:flex;gap:.8rem;padding:1rem 0;border-bottom:1px solid var(--ui-border)}
        .bl .cm:last-child{border:0}
        .bl .cm p{margin:.15rem 0 0;line-height:1.55}
        .bl h3.s{margin:0;font-size:1.25rem}
      </style>

      <div class="bl">
        <ui-progress class="rp" value="0" style="--ui-progress-size:5px;position:fixed;top:0;left:0;right:0;z-index:60"></ui-progress>
        <nav>
          <span class="logo">Bitácora</span>
          <ui-button variant="ghost" size="sm">Artículos</ui-button>
          <ui-button variant="ghost" size="sm">Autores</ui-button>
          <ui-theme-switch size="sm"></ui-theme-switch>
          <ui-button size="sm" pill>Suscribirme</ui-button>
        </nav>

        <div class="wrap">
          <ui-stack gap="xl">
            <ui-stack gap="lg">
              <ui-breadcrumb label="Ruta"><a href="#">Blog</a><a href="#">Diseño</a><span>Sistemas de componentes</span></ui-breadcrumb>
              <div><ui-badge tone="accent">Diseño de sistemas</ui-badge></div>
              <h1>Cómo diseñar un sistema de componentes que escale</h1>
              <p class="lead">Lo que aprendimos al pasar de diez botones sueltos a una biblioteca que usan cuatro equipos.</p>
              <div class="meta">
                <ui-avatar name="Camila Reyes"></ui-avatar>
                <div><strong>Camila Reyes</strong><div class="muted small">12 oct 2026 · 8 min de lectura</div></div>
                <span class="sp"></span>
                <ui-tooltip text="Guardar para después">
                  <ui-button icon variant="outline" size="sm" data-a="save" label="Guardar">${svg('bookmark', 16)}</ui-button>
                </ui-tooltip>
                <ui-dropdown placement="bottom-end">
                  <ui-button slot="trigger" icon variant="outline" size="sm" label="Compartir">${svg('share', 16)}</ui-button>
                  <option value="copy">Copiar enlace</option>
                  <option value="x">Compartir en X</option>
                  <option value="in">Compartir en LinkedIn</option>
                </ui-dropdown>
              </div>
            </ui-stack>

            <img class="cover" alt="" src="${art('#6366f1', '#ec4899', '', 1400, 600)}" />

            <div class="cols">
              <article class="art">
                <h2 id="intro" data-sec="intro">Por qué importa</h2>
                <p>Un sistema de componentes no es una colección de botones bonitos: es un acuerdo entre diseño e ingeniería sobre cómo se ve y se comporta todo lo que construimos. Cuando ese acuerdo existe, las pantallas nuevas se arman en horas y no en semanas.</p>
                <p>Cuando no existe, cada equipo reinventa el mismo selector de fechas con pequeñas diferencias, y nadie se atreve a cambiar nada por miedo a romper algo en otro lado.</p>
                <blockquote>Un buen sistema hace que lo correcto sea lo más fácil de hacer.</blockquote>

                <h2 id="atomos" data-sec="atomos">Piensa en átomos</h2>
                <p>Empieza por las piezas más pequeñas: botón, campo de texto, casilla. Cada una debe hacer una sola cosa y hacerla bien. Las piezas grandes, como un formulario o una tabla, son composiciones de las pequeñas, no componentes con cien opciones.</p>
                <ui-alert tone="info"><span slot="title">Regla práctica</span>Si un componente necesita más de cinco props de estilo, probablemente son dos componentes.</ui-alert>
                <pre><code>&lt;ui-button variant="soft"&gt;Guardar&lt;/ui-button&gt;
&lt;ui-input label="Correo" type="email" required&gt;&lt;/ui-input&gt;</code></pre>

                <h2 id="tokens" data-sec="tokens">Tokens primero</h2>
                <p>Colores, espacios y radios viven en variables, no en cada componente. Así, cambiar de marca o de tema es editar un archivo. Los componentes solo leen tokens; nunca valores sueltos.</p>
                <p>Un efecto secundario feliz: el modo oscuro deja de ser un proyecto y pasa a ser otro conjunto de valores para las mismas variables.</p>

                <h2 id="accesible" data-sec="accesible">Accesibilidad desde el día uno</h2>
                <p>Foco visible, roles correctos, navegación con teclado y respeto por el movimiento reducido no son extras: son parte del componente. Es mucho más barato hacerlo al construirlo que corregirlo después en veinte pantallas.</p>

                <h2 id="cierre" data-sec="cierre">Cierre</h2>
                <p>Empieza pequeño, documenta con ejemplos reales y mide qué componentes se usan de verdad. El mejor sistema es el que tu equipo quiere usar.</p>

                <ui-stack direction="row" gap="sm" align="center" wrap style="margin-top:2rem">
                  <ui-button variant="outline" size="sm" data-a="like">${svg('heart', 16, 'start')}<span class="lk">128</span></ui-button>
                  <ui-badge tone="neutral" variant="outline" size="sm">Diseño</ui-badge>
                  <ui-badge tone="neutral" variant="outline" size="sm">Accesibilidad</ui-badge>
                  <ui-badge tone="neutral" variant="outline" size="sm">Sistemas</ui-badge>
                </ui-stack>
              </article>

              <aside class="toc">
                <strong>En este artículo</strong>
                ${toc.map(([id, t]) => `<a href="#${id}" data-t="${id}">${t}</a>`).join('')}
              </aside>
            </div>

            <ui-card variant="soft">
              <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap">
                <ui-avatar name="Camila Reyes" size="lg"></ui-avatar>
                <div style="flex:1;min-width:14rem">
                  <strong>Camila Reyes</strong>
                  <div class="muted small">Diseñadora de producto. Escribe sobre sistemas de diseño y accesibilidad.</div>
                </div>
                <ui-button variant="outline" size="sm" data-a="follow">Seguir</ui-button>
              </div>
            </ui-card>

            <ui-stack gap="lg" style="max-width:44rem">
              <h3 class="s">Comentarios (<span class="cc">${seed.length}</span>)</h3>
              <ui-stack gap="sm">
                <ui-textarea class="ta" label="Escribe un comentario" autosize rows="2" maxrows="6"></ui-textarea>
                <div><ui-button size="sm" data-a="comment">Comentar</ui-button></div>
              </ui-stack>
              <div class="cms"></div>
            </ui-stack>

            <ui-card variant="soft" padding="lg">
              <ui-stack gap="lg" align="center" style="text-align:center">
                <h3 class="s">Recibe un artículo nuevo cada semana</h3>
                <form class="nl" novalidate style="display:flex;gap:.75rem;width:min(30rem,100%);align-items:flex-start">
                  <ui-input type="email" label="Correo" required style="flex:1"></ui-input>
                  <ui-button type="submit" style="margin-top:.1rem">Suscribirme</ui-button>
                </form>
              </ui-stack>
            </ui-card>

            <ui-stack gap="lg">
              <h3 class="s">Sigue leyendo</h3>
              <ui-grid min="15rem" gap="lg">
                ${related.map(([t, a, b, m]) => `
                  <ui-card variant="outlined" interactive>
                    <img slot="media" alt="" src="${art(a, b, '', 640, 360)}" />
                    <span slot="header">${t}</span>
                    <span class="muted small">${m} de lectura</span>
                  </ui-card>`).join('')}
              </ui-grid>
            </ui-stack>
          </ui-stack>
        </div>
      </div>`;

    const $ = (s) => el.querySelector(s);

    // progreso de lectura
    const rp = $('.rp');
    const onScroll = () => {
      if (!el.isConnected) return window.removeEventListener('scroll', onScroll);
      const d = document.documentElement;
      const max = d.scrollHeight - d.clientHeight;
      rp.value = max > 0 ? (d.scrollTop / max) * 100 : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // índice con sección activa
    const links = [...el.querySelectorAll('.toc a')];
    links.forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        el.querySelector(`[data-sec="${a.dataset.t}"]`).scrollIntoView({ behavior: 'smooth' });
      });
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) links.forEach((a) => a.classList.toggle('on', a.dataset.t === en.target.dataset.sec));
      });
    }, { rootMargin: '-15% 0px -75% 0px' });
    el.querySelectorAll('[data-sec]').forEach((s) => io.observe(s));

    // guardar, compartir, like, seguir
    let saved = false;
    $('[data-a=save]').onclick = (e) => {
      saved = !saved;
      e.currentTarget.style.color = saved ? 'var(--ui-accent)' : '';
      e.currentTarget.firstElementChild.setAttribute('fill', saved ? 'currentColor' : 'none');
      toast.info(saved ? 'Guardado en tu lista' : 'Quitado de tu lista');
    };
    $('ui-dropdown').addEventListener('select', async (e) => {
      if (e.detail.value === 'copy') {
        try {
          await navigator.clipboard.writeText(location.href);
          toast.success('Enlace copiado');
        } catch {
          toast.info('Copia el enlace desde la barra de direcciones');
        }
      } else toast.info(`Compartiendo en ${e.detail.value === 'x' ? 'X' : 'LinkedIn'}…`);
    });
    let likes = 128;
    let liked = false;
    $('[data-a=like]').onclick = (e) => {
      liked = !liked;
      likes += liked ? 1 : -1;
      $('.lk').textContent = likes;
      e.currentTarget.style.color = liked ? 'var(--ui-danger)' : '';
      e.currentTarget.querySelector('svg').setAttribute('fill', liked ? 'currentColor' : 'none');
    };
    const follow = $('[data-a=follow]');
    let following = false;
    follow.onclick = () => {
      following = !following;
      follow.textContent = following ? 'Siguiendo' : 'Seguir';
      follow.setAttribute('variant', following ? 'soft' : 'outline');
    };

    // comentarios
    const list = $('.cms');
    const item = (name, when, text) => {
      const n = h('<div class="cm"><ui-avatar size="sm"></ui-avatar><div><strong></strong> <span class="muted small"></span><p></p></div></div>');
      n.querySelector('ui-avatar').setAttribute('name', name);
      n.querySelector('strong').textContent = name;
      n.querySelector('.muted').textContent = when;
      n.querySelector('p').textContent = text;
      return n;
    };
    seed.forEach(([n, w, t]) => list.append(item(n, w, t)));
    $('[data-a=comment]').onclick = () => {
      const ta = $('.ta');
      if (!ta.value.trim()) return toast.warning('Escribe algo primero');
      list.prepend(item('Tú', 'ahora', ta.value.trim()));
      $('.cc').textContent = list.children.length;
      ta.value = '';
      toast.success('Comentario publicado');
    };

    // newsletter
    const form = $('.nl');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const i = form.querySelector('ui-input');
      if (!i.checkValidity()) return i.reportValidity();
      toast.success('Revisa tu correo para confirmar', { title: 'Casi listo' });
      i.value = '';
    });

    return el;
  },
};
