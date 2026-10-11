import { toast } from '../src/components/toast.js';
import { h, svg } from './_shared.js';

export default { title: 'Examples/Team', parameters: { layout: 'fullscreen' } };

const roleTone = { Admin: 'accent', Editor: 'success', Lector: 'neutral' };
const statusTone = { Activo: 'success', Invitado: 'warning', Suspendido: 'danger' };
const danger = 'style="--ui-accent:#ef4444;--ui-accent-2:#f97316"';

export const Members = {
  render: () => {
    let seq = 9;
    const members = [
      { id: 1, name: 'Ana López', email: 'ana@acme.com', role: 'Admin', status: 'Activo', last: 'Hace 2 min' },
      { id: 2, name: 'Beto Ruiz', email: 'beto@acme.com', role: 'Editor', status: 'Activo', last: 'Hace 1 h' },
      { id: 3, name: 'Carla Gil', email: 'carla@acme.com', role: 'Editor', status: 'Activo', last: 'Ayer' },
      { id: 4, name: 'Dan Paz', email: 'dan@acme.com', role: 'Lector', status: 'Suspendido', last: 'Hace 3 días' },
      { id: 5, name: 'Eva Mar', email: 'eva@acme.com', role: 'Lector', status: 'Activo', last: 'Hace 5 días' },
      { id: 6, name: 'Fer Soto', email: 'fer@acme.com', role: 'Editor', status: 'Invitado', last: '—' },
      { id: 7, name: 'Gus Rey', email: 'gus@acme.com', role: 'Lector', status: 'Activo', last: 'Hace 1 sem' },
      { id: 8, name: 'Hugo Lara', email: 'hugo@acme.com', role: 'Admin', status: 'Activo', last: 'Hace 2 sem' },
    ];

    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        .tm{max-width:64rem;margin:0 auto;padding:2rem 1.25rem}
        .tm h1{margin:0;font-size:1.6rem}
        .tm .muted{color:var(--ui-muted)}
        .tm .bar{display:flex;gap:.75rem;align-items:center;flex-wrap:wrap}
        .tm .grow{flex:1;min-width:14rem}
        .tm .bulk{display:flex;gap:.6rem;align-items:center;flex-wrap:wrap;padding:.7rem 1rem;border-radius:1rem;
          background:color-mix(in srgb,var(--ui-accent) 10%,transparent);
          box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--ui-accent) 30%,transparent)}
        .tm .bulk[hidden]{display:none}
      </style>
      <div class="tm">
        <ui-stack gap="lg">
          <div class="bar">
            <div><h1>Equipo</h1><div class="muted count"></div></div>
            <span class="grow"></span>
            <ui-button data-a="invite">${svg('plus', 16, 'start')}Invitar persona</ui-button>
          </div>
          <div class="bar">
            <ui-input class="grow" type="search" label="Buscar por nombre o correo"></ui-input>
            <ui-segmented value="all" label="Rol">
              <option value="all">Todos</option><option value="Admin">Admin</option><option value="Editor">Editor</option><option value="Lector">Lector</option>
            </ui-segmented>
          </div>
          <div class="bulk" hidden>
            <strong class="n"></strong>
            <span style="flex:1"></span>
            <ui-button size="sm" variant="outline" data-b="Editor">Hacer editor</ui-button>
            <ui-button size="sm" variant="outline" data-b="Lector">Hacer lector</ui-button>
            <ui-button size="sm" data-b="delete" ${danger}>Eliminar</ui-button>
          </div>
          <ui-table selectable row-key="id" empty="Nadie coincide con tu búsqueda" label="Miembros"></ui-table>
        </ui-stack>

        <ui-dialog size="sm">
          <span slot="header">Invitar al equipo</span>
          <ui-stack>
            <ui-input name="email" type="email" label="Correo" required></ui-input>
            <ui-select name="role" label="Rol" value="Editor">
              <option value="Admin">Admin</option><option value="Editor">Editor</option><option value="Lector">Lector</option>
            </ui-select>
          </ui-stack>
          <ui-button slot="footer" variant="ghost" data-a="cancel">Cancelar</ui-button>
          <ui-button slot="footer" data-a="send">Enviar invitación</ui-button>
        </ui-dialog>
      </div>`;

    const $ = (s) => el.querySelector(s);
    const t = $('ui-table');
    const dialog = $('ui-dialog');
    let role = 'all';
    let q = '';

    const bulk = () => {
      const n = t.selection.length;
      $('.bulk').hidden = n === 0;
      $('.n').textContent = `${n} seleccionado${n === 1 ? '' : 's'}`;
    };
    const refresh = () => {
      const list = members.filter((m) => (role === 'all' || m.role === role) && `${m.name} ${m.email}`.toLowerCase().includes(q));
      t.rows = list;
      $('.count').textContent = `${members.length} miembros · ${members.filter((m) => m.status === 'Activo').length} activos`;
      bulk();
    };
    const remove = (rows) => {
      rows.forEach((r) => members.splice(members.indexOf(r), 1));
      t.clearSelection();
      refresh();
    };
    const act = (r, v) => {
      if (v === 'delete') { remove([r]); return toast.success(`${r.name} fue eliminado`); }
      if (v === 'suspend') {
        r.status = r.status === 'Suspendido' ? 'Activo' : 'Suspendido';
        toast.info(`${r.name}: ${r.status.toLowerCase()}`);
      } else { r.role = v; toast.success(`${r.name} ahora es ${v}`); }
      refresh();
    };

    t.columns = [
      {
        key: 'name', label: 'Miembro', sortable: true,
        render: (r) => h(`<div style="display:flex;align-items:center;gap:.8em"><ui-avatar name="${r.name}" size="sm"></ui-avatar><div><strong>${r.name}</strong><div style="font-size:.85em;opacity:.6">${r.email}</div></div></div>`),
      },
      { key: 'role', label: 'Rol', sortable: true, render: (r) => h(`<ui-badge tone="${roleTone[r.role]}" size="sm">${r.role}</ui-badge>`) },
      { key: 'status', label: 'Estado', sortable: true, render: (r) => h(`<ui-badge tone="${statusTone[r.status]}" size="sm" dot>${r.status}</ui-badge>`) },
      { key: 'last', label: 'Última actividad' },
      {
        key: 'actions', label: '', width: '1%', align: 'right',
        render: (r) => {
          const dd = h(`<ui-dropdown placement="bottom-end">
            <ui-button slot="trigger" icon variant="ghost" size="sm" label="Acciones">${svg('more', 18)}</ui-button>
            <option value="Admin">Hacer admin</option><option value="Editor">Hacer editor</option><option value="Lector">Hacer lector</option>
            <option data-separator></option>
            <option value="suspend">${r.status === 'Suspendido' ? 'Reactivar' : 'Suspender'}</option>
            <option value="delete" data-danger>Eliminar</option>
          </ui-dropdown>`);
          dd.addEventListener('select', (e) => act(r, e.detail.value));
          return dd;
        },
      },
    ];

    t.addEventListener('select', bulk);
    $('ui-input').addEventListener('input', (e) => { q = e.currentTarget.value.toLowerCase(); refresh(); });
    $('ui-segmented').addEventListener('change', (e) => { role = e.detail.value; refresh(); });

    el.querySelectorAll('[data-b]').forEach((b) => {
      b.onclick = () => {
        const rows = t.selection;
        if (b.dataset.b === 'delete') { remove(rows); return toast.success(`${rows.length} miembros eliminados`); }
        rows.forEach((r) => (r.role = b.dataset.b));
        toast.success(`${rows.length} ahora son ${b.dataset.b}`);
        refresh();
      };
    });

    $('[data-a=invite]').onclick = () => dialog.show();
    $('[data-a=cancel]').onclick = () => dialog.close();
    $('[data-a=send]').onclick = () => {
      const email = dialog.querySelector('ui-input');
      if (!email.checkValidity()) return email.reportValidity();
      members.unshift({
        id: seq++, name: email.value.split('@')[0], email: email.value,
        role: dialog.querySelector('ui-select').value, status: 'Invitado', last: '—',
      });
      email.value = '';
      dialog.close();
      toast.success('Invitación enviada');
      refresh();
    };

    refresh();
    return el;
  },
};
