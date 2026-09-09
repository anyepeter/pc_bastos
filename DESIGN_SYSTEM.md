# CEPCA design system

The contract every public page follows. The landing page (`app/page.tsx` and its
sections) is the reference implementation — when this document and the landing
page disagree, the landing page wins.

## What we are replacing

The interior pages came from a US megachurch starter template. They share a
recognisable set of faults; a redesign is not finished while any remain:

- **Hardcoded Unsplash stock photography** as hero backgrounds. Fifteen files do
  this. It is not the council's imagery and it must go — no replacement stock.
- **Off-palette colour.** 479 uses of Tailwind's default `violet/purple/indigo/
  pink/emerald/teal/gray/slate…` ramps. The site has exactly three ramps.
- **Gradient-clipped text** (`bg-gradient-to-r … bg-clip-text text-transparent`).
- **`max-w-7xl mx-auto px-4`** containers instead of `.shell`.
- **Ad-hoc entrance animation** — `useState(false)` + `useEffect` + `setTimeout`
  + `translate-y-8 opacity-0`. Replace with `<Reveal>`.
- **Legacy font classes** `font-playfair` / `font-inter` / `font-poppins`.
- `bg-white/90 backdrop-blur-sm shadow-xl border-white/50` cards.

## Palette — three ramps, nothing else

| Ramp | Role |
| --- | --- |
| `ink` | violet-tinted neutrals. 50–200 surfaces and hairlines, 500–900 text |
| `plum` | the structural accent |
| `leaf` | the highlight |

Never introduce a Tailwind default colour ramp. Never introduce a new hex.

**Tailwind is 3.3.3: slash opacities outside `0 5 10 20 25 30 40 50 60 70 75 80
90 95 100` silently compile to nothing.** `ring-white/12` renders a *blue* ring,
because the colour is dropped and `--tw-ring-color` falls back. Use bracket
syntax for anything off-scale: `bg-plum-950/[0.85]`.

### Icons — one colour

Icons carry **one** colour across the whole site, never a per-item palette:

- on white / `ink-50`: `text-leaf-600`
- on `plum-950` / `plum-900`: `text-leaf-300`

No coloured icon chips, no per-card hues, no `bg-blue-100 text-blue-600` tiles.
An icon container is `border border-ink-200 bg-white` on light, or
`border-white/10 bg-white/5` on dark.

## Typography

- `font-display` (Playfair) — h1/h2/h3 and card titles.
- `font-ui` (Outfit) — buttons, nav, labels, UI chrome.
- `font-mono` (JetBrains) — eyebrows, counts, dates, metadata.
- Body text is the default sans.

Sizes are set by the shared components; do not re-declare them.

- Page title (`PageHero`): `clamp(2.4rem, 5.2vw, 4.25rem)`
- Section heading: `clamp(2.1rem, 4.2vw, 3.4rem)`
- Eyebrow: `font-mono text-[0.68rem] uppercase tracking-[0.28em]`
- Body: `text-base leading-relaxed`, `text-pretty`, measure `max-w-[48ch]`

## Contrast — non-negotiable

Body text ≥ 4.5:1, large text and icons ≥ 3:1. Verified pairings:

- on white: `ink-600` 7.4:1 · `ink-500` 4.9:1 · `plum-600` 6.4:1 · `leaf-600` 5.9:1
- on `plum-950`: `white` 17.4:1 · `plum-200` 11.9:1 · `plum-300` 8.7:1 · `leaf-300` 8.5:1
- on `plum-900`: `white` 14.0:1 · `plum-200` 9.6:1 · `plum-300` 7.0:1 · `leaf-300` 6.9:1

`leaf-500` is 4.14:1 on white — **large text and icons only, never body copy.**

## Shared components — compose, do not reinvent

| Component | Use |
| --- | --- |
| `PageHero` | every interior page's header. Props: `eyebrow`, `title`, `titleHighlight`, `lede`, `crumbs`, `children` |
| `PageSection` | every band. Props: `tone` (`white`/`tint`/`dark`), `paint`, `glow`, `id` |
| `SectionHeading` | every section header. Props: `eyebrow`, `title`, `titleHighlight`, `standfirst`, `tone`, `layout`, `as` |
| `Reveal` | every scroll entrance. Props: `delay`, `as`, `className` |
| `BrushEdge` | painted edges. `PageSection paint` and `PageHero` already handle the common cases |
| `PageLayout` | Navigation + Footer + WhatsApp wrapper |

`.shell` is the container (max-width `100rem`, responsive gutters). `PageHero`
and `PageSection` apply it — do not nest another.

### The painting rule

**Paint is always the section's own colour thrown outward onto its neighbours,
never the neighbour's colour laid inward.** A self-painting band needs no
knowledge of what sits above or below, so it cannot seam and survives reordering.
Reserve `paint` for `dark` bands. The hero and footer already paint themselves.

A painted band must not have `overflow-hidden` — it would shear off the
bristles. Clip glows in an inner wrapper instead.

**A page must end on a light band.** The footer is already the closing dark
band and paints its own top edge upward, so a `dark` band placed directly above
it produces two brush strokes in the same 110px — in two different purples,
since the footer is `plum-900` and a dark band is `plum-950`. It also leaves the
page ending in two stacked dark regions with no visible transition between them.

`paint` therefore accepts `true | 'top' | 'bottom'`. Use `'top'` for a dark band
that must stay dark next to another painted surface. Five pages shipped with
this collision — `/about/history`, `/about/mission-vision`, `/about/structure`,
`/departments` and `/charity/[id]` — and all five now close on a light band.

## Rhythm

- Band padding: `py-16 lg:py-24` (`PageSection` default). Dark feature bands may
  go `py-20 lg:py-28`.
- Grounds alternate `white` → `tint` → `white`, punctuated by a `dark` band.
- Gap between a heading and its content: `mt-11`.
- Grid gaps: `gap-4` tight, `gap-6` cards, `gap-8`–`gap-10` layout columns.
- Cards: `.card` / `.card-hover`, `rounded-2xl`, `p-5`–`p-7`.

## Motion

Use `Reveal` plus CSS transitions. **Do not add an animation library** — the
landing page's feel comes from these primitives and a second system would not
match it.

- Stagger lists: `delay={Math.min(i, 8) * 60}`. Cap it, or long lists crawl.
- Interaction: `transition-* duration-300 ease-spring`. Photo scale on hover
  `duration-700`.
- Animate `transform` and `opacity` only.
- `.reveal` already no-ops under `prefers-reduced-motion`; any bespoke motion
  must do the same.
- `.reveal` fails open — content is visible when JS or IntersectionObserver is
  unavailable. Never gate content on an `isVisible` state.

## Accessibility

- One `h1` per page (`PageHero` provides it). Sections use `h2`, then `h3`.
- Every interactive element carries `.focus-ring`.
- Decorative images: `alt=""` + `aria-hidden="true"`. Meaningful ones need real
  alt text.
- Icons inside a labelled control are `aria-hidden`; icon-only buttons need
  `aria-label`.
- Lists of things are `<ul>`/`<li>`.

## Content rules

- **Do not change copy.** Design only. Every string stays as it is.
- Static UI text → i18next `t('…')`, keys in **both** `public/locales/en` and
  `/fr`. A key added to one only is a bug.
- Dynamic DB text → `getTranslatedText(value, language)`, language from
  `useAppSelector(s => s.blog.language)`.
- Values out of a Prisma `Json` column go through `readTranslation` — legacy rows
  may hold a bare string, and rendering the raw object crashes the page.
- Dates → `lib/format.ts`, which is locale-aware.
- `'use client'` for anything using `useTranslation`, Redux or state.
- **Never nest a second `StoreProvider`** — there is one store, in
  `app/layout.tsx`. Nesting one silently breaks language switching.

## Definition of done

1. `npx tsc --noEmit` clean.
2. `npx next lint --file <files>` clean.
3. No Unsplash URL, no off-palette ramp, no gradient-clipped text, no
   `max-w-7xl`, no `setTimeout` reveal, no legacy font class in the files touched.
4. Every opacity modifier on-scale or bracketed.
5. Copy unchanged; no locale key added to one language only.
