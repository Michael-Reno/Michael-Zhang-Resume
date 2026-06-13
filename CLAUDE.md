# CLAUDE.md — Michael Zhang Personal Resume Website

## Project overview

A single-page-first personal resume/portfolio site for Michael Zhang, Senior Full Stack
Drupal Developer (Brisbane, AU) transitioning toward AI-augmented engineering. Target
audience: Australian government & enterprise recruiters and hiring managers. The site's
single job: convince a recruiter in 30 seconds that Michael is a senior, credible,
forward-looking engineer worth interviewing.

A working visual prototype exists at `design/hero-prototype.html` (committed to repo).
**It is the source of truth for visual direction AND the background implementation** —
port its design tokens, hero layout, and the entire two-layer background pipeline
(ion sky canvas + WebGL2 geodesic black hole) into Astro components verbatim.
Do not redesign; implement. Do not "simplify" the shader.

## Tech stack (fixed decisions — do not substitute)

- **Astro 5.x** (static output, islands architecture)
- **Tailwind CSS 4.x** via `@tailwindcss/vite`
- **TypeScript** strict mode
- **Content Collections** with Zod schemas (`src/content.config.ts`)
- **No UI framework islands** — the background is vanilla Canvas 2D + WebGL2 in
  plain `<script>` tags inside an Astro component (zero hydration cost).
  Do NOT add React, three.js, or tsParticles.
- **Deployment:** Vercel, static. `@astrojs/vercel` adapter only if needed for
  redirects; otherwise pure static output.

## Commands

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-git
npm install
npm run dev        # local dev at :4321
npm run build      # must pass with zero errors before any commit
npx astro check    # type-check content collections
```

## Design tokens (from prototype — implement as Tailwind theme / CSS vars)

| Token        | Value                          | Use                                  |
|--------------|--------------------------------|--------------------------------------|
| `--void`     | `#04060E`                      | Page background (deep space, NOT pure black)|
| `--surface`  | `#0B101E`                      | Cards, badges                        |
| `--line`     | `rgba(160,180,225,.10)`        | Hairline borders                     |
| `--ion`      | `#4DE3FF`                      | Primary accent (cyan)                |
| `--violet`   | `#9D7BFF`                      | Secondary accent (violet, sparingly) |
| `--text`     | `#E8EDF8`                      | Primary text                         |
| `--muted`    | `#8B95AE`                      | Secondary text                       |

**Typography (programmer stack):** JetBrains Mono for display/headings
(h1 weight 800, tracking −0.045em; h2/h3 weight 700) AND all labels/eyebrows/
badges/nav; Geist for body text. Self-host via `@fontsource/jetbrains-mono`
and `@fontsource/geist-sans` — do not use the Google Fonts CDN
(privacy + performance). The giant monospace h1 is intentional — do not
swap it for a "nicer" sans.

**Voice:** terminal/developer vernacular for structural labels (`$ whoami` eyebrow,
`~/michael-zhang` brand, mono section tags like `01 / experience`). Body copy is
plain professional English. Active voice. No marketing fluff.

## File structure

```
src/
├── content.config.ts            # Zod schemas (see below)
├── content/
│   ├── resume.json              # provided — copy from /content
│   ├── experience/*.md          # provided — copy from /content
│   └── projects/*.md            # provided — copy from /content
├── components/
│   ├── GeodesicField.astro      # two-layer background: ion sky + WebGL2 black hole
│   │                            # (port BOTH scripts from the prototype verbatim)
│   ├── Nav.astro
│   ├── Hero.astro               # eyebrow + name + typed roles + statement + badges + CTAs
│   ├── StackStrip.astro         # horizontal mono tech strip
│   ├── Timeline.astro           # experience, from content collection
│   ├── ProjectGrid.astro        # projects incl. AI lab section
│   ├── SkillsMatrix.astro       # from resume.json skills categories
│   ├── Contact.astro
│   └── Footer.astro
├── layouts/Base.astro           # fonts, meta/SEO, OG tags, IonField mount
└── pages/
    ├── index.astro              # all sections, single page
    └── og.png.ts                # (v2) dynamic OG image — skip in v1
public/
└── resume.pdf                   # placeholder; Michael will replace
```

## Content collection schemas

```ts
// experience frontmatter
{
  title: z.string(),            // "Senior Drupal Developer"
  org: z.string(),              // "Queensland Police Service"
  start: z.string(),            // "2023-03"
  end: z.string().optional(),   // absent = current
  order: z.number(),            // sort key, newest = highest
  tags: z.array(z.string()),
  highlight: z.string(),        // one-line summary for timeline card
}
// projects frontmatter
{
  name: z.string(),
  url: z.string().url().optional(),
  role: z.string(),
  stack: z.array(z.string()),
  category: z.enum(['government', 'ai-lab']),
  order: z.number(),
  summary: z.string(),
}
```

`resume.json` shape is defined by the provided file — type it with a Zod schema in a
json collection, do not loosen to `z.any()`.

## Page sections (in order)

1. **Nav** — brand + anchor links (experience / projects / ai-lab / contact)
2. **Hero** — exactly as prototype: `$ whoami` eyebrow, gradient name, typed role
   rotation (4 roles, ending the cycle list with "AI-Augmented Developer"),
   statement, 4 badges (NV1 / 10+ yrs Gov / WCAG / EN·中文), 2 CTAs
   (View experience → anchor; Download résumé → /resume.pdf)
3. **StackStrip** — 5 mono entries: cms / frontend / api / cloud / ai
4. **Experience** — vertical timeline from collection, glowing ion nodes,
   scroll-reveal via IntersectionObserver
