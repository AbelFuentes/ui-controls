export const styles = `
:host{display:inline-block;font-size:var(--ui-switch-size,16px);line-height:0;-webkit-tap-highlight-color:transparent}
:host([size=sm]){font-size:12px}
:host([size=lg]){font-size:22px}
*{box-sizing:border-box}

.track{all:unset;position:relative;display:block;width:5em;height:2.5em;border-radius:2.5em;overflow:hidden;
  cursor:pointer;isolation:isolate;
  box-shadow:inset 0 .12em .35em rgb(0 0 0/.35),0 .05em .15em rgb(255 255 255/.25)}
.track:focus-visible{outline:.15em solid var(--ui-accent,#6366f1);outline-offset:.2em}

.bg{position:absolute;inset:0;transition:opacity .6s ease}
.day{background:linear-gradient(180deg,#4facfe,#a8e0ff)}
.night{background:linear-gradient(180deg,#0b1030,#2b2f70);opacity:0}
[aria-checked=true] .night{opacity:1}

.star{position:absolute;left:var(--x);top:var(--y);width:.14em;height:.14em;border-radius:50%;background:#fff;
  opacity:0;transform:translateY(.7em) scale(.3);
  transition:opacity .5s,transform .7s cubic-bezier(.3,1.4,.5,1)}
[aria-checked=true] .star{opacity:1;transform:none;animation:tw 2.8s ease-in-out var(--t) infinite}
@keyframes tw{50%{opacity:.3}}

.cloud{position:absolute;right:.35em;bottom:-.2em;width:1.7em;height:.8em;border-radius:1em;background:#fff;
  opacity:.95;transform:translateY(var(--ty,0)) scale(var(--s,1));
  transition:transform .7s cubic-bezier(.3,1.3,.5,1),opacity .5s}
.cloud::before,.cloud::after{content:"";position:absolute;background:inherit;border-radius:50%}
.cloud::before{width:.85em;height:.85em;left:.25em;top:-.42em}
.cloud::after{width:.6em;height:.6em;right:.25em;top:-.25em}
.cloud.back{right:1.25em;bottom:-.35em;--s:.8;opacity:.6}
[aria-checked=true] .cloud{--ty:1.8em;opacity:0}

.thumb{position:absolute;z-index:2;top:.3em;left:.3em;width:var(--tw,1.9em);height:1.9em;border-radius:50%;
  background:#ffcf4a;
  box-shadow:inset -.12em -.12em .25em rgb(255 140 0/.45),inset .1em .1em .2em rgb(255 255 255/.6),
    0 0 0 .45em rgb(255 255 255/.14),0 0 0 .9em rgb(255 255 255/.09),0 .15em .4em rgb(0 0 0/.3);
  transition:left .55s cubic-bezier(.34,1.4,.5,1),width .2s,background-color .5s,box-shadow .5s}
[aria-checked=true] .thumb{left:calc(100% - .3em - var(--tw,1.9em));background:#e6e9f5;
  box-shadow:inset -.12em -.12em .25em rgb(90 100 150/.5),inset .1em .1em .2em rgb(255 255 255/.8),
    0 0 0 .45em rgb(255 255 255/.06),0 0 0 .9em rgb(255 255 255/.03),0 .15em .4em rgb(0 0 0/.45)}
.track:hover .thumb{filter:brightness(1.05)}
.track:active .thumb{--tw:2.3em}

.face{position:absolute;inset:0;border-radius:50%;overflow:hidden;transition:transform .9s cubic-bezier(.3,1.2,.5,1)}
[aria-checked=true] .face{transform:rotate(360deg)}
.crater{position:absolute;border-radius:50%;background:rgb(120 130 175/.45);
  box-shadow:inset .05em .05em .08em rgb(0 0 0/.18);opacity:0;transform:scale(.3);
  transition:opacity .4s,transform .5s .1s}
[aria-checked=true] .crater{opacity:1;transform:none}
.c1{width:.5em;height:.5em;left:.35em;top:.3em}
.c2{width:.3em;height:.3em;right:.4em;top:.9em}
.c3{width:.22em;height:.22em;left:.75em;bottom:.3em}

@media (prefers-reduced-motion:reduce){*{transition-duration:.01ms!important;animation:none!important}}
`;
