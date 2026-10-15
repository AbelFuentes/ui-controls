import { svg } from './_shared.js';

export default { title: 'Layout/Primitives', parameters: { layout: 'fullscreen' } };

const PH = 'padding:1rem;border-radius:.8rem;text-align:center;font-size:.85rem;background:color-mix(in srgb,var(--ui-accent) 12%,transparent);border:1px dashed color-mix(in srgb,var(--ui-accent) 50%,transparent)';
const ph = (t, extra = '') => `<div style="${PH};${extra}">${t}</div>`;
const label = (t) => `<p style="margin:1.5rem 1.25rem .5rem;font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--ui-muted)">${t}</p>`;
const lorem = '<p style="margin:0 0 1rem;line-height:1.7;opacity:.85">Un sistema de componentes es un acuerdo entre diseño e ingeniería sobre cómo se ve y se comporta todo lo que construimos. Cuando ese acuerdo existe, las pantallas nuevas se arman en horas y no en semanas.</p>';

export const Container = {
  render: () => ['sm', 'md', 'lg', 'xl', 'full'].map((s) => `
    ${label(`size="${s}"`)}
    <div style="outline:1px dashed var(--ui-border)"><ui-container size="${s}">${ph('contenido')}</ui-container></div>`).join(''),
};

export const Section = {
  render: () => ['none', 'soft', 'surface', 'accent', 'dark'].map((t) => `
    <ui-section tone="${t}" padding="sm" center><h3 style="margin:0">tone="${t}"</h3><p style="margin:.4rem 0 0;opacity:.8">Banda a todo el ancho, contenido centrado.</p></ui-section>`).join(''),
};

export const Split = {
  argTypes: {
    side: { control: 'inline-radio', options: ['right', 'left'] },
    collapse: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl', 'none'] },
    sticky: { control: 'boolean' },
  },
  args: { side: 'right', collapse: 'md', sticky: true },
  render: ({ side, collapse, sticky }) => `
    <ui-container>
      <p style="color:var(--ui-muted);font-size:.9rem">Reduce el ancho de la ventana: bajo el breakpoint «${collapse}» el panel se apila.</p>
      <ui-split side="${side}" collapse="${collapse}" ${sticky ? 'sticky' : ''} aside-width="16rem">
        <div>${Array.from({ length: 6 }, () => lorem).join('')}</div>
        <ui-card slot="aside" variant="outlined"><span slot="header">Panel</span>Se queda fijo al hacer scroll.</ui-card>
      </ui-split>
    </ui-container>`,
};

export const Divider = {
  render: () => `
    <ui-container size="sm">
      <ui-stack gap="lg">
        <ui-divider></ui-divider>
        <ui-divider>o continúa con</ui-divider>
        <ui-divider align="start">Inicio</ui-divider>
        <ui-divider tone="strong" spacing="lg"></ui-divider>
        <ui-stack direction="row" align="center" gap="sm" style="height:2.5rem">
          <span>Uno</span><ui-divider orientation="vertical"></ui-divider><span>Dos</span><ui-divider orientation="vertical"></ui-divider><span>Tres</span>
        </ui-stack>
      </ui-stack>
    </ui-container>`,
};

export const Spacer = {
  render: () => `
    <ui-container>
      <ui-stack gap="lg">
        <ui-stack direction="row" align="center"><strong>Logo</strong><ui-spacer></ui-spacer><ui-button size="sm">Entrar</ui-button></ui-stack>
        <ui-stack direction="row" align="center"><ui-button size="sm" variant="outline">Atrás</ui-button><ui-spacer size="3"></ui-spacer><ui-button size="sm">Siguiente (hueco de 3rem)</ui-button></ui-stack>
      </ui-stack>
    </ui-container>`,
};

export const Toolbar = {
  render: () => ['plain', 'surface', 'soft', 'floating'].map((v) => `
    ${label(`variant="${v}"`)}
    <ui-container>
      <ui-toolbar variant="${v}">
        <ui-stack slot="start" direction="row" align="center" gap="sm"><strong>Proyectos</strong><ui-badge size="sm">12</ui-badge></ui-stack>
        <ui-segmented value="a" size="sm"><option value="a">Lista</option><option value="b">Tablero</option></ui-segmented>
        <ui-stack slot="end" direction="row" gap="sm"><ui-button size="sm" variant="ghost">Filtrar</ui-button><ui-button size="sm">${svg('plus', 14, 'start')}Nuevo</ui-button></ui-stack>
      </ui-toolbar>
    </ui-container>`).join(''),
};

export const PageHeader = {
  render: () => `
    <ui-container>
      <ui-stack gap="xl">
        <ui-page-header heading="Facturas" description="Emite, cobra y da seguimiento a tus facturas." divider>
          <ui-breadcrumb slot="breadcrumb"><a href="#">Inicio</a><a href="#">Finanzas</a><span>Facturas</span></ui-breadcrumb>
          <ui-button slot="actions" variant="outline">Exportar</ui-button>
          <ui-button slot="actions">${svg('plus', 16, 'start')}Nueva factura</ui-button>
          <ui-tabs slot="tabs" value="all" variant="pill" size="sm">
            <section data-tab="all" data-label="Todas"></section><section data-tab="paid" data-label="Pagadas"></section><section data-tab="due" data-label="Vencidas"></section>
          </ui-tabs>
        </ui-page-header>
        <ui-page-header size="lg" heading="Título grande" description="Con slots en lugar de atributos."><span slot="title">Título <em>con slot</em></span></ui-page-header>
      </ui-stack>
    </ui-container>`,
};

