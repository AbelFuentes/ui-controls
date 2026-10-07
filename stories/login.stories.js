import { toast } from '../src/components/toast.js';

export default { title: 'Examples/Login', parameters: { layout: 'fullscreen' } };

export const SignIn = {
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        .lg{min-height:100vh;display:grid;place-items:center;padding:1.5rem;position:relative;
          background:radial-gradient(60rem 30rem at 15% -10%,color-mix(in srgb,var(--ui-accent) 22%,transparent),transparent),
                     radial-gradient(50rem 28rem at 100% 110%,color-mix(in srgb,var(--ui-accent-2) 20%,transparent),transparent)}
        .lg .corner{position:absolute;top:1rem;right:1rem}
        .lg h1{margin:0;font-size:1.6rem}
        .lg p{margin:0;color:var(--ui-muted)}
        .lg .or{display:flex;align-items:center;gap:.75rem;color:var(--ui-muted);font-size:.85rem}
        .lg .or::before,.lg .or::after{content:"";flex:1;height:1px;background:var(--ui-border)}
        .lg .logo{width:3rem;height:3rem;border-radius:1rem;display:grid;place-items:center;color:#fff;font-weight:800;
          background:linear-gradient(135deg,var(--ui-accent),var(--ui-accent-2));
          box-shadow:0 .6rem 1.6rem -.4rem color-mix(in srgb,var(--ui-accent) 60%,transparent)}
        .lg .row{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap}
        .lg a{color:var(--ui-accent);text-decoration:none;font-weight:500;font-size:.9rem}
        .lg a:hover{text-decoration:underline}
        .lg .tip{font-size:.8rem;text-align:center;color:var(--ui-muted)}
      </style>
      <div class="lg">
        <ui-theme-switch class="corner" size="sm"></ui-theme-switch>
        <ui-card style="width:min(26rem,100%)" padding="lg">
          <form novalidate>
            <ui-stack gap="lg">
              <ui-stack gap="sm" align="center" style="text-align:center">
                <div class="logo">A</div>
                <h1>Bienvenido de vuelta</h1>
                <p>Ingresa a tu cuenta para continuar</p>
              </ui-stack>
              <ui-alert tone="danger" hidden dismissible>Correo o contraseña incorrectos.</ui-alert>
              <ui-input name="email" type="email" label="Correo" required></ui-input>
              <ui-input name="password" type="password" label="Contraseña" required minlength="4"></ui-input>
              <div class="row">
                <ui-checkbox name="remember" checked>Recuérdame</ui-checkbox>
                <a href="#olvide">¿Olvidaste tu contraseña?</a>
              </div>
              <ui-button type="submit" block size="lg">Iniciar sesión</ui-button>
              <div class="or">o continúa con</div>
              <ui-stack direction="row" gap="sm">
                <ui-button variant="outline" block style="flex:1">Google</ui-button>
                <ui-button variant="outline" block style="flex:1">GitHub</ui-button>
              </ui-stack>
              <div class="tip">Tip: usa «error» como contraseña para ver la alerta.</div>
            </ui-stack>
          </form>
        </ui-card>
      </div>`;

    const form = el.querySelector('form');
    const btn = el.querySelector('ui-button[type=submit]');
    const alert = el.querySelector('ui-alert');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = [...form.querySelectorAll('ui-input')].find((f) => !f.checkValidity());
      if (bad) { bad.reportValidity(); return; }
      alert.hidden = true;
      btn.loading = true;
      setTimeout(() => {
        btn.loading = false;
        const d = Object.fromEntries(new FormData(form));
        if (d.password === 'error') { alert.show(); return; }
        toast.success(`Hola, ${d.email}`, { title: 'Sesión iniciada' });
      }, 1200);
    });
    return el;
  },
};
