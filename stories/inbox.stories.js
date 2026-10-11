import { toast } from '../src/components/toast.js';
import { h, svg } from './_shared.js';

export default { title: 'Examples/Inbox', parameters: { layout: 'fullscreen' } };

const people = ['Ana López', 'Beto Ruiz', 'Carla Gil', 'Dan Paz', 'Eva Mar', 'Fer Soto', 'Gus Rey', 'Hugo Lara'];
const subjects = [
  ['Revisión del diseño de la landing', 'Dejé comentarios en el archivo de Figma.'],
  ['Factura de septiembre', 'Adjunto la factura para tu registro.'],
  ['¿Reunión el jueves?', 'Tenemos que cerrar los pendientes del sprint.'],
  ['Bienvenido al equipo', 'Estamos felices de tenerte con nosotros.'],
  ['Actualización de precios', 'Nuevos planes disponibles desde el lunes.'],
  ['Resumen semanal', 'Estos son los números de la semana.'],
];
const labels = [['Trabajo', 'accent'], ['Finanzas', 'success'], ['Personal', 'neutral'], ['Urgente', 'danger']];
const dates = ['Hoy 9:41', 'Hoy 8:05', 'Ayer', 'Lun', 'Dom', '12 oct', '10 oct', '8 oct'];
const SIZE = 8;

