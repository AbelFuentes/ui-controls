import '@abelfuentes/ui-controls';
import '@abelfuentes/ui-controls/button';
import { useRef, useState } from 'react';
import { toast, setTheme } from '@abelfuentes/ui-controls';
import type { UIInput } from '@abelfuentes/ui-controls';

export function App() {
  const ref = useRef<UIInput>(null);
  const [email, setEmail] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        toast.success('Hola', { title: 'Listo' });
        setTheme('dark');
      }}
    >
      <ui-stack gap="md" align="stretch">
        <ui-input
          ref={ref}
          type="email"
          label="Correo"
          placeholder="correo@ejemplo.com"
          required
          value={email}
          onInput={(e) => setEmail(e.currentTarget.value)}
        />
        <ui-slider min={0} max={100} step={5} value={40} oninput={(e) => console.log(e.detail.value)} />
        <ui-select label="País" value="mx" onchange={(e) => console.log(e.detail.value)}>
          <option value="mx">México</option>
        </ui-select>
        <ui-card variant="outlined" interactive>
          <span slot="header">Título</span>
          Contenido
        </ui-card>
        <ui-button type="submit" block>
          Entrar
        </ui-button>
        {/* @ts-expect-error variante inválida */}
        <ui-button variant="nope">x</ui-button>
        {/* @ts-expect-error onChange camelCase no existe en custom elements de React */}
        <ui-input onChange={() => {}} />
      </ui-stack>
    </form>
  );
}
