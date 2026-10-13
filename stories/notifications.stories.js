import { toast } from '../src/components/toast.js';
import { svg, wait } from './_shared.js';

export default { title: 'Examples/Notifications', parameters: { layout: 'fullscreen' } };

const META = {
  mention: ['user', 'var(--ui-accent)'], comment: ['comment', 'var(--ui-accent)'], like: ['heart', 'var(--ui-danger)'],
  invite: ['users', 'var(--ui-success)'], billing: ['dollar', 'var(--ui-warning)'], security: ['shield', 'var(--ui-danger)'],
};
const GROUP = { mention: 'mentions', comment: 'mentions', like: 'other', invite: 'other', billing: 'system', security: 'system' };
const rel = (m) => (m < 1 ? 'ahora' : m < 60 ? `hace ${m} min` : m < 1440 ? `hace ${Math.floor(m / 60)} h` : `hace ${Math.floor(m / 1440)} d`);
const label = (m) => (m < 1440 ? 'Hoy' : m < 2880 ? 'Ayer' : m < 10080 ? 'Esta semana' : 'Anteriores');

let uid = 1;
const n = (t, who, text, body, ago, unread = false) => ({ id: uid++, t, who, text, body, ago, unread, resolved: '' });
const seed = () => [
  n('mention', 'Ana López', 'te mencionó en <b>Rediseño del onboarding</b>', '«@abel ¿puedes revisar el flujo antes del jueves?»', 4, true),
  n('comment', 'Beto Ruiz', 'comentó en <b>Landing v2</b>', 'Me encanta cómo quedó el hero.', 32, true),
  n('invite', 'Carla Gil', 'te invitó al espacio <b>Marketing</b>', '', 95, true),
  n('billing', '', 'Tu factura <b>F-1038</b> está lista para descargar', '', 240, true),
  n('like', 'Dan Paz', 'le gustó tu publicación <b>Notas sobre accesibilidad</b>', '', 600),
  n('security', '', 'Nuevo inicio de sesión desde <b>Tijuana, MX</b>', 'Chrome en macOS', 1100),
  n('mention', 'Eva Mar', 'te mencionó en <b>Plan Q4</b>', '«@abel ¿puedes confirmar el presupuesto?»', 1700),
  n('comment', 'Fer Soto', 'respondió a tu comentario en <b>Sistema de diseño</b>', 'Totalmente de acuerdo con los tokens.', 2400),
  n('like', 'Gus Rey', 'y 12 personas más reaccionaron a tu comentario', '', 4300),
  n('billing', '', 'Pago recibido de <b>Acme SA de CV</b>', '', 5800),
  n('invite', 'Hugo Lara', 'te invitó al proyecto <b>App móvil</b>', '', 9000),
  n('security', '', 'Cambiaste tu contraseña', '', 14000),
];
const older = () => [
  n('comment', 'Ana López', 'comentó en <b>Guía de estilo</b>', 'Agreguemos ejemplos de uso.', 20000),
  n('like', 'Beto Ruiz', 'le gustó tu publicación <b>Del prototipo al producto</b>', '', 24000),
  n('mention', 'Carla Gil', 'te mencionó en <b>Retro del sprint</b>', '«@abel gracias por el apoyo»', 30000),
  n('billing', '', 'Tu plan <b>Pro</b> se renovó correctamente', '', 36000),
  n('security', '', 'Activaste la verificación en dos pasos', '', 43000),
];

