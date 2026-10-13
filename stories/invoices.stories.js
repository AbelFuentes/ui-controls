import { toast } from '../src/components/toast.js';
import { h, money, svg } from './_shared.js';

export default { title: 'Examples/Invoices', parameters: { layout: 'fullscreen' } };

const DAY = 864e5;
const IVA = 0.16;
const SIZE = 8;
const today = new Date();
today.setHours(0, 0, 0, 0);
const fmt = (d) => d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
const clients = ['Acme SA de CV', 'Globex', 'Initech', 'Umbrella MX', 'Soylent', 'Hooli', 'Stark Industries', 'Wayne Enterprises'];
const catalog = [
  ['Diseño de interfaz', 1, 12000], ['Desarrollo frontend', 20, 900], ['Consultoría', 8, 1500],
  ['Soporte mensual', 1, 4500], ['Auditoría de accesibilidad', 1, 8000], ['Licencia anual', 1, 6200],
];
const stT = { paid: ['Pagada', 'success'], pending: ['Pendiente', 'warning'], overdue: ['Vencida', 'danger'] };

const build = () =>
  Array.from({ length: 23 }, (_, i) => {
    const issued = new Date(+today - (i * 5 + 2) * DAY);
    return {
      id: 1040 - i, folio: `F-${1040 - i}`, client: clients[i % clients.length], issued,
      due: new Date(+issued + (i % 2 ? 30 : 15) * DAY), iva: true, paid: i % 3 === 1 || i > 13,
      items: [catalog[i % 6], catalog[(i + 2) % 6]].slice(0, 1 + (i % 2)).map(([d, q, p]) => ({ d, q, p })),
    };
  });

const status = (i) => (i.paid ? 'paid' : i.due < today ? 'overdue' : 'pending');
const sub = (i) => i.items.reduce((s, x) => s + x.q * x.p, 0);
const tax = (i) => (i.iva ? Math.round(sub(i) * IVA) : 0);
const total = (i) => sub(i) + tax(i);
const SV = {
  folio: (i) => i.id, client: (i) => i.client, issued: (i) => +i.issued, due: (i) => +i.due,
  status: (i) => status(i), total,
};

