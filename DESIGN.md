---
version: alpha
name: RythuNetra — Amethyst on White
description: >-
  Bilingual (English / Telugu) organic-agriculture advisory platform for
  Telangana farmers. A vivid amethyst accent on a pure-white canvas keeps crop
  imagery, disease scans, and content the heroes of every screen. STATUS:
  TARGET / PROPOSED — the current codebase renders a dark indigo theme; see
  Migration Notes.
colors:
  # Brand ramp — Amethyst "Shades" (canonical)
  amethyst-100: "#E0B0FF"
  amethyst-200: "#CD80FF"
  amethyst-300: "#BA50FF"
  amethyst-400: "#A820FF"
  amethyst-500: "#9100EF"
  amethyst-600: "#7400C0"
  amethyst-700: "#570090"
  amethyst-800: "#3A0060"
  # Semantic roles (convention order: primary, secondary, tertiary, neutral, surface, on-surface, error)
  primary: "{colors.amethyst-500}"
  primary-hover: "{colors.amethyst-600}"
  primary-active: "{colors.amethyst-700}"
  secondary: "{colors.amethyst-100}"
  tertiary: "{colors.amethyst-300}"
  neutral: "#78717F"
  surface: "#FFFFFF"
  surface-subtle: "#FAF9FB"
  surface-band: "#F0DAFF"
  on-surface: "#3D3745"
  on-surface-heading: "#171320"
  on-surface-secondary: "#57505E"
  on-surface-tertiary: "#78717F"
  on-primary: "#FFFFFF"
  link: "#7400C0"
  border: "#E8E5EE"
  border-strong: "#D6D2DE"
  ring: "{colors.amethyst-400}"
  # Neutrals (cool, ~2-3% violet cast)
  neutral-50: "#FAF9FB"
  neutral-100: "#F4F2F7"
  neutral-200: "#E8E5EE"
  neutral-300: "#D6D2DE"
  neutral-400: "#A8A2B4"
  neutral-500: "#78717F"
  neutral-600: "#57505E"
  neutral-700: "#3D3745"
  neutral-800: "#292430"
  neutral-900: "#171320"
  # Semantic status
  success: "#16A34A"
  success-surface: "#ECFDF3"
  success-text: "#15803D"
  warning: "#E8A317"
  warning-surface: "#FEF6E7"
  warning-text: "#B4740E"
  error: "#E5484D"
  error-surface: "#FEF2F2"
  error-text: "#C62A2F"
  info: "{colors.amethyst-400}"
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
  lg: 0.875rem
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
    backgroundColor: "{colors.amethyst-500}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    typography: "{typography.label-md}"
    height: 40px
    padding: 16px
  button-primary-hover:
    backgroundColor: "{colors.amethyst-600}"
  button-secondary:
    backgroundColor: "{colors.amethyst-100}"
    textColor: "{colors.amethyst-700}"
    rounded: "{rounded.md}"
  button-secondary-hover:
    backgroundColor: "{colors.amethyst-200}"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
  button-outline-hover:
    textColor: "{colors.amethyst-400}"
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
    backgroundColor: "{colors.amethyst-100}"
    textColor: "{colors.amethyst-700}"
    rounded: "{rounded.full}"
    typography: "{typography.caption}"
  badge-selected:
    backgroundColor: "{colors.amethyst-500}"
    textColor: "{colors.on-primary}"
---

# RythuNetra — Design System

