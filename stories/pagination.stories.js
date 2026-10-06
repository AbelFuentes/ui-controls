export default {
  title: 'Content/Pagination',
  tags: ['autodocs'],
  argTypes: {
    page: { control: 'number' },
    pages: { control: 'number' },
    siblings: { control: 'number' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { page: 5, pages: 20, siblings: 1, size: 'md' },
  render: ({ page, pages, siblings, size }) => {
    const el = document.createElement('div');
    el.style.cssText = 'display:grid;gap:1rem;justify-items:center';
    el.innerHTML = `
      <ui-pagination page="${page}" pages="${pages}" siblings="${siblings}" size="${size}"></ui-pagination>
      <span class="out" style="font-size:.9rem;opacity:.7">Página ${page}</span>`;
    el.querySelector('ui-pagination').addEventListener('change', (e) => {
      el.querySelector('.out').textContent = `Página ${e.detail.page}`;
    });
    return el;
  },
};

export const Default = {};
export const FewPages = { args: { page: 1, pages: 5 } };
export const ManyPages = { args: { page: 50, pages: 100, siblings: 2 } };
