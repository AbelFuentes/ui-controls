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
