import { setTheme, getTheme } from '../src/core/theme.js';
import { toast } from '../src/components/toast.js';

export default { title: 'Examples/Settings', parameters: { layout: 'fullscreen' } };

const accents = { indigo: ['#6366f1', '#a855f7'], green: ['#10b981', '#06b6d4'], orange: ['#f97316', '#ef4444'] };
const danger = 'style="--ui-accent:#ef4444;--ui-accent-2:#f97316"';

export const Account = {
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        .st{max-width:46rem;margin:0 auto;padding:2rem 1.25rem}
        .st h1{margin:0 0 .25rem;font-size:1.6rem}
        .st p{margin:0;color:var(--ui-muted)}
        .st .row{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.9rem 0;border-bottom:1px solid var(--ui-border)}
        .st .row:last-child{border:0}
        .st .row small{display:block;color:var(--ui-muted);margin-top:.15rem}
        .st .actions{display:flex;justify-content:flex-end;gap:.75rem}
      </style>
      <div class="st">
        <ui-stack gap="lg">
          <div><h1>Ajustes</h1><p>Administra tu cuenta y preferencias</p></div>

          <ui-tabs value="profile" label="Ajustes">
            <section data-tab="profile" data-label="Perfil">
              <ui-stack gap="lg">
                <div style="display:flex;align-items:center;gap:1rem">
                  <ui-avatar name="Abel Fuentes" size="lg" status="online"></ui-avatar>
                  <ui-button variant="outline" size="sm">Cambiar foto</ui-button>
                </div>
                <ui-grid min="14rem">
                  <ui-input label="Nombre" value="Abel"></ui-input>
                  <ui-input label="Apellido" value="Fuentes"></ui-input>
                  <ui-input label="Correo" type="email" value="abel@ejemplo.com"></ui-input>
                  <ui-select label="Idioma" value="es">
                    <option value="es">Español</option><option value="en">English</option><option value="pt">Português</option>
                  </ui-select>
                </ui-grid>
                <ui-textarea label="Biografía" maxlength="160" autosize rows="2" maxrows="5" hint="Aparece en tu perfil público"></ui-textarea>
                <div class="actions">
                  <ui-button variant="ghost">Cancelar</ui-button>
                  <ui-button data-a="save">Guardar cambios</ui-button>
                </div>
              </ui-stack>
            </section>

            <section data-tab="notifications" data-label="Notificaciones">
              <div>
                <div class="row"><div>Correo<small>Novedades y avisos de seguridad</small></div><ui-toggle checked label="Correo"></ui-toggle></div>
                <div class="row"><div>Push<small>En tu navegador o móvil</small></div><ui-toggle label="Push"></ui-toggle></div>
                <div class="row"><div>Menciones<small>Cuando alguien te nombra</small></div><ui-toggle checked label="Menciones"></ui-toggle></div>
              </div>
              <ui-stack gap="sm" style="margin-top:1.25rem">
                <strong>Resumen de actividad</strong>
                <ui-radio-group value="weekly" orientation="horizontal" label="Frecuencia">
                  <ui-radio value="daily">Diario</ui-radio><ui-radio value="weekly">Semanal</ui-radio><ui-radio value="never">Nunca</ui-radio>
                </ui-radio-group>
              </ui-stack>
            </section>

            <section data-tab="appearance" data-label="Apariencia">
              <ui-stack gap="lg">
                <div class="row">
                  <div>Tema<small>Claro u oscuro</small></div>
                  <ui-segmented data-a="theme" label="Tema">
                    <option value="light">Claro</option><option value="dark">Oscuro</option>
                  </ui-segmented>
                </div>
                <ui-stack gap="sm">
                  <strong>Color de acento</strong>
                  <ui-radio-group data-a="accent" value="indigo" orientation="horizontal" label="Acento">
                    <ui-radio value="indigo">Índigo</ui-radio><ui-radio value="green">Verde</ui-radio><ui-radio value="orange">Naranja</ui-radio>
                  </ui-radio-group>
                </ui-stack>
              </ui-stack>
            </section>

            <section data-tab="danger" data-label="Cuenta">
              <ui-stack gap="lg">
                <ui-alert tone="danger">
                  <span slot="title">Zona de peligro</span>
                  Eliminar tu cuenta borra todos tus datos de forma permanente.
                </ui-alert>
                <div><ui-button data-a="delete" ${danger}>Eliminar cuenta</ui-button></div>
                <ui-dialog size="sm">
                  <span slot="header">¿Eliminar tu cuenta?</span>
                  <ui-stack>
                    <span>Escribe <strong>ELIMINAR</strong> para confirmar.</span>
                    <ui-input label="Confirmación"></ui-input>
                  </ui-stack>
                  <ui-button slot="footer" variant="ghost" data-a="cancel">Cancelar</ui-button>
                  <ui-button slot="footer" data-a="confirm" disabled ${danger}>Eliminar</ui-button>
                </ui-dialog>
              </ui-stack>
            </section>
          </ui-tabs>
        </ui-stack>
      </div>`;

    const $ = (s) => el.querySelector(s);

    const save = $('[data-a=save]');
    save.onclick = () => {
      save.loading = true;
      setTimeout(() => { save.loading = false; toast.success('Cambios guardados'); }, 900);
    };

    const theme = $('[data-a=theme]');
    theme.setAttribute('value', getTheme());
    theme.addEventListener('change', (e) => setTheme(e.detail.value));

    $('[data-a=accent]').addEventListener('change', (e) => {
      const [a, b] = accents[e.detail.value];
      document.documentElement.style.setProperty('--ui-accent', a);
      document.documentElement.style.setProperty('--ui-accent-2', b);
    });

    const dialog = $('ui-dialog');
    const confirm = $('[data-a=confirm]');
    const field = dialog.querySelector('ui-input');
    field.addEventListener('input', () => (confirm.disabled = field.value !== 'ELIMINAR'));
    $('[data-a=delete]').onclick = () => dialog.show();
    $('[data-a=cancel]').onclick = () => dialog.close();
    confirm.onclick = () => {
      dialog.close();
      toast.danger('Tu cuenta fue eliminada (demo)', { title: 'Cuenta eliminada' });
    };
    return el;
  },
};
