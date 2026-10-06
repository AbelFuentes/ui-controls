export const styles = `
:host{display:block;font-size:var(--ui-select-size,16px);-webkit-tap-highlight-color:transparent}
:host([hidden]){display:none!important}
:host([size=sm]){font-size:13px}
:host([size=lg]){font-size:19px}
:host([disabled]) .wrap{opacity:.5;pointer-events:none}
*{box-sizing:border-box}
.wrap{position:relative}

.field{all:unset;box-sizing:border-box;width:100%;display:flex;align-items:center;gap:.6em;padding:0 1em;
  min-height:3.4em;border-radius:.9em;cursor:pointer;
  background:var(--ui-input-bg,color-mix(in srgb,currentColor 6%,transparent));
  box-shadow:inset 0 0 0 .08em var(--ui-input-border,color-mix(in srgb,currentColor 18%,transparent));
  transition:box-shadow .25s}
.field:hover{box-shadow:inset 0 0 0 .08em color-mix(in srgb,currentColor 32%,transparent)}
.field:focus-visible,.open .field{box-shadow:inset 0 0 0 .13em var(--ui-accent,#6366f1),
  0 0 0 .3em color-mix(in srgb,var(--ui-accent,#6366f1) 22%,transparent)}
.invalid .field{box-shadow:inset 0 0 0 .13em var(--ui-danger,#ef4444)}
.invalid .field:focus-visible,.invalid.open .field{box-shadow:inset 0 0 0 .13em var(--ui-danger,#ef4444),
  0 0 0 .3em color-mix(in srgb,var(--ui-danger,#ef4444) 22%,transparent)}

.box{position:relative;flex:1;min-width:0;height:3.4em}
.val{position:absolute;left:0;right:0;top:1.15em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  line-height:1.3;transition:opacity .2s}
.nolabel .val{top:50%;transform:translateY(-50%)}
.val.ph{opacity:0}
.open .val.ph,.nolabel .val.ph{opacity:.4}

.label{position:absolute;left:0;top:50%;transform:translateY(-50%);transform-origin:left;pointer-events:none;
  white-space:nowrap;opacity:.6;
  transition:transform .25s cubic-bezier(.4,0,.2,1),opacity .2s,color .2s}
.float .label{transform:translateY(calc(-50% - .85em)) scale(.75);opacity:.85}
.open .label,.field:focus-visible .label{color:var(--ui-accent,#6366f1);opacity:1}
.invalid .label{color:var(--ui-danger,#ef4444)}

.chev{flex:none;width:1.2em;height:1.2em;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;
  stroke-linejoin:round;opacity:.6;transition:transform .3s cubic-bezier(.34,1.4,.5,1)}
.open .chev{transform:rotate(180deg)}
::slotted(svg){width:1.2em;height:1.2em;flex:none;opacity:.6}

.menu{position:absolute;z-index:10;left:0;right:0;top:calc(100% + .4em);margin:0;padding:.35em;list-style:none;
  max-height:16em;overflow:auto;border-radius:.9em;
  background:var(--ui-surface,Canvas);color:var(--ui-text,CanvasText);
  box-shadow:0 0 0 1px color-mix(in srgb,currentColor 14%,transparent),0 1em 2.5em rgb(0 0 0/.28);
  visibility:hidden;opacity:0;transform:translateY(-.4em) scale(.97);transform-origin:top;
  transition:opacity .18s,transform .25s cubic-bezier(.34,1.3,.5,1),visibility 0s .25s}
.open .menu{visibility:visible;opacity:1;transform:none;transition-delay:0s}
.up .menu{top:auto;bottom:calc(100% + .4em);transform:translateY(.4em) scale(.97);transform-origin:bottom}
.up.open .menu{transform:none}

.opt{display:flex;align-items:center;gap:.6em;padding:.65em .8em;border-radius:.6em;cursor:pointer;
  line-height:1.2;transition:background-color .12s}
.opt.active{background:color-mix(in srgb,var(--ui-accent,#6366f1) 14%,transparent)}
.opt[aria-selected=true]{font-weight:600;color:var(--ui-accent,#6366f1)}
.opt[aria-disabled=true]{opacity:.4;cursor:not-allowed}
.tick{margin-left:auto;width:1.1em;height:1.1em;fill:none;stroke:currentColor;stroke-width:2.6;
  stroke-linecap:round;stroke-linejoin:round;opacity:0;transition:opacity .2s}
.opt[aria-selected=true] .tick{opacity:1}

.msg{padding:.45em .25em 0;font-size:.82em;line-height:1.3;opacity:.65}
.msg:empty{display:none}
.msg.err{color:var(--ui-danger,#ef4444);opacity:1}

@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important}}
`;
