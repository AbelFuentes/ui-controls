import { toast } from '../src/components/toast.js';
import { art, svg } from './_shared.js';

export default { title: 'Examples/Layouts', parameters: { layout: 'fullscreen' } };

/* ───────── Sitio de documentación: navbar + nav lateral + artículo + índice ───────── */
const docs = {
  intro: ['Introducción', 'Qué es y por qué existe este sistema de componentes.'],
  install: ['Instalación', 'Instala el paquete con tu gestor y registra los elementos.'],
  theming: ['Temas', 'Claro, oscuro y variables CSS para personalizar el acento.'],
  layout: ['Layout', 'Contenedores, secciones, rejillas y paneles laterales.'],
  forms: ['Formularios', 'Campos que participan en el form nativo y validan solos.'],
};

export const DocsSite = {
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        .dx h1{margin:.5rem 0 .75rem;font-size:2.1rem;letter-spacing:-.02em}
        .dx h2{margin:2rem 0 .6rem;font-size:1.35rem;scroll-margin-top:5.5rem}
        .dx p{line-height:1.75;margin:0 0 1rem;opacity:.9}
        .dx pre{padding:1rem 1.2rem;border-radius:1rem;overflow:auto;font-size:.88rem;background:color-mix(in srgb,currentColor 7%,transparent)}
        .dx .muted{color:var(--ui-muted)}
      </style>
      <div class="dx">
        <ui-navbar sticky collapse="lg" label="Principal">
          <a slot="brand" href="#">Aurora Docs</a>
          <a href="#" aria-current="page">Guías</a><a href="#">Componentes</a><a href="#">API</a><a href="#">Ejemplos</a>
          <ui-input slot="actions" type="search" label="Buscar" size="sm" style="width:12rem"></ui-input>
          <ui-theme-switch slot="actions" size="sm"></ui-theme-switch>
        </ui-navbar>
        <ui-container size="xl">
          <ui-split side="left" aside-width="15rem" sticky collapse="lg" gap="lg" style="padding-block:2rem;--ui-split-offset:5.5rem">
            <ui-nav slot="aside" value="intro" label="Documentación">
              <ui-nav-group label="Empezar">
                <ui-nav-item value="intro">Introducción</ui-nav-item>
                <ui-nav-item value="install">Instalación</ui-nav-item>
                <ui-nav-item value="theming">Temas</ui-nav-item>
              </ui-nav-group>
              <ui-nav-group label="Guías" collapsible>
                <ui-nav-item value="layout">Layout</ui-nav-item>
                <ui-nav-item value="forms">Formularios</ui-nav-item>
              </ui-nav-group>
            </ui-nav>

            <ui-split side="right" aside-width="12rem" sticky collapse="xl" gap="xl" style="--ui-split-offset:5.5rem">
              <article>
                <ui-breadcrumb label="Ruta"><a href="#">Docs</a><span class="crumb">Introducción</span></ui-breadcrumb>
                <h1 class="title">Introducción</h1>
                <p class="lead muted">Qué es y por qué existe este sistema de componentes.</p>
                <h2 id="a">Primeros pasos</h2>
                <p>Instala el paquete, importa los tokens y empieza a usar etiquetas <code>ui-*</code> en cualquier página.</p>
                <pre><code>pnpm add @abelfuentes/ui-controls</code></pre>
                <ui-alert tone="info"><span slot="title">Consejo</span>Importa solo lo que uses para mantener ligero el bundle.</ui-alert>
                <h2 id="b">Cómo está organizado</h2>
                <p>Cada componente hace una sola cosa. Las piezas grandes son composiciones de piezas pequeñas.</p>
                <ui-divider spacing="lg"></ui-divider>
                <ui-stack direction="row" justify="between" collapse="sm" gap="sm">
                  <ui-button variant="outline" data-a="prev">${svg('left', 16, 'start')}Anterior</ui-button>
                  <ui-button variant="outline" data-a="next">Siguiente${svg('right', 16, 'end')}</ui-button>
                </ui-stack>
              </article>
              <ui-nav slot="aside" label="En esta página">
                <ui-nav-item href="#a">Primeros pasos</ui-nav-item>
                <ui-nav-item href="#b">Cómo está organizado</ui-nav-item>
              </ui-nav>
            </ui-split>
          </ui-split>
        </ui-container>
      </div>`;

    const keys = Object.keys(docs);
    const nav = el.querySelector('ui-nav');
    const show = (k) => {
      el.querySelector('.title').textContent = docs[k][0];
      el.querySelector('.crumb').textContent = docs[k][0];
      el.querySelector('.lead').textContent = docs[k][1];
      nav.setAttribute('value', k);
      window.scrollTo({ top: 0 });
    };
    nav.addEventListener('change', (e) => show(e.detail.value));
    const step = (d) => show(keys[(keys.indexOf(nav.value) + d + keys.length) % keys.length]);
    el.querySelector('[data-a=prev]').onclick = () => step(-1);
    el.querySelector('[data-a=next]').onclick = () => step(1);
    return el;
  },
};

/* ───────── Panel con rail: app-shell + nav de iconos + panel derecho ───────── */
export const RailDashboard = {
  render: () => {
    const el = document.createElement('div');
    const stats = [['Ingresos', '$48,200', '+12%', 'success'], ['Pedidos', '1,284', '+4%', 'success'], ['Clientes', '892', '+2%', 'accent'], ['Devoluciones', '23', '-8%', 'danger']];
    const nav = [['home', 'chart', 'Resumen'], ['team', 'users', 'Equipo'], ['bill', 'card', 'Facturación'], ['msg', 'comment', 'Mensajes'], ['cfg', 'sliders', 'Ajustes']];
    el.innerHTML = `
      <style>
        .rd .span2{grid-column:auto}
        @media (min-width:1024px){.rd .span2{grid-column:span 2}}
        .rd .muted{color:var(--ui-muted)}
        .rd .feed{display:flex;gap:.7rem;padding:.7rem 0;border-bottom:1px solid var(--ui-border)}
        .rd .feed:last-child{border:0}
        .rd .row{display:flex;justify-content:space-between;align-items:center;gap:1rem}
      </style>
      <div class="rd">
        <ui-app-shell rail aside-width="17rem">
          <strong slot="header" style="font-size:1.1rem">Orbit</strong>
          <ui-input slot="header" type="search" label="Buscar" size="sm" style="max-width:20rem;flex:1"></ui-input>
          <ui-spacer slot="header"></ui-spacer>
          <ui-theme-switch slot="header" size="sm"></ui-theme-switch>
          <ui-avatar slot="header" name="Camila Reyes" size="sm" status="online"></ui-avatar>

          <ui-nav slot="sidebar" value="home" label="Principal">
            ${nav.map(([v, i, t]) => `<ui-nav-item value="${v}">${svg(i, 20, 'icon')}${t}</ui-nav-item>`).join('')}
          </ui-nav>

          <ui-stack gap="xl">
            <ui-page-header heading="Resumen" description="Últimos 30 días" divider>
              <ui-button slot="actions" variant="outline">Exportar</ui-button>
              <ui-button slot="actions">${svg('plus', 16, 'start')}Nuevo pedido</ui-button>
            </ui-page-header>

            <ui-grid cols="1" cols-sm="2" cols-xl="4" gap="lg">
              ${stats.map(([l, v, d, t]) => `
                <ui-card variant="outlined" padding="sm">
                  <span slot="header" class="muted" style="font-size:.85rem;font-weight:500">${l}</span>
                  <div class="row"><strong style="font-size:1.7rem">${v}</strong><ui-badge tone="${t}" size="sm">${d}</ui-badge></div>
                </ui-card>`).join('')}
            </ui-grid>

            <ui-grid cols="1" cols-lg="3" gap="lg">
              <ui-card class="span2" variant="outlined"><span slot="header">Metas del mes</span>
                <ui-stack gap="lg"><ui-progress value="72" label="Ventas" show-value></ui-progress><ui-progress value="45" label="Clientes nuevos" show-value></ui-progress><ui-progress value="90" label="Satisfacción" show-value></ui-progress></ui-stack>
              </ui-card>
              <ui-card variant="outlined"><span slot="header">Canales</span>
                <ui-stack gap="sm" divider>
                  <div class="row"><span>Directo</span><strong>42%</strong></div><div class="row"><span>Búsqueda</span><strong>31%</strong></div><div class="row"><span>Social</span><strong>27%</strong></div>
                </ui-stack>
              </ui-card>
            </ui-grid>
          </ui-stack>

          <div slot="aside">
            <strong>Actividad</strong>
            ${['Ana López pagó la factura F-1041', 'Beto Ruiz comentó en Landing v2', 'Carla Gil te invitó a Marketing', 'Dan Paz cerró un ticket', 'Eva Mar subió un archivo']
              .map((t) => `<div class="feed"><ui-avatar name="${t.split(' ').slice(0, 2).join(' ')}" size="sm"></ui-avatar><span style="font-size:.9rem;line-height:1.4">${t}</span></div>`).join('')}
          </div>
          <span slot="footer" class="muted" style="font-size:.85rem">© Orbit · Datos de ejemplo</span>
        </ui-app-shell>
      </div>`;
    el.querySelector('ui-app-shell').addEventListener('toggle', (e) => {
      if (e.detail.collapsed) toast.info('Sidebar en modo rail');
    });
    return el;
  },
};

/* ───────── Página de marketing: secciones y contenedores ───────── */
export const MarketingPage = {
  render: () => {
    const el = document.createElement('div');
    const features = [['Rápido', 'zap'], ['Seguro', 'shield'], ['Accesible', 'eye'], ['Modular', 'sliders'], ['Global', 'map'], ['Con cariño', 'heart']];
    el.innerHTML = `
      <style>
        .mk h1{margin:0;font-size:clamp(2.2rem,6vw,3.8rem);line-height:1.05;letter-spacing:-.03em}
        .mk h2{margin:0;font-size:clamp(1.5rem,3.5vw,2.2rem);letter-spacing:-.02em}
        .mk p{margin:0;line-height:1.65}
        .mk .muted{color:var(--ui-muted)}
        .mk .ic{width:2.6rem;height:2.6rem;border-radius:.9rem;display:grid;place-items:center;color:#fff;margin-bottom:.8rem;background:linear-gradient(135deg,var(--ui-accent),var(--ui-accent-2))}
        .mk .stat strong{display:block;font-size:2rem;letter-spacing:-.02em}
      </style>
      <div class="mk">
        <ui-navbar sticky collapse="md" label="Principal">
          <a slot="brand" href="#">Aurora</a><a href="#">Producto</a><a href="#">Precios</a><a href="#">Clientes</a>
          <ui-theme-switch slot="actions" size="sm"></ui-theme-switch>
          <ui-button slot="actions" size="sm" pill>Empezar</ui-button>
        </ui-navbar>

        <ui-section tone="accent" padding="xl" center size="md">
          <ui-stack gap="lg" align="center">
            <ui-badge variant="solid" tone="neutral" dot pulse>Versión 2.0</ui-badge>
            <h1>Interfaces hermosas, sin esfuerzo</h1>
            <p style="max-width:34rem;opacity:.92;font-size:1.15rem">Componentes atómicos y accesibles que funcionan en cualquier página.</p>
            <ui-stack direction="row" gap="sm" wrap justify="center">
              <ui-button size="lg" pill variant="soft" style="--ui-accent:#fff">Probar gratis</ui-button>
              <ui-button size="lg" pill variant="outline" style="--ui-accent:#fff">Ver demo</ui-button>
            </ui-stack>
          </ui-stack>
        </ui-section>

        <ui-section tone="surface" padding="sm">
          <ui-stack direction="row" gap="xl" justify="center" wrap align="center" class="muted">
            ${['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli'].map((n) => `<strong style="font-size:1.1rem;opacity:.6">${n}</strong>`).join('')}
          </ui-stack>
        </ui-section>

        <ui-section>
          <ui-stack gap="xl">
            <ui-stack gap="sm" align="center" style="text-align:center"><h2>Todo lo que necesitas</h2><p class="muted">Un sistema completo, consistente y personalizable.</p></ui-stack>
            <ui-grid cols="1" cols-sm="2" cols-lg="3" gap="lg">
              ${features.map(([t, i]) => `<ui-card variant="outlined"><div class="ic">${svg(i, 20)}</div><strong>${t}</strong><p class="muted" style="margin-top:.3rem">Detalles cuidados en cada componente.</p></ui-card>`).join('')}
            </ui-grid>
          </ui-stack>
        </ui-section>

        <ui-section tone="soft">
          <ui-split side="left" aside-width="22rem" collapse="md" gap="xl" style="align-items:center">
            <ui-stack gap="lg">
              <h2>Pensado para equipos</h2>
              <p class="muted">Comparte el mismo lenguaje visual entre diseño e ingeniería y entrega pantallas nuevas en horas.</p>
              <ui-grid cols="3" gap="lg">
                <div class="stat"><strong>44</strong><span class="muted">componentes</span></div><div class="stat"><strong>0</strong><span class="muted">dependencias</span></div><div class="stat"><strong>100%</strong><span class="muted">tipado</span></div>
              </ui-grid>
            </ui-stack>
            <ui-aspect-ratio slot="aside" ratio="4/3" rounded><img alt="" src="${art('#6366f1', '#ec4899', 'Equipo', 800, 600)}" /></ui-aspect-ratio>
          </ui-split>
        </ui-section>

        <ui-section tone="dark" padding="lg" center size="sm">
          <ui-stack gap="lg" align="center">
            <h2>Empieza hoy</h2>
            <form novalidate style="display:flex;gap:.75rem;width:min(30rem,100%);align-items:flex-start">
              <ui-input type="email" label="Correo" required style="flex:1"></ui-input>
              <ui-button type="submit" style="margin-top:.1rem">Unirme</ui-button>
            </form>
          </ui-stack>
        </ui-section>

        <ui-toolbar variant="surface" wrap>
          <span slot="start" class="muted" style="font-size:.9rem">© Aurora</span>
          <ui-stack slot="end" direction="row" gap="lg" class="muted" style="font-size:.9rem"><span>Privacidad</span><span>Términos</span><span>Contacto</span></ui-stack>
        </ui-toolbar>
      </div>`;
    const form = el.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const i = form.querySelector('ui-input');
      if (!i.checkValidity()) return i.reportValidity();
      toast.success('Te avisaremos pronto', { title: 'Estás en la lista' });
      i.value = '';
    });
    return el;
  },
};

/* ───────── Ajustes en dos paneles: split + nav + divisores ───────── */
export const SettingsTwoPane = {
  render: () => {
    const el = document.createElement('div');
    const panes = {
      profile: ['Perfil', 'Cómo te ven los demás.', `
        <ui-grid cols="1" cols-sm="2"><ui-input label="Nombre" value="Camila"></ui-input><ui-input label="Apellido" value="Reyes"></ui-input></ui-grid>
        <ui-input label="Correo" type="email" value="camila@ejemplo.com"></ui-input>
        <ui-textarea label="Biografía" autosize rows="2" maxrows="5" maxlength="160"></ui-textarea>`],
      notifications: ['Notificaciones', 'Elige qué quieres recibir.', ['Correo', 'Push', 'Menciones', 'Resumen semanal']
        .map((t, i) => `<ui-stack direction="row" justify="between" align="center"><span>${t}</span><ui-toggle ${i % 2 ? '' : 'checked'} label="${t}"></ui-toggle></ui-stack>`).join('<ui-divider spacing="none"></ui-divider>')],
      security: ['Seguridad', 'Protege tu cuenta.', `
        <ui-input label="Contraseña actual" type="password"></ui-input><ui-input label="Nueva contraseña" type="password" minlength="8" hint="Mínimo 8 caracteres"></ui-input>
        <ui-divider></ui-divider><ui-stack direction="row" justify="between" align="center"><span>Verificación en dos pasos</span><ui-toggle label="2FA"></ui-toggle></ui-stack>`],
      billing: ['Facturación', 'Plan y método de pago.', `
        <ui-card variant="soft"><ui-stack direction="row" justify="between" align="center"><div><strong>Plan Pro</strong><div style="color:var(--ui-muted)">$19 / mes</div></div><ui-badge tone="success" dot>Activo</ui-badge></ui-stack></ui-card>
        <ui-progress value="62" label="Almacenamiento" show-value></ui-progress>`],
    };
    el.innerHTML = `
      <ui-container size="lg" style="padding-block:2rem">
        <ui-stack gap="xl">
          <ui-page-header heading="Ajustes" description="Administra tu cuenta y preferencias." divider></ui-page-header>
          <ui-split side="left" aside-width="14rem" collapse="md" gap="xl" sticky>
            <ui-nav slot="aside" value="profile" label="Ajustes" orientation="vertical">
              <ui-nav-item value="profile">${svg('user', 18, 'icon')}Perfil</ui-nav-item>
              <ui-nav-item value="notifications">${svg('bell', 18, 'icon')}Notificaciones</ui-nav-item>
              <ui-nav-item value="security">${svg('shield', 18, 'icon')}Seguridad</ui-nav-item>
              <ui-nav-item value="billing">${svg('card', 18, 'icon')}Facturación</ui-nav-item>
            </ui-nav>
            <ui-card padding="lg"><ui-stack gap="lg" class="pane"></ui-stack>
              <ui-button slot="footer" variant="ghost">Cancelar</ui-button>
              <ui-button slot="footer" data-a="save" style="margin-left:auto">Guardar cambios</ui-button>
            </ui-card>
          </ui-split>
        </ui-stack>
      </ui-container>`;
    const pane = el.querySelector('.pane');
    const show = (k) => {
      const [t, d, body] = panes[k];
      pane.innerHTML = `<div><strong style="font-size:1.2rem">${t}</strong><div style="color:var(--ui-muted)">${d}</div></div><ui-divider spacing="none"></ui-divider>${body}`;
    };
    el.querySelector('ui-nav').addEventListener('change', (e) => show(e.detail.value));
    const save = el.querySelector('[data-a=save]');
    save.onclick = () => {
      save.loading = true;
      setTimeout(() => { save.loading = false; toast.success('Cambios guardados'); }, 800);
    };
    show('profile');
    return el;
  },
};
