export default {
  title: 'Overlays/Dialog',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    persistent: { control: 'boolean' },
    'no-close': { control: 'boolean' },
  },
  args: { size: 'md', persistent: false, 'no-close': false },
  render: ({ size, persistent, 'no-close': noClose }) => {
    const el = document.createElement('div');
    el.innerHTML = `
      <ui-button>Abrir diálogo</ui-button>
      <ui-dialog size="${size}" ${persistent ? 'persistent' : ''} ${noClose ? 'no-close' : ''}>
        <span slot="header">Eliminar proyecto</span>
        Esta acción no se puede deshacer. Se borrarán todos los archivos asociados.
        <ui-button slot="footer" variant="ghost" data-a="x">Cancelar</ui-button>
        <ui-button slot="footer" style="--ui-accent:#ef4444;--ui-accent-2:#f97316" data-a="x">Eliminar</ui-button>
      </ui-dialog>`;
    const d = el.querySelector('ui-dialog');
    el.querySelector('ui-button').onclick = () => d.show();
    el.querySelectorAll('[data-a]').forEach((b) => (b.onclick = () => d.close()));
    return el;
  },
};

export const Default = {};
export const Persistent = { args: { persistent: true, 'no-close': true } };

export const WithForm = {
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <ui-button>Invitar persona</ui-button>
      <ui-dialog>
        <span slot="header">Invitar al equipo</span>
        <ui-stack>
          <ui-input label="Correo" type="email"></ui-input>
          <ui-select label="Rol" value="editor">
            <option value="admin">Administrador</option><option value="editor">Editor</option><option value="viewer">Lector</option>
          </ui-select>
        </ui-stack>
        <ui-button slot="footer" variant="ghost" data-a="x">Cancelar</ui-button>
        <ui-button slot="footer" data-a="x">Enviar invitación</ui-button>
      </ui-dialog>`;
    const d = el.querySelector('ui-dialog');
    el.querySelector('ui-button').onclick = () => d.show();
    el.querySelectorAll('[data-a]').forEach((b) => (b.onclick = () => d.close()));
    return el;
  },
};
