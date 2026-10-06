const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== false && v !== '' && v != null)
    .map(([k, v]) => (v === true ? k : `${k}="${v}"`))
    .join(' ');

export default {
  title: 'Controls/Progress',
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    circular: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    'show-value': { control: 'boolean' },
    label: { control: 'text' },
  },
  args: { value: 60, size: 'md', circular: false, indeterminate: false, 'show-value': true, label: 'Subiendo archivo' },
  render: (a) => `<ui-progress ${attrs(a)} style="width:min(24rem,92vw)"></ui-progress>`,
};

export const Default = {};
export const Circular = { args: { circular: true, label: '' } };
export const Indeterminate = { args: { indeterminate: true } };
export const CircularIndeterminate = { args: { circular: true, indeterminate: true } };

export const Live = {
  render: () => {
    const el = document.createElement('ui-progress');
    el.setAttribute('show-value', '');
    el.setAttribute('label', 'Procesando');
    el.style.width = 'min(24rem,92vw)';
    let v = 0;
    const t = setInterval(() => {
      v = (v + 7) % 107;
      el.value = Math.min(v, 100);
      if (!el.isConnected) clearInterval(t);
    }, 600);
    return el;
  },
};
