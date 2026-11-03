# DESIGN.md: Abhinav Rajesh Pillai portfolio

Source of truth for every build phase. The owner's master prompt wins over any skill guideline
(awwwards, apple-design, frontend-design, emil-design-eng). Conflicts and how they were settled
are listed at the end.

## Concept card

```
Idea:        A developer's story told as the end credits of his own action film.
Metaphor:    RUNTIME, the 43s trailer: rain city, red-alarm server room, the crew, "DEPLOYED".
Signature:   The film hands off to "ENTER MY WORLD", an orange orb swallows the screen and the
             live page is revealed under it; the navbar melts in as an orange drip.
Emotion:     First 3 seconds after the reveal: calm, confident, quiet after the noise.
Motion verb: "Settle like a poster being slapped onto a wall": things arrive fast and stop
             dead. No wobble, no float, no loops.
Screenshot:  The hero frame: huge ABHINAV in orange under the dripping orange bar, black ground.
```

The film is loud; the site is the silence after it. One signature moment (the orb + drip), then
everything is still, flat and poster-like. **Still at rest is a deliberate decision**: nothing
loops (owner rule), so the awwwards "idle motion" check is waived here. Life comes from press,
hover and focus feedback, and from the four one-shot animations.

## Palette (owner-defined, measured)

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `bg` | `#0B0B0F` | ground, ~80% | |
| `surface` | `#16161C` | cards, raised areas | |
| `border` | `#26262E` | hairlines, card outlines (decorative only) | 1.31 on bg |
| `text` | `#EDEDED` | ink | 16.8 on bg, 15.4 on surface |
| `text-muted` | `#9A9AA5` | secondary ink | 7.05 on bg, 6.47 on surface |
| `orange` | `#D97757` | hero colour, ~15%: drip, primary buttons, key word | 6.29 on bg |
| `orange-light` | `#F0A07A` | hover for orange | 9.37 on bg |
| `purple` | `#8B5CF6` | accent, ~5%: tag outlines, focus, small shapes | 4.64 on bg, **4.25 on surface** |
| `bridge` | `#C2577A` | only where orange meets purple | 4.62 on bg |
| `on-orange` | `#1A1A1A` | ink on orange | 5.57 on orange, 8.30 on orange-light |
| `success` | `#22C55E` | one "deployed" detail at most | 8.62 on bg |

Rules
- Purple is never body-size text on `surface` (4.25 fails AA). Tag pills: purple 1px outline,
  `text` coloured label.
- Purple on orange is 1.36:1. The active nav underline (owner spec) is therefore paired with
  `aria-current="page"`; see open question Q1.
- Flat and solid: no shadows, gradients, blur, glow, translucency anywhere.

## Type

One family: **Inter** via `next/font/google`, weights 400 / 600 / 900 only, `display: swap`.

| Role | Size | Weight | Leading | Tracking | Case |
|---|---|---|---|---|---|
| Display XL (hero name) | `clamp(3.5rem, 13vw, 10.5rem)` | 900 | 0.86 | -0.045em | upper |
| Display (section titles) | `clamp(2.5rem, 7vw, 5.5rem)` | 900 | 0.92 | -0.035em | upper where it suits |
| Title (card, project) | `clamp(1.375rem, 2.4vw, 1.75rem)` | 600 | 1.15 | -0.015em | sentence |
| Body | `1.0625rem` (17px) | 400 | 1.55 | 0 | sentence |
| Small / UI | `0.875rem` | 600 | 1.3 | 0.005em | sentence |

Tracking tightens as size grows, never one value for all sizes (apple-design §15). Spacing in
`rem` so user text-size settings scale the layout. Line length under 70ch.

## Grid and rhythm

- Content column `max-width: 75rem` (1200px), centred. Side gutter 16px (<640), 24px (<1024),
  48px above.
- 12 columns, 24px gutter on desktop; 4 columns on phones.
- Section rhythm: 160px / 128px / 80px (desktop / tablet / phone), varied per section so it
  doesn't read as a template: Hero is full viewport, Crew and Work 160, About 128, Contact the
  largest gap above it.
- Alignment: everything left-aligned to the column edge. The only centred moments are the intro
  ("ENTER MY WORLD", the orb) and nothing else.

## Shape

One radius rule: **4px** on interactive things (buttons, pills, cards), **0** on surfaces that
touch an edge (navbar, sections). The drip is the only organic curve on the site.

## Motion language

- Library: `motion` (Framer Motion) for the orb and the four signature animations; CSS
  transitions for state feedback.
- Springs are critically damped by default: `{ type: 'spring', bounce: 0, duration: 0.45 }`.
  Bounce is never used (no overshoot wobble, owner rule).
- One easing for CSS: `cubic-bezier(0.2, 0, 0, 1)` (fast out, dead stop). Durations: 120ms
  press, 180ms hover, 320ms menus, 800ms drip.