export const Navbar = {
  argTypes: {
    collapse: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl', 'none'] },
    variant: { control: 'inline-radio', options: ['surface', 'transparent'] },
    'links-align': { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
  args: { collapse: 'md', variant: 'surface', 'links-align': 'start' },
  render: ({ collapse, variant, 'links-align': align }) => `
    <ui-navbar collapse="${collapse}" variant="${variant}" links-align="${align}" label="Principal">
      <a slot="brand" href="#">Acme</a>
      <a href="#" aria-current="page">Producto</a><a href="#">Precios</a><a href="#">Docs</a><a href="#">Blog</a>
      <ui-theme-switch slot="actions" size="sm"></ui-theme-switch>
      <ui-button slot="actions" size="sm" pill>Empezar</ui-button>
    </ui-navbar>
    <ui-container><p style="color:var(--ui-muted)">Bajo el breakpoint «${collapse}» los enlaces pasan al menú hamburguesa.</p></ui-container>`,
};

export const Nav = {
  argTypes: { rail: { control: 'boolean' }, orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] } },
  args: { rail: false, orientation: 'vertical' },
  render: ({ rail, orientation }) => {
    const el = document.createElement('div');
    el.style.cssText = 'padding:1.5rem;display:grid;gap:1rem;justify-items:start';
    el.innerHTML = `
      <ui-nav value="home" label="Principal" ${rail ? 'rail' : ''} orientation="${orientation}" style="width:${rail || orientation === 'horizontal' ? 'auto' : '15rem'}">
        <ui-nav-item value="home">${svg('chart', 18, 'icon')}Resumen</ui-nav-item>
        <ui-nav-item value="team">${svg('users', 18, 'icon')}Equipo<ui-badge slot="end" size="sm">3</ui-badge></ui-nav-item>
        <ui-nav-group label="Cuenta" collapsible>
          <ui-nav-item value="profile">${svg('user', 18, 'icon')}Perfil</ui-nav-item>
          <ui-nav-item value="billing">${svg('card', 18, 'icon')}Facturación</ui-nav-item>
          <ui-nav-item value="sec" disabled>${svg('shield', 18, 'icon')}Seguridad</ui-nav-item>
        </ui-nav-group>
        <ui-nav-item href="#externo" target="_blank">${svg('share', 18, 'icon')}Enlace externo</ui-nav-item>
      </ui-nav>
      <span class="out" style="font-size:.85rem;color:var(--ui-muted)">Activo: home</span>`;
    el.querySelector('ui-nav').addEventListener('change', (e) => (el.querySelector('.out').textContent = `Activo: ${e.detail.value}`));
    return el;
  },
};

export const AspectRatio = {
  render: () => `
    <ui-container>
      <ui-grid cols="1" cols-md="3" gap="lg">
        ${['16/9', '4/3', '1'].map((r) => `<div><p style="margin:0 0 .4rem;font-size:.85rem;color:var(--ui-muted)">ratio="${r}"</p>
          <ui-aspect-ratio ratio="${r}" rounded><div style="display:grid;place-items:center;background:linear-gradient(135deg,var(--ui-accent),var(--ui-accent-2));color:#fff;font-weight:700">${r}</div></ui-aspect-ratio></div>`).join('')}
      </ui-grid>
    </ui-container>`,
};

export const ScrollArea = {
  render: () => `
    <ui-container>
      <ui-grid cols="1" cols-md="2" gap="lg">
        <ui-card variant="outlined" padding="none">
          <span slot="header">Vertical con fade</span>
          <ui-scroll-area max-height="14" fade label="Lista">
            ${Array.from({ length: 24 }, (_, i) => `<div style="padding:.6rem 1.5rem;border-bottom:1px solid var(--ui-border)">Elemento ${i + 1}</div>`).join('')}
          </ui-scroll-area>
        </ui-card>
        <ui-card variant="outlined">
          <span slot="header">Horizontal</span>
          <ui-scroll-area direction="horizontal" fade label="Chips">
            <ui-stack direction="row" gap="sm" style="width:max-content;padding-bottom:.5rem">${Array.from({ length: 16 }, (_, i) => `<ui-badge size="lg">Etiqueta ${i + 1}</ui-badge>`).join('')}</ui-stack>
          </ui-scroll-area>
        </ui-card>
      </ui-grid>
    </ui-container>`,
};

export const StackAndGrid = {
  render: () => `
    <ui-container>
      <ui-stack gap="xl">
        ${label('ui-stack · collapse="md" (fila → columna) con divider')}
        <ui-card variant="outlined"><ui-stack direction="row" collapse="md" divider gap="lg">
          <div><strong>Ingresos</strong><div style="color:var(--ui-muted)">$48,200</div></div>
          <div><strong>Pedidos</strong><div style="color:var(--ui-muted)">1,284</div></div>
          <div><strong>Clientes</strong><div style="color:var(--ui-muted)">892</div></div>
        </ui-stack></ui-card>
        ${label('ui-grid · cols="1" cols-sm="2" cols-lg="4"')}
        <ui-grid cols="1" cols-sm="2" cols-lg="4" gap="lg">${Array.from({ length: 8 }, (_, i) => ph(`Celda ${i + 1}`)).join('')}</ui-grid>
      </ui-stack>
    </ui-container>`,
};
