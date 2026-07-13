---
version: alpha
name: RythuNetra — Forest on White
description: >-
  Bilingual (English / Telugu) organic-agriculture advisory platform for
  Telangana farmers. A grounded forest-green accent on a pure-white canvas keeps
  crop imagery, disease scans, and content the heroes of every screen — while the
  hue itself signals healthy, organic, growing. STATUS: TARGET / PROPOSED — the
  current codebase renders a dark indigo theme; see Migration Notes.
colors:
  # Brand ramp — Forest Green (light stops from Tints, deep stops from Shades)
  green-100: "#BAE2C5"
  green-200: "#86CD9A"
  green-300: "#53B86F"
  green-400: "#39894F"
  green-500: "#2E6F40"
  green-600: "#296339"
  green-700: "#1F4A2B"
  green-800: "#14311C"
  green-900: "#0A190E"
  # Semantic roles (convention order: primary, secondary, tertiary, neutral, surface, on-surface, error)
  primary: "{colors.green-500}"
  primary-hover: "{colors.green-600}"
  primary-active: "{colors.green-700}"
  secondary: "{colors.green-100}"
  tertiary: "{colors.green-300}"
  neutral: "#6E7A72"
  surface: "#FFFFFF"
  surface-subtle: "#F7FAF8"
  surface-band: "#ECF8F0"
  on-surface: "#363F39"
  on-surface-heading: "#121813"
  on-surface-secondary: "#4F5A53"
  on-surface-tertiary: "#6E7A72"
  on-primary: "#FFFFFF"
  link: "{colors.green-500}"
  border: "#E2E9E4"
  border-strong: "#CFD8D2"
  ring: "{colors.green-500}"
  # Surface wash ramp — near-white mints (anchored on #CFFFDC, Lush Forest)
  wash-50: "#F4FBF6"
  wash-100: "#ECF8F0"
  wash-200: "#DEF3E5"
  wash-300: "#CFFFDC"
  # Neutrals (cool, ~2-3% green cast)
  neutral-50: "#F7FAF8"
  neutral-100: "#EFF4F1"
  neutral-200: "#E2E9E4"
  neutral-300: "#CFD8D2"
  neutral-400: "#9EAAA1"
  neutral-500: "#6E7A72"
  neutral-600: "#4F5A53"
  neutral-700: "#363F39"
  neutral-800: "#232A25"
  neutral-900: "#121813"
  # Semantic status (Success = brighter leaf green, distinct from deep-forest primary)
  success: "#22A04C"
  success-surface: "#ECFDF3"
  success-text: "#15803D"
  warning: "#E8A317"
  warning-surface: "#FEF6E7"
  warning-text: "#B4740E"
  error: "#E5484D"
  error-surface: "#FEF2F2"
  error-text: "#C62A2F"
  info: "#147D6A"
  info-surface: "#E4F5F0"
  info-text: "#0E5A4D"
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.35
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.4
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.5
rounded:
  sm: 0.625rem
  md: 0.625rem
  lg: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  card-padding: 16px
components:
  button-primary:
    backgroundColor: "{colors.green-500}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    typography: "{typography.label-md}"
    height: 40px
    padding: 16px
  button-primary-hover:
    backgroundColor: "{colors.green-600}"
  button-secondary:
    backgroundColor: "{colors.green-100}"
    textColor: "{colors.green-800}"
    rounded: "{rounded.md}"
  button-secondary-hover:
    backgroundColor: "#A0D8AF"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
  button-outline-hover:
    textColor: "{colors.green-500}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.on-surface-secondary}"
  button-ghost-hover:
    backgroundColor: "{colors.neutral-100}"
  button-destructive:
    backgroundColor: "{colors.error-surface}"
    textColor: "{colors.error-text}"
    rounded: "{rounded.md}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 16px
  card-highlighted:
    backgroundColor: "{colors.surface-band}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
  input:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    height: 44px
  input-focus:
    backgroundColor: "{colors.surface}"
  badge:
    backgroundColor: "{colors.green-100}"
    textColor: "{colors.green-800}"
    rounded: "{rounded.full}"
    typography: "{typography.caption}"
  badge-selected:
    backgroundColor: "{colors.green-500}"
    textColor: "{colors.on-primary}"
---

