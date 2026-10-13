import { toast } from '../src/components/toast.js';
import { svg } from './_shared.js';

export default { title: 'Examples/Calendar', parameters: { layout: 'fullscreen' } };

const TAGS = { Trabajo: 'accent', Personal: 'success', Salud: 'warning', Urgente: 'danger' };
const COLOR = {
  Trabajo: 'var(--ui-accent)', Personal: 'var(--ui-success)', Salud: 'var(--ui-warning)', Urgente: 'var(--ui-danger)',
};
const DOW = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const pad = (n) => String(n).padStart(2, '0');
const key = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const timeOpts = Array.from({ length: 29 }, (_, i) => {
  const m = 7 * 60 + i * 30;
  const t = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
  return `<option value="${t}">${t}</option>`;
}).join('');
const endOf = (e) => {
  const [hh, mm] = e.time.split(':').map(Number);
  const t = hh * 60 + mm + e.dur;
  return `${pad(Math.floor(t / 60) % 24)}:${pad(t % 60)}`;
};

export const Agenda = {
  render: () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let seq = 1;
    const mk = (d, time, dur, title, tag) => ({
      id: seq++, date: key(new Date(now.getFullYear(), now.getMonth(), d)), time, dur, title, tag,
    });
    const events = [
      mk(2, '09:00', 60, 'Daily del equipo', 'Trabajo'), mk(2, '13:30', 60, 'Comida con Ana', 'Personal'),
      mk(5, '10:00', 120, 'Revisión de diseño', 'Trabajo'), mk(8, '09:30', 30, 'Entrega de propuesta', 'Urgente'),
      mk(8, '18:00', 60, 'Gimnasio', 'Salud'), mk(12, '11:00', 60, 'Demo con cliente', 'Trabajo'),
      mk(12, '16:00', 30, 'Dentista', 'Salud'), mk(12, '19:30', 120, 'Cena familiar', 'Personal'),
      mk(15, '10:30', 60, 'Planeación del sprint', 'Trabajo'), mk(18, '08:00', 60, 'Correr en el parque', 'Salud'),
      mk(21, '12:00', 90, 'Comida de equipo', 'Personal'), mk(24, '17:00', 30, 'Cierre de facturación', 'Urgente'),
      mk(27, '09:00', 60, 'Retrospectiva', 'Trabajo'),
    ];
    let cur = new Date(now.getFullYear(), now.getMonth(), 1);
    let sel = new Date(today);
    let view = 'month';
    const by = (k) => events.filter((e) => e.date === k).sort((a, b) => a.time.localeCompare(b.time));

    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        .cal{max-width:74rem;margin:0 auto;padding:1.5rem 1.25rem 3rem}
        .cal .bar{display:flex;align-items:center;gap:.75rem;flex-wrap:wrap}
        .cal .ttl{margin:0;font-size:1.5rem;letter-spacing:-.02em;min-width:11rem}
        .cal .sp{flex:1}
        .cal .muted{color:var(--ui-muted)}
        .cal .small{font-size:.85rem}
        .cal .cols{display:grid;grid-template-columns:minmax(0,1fr) 20rem;gap:1.25rem;align-items:start}
        @media (max-width:980px){.cal .cols{grid-template-columns:1fr}}
        .cal .grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:1px;background:var(--ui-border);
          border-radius:1rem;overflow:hidden;box-shadow:0 0 0 1px var(--ui-border)}
        .cal .dow{background:var(--ui-surface);padding:.6rem;text-align:center;font-size:.72rem;font-weight:600;
          color:var(--ui-muted);text-transform:uppercase;letter-spacing:.05em}
        .cal .day{all:unset;box-sizing:border-box;background:var(--ui-surface);min-height:6.2rem;padding:.45rem;
          display:flex;flex-direction:column;gap:.25rem;cursor:pointer;transition:background-color .15s}
        .cal .day:hover{background:color-mix(in srgb,var(--ui-accent) 6%,var(--ui-surface))}
        .cal .day:focus-visible{outline:.15rem solid var(--ui-accent);outline-offset:-.15rem}
        .cal .day.out{opacity:.45}
        .cal .day .n{width:1.7rem;height:1.7rem;display:grid;place-items:center;border-radius:50%;font-size:.85rem;font-weight:600}
        .cal .day.today .n{background:var(--ui-accent);color:#fff}
        .cal .day.sel{background:color-mix(in srgb,var(--ui-accent) 12%,var(--ui-surface));
          box-shadow:inset 0 0 0 .13rem var(--ui-accent)}
        .cal .chips{display:flex;flex-direction:column;gap:.2rem}
        .cal .chip{display:block;font-size:.72rem;font-weight:600;padding:.12rem .4rem;border-radius:.4rem;white-space:nowrap;
          overflow:hidden;text-overflow:ellipsis;color:var(--c);background:color-mix(in srgb,var(--c) 15%,transparent)}
        .cal .more{font-size:.72rem;color:var(--ui-muted);padding-left:.2rem}
        @media (max-width:640px){
          .cal .day{min-height:3.8rem;align-items:center}
          .cal .chips{flex-direction:row;flex-wrap:wrap;justify-content:center}
          .cal .chip{font-size:0;width:.45rem;height:.45rem;padding:0;border-radius:50%;background:var(--c)}
          .cal .more{display:none}
        }
        .cal .side{position:sticky;top:1rem}
        .cal .ev{display:flex;gap:.8rem;align-items:flex-start;padding:.75rem 0;border-bottom:1px solid var(--ui-border)}
        .cal .ev:last-child{border:0}
        .cal .bar-c{width:.3rem;align-self:stretch;border-radius:1rem;background:var(--c);flex:none}
        .cal .ev .t{flex:1;min-width:0}
        .cal .ev strong{display:block}
        .cal .gh{margin:1.25rem 0 .4rem;font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--ui-muted)}
        .cal .arow{cursor:pointer}
        .cal .empty{text-align:center;padding:1.5rem 0;color:var(--ui-muted)}
      </style>
      <div class="cal">
        <ui-stack gap="lg">
          <div class="bar">
            <h1 class="ttl"></h1>
            <ui-button icon variant="outline" size="sm" data-a="prev" label="Mes anterior">${svg('left', 16)}</ui-button>
            <ui-button icon variant="outline" size="sm" data-a="next" label="Mes siguiente">${svg('right', 16)}</ui-button>
            <ui-button variant="ghost" size="sm" data-a="today">Hoy</ui-button>
            <span class="sp"></span>
            <ui-segmented value="month" label="Vista" size="sm"><option value="month">Mes</option><option value="agenda">Agenda</option></ui-segmented>
            <ui-button data-a="new">${svg('plus', 16, 'start')}Nuevo evento</ui-button>
          </div>
          <div class="cols">
            <div class="main"></div>
            <ui-card class="side" padding="lg"><div class="sidebody"></div></ui-card>
          </div>
        </ui-stack>

        <ui-dialog size="sm">
          <span slot="header">Nuevo evento</span>
          <ui-stack>
            <ui-input class="f-title" label="Título" required></ui-input>
            <ui-grid min="10rem">
              <ui-select class="f-time" label="Hora" value="09:00">${timeOpts}</ui-select>
              <ui-segmented class="f-dur" value="60" label="Duración">
                <option value="30">30 min</option><option value="60">1 h</option><option value="120">2 h</option>
              </ui-segmented>
            </ui-grid>
            <ui-radio-group class="f-tag" value="Trabajo" orientation="horizontal" label="Etiqueta">
              ${Object.keys(TAGS).map((t) => `<ui-radio value="${t}">${t}</ui-radio>`).join('')}
            </ui-radio-group>
            <div class="muted small f-day"></div>
          </ui-stack>
          <ui-button slot="footer" variant="ghost" data-a="cancel">Cancelar</ui-button>
          <ui-button slot="footer" data-a="save">Guardar</ui-button>
        </ui-dialog>
      </div>`;

    const $ = (s) => el.querySelector(s);
    const main = $('.main');
    const side = $('.sidebody');
    const dialog = $('ui-dialog');

    const paintMonth = () => {
      const first = new Date(cur.getFullYear(), cur.getMonth(), 1);
      const start = new Date(first);
      start.setDate(1 - ((first.getDay() + 6) % 7));
      const cells = Array.from({ length: 42 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const k = key(d);
        const evs = by(k);
        const label = d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
        return `<button class="day${d.getMonth() !== cur.getMonth() ? ' out' : ''}${k === key(today) ? ' today' : ''}${k === key(sel) ? ' sel' : ''}"
            data-d="${k}" aria-label="${label}, ${evs.length} eventos" aria-pressed="${k === key(sel)}">
          <span class="n">${d.getDate()}</span>
          <span class="chips">${evs.slice(0, 2).map((e) => `<span class="chip" style="--c:${COLOR[e.tag]}">${e.time} ${e.title}</span>`).join('')}</span>
          ${evs.length > 2 ? `<span class="more">+${evs.length - 2} más</span>` : ''}
        </button>`;
      }).join('');
      main.innerHTML = `<div class="grid">${DOW.map((d) => `<div class="dow">${d}</div>`).join('')}${cells}</div>`;
    };

    const paintAgenda = () => {
      const days = [...new Set(events.filter((e) => e.date.startsWith(`${cur.getFullYear()}-${pad(cur.getMonth() + 1)}`)).map((e) => e.date))].sort();
      main.innerHTML = days.length
        ? days.map((k) => {
            const [y, m, d] = k.split('-').map(Number);
            const label = cap(new Date(y, m - 1, d).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }));
            return `<div class="gh">${label}</div>
              <ui-card variant="outlined" padding="sm">${by(k).map((e) => `
                <div class="ev arow" data-d="${k}" style="--c:${COLOR[e.tag]}">
                  <span class="bar-c"></span>
                  <div class="t"><strong>${e.title}</strong><span class="muted small">${e.time} – ${endOf(e)}</span></div>
                  <ui-badge tone="${TAGS[e.tag]}" size="sm">${e.tag}</ui-badge>
                </div>`).join('')}</ui-card>`;
          }).join('')
        : '<div class="empty">No hay eventos este mes.</div>';
    };

    const paintSide = () => {
      const k = key(sel);
      const evs = by(k);
      side.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-bottom:.5rem">
          <strong>${cap(sel.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }))}</strong>
          <ui-badge tone="neutral" size="sm">${evs.length} evento${evs.length === 1 ? '' : 's'}</ui-badge>
        </div>
        ${evs.length
          ? evs.map((e) => `
            <div class="ev" style="--c:${COLOR[e.tag]}">
              <span class="bar-c"></span>
              <div class="t"><strong>${e.title}</strong><span class="muted small">${svg('clock', 12)} ${e.time} – ${endOf(e)}</span></div>
              <ui-badge tone="${TAGS[e.tag]}" size="sm">${e.tag}</ui-badge>
              <ui-button icon variant="ghost" size="sm" data-del="${e.id}" label="Eliminar evento">${svg('trash', 15)}</ui-button>
            </div>`).join('')
          : `<div class="empty">Sin eventos este día.<br><ui-button size="sm" variant="outline" data-a="add" style="margin-top:.75rem">Agregar uno</ui-button></div>`}`;
    };

    const paint = () => {
      $('.ttl').textContent = cap(cur.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }));
      view === 'month' ? paintMonth() : paintAgenda();
      paintSide();
    };
    const go = (d) => {
      sel = d;
      if (sel.getMonth() !== cur.getMonth() || sel.getFullYear() !== cur.getFullYear()) {
        cur = new Date(sel.getFullYear(), sel.getMonth(), 1);
      }
    };
    const shift = (n) => {
      cur = new Date(cur.getFullYear(), cur.getMonth() + n, 1);
      sel = new Date(cur);
      paint();
    };

    main.addEventListener('click', (e) => {
      const b = e.target.closest('[data-d]');
      if (!b) return;
      const [y, m, d] = b.dataset.d.split('-').map(Number);
      go(new Date(y, m - 1, d));
      paint();
      main.querySelector(`[data-d="${b.dataset.d}"]`)?.focus();
    });
    side.addEventListener('click', (e) => {
      const del = e.target.closest('[data-del]');
      if (del) {
        events.splice(events.findIndex((x) => x.id === Number(del.dataset.del)), 1);
        toast.info('Evento eliminado');
        return paint();
      }
      if (e.target.closest('[data-a=add]')) openDialog();
    });

    $('[data-a=prev]').onclick = () => shift(-1);
    $('[data-a=next]').onclick = () => shift(1);
    $('[data-a=today]').onclick = () => { sel = new Date(today); cur = new Date(today.getFullYear(), today.getMonth(), 1); paint(); };
    $('.bar ui-segmented').addEventListener('change', (e) => { view = e.detail.value; paint(); });

    const openDialog = () => {
      $('.f-title').value = '';
      $('.f-day').textContent = cap(sel.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
      dialog.show();
    };
    $('[data-a=new]').onclick = openDialog;
    $('[data-a=cancel]').onclick = () => dialog.close();
    $('[data-a=save]').onclick = () => {
      const title = $('.f-title');
      if (!title.checkValidity()) return title.reportValidity();
      events.push({
        id: seq++, date: key(sel), time: $('.f-time').value, dur: Number($('.f-dur').value),
        title: title.value.trim(), tag: $('.f-tag').value,
      });
      dialog.close();
      toast.success('Evento guardado');
      paint();
    };

    paint();
    return el;
  },
};
