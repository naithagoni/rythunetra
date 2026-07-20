# Rythunetra — Style Reference

> **SOURCE OF TRUTH.** This file (with `design/tailwind-v4.css` for the raw token export and `design/design-tokens.json`) is the authoritative design spec for RythuNetra. The app implements it through semantic tokens in `src/index.css` — the `## Tokens — Colors`, `### Shadows`, radii, and typography here reflect what actually ships. When design and code disagree, reconcile toward this file; when a token changes, update it here **and** in `src/index.css` together. Do not reintroduce superseded systems ("Fresh Harvest Light", pure-Geist ink/blue).

> botanist's specimen journal beside a developer's terminal — warm linen pages, sage ink annotations, and tracked mono tags.

**Theme:** light

Rythunetra is an orgnanic or natural farming journal: warm linen canvas, sage-green annotations, and a single literary serif headline anchoring the top of the page. Color is used sparingly and organically — dark forest ink carries body text and CTA fills, while muted sage, teal, and crimson appear as specimen-card backgrounds and category labels rather than as flat accent washes. The type system pairs a neo-grotesque workhorse (Akkurat) with a whisper-light editorial serif (Newsreader) and a tracked monospace (Fragment Mono) that acts as field-note tagging across badges, buttons, and inline labels. Surfaces are flat with hairline borders instead of shadows; photography appears as full-bleed landscape plates between content sections, turning the page into a sequence of specimen sheets rather than dashboard panels.

## Tokens — Colors

The system runs on a **Material-style semantic palette** (see `tailwind-v4.css` for the full token export). Colors are organized as: a **surface ladder**, **on-surface** text tones, semantic **roles** (each with a container + stroke), and a set of **aux-accent** families for status/data. The raw specimen hues underneath are kept as named tokens for decorative use.

### Surfaces (elevation ladder)

| Name             | Value     | Token                      | Role                                                             |
| ---------------- | --------- | -------------------------- | ---------------------------------------------------------------- |
| Surface Highest  | `#fdfefb` | `--color-surface-highest`  | Floating overlays — dropdowns, popovers, dialogs, toasts         |
| Surface High     | `#fafbf7` | `--color-surface-high`     | Raised layers just above the canvas                              |
| Surface Base     | `#f8f9f5` | `--color-surface-base`     | Page canvas (Linen) — default background                         |
| Surface Low      | `#f1f3ef` | `--color-surface-low`      | Cards, grid tiles, panels, wells, input fills                    |
| Surface Lowest   | `#e9ede9` | `--color-surface-lowest`   | Section bands, deeper fills, gentle card/grid hover              |
| Surface Contrast | `#e5e8e4` | `--color-surface-contrast` | Higher-contrast neutral fill                                     |
| Surface Inverse  | `#2a332a` | `--color-surface-inverse`  | Inverse band — footer, dark sections, modal scrim (Slate Hollow) |

### On-surface (text & icons)

| Name               | Value     | Token                        | Role                                               |
| ------------------ | --------- | ---------------------------- | -------------------------------------------------- |
| On Surface (base)  | `#2e4320` | `--color-on-surface-base`    | Body text on canvas/cards (deep sage-ink)          |
| On Surface Highest | `#2b390a` | `--color-on-surface-highest` | Text on the highest/overlay surfaces (Olive Press) |
| On Surface Inverse | `#fdfefb` | `--color-on-surface-inverse` | Text on the inverse (dark footer) surface (Linen)  |

> Each `on-surface-*` also has `-subtle` (70% α) and `-disabled` (40% α) variants for secondary and disabled copy. Muted body text uses **Sage Gray `#6b7860`** (`--color-sage-gray`).

### Semantic roles

| Role      | Fill / Token                     | On (content)           | Container           | Stroke            | Usage                                                                      |
| --------- | -------------------------------- | ---------------------- | ------------------- | ----------------- | -------------------------------------------------------------------------- |
| Primary   | `#4a6d47` `--color-primary`      | `#eef6dc` on-primary   | `#ddeabd` container | `#548f28` stroke  | Filled CTAs, active nav pill, checkboxes, focus ring, selected rows        |
| Secondary | `#2b6b5e` `--color-secondary`    | `#eff6f2` on-secondary | `#e3f2ea` container | `#0f9397` stroke  | Secondary category fills, tonal pairing                                    |
| Tertiary  | `#b14eaa` `--color-tertiary`     | `#feebfb` on-tertiary  | `#feebfb` container | `#d857cf` stroke  | **Links** (`--tertiary-link`) — Admin, View Scan History, InlineLink, etc. |
| Error     | `#c23934` `--color-aux-accent-2` | `#ffffff`              | `#feebeb` container | `#e9c3c1` outline | **Error messages, delete / remove / logout** (`--error` / `--destructive`) |

> **App role notes:** the link token maps to **Tertiary `#b14eaa`** (a distinct navigational hue — never the error red) and `--error`/`--destructive` map to **aux-accent-2 `#c23934`** (true danger red). The Material `error` token (`#991e4b`, Crimson) is not used as the app's error color.
>
> **Token names (2026-07-20 rename):** the custom link token is **`--tertiary-link`** (was `--link`; utilities `text-/bg-/border-tertiary-link`), the gentle row-hover token is **`--surface-hover`** (was `--muted-hover`), and the inverse/scrim token is **`--ink-slate`** (was `--slate-hollow`; `tailwind-v4.css` still exports the raw hue as `--color-slate-hollow`). The **shadcn semantic token names are unchanged** — `--primary`, `--foreground`, `--muted`, `--border`, `--destructive`, etc. are a fixed component contract (every `shadcn add` generates against them); restyle by changing their **values** in `src/index.css`, never their names.

