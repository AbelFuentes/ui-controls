export const styles = `
:host{display:inline-block;font-size:var(--ui-checkbox-size,16px);-webkit-tap-highlight-color:transparent}
:host([size=sm]){font-size:12px}
:host([size=lg]){font-size:22px}
:host([disabled]){opacity:.5;pointer-events:none}
*{box-sizing:border-box}

.root{all:unset;display:inline-flex;align-items:center;gap:.6em;cursor:pointer;font:inherit;color:inherit;line-height:1.4}

.box{position:relative;flex:none;width:1.5em;height:1.5em;border-radius:.45em;
  box-shadow:inset 0 0 0 .11em var(--ui-checkbox-border,rgb(128 135 160/.6));
  transition:box-shadow .3s,transform .2s cubic-bezier(.34,1.5,.5,1)}
.root:hover .box{box-shadow:inset 0 0 0 .11em var(--ui-accent,#6366f1)}
.root:active .box{transform:scale(.88)}
.root:focus-visible .box{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.2em}

.fill{position:absolute;inset:0;border-radius:inherit;opacity:0;transform:scale(.6);
  background:linear-gradient(135deg,var(--ui-accent,#6366f1),var(--ui-accent-2,#a855f7));
  transition:opacity .25s,transform .4s cubic-bezier(.34,1.5,.5,1)}
[aria-checked=true] .fill,[aria-checked=mixed] .fill{opacity:1;transform:none}
[aria-checked=true] .box,[aria-checked=mixed] .box{box-shadow:inset 0 0 0 .11em transparent}

svg{position:absolute;inset:0;width:100%;height:100%;fill:none;stroke:#fff;stroke-width:2.6;
  stroke-linecap:round;stroke-linejoin:round}
.tick,.dash{stroke-dasharray:20;stroke-dashoffset:20;transition:stroke-dashoffset .3s .08s}
[aria-checked=true] .tick{stroke-dashoffset:0}
[aria-checked=mixed] .dash{stroke-dashoffset:0}

@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}
`;
