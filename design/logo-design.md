# RythuNetra — Logo Design Brief (Rooster / Cock)

A single-source design prompt for generating the **RythuNetra** app logo as an
**SVG** (primary) and **`.ico`** (favicon). Hand this file to a designer, an
image/SVG-generation model, or use it as the spec when hand-authoring the paths.

---

## 1. Concept

The mark is an **adult male chicken — a rooster (cock)** — the traditional
"farmer's alarm clock" of rural Telangana. It signals dawn, vigilance, and the
start of the working day: a fitting emblem for a platform that gives farmers an
early, watchful eye (*netra* = "eye") over their crops.

- **Subject:** a **complete rooster** — full body in **profile**, facing
  **right**: comb, head, wattle, beak, chest, body, legs/feet, and long arched
  **sickle tail feathers**.
- **Pose:** proud, upright, standing/crowing — chest out, tail raised. Not
  aggressive, not a combat pose.
- **Style:** flat vector, geometric, minimal — a clean **solid-white
  silhouette** (with small negative-space cutouts for eye and feather
  separation). Modern iconography, not a detailed illustration.
- **Color:** **solid white (`#FFFFFF`)** only.
- **Background:** **fully transparent** — no badge, no square, no fill behind
  the bird.

> Recognizability test: at 16px the **comb, beak, body, and raised tail** must
> still read as a rooster. Simplify detail until it survives that size.

---

## 2. Brand System

The logo itself is **monochrome white on transparent**. Brand colors below are
for reference only — for the *surfaces the white mark sits on*, and for any
future colored variant. **Do not** put color inside the primary logo.

| Token | Value | Use |
|-------|-------|-----|
| **Logo fill** | `#FFFFFF` | The rooster — the only color in the mark |
| Background | `transparent` | No badge/square behind the bird |
| Brand green | `#1A7F54` | App theme color; a surface the white logo may sit on |
| Surface (dark UI) | `#09090B` | Primary app background |
| Off-white paper | `#F8F6F0` | Light-mode background |

**Rules**
- **One color: white.** No green, no gradients, no accents inside the mark.
- **Transparent background.** The SVG has no `<rect>` fill behind the rooster.
- Build the mark so it reads on **both** dark (`#09090B`) and light
  (`#F8F6F0`) surfaces — on light backgrounds it will be near-invisible, so also
  export an **ink variant** (`#09090B` fill) for light-mode placement. Same
  geometry, different `fill`.
- Prefer a **solid filled silhouette** over thin strokes — fills stay legible
  when scaled down far better than hairline strokes.

---

## 3. Anatomy Checklist (what makes it read as a *cock*, not a hen)

A complete adult male rooster includes:

- [ ] **Large serrated comb** on top of the head (defining male trait) — 4–5 points.
- [ ] **Wattle** hanging below the beak.
- [ ] **Pointed beak**, slightly open (crowing).
- [ ] **Round eye** — a small negative-space cutout (transparent hole), friendly not angry.
- [ ] **Neck hackle** feathers — 2–3 sweeping lines/notches.
- [ ] **Full chest and body** — rounded, proud posture.
- [ ] **Legs and feet** — two legs with visible clawed feet / spur.
- [ ] **Long arched sickle tail feathers** — the clearest male signal; 3–5 sweeping plumes raised behind.

Keep the whole bird within the artboard with a small margin so nothing clips.

---

## 4. Deliverables

Place outputs in `public/` (replace/extend the current favicon set).

| File | Size / Grid | Purpose |
|------|-------------|---------|
| `public/rythunetra.svg` | 32×32 viewBox, scalable, **transparent** | Primary favicon (already linked in `index.html`) + PWA icon |
| `public/favicon.ico` | multi-res: 16, 32, 48, **transparent** | Legacy browser favicon |
| `public/icons/rooster-white.svg` | 256×256 grid | Full detailed white mark for app header |
| `public/icons/rooster-ink.svg` | 256×256 grid | `#09090B` fill variant for light backgrounds |
| `public/icons/apple-touch-icon.png` | 180×180 | iOS home screen — **needs opaque bg** (white rooster on `#1A7F54` or `#09090B`) |
| `public/og-image.png` | 1200×630 | Social card — white rooster + wordmark on `#09090B` |

**SVG requirements**
- `xmlns="http://www.w3.org/2000/svg"`, explicit `viewBox`, no external fonts.
- **No background rect** — transparent canvas.
- `fill="#FFFFFF"` on the rooster path(s); eye as a transparent cutout
  (use `fill-rule="evenodd"` or a separate hole path).
- Optimize with SVGO; aim < 3 KB.
- No raster embeds inside the SVG.
- **Maskable note:** transparent maskable icons show the platform's default
  background. For PWA/Android maskable use, supply the opaque apple-touch style
  variant instead, and keep the mark within the central 80% safe zone.

**`.ico` requirements**
- Bundle **16×16, 32×32, 48×48** frames in one `favicon.ico`, all with a
  **transparent (alpha) background**.