> **Amethyst on White** — the target visual language for RythuNetra, a bilingual
> (English / Telugu) organic-agriculture advisory platform for Telangana farmers.
> A vivid amethyst accent on a **pure white** canvas keeps crop imagery, disease scans,
> and content the heroes of every screen.
>
> **Status: TARGET / PROPOSED.** This document describes the design the app should adopt.
> The current codebase renders a dark, indigo theme; the Migration Notes list the steps.
> Every color below is taken from the approved amethyst palette — exact hexes are canonical.
> This file follows the [design.md](https://github.com/google-labs-code/design.md) format:
> the YAML frontmatter above is the normative token source; the prose below is rationale.

---

## Overview

- **Mood:** Bright, calm, high-clarity. A pure-white canvas with a confident amethyst
  accent — modern and trustworthy, optimized for outdoor phone use in sunlight.
- **Audience:** Telangana farmers and advisors, often on mid-range Android phones in bright
  daylight; legibility and large tap targets outrank decoration.
- **Accent discipline:** Amethyst is a **spice, not a sauce.** Purple signals action,
  focus, and brand; surfaces stay white or the faintest lavender wash.
- **Depth by light, not shadow.** On white, elevation reads through soft *amethyst-tinted*
  shadows and hairline borders — never heavy black drop-shadows.
- **Organic, not synthetic.** Rounded corners, gentle gradients, and a soft "petal" motif
  echo the natural subject without literal leaf clip-art.
- **Bilingual-first.** English (Inter) and Telugu (Anek Telugu) are equal citizens; Telugu
  runs ~15% taller, so heights must flex.

---

## Colors

### Brand Ramp — Amethyst "Shades" (canonical)

The core identity ramp. `{colors.amethyst-400}` (`#A820FF`) is the brand hue;
`{colors.amethyst-500}` (`#9100EF`) is the default action color.

| Token          | Hex       | Role                                              |
| -------------- | --------- | ------------------------------------------------- |
| `amethyst-100` | `#E0B0FF` | Soft fill — badges, chips, icon backplates        |
| `amethyst-200` | `#CD80FF` | Decorative / illustration accent                  |
| `amethyst-300` | `#BA50FF` | Gradient mid-stop, secondary highlight            |
| `amethyst-400` | `#A820FF` | **Brand hue** — logo, focus ring, large-text links|
| `amethyst-500` | `#9100EF` | **Primary action** — buttons, active nav          |
| `amethyst-600` | `#7400C0` | Primary hover / pressed; body-safe link color     |
| `amethyst-700` | `#570090` | Deep accent, text on light tints                  |
| `amethyst-800` | `#3A0060` | Darkest — max-contrast text on tints              |

### Tint Ramp — near-white lavenders (canonical)

Calm washes that keep the app feeling white while adding amethyst temperature. Canonical
values (lightest→deepest): `#F0DAFF, #EED4FF, #ECCEFF, #E9C8FF, #E7C2FF, #E5BCFF, #E2B6FF,
#E0B0FF`. The lightest, `#F0DAFF`, is the `surface-band`.

### Custom Palette — "Amethyst Petals" (canonical)

Reserved for **hero illustration, gradients, empty-state art** — not functional UI.

| Swatch  | Hex       | Note                     |
| ------- | --------- | ------------------------ |
| Petal 1 | `#E0B0FF` | Base lavender            |
| Petal 2 | `#B68BCC` | Muted mauve (shadow side)|
| Petal 3 | `#FFB0E0` | Warm rose accent         |
| Petal 4 | `#CC88B6` | Dusty rose               |
| Petal 5 | `#CC9EFF` | Violet mid               |
| Petal 6 | `#A380CC` | Deep mauve               |

**Signature gradient (hero / brand mark):**
```css
background: linear-gradient(135deg, #A820FF 0%, #BA50FF 45%, #FFB0E0 100%);
```

### Neutrals (cool, faintly amethyst-tinted)

Not pure gray — a ~2–3% violet cast so neutrals sit in the brand family. See `neutral-50`
→ `neutral-900` in the frontmatter. Key roles: `neutral-200` hairline borders, `neutral-700`
body text, `neutral-900` headings.

### Semantic status colors

| Role        | Surface   | Base      | Text      | Use                          |
| ----------- | --------- | --------- | --------- | ---------------------------- |
| **Success** | `#ECFDF3` | `#16A34A` | `#15803D` | Verified, healthy, organic   |
| **Warning** | `#FEF6E7` | `#E8A317` | `#B4740E` | Moderate severity, cautions  |
| **Danger**  | `#FEF2F2` | `#E5484D` | `#C62A2F` | Critical disease, destructive|
| **Info**    | `#F0DAFF` | `#A820FF` | `#7400C0` | Tips / AI notes (uses brand) |

Severity scale: `Low→Success` · `Moderate→Warning` · `High→#F2802A` · `Critical→Danger`.

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

All three are Google Fonts under **SIL OFL 1.1** — free for commercial/web-embedded use.
(Note: `@fontsource-variable/geist` is a package dependency but is **not** imported; the
rendered brand font is **Inter**, not Geist.)

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
  background: linear-gradient(135deg,#7400C0 0%,#A820FF 50%,#BA50FF 100%);
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

- **Gutters:** `px-4 sm:px-6 lg:px-8` (16 → 24 → 32px).
- **Spacing scale:** Tailwind 4px base (see `spacing` tokens); card padding 1rem; section
  rhythm `pt-24 pb-20`; interior banner `py-8 sm:py-10 mb-6`.
- **Grid:** responsive card grids (`grid` utilities); full-viewport panels use
  `min-h-[100svh]`.
- **Section bands:** alternate white ↔ `surface-band #F0DAFF` for rhythm.

---

## Elevation & Depth

On white, shadows carry a faint **amethyst** tint (never pure black) and stay soft; borders
do the structural work, shadow adds lift on hover/overlays.

```css
--shadow-xs:               0 1px 2px rgba(58,0,96,0.05);
--shadow-sm:               0 1px 3px rgba(58,0,96,0.07), 0 1px 2px rgba(58,0,96,0.04);
--shadow-card:             0 1px 2px rgba(58,0,96,0.04), 0 0 0 1px #E8E5EE;
--shadow-card-hover:       0 8px 24px rgba(116,0,192,0.10), 0 0 0 1px #E0B0FF;
--shadow-elevated:         0 12px 32px rgba(58,0,96,0.12);
--shadow-modal:            0 24px 48px rgba(23,19,32,0.18);
--shadow-btn-primary:      0 1px 2px rgba(87,0,144,0.24);
--shadow-btn-primary-hover:0 4px 12px rgba(145,0,239,0.28);
```

Resting cards use mostly a hairline; real drop shadows appear only on interaction, modals,
and dropdowns.

---

## Shapes

Rounded, soft corners echo the organic subject. See the `rounded` token scale.

| Token     | Value             | Applied to                     |
| --------- | ----------------- | ------------------------------ |
| `sm`/`md` | `0.625rem` (10px) | Buttons, inputs, small controls|
| `lg`      | `0.875rem` (14px) | Cards, panels, popovers        |
| `full`    | `9999px`          | Badges, chips, pills, avatars  |

Icon backplates use `rounded-lg`→`rounded-xl`. Keep radii consistent within a component
family; never mix sharp and round corners on the same surface.

---

## Components

### Buttons

| Variant       | Rest                                     | Hover              |
| ------------- | ---------------------------------------- | ------------------ |
| **Primary**   | `bg #9100EF · text #FFF · shadow-btn`    | `bg #7400C0`       |
| **Secondary** | `bg #E0B0FF · text #570090`              | `bg #CD80FF`       |
| **Outline**   | `bg #FFF · border #D6D2DE · text #3D3745`| `border #A820FF`   |
| **Ghost**     | `transparent · text #57505E`            | `bg #F4F2F7`       |
| **Destructive**| `bg #FEF2F2 · text #C62A2F`             | `bg #FEE2E2`       |
| **Link**      | `text #7400C0`, underline on hover      | —                  |

Height `sm 32 · md 40 · lg 48px` (lg for mobile CTAs). Radius `{rounded.md}` (10px).
Press `translateY(1px)`. Focus: `2px` ring `{colors.ring}` @45%, `2px` offset.

### Cards

```
bg #FFFFFF · border 1px #E8E5EE · radius 14px · shadow-card
padding 1–1.5rem · hover → shadow-card-hover + border #E0B0FF (interactive only)
Highlighted/AI card: bg #F0DAFF · border #E9C8FF · 3px left accent bar #A820FF
```

### Inputs

```
bg #FAF9FB · border 1px #D6D2DE · radius 10px · h 44px · text #3D3745
placeholder #A8A2B4 · focus → border #A820FF + ring rgba(168,32,255,.18)
error → border #E5484D + helper #C62A2F
Label 0.8125rem/600 #3D3745. Dropdown menu on white, selected row bg #E0B0FF text #570090.
```

### Badges & chips

Pill radius, `0.75rem/600`. Category chip `bg #E0B0FF text #570090`; selected filter
`bg #9100EF text #FFF`; severity = semantic surface + text + status dot; verified =
Success surface + check icon.

### Navigation

- **Desktop header:** white, `border-bottom #E8E5EE`, blurs on scroll
  (`backdrop-blur` + `bg rgba(255,255,255,.8)`). Active link `text #7400C0` + `2px` amethyst
  underline. Language toggle segmented pill, active `bg #9100EF text #FFF`.
- **Mobile "magic" bottom nav:** bar `bg #FFF`, top hairline `#E8E5EE`,
  `drop-shadow(0 -4px 16px rgba(58,0,96,.06))`; floating pill behind active icon
  `bg #9100EF`, icon `#FFF`; inactive icon `#A8A2B4`; keep the `1s cubic-bezier(.25,1,.5,1)`
  pill glide.

---

## Do's and Don'ts

**Do**
- Keep the **background pure white `#FFFFFF`**; use `#F0DAFF`/`#FAF9FB` washes for rhythm.
- Consume semantic tokens; never hard-code hexes in JSX.
- Use `#9100EF` for primary action, `#A820FF` for brand/focus, `#7400C0` for body links.
- On tints, use only `#570090`/`#3A0060` for text (never `#9100EF` on a tint).
- Keep amethyst-tinted, soft shadows; let borders define structure.
- Test every component in English **and** Telugu; let text grow vertically.
- Reserve "Amethyst Petals" for illustration/gradients, not functional UI.

**Don't**
- Don't use `#A820FF` for small body text (only ~4:1 on white) — accents/large text only.
- Don't add pure-black or heavy drop shadows.
- Don't let purple dominate — neutrals carry the UI, amethyst is the spice.
- Don't claim Geist as the brand font (unused dependency; it's Inter).
- Don't clamp heights that clip Telugu descenders.
- Don't signal state by color alone — pair with icon + label.

---

## Responsive Behavior

- **Breakpoints:** Tailwind defaults — `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.
- **Nav swap:** desktop header `hidden md:block`; mobile "magic" bottom nav below `md`.
- **Gutters scale:** `px-4 → sm:px-6 → lg:px-8`.
- **Fluid hero type:** `text-[40px] md:text-7xl lg:text-[72px]`; stats `text-3xl sm:text-4xl`.
- **Viewport units:** hero/section panels use `min-h-[100svh]` (mobile-safe).
- **Touch:** bottom-nav items full-height (≈68px bar); all tap targets ≥44×44px.
- **Reduced motion:** honor `prefers-reduced-motion` — disable petal drift, shimmer, pill
  glide. (No global guard in current source; add one when implementing.)

---

## Agent Prompt Guide

> Build RythuNetra in an **"Amethyst on White"** aesthetic. The canvas is **pure white
> `#FFFFFF`**; use faint lavender washes (`#F0DAFF`, `#FAF9FB`) only for section rhythm and
> hover. Text: headings `#171320`, body `#3D3745`, secondary `#57505E`. The single accent is
> **amethyst** — `#9100EF` for primary buttons/active nav, `#A820FF` for the brand mark and
> focus rings, `#7400C0` for text links (AA on white). Never use `#A820FF` for small body
> text. Consume semantic tokens (`{colors.primary}`, `{colors.surface}`, `{colors.border}`,
> `{colors.ring}`), never raw hex in components.
>
> Typography is **Inter** (Latin/UI) + **Anek Telugu** (Telugu), both Google Fonts (SIL OFL);
> the app is bilingual, so never clamp line heights. Do **not** use Geist. Scale: h1
> `2.25rem/700` (hero may fluidly reach 72px, tracking `-0.04em`); body `0.875rem/1.6`.
> Hero headline may use a `#7400C0→#A820FF→#BA50FF` `bg-clip-text` gradient.
>
> Controls: primary button `bg #9100EF` / hover `#7400C0`, `rounded-lg` (10px), soft
> amethyst-tinted shadow; inputs `bg #FAF9FB` `border #D6D2DE`, focus ring `#A820FF`. Cards
> are white, `radius 14px`, a `#E8E5EE` hairline + soft `rgba(58,0,96,…)` shadow; on hover
> lift and shift the border to `#E0B0FF`. AI/highlighted content gets a `3px #A820FF` left
> accent bar on a `#F0DAFF` fill. Real drop shadows appear only on modals/dropdowns.
>
> Layout: center content — `max-w-7xl` chrome / `max-w-4xl` content / `max-w-3xl` hero — with
> `px-4 sm:px-6 lg:px-8` gutters and Tailwind's 4px spacing scale. Desktop header is
> `hidden md:block`; a floating amethyst "magic" bottom nav replaces it below `md`. Motion is
> subtle and fast (fade-in 0.25s, slide-up 0.3s, scale-in 0.2s, ease `[0.16,1,0.3,1]`);
> "Amethyst Petals" (`#E0B0FF,#B68BCC,#FFB0E0,#CC88B6,#CC9EFF,#A380CC`) are for hero
> illustration/gradients only. Keep it restrained: white surfaces, amethyst as the single
> spice, borders for structure, soft tinted shadows for lift.

---

## Migration Notes

The current codebase renders a **dark, indigo** theme; adopting this target means:
- In [src/index.css](src/index.css): repoint `@theme` / `:root` token values to the
  frontmatter, set `body { background: #FFFFFF }`, and drop default reliance on
  `@custom-variant dark`.
- In [index.html](index.html): change `<html class="dark">` → `<html>` and
  `<meta name="theme-color">` `#09090B` → `#9100EF` (or white).
- The shadcn bridge in `@theme inline` already maps `--card/--primary/--border/--ring`; just
  repoint the source values — components need no structural change.
- Update [src/components/common/LogoMark.tsx](src/components/common/LogoMark.tsx): backplate
  → brand gradient `linear-gradient(135deg,#A820FF,#BA50FF)`, keep white `Sprout` glyph.
- Update [src/components/common/BottomNav.tsx](src/components/common/BottomNav.tsx) + `.mnav-*`
  colors in index.css per the Navigation component.
- Keep all existing radii/type/motion **structure**; only color values change.

---

*RythuNetra — "Know Your Crop. Heal It Naturally." 🌱  (Target design; canonical amethyst palette.)*
