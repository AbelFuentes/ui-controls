import { toast } from '../src/components/toast.js';

export default { title: 'Examples/Dashboard', parameters: { layout: 'fullscreen' } };

const names = ['Ana López', 'Beto Ruiz', 'Carla Gil', 'Dan Paz', 'Eva Mar', 'Fer Soto', 'Gus Rey', 'Hugo Lara'];
const statuses = ['Pagado', 'Pendiente', 'Reembolsado'];
const tones = { Pagado: 'success', Pendiente: 'warning', Reembolsado: 'danger' };
const orders = Array.from({ length: 47 }, (_, i) => ({
  id: `#${1001 + i}`,
  customer: names[i % names.length],
  status: statuses[(i * 7) % 3],
  total: 40 + ((i * 53) % 460),
}));
const SIZE = 8;

const columns = [
  { key: 'id', label: 'Pedido', sortable: true },
  {
    key: 'customer', label: 'Cliente', sortable: true,
    render: (r) => {
      const d = document.createElement('div');
      d.style.cssText = 'display:flex;align-items:center;gap:.7em';
      d.innerHTML = '<ui-avatar size="sm"></ui-avatar><span></span>';
      d.firstChild.setAttribute('name', r.customer);
      d.lastChild.textContent = r.customer;
      return d;
    },
  },
  {
    key: 'status', label: 'Estado',
    render: (r) => {
      const b = document.createElement('ui-badge');
      b.setAttribute('tone', tones[r.status]);
      b.setAttribute('dot', '');
      b.textContent = r.status;
      return b;
    },
  },
  { key: 'total', label: 'Total', sortable: true, align: 'right', render: (r) => `$${r.total}` },
];

const stats = [
  { label: 'Ingresos', value: '$48,200', delta: '+12%', tone: 'success', p: 72 },
  { label: 'Pedidos', value: '1,284', delta: '+4%', tone: 'success', p: 58 },
  { label: 'Clientes', value: '892', delta: '+2%', tone: 'accent', p: 41 },
  { label: 'Devoluciones', value: '23', delta: '-8%', tone: 'danger', p: 18 },
];

export const Overview = {
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <ui-app-shell>
        <strong slot="header" style="font-size:1.1rem">Acme</strong>
        <ui-input slot="header" size="sm" type="search" placeholder="Buscar pedidos…" style="max-width:22rem;flex:1"></ui-input>
        <span slot="header" style="flex:1"></span>
        <ui-theme-switch slot="header" size="sm"></ui-theme-switch>
        <ui-dropdown slot="header" placement="bottom-end">
          <ui-avatar slot="trigger" name="Abel Fuentes" size="sm" status="online" style="cursor:pointer"></ui-avatar>
          <option value="profile">Perfil</option>
          <option value="billing">Facturación</option>
          <option data-separator></option>
          <option value="logout" data-danger>Cerrar sesión</option>
        </ui-dropdown>

        <ui-stack slot="sidebar" gap="xs">
          <ui-button variant="soft" block>Resumen</ui-button>
          <ui-button variant="ghost" block>Pedidos</ui-button>
          <ui-button variant="ghost" block>Clientes</ui-button>
          <ui-button variant="ghost" block>Reportes</ui-button>
          <ui-button variant="ghost" block>Ajustes</ui-button>
        </ui-stack>

        <ui-stack gap="lg">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
            <div>
              <h1 style="margin:0;font-size:1.5rem">Resumen</h1>
              <p style="margin:.25rem 0 0;color:var(--ui-muted)">Últimos 30 días</p>
            </div>
            <ui-button data-a="new">
              <svg slot="start" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Nuevo pedido
            </ui-button>
          </div>

          <ui-grid min="13rem">
            ${stats.map((s) => `
              <ui-card padding="sm" variant="outlined">
                <span slot="header" style="font-size:.85rem;color:var(--ui-muted);font-weight:500">${s.label}</span>
                <div style="display:flex;align-items:baseline;justify-content:space-between;gap:.5rem">
                  <span style="font-size:1.8rem;font-weight:800;letter-spacing:-.02em">${s.value}</span>
                  <ui-badge tone="${s.tone}" size="sm">${s.delta}</ui-badge>
                </div>
                <ui-progress value="${s.p}" size="sm" style="margin-top:.9rem"></ui-progress>
              </ui-card>`).join('')}
          </ui-grid>

          <ui-tabs value="orders" variant="pill" label="Secciones">
            <section data-tab="orders" data-label="Pedidos">
              <ui-table></ui-table>
              <div style="display:flex;justify-content:space-between;align-items:center;gap:.75rem;flex-wrap:wrap;margin-top:1rem">
                <span class="info" style="color:var(--ui-muted);font-size:.9rem"></span>
                <ui-pagination page="1" pages="${Math.ceil(orders.length / SIZE)}" size="sm"></ui-pagination>
              </div>
            </section>
            <section data-tab="goals" data-label="Metas">
              <ui-stack gap="lg" style="max-width:34rem">
                <ui-progress value="72" label="Ventas del mes" show-value></ui-progress>
                <ui-progress value="45" label="Nuevos clientes" show-value></ui-progress>
                <ui-progress value="90" label="Satisfacción" show-value></ui-progress>
              </ui-stack>
            </section>
          </ui-tabs>
        </ui-stack>

        <span slot="footer" style="color:var(--ui-muted);font-size:.85rem">© Acme · Datos de ejemplo</span>
      </ui-app-shell>`;

    const table = el.querySelector('ui-table');
    const pg = el.querySelector('ui-pagination');
    const info = el.querySelector('.info');
    table.columns = columns;
    const show = (p) => {
      table.rows = orders.slice((p - 1) * SIZE, p * SIZE);
      info.textContent = `${(p - 1) * SIZE + 1}–${Math.min(p * SIZE, orders.length)} de ${orders.length}`;
    };
    pg.addEventListener('change', (e) => show(e.detail.page));
    show(1);

    el.querySelector('ui-dropdown').addEventListener('select', (e) => toast.info(`Acción: ${e.detail.value}`));
    el.querySelector('[data-a=new]').onclick = () => toast.success('Pedido creado', { title: 'Listo' });
    return el;
  },
};