### Aux-accent families (status / data-viz)

Ten families, each with a solid tone (`--color-aux-accent-N`), a soft `-container` fill, and an `-outline` border. Used by status chips (severity, effectiveness, remedy type) and charts.

| Family | Tone      | Container | Typical role                        |
| ------ | --------- | --------- | ----------------------------------- |
| 2      | `#c23934` | `#feebeb` | Error / critical (red)              |
| 4      | `#886a00` | `#f9f2d9` | Warning / moderate (amber)          |
| 6      | `#2d784d` | `#e4f7ea` | Success / high / organic (green)    |
| 7      | `#1a7474` | `#e8f5f5` | Info (teal)                         |
| 8      | `#3963b7` | `#e3f6ff` | Informational / biological (blue)   |
| 9      | `#7e42a6` | `#f0edff` | Chemical / tertiary status (purple) |

> Families 1, 3, 5, 10 (`#cf2184`, `#b54c1f`, `#4a6d47`, `#9c2fa6`) round out the set for additional categorical data.

### Borders & raw hues

| Name                                 | Value                                         | Token                    | Role                                                             |
| ------------------------------------ | --------------------------------------------- | ------------------------ | ---------------------------------------------------------------- |
| Outline                              | `#e1e6df`                                     | `--color-outline`        | Hairline borders, card outlines, separators (`--border`)         |
| Outline Strong                       | `#c4cbc2`                                     | `--color-outline-strong` | Form-field borders (`--input`) — more findable                   |
| Forest Ink                           | `#0a1d08`                                     | `--color-forest-ink`     | Brand mark (logo); deepest ink accent                            |
| Olive Press                          | `#2b390a`                                     | `--color-olive-press`    | High-contrast headings, outlined-button text                     |
| Sage Gray                            | `#6b7860`                                     | `--color-sage-gray`      | Secondary body text, supporting copy, icon strokes               |
| Sage Mist                            | `#a5ac9f`                                     | `--color-sage-mist`      | Muted helper text, footer labels, low-emphasis metadata          |
| Eucalyptus                           | `#c9d5c5`                                     | `--color-eucalyptus`     | Soft surface tint                                                |
| Lichen                               | `#c5ccb6`                                     | `--color-lichen`         | Outlined-button / dashed-upload border                           |
| Slate Hollow / Ink Slate             | `#2a332a`                                     | `--color-slate-hollow` (export) · `--ink-slate` (app) | Inverse surface for footer, dark bands, modal scrims |
| Blush / Sand / Sage Foam / Rose Clay | `#e3c9d0` · `#ad9d80` · `#729d92` · `#c27c93` | `--color-blush` …        | Decorative alt-card / specimen tints (available, sparingly used) |

## Tokens — Typography

### akkurat — Workhorse sans for body, nav, headings, buttons, cards across the entire system · `--font-akkurat`

- **Substitute:** Inter, IBM Plex Sans, Söhne
- **Weights:** 400, 500, 700
- **Sizes:** 9, 10, 11, 12, 13, 14, 15, 16, 18, 26, 30, 53
- **Line height:** 1.00–1.50
- **Letter spacing:** -0.04em at 53px, -0.02em at 30px, -0.015em at 16px, 0 at 18px body
- **OpenType features:** `"calt", "kern"`
- **Role:** Workhorse sans for body, nav, headings, buttons, cards across the entire system

### Newsreader — Single display-size serif headline — unexpected literary anchor against the utility sans · `--font-newsreader`

- **Substitute:** "Newsreader", "Cormorant Garamond", "EB Garamond"
- **Weights:** 300
- **Sizes:** 108
- **Line height:** 0.98
- **Letter spacing:** -0.032em
- **OpenType features:** `"calt", "kern"`
- **Role:** Single display-size serif headline — unexpected literary anchor against the utility sans

### Fragment Mono — Field-note tagging: badges, category labels, button text, code-lite metadata, tracked micro-copy · `--font-fragment-mono`

- **Substitute:** "Fragment Mono", "JetBrains Mono", "IBM Plex Mono"
- **Weights:** 400
- **Sizes:** 9, 10, 11
- **Line height:** 1.11–1.52
- **Letter spacing:** 0.01em at 9px, 0.02em at 11px, 0.04em at 10px
- **OpenType features:** `"calt", "kern"`
- **Role:** Field-note tagging: badges, category labels, button text, code-lite metadata, tracked micro-copy

> **Note (2026-07-20 cleanup):** the earlier auto-extracted duplicate mono tokens `--font-ui-monospace`, `--font-gt-america-mono`, and `--font-fragmentmono` were removed from `tailwind-v4.css` — all three duplicated `--font-fragment-mono`. Fragment Mono is the single mono family; `ui-monospace` etc. remain only as fallbacks inside its stack.

### Type Scale

| Role       | Size  | Line Height | Letter Spacing | Token               |
| ---------- | ----- | ----------- | -------------- | ------------------- |
| tag        | 11px  | 1.33        | 0.22px         | `--text-tag`        |
| caption    | 14px  | 1.29        | —              | `--text-caption`    |
| body-sm    | 16px  | 1.5         | -0.24px        | `--text-body-sm`    |
| subheading | 18px  | 1.44        | —              | `--text-subheading` |
| heading-sm | 26px  | 1           | -0.52px        | `--text-heading-sm` |
| heading    | 30px  | 1.16        | -0.6px         | `--text-heading`    |
| heading-lg | 53px  | 1.21        | -2.12px        | `--text-heading-lg` |
| display    | 108px | 0.98        | -3.46px        | `--text-display`    |

