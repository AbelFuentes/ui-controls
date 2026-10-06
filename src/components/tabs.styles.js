export const styles = `
:host{display:block;font-size:var(--ui-tabs-size,15px);
  --grad:linear-gradient(135deg,var(--ui-accent,#6366f1),var(--ui-accent-2,#a855f7))}
:host([size=sm]){font-size:12px}
:host([size=lg]){font-size:19px}
*{box-sizing:border-box}

.list{position:relative;display:flex;gap:.25em;overflow-x:auto;scrollbar-width:none;
  box-shadow:inset 0 -.1em 0 var(--ui-tabs-line,rgb(128 135 160/.25))}
.list::-webkit-scrollbar{display:none}

.tab{all:unset;position:relative;z-index:1;flex:none;padding:.8em 1.1em;cursor:pointer;
  font:inherit;font-weight:500;color:inherit;opacity:.65;white-space:nowrap;line-height:1.2;
  border-radius:.6em;transition:opacity .25s,color .25s,transform .15s}
.tab:hover{opacity:1}
.tab:active{transform:scale(.97)}
.tab[aria-selected=true]{opacity:1;font-weight:600}
.tab:disabled{opacity:.35;cursor:not-allowed}
.tab:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:-.15em}

.ind{position:absolute;left:0;bottom:0;width:var(--w,0);height:.22em;border-radius:1em 1em 0 0;
  transform:translateX(var(--x,0));background:var(--grad);opacity:0}
.ready .ind{transition:transform .45s cubic-bezier(.34,1.35,.5,1),width .45s cubic-bezier(.34,1.35,.5,1)}

:host([variant=pill]) .list{display:inline-flex;max-width:100%;padding:.25em;border-radius:.9em;box-shadow:inset 0 .06em .2em rgb(0 0 0/.18);
  background:var(--ui-tabs-bg,rgb(128 135 160/.18))}
:host([variant=pill]) .ind{top:.25em;bottom:.25em;height:auto;border-radius:.7em;
  box-shadow:0 .15em .6em color-mix(in srgb,var(--ui-accent,#6366f1) 45%,transparent),inset 0 .06em .1em rgb(255 255 255/.3)}
:host([variant=pill]) .tab[aria-selected=true]{color:#fff}

.panel{padding:var(--ui-tabs-panel-padding,1.25em .25em 0)}
::slotted([slot=active]){animation:in .35s cubic-bezier(.2,.8,.2,1)}
::slotted(:focus-visible){outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.3em;border-radius:.4em}
@keyframes in{from{opacity:0;transform:translateY(.4em)}}

@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important;animation:none!important}
  ::slotted([slot=active]){animation:none}}
`;
