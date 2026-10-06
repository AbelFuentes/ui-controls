export const styles = `
:host{display:inline-block;font-size:var(--ui-segmented-size,15px);-webkit-tap-highlight-color:transparent}
:host([size=sm]){font-size:12px}
:host([size=lg]){font-size:19px}
:host([disabled]){opacity:.5;pointer-events:none}
*{box-sizing:border-box}

.track{position:relative;display:inline-flex;padding:.25em;border-radius:.9em;
  background:var(--ui-segmented-bg,rgb(128 135 160/.18));
  box-shadow:inset 0 .06em .2em rgb(0 0 0/.18)}

.pill{position:absolute;top:.25em;bottom:.25em;left:0;width:var(--w,0);border-radius:.7em;
  transform:translateX(var(--x,0));
  background:linear-gradient(135deg,var(--ui-accent,#6366f1),var(--ui-accent-2,#a855f7));
  box-shadow:0 .15em .6em color-mix(in srgb,var(--ui-accent,#6366f1) 45%,transparent),
    inset 0 .06em .1em rgb(255 255 255/.3)}
.ready .pill{transition:transform .45s cubic-bezier(.34,1.35,.5,1),width .45s cubic-bezier(.34,1.35,.5,1)}

.opt{all:unset;position:relative;z-index:1;padding:.55em 1.1em;border-radius:.7em;cursor:pointer;
  font:inherit;font-weight:500;color:inherit;opacity:.7;white-space:nowrap;line-height:1.2;
  transition:color .3s,opacity .3s,transform .15s}
.opt:hover{opacity:1}
.opt[aria-checked=true]{color:#fff;opacity:1}
.opt:active{transform:scale(.96)}
.opt:disabled{opacity:.35;cursor:not-allowed}
.opt:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.1em}

@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}
`;