> The hero serif headline does **not** use the fixed 108px `display` token — it ships as a **fluid `clamp(3.25rem, 1.5rem + 6.5vw, 6.5rem)`** (52 → 104px) so it scales smoothly across phone→desktop instead of snapping at breakpoints. See "Hero Headline (Serif Anchor)".

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token          |
| ---- | ----- | -------------- |
| 4    | 4px   | `--spacing-4`  |
| 6    | 6px   | `--spacing-6`  |
| 8    | 8px   | `--spacing-8`  |
| 10   | 10px  | `--spacing-10` |
| 12   | 12px  | `--spacing-12` |
| 16   | 16px  | `--spacing-16` |
| 18   | 18px  | `--spacing-18` |
| 20   | 20px  | `--spacing-20` |
| 24   | 24px  | `--spacing-24` |
| 32   | 32px  | `--spacing-32` |
| 34   | 34px  | `--spacing-34` |
| 40   | 40px  | `--spacing-40` |
| 48   | 48px  | `--spacing-48` |
| 58   | 58px  | `--spacing-58` |
| 64   | 64px  | `--spacing-64` |
| 96   | 96px  | `--spacing-96` |

### Border Radius

| Element | Value  |
| ------- | ------ |
| tags    | 9999px |
| cards   | 10px   |
| small   | 1.5px  |
| inputs  | 4px    |
| buttons | 20px   |

### Shadows

Flat by design: **on-page surfaces (cards, inputs, buttons) have no drop shadow** — separation comes from the surface ladder + `outline` hairlines. Only **floating overlays** lift off the canvas, with soft warm-ink (`rgba(10,29,8,·)`) shadows so they read against Linen.

| Name     | Value                                                                    | Token               | Usage                                 |
| -------- | ------------------------------------------------------------------------ | ------------------- | ------------------------------------- |
| card     | `none`                                                                   | `--shadow-card`     | Cards, panels, inputs, buttons (flat) |
| elevated | `0 4px 12px -2px rgba(10,29,8,.06), 0 2px 6px -2px rgba(10,29,8,.05)`    | `--shadow-elevated` | Subtly raised elements                |
| dropdown | `0 8px 24px -6px rgba(10,29,8,.10), 0 4px 8px -4px rgba(10,29,8,.07)`    | `--shadow-dropdown` | Dropdowns, selects, popovers          |
| modal    | `0 20px 48px -12px rgba(10,29,8,.18), 0 8px 16px -8px rgba(10,29,8,.10)` | `--shadow-modal`    | Dialogs, sheets                       |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 20px
- **Element gap:** 6px

## Components

### Primary Pill CTA

**Role:** Filled dark-pill button for top-level conversion (Signin, header CTA)

