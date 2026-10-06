export const styles = `
:host{display:inline-block;font-size:var(--ui-toggle-size,16px);line-height:0;-webkit-tap-highlight-color:transparent}
:host([size=sm]){font-size:12px}
:host([size=lg]){font-size:22px}
:host([disabled]){opacity:.5;pointer-events:none}
*{box-sizing:border-box}

.track{all:unset;position:relative;display:block;width:3.25em;height:1.9em;border-radius:2em;cursor:pointer;
  background:var(--ui-toggle-off,rgb(128 135 160/.35));
  box-shadow:inset 0 .08em .25em rgb(0 0 0/.25);
  transition:background-color .35s}
.track:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.2em}

.fill{position:absolute;inset:0;border-radius:inherit;opacity:0;transition:opacity .35s;
  background:linear-gradient(135deg,var(--ui-accent,#6366f1),var(--ui-accent-2,#a855f7))}
[aria-checked=true] .fill{opacity:1}

.thumb{position:absolute;top:.2em;left:.2em;width:var(--tw,1.5em);height:1.5em;border-radius:1em;background:#fff;
  display:grid;place-items:center;
  box-shadow:0 .1em .3em rgb(0 0 0/.35);
  transition:left .45s cubic-bezier(.34,1.5,.5,1),width .2s}
[aria-checked=true] .thumb{left:calc(100% - .2em - var(--tw,1.5em))}
.track:hover .thumb{filter:brightness(.97)}
.track:active .thumb{--tw:1.9em}

.check{width:.8em;height:.8em;fill:none;stroke:var(--ui-accent,#6366f1);stroke-width:3.5;
  stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:20;stroke-dashoffset:20;
  transition:stroke-dashoffset .35s .1s}
[aria-checked=true] .check{stroke-dashoffset:0}

@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}
`;
