export const styles = `
:host{display:block;font-size:var(--ui-stepper-size,15px);-webkit-tap-highlight-color:transparent;
  --line:var(--ui-stepper-line,rgb(128 135 160/.3));
  --grad:linear-gradient(135deg,var(--ui-accent,#6366f1),var(--ui-accent-2,#a855f7))}
:host([size=sm]){font-size:12px}
:host([size=lg]){font-size:19px}
*{box-sizing:border-box}

ol{display:flex;margin:0;padding:0;list-style:none}
li{position:relative;flex:1;display:flex;justify-content:center}
.hit{display:flex;flex-direction:column;align-items:center;gap:.6em;text-align:center;border-radius:.8em;outline:none}
.hit.act{cursor:pointer}
.hit:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.25em}

li:not(:last-child)::before,li:not(:last-child)::after{content:"";position:absolute;top:1em;
  left:calc(50% + 1.6em);width:calc(100% - 3.2em);height:.2em;border-radius:1em}
li:not(:last-child)::before{background:var(--line)}
li:not(:last-child)::after{background:var(--grad);transform:scaleX(0);transform-origin:left;
  transition:transform .5s cubic-bezier(.4,0,.2,1)}
li.done:not(:last-child)::after{transform:scaleX(1)}

.node{position:relative;flex:none;width:2.2em;height:2.2em;border-radius:50%;display:grid;place-items:center;
  font-weight:600;font-size:.95em;box-shadow:inset 0 0 0 .13em var(--line);
  transition:box-shadow .35s,transform .25s cubic-bezier(.34,1.5,.5,1)}
.hit.act:hover .node{transform:scale(1.08)}
.hit.act:active .node{transform:scale(.92)}
.fill{position:absolute;inset:0;border-radius:inherit;background:var(--grad);opacity:0;transform:scale(.6);
  transition:opacity .3s,transform .45s cubic-bezier(.34,1.5,.5,1)}
.num{position:relative;opacity:.7;transition:opacity .25s,color .25s}
.check{position:absolute;inset:.35em;width:calc(100% - .7em);height:calc(100% - .7em);fill:none;stroke:#fff;
  stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:20;stroke-dashoffset:20;
  transition:stroke-dashoffset .35s .1s}

.current .fill,.done .fill{opacity:1;transform:none}
.current .node,.done .node{box-shadow:inset 0 0 0 .13em transparent}
.current .num{color:#fff;opacity:1}
.done .num{opacity:0}
.done .check{stroke-dashoffset:0}
.current .node{animation:ring 2.4s ease-out infinite}
@keyframes ring{
  0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--ui-accent,#6366f1) 45%,transparent)}
  70%,100%{box-shadow:0 0 0 .7em transparent}}

.text{display:block}
.label{display:block;font-weight:500;opacity:.6;transition:opacity .3s}
.desc{display:block;font-size:.85em;opacity:.55;margin-top:.15em}
.current .label{font-weight:600;opacity:1}
.done .label{opacity:.9}

:host([orientation=vertical]) ol{flex-direction:column}
:host([orientation=vertical]) li{flex:none;justify-content:flex-start;padding-bottom:1.8em}
:host([orientation=vertical]) li:last-child{padding-bottom:0}
:host([orientation=vertical]) .hit{flex-direction:row;align-items:flex-start;gap:.9em;text-align:left}
:host([orientation=vertical]) .label{line-height:2.2em}
:host([orientation=vertical]) li:not(:last-child)::before,
:host([orientation=vertical]) li:not(:last-child)::after{top:2.7em;bottom:.5em;left:1em;width:.2em;height:auto}
:host([orientation=vertical]) li:not(:last-child)::after{transform:scaleY(0);transform-origin:top}
:host([orientation=vertical]) li.done:not(:last-child)::after{transform:scaleY(1)}

@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{transition-duration:.01ms!important;animation:none!important}}
`;