Solid Forest Ink (#0a1d08) fill, Linen (#f8f9f5) text, 20px corner radius (effectively pill), horizontal padding 24px, vertical 12px. Akkurat 400/500 at 14–16px. Used in header and hero; appears at most once per viewport to preserve weight.

### Outlined Ghost Button

**Role:** Secondary action — Read Docs, Learn More, lower-emphasis navigation links

Transparent fill, 1px Lichen (#c5ccb6) border, Olive Press (#2b390a) text, 20px corner radius. Padding 12px 20px. Hover swaps border to Forest Ink (#0a1d08). Akkurat 400 at 14–16px.

### Transparent Nav Pill

**Role:** Header and section-level inline links (Docs, Pricing, Blog, footer links)

Fully transparent fill, no border, Forest Ink (#0a1d08) text, 9999px radius (pill), 12px horizontal padding. Akkurat 400–500 at 13–14px, uppercase optional via Fragment Mono variant.

### Category Tag (Field Note)

**Role:** Badge above headlines — 'THE SELF-IMPROVING AGENT', section labels, spec IDs

Sage-tinted fill (oklab green wash at 8% alpha over Linen) or transparent with hairline border. Fragment Mono at 11–12px, uppercase, 0.04em tracking. 9999px radius or 4px rectangle. Includes trailing arrow glyph in same color.

### Specimen Card

**Role:** Content container for feature blocks, variant comparisons, test-result panels

Bone (#eff2e2) or Eucalyptus (#c9d5c5) background, 10px radius, 1px Mist (#e1e6df) border, no shadow. Internal padding 20px. Alternates to decorative alt fills (Blush, Sand, Sage Foam, Rose Clay) for tonal variety.

### Code Block Panel

**Role:** Terminal-style trace display, code snippets, trace log views

Linen (#f8f9f5) or near-white background, hairline Mist border, monospace body (Fragment Mono) at 9–11px, line-height 1.5+. No shadow, no radius on outer container; inner rows separated by 1px dividers. Status markers use Crimson (#991e4b) outline.

### Trusted-By Logo Strip

**Role:** Social proof band of partner/company logos

Full-width Linen background, centered logo row, logos rendered in Olive Press (#2b390a) or Sage Gray (#6b7860). Above the row sits the label 'TRUSTED BY' in Fragment Mono 10–11px, uppercase, 0.04em tracking, Sage Mist color.

### Hero Headline (Serif Anchor)

**Role:** Opening headline on the page — 'Grow smarter with …'

Newsreader 300, Forest Ink / on-surface. Line-height 0.98, letter-spacing -0.032em. Unique among an otherwise sans-serif system — gives the page its editorial opening.

**Fluid sizing (as shipped):** the size is a single **`clamp(3.25rem, 1.5rem + 6.5vw, 6.5rem)`** — a 52px floor on the smallest phones scaling **continuously** with the viewport up to a 104px ceiling. Do **not** use stepped breakpoint sizes (`text-5xl sm:text-7xl lg:…`) here — they snap abruptly at 640/1024px; the clamp grows the headline smoothly so it never jumps. The rotating word is handled by `RotatingHeadline.tsx` (a fixed lead line + a dedicated word line so headline height stays constant as words cycle).

### Hero Backdrop (Network Globe)

**Role:** Ambient decorative backdrop behind the hero headline (`src/components/landing/HeroBackdrop.tsx` + `NetworkGlobe.tsx`).

A faint Mist grid, then an **animated 3D "network globe"** — ~150 points on a Fibonacci-lattice sphere connected by a short-edge mesh, slowly rotating on a tilted Y axis and perspective-projected with depth shading (near side brighter/larger, back hemisphere fades). Centred at 34% height and masked to fade out toward the edges. Above it: a two-layer pointer spotlight (neutral cursor glow + faint sage ambient wash) and a soft cursor-tracking dot, with a bottom gradient fading into the page.

- **Colours (token-driven):** nodes = Sage Mist (`#a5ac9f`), edges = Eucalyptus (`#c9d5c5`) — soft, on-theme, legible on the Linen canvas. Depth controls per-point alpha/size.
- **Fluid, eased sizing:** the radius fraction is **interpolated by width** — `0.78 × min(w,h)` on phones (~360px, so the globe stays prominent) easing down to `0.56 ×` on desktop (~1280px), no breakpoint jump. On viewport/orientation change the radius **eases** toward its new target (`radius += (target − radius) × 0.06` per frame) rather than snapping; the first paint snaps to the correct size.
- **Rotation direction (diagonal):** the spin is a Y-axis rotation given a fixed **screen-plane roll** so the equator travels on a diagonal, not horizontally. `roll` (in `NetworkGlobe.tsx`) is the single knob: `0°` = horizontal, `45°` = the shipped **11 o'clock → 4 o'clock** diagonal, `60°` = the steeper 11→5 diameter; flip its sign to mirror the diagonal, and reverse the `angle` increment in `loop()` to swap travel direction along it.
- **Canvas, no 3D library** (plain `<canvas>` + `requestAnimationFrame`); DPR-capped. Purely decorative (`aria-hidden`, pointer-events off).
- **Reduced motion:** renders a single static globe pose (no animation loop); the pointer spotlight falls back to a centred static glow.

### Section Headline (Akkurat)

**Role:** Mid-page section titles — 'Truly understand your agents', 'Evals that write themselves'

Akkurat 400 at 30–53px, Forest Ink (#0a1d08), tight tracking (-0.04em at 53px, -0.02em at 30px). Line-height 1.16–1.21. Always paired with a supporting body paragraph in 18px Akkurat 400, Sage Gray (#6b7860).

### Custom Logo creation

#### 1. The Core Letters & Frame

- **The Letters:** The logo must focus strictly on the uppercase letters **"A"** and **"N"**.
- **The Frame:** A clean, professional **outer circle** that houses everything.

#### 2. The Central Divider

- **The Pipe (`|`):** A single vertical line positioned precisely in the center of the circle, creating a clear division: **`A | N`**.

#### 3. The Custom Geometric Integration (The Curve)

- **Left Side ("A"):** The outer/left diagonal leg of the **"A"** must bend or curve (do not stretch) smoothly following the curved inner boundary of the circle's left side.
- **Right Side ("N"):** the rightmost leg of the **"N"** must bend or curve (do not stretch) smoothly mirroring the circular boundary on the right side.

#### 4. The Background

- **Transparency:** Absolutely no solid colors, checkerboard mockups, or textures in the background. The logo must be isolated on a **transparent background** for easy use across different mediums.

#### 5. As shipped (`src/components/common/LogoMark.tsx`)

- **Single circle** frame; purely stroked, no fill plate. Color follows the surface via the `variant` prop — Forest Ink `#0a1d08` on light, Linen `#f8f9f5` on dark bands.
- **Weights (48×48 viewBox):** ring `2.4`, pipe `2.6`, letters `3` — a bold, solid mark with round caps/joins.
- **Tall pipe** spanning `y 9 → 39` (nearly the full height), centred at `x 24`, with **even breathing room** on each side so the letters never crowd it.
- **Balanced letters:** the "A" outer/left leg and the "N" outer/right leg curve symmetrically to echo the ring while staying **inset from it (~5px)** — neither leg touches the circle.
- Favicon `public/rythunetra.svg` mirrors the mark as a filled Forest-Ink disc with Linen strokes (filled disc reads better at tab size).
- **Usage:** shown **without the "RythuNetra" wordmark** in chrome (Header, MobileHeader top bar + drawer, Footer); brand links carry an `aria-label`. Login/Register show the mark centred above the form.

### Floating Navigation Bar (desktop)

**Role:** Top-of-page brand and link bar (`Header.tsx`, `md:` and up)

Brand pinned left, a centered nav **pill group** (transparent fill + 1px border, `rounded-xl`, `backdrop-blur`) floating over the hero backdrop, and actions pinned right. The active nav item is a **Sage Leaf pill** that physically **slides** between links via a shared `layoutId="nav-pill"` (motion/react spring) rather than cross-fading. 56–64px tall, never shadows, never elevates — it just sits. Right side: Language toggle + either the **account avatar dropdown** (signed in) or a Login pill (signed out).

### Mobile Bottom Tab Bar

**Role:** Primary mobile navigation (`MobileHeader.tsx`, below `md:`) — replaces a hamburger/sidebar.

A **floating pill bar** docked to the bottom edge (`rounded-full`, 1px border, `bg-popover/90`, `backdrop-blur-xl`, `--shadow-elevated`, honouring `env(safe-area-inset-bottom)`). Holds three thumb-priority tabs — **Home · Crops · Diseases** — plus a **More** trigger. The top strip is kept minimal: just the logo + language toggle (+ a Login pill when signed out).

- **Expanding-pill tabs:** inactive tabs are **icon-only** (Sage Gray); the active tab expands into a **Sage Leaf pill** revealing its label. A single shared `layoutId="mobile-tab-pill"` makes the pill **slide** between tabs on navigation (spring, matching the desktop nav pill). **Invariant: only one tab may be `active` at a time** — the shared pill can only live in one place, so a second claimant would strip the real tab's background and leave its light label unreadable.
- **More trigger:** opening the menu must **not** steal the pill. `active` is driven by the route only; while the menu is open, More gets a **separate, non-pill highlight** (`bg-muted` + readable foreground), not the shared pill.
- Content clearance: page footer adds `pb-24 md:pb-0`, and the chat FAB sits at `bottom-24 md:bottom-6`, so nothing hides behind the floating bar.

### Account / More Panel

**Role:** The overflow + account menu — desktop avatar dropdown and mobile "More" both render the **same** component (`ui/dropdown-menu.tsx`).

Built from the real `DropdownMenu*` primitives (not a copied Sheet), so the two match by construction: `--popover` surface, `rounded-xl`, 1px `--border`, `--shadow-dropdown`, `p-1.5`. Structure: an **Account label** (Fragment Mono `11px` uppercase eyebrow + name/email) → separator → grouped items (Recommend, My Preparations, Settings, and **Admin in Tertiary `#b14eaa`**) → separator → **destructive Logout**. Items are `rounded-lg px-2 py-2`, `size-4` leading icons, hover/focus tint `--accent` (`#ddeabd`). Settings + Admin are auth-gated (signed-in / admin only). On mobile the panel anchors above the bar (`side="top"`).

> **No focus ring on the panel itself.** The global `*:focus-visible` ring (see below) is excluded for `[data-slot='dropdown-menu-content']`, `[data-slot='popover-content']`, and `[data-slot='dropdown-menu-item']` — Radix focuses the panel on open, and the ring would otherwise draw an unwanted border around the whole menu. Rows show selection via their `--accent` tint, not a ring.

### Focus Ring (global)

A **two-layer focus-visible ring** (`*:focus-visible`): a 2px `--background` gap then a 2px `--ring` (Grass Green `#548f28`) accent, at `--radius-btn` (20px). Applied to buttons, links, tabs, and other interactive elements. **Excluded:** form fields (`input`, `textarea`, `select`, InputGroup control — they own a border+ring treatment) and floating menu/popover **content** + menu items (see Account/More Panel above).

### Nav Header

**Role:** Top-of-page brand and link bar

Linen background, brand wordmark left, link cluster (Docs, Pricing, Blog) in Akkurat 500/700 at 13–14px uppercase-tracked, Primary Pill CTA on the far right. 64px tall, hairline Mist bottom border.

### Avatar Stack

**Role:** Small group of headshots used as social proof or team accents

Circular 40px avatars with 1px Fog Border ring, overlapping 8–12px, arranged loosely around section openers. No labels.

### Landscape Plate Divider

**Role:** Full-bleed photographic breaks between content sections

Full-width photograph with no border, no radius, subtle warm color treatment (lavender/peach grading on natural scenery). Acts as a visual exhale between specimen-card sections.

### Footer Band

**Role:** Closing conversion and link cluster

Slate Hollow (#2a332a) dark inverse background, Linen text, large headline (Akkurat 400 at 30–53px), Primary Pill CTA. Link list in Akkurat 400 at 14px, Sage Mist (#a5ac9f) for separators.

### Input Field

**Role:** Form input for search, email capture, trace filtering

Transparent fill, no visible border by default, Olive Press (#2b390a) text. Underline-only or hairline Mist (#e1e6df) border on focus. Fragment Mono at 11–13px for query-style inputs, Akkurat for prose inputs.

### Pill Tab / Segment

**Role:** Filter tabs and segmented controls inside product UI

Transparent fill pill (9999px radius), Forest Ink text, subtle Sage Mist wash on active state. Fragment Mono 11px tracked or Akkurat 13px. 12px vertical, 16px horizontal padding.

## Do's and Don'ts

### Do

- Use the 108px Newsreader 300 serif for the single opening headline on any page; do not repeat it for subheadings.
- Use Akkurat 400 at 18px for body copy with line-height 1.44 — this is the workhorse rhythm.
- Set filled CTA buttons to Forest Ink (#0a1d08) with Linen text and 20px radius; never use a chromatic green or blue for primary action fills.
- Use Fragment Mono 10–11px with 0.04em tracking for category badges, spec IDs, and field-note labels — always uppercase.
- Separate content sections with full-bleed landscape photography instead of dividers or background-color shifts.
- Stack surfaces via 1px Mist (#e1e6df) borders and tonal fills (Linen → Bone → Eucalyptus); avoid drop shadows.
- Maintain a 6px element gap and 96px section gap as the spatial rhythm across all pages.

### Don't

- Do not pair the serif display font with sans-serif headings — Akkurat at 30–53px owns all non-display headlines.
- Do not introduce bright chromatic CTAs (blue, red, vivid green) — the action palette stays in Forest Ink and Olive Press.
- Do not add drop shadows to cards or modals; rely on borders and surface tints for separation.
- Do not use icons or illustrations to fill empty space — the layout is intentionally sparse and specimen-like.
- Do not mix the Fragment Mono labels into running body copy — keep mono reserved for badges, IDs, and metadata.
- Do not place content into multi-column dashboard grids; sections are wide, centered, and stacked.
- Do not break the 96px vertical rhythm between major sections — Rythunetra reads as printed pages, not cards.

## Surfaces

| Level | Name         | Value     | Purpose                                           |
| ----- | ------------ | --------- | ------------------------------------------------- |
| 0     | Linen        | `#f8f9f5` | Page canvas and primary background                |
| 1     | Bone         | `#eff2e8` | First elevation — cards and panels                |
| 2     | Eucalyptus   | `#c9d5c5` | Mid-elevation — tags, spec cards, hover wash      |
| 3     | Sage Leaf    | `#4a6d47` | Tinted surface — featured blocks, decorative wash |
| 4     | Slate Hollow | `#2a332a` | Inverse surface — footer, dark bands, modal scrim |

## Elevation

Rythunetra avoids drop shadows almost entirely. Elevation is conveyed through surface layering (Linen → Bone → Eucalyptus → Sage tints) and 1px Mist borders. The two shadows detected are functional 1px outlines (Crimson ring for error cells, subtle green focus ring) rather than cosmetic elevation. This keeps the system flat, printed, and specimen-like — like pages in a field notebook rather than floating material cards.

## Imagery

Photography is a deliberate structural element: full-bleed landscape plates (lavender-pink toned mountains, misty forests, alpine ridges) serve as visual exhales between text-and-card sections. No lifestyle, no product shots, no UI mockups inside the page — the landscape imagery itself IS the visual punctuation. Imagery is high-key, desaturated, warm-toned, and slightly hazy, reinforcing the naturalist-journal mood. Icons are minimal, stroked, 1px weight, Sage Gray (#6b7860) — they annotate rather than decorate. Content sections avoid 3D, illustration, and abstract gradients. The one sanctioned exception is the **hero backdrop's animated network globe** (see "Hero Backdrop") — a subtle, low-contrast, token-coloured ambient element behind the opening headline, not content imagery.

## Layout

Page reads as a vertical sequence of wide, centered bands. The hero is a two-column split: left column holds the serif display headline + supporting copy + dual CTAs (filled pill + outlined ghost), right column holds the terminal/trace visual. Below the hero sits a centered 'TRUSTED BY' logo strip. Content sections alternate between text-left + specimen-card-right patterns and full-bleed landscape photographs. The page is max-width 1200px centered with generous outer padding (--grid-margin: 48px), but sections that carry photography break out to full-bleed. Vertical rhythm is spacious — 96px between major sections, 6px between inline elements, creating a printed-page cadence rather than a dense dashboard. Navigation is a single thin header bar (64px) with the brand wordmark left, text links center-right, and a filled pill CTA far-right.

## Agent Prompt Guide

Quick Color Reference (updated — semantic palette in tailwind-v4.css)

- page background: #f8f9f5 (surface-base / Linen)
- card surface: #f1f3ef (surface-low)
- border / hairline: #e1e6df (outline)
- primary text: #2e4320 (on-surface-base)
- muted text: #6b7860 (Sage Gray)
- primary action: #4a6d47 (primary — Sage Leaf) on #eef6dc (on-primary)

Example Component Prompts

1. Create a Primary Action Button: #4a6d47 (primary/Sage Leaf) background, #eef6dc (on-primary) text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Specimen card: surface-low (#f1f3ef) background, 10px radius, 1px outline (#e1e6df) border, 20px padding. Section headline in Akkurat 400, 30px, on-surface (#2e4320), letter-spacing -0.6px. Body in Akkurat 400, 18px, Sage Gray. No drop shadow.

3. Trace/log panel: Linen (#f8f9f5) background, hairline Mist border, Fragment Mono 10px at 0.04em tracking for line content, 1px dividers between rows. Status markers as Crimson (#991e4b) 1px rings.

4. Category badge: transparent fill, Fragment Mono 11px uppercase at 0.04em tracking, Olive Press (#2b390a) text, 4px radius or 9999px pill, trailing arrow glyph in the same color.

## Similar Brands

- **Linear** — Same monochrome-with-muted-accent calm, generous whitespace, and a single editorial display moment anchoring the hero.
- **Resend** — Warm off-white canvas with tracked mono category tags and compact 6px spacing rhythm — both feel like printed spec sheets rather than SaaS dashboards.
- **Posthog** — Sage/olive-leaning neutrals with a serif display accent and specimen-card content containers rather than conventional product UI.
- **Pitch** — Editorial pacing — large type, generous vertical rhythm, and landscape photography used as section dividers instead of UI chrome.

## Quick Start

### CSS Custom Properties

```css
:root {
    /* Colors */
    --color-forest-ink: #0a1d08;
    --color-olive-press: #2b390a;
    --color-sage-leaf: #4a6d47;
    --color-deep-teal: #2b6b5e;
    --color-crimson-specimen: #991e4b;
    --color-amber-pin: #80581c;
    --color-linen: #f8f9f5;
    --color-bone: #eff2e8;
    --color-mist: #e1e6df;
    --color-slate-hollow: #2a332a;
    --color-sage-gray: #6b7860;
    --color-sage-mist: #a5ac9f;
    --color-eucalyptus: #c9d5c5;
    --color-lichen: #c5ccb6;
    --color-blush: #e3c9d0;
    --color-sand: #ad9d80;
    --color-sage-foam: #729d92;
    --color-rose-clay: #c27c93;
    --color-surface-glow: #fdfefb;
    --color-surface-highest: #fdfefb;
    --color-surface-high: #fafbf7;
    --color-surface-base: #f8f9f5;
    --color-surface-low: #f1f3ef;
    --color-surface-lowest: #e9ede9;
    --color-surface-contrast: #e5e8e4;
    --color-surface-inverse: #2a332a;
    --color-surface-highest-transparent: #fdfefb00;
    --color-surface-high-transparent: #fafbf700;
    --color-surface-base-transparent: #f8f9f500;
    --color-surface-low-transparent: #f1f3ef00;
    --color-surface-lowest-transparent: #e9ede900;
    --color-surface-inverse-transparent: #2a332a00;
    --color-on-surface-highest: #2b390a;
    --color-on-surface-highest-subtle: #2b390ab3;
    --color-on-surface-highest-disabled: #2b390a66;
    --color-on-surface-contrast: #2e4320;
    --color-on-surface-high: #2f3f1b;
    --color-on-surface-high-subtle: #2f3f1bb3;
    --color-on-surface-high-disabled: #2f3f1b66;
    --color-on-surface-base: #2e4320;
    --color-on-surface-base-subtle: #2e4320b3;
    --color-on-surface-base-disabled: #2e432066;
    --color-on-surface-low: #243b1b;
    --color-on-surface-low-subtle: #243b1bb3;
    --color-on-surface-low-disabled: #243b1b66;
    --color-on-surface-lowest: #123b0e;
    --color-on-surface-lowest-subtle: #123b0eb3;
    --color-on-surface-lowest-disabled: #123b0e66;
    --color-on-surface-inverse: #fdfefb;
    --color-on-surface-inverse-subtle: #fdfefbb3;
    --color-on-surface-inverse-disabled: #fdfefb66;
    --color-surface-tint-mild: #344f3108;
    --color-surface-tint-base: #344f3112;
    --color-surface-tint-strong: #33503024;
    --color-primary: #4a6d47;
    --color-on-primary: #eef6dc;
    --color-primary-container: #ddeabd;
    --color-on-primary-container: #4a6d47;
    --color-primary-stroke: #548f28;
    --color-secondary: #2b6b5e;
    --color-on-secondary: #eff6f2;
    --color-secondary-container: #e3f2ea;
    --color-on-secondary-container: #234b43;
    --color-secondary-stroke: #0f9397;
    --color-tertiary: #b14eaa;
    --color-on-tertiary: #feebfb;
    --color-tertiary-container: #feebfb;
    --color-on-tertiary-container: #b14eaa;
    --color-tertiary-stroke: #d857cf;
    --color-error: #991e4b;
    --color-on-error: #fcf0f3;
    --color-error-container: #fbd8e5;
    --color-on-error-container: #92174a;
    --color-error-stroke: #d41665;
    --color-outline: #e1e6df;
    --color-outline-strong: #c4cbc2;
    --color-aux-accent-1: #cf2184;
    --color-aux-accent-1-outline: #ebabcf;
    --color-aux-accent-1-container: #feebf1;
    --color-aux-accent-2: #c23934;
    --color-aux-accent-2-outline: #e9c3c1;
    --color-aux-accent-2-container: #feebeb;
    --color-aux-accent-3: #b54c1f;
    --color-aux-accent-3-outline: #f1c8b6;
    --color-aux-accent-3-container: #fff0e5;
    --color-aux-accent-4: #886a00;
    --color-aux-accent-4-outline: #ebd587;
    --color-aux-accent-4-container: #f9f2d9;
    --color-aux-accent-5: #4a6d47;
    --color-aux-accent-5-outline: #bed0bd;
    --color-aux-accent-5-container: #f0f5df;
    --color-aux-accent-6: #2d784d;
    --color-aux-accent-6-outline: #b9d3c4;
    --color-aux-accent-6-container: #e4f7ea;
    --color-aux-accent-7: #1a7474;
    --color-aux-accent-7-outline: #bed7d7;
    --color-aux-accent-7-container: #e8f5f5;
    --color-aux-accent-8: #3963b7;
    --color-aux-accent-8-outline: #c2d8ec;
    --color-aux-accent-8-container: #e3f6ff;
    --color-aux-accent-9: #7e42a6;
    --color-aux-accent-9-outline: #dbcbe6;
    --color-aux-accent-9-container: #f0edff;
    --color-aux-accent-10: #9c2fa6;
    --color-aux-accent-10-outline: #efd7f1;
    --color-aux-accent-10-container: #ffebff;

    /* Typography — Font Families */
    --font-akkurat:
        'akkurat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        'Segoe UI', Roboto, sans-serif;
    --font-newsreader:
        'Newsreader', ui-sans-serif, system-ui, -apple-system,
        BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-fragment-mono:
        'Fragment Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
        monospace;

    /* Typography — Scale */
    --text-tag: 11px;
    --leading-tag: 1.33;
    --tracking-tag: 0.22px;
    --text-caption: 14px;
    --leading-caption: 1.29;
    --text-body-sm: 16px;
    --leading-body-sm: 1.5;
    --tracking-body-sm: -0.24px;
    --text-subheading: 18px;
    --leading-subheading: 1.44;
    --text-heading-sm: 26px;
    --leading-heading-sm: 1;
    --tracking-heading-sm: -0.52px;
    --text-heading: 30px;
    --leading-heading: 1.16;
    --tracking-heading: -0.6px;
    --text-heading-lg: 53px;
    --leading-heading-lg: 1.21;
    --tracking-heading-lg: -2.12px;
    --text-display: 108px;
    --leading-display: 0.98;
    --tracking-display: -3.46px;

    /* Typography — Weights */
    --font-weight-light: 300;
    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;

    /* Spacing */
    --spacing-4: 4px;
    --spacing-6: 6px;
    --spacing-8: 8px;
    --spacing-10: 10px;
    --spacing-12: 12px;
    --spacing-16: 16px;
    --spacing-18: 18px;
    --spacing-20: 20px;
    --spacing-24: 24px;
    --spacing-32: 32px;
    --spacing-34: 34px;
    --spacing-40: 40px;
    --spacing-48: 48px;
    --spacing-58: 58px;
    --spacing-64: 64px;
    --spacing-96: 96px;

    /* Layout */
    --page-max-width: 1200px;
    --section-gap: 96px;
    --card-padding: 20px;
    --element-gap: 6px;

    /* Border Radius */
    --radius-sm: 1.5px;
    --radius-md: 4px;
    --radius-lg: 10px;
    --radius-2xl: 20px;

    /* Named Radii */
    --radius-tags: 9999px;
    --radius-cards: 10px;
    --radius-small: 1.5px;
    --radius-inputs: 4px;
    --radius-buttons: 20px;

    /* Shadows */
    --shadow-subtle: rgb(153, 30, 75) 0px 0px 0px 1px;
    --shadow-subtle-2: rgba(99, 143, 61, 0.1) 0px 0px 0px 1px;

    /* Surfaces */
    --surface-linen: #f8f9f5;
    --surface-bone: #eff2e8;
    --surface-eucalyptus: #c9d5c5;
    --surface-sage-leaf: #4a6d47;
    --surface-slate-hollow: #2a332a;
}
```

### Tailwind v4

```css
@theme {
    /* Colors */
    --color-forest-ink: #0a1d08;
    --color-olive-press: #2b390a;
    --color-sage-leaf: #4a6d47;
    --color-deep-teal: #2b6b5e;
    --color-crimson-specimen: #991e4b;
    --color-amber-pin: #80581c;
    --color-linen: #f8f9f5;
    --color-bone: #eff2e8;
    --color-mist: #e1e6df;
    --color-slate-hollow: #2a332a;
    --color-sage-gray: #6b7860;
    --color-sage-mist: #a5ac9f;
    --color-eucalyptus: #c9d5c5;
    --color-lichen: #c5ccb6;
    --color-blush: #e3c9d0;
    --color-sand: #ad9d80;
    --color-sage-foam: #729d92;
    --color-rose-clay: #c27c93;
    --color-surface-glow: #fdfefb;

    /* Typography */
    --font-akkurat:
        'akkurat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        'Segoe UI', Roboto, sans-serif;
    --font-newsreader:
        'Newsreader', ui-sans-serif, system-ui, -apple-system,
        BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-fragment-mono:
        'Fragment Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
        monospace;

    /* Typography — Scale */
    --text-tag: 11px;
    --leading-tag: 1.33;
    --tracking-tag: 0.22px;
    --text-caption: 14px;
    --leading-caption: 1.29;
    --text-body-sm: 16px;
    --leading-body-sm: 1.5;
    --tracking-body-sm: -0.24px;
    --text-subheading: 18px;
    --leading-subheading: 1.44;
    --text-heading-sm: 26px;
    --leading-heading-sm: 1;
    --tracking-heading-sm: -0.52px;
    --text-heading: 30px;
    --leading-heading: 1.16;
    --tracking-heading: -0.6px;
    --text-heading-lg: 53px;
    --leading-heading-lg: 1.21;
    --tracking-heading-lg: -2.12px;
    --text-display: 108px;
    --leading-display: 0.98;
    --tracking-display: -3.46px;

    /* Spacing */
    --spacing-4: 4px;
    --spacing-6: 6px;
    --spacing-8: 8px;
    --spacing-10: 10px;
    --spacing-12: 12px;
    --spacing-16: 16px;
    --spacing-18: 18px;
    --spacing-20: 20px;
    --spacing-24: 24px;
    --spacing-32: 32px;
    --spacing-34: 34px;
    --spacing-40: 40px;
    --spacing-48: 48px;
    --spacing-58: 58px;
    --spacing-64: 64px;
    --spacing-96: 96px;

    /* Border Radius */
    --radius-sm: 1.5px;
    --radius-md: 4px;
    --radius-lg: 10px;
    --radius-2xl: 20px;

    /* Shadows */
    --shadow-subtle: rgb(153, 30, 75) 0px 0px 0px 1px;
    --shadow-subtle-2: rgba(99, 143, 61, 0.1) 0px 0px 0px 1px;
}
```