export const Dashboard = {
  render: () => {
    let seq = 1041;
    const invoices = build();
    let filter = 'all';
    let q = '';
    let page = 1;
    let sortKey = 'issued';
    let dir = 'desc';
    let current = null;

    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        .iv{max-width:72rem;margin:0 auto;padding:2rem 1.25rem}
        .iv h1{margin:0;font-size:1.6rem}
        .iv .muted{color:var(--ui-muted)}
        .iv .small{font-size:.85rem}
        .iv .bar{display:flex;gap:.75rem;align-items:center;flex-wrap:wrap}
        .iv .grow{flex:1;min-width:14rem}
        .iv .stat{font-size:1.7rem;font-weight:800;letter-spacing:-.02em}
        .iv .bulk{display:flex;gap:.6rem;align-items:center;flex-wrap:wrap;padding:.7rem 1rem;border-radius:1rem;
          background:color-mix(in srgb,var(--ui-accent) 10%,transparent);
          box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--ui-accent) 30%,transparent)}
        .iv .bulk[hidden]{display:none}
        .iv .line{display:flex;justify-content:space-between;align-items:center;gap:1rem}
        .iv .tot{display:grid;gap:.5rem;padding:1rem;border-radius:1rem;background:color-mix(in srgb,currentColor 5%,transparent)}
        .iv .big{font-size:1.2rem;font-weight:800;padding-top:.5rem;border-top:1px solid var(--ui-border)}
      </style>
      <div class="iv">
        <ui-stack gap="lg">
          <div class="bar">
            <div><h1>Facturas</h1><div class="muted">Emite, cobra y da seguimiento</div></div>
            <span class="grow"></span>
            <ui-button data-a="new">${svg('plus', 16, 'start')}Nueva factura</ui-button>
          </div>

          <ui-grid min="14rem">
            <ui-card variant="outlined" padding="sm"><span slot="header" class="muted small">Facturado</span><div class="stat s-all"></div></ui-card>
            <ui-card variant="outlined" padding="sm"><span slot="header" class="muted small">Cobrado</span><div class="stat s-paid"></div><ui-progress class="s-prog" size="sm" style="margin-top:.8rem"></ui-progress></ui-card>
            <ui-card variant="outlined" padding="sm"><span slot="header" class="muted small">Por cobrar</span><div class="stat s-due"></div></ui-card>
            <ui-card variant="outlined" padding="sm"><span slot="header" class="muted small">Vencido</span><div class="stat s-over" style="color:var(--ui-danger)"></div></ui-card>
          </ui-grid>

          <div class="bar">
            <ui-input class="grow" type="search" label="Buscar por folio o cliente"></ui-input>
            <ui-segmented class="flt" value="all" label="Estado"></ui-segmented>
          </div>

          <div class="bulk" hidden>
            <strong class="n"></strong><span class="grow"></span>
            <ui-button size="sm" variant="outline" data-b="csv">${svg('download', 15, 'start')}Exportar CSV</ui-button>
            <ui-button size="sm" data-b="paid">Marcar como pagadas</ui-button>
          </div>

          <ui-table clickable selectable manual-sort row-key="id" sort-key="issued" sort-dir="desc" empty="No hay facturas con esos filtros" label="Facturas"></ui-table>

          <div class="bar" style="justify-content:space-between">
            <span class="info muted small"></span>
            <ui-pagination page="1" pages="1" size="sm"></ui-pagination>
          </div>
        </ui-stack>

        <ui-drawer size="lg">
          <span slot="header"></span>
          <div class="body"></div>
          <ui-button slot="footer" variant="outline" data-a="pdf">${svg('download', 15, 'start')}Descargar PDF</ui-button>
          <ui-button slot="footer" data-a="paid">Marcar como pagada</ui-button>
        </ui-drawer>

        <ui-dialog size="sm">
          <span slot="header">Nueva factura</span>
          <ui-stack>
            <ui-select class="f-client" label="Cliente" value="${clients[0]}">${clients.map((c) => `<option value="${c}">${c}</option>`).join('')}</ui-select>
            <ui-input class="f-concept" label="Concepto" required></ui-input>
            <ui-input class="f-amount" type="number" label="Monto (sin IVA)" required min="1"></ui-input>
            <ui-segmented class="f-due" value="30" label="Vence en"><option value="15">15 días</option><option value="30">30 días</option><option value="60">60 días</option></ui-segmented>
            <div class="line"><span>Agregar IVA (16%)</span><ui-toggle class="f-iva" checked label="IVA"></ui-toggle></div>
          </ui-stack>
          <ui-button slot="footer" variant="ghost" data-a="cancel">Cancelar</ui-button>
          <ui-button slot="footer" data-a="create">Crear factura</ui-button>
        </ui-dialog>
      </div>`;

    const $ = (s) => el.querySelector(s);
    const t = $('ui-table');
    const pg = $('ui-pagination');
    const seg = $('.flt');
    const drawer = $('ui-drawer');
    const body = $('.body');
    const dialog = $('ui-dialog');

    const menu = (i) => {
      const open = !i.paid;
      const dd = h(`<ui-dropdown placement="bottom-end">
        <ui-button slot="trigger" icon variant="ghost" size="sm" label="Acciones">${svg('more', 18)}</ui-button>
        <option value="view">Ver detalle</option>
        <option value="pdf">Descargar PDF</option>
        ${open ? '<option value="paid">Marcar como pagada</option><option value="remind">Enviar recordatorio</option>' : ''}
        <option data-separator></option>
        <option value="delete" data-danger>Eliminar</option>
      </ui-dropdown>`);
      dd.addEventListener('select', (e) => {
        const v = e.detail.value;
        if (v === 'view') return openInvoice(i);
        if (v === 'pdf') return toast.success(`${i.folio}.pdf descargado`);
        if (v === 'paid') return markPaid([i]);
        if (v === 'remind') return toast.info(`Recordatorio enviado a ${i.client}`);
        invoices.splice(invoices.indexOf(i), 1);
        t.clearSelection();
        toast.success(`${i.folio} eliminada`);
        refresh();
      });
      return dd;
    };

    t.columns = [
      { key: 'folio', label: 'Folio', sortable: true, render: (i) => h(`<strong>${i.folio}</strong>`) },
      {
        key: 'client', label: 'Cliente', sortable: true,
        render: (i) => h(`<div style="display:flex;align-items:center;gap:.7em"><ui-avatar size="sm" name="${i.client}"></ui-avatar><span>${i.client}</span></div>`),
      },
      { key: 'issued', label: 'Emisión', sortable: true, render: (i) => fmt(i.issued) },
      { key: 'due', label: 'Vence', sortable: true, render: (i) => fmt(i.due) },
      {
        key: 'status', label: 'Estado', sortable: true,
        render: (i) => h(`<ui-badge tone="${stT[status(i)][1]}" size="sm" dot>${stT[status(i)][0]}</ui-badge>`),
      },
      { key: 'total', label: 'Total', sortable: true, align: 'right', render: (i) => money(total(i)) },
      { key: 'actions', label: '', width: '1%', align: 'right', render: menu },
    ];

    const filtered = () =>
      invoices.filter((i) => (filter === 'all' || status(i) === filter) && `${i.folio} ${i.client}`.toLowerCase().includes(q));

    const refresh = () => {
      const f = SV[sortKey];
      const list = filtered().sort((a, b) => {
        const x = f(a);
        const y = f(b);
        const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true });
        return dir === 'asc' ? r : -r;
      });
      const pages = Math.max(1, Math.ceil(list.length / SIZE));
      page = Math.min(page, pages);
      t.rows = list.slice((page - 1) * SIZE, page * SIZE);
      pg.setAttribute('pages', pages);
      pg.setAttribute('page', page);
      pg.hidden = pages <= 1;
      $('.info').textContent = list.length ? `${(page - 1) * SIZE + 1}–${Math.min(page * SIZE, list.length)} de ${list.length}` : '0 resultados';

      const sum = (arr) => arr.reduce((s, i) => s + total(i), 0);
      const paid = invoices.filter((i) => status(i) === 'paid');
      const over = invoices.filter((i) => status(i) === 'overdue');
      const all = sum(invoices);
      $('.s-all').textContent = money(all);
      $('.s-paid').textContent = money(sum(paid));
      $('.s-due').textContent = money(all - sum(paid));
      $('.s-over').textContent = money(sum(over));
      $('.s-prog').value = all ? (sum(paid) / all) * 100 : 0;

      const count = (s) => invoices.filter((i) => status(i) === s).length;
      const sig = [invoices.length, count('paid'), count('pending'), count('overdue')].join();
      if (seg.dataset.sig !== sig) {
        seg.dataset.sig = sig;
        seg.innerHTML = `<option value="all">Todas (${invoices.length})</option>
          <option value="paid">Pagadas (${count('paid')})</option>
          <option value="pending">Pendientes (${count('pending')})</option>
          <option value="overdue">Vencidas (${count('overdue')})</option>`;
      }
      bulk();
    };

    const bulk = () => {
      const n = t.selection.length;
      $('.bulk').hidden = n === 0;
      $('.n').textContent = `${n} seleccionada${n === 1 ? '' : 's'}`;
    };

    const markPaid = (rows) => {
      rows.forEach((i) => (i.paid = true));
      t.clearSelection();
      toast.success(rows.length === 1 ? `${rows[0].folio} marcada como pagada` : `${rows.length} facturas marcadas como pagadas`);
      refresh();
      if (current && drawer.open) openInvoice(current);
    };

    const openInvoice = (i) => {
      const s = status(i);
      current = i;
      $('[slot=header]').textContent = `Factura ${i.folio}`;
      body.innerHTML = `
        <ui-stack gap="lg">
          <div class="line"><ui-badge tone="${stT[s][1]}" dot>${stT[s][0]}</ui-badge><span class="muted small">Emitida el ${fmt(i.issued)}</span></div>
          <ui-grid min="12rem">
            <div><div class="muted small">Cliente</div><strong>${i.client}</strong></div>
            <div><div class="muted small">Vence</div><strong>${fmt(i.due)}</strong></div>
          </ui-grid>
          <ui-table class="items" compact label="Conceptos"></ui-table>
          <div class="tot">
            <div class="line"><span class="muted">Subtotal</span><span>${money(sub(i))}</span></div>
            <div class="line"><span class="muted">IVA (16%)</span><span>${i.iva ? money(tax(i)) : '—'}</span></div>
            <div class="line big"><span>Total</span><span>${money(total(i))}</span></div>
          </div>
          ${s === 'overdue'
            ? `<ui-alert tone="danger"><span slot="title">Factura vencida</span>Venció hace ${Math.round((today - i.due) / DAY)} días.</ui-alert>`
            : s === 'paid'
              ? '<ui-alert tone="success">Pago recibido. Gracias.</ui-alert>'
              : `<ui-alert tone="info">Vence en ${Math.round((i.due - today) / DAY)} días.</ui-alert>`}
        </ui-stack>`;
      const it = body.querySelector('.items');
      it.columns = [
        { key: 'd', label: 'Concepto' },
        { key: 'q', label: 'Cant.', align: 'right' },
        { key: 'p', label: 'Precio', align: 'right', render: (r) => money(r.p) },
        { key: 'm', label: 'Importe', align: 'right', render: (r) => money(r.q * r.p) },
      ];
      it.rows = i.items;
      $('[data-a=paid]').hidden = s === 'paid';
      if (!drawer.open) drawer.show();
    };

    const csv = (rows) =>
      ['Folio,Cliente,Emisión,Vence,Estado,Total',
        ...rows.map((r) => [r.folio, `"${r.client}"`, fmt(r.issued), fmt(r.due), stT[status(r)][0], total(r)].join(','))].join('\n');

    t.addEventListener('rowclick', (e) => openInvoice(e.detail.row));
    t.addEventListener('select', bulk);
    t.addEventListener('sort', (e) => {
      sortKey = e.detail.key ?? 'issued';
      dir = e.detail.key ? e.detail.dir : 'desc';
      page = 1;
      refresh();
    });
    pg.addEventListener('change', (e) => { page = e.detail.page; refresh(); });
    $('ui-input').addEventListener('input', (e) => { q = e.currentTarget.value.toLowerCase(); page = 1; refresh(); });
    seg.addEventListener('change', (e) => { filter = e.detail.value; page = 1; refresh(); });

    $('[data-b=paid]').onclick = () => markPaid(t.selection.filter((i) => !i.paid));
    $('[data-b=csv]').onclick = () => {
      try {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv(t.selection)], { type: 'text/csv' }));
        a.download = 'facturas.csv';
        a.click();
        URL.revokeObjectURL(a.href);
      } catch { /* sin descarga en el iframe */ }
      toast.success(`${t.selection.length} facturas exportadas`);
    };
    $('[data-a=pdf]').onclick = () => toast.success(`${current.folio}.pdf descargado`);
    $('[data-a=paid]').onclick = () => markPaid([current]);

    $('[data-a=new]').onclick = () => {
      ['.f-concept', '.f-amount'].forEach((s) => ($(s).value = ''));
      dialog.show();
    };
    $('[data-a=cancel]').onclick = () => dialog.close();
    $('[data-a=create]').onclick = () => {
      const concept = $('.f-concept');
      const amount = $('.f-amount');
      if (!concept.checkValidity()) return concept.reportValidity();
      if (!amount.checkValidity()) return amount.reportValidity();
      const issued = new Date(today);
      const inv = {
        id: seq++, folio: `F-${seq - 1}`, client: $('.f-client').value, issued,
        due: new Date(+issued + Number($('.f-due').value) * DAY), iva: $('.f-iva').checked, paid: false,
        items: [{ d: concept.value.trim(), q: 1, p: Number(amount.value) }],
      };
      invoices.unshift(inv);
      dialog.close();
      toast.success(`${inv.folio} creada`, { title: 'Factura emitida' });
      page = 1;
      refresh();
    };

    refresh();
    return el;
  },
};