# RythuNetra — Design System (Green)

> **Forest on White** — the target visual language for RythuNetra, a bilingual
> (English / Telugu) organic-agriculture advisory platform for Telangana farmers.
> A grounded forest-green accent on a **pure white** canvas keeps crop imagery,
> disease scans, and content the heroes of every screen — while the hue itself
> quietly signals *healthy, organic, growing*.
>
> **Status: TARGET / PROPOSED.** This document describes the design the app should adopt.
> The current codebase renders a dark, indigo theme (`--primary: #5E6AD2` on `#09090B`);
> the Migration Notes list the steps.
> Every color below derives from the approved green palette — exact hexes are canonical.
> This file follows the [design.md](https://github.com/google-labs-code/design.md) format:
> the YAML frontmatter above is the normative token source; the prose below is rationale.

---

## Overview

- **Mood:** Bright, natural, high-clarity. A pure-white canvas with a confident forest-green
  accent — trustworthy and calm, optimized for outdoor phone use in sunlight.
- **Audience:** Telangana farmers and advisors, often on mid-range Android phones in bright
  daylight; legibility and large tap targets outrank decoration.
- **Accent discipline:** Green is a **spice, not a sauce.** The brand green signals action,
  focus, and identity; surfaces stay white or the faintest mint wash.
- **Depth by light, not shadow.** On white, elevation reads through soft *green-tinted*
  shadows and hairline borders — never heavy black drop-shadows.
- **Organic, not synthetic.** Rounded corners, gentle gradients, and a soft "leaf/sprout"
  motif echo the natural subject without literal clip-art.
- **Meaningful hue.** Green *is* the message here — growth, health, organic. Because the
  whole system is green, functional state (success/warning/danger) must stay clearly
  differentiated (see Colors) so "healthy" never blurs with "brand."
- **Bilingual-first.** English (Inter) and Telugu (Anek Telugu) are equal citizens; Telugu
  runs ~15% taller, so heights must flex.

---

## Colors

### Brand Ramp — Forest Green (canonical)

The core identity ramp. `{colors.green-500}` (`#2E6F40`) is the **brand hue** *and* the
**default action color**: at ~6.1:1 on white it clears WCAG AA for normal text, links, and
UI — a single anchor that does the work amethyst needed two tokens for. Light stops
(`-100…-300`) come from the canonical **Tints**; deep stops (`-600…-900`) from the
canonical **Shades**.

| Token       | Hex       | Source | Role                                              |
| ----------- | --------- | ------ | ------------------------------------------------- |
| `green-100` | `#BAE2C5` | Tint   | Soft fill — badges, chips, icon backplates        |
| `green-200` | `#86CD9A` | Tint   | Decorative / illustration accent                  |
| `green-300` | `#53B86F` | Tint   | Gradient mid-stop, secondary highlight (large only)|
| `green-400` | `#39894F` | Tint   | Light brand tone, hover on tints                  |
| `green-500` | `#2E6F40` | Brand  | **Brand hue + Primary action** — buttons, links, focus |
| `green-600` | `#296339` | Shade  | **Primary hover / pressed**                       |
| `green-700` | `#1F4A2B` | Shade  | Deep accent, text on light tints                  |
| `green-800` | `#14311C` | Shade  | Darkest — max-contrast text on tints              |
| `green-900` | `#0A190E` | Shade  | Deepest — near-black green for ink                |

> Canonical **Shades** (brand→deep): `#2E6F40, #296339, #245632, #1F4A2B, #1A3E24,
> #14311C, #0F2515, #0A190E`.
> Canonical **Tints** (brand→light): `#2E6F40, #39894F, #43A25E, #53B86F, #6CC284,
> #86CD9A, #A0D8AF, #BAE2C5`.

### Surface Wash Ramp — near-white mints

The canonical Tints are saturated greens (used above as light brand stops), so surface
washes are derived near-white mints anchored on `#CFFFDC` (from "Lush Forest"). See
`wash-50` → `wash-300` in the frontmatter; `wash-100 #ECF8F0` is the `surface-band`.

### Custom Palettes — illustration only (canonical)

Reserved for **hero illustration, gradients, empty-state art** — not functional UI.

**1. Lush Forest** — default illustration set (calm, natural).

| Swatch | Hex       | Note                       |
| ------ | --------- | -------------------------- |
| Base   | `#2E6F40` | Brand green                |
| Mint   | `#CFFFDC` | Light fill / highlight     |
| Leaf   | `#68BA7F` | Mid foliage                |
| Pine   | `#253D2C` | Deep shadow foliage        |

**2. Forest Berry** — warm-contrast accents (fruit, seasonal motifs).

| Swatch | Hex       | Note                       |
| ------ | --------- | -------------------------- |
| Base   | `#2E6F40` | Brand green                |
| Blush  | `#F0DAD5` | Soft warm fill             |
| Berry  | `#7D2459` | Deep magenta accent        |
| Rust   | `#9C5140` | Earthy terracotta          |

**3. Green Grotto** — vivid / aquatic accents (water, irrigation, cool motifs).

| Swatch | Hex       | Note                       |
| ------ | --------- | -------------------------- |
| Base   | `#2E6F40` | Brand green                |
| Lime   | `#54B84D` | Bright leaf highlight      |
| Teal   | `#147D6A` | Cool water / info accent   |
| Olive  | `#2F4D13` | Deep olive shadow          |

**Signature gradient (hero / brand mark):**
```css
background: linear-gradient(135deg, #1F4A2B 0%, #2E6F40 45%, #53B86F 100%);
```
**Fresh-mint variant (empty states / soft heroes):**
```css
background: linear-gradient(135deg, #2E6F40 0%, #68BA7F 55%, #CFFFDC 100%);
```

### Neutrals (cool, faintly green-tinted)

Not pure gray — a ~2–3% green cast so neutrals sit in the brand family. See `neutral-50`
→ `neutral-900` in the frontmatter. Key roles: `neutral-200` hairline borders, `neutral-700`
body text, `neutral-900` headings.

### Semantic status colors

Because the brand is green, **Success uses a brighter leaf green** distinct from the deep
forest primary — so a "healthy" chip never reads as a button. Danger stays unmistakably red.

| Role        | Surface   | Base      | Text      | Use                          |
| ----------- | --------- | --------- | --------- | ---------------------------- |
| **Success** | `#ECFDF3` | `#22A04C` | `#15803D` | Verified, healthy, organic   |
| **Warning** | `#FEF6E7` | `#E8A317` | `#B4740E` | Moderate severity, cautions  |
| **Danger**  | `#FEF2F2` | `#E5484D` | `#C62A2F` | Critical disease, destructive|
| **Info**    | `#E4F5F0` | `#147D6A` | `#0E5A4D` | Tips / AI notes (Grotto teal)|

Severity scale: `Low→Success` · `Moderate→Warning` · `High→#F2802A` · `Critical→Danger`.
Never rely on green-vs-green alone to separate brand from success — always pair with an
icon + label.

> **Consume semantic tokens** (`{colors.primary}`, `{colors.surface}`, `{colors.border}`,
> `{colors.ring}`) — never raw hexes in JSX.

---

## Typography

### Font stack

```css
--font-sans:    'Inter', 'Anek Telugu', system-ui, -apple-system, sans-serif;
--font-heading: 'Inter', system-ui, sans-serif;
```

| Family                   | Weights | Role                     | License      |
| ------------------------ | ------- | ------------------------ | ------------ |
| **Inter**                | 400–700 | UI + headings (Latin)    | SIL OFL 1.1  |
| **Anek Telugu**          | 100–800 | Telugu script            | SIL OFL 1.1  |
| **Noto Sans Devanagari** | 400–700 | Devanagari fallback      | SIL OFL 1.1  |

All three are Google Fonts under **SIL OFL 1.1** — free for commercial/web-embedded use,
already loaded in [index.html](index.html). (Note: `@fontsource-variable/geist` is a package
dependency but is **not** imported; the rendered brand font is **Inter**, not Geist.)

### Type scale

See the `typography` map in the frontmatter for canonical token values. Summary:

| Token          | Size / line-height | Weight | Color                    |
| -------------- | ------------------ | ------ | ------------------------ |
| `display`      | 3rem / 1.1         | 700    | `on-surface-heading`     |
| `headline-lg`  | 2.25rem / 1.15     | 700    | `on-surface-heading`     |
| `headline-md`  | 1.5rem / 1.2       | 600    | `on-surface-heading`     |
| `headline-sm`  | 1.25rem / 1.3      | 600    | `on-surface-heading`     |
| `title`        | 1.125rem / 1.35    | 600    | `on-surface`             |
| `body-lg`      | 1rem / 1.6         | 400    | `on-surface`             |
| `body-md`      | 0.875rem / 1.6     | 400    | `on-surface`             |
| `label-md`     | 0.8125rem / 1.4    | 600    | `on-surface`             |
| `caption`      | 0.75rem / 1.5      | 500    | `on-surface-tertiary`    |

Tracking: `-0.02em` (headings), `-0.04em` (display).
Telugu: bump line-height ~0.1 vs Latin; **never clamp heights**.

**Brand headline gradient (hero only):**
```css
.text-gradient-brand {
  background: linear-gradient(135deg,#1F4A2B 0%,#2E6F40 50%,#53B86F 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
```

---

## Layout & Spacing

| Context              | Max width          |
| -------------------- | ------------------ |
| Header/footer chrome | `max-w-7xl` (80rem)|
| Page content         | `max-w-4xl` (56rem)|
| Hero column          | `max-w-3xl` (48rem)|
| Section sub-heading  | `max-w-2xl` (42rem)|

- **Gutters:** `px-4 sm:px-6 lg:px-8` (16 → 24 → 32px) — matches `.page-container`.
- **Spacing scale:** Tailwind 4px base (see `spacing` tokens); card padding 1rem; section
  rhythm `pt-24 pb-20`; interior banner `py-8 sm:py-10 mb-6` (matches `.page-header-banner`).
- **Grid:** responsive card grids (`grid` utilities); full-viewport panels use
  `min-h-[100svh]`.
- **Section bands:** alternate white ↔ `surface-band #ECF8F0` for rhythm.

---

## Elevation & Depth

On white, shadows carry a faint **green** tint (never pure black) and stay soft; borders
do the structural work, shadow adds lift on hover/overlays.

```css
--shadow-xs:               0 1px 2px rgba(20,49,28,0.05);
--shadow-sm:               0 1px 3px rgba(20,49,28,0.07), 0 1px 2px rgba(20,49,28,0.04);
--shadow-card:             0 1px 2px rgba(20,49,28,0.04), 0 0 0 1px #E2E9E4;
--shadow-card-hover:       0 8px 24px rgba(41,99,57,0.10), 0 0 0 1px #BAE2C5;
--shadow-elevated:         0 12px 32px rgba(20,49,28,0.12);
--shadow-modal:            0 24px 48px rgba(18,24,19,0.18);
--shadow-btn-primary:      0 1px 2px rgba(31,74,43,0.24);
--shadow-btn-primary-hover:0 4px 12px rgba(46,111,64,0.28);
```

Resting cards use mostly a hairline; real drop shadows appear only on interaction, modals,
and dropdowns.

---

## Shapes

Rounded, soft corners echo the organic subject. See the `rounded` token scale.

| Token     | Value             | Applied to                     |
| --------- | ----------------- | ------------------------------ |
| `sm`/`md` | `0.625rem` (10px) | Buttons, inputs, small controls|
| `lg`      | `0.75rem` (12px)  | Cards, panels, popovers        |
| `full`    | `9999px`          | Badges, chips, pills, avatars  |

Icon backplates use `rounded-lg`→`rounded-xl`. Keep radii consistent within a component
family; never mix sharp and round corners on the same surface.

---

## Components

### Buttons

| Variant        | Rest                                       | Hover              |
| -------------- | ------------------------------------------ | ------------------ |
| **Primary**    | `bg #2E6F40 · text #FFF · shadow-btn`      | `bg #296339`       |
| **Secondary**  | `bg #BAE2C5 · text #14311C`                | `bg #A0D8AF`       |
| **Outline**    | `bg #FFF · border #CFD8D2 · text #363F39`  | `border #2E6F40`   |
| **Ghost**      | `transparent · text #4F5A53`               | `bg #EFF4F1`       |
| **Destructive**| `bg #FEF2F2 · text #C62A2F`                | `bg #FEE2E2`       |
| **Link**       | `text #2E6F40`, underline on hover        | `text #296339`     |

Height `sm 32 · md 40 · lg 48px` (lg for mobile CTAs). Radius `{rounded.md}` (10px).
Press `translateY(1px)`. Focus: `2px` ring `{colors.ring}` @45%, `2px` offset.

### Cards

```
bg #FFFFFF · border 1px #E2E9E4 · radius 12px · shadow-card
padding 1–1.5rem · hover → shadow-card-hover + border #BAE2C5 (interactive only)
Highlighted/AI card: bg #ECF8F0 · border #BAE2C5 · 3px left accent bar #2E6F40
```

### Inputs

```
bg #F7FAF8 · border 1px #CFD8D2 · radius 10px · h 44px · text #363F39
placeholder #9EAAA1 · focus → border #2E6F40 + ring rgba(46,111,64,.18)
error → border #E5484D + helper #C62A2F
Label 0.8125rem/600 #363F39. Dropdown menu on white, selected row bg #BAE2C5 text #14311C.
```

### Badges & chips

Pill radius, `0.75rem/600`. Category chip `bg #BAE2C5 text #14311C`; selected filter
`bg #2E6F40 text #FFF`; severity = semantic surface + text + status dot; verified/organic =
Success surface `#ECFDF3` + `#15803D` text + check icon.

### Navigation

- **Desktop header:** white, `border-bottom #E2E9E4`, blurs on scroll
  (`backdrop-blur` + `bg rgba(255,255,255,.8)`). Active link `text #2E6F40` + `2px` green
  underline. Language toggle segmented pill, active `bg #2E6F40 text #FFF`.
- **Mobile "magic" bottom nav:** bar `bg #FFF`, top hairline `#E2E9E4`,
  `drop-shadow(0 -4px 16px rgba(20,49,28,.06))`; floating pill behind active icon
  `bg #2E6F40`, icon `#FFF`; inactive icon `#9EAAA1`; keep the `1s cubic-bezier(.25,1,.5,1)`
  pill glide (currently `.mnav-pill` in [src/index.css](src/index.css)).

---

## Do's and Don'ts

**Do**
- Keep the **background pure white `#FFFFFF`**; use `#ECF8F0`/`#F7FAF8` washes for rhythm.
- Consume semantic tokens; never hard-code hexes in JSX.
- Use `#2E6F40` for primary action, brand, focus, **and** body links — it's AA on white.
- On tints/soft fills, use `#14311C`/`#1F4A2B` for text (never `#53B86F` on light).
- Keep green-tinted, soft shadows; let borders define structure.
- Differentiate **Success** (`#22A04C`) from brand green with icon + label.
- Test every component in English **and** Telugu; let text grow vertically.
- Reserve the custom palettes (Lush Forest / Forest Berry / Green Grotto) for
  illustration/gradients, not functional UI.

**Don't**
- Don't use `#53B86F` or lighter greens for text (only ~2.5:1 on white) — large/decorative only.
- Don't add pure-black or heavy drop shadows.
- Don't let green dominate every surface — neutrals carry the UI, green is the spice.
- Don't claim Geist as the brand font (unused dependency; it's Inter).
- Don't clamp heights that clip Telugu descenders.
- Don't signal state by green-vs-green alone — pair with icon + label.

