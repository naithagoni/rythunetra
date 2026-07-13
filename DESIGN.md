---
version: 1.0
name: RythuNetra — Fresh Harvest Light
description: >-
  Bilingual (English / Telugu) organic-agriculture advisory platform for
  Telangana farmers. A clean, daylight-first, LIGHT-ONLY interface built on
  neutral white surfaces with fresh green as the single brand accent and purple
  reserved for links. Crop imagery, disease scans, and educational content
  remain the visual focus.
theme:
  name: light
  color-scheme: light
  modes: light-only # NO dark mode. next-themes/ThemeToggle removed.
colors:
  # ── Base (surfaces + on-surface text) ──
  base-100: "oklch(100% 0 0)" # page & card background (pure white)
  base-200: "oklch(98% 0 0)" # subtle fill — muted/secondary/accent surfaces
  base-300: "oklch(95% 0 0)" # stronger fill — card footers, secondary hover
  base-content: "oklch(21% 0.006 285.885)" # primary text/icons
  muted-content: "oklch(45% 0.01 285.885)" # secondary/supporting text
  # ── Brand — green (the single action/brand accent) ──
  primary: "oklch(86.133% 0.141 139.549)"
  primary-content: "oklch(17.226% 0.028 139.549)"
  # ── Secondary — NEUTRAL surface (cancel/back buttons); NOT a color ──
  secondary: "oklch(98% 0 0)" # = base-200
  secondary-content: "oklch(21% 0.006 285.885)"
  # ── Accent — purple, RESERVED FOR LINKS ONLY ──
  accent: "oklch(74.229% 0.133 311.379)" # light purple fill (rarely used)
  accent-content: "oklch(14.845% 0.026 311.379)"
  link: "oklch(48% 0.2 311.379)" # darkened purple — legible link text on white
  # ── UI border/hover tokens (tuned for a pure-white canvas) ──
  border: "oklch(92% 0 0)" # structural borders/dividers (cards, header)
  input: "oklch(87% 0 0)" # form-field border — deeper so fields are findable
  hover-tint: "oklch(95.5% 0 0)" # menu-item / list-row hover (shadcn --accent)
  ring: "{colors.primary}" # focus ring = green
  # ── Status (fill / on-surface fg  +  content = text on filled bg) ──
  info: "oklch(86.078% 0.142 206.182)"
  info-content: "oklch(17.215% 0.028 206.182)"
  success: "oklch(76.662% 0.135 153.45)"
  success-content: "oklch(0% 0 0)"
  warning: "oklch(86.163% 0.142 94.818)"
  warning-content: "oklch(17.232% 0.028 94.818)"
  error: "oklch(78.66% 0.15 28.47)"
  error-content: "oklch(15.732% 0.03 28.47)"
radius:
  field: 0.5rem # 8px — buttons, inputs, selects, menu items (--radius)
  box: 1rem # 16px — cards, modals, dropdowns (rounded-xl = 2×radius)
  selector: 9999px # fully rounded — badges, pills, switches, avatars
sizing:
  input-height: 44px # h-11 — inputs, selects, search groups
  button-height: 40px # h-10 — default button
effects:
  border: 1px
  # Surfaces are FLAT (no shadow). Floating OVERLAYS lift with a soft shadow.
  surface-depth: 0 # cards, inputs, buttons — flat
  overlay-depth: 1 # dropdowns, selects, popovers, dialogs — soft shadow
  noise: 0
