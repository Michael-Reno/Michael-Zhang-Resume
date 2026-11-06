/* Scroll-linked and pointer-linked motion for everything below the hero.
   All of it is progressive: `.fx` is added here, so if this script never runs
   the page is simply fully visible. One rAF-throttled scroll handler.

   - Section heads print, cards and skill rows rise in as a list.
   - Experience rail fills with light; entries arrive as its tip reaches them.
   - Nav: hides on the way down, returns on the way up, marks the current section.
   - Cards: the pointer's charge lights their edges.
   - Top progress bar, hero drift, reel settle. */

const root = document.documentElement;
root.classList.add('fx');

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

/* ---------------- reveals ---------------- */
document.querySelectorAll<HTMLElement>('.sec-head').forEach((el) => {
  el.classList.add('reveal', 'reveal-head');
  const tag = el.querySelector<HTMLElement>('.tag');
  if (tag) tag.style.setProperty('--chars', String(tag.textContent?.trim().length ?? 12));
});
document.querySelectorAll('.grid, .skills').forEach((group) => {
  group.querySelectorAll<HTMLElement>(':scope > .reveal').forEach((el, i) => {
    el.style.setProperty('--d', `${Math.min(i, 4) * 60}ms`);
  });
});
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

/* ---------------- scroll-linked ---------------- */
const bar = document.createElement('div');
bar.className = 'scroll-progress';
bar.setAttribute('aria-hidden', 'true');
document.body.appendChild(bar);

const hero = document.querySelector<HTMLElement>('.hero');
const timeline = document.querySelector<HTMLElement>('.timeline');
const reel = document.getElementById('introFrame');
const nav = document.querySelector<HTMLElement>('.site-nav');
const navLinks = document.getElementById('nav-links');
const items = Array.from(document.querySelectorAll<HTMLElement>('.t-item'));

let itemTops: number[] = [];
function measure() {
  itemTops = items.map((el) => el.offsetTop);
}

let lastY = window.scrollY;
let ticking = false;
function update() {
  ticking = false;
  const vh = window.innerHeight;
  const y = window.scrollY;
  const max = root.scrollHeight - vh;
  bar.style.transform = `scaleX(${max > 0 ? clamp(y / max) : 0})`;

  if (hero) {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--hx', clamp(-r.top / (r.height * 0.85)).toFixed(3));
  }

  if (timeline) {
    const r = timeline.getBoundingClientRect();
    const tip = vh * 0.85 - r.top; // px of rail lit, measured from its top
    timeline.style.setProperty('--tl', clamp(tip / r.height).toFixed(4));
    timeline.style.setProperty('--tip', `${Math.min(Math.max(tip, 0), r.height).toFixed(1)}px`);
    timeline.style.setProperty('--tip-o', tip > 0 && tip < r.height ? '1' : '0');
    items.forEach((el, i) => {
      const lit = itemTops[i] + 10 <= tip;
      el.classList.toggle('lit', lit); // follows the light both ways
      if (lit) el.classList.add('seen'); // text, once arrived, stays
    });
  }

  if (reel) {
    const r = reel.getBoundingClientRect();
    reel.style.setProperty('--rv', clamp((vh - r.top) / (vh * 0.75)).toFixed(3));
  }

  if (nav) {
    nav.classList.toggle('stuck', y > 12);
    const dy = y - lastY;
    if (Math.abs(dy) > 5) {
      const menuOpen = navLinks?.classList.contains('open');
      nav.classList.toggle('nav-hidden', dy > 0 && y > vh * 0.6 && !menuOpen);
      lastY = y;
    }
  }
}
const onScroll = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
};
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener(
  'resize',
  () => {
    measure();
    onScroll();
    placeMarker();
  },
  { passive: true }
);

/* ---------------- nav: current section ---------------- */
const links = navLinks ? Array.from(navLinks.querySelectorAll<HTMLAnchorElement>('a')) : [];
let current: HTMLAnchorElement | null = null;
function placeMarker() {
  if (!navLinks) return;
  if (current) {
    navLinks.style.setProperty('--ix', `${current.offsetLeft}px`);
    navLinks.style.setProperty('--iw', String(current.offsetWidth));
    navLinks.style.setProperty('--io', '1');
  } else {
    navLinks.style.setProperty('--io', '0');
  }
}
function setCurrent(link: HTMLAnchorElement | null) {
  if (link === current) return;
  current?.removeAttribute('aria-current');
  link?.setAttribute('aria-current', 'location');
  current = link;
  placeMarker();
}
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      const link = links.find((a) => a.hash === `#${e.target.id}`) ?? null;
      if (e.isIntersecting) setCurrent(link);
      else if (link === current) setCurrent(null);
    });
  },
  { rootMargin: '-40% 0px -55% 0px' } // a thin band across the reading line
);
document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));

/* ---------------- cards: pointer charge ----------------
   Adapted from Lucian UX/UI Prompt #228 · MIT License (c) 2026 Seokwoooo
   https://lucianlabs.dev/uxui-prompt/#228
   Same behaviour and easing; re-coloured to the ion palette and applied to the
   site's own cards. Pointer devices only. */
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll<HTMLElement>('.grid').forEach((grid) => {
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.card'));
    let px = -999, py = -999, o = 0, target = 0, raf = 0, last = 0;
    function frame(now: number) {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      o += (target - o) * (reduced.matches ? 1 : Math.min(1, dt * (target ? 8 : 2.5)));
      cards.forEach((c) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--cx', `${(px - r.left).toFixed(1)}px`);
        c.style.setProperty('--cy', `${(py - r.top).toFixed(1)}px`);
        c.style.setProperty('--o', o.toFixed(3));
      });
      if (Math.abs(target - o) > 0.005) kick();
    }
    function kick() {
      if (!raf) raf = requestAnimationFrame(frame);
    }
    grid.addEventListener('pointermove', (e) => {
      if (!raf) last = performance.now();
      px = e.clientX;
      py = e.clientY;
      target = 1;
      kick();
    }, { passive: true });
    grid.addEventListener('pointerleave', () => {
      target = 0;
      last = performance.now();
      kick();
    });
  });
}

measure();
update();
placeMarker();
document.fonts?.ready.then(() => {
  measure();
  placeMarker();
  onScroll();
});
