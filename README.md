# Michael Zhang — Personal Resume Site

A single-page resume/portfolio for Michael Zhang, Senior Full Stack Drupal Developer
(Brisbane, AU). Built with **Astro 5** (static output), **Tailwind CSS 4**, TypeScript
strict, and content collections. The hero background is a two-layer pipeline: an ion
particle network (Canvas 2D) lensed by a WebGL2 Schwarzschild black-hole shader.

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # runs astro check + astro build (must pass before committing)
npm run preview    # serve the production build locally
```

> Node 20.3+ / 22+ is required (Astro 5). If you use nvm: `nvm use 20`.

## Editing content

All site content lives in `src/content/` — edit, commit, and Vercel auto-deploys:

- **`src/content/resume.json`** — name, summary, badges, typed roles, skills matrix,
  AI-lab intro, education, languages, and contact links. The public site intentionally
  omits your phone number and referees (keep those in the PDF you send on request).
  There are a few `TODO:` markers in this file (e.g. a Drupal.org profile URL) — fill
  them in or leave them; TODO links are filtered out of the rendered site automatically.
- **`src/content/experience/*.md`** — one file per role. Frontmatter drives the timeline
  (`title`, `org`, `start` `YYYY-MM`, optional `end`, `order`, `tags`, `highlight`).
  Newest role = highest `order`.
- **`src/content/projects/*.md`** — one file per project. `category: government` or
  `category: ai-lab` controls which section it renders in.

Schemas are enforced by Zod in `src/content.config.ts`; `npm run build` fails loudly if
a content file doesn't match.

### Replace the placeholders

- **`public/resume.pdf`** — drop in your real résumé PDF (the "Download résumé" button
  links here).
- **`public/og.png`** — generated 1200×630 placeholder; replace with a real social card.
- **`astro.config.mjs`** — set `site` to your production domain (used for canonical +
  Open Graph URLs).

## Visual source of truth

`design/hero-prototype.html` is the approved, self-contained prototype. The design
tokens, hero layout, and both background scripts are ported from it verbatim into Astro
components. **Do not redesign or simplify the shader** — port changes from the prototype.

## Deployment (Vercel)

1. Push to GitHub (`https://github.com/Michael-Reno/Michael-Zhang-Resume`).
2. In Vercel: **Add New → Project → Import** this repo. Framework preset **Astro** is
   detected automatically; no build configuration needed (static output).
3. Every push to `main` deploys to production; pull requests get preview URLs.

### Custom domain

1. Vercel project → **Settings → Domains → Add** your domain.
2. At your DNS provider, add the records Vercel shows (an `A`/`ALIAS` record for the apex
   and a `CNAME` `cname.vercel-dns.com` for `www`).
3. Once verified, set `site` in `astro.config.mjs` to that domain and commit, so
   canonical/OG URLs match.

## Accessibility & performance

- Semantic landmarks (`nav` / `header` / `main` / `section` / `footer`), one `h1`.
- Visible focus ring (ion outline) on all interactive elements.
- `prefers-reduced-motion: reduce` → background renders a single static frame, no loop.
- No WebGL2 → falls back to the animated ion sky alone.
- Background canvases pause when the tab is hidden.

## Credits / attribution

The WebGL2 black-hole shader is adapted from
[**s0xDk/ghostty-blackhole**](https://github.com/s0xDk/ghostty-blackhole) (MIT) — itself
after Eric Bruneton's black hole shader. The Pomodoro/token modes were removed and the
hole was fixed-size with a gentle Lissajous drift for use as a website hero. The
attribution comment is preserved in `src/components/GeodesicField.astro`.

Fonts: **JetBrains Mono** and **Geist Sans**, self-hosted via `@fontsource` (no Google
Fonts CDN).
