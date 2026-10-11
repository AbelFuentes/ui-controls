const rows = [
  { name: 'Ana López', role: 'Diseño', status: 'Activo', score: 92 },
  { name: 'Beto Ruiz', role: 'Ingeniería', status: 'Activo', score: 78 },
  { name: 'Carla Gil', role: 'Producto', status: 'Pausado', score: 85 },
  { name: 'Dan Paz', role: 'Ingeniería', status: 'Activo', score: 64 },
  { name: 'Eva Mar', role: 'Ventas', status: 'Baja', score: 71 },
];

const tones = { Activo: 'success', Pausado: 'warning', Baja: 'danger' };

const columns = [
  {
    key: 'name', label: 'Nombre', sortable: true,
    render: (r) => {
      const d = document.createElement('div');
      d.style.cssText = 'display:flex;align-items:center;gap:.7em';
      d.innerHTML = '<ui-avatar size="sm"></ui-avatar><span></span>';
      d.firstChild.setAttribute('name', r.name);
      d.lastChild.textContent = r.name;
      return d;
    },
  },
  { key: 'role', label: 'Rol', sortable: true },
  {
    key: 'status', label: 'Estado', sortable: true,
    render: (r) => {
      const b = document.createElement('ui-badge');
      b.setAttribute('tone', tones[r.status]);
      b.setAttribute('dot', '');
      b.textContent = r.status;
      return b;
    },
  },
  { key: 'score', label: 'Puntaje', sortable: true, align: 'right' },
];

const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== false && v !== '' && v != null)
    .map(([k, v]) => (v === true ? k : `${k}="${v}"`))
    .join(' ');

export default {
  title: 'Content/Table',
  tags: ['autodocs'],
  argTypes: {
    striped: { control: 'boolean' },
    selectable: { control: 'boolean' },
  },
  args: { striped: false, selectable: false },
  render: (a) => {
    const el = document.createElement('div');
    el.style.cssText = 'display:grid;gap:.75rem;width:min(44rem,94vw)';
    el.innerHTML = `<ui-table ${attrs(a)}></ui-table><span class="out" style="font-size:.85rem;opacity:.7">&nbsp;</span>`;
    const t = el.querySelector('ui-table');
    t.columns = columns;
    t.rows = rows;
    t.addEventListener('select', (e) => (el.querySelector('.out').textContent = `${e.detail.rows.length} seleccionadas`));
    t.addEventListener('sort', (e) => (el.querySelector('.out').textContent = `Orden: ${e.detail.key ?? '—'} ${e.detail.dir ?? ''}`));
    return el;
  },
};

export const Default = {};
export const Striped = { args: { striped: true } };
export const Selectable = { args: { selectable: true } };

export const Empty = {
  render: () => {
    const t = document.createElement('ui-table');
    t.setAttribute('empty', 'No hay resultados');
    t.style.width = 'min(34rem,92vw)';
    t.columns = columns;
    t.rows = [];
    return t;
  },
};

/* ───────── novedades de ui-table ───────── */

export const ClickableRows = {
  render: () => {
    const el = document.createElement('div');
    el.style.cssText = 'display:grid;gap:1rem;width:min(44rem,94vw)';
    el.innerHTML = '<ui-breadcrumb label="Ruta"></ui-breadcrumb><div class="view"></div>';
    const crumbs = el.querySelector('ui-breadcrumb');
    const view = el.querySelector('.view');

    const list = () => {
      crumbs.innerHTML = '<span>Personas</span>';
      view.innerHTML = `
        <ui-table clickable striped row-key="name" label="Personas"></ui-table>
        <p style="margin:.75rem 0 0;font-size:.85rem;opacity:.7">Haz click en una fila, o usa Tab, flechas y Enter.</p>`;
      const t = view.querySelector('ui-table');
      t.columns = columns;
      t.rows = rows;
      t.addEventListener('rowclick', (e) => detail(e.detail.row));
    };

    const detail = (r) => {
      crumbs.innerHTML = '<a href="#">Personas</a><span></span>';
      crumbs.lastElementChild.textContent = r.name;
      view.innerHTML = `
        <ui-card>
          <div slot="header" style="display:flex;align-items:center;gap:.8rem">
            <ui-avatar name="${r.name}"></ui-avatar><span>${r.name}</span>
          </div>
          <ui-stack gap="sm">
            <div>Rol: <strong>${r.role}</strong></div>
            <div>Estado: <ui-badge tone="${tones[r.status]}" dot>${r.status}</ui-badge></div>
            <ui-progress value="${r.score}" label="Puntaje" show-value></ui-progress>
          </ui-stack>
          <ui-button slot="footer" variant="outline" size="sm" data-a="back">← Volver</ui-button>
        </ui-card>`;
      view.querySelector('[data-a=back]').onclick = list;
    };

    crumbs.addEventListener('click', (e) => {
      if (e.target.closest('a')) { e.preventDefault(); list(); }
    });
    list();
    return el;
  },
};

