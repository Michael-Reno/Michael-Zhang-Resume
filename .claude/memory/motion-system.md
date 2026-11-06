---
name: motion-system
description: How motion on the site is organised, what the pause button does, and why reduced-motion is only partly honoured
type: project
---
Motion has one authored moment plus quiet supporting states:
- Hero boot (global.css, CSS only): `whoami` types, the name prints, the role types, the rest follows while the disk ignites.
- Scroll focus (GeodesicField.astro): full-power black hole at the hero and contact; between them it shrinks, dims (uDisk) and moves to the margin so text stays readable.
- Experience rail (scroll-motion.ts): light fills the rail, entries arrive as its tip reaches their node.
- Nav: sticky, hides on scroll down, returns on scroll up, marker slides to the current section.
- Cards: pointer charge on the edges (adapted from Lucian UX/UI #228, MIT). Copy email button from Lucian #008 (MIT).
Pause: the nav button sets `html[data-motion=paused]` (saved in localStorage) and fires `motionchange`; background, typed role and blink stop. Needed for WCAG 2.2.2 because the footer claims AA.
Runtime: shader compiles via KHR_parallel_shader_compile, 60 fps cap (particles step per frame, 120 Hz ran them double speed), resolution steps down below ~40 fps.
Why: on phones the black hole sat on top of headings and body text; the old motion was the same fade-and-rise everywhere.
How to apply: `prefers-reduced-motion` is honoured for everything EXCEPT the background and typed role (owner's decision 2026-06-30, machines with OS animations off were losing the look). Keep that split unless Michael changes it. Do not change shader constants; add multipliers. The hidden start state of any reveal must sit under `.fx` so the page is readable without the script.