---

## Responsive Behavior

- **Breakpoints:** Tailwind defaults — `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.
- **Nav swap:** desktop header `hidden md:block`; mobile "magic" bottom nav below `md`.
- **Gutters scale:** `px-4 → sm:px-6 → lg:px-8`.
- **Fluid hero type:** `text-[40px] md:text-7xl lg:text-[72px]`; stats `text-3xl sm:text-4xl`.
- **Viewport units:** hero/section panels use `min-h-[100svh]` (mobile-safe).
- **Touch:** bottom-nav bar ≈68px (`.mnav` height); all tap targets ≥44×44px.
- **Reduced motion:** honor `prefers-reduced-motion` — disable leaf drift, shimmer, pill
  glide. (No global guard in current source; add one when implementing.)

---

## Agent Prompt Guide

> Build RythuNetra in a **"Forest on White"** aesthetic. The canvas is **pure white
> `#FFFFFF`**; use faint mint washes (`#ECF8F0`, `#F7FAF8`) only for section rhythm and
> hover. Text: headings `#121813`, body `#363F39`, secondary `#4F5A53`. The single accent is
> **forest green `#2E6F40`** — used for primary buttons, active nav, the brand mark, focus
> rings, and text links (it clears AA on white at ~6.1:1, so one token covers action + link).
> Hover/pressed go darker: `#296339` then `#1F4A2B`. Never use `#53B86F` or lighter greens
> for small text. Consume semantic tokens (`{colors.primary}`, `{colors.surface}`,
> `{colors.border}`, `{colors.ring}`), never raw hex in components.
>
> Typography is **Inter** (Latin/UI) + **Anek Telugu** (Telugu), both Google Fonts (SIL OFL);
> the app is bilingual, so never clamp line heights. Do **not** use Geist. Scale: h1
> `2.25rem/700` (hero may fluidly reach 72px, tracking `-0.04em`); body `0.875rem/1.6`.
> Hero headline may use a `#1F4A2B→#2E6F40→#53B86F` `bg-clip-text` gradient.
>
> Controls: primary button `bg #2E6F40` / hover `#296339`, `rounded-lg` (10px), soft
> green-tinted shadow; inputs `bg #F7FAF8` `border #CFD8D2`, focus ring `#2E6F40`. Cards
> are white, `radius 12px`, an `#E2E9E4` hairline + soft `rgba(20,49,28,…)` shadow; on hover
> lift and shift the border to `#BAE2C5`. AI/highlighted content gets a `3px #2E6F40` left
> accent bar on an `#ECF8F0` fill. Real drop shadows appear only on modals/dropdowns.
>
> Because the brand is green, keep functional **Success** a brighter leaf green (`#22A04C`)
> and always pair state with an icon + label so "healthy" never reads as a button. Danger
> stays red (`#E5484D`), warning amber (`#E8A317`), info the Grotto teal (`#147D6A`).
>
> Layout: center content — `max-w-7xl` chrome / `max-w-4xl` content / `max-w-3xl` hero — with
> `px-4 sm:px-6 lg:px-8` gutters and Tailwind's 4px spacing scale. Desktop header is
> `hidden md:block`; a floating green "magic" bottom nav replaces it below `md`. Motion is
> subtle and fast (fade-in 0.25s, slide-up 0.3s, scale-in 0.2s). The custom palettes
> (Lush Forest / Forest Berry / Green Grotto) are for hero illustration/gradients only. Keep
> it restrained: white surfaces, green as the single spice, borders for structure, soft
> tinted shadows for lift.