- Generate from the SVG (do not hand-draw each size). See §6.

---

## 5. Generation Prompt (for an image/SVG model)

> Design a **minimal, flat vector logo** of a **complete rooster (adult male
> chicken) standing in profile, facing right**, for an app called
> **RythuNetra**, an organic farming platform for Indian (Telangana) farmers.
> Show the **whole bird**: serrated comb, wattle, pointed beak, proud chest,
> body, legs with feet, and long arched sickle tail feathers raised behind.
> Render it as a **solid white (`#FFFFFF`) silhouette** with small negative-space
> cutouts for the eye and feather separation. **Fully transparent background —
> no badge, no square, no backdrop.** Geometric, modern, friendly (not
> aggressive), balanced, centered, generous margins. Must remain legible at
> 16×16 px. No text, no gradients, no shadows, no realistic feather texture —
> iconographic and simple. Output as an optimized SVG.

Negative prompt: *color, colored fill, gradient, background rect, badge, square
frame, photorealism, 3D render, drop shadows, text/letters, busy detail,
angry/combat pose, multiple birds, watermark.*

---

## 6. Build Steps (SVG → ICO/PNG)

```bash
# 1. Author/export the transparent white SVG → public/rythunetra.svg
# 2. Rasterize crisp transparent PNG frames from the SVG
npx svgexport public/rythunetra.svg favicon-16.png 16:16
npx svgexport public/rythunetra.svg favicon-32.png 32:32
npx svgexport public/rythunetra.svg favicon-48.png 48:48

# 3. Bundle into a multi-resolution .ico (alpha preserved)
npx png-to-ico favicon-16.png favicon-32.png favicon-48.png > public/favicon.ico

# 4. Apple touch icon (180) — needs OPAQUE bg; composite white rooster on green
#    (svgexport won't add a bg; use a wrapper SVG with a green rect, or sharp/ImageMagick)
npx svgexport public/icons/apple-touch-wrapper.svg public/icons/apple-touch-icon.png 180:180

# 5. Optimize the SVGs
npx svgo public/rythunetra.svg public/icons/rooster-white.svg public/icons/rooster-ink.svg
```

> `apple-touch-wrapper.svg` = a copy of the mark with a solid
> `<rect width="100%" height="100%" fill="#1A7F54"/>` behind it (iOS ignores
> transparency and renders a black box otherwise).

**Wire it up** in `index.html` (add alongside the existing SVG icon link):

```html
<link rel="icon" type="image/svg+xml" href="/rythunetra.svg" />
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
```

And update `public/manifest.json` icons to include the new PNG/maskable entries.

---

## 7. Reference Skeleton (starting SVG)

A minimal 32-grid scaffold to iterate from — **transparent background, white
fill, complete bird**. Replace the rooster paths with the final geometry.

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <!-- NO background rect: transparent -->
  <path fill="#FFFFFF" fill-rule="evenodd" d="
    M11 3 l1 2 1.5 -1.5 1 2 1.5 -1 0.5 2                 /* comb points */
    a6 6 0 0 1 3 5                                        /* head to neck */
    l4 -1 -2 2.5 2.5 -0.5 -2 2                            /* sickle tail feathers */
    c1 3 -0.5 6 -3 7                                      /* back/body curve */
    l0.5 4 -2 0 0 -3.5                                    /* right leg */
    -1.5 0 0 3.5 -2 0 0.5 -4                              /* left leg */
    c-3 -1 -5 -4 -5 -7                                    /* belly to chest */
    a6 6 0 0 1 5 -8 Z                                     /* chest up to head */
    M13 8 a0.8 0.8 0 1 0 0.1 0 Z                          /* beak/wattle area */
  "/>
  <circle cx="12" cy="7" r="0.7" fill="#09090B"/>          <!-- eye: dark on white -->
</svg>
```

> This scaffold is **placeholder geometry for proportions only** — the path data
> above is illustrative, not a finished rooster. A designer/model should redraw
> the silhouette per §3 so comb, chest, legs, and tail all read clearly. The eye
> can be a dark dot (as above) or a true transparent cutout via `fill-rule`.

---

## 8. Acceptance Criteria

- [ ] Depicts a **complete rooster** (comb, wattle, beak, body, legs, sickle tail).
- [ ] **Solid white (`#FFFFFF`)** fill — no other color in the mark.
- [ ] **Transparent background** — no badge/square/rect behind the bird.
- [ ] Reads as a rooster at **16px**.
- [ ] `favicon.ico` contains 16/32/48 frames with alpha transparency.
- [ ] SVG optimized (< 3 KB), no external deps, no raster embeds.
- [ ] Provided in **white** and **ink (`#09090B`)** variants for dark/light surfaces.
- [ ] Opaque `apple-touch-icon` variant (white rooster on green/dark) for iOS.
- [ ] `index.html` + `manifest.json` updated to reference the new files.