typography:
  # Font stack — Geist Sans (UI/headings), Anek Telugu (Telugu, always on
  # fallback), Geist Mono (eyebrows/labels/data). Icons: lucide-react.
  display:
    fontFamily: Geist Variable, Anek Telugu
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.06em
  headline-lg:
    fontFamily: Geist Variable, Anek Telugu
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Geist Variable, Anek Telugu
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.04em
  headline-sm:
    fontFamily: Geist Variable, Anek Telugu
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.02em
  title:
    fontFamily: Geist Variable, Anek Telugu
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.35
  body-lg:
    fontFamily: Geist Variable, Anek Telugu
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: Geist Variable, Anek Telugu
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Geist Variable, Anek Telugu
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: Geist Variable, Anek Telugu
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.4
  caption:
    fontFamily: Geist Mono Variable
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.5
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-content}"
    rounded: "{radius.field}"
    height: "{sizing.button-height}"
    hover: color-mix(in oklab, {colors.primary}, #000 7%)
  button-secondary: # cancel / back / photos / video — the neutral action
    backgroundColor: "{colors.secondary}" # base-200
    textColor: "{colors.secondary-content}"
    borderColor: "{colors.border}"
    rounded: "{radius.field}"
    hover: "{colors.base-300}" # darkens to base-300
  button-outline:
    backgroundColor: "{colors.base-100}" # pure white
    textColor: "{colors.base-content}"
    borderColor: "{colors.border}"
    rounded: "{radius.field}"
    hover: "{colors.base-200}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.base-content}"
    hover: "{colors.base-200}"
  button-destructive:
    backgroundColor: "{colors.error}"
    textColor: "{colors.error-content}"
    rounded: "{radius.field}"
    hover: color-mix(in oklab, {colors.error}, #000 7%)
  button-link: # inline text link
    textColor: "{colors.link}"
    decoration: underline-on-hover
  card:
    backgroundColor: "{colors.base-100}"
    textColor: "{colors.base-content}"
    borderColor: "{colors.border}"
    borderWidth: "{effects.border}"
    rounded: "{radius.box}"
    padding: 16px
    hover-interactive: borderColor → {colors.primary} # green border on hover
  card-footer:
    backgroundColor: "{colors.base-300}"
    borderTop: "{effects.border} {colors.border}"
  input: # inputs, textareas, select triggers, search groups
    backgroundColor: color-mix(in oklab, {colors.muted}, transparent 40%) # bg-muted/60
    textColor: "{colors.base-content}"
    borderColor: "{colors.input}"
    borderWidth: "{effects.border}"
    rounded: "{radius.field}"
    height: "{sizing.input-height}"
    hoverBorder: "{colors.base-content}" # gray-500-ish
    focus: # base-content (dark) border + soft neutral ring + white fill
      borderColor: "{colors.base-content}"
      backgroundColor: "{colors.base-100}"
      ring: 3px {colors.base-content} / 15%
  badge:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-content}"
    rounded: "{radius.selector}"
    typography: "{typography.caption}"
  overlay: # dropdowns, selects, popovers, dialogs
    backgroundColor: "{colors.base-100}"
    borderColor: "{colors.border}"
    rounded: "{radius.box}"
    shadow: soft neutral (overlay-depth: 1)
    itemHover: "{colors.hover-tint}"
---

# RythuNetra — Design System

> **Fresh Harvest Light** — the visual language for RythuNetra, a bilingual
> (English / Telugu) organic-agriculture advisory platform for Telangana farmers.
> A fresh **green** accent on a **pure white** canvas, with **purple** reserved
> for links. Light-only. Crop imagery and content are the heroes of every screen.
>
> **This file is the source of truth.** `src/index.css` implements these tokens.

---

## Overview

- **Mood:** Bright, calm, natural, approachable.
- **Audience:** Telangana farmers and advisors, often on mid-range Android phones
  in bright daylight. White is the dominant surface for maximum outdoor
  legibility; fresh green communicates growth, health, and positive action.
- **Light-only.** There is **no dark mode** — no theme toggle, no `.dark` styles,
  no `next-themes`. `color-scheme: light`.
- **Flat surfaces, elevated overlays.** On-page surfaces (cards, inputs, buttons)
  are flat — structure comes from 1px borders + the surface ramp. Only floating
  overlays (menus, dialogs) lift with a soft shadow. No texture/noise.
- **Green is a spice, not a sauce.** It signals action, focus, and brand;
  surfaces stay white. Never flood a screen with saturated green.
- **Purple is for links only.** Never as a general accent or fill.
- **Bilingual-first.** English (Geist) and Telugu (Anek Telugu) are equal — every
  string renders legibly in both scripts.

---

## Colors

A base (surface/text) ramp, one brand **primary** (green), a neutral
**secondary** surface, a purple **accent** used only for links, tuned border/hover
tokens, and four status colors. Fills pair with a `*-content` foreground for
accessible text. All values are **OKLCH**.

### Base — surfaces & text

| Token           | Value                      | Role                                      |
| --------------- | -------------------------- | ----------------------------------------- |
| `base-100`      | `oklch(100% 0 0)`          | Page & card background (pure white)       |
| `base-200`      | `oklch(98% 0 0)`           | Subtle fill — muted/secondary/accent surf |
| `base-300`      | `oklch(95% 0 0)`           | Stronger fill — card footers, hover       |
| `base-content`  | `oklch(21% 0.006 285.885)` | Primary text & icons                      |
| `muted-content` | `oklch(45% 0.01 285.885)`  | Secondary/supporting text                 |

### Brand, secondary & links

| Token             | Value                          | Role                                              |
| ----------------- | ------------------------------ | ------------------------------------------------- |
| `primary`         | `oklch(86.133% 0.141 139.549)` | **Green** — buttons, badges, checkboxes, radios, active nav, focus ring |
| `primary-content` | `oklch(17.226% 0.028 139.549)` | Text/icon **on** a green fill                     |
| `secondary`       | `oklch(98% 0 0)` (= base-200)  | **Neutral** surface for secondary/cancel buttons — NOT a color |
| `accent`          | `oklch(74.229% 0.133 311.379)` | Purple fill (rare; light-fill contrast rules apply) |
| `link`            | `oklch(48% 0.2 311.379)`       | **Purple, darkened** — link text on white (button `link`, InlineLink) |

> **Why two purples.** The `accent` fill is light and fails contrast as text on
> white; `link` is the same hue darkened to `48%` so link text is legible. Purple
> is **not** wired into the shadcn `--accent` token (that stays neutral) — routing
> it there would tint every menu/dropdown hover and break "green is a spice."

### Borders, hover & focus

| Token        | Value             | Role                                                   |
| ------------ | ----------------- | ------------------------------------------------------ |
| `border`     | `oklch(92% 0 0)`  | Structural borders/dividers (cards, header, overlays)  |
| `input`      | `oklch(87% 0 0)`  | Form-field border — deeper so inputs are findable      |
| `hover-tint` | `oklch(95.5% 0 0)`| Menu-item / list-row hover (shadcn `--accent`)         |
| `ring`       | = `primary`       | Focus ring (green)                                     |

### Status

Map domain concepts here — disease severity → `warning`/`error`, healthy →
`success`. Two usage modes:

- **Filled** (solid badge, alert bar) — status color is the fill; text uses the
  dark `*-content`.
- **On a plain surface** (colored text/icon/border, or a low-opacity tint like
  `bg-success/10`) — use the **status color itself** as the foreground.

| Status    | Color (fill / on-surface fg) | Content (text on fill)       |
| --------- | ---------------------------- | ---------------------------- |
| `info`    | `oklch(86.078% 0.142 206.2)` | `oklch(17.215% 0.028 206.2)` |
| `success` | `oklch(76.662% 0.135 153.5)` | `oklch(0% 0 0)`              |
| `warning` | `oklch(86.163% 0.142 94.8)`  | `oklch(17.232% 0.028 94.8)`  |
| `error`   | `oklch(78.66% 0.15 28.5)`    | `oklch(15.732% 0.03 28.5)`   |

Domain status classes live in `src/utils/statusColors.ts` (accent-scale chips:
`bg-{scale}-100 text-{scale}-900`). Written as complete literals (Tailwind JIT
can't see template concatenations).

---

## Typography

### Font stack

```css
--font-sans:    'Geist Variable', 'Anek Telugu', system-ui, -apple-system, sans-serif;
--font-heading: 'Geist Variable', system-ui, -apple-system, sans-serif;
--font-mono:    'Geist Mono Variable', ui-monospace, SFMono-Regular, Menlo, monospace;
```

| Family          | Weights | Role                                      | License     |
| --------------- | ------- | ----------------------------------------- | ----------- |
| **Geist Sans**  | 400–600 | UI + headings (Latin/numerals)            | SIL OFL 1.1 |
| **Anek Telugu** | 100–800 | Telugu script — first fallback, always on | SIL OFL 1.1 |
| **Geist Mono**  | 400–500 | Eyebrows, labels, data, footer headings   | SIL OFL 1.1 |

Anek Telugu sits **inside** `--font-sans` so any UI string renders correctly when
it contains Telugu. Headings cap at weight **600** (never 700+).

### Type scale

Letter-spacing tightens as size grows; line-height loosens for body copy.
CSS tokens keep their `--text-display-*` names in code.

| Role        | Token         | Size | Line | Weight | Tracking |
| ----------- | ------------- | ---- | ---- | ------ | -------- |
| Display     | `display-xl`  | 48px | 56px | 600    | -0.06em  |
| Headline lg | `display-lg`  | 32px | 40px | 600    | -0.04em  |
| Headline md | `display-md`  | 24px | 32px | 600    | -0.04em  |
| Headline sm | `display-sm`  | 20px | 26px | 600    | -0.02em  |
| Title       | `title`       | 18px | 24px | 600    | normal   |
| Body lg     | `body-lg`     | 18px | 28px | 400    | normal   |
| Body md     | `body-md`     | 16px | 24px | 400    | normal   |
| Body sm     | `body-sm`     | 14px | 20px | 400    | normal   |
| Label       | `label`       | 13px | 18px | 600    | normal   |
| Caption     | `caption`     | 12px | 16px | 500    | mono     |

---

## Layout & Spacing

Spacing follows a **4px base grid** — every gap, pad, margin is a multiple of 4.

| Step | Value | Typical use                                |
| ---- | ----- | ------------------------------------------ |
| `xs` | 4px   | Icon-to-label, tight inline gaps           |
| `sm` | 8px   | Chip padding, compact stacks               |
| `md` | 16px  | Default gutter, card padding, form-row gap |
| `lg` | 24px  | Section padding, card-to-card gap          |
| `xl` | 32px  | Between major page sections                |

Interior pages compose from a centered `PageContainer` + a left-aligned
`PageHeader`, with bodies built from bordered `Section` cards, restrained
`InfoCallout`s, and a search-left / actions-right `Toolbar`. One idea per section;
let whitespace, not rules, separate them. Marketing sections use tighter vertical
rhythm (`py-20 sm:py-24`) — avoid oversized dead space, and drop decorative
section numbering.

---

## Elevation & Depth

**Flat surfaces, elevated overlays.**

- **On-page surfaces** — cards, inputs, buttons — are **flat** (no shadow).
  Boundaries are a **1px `border`**; separation comes from the
  `base-100 → base-200 → base-300` ramp and whitespace. (`--shadow-card`,
  `--shadow-card-hover`, `--shadow-btn`, `--shadow-input` all resolve to `none`.)
- **Floating overlays** — dropdowns, selects, popovers, dialogs, sheets — **lift
  off the white page with a soft neutral shadow** (`--shadow-dropdown` /
  `--shadow-modal`) plus a `1px border`. A hairline alone reads poorly on white,
  so overlays get elevation; surfaces do not.
- **Interactive hover** is a **surface or border shift**, never a lift:
  - Cards/tiles → **green border** (`hover:border-primary`), optional faint
    `bg-primary/5` wash on the body.
  - Menu items / list rows → `hover-tint` (base-300) background.

---

## Shapes

Border width is a constant **1px**.

| Token      | Value          | Applies to                                     |
| ---------- | -------------- | ---------------------------------------------- |
| `box`      | 1rem (16px)    | Cards, modals, dropdowns, popovers — containers |
| `field`    | 0.5rem (8px)   | Buttons, inputs, selects, menu items — controls |
| `selector` | fully rounded  | Badges, pills, switches, avatars, nav pills     |

Keep radii consistent within a component group. `--radius` is `0.5rem`; cards use
`rounded-xl` (2×radius = 16px).

---

## Components

### Buttons

Default height **40px** (`h-10`); radius `field` (8px); 1px border where
applicable; flat (no shadow).

| Variant         | Rest                                     | Text              | Hover                    |
| --------------- | ---------------------------------------- | ----------------- | ------------------------ |
| **Primary**     | `primary` (green) fill                   | `primary-content` | fill − 7% black          |
| **Secondary**   | `base-200` fill · `border`               | `base-content`    | → `base-300`             |
| **Outline**     | `base-100` (white) fill · `border`       | `base-content`    | → `base-200`             |
| **Ghost**       | transparent                              | `base-content`    | → `base-200`             |
| **Destructive** | `error` fill                             | `error-content`   | fill − 7% black          |
| **Link**        | transparent                              | `link` (purple)   | underline                |

- **One primary (green) action per view.** Paired cancel/back/secondary actions
  use the **secondary** variant (neutral `base-200` chip) — Photos, Video, Cancel,
  Explore-Crops all share this. It must never out-shout the primary.
- **Primary/destructive hover** darkens the fill 7% black:
  `color-mix(in oklab, var(--fill), #000 7%)`.
- **Destructive** uses the light `error` fill with dark `error-content` (never
  white-on-light-red — it fails contrast).

### Cards & grids

`base-100` background, **1px `border`**, radius `box` (16px). Flat. Interactive
cards (crop tiles, admin stat tiles, feature cards) signal hover with a **green
border** (`hover:border-primary`), not a lift.

- **Grid card pattern** (Crops, Admin Dashboard, Landing features): a green
  **icon chip** (`bg-primary/15`) that fills solid green on hover (icon →
  `primary-content`), a reveal `ArrowUpRight` in green, and a **`base-300` footer**
  bar with a `border-t`. **Footers do NOT tint on hover** — keep grid behavior
  consistent everywhere (only the card border + body react).
- Don't double-pad (`Card` + `CardContent`).

### Inputs, selects & search

Height **44px** (`h-11`), radius `field` (8px). Findable, appealing wells:

- **Rest:** `bg-muted/60` fill + `input` border (base-300-deep).
- **Hover:** border darkens (`gray-500`).
- **Focus:** **`base-content`** (dark) border + white `base-100` fill + soft
  neutral ring (`ring-[3px] ring-foreground/15`). Form fields use a **neutral**
  focus — NOT the green primary — so focus reads as "editing," and green stays
  reserved for actions/brand.
- Applies uniformly to `Input`, `Textarea`, `SelectTrigger`, and `InputGroup`
  (search boxes). `InputGroupInput` is transparent so the group fill shows through.
- Select checkmark uses `primary` (green). Pair every field with a visible label.

### Focus ring

- **Non-form elements** (buttons, links, nav): a two-layer ring —
  `box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--ring)` (green).
- **Form controls** (`input`, `textarea`, `select`, `input-group-control`) are
  **excluded** from the global ring — they use their own **`base-content`
  (neutral)** border + soft `foreground/15` ring. (Applying both produced a
  doubled, wrong-radius ring on search boxes.)

### Overlays (menus, selects, popovers, dialogs)

`base-100` background, **1px `border`**, radius `box`, **soft shadow**
(`shadow-dropdown` / `shadow-modal`), inner padding. Items are `font-medium`,
`rounded-lg`, with a `hover-tint` (base-300) focus background so the highlighted
row is clearly visible on white. Destructive items = `error` text + `error/10`
hover.

### Badges & chips

Radius `selector` (fully rounded), `caption` type. Default = `primary` (green)
fill / `primary-content`. Status chips: **solid** (status fill + `*-content`) or
**tinted** (`bg-{status}/10` + status color as text). Keep to one or two words.

### Navigation

- **Desktop header** — a **single 64px row**: brand (left) · a **center pill-nav**
  (rounded-full `bg-muted/50` track) whose active item is a sliding **green pill**
  (`bg-primary` + `primary-content`, `motion` `layoutId="nav-pill"`) · actions
  (right: LanguageToggle + avatar dropdown / login). Frosted
  `backdrop-blur-xl` background. **No theme toggle** (light-only).
- **Avatar dropdown** — My Preparations (any logged-in user), Admin (admins,
  `link`/purple text), Settings, and a destructive **Logout**.
- **Mobile header** — top bar + hamburger → slide-in `Sheet` drawer. Logout in
  the drawer matches the desktop destructive item (ghost + `text-destructive` +
  `hover:bg-destructive/10`).

---

## Do's and Don'ts

**Do**

- Keep surfaces white; let crop/disease imagery be the color on screen.
- Use `primary` (green) for a **single** clear action per view.
- Reserve **purple** for **links** (`link` token) only.
- Draw structure with **1px borders** + whitespace; reserve shadow for overlays.
- Signal interactive cards with a **green border** on hover, not a lift.
- Pair every colored fill with its `*-content` foreground.
- Test every screen with Telugu strings (they run longer than English).

**Don't**

- Don't add a dark mode, theme toggle, or `.dark` styles — the app is light-only.
- Don't add drop shadows to on-page surfaces (cards/inputs/buttons stay flat).
- Don't use `primary`/`accent` light fills as text colors on white.
- Don't route purple into the shadcn `--accent` token (menu hovers stay neutral).
- Don't tint grid-card footers on hover — keep grids consistent.
- Don't flood a screen or panel with saturated green.
- Don't mix radii within one control group.

---

## Responsive Behavior

Mobile-first — the primary target is a mid-range Android phone in sunlight.

| Breakpoint    | Width    | Behavior                                         |
| ------------- | -------- | ------------------------------------------------ |
| Base (mobile) | < 640px  | Single column; drawer nav; full-width cards/CTAs |
| `sm`          | ≥ 640px  | Comfortable padding; 2-up card grids             |
| `md`          | ≥ 768px  | Multi-column forms; side-by-side EN/TE editors   |
| `lg`          | ≥ 1024px | Desktop header + pill-nav; 3–4-up grids          |
| `xl`          | ≥ 1280px | Container caps line length                       |

- Tap targets stay **≥ 44px**; primary CTAs go full-width on mobile.
- Respect `prefers-reduced-motion` — animations degrade to a fade or none.

---

## Implementation notes

- **Tokens:** `src/index.css` (`@theme` + `:root`). No `.dark` block.
- **Icons:** `lucide-react` (no second icon set).
- **Components:** shadcn/ui in `src/components/ui/`; layout primitives
  (`PageHeader`, `PageContainer`, `Section`, `Toolbar`, `InfoCallout`) in
  `src/components/common/`.
- **Fonts:** `@fontsource-variable/geist` + `geist-mono`; Anek Telugu for Telugu.
---



<!-- {
  name: "lofi";
  --color-base-100: oklch(100% 0 0);
  --color-base-200: oklch(98% 0 0);
  --color-base-300: oklch(95% 0 0);
  --color-base-content: oklch(21% 0.006 285.885);
  --color-primary: oklch(86.133% 0.141 139.549);
  --color-primary-content: oklch(17.226% 0.028 139.549);
  --color-secondary: oklch(98% 0 0);
  --color-secondary-content: oklch(21% 0.006 285.885);
  --color-accent: oklch(74.229% 0.133 311.379);
  --color-accent-content: oklch(14.845% 0.026 311.379);
  --color-neutral: oklch(86.133% 0.141 139.549);
  --color-neutral-content: oklch(17.226% 0.028 139.549);
  --color-info: oklch(86.078% 0.142 206.182);
  --color-info-content: oklch(17.215% 0.028 206.182);
  --color-success: oklch(76.662% 0.135 153.45);
  --color-success-content: oklch(0% 0 0);
  --color-warning: oklch(86.163% 0.142 94.818);
  --color-warning-content: oklch(17.232% 0.028 94.818);
  --color-error: oklch(78.66% 0.15 28.47);
  --color-error-content: oklch(15.732% 0.03 28.47);
  --radius-selector: 1rem;
  --radius-field: 0.5rem;
  --radius-box: 1rem;
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
  --depth: 0;
  --noise: 0;
} -->
