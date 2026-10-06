import { toast } from '../src/components/toast.js';

export default {
  title: 'Overlays/Toast',
  tags: ['autodocs'],
};

export const Tones = {
  render: () => {
    const el = document.createElement('div');
    el.style.cssText = 'display:flex;gap:.75rem;flex-wrap:wrap;justify-content:center';
    el.innerHTML = `
      <ui-button variant="soft" data-t="info">Info</ui-button>
      <ui-button variant="soft" data-t="success" style="--ui-accent:#10b981">Éxito</ui-button>
      <ui-button variant="soft" data-t="warning" style="--ui-accent:#f59e0b">Aviso</ui-button>
      <ui-button variant="soft" data-t="danger" style="--ui-accent:#ef4444">Error</ui-button>`;
    const msgs = {
      info: ['Nueva versión disponible', 'Actualización'],
      success: ['Cambios guardados', 'Listo'],
      warning: ['Tu sesión expira en 5 minutos', 'Atención'],
      danger: ['No se pudo conectar con el servidor', 'Error'],
    };
    el.querySelectorAll('[data-t]').forEach((b) => {
      b.onclick = () => toast[b.dataset.t](msgs[b.dataset.t][0], { title: msgs[b.dataset.t][1] });
    });
    return el;
  },
};

export const Persistent = {
  render: () => {
    const el = document.createElement('ui-button');
    el.textContent = 'Toast sin cierre automático';
    el.onclick = () => toast('Ciérrame con la X', { duration: 0, title: 'Persistente' });
    return el;
  },
};

export const Placement = {
  render: () => {
    const el = document.createElement('div');
    el.style.cssText = 'display:flex;gap:.75rem;flex-wrap:wrap;justify-content:center';
    ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'].forEach((p) => {
      const b = document.createElement('ui-button');
      b.variant = '';
      b.setAttribute('variant', 'outline');
      b.textContent = p;
      b.onclick = () => {
        let t = document.querySelector('ui-toaster');
        if (!t) { t = document.createElement('ui-toaster'); document.body.append(t); }
        t.setAttribute('placement', p);
        toast(`Posición ${p}`, { tone: 'success' });
      };
      el.append(b);
    });
    return el;
  },
};