export const Mailbox = {
  render: () => {
    const emails = Array.from({ length: 26 }, (_, i) => {
      const s = subjects[i % subjects.length];
      return {
        id: i + 1, from: people[i % people.length], subject: s[0], preview: s[1],
        label: labels[(i * 3) % labels.length], date: dates[i % dates.length],
        unread: i % 3 === 0, starred: i % 5 === 0,
      };
    });

    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        .ib{max-width:66rem;margin:0 auto;padding:2rem 1.25rem}
        .ib h1{margin:0;font-size:1.6rem}
        .ib .bar{display:flex;gap:.75rem;align-items:center;flex-wrap:wrap}
        .ib .grow{flex:1;min-width:14rem}
        .ib .muted{color:var(--ui-muted)}
        .ib .meta{display:flex;align-items:center;gap:.8rem;margin-bottom:1.25rem}
        .ib .msg p{line-height:1.65;margin:0 0 .9rem}
      </style>
      <div class="ib">
        <ui-stack gap="lg">
          <div class="bar">
            <h1>Bandeja de entrada</h1><ui-badge tone="accent" class="unread"></ui-badge>
            <span class="grow"></span>
            <ui-button data-a="compose">${svg('plus', 16, 'start')}Redactar</ui-button>
          </div>
          <div class="bar">
            <ui-input class="grow" type="search" label="Buscar"></ui-input>
            <ui-segmented value="all" label="Filtro">
              <option value="all">Todos</option><option value="unread">No leídos</option><option value="starred">Destacados</option>
            </ui-segmented>
          </div>
          <ui-table clickable compact row-key="id" empty="No hay mensajes" label="Mensajes"></ui-table>
          <div class="bar" style="justify-content:space-between">
            <span class="info muted" style="font-size:.9rem"></span>
            <ui-pagination page="1" pages="1" size="sm"></ui-pagination>
          </div>
        </ui-stack>

        <ui-drawer size="lg">
          <span slot="header"></span>
          <div class="msg"></div>
          <ui-button slot="footer" variant="ghost" data-a="archive">Archivar</ui-button>
          <ui-button slot="footer" data-a="reply">${svg('reply', 16, 'start')}Enviar respuesta</ui-button>
        </ui-drawer>
      </div>`;

    const $ = (s) => el.querySelector(s);
    const t = $('ui-table');
    const pg = $('ui-pagination');
    const drawer = $('ui-drawer');
    const body = $('.msg');
    let filter = 'all';
    let q = '';
    let page = 1;
    let current = null;

    t.columns = [
      {
        key: 'starred', label: '', width: '1%',
        render: (r) => {
          const b = h(`<ui-button icon variant="ghost" size="sm" label="Destacar">${svg('star', 16)}</ui-button>`);
          if (r.starred) { b.style.color = 'var(--ui-warning)'; b.firstElementChild.setAttribute('fill', 'currentColor'); }
          b.onclick = () => { r.starred = !r.starred; refresh(); };
          return b;
        },
      },
      {
        key: 'from', label: 'De', sortable: true,
        render: (r) => h(`<div style="display:flex;align-items:center;gap:.7em;${r.unread ? 'font-weight:700' : ''}"><ui-avatar size="sm" name="${r.from}"></ui-avatar><span>${r.from}</span></div>`),
      },
      {
        key: 'subject', label: 'Asunto',
        render: (r) => h(`<div style="max-width:24rem;overflow:hidden;text-overflow:ellipsis;${r.unread ? 'font-weight:700' : ''}">${r.subject} <span style="opacity:.55;font-weight:400">— ${r.preview}</span></div>`),
      },
      { key: 'label', label: 'Etiqueta', render: (r) => h(`<ui-badge tone="${r.label[1]}" size="sm">${r.label[0]}</ui-badge>`) },
      { key: 'date', label: 'Fecha', align: 'right' },
    ];

    const refresh = () => {
      const list = emails.filter((e) =>
        (filter === 'all' || (filter === 'unread' && e.unread) || (filter === 'starred' && e.starred)) &&
        `${e.from} ${e.subject} ${e.preview}`.toLowerCase().includes(q));
      const pages = Math.max(1, Math.ceil(list.length / SIZE));
      page = Math.min(page, pages);
      t.rows = list.slice((page - 1) * SIZE, page * SIZE);
      pg.setAttribute('pages', pages);
      pg.setAttribute('page', page);
      pg.hidden = pages <= 1;
      $('.info').textContent = list.length ? `${(page - 1) * SIZE + 1}–${Math.min(page * SIZE, list.length)} de ${list.length}` : '0 resultados';
      $('.unread').textContent = `${emails.filter((e) => e.unread).length} sin leer`;
    };

    t.addEventListener('rowclick', (e) => {
      current = e.detail.row;
      current.unread = false;
      $('[slot=header]').textContent = current.subject;
      body.innerHTML = `
        <div class="meta">
          <ui-avatar name="${current.from}"></ui-avatar>
          <div><strong>${current.from}</strong><div class="muted" style="font-size:.85rem">${current.date}</div></div>
          <ui-badge tone="${current.label[1]}" size="sm" style="margin-left:auto">${current.label[0]}</ui-badge>
        </div>
        <p>Hola,</p>
        <p>${current.preview} Te comparto los detalles para que los revises con calma y me digas qué opinas.</p>
        <p>Si algo no queda claro, con gusto lo platicamos en una llamada corta.</p>
        <p>Saludos,<br>${current.from}</p>
        <ui-textarea label="Responder" autosize rows="3" maxrows="8" style="margin-top:1.25rem"></ui-textarea>`;
      drawer.show();
      refresh();
    });

    $('ui-input').addEventListener('input', (e) => { q = e.currentTarget.value.toLowerCase(); page = 1; refresh(); });
    $('ui-segmented').addEventListener('change', (e) => { filter = e.detail.value; page = 1; refresh(); });
    pg.addEventListener('change', (e) => { page = e.detail.page; refresh(); });
    $('[data-a=compose]').onclick = () => toast.info('Aquí abriría el editor de correo', { title: 'Redactar' });
    $('[data-a=archive]').onclick = () => {
      emails.splice(emails.indexOf(current), 1);
      drawer.close();
      toast.success('Mensaje archivado');
      refresh();
    };
    $('[data-a=reply]').onclick = () => {
      if (!body.querySelector('ui-textarea').value.trim()) return toast.warning('Escribe una respuesta primero');
      drawer.close();
      toast.success(`Respuesta enviada a ${current.from}`);
    };

    refresh();
    return el;
  },
};
