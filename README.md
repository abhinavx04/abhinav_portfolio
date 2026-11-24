# Abhinav Rajesh Pillai: portfolio

My personal site. It opens with RUNTIME, a 41 second film about a 2 AM outage and the crew that
fixes it: me (the Director), the Thinker (Claude) and the Speedster (Codex). The rest of the site is
the end credits.

Built with Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4, Motion, GSAP + Lenis
for scroll, react-three-fiber for the 3D hero and ogl for the film carousel. Type is Inter only.

DESIGN.md is the design source of truth: palette, type scale, motion rules, sections and the
decisions behind them.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type checks)
npm run lint
```

Add `?intro=skip` to the URL to skip the film while working on the page.

## Where to edit content

All copy lives in `src/content/`; components only read from it.

| File | What it holds |
| --- | --- |
| `site.ts` | Name, roles, tagline, email, social links, resume path, production URL |
| `projects.ts` | Work entries and the `/work/[slug]` case studies |
| `timeline.ts` | The About journey |
| `skills.ts` | The stack band |
| `crew.ts` | The three crew cards |
| `film.ts` | The film section: one back story per frame |

Lines marked `PLACEHOLDER` or `TODO [VERIFY]` are waiting on real details and stay hidden or generic
until they are filled in.

## Assets

| Folder | Contents |
| --- | --- |
| `public/intro/` | The intro film: 1080p and 720p in VP9, HEVC and H.264, picked by drawn width, plus the poster |
| `public/film/` | Stills from the film, named by timestamp (`still-13-4` is 13.4 s) |
| `public/crew/` | Crew cut-outs (WebP). Missing files fall back to flat drawn figures |
| `public/models/` | The three characters as GLB (meshopt + WebP textures) for the 3D hero |
| `public/photos/` | Optional. Up to 3 photos here turn on the Photos section at the next build |
| `public/og.jpg` | The 1200x630 share image: the walk-away frame under the orange bar |

`scripts/intro-film/` is the film's edit pipeline (`recut.py`, `captions.mjs`, `mix.py`). It expects the
source clips outside the repo.

## Performance guards

- The 3D hero starts on first interaction or after 8 s, and is skipped for reduced motion, data saver,
  fewer than 4 cores or no WebGL. Below about 20 fps it falls back to the still image.
- The film carousel loads only after the intro and only near its section. Reduced motion, data saver
  and no WebGL 2 keep the plain scroll-snap strip.
- GSAP and Lenis load after the page settles.

## Deploy

Made for Vercel. Set the production domain in `src/content/site.ts` (`url`) first: canonical URLs, the
sitemap and the share tags all read from it.
