export default {
  title: 'Overlays/Dropdown',
  tags: ['autodocs'],
  argTypes: {
    placement: { control: 'select', options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'] },
  },
  args: { placement: 'bottom-start' },
  render: ({ placement }) => {
    const el = document.createElement('div');
    el.style.cssText = 'display:grid;gap:1rem;justify-items:center;min-height:16rem;align-content:start';
    el.innerHTML = `
      <ui-dropdown placement="${placement}">
        <ui-button slot="trigger" variant="outline">Acciones ▾</ui-button>
        <option value="edit" data-shortcut="⌘E">Editar</option>
        <option value="copy" data-shortcut="⌘D">Duplicar</option>
        <option value="share">Compartir</option>
        <option data-separator></option>
        <option value="archive" disabled>Archivar</option>
        <option value="delete" data-danger>Eliminar</option>
      </ui-dropdown>
      <span class="out" style="font-size:.9rem;opacity:.7">Elige una acción</span>`;
    el.querySelector('ui-dropdown').addEventListener('select', (e) => {
      el.querySelector('.out').textContent = `Seleccionado: ${e.detail.value}`;
    });
    return el;
  },
};

export const Default = {};
export const AlignedEnd = { args: { placement: 'bottom-end' } };

export const UserMenu = {
  render: () => `
    <ui-dropdown placement="bottom-end">
      <ui-avatar slot="trigger" name="Abel Fuentes" status="online" style="cursor:pointer"></ui-avatar>
      <option value="profile">Perfil</option>
      <option value="settings">Ajustes</option>
      <option data-separator></option>
      <option value="logout" data-danger>Cerrar sesión</option>
    </ui-dropdown>`,
};