---

## Migration Notes

The current codebase renders a **dark, indigo** theme (`--primary: #5E6AD2`, `--background:
#09090B`); adopting this target means:
- In [src/index.css](src/index.css): repoint the `:root` and `@theme inline` token values to
  the frontmatter (`--background: #FFFFFF`, `--primary: #2E6F40`, `--ring: #2E6F40`,
  `--card: #FFFFFF`, `--border: #E2E9E4`), set `body { background: #FFFFFF; color:
  var(--text-primary) }`, and drop default reliance on `@custom-variant dark`.
- Replace the pure-zinc neutrals (`--color-neutral-*`) with the green-tinted ramp and
  swap the black-based `--shadow-*` values for the green-tinted set (Elevation & Depth).
- Repoint the utility classes that hard-code dark values: `.glass`, `.section-heading`
  (`text-white`), `.page-header-banner` (`#111113`), `.text-gradient-primary`, `.text-shimmer`,
  and the `.mnav-*` colors (currently white-on-dark) per the Navigation component.
- In [index.html](index.html): change `<html lang="en" class="dark">` → `<html lang="en">` and
  `<meta name="theme-color" content="#09090B">` → `#2E6F40` (or white).
- Update [src/components/common/LogoMark.tsx](src/components/common/LogoMark.tsx): backplate
  `bg-[#27272A]` → brand gradient `linear-gradient(135deg,#1F4A2B,#2E6F40)` (or solid
  `#2E6F40`), keep the white `Sprout` glyph.
- The shadcn bridge in `@theme inline` already maps `--card/--primary/--border/--ring`; just
  repoint the source values — components need no structural change.
- Keep all existing radii/type/motion **structure**; only color values change.

---

*RythuNetra — "Know Your Crop. Heal It Naturally." 🌱  (Target design; canonical green palette.)*
