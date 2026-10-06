export const styles = `
:host{display:inline-block;font-size:var(--ui-button-size,15px);-webkit-tap-highlight-color:transparent;
  --grad:linear-gradient(135deg,var(--ui-accent,#6366f1),var(--ui-accent-2,#a855f7))}
:host([size=sm]){font-size:12px}
:host([size=lg]){font-size:18px}
:host([block]){display:block}
:host([disabled]){opacity:.5;pointer-events:none}
:host([loading]){pointer-events:none}
*{box-sizing:border-box}

.btn{all:unset;box-sizing:border-box;position:relative;display:inline-flex;align-items:center;justify-content:center;
  gap:.55em;width:100%;padding:.75em 1.4em;border-radius:.85em;cursor:pointer;font:inherit;font-weight:600;
  line-height:1.2;white-space:nowrap;color:#fff;background:var(--grad);
  box-shadow:0 .2em .8em color-mix(in srgb,var(--ui-accent,#6366f1) 40%,transparent),inset 0 .06em .1em rgb(255 255 255/.35);
  transition:transform .2s cubic-bezier(.34,1.5,.5,1),box-shadow .25s,filter .2s,background-color .25s,color .25s}
.btn:hover{transform:translateY(-.08em);filter:brightness(1.07);
  box-shadow:0 .35em 1.1em color-mix(in srgb,var(--ui-accent,#6366f1) 50%,transparent),inset 0 .06em .1em rgb(255 255 255/.35)}
.btn:active{transform:scale(.96);filter:brightness(.97)}
.btn:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.2em}

:host([variant=soft]) .btn{color:var(--ui-accent,#6366f1);box-shadow:none;
  background:color-mix(in srgb,var(--ui-accent,#6366f1) 14%,transparent)}
:host([variant=soft]) .btn:hover{background:color-mix(in srgb,var(--ui-accent,#6366f1) 22%,transparent);filter:none;box-shadow:none}
:host([variant=outline]) .btn{color:var(--ui-accent,#6366f1);background:transparent;
  box-shadow:inset 0 0 0 .1em color-mix(in srgb,var(--ui-accent,#6366f1) 55%,transparent)}
:host([variant=outline]) .btn:hover{background:color-mix(in srgb,var(--ui-accent,#6366f1) 10%,transparent);filter:none;
  box-shadow:inset 0 0 0 .1em color-mix(in srgb,var(--ui-accent,#6366f1) 55%,transparent)}
:host([variant=ghost]) .btn{color:inherit;background:transparent;box-shadow:none}
:host([variant=ghost]) .btn:hover{background:color-mix(in srgb,currentColor 10%,transparent);filter:none;box-shadow:none}

:host([pill]) .btn{border-radius:2em}
:host([icon]) .btn{padding:.75em;aspect-ratio:1}

.content{display:inline-flex;align-items:center;justify-content:center;gap:.55em;transition:opacity .2s}
::slotted(svg){width:1.2em;height:1.2em;flex:none}

.spin{position:absolute;inset:0;margin:auto;width:1.2em;height:1.2em;border-radius:50%;
  border:.18em solid currentColor;border-right-color:transparent;opacity:0;transition:opacity .2s}
:host([loading]) .spin{opacity:1;animation:spin .7s linear infinite}
:host([loading]) .content{opacity:0}
@keyframes spin{to{transform:rotate(360deg)}}

@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}
  :host([loading]) .spin{animation-duration:2s}}
`;