5. **Projects** — `government` category cards (MRQ, JobAccess, GovCMS, CMI)
6. **AI Lab** — `ai-lab` category cards, with a short intro paragraph framing the AI
   transition. Visually identical card component, section tag `03 / ai-lab`
7. **Skills matrix** — categories from resume.json rendered as mono label + chip rows
8. **Contact** — email, LinkedIn, GitHub from resume.json; NO phone number on the
   public site (spam); email rendered with JS-assembled `mailto:` to reduce scraping
9. **Footer** — © year, "WCAG 2.1 AA · built with Astro"

## GeodesicField background component — requirements

The background is a two-layer pipeline. Port both layers from the prototype
**verbatim** — every constant below was tuned and approved; do not re-derive.

### Layer 1 — ion sky (offscreen Canvas 2D, the "sky" texture)
- Particle count `min(110, floor(w*h/16000))`, 82% cyan `#4DE3FF` / 18% violet `#9D7BFF`
- Neighbour links < 130px; cursor charge lines < 190px with gentle attraction
- **Anti-clustering (regression-tested, do not remove):**
  - mouse influence fades to zero between 1.5s and 2.5s of pointer idle
    (`mf = clamp((2500 - idleMs)/1000, 0, 1)` scales both attraction and line alpha)
  - per-frame brownian wander `±0.008` on each velocity axis keeps motion
    irregular forever — without it, a parked cursor herds particles into a clump
- Canvas at 1× resolution (it's a texture; soft glows survive linear sampling)
- Hidden offscreen; shown directly ONLY as the no-WebGL2 fallback

### Layer 2 — geodesic black hole (fullscreen WebGL2 fragment shader)
- Adapted from **s0xDk/ghostty-blackhole (MIT)** — keep the attribution comment in
  the shader source and credit it in the site README
- Per-pixel Schwarzschild photon geodesic integration (leapfrog, `N_STEPS 48`);
  far field uses the analytic weak-deflection branch with chromatic aberration
- Layer 1's canvas is uploaded as the sky texture every frame
  (`texImage2D` once, `texSubImage2D` after; `UNPACK_FLIP_Y_WEBGL`)
- **Blazar look (approved values):** `LENS_DEPTH 9.0, DISK_INNER 3.0,
  DISK_OUTER 16.0, DISK_INCL 1.05, DISK_ROLL 0.55, DISK_GAIN 1.0,
  DISK_OPACITY 0.3, DISK_TEMP 18000, DOPPLER_MIX 1.0, DISK_BEAM 5.0,
  DISK_SPEED 6.0, DISK_WIND 9.0, DISK_CONTRAST 1.5, EXPOSURE 0.75, DILATION 0.2`
- Shadow radius: `0.026` of viewport height desktop, `0.030` mobile
- **Movement:** the whole hole roams the right side via the Lissajous wander
  (2+2 incommensurate sines per axis, `DRIFT 0.26`); roam box desktop
  `mid (0.74, 0.60) amp (0.14, 0.24)` y-up uv, mobile `mid (0.76, 0.76)
  amp (0.10, 0.14)`; pointer parallax eased on top
- WebGL devicePixelRatio capped at **1.5** (geodesics are per-pixel expensive)

### Both layers
- Canvases `aria-hidden="true"`, `position: fixed`, `pointer-events: none`, z-index 0
- `prefers-reduced-motion: reduce` → render ONE static frame, no rAF loop
- `visibilitychange` → cancel rAF when tab hidden
- No WebGL2 → fall back to showing the animated ion sky alone (already in prototype)

## Quality floor (acceptance criteria — verify before declaring done)

- [ ] `npm run build` and `npx astro check` pass clean
- [ ] Lighthouse (mobile, prod build via `npm run preview`): Performance ≥ 90,
      Accessibility = 100, SEO = 100 (WebGL costs a few perf points — that's
      accepted; do NOT delete the shader to chase a score)
- [ ] Non-background JS (typed roles + scroll reveal) stays trivial; the
      background scripts together < 30KB gzipped, inlined or in one file
- [ ] Keyboard: all interactive elements reachable, visible focus ring (ion outline)
- [ ] Semantic landmarks: nav / header / main / sections with h2 / footer; exactly one h1
- [ ] Reduced-motion verified in DevTools emulation: no animation anywhere,
      black hole renders as a single static frame
- [ ] No-WebGL2 fallback verified (disable WebGL in DevTools → ion sky still animates)
- [ ] Responsive at 360px, 768px, 1280px — no horizontal scroll, hero name wraps cleanly
- [ ] Idle test: leave the page untouched 3+ minutes — particles stay dispersed
- [ ] All external links `rel="noopener"`; resume.pdf link works
- [ ] Meta: title, description, canonical, OG title/description/image (static
      placeholder OG image fine for v1), favicon
- [ ] Shader attribution comment present; README credits ghostty-blackhole (MIT)

## SEO / meta

- Title: `Michael Zhang — Senior Full Stack Drupal Developer | Brisbane`
- Description: pull from resume.json `basics.summary`, ≤ 155 chars
- JSON-LD `Person` schema with jobTitle, address locality Brisbane, sameAs links

## Deployment

1. `git init`, conventional commits, push to GitHub repo `michael-resume-site`
2. Vercel: import repo, framework preset Astro, zero config
3. Document in README: custom domain setup steps + how to edit content
   (edit files in `src/content/`, commit, auto-deploy)

## Milestones

- **M1:** scaffold + tokens + Base layout + GeodesicField + Hero → visual parity with prototype
- **M2:** content collections wired, all sections rendered from content files
- **M3:** quality floor checklist, README, deploy

Work autonomously through M1–M3. Commit at each milestone. If a decision is not
covered here, choose the simplest option consistent with the prototype and note it
in the final summary.