- Press feedback on pointer-down: `scale(0.97)` 100ms. Hover is a solid fill change plus a 2px
  lift on primary targets (cards, CTAs); utility links only change colour.
- Interruptible: drip retract/extend follows scroll direction and reverses from its current
  value; Esc during the orb jumps to the end state.
- Symmetric paths: the mobile menu leaves the way it came; drips retract upward the way they fell.
- Only `transform`, `opacity` and `clip-path` animate.
- `prefers-reduced-motion`: all of the above become 150ms opacity cross-fades; no film, no orb.
  `prefers-contrast: more`: borders go to `text-muted`.

## Signature: the drip navbar

```
┌──────────────────────────────────────────────────────────────────────────┐ orange bar 64px
│ ABHINAV PILLAI                              Work  About  Contact [Resume]│ fixed, full width
└─╮ ╭────────╮  ╭───────────────╮ ╭──╮ ╭───────────╮   ╭─────────╮ ╭──────┘ melt skirt
  │ │        ╰──╯               │ │  ╰─╯           ╰╮ ╭╯         ╰─╯       (wavy edge)
  ╰─╯                           ╰─╯                 │ │                     drips, uneven
                                                    ╰─╯                     lengths 18..72px
```

- Bar is a solid orange `div`; the melt skirt and drips are inline SVG under it. Each drip is
  its own small SVG at a % position with fixed pixel size (no horizontal stretching), so drips
  can scale from their top edge independently.
- Scroll down: skirt + drips `scaleY → 0` (transform-origin top) leaving the slim bar. Scroll to
  top: they ooze back. Space for the full skirt is reserved in the hero, CLS 0.
- Phone: fewer, shorter drips; hamburger → full-screen solid `bg` menu, large links.

## Sections (each a different layout family)

```
HERO (full viewport, type poster)          CREW (three figures on a stage line)
┌──────────────────────────────┐           ┌──────────────────────────────┐
│ [drip bar]                   │           │ I DON'T WORK ALONE.          │
│                              │           │ They make me look like ...   │
│ ABHINAV        (orange)      │           │ ┌──────┐ ┌──────┐ ┌──────┐   │
│ RAJESH                       │           │ │figure│ │figure│ │figure│   │
│ PILLAI                       │           │ │name  │ │name  │ │name  │   │
│ roles · roles · roles        │           │ │role  │ │role  │ │role  │   │
│ one line                     │           │ └──────┘ └──────┘ └──────┘   │
│ [See my work]  Resume        │           │ (Director centre, taller)    │
└──────────────────────────────┘           └──────────────────────────────┘

WORK (index list, not a card grid)         ABOUT + JOURNEY (two columns)
┌──────────────────────────────┐           ┌──────────────┬───────────────┐
│ WORK                         │           │ ABOUT        │ 2023  ●       │
│ ──────────────────────────── │           │ paragraph    │ │  B.Tech ... │
│ Drone Telemetry API  AstroX  │           │              │ 2024 ●        │
│ outcome line          tags   │           │              │ │  ...        │
│ ──────────────────────────── │           │              │ (orange line) │
│ ... x4                       │           ├──────────────┴───────────────┤
│ More projects on GitHub      │           │ Data  AI  Engineering  Tools │
└──────────────────────────────┘           └──────────────────────────────┘

CONTACT (one big line)                     FOOTER (one quiet row)
┌──────────────────────────────┐           ┌──────────────────────────────┐
│ LET'S BUILD SOMETHING.       │           │ © 2026 name  Replay intro    │
│ email [copy]  in  gh  resume │           │ Built with a Thinker and ... │
└──────────────────────────────┘           └──────────────────────────────┘
```

Work is a full-width ruled index (each project a row, the whole row is the link) rather than
four equal cards: the genericness test said four rounded cards is what any model would ship,
and the brief allows "card per project" to be a row-card.

## Copy rules

- First person, concise, sentence case, no buzzwords, no dash characters in visible text
  (separation comes from layout: years in their own column, names and roles on their own lines).
- Facts only from the master prompt. `[VERIFY]` items live as commented TODOs in `src/content/`.
- Phone copy says "tap", never "hover".

## Conflicts settled

| Guideline | Owner brief | Decision |
|---|---|---|
| awwwards: GSAP + Lenis, one GSAP clock | Framer Motion, no GSAP | Motion; no smooth scroll |
| awwwards: idle motion at rest | nothing loops | still page, recorded above |
| apple-design: translucent chrome | flat, no blur | solid orange bar |
| frontend-design: #D97757 / tinted black / one accent word / middle dots are AI tells | specifies all of them | brief wins: the orange and the crew deliberately reference Claude, the black matches the film |
| awwwards: no em dashes | copy uses them | dashes removed, layout separates |
| awwwards: avoid three equal cards | Crew is three cards | kept; Director card leads and differs |

## Open questions

- Q1: purple underline on orange is 1.36:1 (needs 3:1 for a state indicator). Options: keep as
  specified, or make the active underline `on-orange` (5.57:1) and keep purple for hover/tags.
