import { toast } from '../src/components/toast.js';
import { h, svg, wait } from './_shared.js';

export default { title: 'Examples/ErrorPages', parameters: { layout: 'fullscreen' } };

const shell = (inner, css = '') => {
  const el = document.createElement('div');
  el.innerHTML = `
    <style>
      .ep{min-height:100vh;display:grid;place-items:center;padding:2rem 1.25rem;text-align:center;
        background:radial-gradient(50rem 28rem at 50% -10%,color-mix(in srgb,var(--ui-accent) 16%,transparent),transparent)}
      .ep .box{display:grid;gap:1.25rem;justify-items:center;max-width:32rem;width:100%}
      .ep h1{margin:0;font-size:1.8rem;letter-spacing:-.02em}
      .ep p{margin:0;color:var(--ui-muted);line-height:1.6}
      .ep .big{font-size:clamp(5rem,16vw,9rem);font-weight:900;line-height:1;letter-spacing:-.04em;
        background:linear-gradient(135deg,var(--ui-accent),var(--ui-accent-2));-webkit-background-clip:text;background-clip:text;color:transparent}
      .ep .row{display:flex;gap:.75rem;flex-wrap:wrap;justify-content:center}
      .ep .ring{width:5rem;height:5rem;border-radius:50%;display:grid;place-items:center;
        background:color-mix(in srgb,var(--ui-accent) 12%,transparent);color:var(--ui-accent)}
      ${css}
    </style>
    <div class="ep"><div class="box">${inner}</div></div>`;
  return el;
};

export const NotFound = {
  render: () => {
    const el = shell(`
      <div class="big">404</div>
      <h1>No encontramos esa página</h1>
      <p>Puede que el enlace esté roto o que la página se haya movido. Prueba buscando lo que necesitas.</p>
      <ui-input type="search" label="Buscar en el sitio" style="width:min(24rem,100%)">${svg('search', 18, 'start')}</ui-input>
      <div class="row">
        <ui-button data-a="home">Ir al inicio</ui-button>
        <ui-button variant="outline" data-a="back">Volver atrás</ui-button>
      </div>`);
    el.querySelector('[data-a=home]').onclick = () => toast.info('Navegando al inicio…');
    el.querySelector('[data-a=back]').onclick = () => toast.info('Volviendo a la página anterior…');
    return el;
  },
};

export const ServerError = {
  render: () => {
    const el = shell(`
      <div class="big">500</div>
      <h1>Algo salió mal de nuestro lado</h1>
      <p>Ya estamos trabajando en ello. Intenta de nuevo en unos segundos.</p>
      <ui-alert tone="danger" style="width:100%;text-align:left"><span slot="title">Error interno del servidor</span>Código de referencia: <strong>ERR-8F2A-41C9</strong></ui-alert>
      <div class="row">
        <ui-button data-a="retry">Reintentar</ui-button>
        <ui-button variant="outline">Ver estado del sistema</ui-button>
      </div>
      <div class="row"><ui-badge tone="success" dot>API</ui-badge><ui-badge tone="danger" dot>Base de datos</ui-badge><ui-badge tone="success" dot>Web</ui-badge></div>`);
    const retry = el.querySelector('[data-a=retry]');
    retry.onclick = async () => {
      retry.loading = true;
      await wait(1500);
      retry.loading = false;
      toast.danger('Sigue sin responder. Inténtalo más tarde.', { title: 'Servidor' });
    };
    return el;
  },
};

export const Maintenance = {
  render: () => {
    const el = shell(`
      <ui-badge tone="warning" dot pulse>Mantenimiento programado</ui-badge>
      <h1>Volvemos enseguida</h1>
      <p>Estamos mejorando la plataforma. Calculamos terminar en unos 30 minutos.</p>
      <ui-progress indeterminate label="Aplicando actualizaciones" style="width:min(22rem,100%)"></ui-progress>
      <form class="row" novalidate style="width:min(28rem,100%);flex-wrap:nowrap;align-items:flex-start">
        <ui-input type="email" label="Avísame cuando termine" required style="flex:1"></ui-input>
        <ui-button type="submit" style="margin-top:.1rem">Avisarme</ui-button>
      </form>`);
    const form = el.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const i = form.querySelector('ui-input');
      if (!i.checkValidity()) return i.reportValidity();
      toast.success('Te avisaremos por correo', { title: 'Listo' });
      i.value = '';
    });
    return el;
  },
};

export const EmptyState = {
  render: () => {
    const el = shell(`
      <div class="ring">${svg('search', 34)}</div>
      <h1>Aún no tienes proyectos</h1>
      <p>Crea tu primer proyecto para empezar a organizar tu trabajo. Solo toma un minuto.</p>
      <div class="row">
        <ui-button data-a="new">${svg('plus', 16, 'start')}Crear proyecto</ui-button>
        <ui-button variant="ghost">Importar desde archivo</ui-button>
      </div>`);
    el.querySelector('[data-a=new]').onclick = () => toast.success('Proyecto creado', { title: 'Listo' });
    return el;
  },
};

export const Offline = {
  render: () => {
    const el = shell(`
      <div class="ring">${svg('wifioff', 34)}</div>
      <h1>Sin conexión</h1>
      <p>Revisa tu red. Tus cambios se guardarán localmente y se sincronizarán al volver a conectarte.</p>
      <ui-alert tone="warning" style="width:100%;text-align:left">Trabajando sin conexión: 3 cambios pendientes de sincronizar.</ui-alert>
      <ui-button data-a="retry">Reintentar conexión</ui-button>`);
    const b = el.querySelector('[data-a=retry]');
    b.onclick = async () => {
      b.loading = true;
      await wait(1200);
      b.loading = false;
      toast.warning('Todavía sin conexión', { title: 'Red' });
    };
    return el;
  },
};
