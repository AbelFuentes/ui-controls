export const styles = `
:host{display:inline-block;width:var(--ui-slider-width,14em);font-size:var(--ui-slider-size,16px);-webkit-tap-highlight-color:transparent}
:host([size=sm]){font-size:12px}
:host([size=lg]){font-size:22px}
:host([disabled]){opacity:.5;pointer-events:none}
*{box-sizing:border-box}

.root{position:relative;height:2.2em;display:flex;align-items:center;padding:0 .8em;
  cursor:pointer;touch-action:none;user-select:none}

.track{position:relative;flex:1;height:.5em;border-radius:1em;
  background:var(--ui-slider-bg,rgb(128 135 160/.3));box-shadow:inset 0 .05em .15em rgb(0 0 0/.2)}
.fill{position:absolute;inset:0 auto 0 0;width:calc(var(--p,0)*100%);border-radius:inherit;
  background:linear-gradient(90deg,var(--ui-accent,#6366f1),var(--ui-accent-2,#a855f7))}

.thumb{position:absolute;top:50%;left:calc(var(--p,0)*100%);width:1.6em;height:1.6em;margin:-.8em 0 0 -.8em;
  border-radius:50%;background:#fff;outline:none;
  box-shadow:0 .1em .4em rgb(0 0 0/.35),0 0 0 .1em rgb(255 255 255/.6);
  transition:transform .2s cubic-bezier(.34,1.6,.5,1),box-shadow .2s}
.thumb::after{content:"";position:absolute;inset:.45em;border-radius:50%;
  background:linear-gradient(135deg,var(--ui-accent,#6366f1),var(--ui-accent-2,#a855f7))}
.root:hover .thumb{transform:scale(1.12)}
.thumb:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.15em}
.drag .thumb{transform:scale(1.2);
  box-shadow:0 .1em .4em rgb(0 0 0/.35),0 0 0 .55em color-mix(in srgb,var(--ui-accent,#6366f1) 25%,transparent)}

.tip{position:absolute;bottom:calc(100% + .6em);left:50%;padding:.35em .65em;border-radius:.6em;
  font:600 .75em/1 system-ui,sans-serif;font-variant-numeric:tabular-nums;color:#fff;white-space:nowrap;
  background:linear-gradient(135deg,var(--ui-accent,#6366f1),var(--ui-accent-2,#a855f7));
  box-shadow:0 .2em .6em rgb(0 0 0/.25);pointer-events:none;
  opacity:0;transform:translate(-50%,.3em) scale(.8);
  transition:opacity .2s,transform .3s cubic-bezier(.34,1.6,.5,1)}
.drag .tip,.root:hover .tip,.thumb:focus-visible .tip{opacity:1;transform:translate(-50%,0) scale(1)}

@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}
`;
