const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== false && v !== '' && v != null)
    .map(([k, v]) => (v === true ? k : `${k}="${v}"`))
    .join(' ');

export default {
  title: 'Controls/Avatar',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    status: { control: 'inline-radio', options: ['', 'online', 'busy', 'away', 'offline'] },
    square: { control: 'boolean' },
    name: { control: 'text' },
  },
  args: { size: 'lg', status: '', square: false, name: 'Abel Fuentes' },
  render: (a) => `<ui-avatar ${attrs(a)}></ui-avatar>`,
};

export const Default = {};
export const WithStatus = { args: { status: 'online' } };
export const Square = { args: { square: true } };
export const Broken = { args: { src: 'https://invalid.example/x.png' } };

export const Sizes = {
  render: () => `
    <div style="display:flex;gap:1rem;align-items:center">
      ${['xs', 'sm', 'md', 'lg', 'xl'].map((s) => `<ui-avatar size="${s}" name="Ana Lopez"></ui-avatar>`).join('')}
    </div>`,
};

export const Group = {
  render: () => `
    <div style="display:flex">
      ${['Ana Lopez', 'Beto Ruiz', 'Carla Gil', 'Dan Paz', 'Eva Mar']
        .map((n) => `<ui-avatar name="${n}" style="margin-left:-.6rem;box-shadow:0 0 0 .2rem var(--ui-surface,Canvas);border-radius:50%"></ui-avatar>`)
        .join('')}
    </div>`,
};
