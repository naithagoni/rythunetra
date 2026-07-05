---
version: "alpha"
name: "Volumetric Swells"
description: "Volumetric Swells Hero Section is designed for introducing a product with clear above-the-fold messaging. Key features include headline hierarchy, supporting copy, and a primary call-to-action. It is suitable for homepage hero areas and campaign landing pages."
colors:
  primary: "#2563EB"
  secondary: "#FDFBF7"
  tertiary: "#7628F3"
  neutral: "#FDFBF7"
  background: "#FDFBF7"
  surface: "#FDFBF7"
  text-primary: "#FDFBF7"
  text-secondary: "#FDFBF7"
  border: "#FDFBF7"
  accent: "#2563EB"
typography:
  display-lg:
    fontFamily: "Playfair Display"
    fontSize: "88px"
    fontWeight: 400
    lineHeight: "88px"
    letterSpacing: "-0.025em"
    textTransform: "lowercase"
  body-md:
    fontFamily: "Inter"
    fontSize: "16px"
    fontWeight: 300
    lineHeight: "24px"
  label-md:
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
rounded:
  md: "0px"
  full: "9999px"
spacing:
  base: "8px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "22px"
  gap: "8px"
  card-padding: "8px"
  section-padding: "24px"
components:
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "8px"
  button-link:
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "0px"
---

## Overview

- **Composition cues:**
  - Layout: Flex
  - Content Width: Bounded
  - Framing: Glassy
  - Grid: Minimal

## Colors

The color system uses light mode with #2563EB as the main accent and #FDFBF7 as the neutral foundation.

- **Primary (#2563EB):** Main accent and emphasis color.
- **Secondary (#FDFBF7):** Supporting accent for secondary emphasis.
- **Tertiary (#7628F3):** Reserved accent for supporting contrast moments.
- **Neutral (#FDFBF7):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #FDFBF7; Surface: #FDFBF7; Text Primary: #FDFBF7; Text Secondary: #FDFBF7; Border: #FDFBF7; Accent: #2563EB

- **Gradients:** bg-gradient-to-t from-ocean to-transparent via-ocean/80

## Typography

Typography pairs Playfair Display for display hierarchy with Inter for supporting content and interface copy.

- **Display (`display-lg`):** Playfair Display, 88px, weight 400, line-height 88px, letter-spacing -0.025em, lowercase.
- **Body (`body-md`):** Inter, 16px, weight 300, line-height 24px.
- **Labels (`label-md`):** Inter, 12px, weight 500, line-height 16px.

## Layout

Layout follows a flex composition with reusable spacing tokens. Preserve the flex, bounded structural frame before changing ornament or component styling. Use 8px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a flex / bounded composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Flex
- **Content width:** Bounded
- **Base unit:** 8px
- **Scale:** 8px, 12px, 16px, 22px, 24px, 32px, 40px, 48px
- **Section padding:** 24px, 48px
- **Card padding:** 8px
- **Gaps:** 8px, 16px, 32px

## Elevation & Depth

Depth is communicated through glass, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as glass first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Glass
- **Borders:** 1px #FDFBF7
- **Shadows:** rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(253, 251, 247, 0.3) 0px 0px 120px 40px
- **Blur:** 12px

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 0px padding and a 9999px radius. Drive the shell with radial-gradient(circle, rgba(253, 251, 247, 0.15) 0%, rgba(253, 251, 247, 0.05) 30%, rgba(3, 5, 8, 0) 70%) so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 9999px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles.

### Buttons
- **Secondary:** background #FDFBF7, text #FDFBF7, radius 9999px, padding 8px, border 1px solid rgba(253, 251, 247, 0.2).
- **Links:** text #FDFBF7, radius 0px, padding 0px, border 0px solid rgb(229, 231, 235).

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 8px rhythm.
- Do reuse the Glass surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected moderate motion intensity without a deliberate reason.

## Motion

Motion feels controlled and interface-led across text, layout, and section transitions. Timing clusters around 150ms and 300ms. Easing favors ease and 0. Hover behavior focuses on text and color changes.

**Motion Level:** moderate

**Durations:** 150ms, 300ms

**Easings:** ease, 0, 0.2, 1), cubic-bezier(0.4, cubic-bezier(0

**Hover Patterns:** text, color, stroke