export const Feed = {
  render: () => {
    let items = seed();
    let filter = 'all';
    let loaded = false;

    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        .nt{max-width:46rem;margin:0 auto;padding:2rem 1.25rem}
        .nt h1{margin:0;font-size:1.6rem}
        .nt .muted{color:var(--ui-muted)}
        .nt .small{font-size:.85rem}
        .nt .bar{display:flex;gap:.75rem;align-items:center;flex-wrap:wrap}
        .nt .grow{flex:1}
        .nt .row{display:flex;gap:.9rem;padding:1rem 1.15rem;border-bottom:1px solid var(--ui-border);cursor:pointer;
          transition:background-color .15s;outline:none}
        .nt .row:hover{background:color-mix(in srgb,currentColor 4%,transparent)}
        .nt .row:focus-visible{box-shadow:inset 0 0 0 .13rem var(--ui-accent)}
        .nt .row.unread{background:color-mix(in srgb,var(--ui-accent) 7%,transparent)}
        .nt .row.sk{cursor:default;align-items:center}
        .nt .ico{width:2.5rem;height:2.5rem;border-radius:.9rem;display:grid;place-items:center;flex:none;color:var(--c);
          background:color-mix(in srgb,var(--c) 14%,transparent)}
        .nt .c{flex:1;min-width:0}
        .nt .t{line-height:1.5}
        .nt .b{margin-top:.2rem;color:var(--ui-muted);font-size:.9rem}
        .nt .time{margin-top:.35rem;font-size:.78rem;color:var(--ui-muted)}
        .nt .acts{display:flex;gap:.5rem;margin-top:.6rem}
        .nt .r{display:flex;align-items:flex-start;gap:.4rem}
        .nt .dot{width:.55rem;height:.55rem;margin-top:.55rem;border-radius:50%;background:var(--ui-accent);flex:none}
        .nt .grp{padding:.9rem 1.15rem .35rem;font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;
          color:var(--ui-muted);border-bottom:1px solid var(--ui-border)}
        .nt .empty{display:grid;gap:.6rem;justify-items:center;text-align:center;padding:3rem 1rem;color:var(--ui-muted)}
        .nt .ring{width:4rem;height:4rem;border-radius:50%;display:grid;place-items:center;color:var(--ui-success);
          background:color-mix(in srgb,var(--ui-success) 14%,transparent)}
        .nt .pref{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.9rem 0;border-bottom:1px solid var(--ui-border)}
        .nt .pref:last-child{border:0}
      </style>
      <div class="nt">
        <ui-stack gap="lg">
          <div class="bar">
            <h1>Notificaciones</h1><ui-badge tone="accent" class="cnt"></ui-badge>
            <span class="grow"></span>
            <ui-button variant="ghost" size="sm" data-a="all">${svg('check', 15, 'start')}Marcar todas como leídas</ui-button>
            <ui-button icon variant="outline" size="sm" data-a="prefs" label="Preferencias">${svg('sliders', 16)}</ui-button>
          </div>
          <ui-segmented class="flt" value="all" label="Filtro" size="sm">
            <option value="all">Todas</option><option value="unread">Sin leer</option>
            <option value="mentions">Menciones</option><option value="system">Sistema</option>
          </ui-segmented>
          <ui-card padding="none">
            <div class="feed"></div>
            <ui-button slot="footer" variant="ghost" size="sm" block data-a="more">Cargar más</ui-button>
          </ui-card>
        </ui-stack>

        <ui-drawer size="sm">
          <span slot="header">Preferencias</span>
          <div>
            ${[['Menciones y comentarios', true], ['Reacciones', false], ['Invitaciones', true], ['Facturación', true], ['Seguridad', true]]
              .map(([t, on]) => `<div class="pref"><span>${t}</span><ui-toggle ${on ? 'checked' : ''} label="${t}"></ui-toggle></div>`).join('')}
          </div>
          <ui-stack gap="sm" style="margin-top:1.25rem">
            <strong>Resumen por correo</strong>
            <ui-radio-group value="daily" label="Frecuencia">
              <ui-radio value="off">Nunca</ui-radio><ui-radio value="daily">Diario</ui-radio><ui-radio value="weekly">Semanal</ui-radio>
            </ui-radio-group>
          </ui-stack>
          <ui-button slot="footer" data-a="save">Guardar</ui-button>
        </ui-drawer>
      </div>`;

    const $ = (s) => el.querySelector(s);
    const feed = $('.feed');
    const row = (it) => {
      const [icon, c] = META[it.t];
      const avatar = it.who ? `<ui-avatar name="${it.who}"></ui-avatar>` : `<div class="ico" style="--c:${c}">${svg(icon, 20)}</div>`;
      const acts = it.t === 'invite' && !it.resolved
        ? '<div class="acts"><ui-button size="sm" data-inv="yes">Aceptar</ui-button><ui-button size="sm" variant="outline" data-inv="no">Rechazar</ui-button></div>' : '';
      return `
        <div class="row${it.unread ? ' unread' : ''}" data-id="${it.id}" tabindex="0">
          ${avatar}
          <div class="c">
            <div class="t">${it.who ? `<strong>${it.who}</strong> ` : ''}${it.text}</div>
            ${it.body ? `<div class="b">${it.body}</div>` : ''}
            ${it.resolved ? `<div class="b"><ui-badge tone="neutral" size="sm">${it.resolved}</ui-badge></div>` : ''}
            ${acts}
            <div class="time">${rel(it.ago)}</div>
          </div>
          <div class="r">
            ${it.unread ? '<span class="dot" aria-label="Sin leer"></span>' : ''}
            <ui-dropdown placement="bottom-end">
              <ui-button slot="trigger" icon variant="ghost" size="sm" label="Más acciones">${svg('more', 16)}</ui-button>
              <option value="toggle">${it.unread ? 'Marcar como leída' : 'Marcar como no leída'}</option>
              <option value="mute">Silenciar este tipo</option>
              <option data-separator></option>
              <option value="delete" data-danger>Eliminar</option>
            </ui-dropdown>
          </div>
        </div>`;
    };

    const paint = () => {
      const unread = items.filter((i) => i.unread).length;
      $('.cnt').textContent = `${unread} sin leer`;
      $('.cnt').hidden = unread === 0;
      $('[data-a=all]').disabled = unread === 0;
      $('[data-a=more]').hidden = loaded;

      const list = items
        .filter((i) => filter === 'all' || (filter === 'unread' ? i.unread : GROUP[i.t] === filter))
        .sort((a, b) => a.ago - b.ago);
      if (!list.length) {
        feed.innerHTML = `<div class="empty"><div class="ring">${svg('check', 28)}</div><strong>Estás al día</strong><span>No hay notificaciones en esta vista.</span></div>`;
        return;
      }
      let last = '';
      feed.innerHTML = list.map((i) => {
        const g = label(i.ago);
        const head = g !== last ? `<div class="grp">${g}</div>` : '';
        last = g;
        return head + row(i);
      }).join('');
    };

    const find = (e) => {
      const r = e.target.closest('.row');
      return r?.dataset.id ? items.find((i) => i.id === Number(r.dataset.id)) : null;
    };

    feed.addEventListener('click', (e) => {
      const it = find(e);
      if (!it) return;
      const inv = e.target.closest('[data-inv]');
      if (inv) {
        it.resolved = inv.dataset.inv === 'yes' ? 'Aceptaste la invitación' : 'Rechazaste la invitación';
        it.unread = false;
        toast[inv.dataset.inv === 'yes' ? 'success' : 'info'](it.resolved);
        return paint();
      }
      if (e.target.closest('ui-dropdown')) return;
      if (it.unread) { it.unread = false; paint(); }
    });
    feed.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.classList?.contains('row')) e.target.click();
    });
    feed.addEventListener('select', (e) => {
      const it = find(e);
      if (!it) return;
      const v = e.detail.value;
      if (v === 'toggle') it.unread = !it.unread;
      else if (v === 'mute') toast.info('Silenciaste este tipo de aviso');
      else { items = items.filter((x) => x !== it); toast.success('Notificación eliminada'); }
      paint();
    });

    $('.flt').addEventListener('change', (e) => { filter = e.detail.value; paint(); });
    $('[data-a=all]').onclick = () => {
      items.forEach((i) => (i.unread = false));
      toast.success('Todo al día');
      paint();
    };
    $('[data-a=prefs]').onclick = () => $('ui-drawer').show();
    $('[data-a=save]').onclick = () => { $('ui-drawer').close(); toast.success('Preferencias guardadas'); };

    const more = $('[data-a=more]');
    more.onclick = async () => {
      more.loading = true;
      feed.insertAdjacentHTML('beforeend', Array.from({ length: 3 }, () => `
        <div class="row sk"><ui-skeleton variant="circle" width="40"></ui-skeleton>
        <ui-skeleton variant="text" lines="2" style="flex:1"></ui-skeleton></div>`).join(''));
      await wait(900);
      more.loading = false;
      items = items.concat(older());
      loaded = true;
      paint();
    };

    paint();
    return el;
  },
};
