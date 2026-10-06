const art = (a, b) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><circle cx="500" cy="90" r="120" fill="#fff" opacity=".18"/><circle cx="130" cy="300" r="160" fill="#fff" opacity=".12"/></svg>`
  )}`;

const media = (a = '#6366f1', b = '#a855f7') =>
  `<img slot="media" alt="" src="${art(a, b)}" style="aspect-ratio:16/9" />`;

const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== false && v !== '' && v != null)
    .map(([k, v]) => (v === true ? k : `${k}="${v}"`))
    .join(' ');

export default {
  title: 'Controls/Card',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['elevated', 'outlined', 'soft'] },
    padding: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
    interactive: { control: 'boolean' },
    withMedia: { control: 'boolean' },
    withHeader: { control: 'boolean' },
    withFooter: { control: 'boolean' },
  },
  args: { variant: 'elevated', padding: 'md', interactive: false, withMedia: true, withHeader: true, withFooter: true },
  render: ({ withMedia, withHeader, withFooter, ...a }) => `
    <ui-card style="width:min(22rem,90vw)" ${attrs(a)}>
      ${withMedia ? media() : ''}
      ${withHeader ? '<span slot="header">Aurora boreal</span>' : ''}
      Una noche clara en el norte, con cielos que cambian de color cada minuto.
      ${withFooter ? '<ui-button slot="footer" size="sm">Reservar</ui-button><ui-button slot="footer" size="sm" variant="ghost">Detalles</ui-button>' : ''}
    </ui-card>`,
};

export const Default = {};
export const Outlined = { args: { variant: 'outlined' } };
export const Soft = { args: { variant: 'soft' } };
export const Interactive = { args: { interactive: true, withFooter: false } };
export const NoMedia = { args: { withMedia: false } };
export const Large = { args: { padding: 'lg', withMedia: false } };

export const Gallery = {
  parameters: { layout: 'padded' },
  render: () => `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(16rem,1fr));gap:1.25rem;max-width:60rem">
      ${[
        ['#6366f1', '#a855f7', 'Aurora'],
        ['#10b981', '#06b6d4', 'Bosque'],
        ['#f97316', '#ef4444', 'Atardecer'],
      ]
        .map(
          ([a, b, t]) => `
        <ui-card interactive>
          ${media(a, b)}
          <span slot="header">${t}</span>
          Descubre destinos para cada estación del año.
        </ui-card>`
        )
        .join('')}
    </div>`,
};

export const CustomColors = {
  render: () => `
    <ui-card interactive variant="soft" style="--ui-accent:#10b981;width:min(22rem,90vw)">
      <span slot="header">Verde</span>
      Tarjeta suave con el acento cambiado.
    </ui-card>`,
};