export const SingleSelect = {
  render: () => {
    const el = document.createElement('div');
    el.style.cssText = 'display:grid;gap:.75rem;width:min(44rem,94vw)';
    el.innerHTML = `
      <ui-table selectable="single" row-key="name" label="Personas"></ui-table>
      <span class="out" style="font-size:.9rem;opacity:.7">Nadie seleccionado</span>`;
    const t = el.querySelector('ui-table');
    t.columns = columns;
    t.rows = rows;
    t.addEventListener('select', (e) => {
      el.querySelector('.out').textContent = `Seleccionado: ${e.detail.rows[0]?.name ?? '—'}`;
    });
    return el;
  },
};

export const SelectionAcrossPages = {
  render: () => {
    const el = document.createElement('div');
    el.style.cssText = 'display:grid;gap:.75rem;width:min(44rem,94vw)';
    el.innerHTML = `
      <ui-table selectable row-key="name" label="Personas"></ui-table>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
        <span class="out" style="font-size:.9rem;opacity:.7">0 seleccionadas</span>
        <ui-pagination page="1" pages="3" size="sm"></ui-pagination>
      </div>`;
    const t = el.querySelector('ui-table');
    const out = el.querySelector('.out');
    t.columns = columns;
    const show = (p) => { t.rows = rows.slice((p - 1) * 2, p * 2); };
    el.querySelector('ui-pagination').addEventListener('change', (e) => show(e.detail.page));
    t.addEventListener('select', () => {
      out.textContent = `${t.selectedKeys.length} seleccionadas: ${t.selectedKeys.join(', ')}`;
    });
    show(1);
    return el;
  },
};

export const ServerSorting = {
  render: () => {
    const el = document.createElement('div');
    el.style.cssText = 'display:grid;gap:.75rem;width:min(44rem,94vw)';
    el.innerHTML = `
      <ui-table manual-sort label="Personas"></ui-table>
      <p style="margin:0;font-size:.85rem;opacity:.7">El orden lo hace el «servidor» (700 ms): la tabla solo emite <code>sort</code> y muestra <code>loading</code>.</p>`;
    const t = el.querySelector('ui-table');
    t.columns = columns;
    t.rows = rows;
    t.addEventListener('sort', ({ detail: { key, dir } }) => {
      t.setAttribute('loading', '');
      setTimeout(() => {
        const out = [...rows];
        if (key) {
          out.sort((a, b) =>
            (typeof a[key] === 'number' ? a[key] - b[key] : String(a[key]).localeCompare(String(b[key]))) *
            (dir === 'desc' ? -1 : 1));
        }
        t.rows = out;
        t.removeAttribute('loading');
      }, 700);
    });
    return el;
  },
};

export const Loading = {
  render: () => {
    const el = document.createElement('div');
    el.style.cssText = 'display:grid;gap:.75rem;width:min(44rem,94vw);justify-items:start';
    el.innerHTML = `
      <ui-table loading label="Personas" style="width:100%"></ui-table>
      <ui-button size="sm" variant="outline">Alternar carga</ui-button>`;
    const t = el.querySelector('ui-table');
    t.columns = columns;
    t.rows = rows;
    el.querySelector('ui-button').onclick = () => t.toggleAttribute('loading');
    return el;
  },
};

export const CompactScroll = {
  render: () => {
    const many = [...rows, ...rows, ...rows, ...rows].map((r, i) => ({ ...r, name: `${r.name} ${i + 1}` }));
    const t = document.createElement('ui-table');
    t.setAttribute('compact', '');
    t.setAttribute('striped', '');
    t.setAttribute('clickable', '');
    t.setAttribute('max-height', '18rem');
    t.setAttribute('label', 'Personas');
    t.style.width = 'min(44rem,94vw)';
    t.columns = columns;
    t.rows = many;
    return t;
  },
};

export const CustomEmpty = {
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <ui-table label="Pedidos" style="width:min(34rem,92vw)">
        <ui-stack slot="empty" align="center" gap="sm">
          <strong>No hay pedidos todavía</strong>
          <span style="opacity:.7;font-size:.9rem">Cuando recibas uno aparecerá aquí.</span>
          <ui-button size="sm">Crear pedido</ui-button>
        </ui-stack>
      </ui-table>`;
    const t = el.firstElementChild;
    t.columns = columns;
    t.rows = [];
    return el;
  },
};
