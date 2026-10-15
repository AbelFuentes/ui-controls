import { describe, it, expect, vi, afterEach } from 'vitest';
import '../src/index.js';

const TAGS = ['ui-app-shell', 'ui-aspect-ratio', 'ui-container', 'ui-divider', 'ui-grid', 'ui-nav', 'ui-nav-group', 'ui-nav-item',
  'ui-navbar', 'ui-page-header', 'ui-scroll-area', 'ui-section', 'ui-spacer', 'ui-split', 'ui-stack', 'ui-toolbar'];
const mk = (html) => { const d = document.createElement('div'); d.innerHTML = html; document.body.append(d); return d; };
const tick = () => new Promise((r) => setTimeout(r, 0));
afterEach(() => { document.body.innerHTML = ''; });

describe('layout', () => {
  it('registra y conecta todos sin lanzar', () => {
    for (const t of TAGS) {
      expect(customElements.get(t), t).toBeTruthy();
      document.body.append(document.createElement(t));
    }
  });

  it('grid: columnas responsive, min y rows como variables', () => {
    const g = mk('<ui-grid cols="1" cols-md="3" cols-xl="6" min="12" rows="2"></ui-grid>').firstElementChild;
    expect(g.style.getPropertyValue('--cols-md')).toBe('3');
    expect(g.style.getPropertyValue('--cols-xl')).toBe('6');
    expect(g.style.getPropertyValue('--min')).toBe('12rem');
    expect(g.style.getPropertyValue('--rows')).toBe('repeat(2,minmax(0,1fr))');
    g.removeAttribute('cols-md');
    expect(g.style.getPropertyValue('--cols-md')).toBe('');
  });

  it('grid y stack incluyen reglas por breakpoint (stack es opt-in)', () => {
    const d = mk('<ui-grid></ui-grid><ui-stack></ui-stack>');
    const gcss = d.children[0].shadowRoot.querySelector('style').textContent;
    const scss = d.children[1].shadowRoot.querySelector('style').textContent;
    expect(gcss).toContain('@media (min-width:768px){:host([cols-md])');
    expect(scss).toContain(':host([collapse=md][direction=row])');
    expect(scss).not.toContain(':host(:not([collapse])[direction=row])');
  });

  it('split: aside-width, y colapsa por defecto en md', () => {
    const el = mk('<ui-split aside-width="22"><div>a</div><div slot="aside">b</div></ui-split>').firstElementChild;
    expect(el.style.getPropertyValue('--aside')).toBe('22rem');
    expect(el.shadowRoot.querySelector('style').textContent).toContain(':host(:not([collapse])),:host([collapse=md])');
  });

  it('spacer: size y aria-hidden', () => {
    const el = mk('<ui-spacer size="2"></ui-spacer>').firstElementChild;
    expect(el.style.getPropertyValue('--s')).toBe('2rem');
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('aspect-ratio acepta 16/9, 16:9 y números', () => {
    const el = mk('<ui-aspect-ratio ratio="4:3"></ui-aspect-ratio>').firstElementChild;
    expect(el.style.getPropertyValue('--r')).toBe('4/3');
    el.setAttribute('ratio', '1.5');
    expect(el.style.getPropertyValue('--r')).toBe('1.5');
  });

  it('divider: role separator, aria-orientation y etiqueta', async () => {
    const el = mk('<ui-divider>o continúa con</ui-divider>').firstElementChild;
    expect(el.getAttribute('role')).toBe('separator');
    await tick();
    expect(el.shadowRoot.querySelector('.label').hidden).toBe(false);
    el.setAttribute('orientation', 'vertical');
    expect(el.getAttribute('aria-orientation')).toBe('vertical');
    const bare = mk('<ui-divider></ui-divider>').firstElementChild;
    await tick();
    expect(bare.shadowRoot.querySelector('.label').hidden).toBe(true);
  });

  it('page-header: heading, description y secciones vacías', async () => {
    const el = mk('<ui-page-header heading="Facturas" description="Emite y cobra" level="2"><ui-button slot="actions">Nueva</ui-button></ui-page-header>').firstElementChild;
    await tick();
    const r = el.shadowRoot;
    expect(r.querySelector('.ta').textContent).toBe('Facturas');
    expect(r.querySelector('.t').getAttribute('aria-level')).toBe('2');
    expect(r.querySelector('.d').hidden).toBe(false);
    expect(r.querySelector('.acts').hidden).toBe(false);
    expect(r.querySelector('.bc').hidden).toBe(true);
    expect(r.querySelector('.tabs').hidden).toBe(true);
  });

  it('nav: value marca el item activo y emite change; rail se propaga', async () => {
    const nav = mk(`<ui-nav value="a" label="Principal"><ui-nav-item value="a">A</ui-nav-item>
      <ui-nav-group label="G" collapsible><ui-nav-item value="b">B</ui-nav-item><ui-nav-item value="c" disabled>C</ui-nav-item></ui-nav-group></ui-nav>`).firstElementChild;
    await tick();
    const items = [...nav.querySelectorAll('ui-nav-item')];
    expect(items[0].hasAttribute('active')).toBe(true);
    expect(items[1].hasAttribute('active')).toBe(false);

    const fn = vi.fn();
    nav.addEventListener('change', fn);
    items[1].dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    expect(fn.mock.calls[0][0].detail).toEqual({ value: 'b' });
    expect(items[1].hasAttribute('active')).toBe(true);
    expect(items[0].hasAttribute('active')).toBe(false);

    items[2].dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    expect(fn).toHaveBeenCalledTimes(1); // disabled no cambia

    nav.setAttribute('rail', '');
    expect(items.every((i) => i.hasAttribute('rail'))).toBe(true);
    nav.removeAttribute('rail');
    expect(items.some((i) => i.hasAttribute('rail'))).toBe(false);
  });

  it('nav-item: enlace con href, botón sin href, aria-current y nombre accesible en rail', async () => {
    const [a, b] = [...mk('<ui-nav-item href="/x" active>Inicio</ui-nav-item><ui-nav-item>Botón</ui-nav-item>').children];
    await tick();
    expect(a.shadowRoot.querySelector('a.item').getAttribute('href')).toBe('/x');
    expect(a.shadowRoot.querySelector('.item').getAttribute('aria-current')).toBe('page');
    expect(b.shadowRoot.querySelector('button.item')).toBeTruthy();
    a.setAttribute('rail', '');
    expect(a.shadowRoot.querySelector('.item').getAttribute('aria-label')).toBe('Inicio');
    expect(a.shadowRoot.querySelector('.item').getAttribute('title')).toBe('Inicio');
    a.setAttribute('disabled', '');
    expect(a.shadowRoot.querySelector('button.item').disabled).toBe(true);
  });

  it('nav-group colapsable alterna collapsed y aria-expanded', () => {
    const g = mk('<ui-nav-group label="Equipo" collapsible><ui-nav-item>Uno</ui-nav-item></ui-nav-group>').firstElementChild;
    const hd = g.shadowRoot.querySelector('.hd');
    expect(hd.getAttribute('aria-expanded')).toBe('true');
    hd.click();
    expect(g.hasAttribute('collapsed')).toBe(true);
    expect(hd.getAttribute('aria-expanded')).toBe('false');
  });

  it('navbar: burger abre/cierra, Escape cierra y emite toggle', () => {
    const nb = mk('<ui-navbar><a slot="brand" href="/">X</a><a href="/a">A</a></ui-navbar>').firstElementChild;
    const burger = nb.shadowRoot.querySelector('.burger');
    const fn = vi.fn();
    nb.addEventListener('toggle', fn);
    burger.click();
    expect(nb.hasAttribute('open')).toBe(true);
    expect(burger.getAttribute('aria-expanded')).toBe('true');
    expect(fn.mock.calls[0][0].detail).toEqual({ open: true });
    nb.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(nb.hasAttribute('open')).toBe(false);
    expect(burger.getAttribute('aria-expanded')).toBe('false');
  });

  it('app-shell: rail + collapsed pone rail en los ui-nav del sidebar; atributos de medida', async () => {
    const shell = mk(`<ui-app-shell rail sidebar-width="15" aside-width="20rem" header-height="3.5">
      <ui-nav slot="sidebar"><ui-nav-item>A</ui-nav-item></ui-nav><div slot="aside">x</div><p>main</p></ui-app-shell>`).firstElementChild;
    await tick();
    const nav = shell.querySelector('ui-nav');
    expect(nav.hasAttribute('rail')).toBe(false);
    shell.toggle(); // escritorio: colapsa
    expect(shell.hasAttribute('collapsed')).toBe(true);
    expect(nav.hasAttribute('rail')).toBe(true);
    shell.toggle();
    expect(nav.hasAttribute('rail')).toBe(false);
    expect(shell.style.getPropertyValue('--ui-shell-sidebar-width')).toBe('15rem');
    expect(shell.style.getPropertyValue('--ui-shell-aside-width')).toBe('20rem');
    expect(shell.style.getPropertyValue('--ui-shell-header-height')).toBe('3.5rem');
    expect(shell.shadowRoot.querySelector('.shell').classList.contains('noas')).toBe(false);
  });

  it('app-shell: sin aside ni sidebar marca nosb y noas', async () => {
    const shell = mk('<ui-app-shell><p>solo main</p></ui-app-shell>').firstElementChild;
    await tick();
    const sh = shell.shadowRoot.querySelector('.shell');
    expect(sh.classList.contains('nosb')).toBe(true);
    expect(sh.classList.contains('noas')).toBe(true);
  });

  it('scroll-area: max-height como variable', () => {
    const el = mk('<ui-scroll-area max-height="12" fade label="Lista"><p>x</p></ui-scroll-area>').firstElementChild;
    expect(el.shadowRoot.querySelector('.vp').style.getPropertyValue('--mh')).toBe('12rem');
  });
});
