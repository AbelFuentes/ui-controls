export const styles = `
:host{display:inline-block;font-size:var(--ui-radio-size,16px);-webkit-tap-highlight-color:transparent}
:host([size=sm]){font-size:12px}
:host([size=lg]){font-size:22px}
:host([disabled]){opacity:.5;pointer-events:none}
*{box-sizing:border-box}

.root{all:unset;display:inline-flex;align-items:center;gap:.6em;cursor:pointer;font:inherit;color:inherit;line-height:1.4}

.circle{position:relative;flex:none;width:1.5em;height:1.5em;border-radius:50%;
  box-shadow:inset 0 0 0 .11em var(--ui-radio-border,rgb(128 135 160/.6));
  transition:box-shadow .3s,transform .2s cubic-bezier(.34,1.5,.5,1)}
.root:hover .circle{box-shadow:inset 0 0 0 .11em var(--ui-accent,#6366f1)}
.root:active .circle{transform:scale(.88)}
.root:focus-visible .circle{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.2em}

.fill{position:absolute;inset:0;border-radius:inherit;opacity:0;transform:scale(.6);
  background:linear-gradient(135deg,var(--ui-accent,#6366f1),var(--ui-accent-2,#a855f7));
  transition:opacity .25s,transform .4s cubic-bezier(.34,1.5,.5,1)}
[aria-checked=true] .fill{opacity:1;transform:none}
[aria-checked=true] .circle{box-shadow:inset 0 0 0 .11em transparent}

.dot{position:absolute;inset:0;margin:auto;width:.55em;height:.55em;border-radius:50%;background:#fff;
  box-shadow:0 .05em .15em rgb(0 0 0/.3);transform:scale(0);
  transition:transform .4s cubic-bezier(.34,1.8,.5,1)}
[aria-checked=true] .dot{transform:scale(1)}

@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}
`;
