---
version: "alpha"
name: "System Interface"
description: "System Interface Pricing Section is designed for comparing plans and supporting conversion decisions. Key features include plan comparison blocks and conversion-oriented actions. It is suitable for subscription pricing pages and plan comparison experiences."
colors:
  primary: "#60A5FA"
  secondary: "#9CA3AF"
  tertiary: "#4B5563"
  neutral: "#161618"
  background: "#161618"
  surface: "#FFFFFF"
  text-primary: "#9CA3AF"
  text-secondary: "#4B5563"
  border: "#FFFFFF"
  accent: "#60A5FA"
typography:
  display-lg:
    fontFamily: "Inter"
    fontSize: "48px"
    fontWeight: 500
    lineHeight: "48px"
    letterSpacing: "-0.025em"
  body-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 300
    lineHeight: "22.75px"
  label-md:
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
rounded:
  sm: "6px"
  lg: "8px"
spacing:
  base: "6px"
  sm: "1.2px"
  md: "2.4px"
  lg: "6px"
  xl: "12px"
  gap: "8px"
  card-padding: "9px"
components:
  button-primary:
    backgroundColor: "{colors.surface}"
    textColor: "#000000"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
    padding: "0px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: "0px"
  button-link:
    textColor: "{colors.secondary}"
    rounded: "0px"
    padding: "0px"
---

## Overview

- **Composition cues:**
  - Layout: Grid
  - Content Width: Full Bleed
  - Framing: Open
  - Grid: Strong

## Colors

The color system uses dark mode with #60A5FA as the main accent and #161618 as the neutral foundation.

- **Primary (#60A5FA):** Main accent and emphasis color.
- **Secondary (#9CA3AF):** Supporting accent for secondary emphasis.
- **Tertiary (#4B5563):** Reserved accent for supporting contrast moments.
- **Neutral (#161618):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #161618; Surface: #FFFFFF; Text Primary: #9CA3AF; Text Secondary: #4B5563; Border: #FFFFFF; Accent: #60A5FA

## Typography

Typography relies on Inter across display, body, and utility text.

- **Display (`display-lg`):** Inter, 48px, weight 500, line-height 48px, letter-spacing -0.025em.
- **Body (`body-md`):** Inter, 14px, weight 300, line-height 22.75px.
- **Labels (`label-md`):** Inter, 12px, weight 500, line-height 16px.

## Layout

Layout follows a grid composition with reusable spacing tokens. Preserve the grid, full bleed structural frame before changing ornament or component styling. Use 6px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a grid / full bleed composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Grid
- **Content width:** Full Bleed
- **Base unit:** 6px
- **Scale:** 1.2px, 2.4px, 6px, 12px, 16px, 20px, 24px, 32px
- **Card padding:** 9px, 22px
- **Gaps:** 8px, 12px, 16px, 32px

## Elevation & Depth

Depth is communicated through elevated, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as elevated first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Elevated
- **Borders:** 1px #FFFFFF
- **Shadows:** rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(255, 255, 255, 0.15) 0px 0px 20px 0px

## Shapes

Shapes rely on a tight radius system anchored by 6px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 6px, 8px, 16px, 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles.

### Buttons
- **Primary:** background #FFFFFF, text #000000, radius 8px, padding 0px, border 0px solid rgb(229, 231, 235).
- **Secondary:** background #FFFFFF, text #FFFFFF, radius 6px, padding 0px, border 1px solid rgba(255, 255, 255, 0.1).
- **Links:** text #9CA3AF, radius 0px, padding 0px, border 0px solid rgb(229, 231, 235).

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 6px rhythm.
- Do reuse the Elevated surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 6px, 8px, 16px, 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected expressive motion intensity without a deliberate reason.

## Motion

Motion feels expressive but remains focused on interface, text, and layout transitions. Timing clusters around 300ms and 150ms. Easing favors ease and 0. Hover behavior focuses on shadow and text changes.

**Motion Level:** expressive

**Durations:** 300ms, 150ms, 2000ms, 500ms, 15000ms, 1000ms

**Easings:** ease, 0, 1), cubic-bezier(0.4, 0.2, 0.6

**Hover Patterns:** shadow, text, stroke, transform, color

## WebGL

Reconstruct the graphics as a full-bleed background field using canvas-backed effect. The effect should read as retro-futurist, technical, and meditative: dot-matrix particle field with green on black and sparse spacing. Build it from dot particles + soft depth fade so the effect reads clearly. Animate it as slow breathing pulse. Interaction can react to the pointer, but only as a subtle drift. Preserve dom fallback.

**Id:** webgl

**Label:** WebGL

**Stack:** WebGL

**Insights:**
  - **Scene:**
    - **Value:** Full-bleed background field
  - **Effect:**
    - **Value:** Dot-matrix particle field
  - **Primitives:**
    - **Value:** Dot particles + soft depth fade
  - **Motion:**
    - **Value:** Slow breathing pulse
  - **Interaction:**
    - **Value:** Pointer-reactive drift
  - **Render:**
    - **Value:** Canvas-backed effect

**Techniques:** Dot matrix, Breathing pulse, Pointer parallax, DOM fallback

**Code Evidence:**
  - **HTML reference:**
    - **Language:** html
    - **Snippet:**
      ```html
      <!-- WebGL-simulated Canvas Background -->
      <canvas id="bg-canvas" class="fixed inset-0 w-full h-full z-0 pointer-events-none"></canvas>

      <!-- Header Navigation -->
      ```
  - **JS reference:**
    - **Language:** js
    - **Snippet:**
      ```
      const canvas = document.getElementById('bg-canvas');
      const ctx = canvas.getContext('2d');

      let width, height, cx, cy;
      const dots = [];
      const spacing = 35;
      let time = 0;
      …
      ```
