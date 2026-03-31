# Step-by-Step Development Guide

> **Organic Crop Disease & Natural Remedy Knowledge Platform**
> Architecture: Hybrid (Supabase BaaS + Vercel API Routes) | Cost: $0

---

## Table of Contents

1. [Pre-Phase: Project Naming, Branding & Theme](#pre-phase-project-naming-branding--theme)
2. [Phase 0: Prerequisites & Setup](#phase-0-prerequisites--setup)
3. [Phase 1: Project Initialization](#phase-1-project-initialization)
4. [Phase 2: Supabase Setup & Database](#phase-2-supabase-setup--database)
5. [Phase 3: Authentication](#phase-3-authentication)
6. [Phase 4: Core Frontend — Layout & Navigation](#phase-4-core-frontend--layout--navigation)
7. [Phase 5: Disease Module](#phase-5-disease-module)
8. [Phase 6: Remedy Module](#phase-6-remedy-module)
9. [Phase 7: Disease ↔ Remedy Mapping](#phase-7-disease--remedy-mapping)
10. [Phase 8: Land Type System](#phase-8-land-type-system)
11. [Phase 9: Multi-Language (i18n)](#phase-9-multi-language-i18n)
12. [Phase 10: Media Upload (Cloudinary)](#phase-10-media-upload-cloudinary)
13. [Phase 11: Custom API Layer (Vercel)](#phase-11-custom-api-layer-vercel)
14. [Phase 12: Preparation Lifecycle Tracking](#phase-12-preparation-lifecycle-tracking)
15. [Phase 13: Notification & Expiry Alert System](#phase-13-notification--expiry-alert-system)
16. [Phase 14: Search System](#phase-14-search-system)
17. [Phase 15: User Dashboard](#phase-15-user-dashboard)
18. [Phase 16: Admin Panel](#phase-16-admin-panel)
19. [Phase 17: PWA & Offline Support](#phase-17-pwa--offline-support)
20. [Phase 18: Testing](#phase-18-testing)
21. [Phase 19: CI/CD & Deployment](#phase-19-cicd--deployment)
22. [Phase 20: Monitoring & Launch](#phase-20-monitoring--launch)
23. [Post-Launch: AI Integration Roadmap](#post-launch-ai-integration-roadmap)

---

## Pre-Phase: Project Naming, Branding & Theme

### A. Project Name Recommendations

These are **repository/folder names** — short, lowercase, developer-facing.

| #   | Name         | Meaning                                 | GitHub URL                 |
| --- | ------------ | --------------------------------------- | -------------------------- |
| 1   | **rythunetra** | Rythu + Netra (knowledge)                 | `github.com/user/rythunetra` |
| 2   | **tierra**   | Spanish for "earth/land" — organic feel | `github.com/user/tierra`   |
| 3   | **verdica**  | Latin _viridis_ (green) + _medica_      | `github.com/user/verdica`  |
| 4   | **pantham**  | Telugu: పంతం (commitment to land)       | `github.com/user/pantham`  |
| 5   | **mitti**    | Hindi/Telugu: "soil" — simple, earthy   | `github.com/user/mitti`    |
| 6   | **agricare** | Agriculture + Care                      | `github.com/user/agricare` |

> **Recommended**: `rythunetra` — short, memorable, immediately communicates purpose.

---

### B. Branding Name Recommendations

These are **user-facing brand names** — what farmers see in the app header and stores.

#### Option 1: **RythuNetra** ★ Recommended

```
  🌿 RythuNetra
  "Know Your Crop. Heal It Naturally."
```

| Attribute    | Detail                                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Telugu Name  | క్రాప్‌వైజ్                                                                                                                                            |
| Tagline (EN) | Know Your Crop. Heal It Naturally.                                                                                                                     |
| Tagline (TE) | మీ పంటను తెలుసుకోండి. సహజంగా నయం చేయండి.                                                                                                               |
| Logo Concept | A **minimalist leaf** with a subtle magnifying glass circle around it — symbolizing "identifying" crop health. Green gradient (`#16a34a` → `#22c55e`). |
| Favicon      | Single leaf silhouette in a rounded square                                                                                                             |
| Style        | Clean, modern, trustworthy                                                                                                                             |

```
┌─────────────────────────────────────┐
│                                     │
│        ╭──────╮                     │
│       ╱   🍃   ╲    RythuNetra       │
│      │    ╱╲    │                   │
│       ╲  ╱  ╲  ╱    Know Your Crop │
│        ╰──────╯     Heal Naturally │
│                                     │
│   Leaf inside magnifying glass      │
│   Green gradient on white           │
└─────────────────────────────────────┘
```

#### Option 2: **Verdica**

```
  🌱 Verdica
  "Organic Intelligence for Every Farm"
```

| Attribute    | Detail                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Telugu Name  | వెర్డికా                                                                                                                  |
| Tagline (EN) | Organic Intelligence for Every Farm                                                                                       |
| Tagline (TE) | ప్రతి పొలానికి సేంద్రీయ తెలివి                                                                                            |
| Logo Concept | Lowercase **"v"** formed by two leaves merging at the stem. Deep forest green (`#15803d`) + warm gold accent (`#d97706`). |
| Style        | Premium, botanical, scientific                                                                                            |

```
┌─────────────────────────────────────┐
│                                     │
│         🌿   🌿                     │
│          ╲ ╱                        │
│           v        verdica          │
│                                     │
│   Two leaves forming a "v"          │
│   Forest green + gold accent        │
└─────────────────────────────────────┘
```

#### Option 3: **Mitti**

```
  🌾 Mitti
  "From Soil to Solution"
```

| Attribute    | Detail                                                                                                                           |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Telugu Name  | మిట్టి                                                                                                                           |
| Tagline (EN) | From Soil to Solution                                                                                                            |
| Tagline (TE) | మట్టి నుండి పరిష్కారం వరకు                                                                                                       |
| Logo Concept | A **droplet** shape containing a sprouting seedling — water meets earth. Earthy terracotta (`#c2410c`) + leaf green (`#22c55e`). |
| Style        | Warm, approachable, rooted                                                                                                       |

```
┌─────────────────────────────────────┐
│                                     │
│          ╱╲                         │
│         ╱🌱╲       mitti            │
│        │    │                       │
│         ╲  ╱       From Soil        │
│          ╲╱        to Solution      │
│                                     │
│   Seedling inside water droplet     │
│   Terracotta + green                │
└─────────────────────────────────────┘
```

#### Option 4: **Pantham**

```
  🌻 Pantham
  "Committed to Your Crop's Health"
```

| Attribute    | Detail                                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Telugu Name  | పంతం                                                                                                                   |
| Tagline (EN) | Committed to Your Crop's Health                                                                                        |
| Tagline (TE) | మీ పంట ఆరోగ్యానికి పంతం                                                                                                |
| Logo Concept | A **stylized sun** rising over a crop field — optimism and growth. Warm yellow (`#eab308`) + green ground (`#16a34a`). |
| Style        | Regional pride, warm, empowering                                                                                       |

```
┌─────────────────────────────────────┐
│                                     │
│        ╲  │  ╱                      │
│      ── ☀️ ──      Pantham          │
│        ╱  │  ╲                      │
│     ▓▓▓▓▓▓▓▓▓▓     పంతం            │
│                                     │
│   Sun over crop field               │
│   Golden yellow + green             │
└─────────────────────────────────────┘
```

#### Option 5: **AgriCare**

```
  💚 AgriCare
  "Natural Care for Every Crop"
```

| Attribute    | Detail                                                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Telugu Name  | అగ్రికేర్                                                                                                                                    |
| Tagline (EN) | Natural Care for Every Crop                                                                                                                  |
| Tagline (TE) | ప్రతి పంటకు సహజ సంరక్షణ                                                                                                                      |
| Logo Concept | A **heart shape** formed by two crop leaves with a small cross (+) in the center — agriculture meets health. Mint green (`#10b981`) + white. |
| Style        | Caring, health-focused, trustworthy                                                                                                          |

```
┌─────────────────────────────────────┐
│                                     │
│        🌿   🌿                      │
│        ╲  ✚  ╱     AgriCare        │
│         ╲  ╱                        │
│          ╲╱        Natural Care     │
│                    for Every Crop   │
│                                     │
│   Heart from leaves + health cross  │
│   Mint green + white                │
└─────────────────────────────────────┘
```

#### Branding Comparison

| Criteria         | RythuNetra  | Verdica   | Mitti     | Pantham   | AgriCare  |
| ---------------- | --------- | --------- | --------- | --------- | --------- |
| Simplicity       | ★★★★★     | ★★★★      | ★★★★★     | ★★★★      | ★★★★★     |
| Modern           | ★★★★★     | ★★★★★     | ★★★★      | ★★★       | ★★★★      |
| Regional Connect | ★★★       | ★★        | ★★★★      | ★★★★★     | ★★★       |
| Memorability     | ★★★★★     | ★★★★      | ★★★★★     | ★★★★      | ★★★★      |
| Bilingual Fit    | ★★★★      | ★★★       | ★★★★★     | ★★★★★     | ★★★★      |
| **Overall**      | **4.4/5** | **3.6/5** | **4.6/5** | **4.2/5** | **4.0/5** |

---

### C. Font Recommendations

#### Primary Font Pairing

| Usage           | Font                 | Weight                      | Why                                                                     |
| --------------- | -------------------- | --------------------------- | ----------------------------------------------------------------------- |
| **Headings**    | **Inter**            | 600 (Semi-Bold), 700 (Bold) | Clean geometric sans-serif, excellent readability, free on Google Fonts |
| **Body Text**   | **Inter**            | 400 (Regular), 500 (Medium) | Same family for consistency                                             |
| **Telugu Text** | **Noto Sans Telugu** | 400, 500, 600, 700          | Google's universal font — best Telugu rendering                         |
| **Monospace**   | **JetBrains Mono**   | 400                         | For data values, shelf life numbers                                     |

#### Alternative Font Pairings

**Option A: Warm & Friendly**

| Usage    | Font                 | Style                      |
| -------- | -------------------- | -------------------------- |
| Headings | **DM Sans**          | Geometric, rounded, modern |
| Body     | **DM Sans**          | Consistent family          |
| Telugu   | **Noto Sans Telugu** | _(no alternative needed)_  |

**Option B: Professional & Clean**

| Usage    | Font                  | Style                            |
| -------- | --------------------- | -------------------------------- |
| Headings | **Plus Jakarta Sans** | Slightly rounded, premium feel   |
| Body     | **Plus Jakarta Sans** | Great readability at small sizes |
| Telugu   | **Noto Sans Telugu**  | _(no alternative needed)_        |

**Option C: Earthy & Organic**

| Usage    | Font                 | Style                     |
| -------- | -------------------- | ------------------------- |
| Headings | **Outfit**           | Soft, geometric, warm     |
| Body     | **Source Sans 3**    | Highly legible, open      |
| Telugu   | **Noto Sans Telugu** | _(no alternative needed)_ |

#### Font Loading Setup

```html
<!-- filepath: index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Telugu:wght@400;500;600;700&display=swap"
    rel="stylesheet"
/>
```

---

### D. Custom Theme — Complete Design System

#### Color Palette

```
┌─────────────────────────────────────────────────────────────┐
│                      COLOR PALETTE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PRIMARY (Green — Growth & Organic)                         │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                │
│  │ 50 │ │100 │ │300 │ │500 │ │700 │ │900 │                │
│  │#f0f│ │#dcf│ │#86e│ │#22c│ │#158│ │#145│                │
│  │df4 │ │ce7 │ │fad │ │55e │ │03d │ │32d │                │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘                │
│                                                             │
│  SECONDARY (Amber — Warmth & Earth)                         │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                               │
│  │ 50 │ │300 │ │500 │ │700 │                               │
│  │#fff│ │#fcd│ │#f59│ │#b45│                               │
│  │beb │ │34d │ │e0b │ │309 │                               │
│  └────┘ └────┘ └────┘ └────┘                               │
│                                                             │
│  SEMANTIC COLORS                                            │
│  🟢 Success  #22c55e    Disease identified                  │
│  🔴 Danger   #ef4444    Expired remedy                      │
│  🟡 Warning  #f59e0b    Expiring soon (≤3 days)             │
│  🔵 Info     #3b82f6    Tips & suggestions                  │
│                                                             │
│  NEUTRALS                                                   │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                │
│  │ 50 │ │100 │ │300 │ │500 │ │700 │ │900 │                │
│  │#f9f│ │#f3f│ │#d1d│ │#6b7│ │#374│ │#111│                │
│  │afb │ │4f6 │ │5db │ │280 │ │151 │ │827 │                │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘                │
└─────────────────────────────────────────────────────────────┘
```

#### Tailwind Theme Configuration

```typescript
// filepath: tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            // ─── COLORS ────────────────────────────────
            colors: {
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e', // Main brand green
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16',
                },
                secondary: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b', // Warm amber
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },
                earth: {
                    50: '#fdf8f0',
                    100: '#f5e6d3',
                    200: '#e8cba4',
                    300: '#d4a574',
                    400: '#c2844e',
                    500: '#a0633a', // Terracotta
                    600: '#8b4f2d',
                    700: '#6e3c22',
                    800: '#502b18',
                    900: '#3a1f11',
                },
                disease: {
                    high: '#ef4444', // Severe
                    medium: '#f59e0b', // Moderate
                    low: '#22c55e', // Mild
                },
                expiry: {
                    safe: '#22c55e', // >7 days
                    warning: '#f59e0b', // 3-7 days
                    critical: '#ef4444', // <3 days
                    expired: '#6b7280', // Past expiry
                },
            },

            // ─── FONTS ─────────────────────────────────
            fontFamily: {
                sans: ['Inter', 'Noto Sans Telugu', 'system-ui', 'sans-serif'],
                telugu: ['Noto Sans Telugu', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
                heading: ['Inter', 'sans-serif'],
            },

            // ─── FONT SIZES ───────────────────────────
            fontSize: {
                display: ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
                h1: ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
                h2: ['1.875rem', { lineHeight: '1.25', fontWeight: '600' }],
                h3: ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
                h4: ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
                'body-lg': [
                    '1.125rem',
                    { lineHeight: '1.6', fontWeight: '400' },
                ],
                body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
                'body-sm': [
                    '0.875rem',
                    { lineHeight: '1.5', fontWeight: '400' },
                ],
                caption: ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
            },

            // ─── SPACING ──────────────────────────────
            spacing: {
                '4.5': '1.125rem',
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },

            // ─── BORDER RADIUS ────────────────────────
            borderRadius: {
                card: '0.75rem', // 12px — cards
                btn: '0.5rem', // 8px — buttons
                badge: '9999px', // Full round — badges/pills
                input: '0.375rem', // 6px — form inputs
            },

            // ─── SHADOWS ──────────────────────────────
            boxShadow: {
                card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
                'card-hover':
                    '0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
                modal: '0 20px 60px rgba(0,0,0,0.15)',
                dropdown: '0 4px 16px rgba(0,0,0,0.12)',
                inner: 'inset 0 2px 4px rgba(0,0,0,0.06)',
            },

            // ─── ANIMATIONS ───────────────────────────
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'pulse-soft': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-4px)' },
                    '75%': { transform: 'translateX(4px)' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.3s ease-out',
                'slide-up': 'slide-up 0.4s ease-out',
                'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
                shake: 'shake 0.3s ease-in-out',
            },

            // ─── SCREENS (Mobile-First) ───────────────
            screens: {
                xs: '360px', // Small phones (target min)
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
} satisfies Config
```

#### CSS Custom Properties (Global)

```css
/* filepath: src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    :root {
        /* Brand tokens */
        --color-brand: #22c55e;
        --color-brand-dark: #15803d;
        --color-brand-light: #dcfce7;

        /* Surfaces */
        --surface-primary: #ffffff;
        --surface-secondary: #f9fafb;
        --surface-elevated: #ffffff;

        /* Text */
        --text-primary: #111827;
        --text-secondary: #6b7280;
        --text-muted: #9ca3af;

        /* Borders */
        --border-default: #e5e7eb;
        --border-hover: #d1d5db;

        /* Radius */
        --radius-sm: 0.375rem;
        --radius-md: 0.5rem;
        --radius-lg: 0.75rem;
        --radius-full: 9999px;

        /* Transitions */
        --transition-fast: 150ms ease;
        --transition-normal: 250ms ease;
        --transition-slow: 400ms ease;
    }

    /* Dark Mode */
    .dark {
        --surface-primary: #111827;
        --surface-secondary: #1f2937;
        --surface-elevated: #1f2937;
        --text-primary: #f9fafb;
        --text-secondary: #9ca3af;
        --text-muted: #6b7280;
        --border-default: #374151;
        --border-hover: #4b5563;
    }

    /* Telugu font adjustment */
    [lang='te'] body {
        font-family: 'Noto Sans Telugu', 'Inter', sans-serif;
        line-height: 1.8;
    }

    /* Base styles */
    body {
        @apply bg-[var(--surface-primary)] text-[var(--text-primary)] antialiased;
        font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
    }
}

@layer components {
    /* Reusable component classes */
    .btn-primary {
        @apply bg-primary-500 hover:bg-primary-600 text-white
           px-4 py-2.5 rounded-btn font-medium
           transition-all duration-[var(--transition-fast)]
           active:scale-[0.98] shadow-sm hover:shadow-md;
    }

    .btn-secondary {
        @apply bg-white border border-[var(--border-default)]
           hover:border-primary-300 hover:bg-primary-50
           text-[var(--text-primary)]
           px-4 py-2.5 rounded-btn font-medium
           transition-all duration-[var(--transition-fast)];
    }

    .btn-danger {
        @apply bg-red-500 hover:bg-red-600 text-white
           px-4 py-2.5 rounded-btn font-medium
           transition-all duration-[var(--transition-fast)];
    }

    .card {
        @apply bg-[var(--surface-elevated)] rounded-card
           border border-[var(--border-default)]
           shadow-card hover:shadow-card-hover
           transition-shadow duration-[var(--transition-normal)];
    }

    .badge {
        @apply inline-flex items-center px-2.5 py-0.5
           rounded-badge text-caption font-medium;
    }

    .badge-success {
        @apply badge bg-green-100 text-green-700;
    }
    .badge-warning {
        @apply badge bg-amber-100 text-amber-700;
    }
    .badge-danger {
        @apply badge bg-red-100 text-red-700;
    }
    .badge-info {
        @apply badge bg-blue-100 text-blue-700;
    }

    .input {
        @apply w-full px-3 py-2.5 rounded-input
           border border-[var(--border-default)]
           bg-[var(--surface-primary)]
           placeholder:text-[var(--text-muted)]
           focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
           transition-all duration-[var(--transition-fast)];
    }

    .section-heading {
        @apply text-h2 text-[var(--text-primary)] mb-2;
    }

    .section-subheading {
        @apply text-body text-[var(--text-secondary)] mb-6;
    }
}
```

#### Component Style Examples

```
┌─────────────────────────────────────────────────────────────┐
│  DISEASE CARD                                               │
├─────────────────────────────────────────────────────────────┤
│  ╭─────────────────────────────────────────╮                │
│  │  ┌─────────────────────────────┐        │                │
│  │  │                             │        │                │
│  │  │    📸 Disease Image         │        │                │
│  │  │         240 × 160           │        │                │
│  │  │                             │        │                │
│  │  └─────────────────────────────┘        │                │
│  │  ┌────────────────┐                     │                │
│  │  │ ✅ Verified    │  🏷️ Red Soil       │                │
│  │  └────────────────┘                     │                │
│  │                                         │                │
│  │  Leaf Blight                            │                │
│  │  ──────────────                         │                │
│  │  Affects: Rice, Cotton                  │                │
│  │                                         │                │
│  │  Yellowing of leaves with brown...      │                │
│  │                                         │                │
│  │  ┌─────────────┐  ┌──────────────┐      │                │
│  │  │ 🟢 3 Remedies│  │ View Details →│     │                │
│  │  └─────────────┘  └──────────────┘      │                │
│  ╰─────────────────────────────────────────╯                │
│                                                             │
│  Radius: 12px  |  Shadow: card  |  Font: Inter             │
│  Image: rounded-t-card  |  Badges: rounded-full            │
└─────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│  EXPIRY STATUS BADGES                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  Active — green bg, green text         │
│  │ 🟢 25 days left │  bg-green-100 text-green-700           │
│  └─────────────────┘                                        │
│                                                             │
│  ┌──────────────────┐  Warning — amber bg, amber text       │
│  │ 🟡 5 days left   │  bg-amber-100 text-amber-700          │
│  └──────────────────┘                                        │
│                                                             │
│  ┌────────────────────┐  Critical — red bg, red text        │
│  │ 🔴 2 days left ⚠️  │  bg-red-100 text-red-700            │
│  └────────────────────┘  + animate-pulse-soft                │
│                                                             │
│  ┌─────────────┐  Expired — gray bg, gray text              │
│  │ ⚪ Expired  │  bg-gray-100 text-gray-500                 │
│  └─────────────┘  + line-through on name                    │
└─────────────────────────────────────────────────────────────┘
```

#### Typography Scale Visual

```
┌─────────────────────────────────────────────────────────────┐
│  TYPOGRAPHY SCALE                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Display    48px / Bold                                     │
│  ═══════════════════════════════════                        │
│  RythuNetra                                                   │
│                                                             │
│  H1         36px / Bold                                     │
│  ────────────────────────────                               │
│  Crop Diseases                                              │
│                                                             │
│  H2         30px / SemiBold                                 │
│  ──────────────────────                                     │
│  Recommended Remedies                                       │
│                                                             │
│  H3         24px / SemiBold                                 │
│  ────────────────                                           │
│  How to Prepare                                             │
│                                                             │
│  H4         20px / SemiBold                                 │
│  ───────────                                                │
│  Benefits                                                   │
│                                                             │
│  Body LG    18px / Regular                                  │
│  Yellowing of leaves is a common symptom...                 │
│                                                             │
│  Body       16px / Regular                                  │
│  Mix 5ml neem oil per liter of water.                       │
│                                                             │
│  Body SM    14px / Regular                                  │
│  Last updated 2 days ago                                    │
│                                                             │
│  Caption    12px / Regular                                  │
│  Photo by: Agricultural Dept.                               │
│                                                             │
│  ──────── Telugu ────────                                   │
│                                                             │
│  H2   నిమ్మ నూనె తయారీ విధానం                               │
│  Body  5ml వేప నూనె లీటర్ నీటికి కలపండి.                      │
│  (Noto Sans Telugu, line-height: 1.8)                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Icon Recommendations

| Library          | Usage                                             | Install                    |
| ---------------- | ------------------------------------------------- | -------------------------- |
| **Lucide React** | Primary icon set — clean, consistent, 1000+ icons | `npm install lucide-react` |
| **React Icons**  | Fallback for specialty icons                      | `npm install react-icons`  |

Key icons used in the app:

```
🏠 Home        → <Home />             🔍 Search     → <Search />
🦠 Disease     → <Bug />              💊 Remedy     → <Leaf />
📋 Preparation → <ClipboardList />    🔔 Alerts     → <Bell />
⚙️ Settings    → <Settings />         🌍 Language   → <Globe />
🗺️ Land Type   → <MapPin />          📸 Upload     → <Camera />
⏰ Expiry      → <Clock />            ✅ Verified   → <BadgeCheck />
👤 Profile     → <User />             🚪 Logout     → <LogOut />
```

---

## Phase 0: Prerequisites & Setup

### Developer Environment

| Tool             | Version | Installation                                            | Installed |
| ---------------- | ------- | ------------------------------------------------------- | --------- |
| **Node.js**      | 20 LTS  | `brew install node@20` (macOS)                          | Yes       |
| **npm**          | 10+     | Comes with Node.js                                      | Yes       |
| **Git**          | Latest  | `brew install git`                                      | Yes       |
| **VS Code**      | Latest  | [code.visualstudio.com](https://code.visualstudio.com/) | Yes       |
| **Supabase CLI** | Latest  | `npm install -g supabase`                               | Yes       |
| **Vercel CLI**   | Latest  | `npm install -g vercel`                                 | Yes       |

### VS Code Extensions (Recommended)

```
code --install-extension dbaeumer.vscode-eslint
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension ms-vscode.vscode-typescript-next
```

### Account Setup (All Free)

| Service        | Purpose                      | Sign Up                                   |
| -------------- | ---------------------------- | ----------------------------------------- |
| **GitHub**     | Code repository, CI/CD       | [github.com](https://github.com/)         |
| **Supabase**   | Database, Auth, API          | [supabase.com](https://supabase.com/)     |
| **Vercel**     | Frontend hosting, API routes | [vercel.com](https://vercel.com/)         |
| **Cloudinary** | Image/video storage          | [cloudinary.com](https://cloudinary.com/) |
| **Cloudflare** | DNS, CDN                     | [cloudflare.com](https://cloudflare.com/) |
| **Sentry**     | Error monitoring             | [sentry.io](https://sentry.io/)           |

### Estimated Time per Phase

| Phase       | Duration     | Complexity        |
| ----------- | ------------ | ----------------- |
| Phase 0-1   | 1 day        | Setup             |
| Phase 2-3   | 2 days       | Foundation        |
| Phase 4-6   | 4 days       | Core features     |
| Phase 7-10  | 4 days       | Integrations      |
| Phase 11-13 | 3 days       | Custom backend    |
| Phase 14-16 | 3 days       | Advanced features |
| Phase 17-20 | 3 days       | Polish & deploy   |
| **TOTAL**   | **~20 days** |                   |

---

## Phase 1: Project Initialization

### Step 1.1: Create React 19 + TypeScript + Vite Project

Note: "rythunetra" repo already created in my GitHub and currently in the same directory.

```bash
npm create vite@latest . -- --template react-ts
cd rythunetra
```

### Step 1.2: Install Core Dependencies

```bash
# UI & Styling
npm install tailwindcss @tailwindcss/vite

# Routing
npm install react-router-dom@latest

# State Management & Data Fetching
npm install @tanstack/react-query@latest zustand@latest

# Forms & Validation
npm install react-hook-form@latest @hookform/resolvers@latest zod@latest

# Utilities
npm install clsx@latest tailwind-merge@latest date-fns@latest
```

### Step 1.3: Install Dev Dependencies

```bash
npm install -D @types/react @types/react-dom
npm install -D eslint @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest
npm install -D eslint-plugin-react-hooks
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D prettier eslint-config-prettier@latest
```

### Step 1.4: Configure Tailwind CSS

```typescript
// filepath: tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
            },
            fontFamily: {
                telugu: ['Noto Sans Telugu', 'sans-serif'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
} satisfies Config
```

### Step 1.5: Configure Path Aliases

```typescript
// filepath: tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/services/*": ["./src/services/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/i18n/*": ["./src/i18n/*"]
    }
  }
}
```

### Step 1.6: Setup Project Structure

```bash
mkdir -p src/{components/{common,disease,remedy,preparation,ai},pages,hooks,contexts,services,types,utils,i18n/locales}
mkdir -p api/{middleware,diseases,preparations,cron,admin,ai}
mkdir -p supabase/migrations
mkdir -p public/icons
```

**Final Project Structure:**

```
rythunetra/
├── src/
│   ├── components/
│   │   ├── common/          # Header, Footer, LanguageToggle, LandTypeSelector
│   │   ├── disease/         # DiseaseCard, DiseaseGrid, DiseaseDetail
│   │   ├── remedy/          # RemedyCard, RemedyDetail, RemedySteps
│   │   ├── preparation/     # PreparationForm, ExpiryTimeline, AlertBanner
│   │   └── ai/              # (Future) DiseaseScanner, AIChatbot
│   ├── pages/               # Home, DiseaseList, DiseaseDetail, RemedyDetail, etc.
│   ├── hooks/               # useAuth, useLanguage, useLandType, useSearch
│   ├── contexts/            # AuthContext, LanguageContext, LandTypeContext
│   ├── services/            # supabase.ts, api.ts, diseaseService.ts, etc.
│   ├── types/               # disease.ts, remedy.ts, user.ts, preparation.ts
│   ├── utils/               # dateUtils.ts, expiryCalculator.ts, cn.ts
│   ├── i18n/
│   │   ├── config.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── te.json
│   ├── App.tsx
│   └── main.tsx
├── api/                     # Vercel API Routes (serverless backend)
│   ├── middleware/
│   ├── diseases/
│   ├── preparations/
│   ├── cron/
│   ├── admin/
│   └── ai/                  # (Future)
├── supabase/
│   └── migrations/
├── public/
├── .env.local
├── .env.example
├── vercel.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

### Step 1.7: Initialize Git

```bash
git init
cat > .gitignore << 'EOF'
node_modules/
dist/
.env.local
.env
.vercel/
.supabase/
*.log
EOF

cat > .env.example << 'EOF'
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
VITE_SENTRY_DSN=
EOF

git add .
git commit -m "chore: initial project setup with Vite + React + TypeScript"
```

### Step 1.8: Push to GitHub

```bash
gh repo create rythunetra --public --source=. --push
```

> **✅ Checkpoint**: Project scaffolded, dependencies installed, pushed to GitHub.

---

## Phase 2: Supabase Setup & Database

### Step 2.1: Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Set project name: `rythunetra`
4. Set database password (save securely)
5. Select region: `South Asia (Mumbai)` (closest to target users)
6. Click "Create new project"

### Step 2.2: Save Credentials

```bash
# Get from Supabase Dashboard → Settings → API
# Save to .env.local (NEVER commit this file)

cat > .env.local << 'EOF'
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EOF
```

### Step 2.3: Initialize Supabase Locally

```bash
supabase init
supabase link --project-ref your-project-ref
```

### Step 2.4: Create Database Migration — Core Tables

```bash
supabase migration new initial_schema
```

```sql
-- filepath: supabase/migrations/001_initial_schema.sql

-- ==============================================
-- ENABLE EXTENSIONS
-- ==============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==============================================
-- USERS PROFILE TABLE
-- ==============================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    role VARCHAR(20) DEFAULT 'farmer' CHECK (role IN ('farmer', 'expert', 'admin')),
    preferred_language VARCHAR(5) DEFAULT 'en' CHECK (preferred_language IN ('en', 'te')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- LAND TYPES TABLE
-- ==============================================
CREATE TABLE land_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_te VARCHAR(100) NOT NULL,
    description_en TEXT,
    description_te TEXT,
    regions TEXT[],
    is_active BOOLEAN DEFAULT TRUE
);

-- ==============================================
-- USER PREFERENCES TABLE
-- ==============================================
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    land_type_id INT REFERENCES land_types(id),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- DISEASES TABLE
-- ==============================================
CREATE TABLE diseases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    affected_crops TEXT[] NOT NULL DEFAULT '{}',
    land_type_ids INT[] NOT NULL DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- DISEASE TRANSLATIONS TABLE
-- ==============================================
CREATE TABLE disease_translations (
    id SERIAL PRIMARY KEY,
    disease_id UUID REFERENCES diseases(id) ON DELETE CASCADE,
    language VARCHAR(5) NOT NULL CHECK (language IN ('en', 'te')),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    symptoms TEXT,
    organic_solutions TEXT,
    aliases TEXT[] DEFAULT '{}',
    UNIQUE(disease_id, language)
);

-- ==============================================
-- DISEASE MEDIA TABLE
-- ==============================================
CREATE TABLE disease_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disease_id UUID REFERENCES diseases(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('image', 'video')),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption_en TEXT,
    caption_te TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- REMEDIES TABLE
-- ==============================================
CREATE TABLE remedies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    shelf_life_days INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- REMEDY TRANSLATIONS TABLE
-- ==============================================
CREATE TABLE remedy_translations (
    id SERIAL PRIMARY KEY,
    remedy_id UUID REFERENCES remedies(id) ON DELETE CASCADE,
    language VARCHAR(5) NOT NULL CHECK (language IN ('en', 'te')),
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    preparation_steps JSONB NOT NULL DEFAULT '[]',
    mode_of_action TEXT,
    benefits TEXT[] DEFAULT '{}',
    application_method TEXT,
    storage_instructions TEXT,
    UNIQUE(remedy_id, language)
);

-- ==============================================
-- DISEASE ↔ REMEDY MAPPING TABLE
-- ==============================================
CREATE TABLE disease_remedies (
    disease_id UUID REFERENCES diseases(id) ON DELETE CASCADE,
    remedy_id UUID REFERENCES remedies(id) ON DELETE CASCADE,
    effectiveness VARCHAR(10) CHECK (effectiveness IN ('high', 'medium', 'low')),
    PRIMARY KEY (disease_id, remedy_id)
);

-- ==============================================
-- USER PREPARATIONS TABLE
-- ==============================================
CREATE TABLE preparations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    remedy_id UUID REFERENCES remedies(id),
    custom_name VARCHAR(200),
    prepared_date DATE NOT NULL,
    quantity VARCHAR(50),
    shelf_life_days INT NOT NULL,
    expiry_date DATE NOT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'used')),
    alert_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- NOTIFICATIONS TABLE
-- ==============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL,
    title_en TEXT NOT NULL,
    title_te TEXT,
    message_en TEXT,
    message_te TEXT,
    related_id UUID,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- AUDIT LOGS TABLE
-- ==============================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- INDEXES
-- ==============================================
CREATE INDEX idx_disease_trans_lang ON disease_translations(language);
CREATE INDEX idx_disease_trans_title ON disease_translations USING GIN(to_tsvector('english', title));
CREATE INDEX idx_disease_trans_aliases ON disease_translations USING GIN(aliases);
CREATE INDEX idx_remedy_trans_lang ON remedy_translations(language);
CREATE INDEX idx_preparations_user ON preparations(user_id);
CREATE INDEX idx_preparations_expiry ON preparations(expiry_date);
CREATE INDEX idx_preparations_status ON preparations(status);
CREATE INDEX idx_notifications_user ON notifications(user_id, read);
CREATE INDEX idx_diseases_slug ON diseases(slug);
CREATE INDEX idx_remedies_slug ON remedies(slug);

-- ==============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ==============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_diseases_updated_at
    BEFORE UPDATE ON diseases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_remedies_updated_at
    BEFORE UPDATE ON remedies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Step 2.5: Apply Migration

```bash
supabase db push
```

### Step 2.6: Create Row Level Security Policies

```bash
supabase migration new rls_policies
```

```sql
-- filepath: supabase/migrations/002_rls_policies.sql

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE remedies ENABLE ROW LEVEL SECURITY;
ALTER TABLE remedy_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_remedies ENABLE ROW LEVEL SECURITY;
ALTER TABLE preparations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ policies (anyone can view diseases, remedies, land types)
CREATE POLICY "diseases_read" ON diseases FOR SELECT USING (true);
CREATE POLICY "disease_trans_read" ON disease_translations FOR SELECT USING (true);
CREATE POLICY "disease_media_read" ON disease_media FOR SELECT USING (true);
CREATE POLICY "remedies_read" ON remedies FOR SELECT USING (true);
CREATE POLICY "remedy_trans_read" ON remedy_translations FOR SELECT USING (true);
CREATE POLICY "disease_remedies_read" ON disease_remedies FOR SELECT USING (true);

-- USER PROFILE policies
CREATE POLICY "users_read_own" ON user_profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- USER PREFERENCES policies
CREATE POLICY "prefs_read_own" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "prefs_upsert_own" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "prefs_update_own" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- PREPARATIONS policies (users manage their own)
CREATE POLICY "preps_read_own" ON preparations
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "preps_insert_own" ON preparations
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "preps_update_own" ON preparations
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "preps_delete_own" ON preparations
    FOR DELETE USING (auth.uid() = user_id);

-- NOTIFICATIONS policies
CREATE POLICY "notif_read_own" ON notifications
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notif_update_own" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);
```

```bash
supabase db push
```

### Step 2.7: Seed Initial Data

```bash
supabase migration new seed_data
```

```sql
-- filepath: supabase/migrations/003_seed_data.sql

-- Land Types
INSERT INTO land_types (code, name_en, name_te, description_en, description_te, regions) VALUES
('red-soil', 'Red Soil', 'ఎర్ర నేల', 'Iron-rich soil found in Telangana highlands', 'తెలంగాణ ఎత్తైన ప్రాంతాల్లో కనిపించే ఇనుము సమృద్ధి నేల', ARRAY['Telangana highlands', 'Rayalaseema']),
('black-soil', 'Black Soil', 'నల్ల నేల', 'Cotton soil found in Deccan plateau', 'దక్కన్ పీఠభూమిలో కనిపించే పత్తి నేల', ARRAY['Deccan plateau', 'Marathwada border']),
('sandy-soil', 'Sandy Soil', 'ఇసుక నేల', 'Light soil found in coastal regions', 'తీర ప్రాంతాల్లో కనిపించే తేలికైన నేల', ARRAY['Coastal AP', 'Krishna district']),
('alluvial-soil', 'Alluvial Soil', 'ఒండ్రు నేల', 'Fertile soil found in river basins', 'నది పరీవాహక ప్రాంతాల్లో కనిపించే సారవంతమైన నేల', ARRAY['Godavari basin', 'Krishna basin']),
('laterite-soil', 'Laterite Soil', 'లేటరైట్ నేల', 'Weathered soil from Eastern Ghats', 'తూర్పు కనుమల నుండి క్షీణించిన నేల', ARRAY['Eastern Ghats foothills', 'Araku valley']);

-- Sample Remedies
INSERT INTO remedies (id, slug, category, shelf_life_days) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'neem-oil', 'neem-based', 180),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'panchagavya', 'cow-based', 30),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'jeevamrutham', 'cow-based', 7),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'neem-seed-kernel-extract', 'neem-based', 2),
('e5f6a7b8-c9d0-1234-efab-345678901234', 'chilli-garlic-extract', 'plant-extract', 15);

INSERT INTO remedy_translations (remedy_id, language, name, description, preparation_steps, mode_of_action, benefits, application_method, storage_instructions) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'en', 'Neem Oil', 'Cold-pressed oil from neem seeds with natural pesticidal properties', '["Obtain cold-pressed neem oil","Mix 5ml neem oil per liter of water","Add 1ml liquid soap as emulsifier","Shake well before spraying","Apply in the evening to avoid sunburn"]', 'Acts as antifeedant, repellent, and growth disruptor for insects', ARRAY['Broad-spectrum pest control', 'Fungicidal properties', 'Safe for beneficial insects at recommended doses'], 'Foliar spray, 5ml per liter of water, every 7-10 days', 'Store in cool dark place. Do not refrigerate.'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'te', 'వేప నూనె', 'సహజ పురుగుమందు గుణాలు కలిగిన వేప గింజల నుండి చల్లదనంగా నొక్కిన నూనె', '["చల్లగా నొక్కిన వేప నూనె తీసుకోండి","లీటర్ నీటికి 5ml వేప నూనె కలపండి","ఎమల్సిఫైయర్‌గా 1ml ద్రవ సబ్బు జోడించండి","స్ప్రే చేయడానికి ముందు బాగా కదపండి","ఎండదెబ్బ నివారించడానికి సాయంత్రం వేయండి"]', 'కీటకాలకు ఆహార నిరోధకంగా, తిప్పికొట్టేదిగా మరియు పెరుగుదల భంగం చేసేదిగా పనిచేస్తుంది', ARRAY['విస్తృత-పురుగు నియంత్రణ', 'శిలీంద్ర సంహార గుణాలు', 'సిఫార్సు చేసిన మోతాదులో ప్రయోజనకరమైన కీటకాలకు సురక్షితం'], 'ఆకులపై స్ప్రే, లీటర్ నీటికి 5ml, ప్రతి 7-10 రోజులకు', 'చల్లటి చీకటి ప్రదేశంలో నిల్వ చేయండి. రెఫ్రిజరేటర్‌లో ఉంచవద్దు.');
```

```bash
supabase db push
git add . && git commit -m "feat: database schema, RLS policies, and seed data"
```

> **✅ Checkpoint**: Database running with tables, RLS, indexes, and seed data.

---

## Phase 3: Authentication

### Step 3.1: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Step 3.2: Create Supabase Client

```typescript
// filepath: src/services/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

### Step 3.3: Generate TypeScript Types

```bash
supabase gen types typescript --linked > src/types/database.types.ts
```

### Step 3.4: Create Auth Context

```typescript
// filepath: src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/services/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, preferred_language: 'en' },
      },
    })
    if (error) throw error
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

### Step 3.5: Create Auth Pages

Build these pages:

| Page                   | Route            | Purpose                       |
| ---------------------- | ---------------- | ----------------------------- |
| `LoginPage.tsx`        | `/login`         | Email/password + Google OAuth |
| `RegisterPage.tsx`     | `/register`      | New user signup with name     |
| `AuthCallbackPage.tsx` | `/auth/callback` | Handle OAuth redirect         |
| `ProtectedRoute.tsx`   | Component        | Wrap authenticated routes     |

### Step 3.6: Create Auto Profile Trigger

```sql
-- filepath: supabase/migrations/004_auth_trigger.sql

-- Auto-create user_profiles when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, name, preferred_language)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

```bash
supabase db push
git add . && git commit -m "feat: authentication with Supabase Auth + user profiles"
```

> **✅ Checkpoint**: Users can sign up, log in, and have auto-created profiles.

---

## Phase 4: Core Frontend — Layout & Navigation

### Step 4.1: Create Utility Functions

```typescript
// filepath: src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
```

### Step 4.2: Build Common Components

Build in order:

| #   | Component          | File                                         | Purpose                               |
| --- | ------------------ | -------------------------------------------- | ------------------------------------- |
| 1   | `Header`           | `src/components/common/Header.tsx`           | Logo, nav, language toggle, user menu |
| 2   | `Footer`           | `src/components/common/Footer.tsx`           | Links, copyright                      |
| 3   | `Layout`           | `src/components/common/Layout.tsx`           | Page wrapper with Header + Footer     |
| 4   | `LandTypeSelector` | `src/components/common/LandTypeSelector.tsx` | Persistent dropdown                   |
| 5   | `LanguageToggle`   | `src/components/common/LanguageToggle.tsx`   | EN/TE switch                          |
| 6   | `SearchBar`        | `src/components/common/SearchBar.tsx`        | Unified search input                  |
| 7   | `LoadingSpinner`   | `src/components/common/LoadingSpinner.tsx`   | Loading state                         |
| 8   | `EmptyState`       | `src/components/common/EmptyState.tsx`       | No results display                    |

### Step 4.3: Setup React Router

```typescript
// filepath: src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { Layout } from '@/components/common/Layout'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

// Pages
import { HomePage } from '@/pages/Home'
import { LoginPage } from '@/pages/Login'
import { RegisterPage } from '@/pages/Register'
import { DiseaseListPage } from '@/pages/DiseaseList'
import { DiseaseDetailPage } from '@/pages/DiseaseDetail'
import { RemedyListPage } from '@/pages/RemedyList'
import { RemedyDetailPage } from '@/pages/RemedyDetail'
import { MyPreparationsPage } from '@/pages/MyPreparations'
import { SettingsPage } from '@/pages/Settings'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/diseases" element={<DiseaseListPage />} />
              <Route path="/diseases/:slug" element={<DiseaseDetailPage />} />
              <Route path="/remedies" element={<RemedyListPage />} />
              <Route path="/remedies/:slug" element={<RemedyDetailPage />} />
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/my-preparations" element={<MyPreparationsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
```

```bash
git add . && git commit -m "feat: layout, navigation, and routing"
```

> **✅ Checkpoint**: App shell running with navigation, layout, and protected routes.

---

## Phase 5: Disease Module

### Step 5.1: Create Types

```typescript
// filepath: src/types/disease.ts
export interface Disease {
    id: string
    slug: string
    affected_crops: string[]
    land_type_ids: number[]
    verified: boolean
    created_at: string
    translations: DiseaseTranslation[]
    media: DiseaseMedia[]
    remedies: DiseaseRemedy[]
}

export interface DiseaseTranslation {
    language: string
    title: string
    description: string
    symptoms: string | null
    organic_solutions: string | null
    aliases: string[]
}

export interface DiseaseMedia {
    id: string
    type: 'image' | 'video'
    url: string
    thumbnail_url: string | null
}

export interface DiseaseRemedy {
    effectiveness: string
    remedy: {
        id: string
        slug: string
        category: string
        translations: { language: string; name: string }[]
    }
}
```

### Step 5.2: Create Disease Service

```typescript
// filepath: src/services/diseaseService.ts
import { supabase } from './supabase'

export async function getDiseases(options?: {
    landTypeId?: number
    language?: string
    page?: number
    limit?: number
}) {
    const { landTypeId, language = 'en', page = 1, limit = 12 } = options ?? {}
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
        .from('diseases')
        .select(
            `
      *,
      disease_translations!inner(*),
      disease_media(*),
      disease_remedies(
        effectiveness,
        remedies(id, slug, category, remedy_translations(*))
      )
    `,
            { count: 'exact' },
        )
        .eq('disease_translations.language', language)
        .order('created_at', { ascending: false })
        .range(from, to)

    if (landTypeId) {
        query = query.contains('land_type_ids', [landTypeId])
    }

    return query
}

export async function getDiseaseBySlug(slug: string) {
    return supabase
        .from('diseases')
        .select(
            `
      *,
      disease_translations(*),
      disease_media(*),
      disease_remedies(
        effectiveness,
        remedies(*, remedy_translations(*))
      )
    `,
        )
        .eq('slug', slug)
        .single()
}
```

### Step 5.3: Create React Query Hooks

```typescript
// filepath: src/hooks/useDiseases.ts
import { useQuery } from '@tanstack/react-query'
import { getDiseases, getDiseaseBySlug } from '@/services/diseaseService'

export function useDiseases(options?: {
    landTypeId?: number
    language?: string
    page?: number
}) {
    return useQuery({
        queryKey: ['diseases', options],
        queryFn: () => getDiseases(options),
    })
}

export function useDisease(slug: string) {
    return useQuery({
        queryKey: ['disease', slug],
        queryFn: () => getDiseaseBySlug(slug),
        enabled: !!slug,
    })
}
```

### Step 5.4: Build Disease Components

Build in order:

| #   | Component             | Props               | Description                     |
| --- | --------------------- | ------------------- | ------------------------------- |
| 1   | `DiseaseCard`         | `disease, language` | Card with image, title, arrow   |
| 2   | `DiseaseGrid`         | `diseases, loading` | Responsive grid of DiseaseCards |
| 3   | `DiseaseDetail`       | `disease, language` | Tabbed detail view              |
| 4   | `DiseaseMediaGallery` | `media`             | Image/video viewer              |

### Step 5.5: Build Disease Pages

| Page            | Route             | Content                                             |
| --------------- | ----------------- | --------------------------------------------------- |
| `DiseaseList`   | `/diseases`       | LandType filter + Search + DiseaseGrid + Pagination |
| `DiseaseDetail` | `/diseases/:slug` | Tabs: Details, Remedies, Media                      |

```bash
git add . && git commit -m "feat: disease module — listing, detail, and filtering"
```

> **✅ Checkpoint**: Diseases display in grid, filter by land type, show detail page.

---

## Phase 6: Remedy Module

### Step 6.1: Create Types & Services

Follow the same pattern as Disease module:

1. Create `src/types/remedy.ts`
2. Create `src/services/remedyService.ts`
3. Create `src/hooks/useRemedies.ts`

### Step 6.2: Build Remedy Components

| #   | Component              | Description                                |
| --- | ---------------------- | ------------------------------------------ |
| 1   | `RemedyCard`           | Card with name, category badge, shelf life |
| 2   | `RemedyDetail`         | Full preparation guide, benefits, storage  |
| 3   | `RemedySteps`          | Step-by-step preparation renderer          |
| 4   | `RemedyCategoryFilter` | Filter by neem-based, cow-based, etc.      |

### Step 6.3: Build Remedy Pages

| Page           | Route             | Content                         |
| -------------- | ----------------- | ------------------------------- |
| `RemedyList`   | `/remedies`       | Category filter + search + grid |
| `RemedyDetail` | `/remedies/:slug` | Full remedy information         |

```bash
git add . && git commit -m "feat: remedy module — listing, detail, and categories"
```

> **✅ Checkpoint**: Remedies browsable by category with full detail pages.

---

## Phase 7: Disease ↔ Remedy Mapping

### Step 7.1: Display Linked Remedies on Disease Page

On the Disease Detail page, add a "Recommended Remedies" tab that shows:

```typescript
// filepath: src/components/disease/LinkedRemedies.tsx
// Query disease_remedies join and display as clickable RemedyCards
// Each card shows: remedy name, effectiveness badge, category
// Click navigates to /remedies/:slug
```

### Step 7.2: Display Related Diseases on Remedy Page

On the Remedy Detail page, add a "Used For" section:

```typescript
// filepath: src/components/remedy/RelatedDiseases.tsx
// Query disease_remedies join and display linked diseases
// Each shows: disease name, effectiveness
// Click navigates to /diseases/:slug
```

```bash
git add . && git commit -m "feat: disease-remedy cross-linking"
```

> **✅ Checkpoint**: Diseases show linked remedies and vice versa.

---

## Phase 8: Land Type System

### Step 8.1: Create Land Type Context

```typescript
// filepath: src/contexts/LandTypeContext.tsx
// Manage selected land type with localStorage persistence
// Provide landType, setLandType, landTypes (list)
// Fetch land_types from Supabase on mount
```

### Step 8.2: Integrate with Disease Filtering

- `LandTypeSelector` in Header writes to context
- `useDiseases` hook reads from context
- Disease grid auto-filters when land type changes

### Step 8.3: Onboarding Flow

First-time users see a land type selection screen before the home page. Selection is saved to `user_preferences` table.

```bash
git add . && git commit -m "feat: land type system with persistent selection"
```

> **✅ Checkpoint**: Diseases filter based on selected land type.

---

## Phase 9: Multi-Language (i18n)

### Step 9.1: Install i18n Dependencies

```bash
npm install react-i18next i18next i18next-browser-languagedetector
```

### Step 9.2: Create Translation Files

```json
// filepath: src/i18n/locales/en.json
{
    "common": {
        "appName": "Organic Crop Health",
        "search": "Search diseases, crops, remedies...",
        "landType": "Land Type",
        "language": "Language",
        "home": "Home",
        "diseases": "Diseases",
        "remedies": "Remedies",
        "myPreparations": "My Preparations",
        "settings": "Settings",
        "login": "Login",
        "register": "Register",
        "logout": "Logout",
        "loading": "Loading...",
        "noResults": "No results found",
        "verified": "Verified"
    },
    "diseases": {
        "title": "Crop Diseases",
        "symptoms": "Symptoms",
        "affectedCrops": "Affected Crops",
        "organicSolutions": "Organic Solutions",
        "recommendedRemedies": "Recommended Remedies",
        "aliases": "Also Known As",
        "media": "Photos & Videos"
    },
    "remedies": {
        "title": "Organic Remedies",
        "preparation": "How to Prepare",
        "modeOfAction": "How It Works",
        "benefits": "Benefits",
        "application": "How to Apply",
        "storage": "Storage",
        "shelfLife": "Shelf Life",
        "days": "days"
    },
    "preparations": {
        "title": "My Preparations",
        "preparedOn": "Prepared on",
        "expiresOn": "Expires on",
        "daysLeft": "{{count}} day left",
        "daysLeft_plural": "{{count}} days left",
        "expired": "Expired",
        "expiringSoon": "Expiring Soon",
        "addNew": "Add Preparation",
        "quantity": "Quantity",
        "notes": "Notes",
        "status": "Status"
    },
    "auth": {
        "email": "Email",
        "password": "Password",
        "name": "Full Name",
        "loginTitle": "Welcome Back",
        "registerTitle": "Create Account",
        "orContinueWith": "Or continue with",
        "noAccount": "Don't have an account?",
        "hasAccount": "Already have an account?"
    }
}
```

```json
// filepath: src/i18n/locales/te.json
{
    "common": {
        "appName": "సేంద్రీయ పంట ఆరోగ్యం",
        "search": "వ్యాధులు, పంటలు, మందుల కోసం వెతకండి...",
        "landType": "భూమి రకం",
        "language": "భాష",
        "home": "హోమ్",
        "diseases": "వ్యాధులు",
        "remedies": "మందులు",
        "myPreparations": "నా తయారీలు",
        "settings": "సెట్టింగ్‌లు",
        "login": "లాగిన్",
        "register": "నమోదు",
        "logout": "లాగ్ అవుట్",
        "loading": "లోడ్ అవుతోంది...",
        "noResults": "ఫలితాలు లేవు",
        "verified": "ధృవీకరించబడింది"
    },
    "diseases": {
        "title": "పంట వ్యాధులు",
        "symptoms": "లక్షణాలు",
        "affectedCrops": "ప్రభావిత పంటలు",
        "organicSolutions": "సేంద్రీయ పరిష్కారాలు",
        "recommendedRemedies": "సిఫార్సు చేసిన మందులు",
        "aliases": "ఇతర పేర్లు",
        "media": "ఫోటోలు & వీడియోలు"
    },
    "remedies": {
        "title": "సేంద్రీయ మందులు",
        "preparation": "ఎలా తయారు చేయాలి",
        "modeOfAction": "ఎలా పని చేస్తుంది",
        "benefits": "ప్రయోజనాలు",
        "application": "ఎలా వాడాలి",
        "storage": "నిల్వ",
        "shelfLife": "షెల్ఫ్ లైఫ్",
        "days": "రోజులు"
    },
    "preparations": {
        "title": "నా తయారీలు",
        "preparedOn": "తయారు చేసిన తేదీ",
        "expiresOn": "గడువు తేదీ",
        "daysLeft": "{{count}} రోజు మిగిలింది",
        "daysLeft_plural": "{{count}} రోజులు మిగిలినవి",
        "expired": "గడువు ముగిసింది",
        "expiringSoon": "గడువు దగ్గరలో ఉంది",
        "addNew": "తయారీ జోడించండి",
        "quantity": "పరిమాణం",
        "notes": "నోట్స్",
        "status": "స్థితి"
    },
    "auth": {
        "email": "ఇమెయిల్",
        "password": "పాస్‌వర్డ్",
        "name": "పూర్తి పేరు",
        "loginTitle": "తిరిగి స్వాగతం",
        "registerTitle": "ఖాతా సృష్టించండి",
        "orContinueWith": "లేదా దీనితో కొనసాగించండి",
        "noAccount": "ఖాతా లేదా?",
        "hasAccount": "ఖాతా ఉందా?"
    }
}
```

### Step 9.3: Configure i18n

```typescript
// filepath: src/i18n/config.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import te from './locales/te.json'

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            te: { translation: te },
        },
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    })

export default i18n
```

### Step 9.4: Add i18n to App Entry

```typescript
// filepath: src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './i18n/config'  // Initialize i18n
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Step 9.5: Update Components with i18n

Replace all hardcoded strings with `t()` calls:

```typescript
import { useTranslation } from 'react-i18next'

function Header() {
  const { t, i18n } = useTranslation()
  return <h1>{t('common.appName')}</h1>
}
```

### Step 9.6: Dynamic Content Language

Database content uses the `language` field — filter based on `i18n.language`:

```typescript
const { i18n } = useTranslation()
const { data } = useDiseases({ language: i18n.language })
```

```bash
git add . && git commit -m "feat: multi-language support (English + Telugu)"
```

> **✅ Checkpoint**: Full app available in English and Telugu with instant switching.

---

## Phase 10: Media Upload (Cloudinary)

### Step 10.1: Configure Cloudinary

1. Go to [cloudinary.com/console](https://cloudinary.com/console)
2. Copy **Cloud Name**
3. Create an **unsigned upload preset** (Settings → Upload → Add Upload Preset)
4. Add to `.env.local`:

```bash
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

### Step 10.2: Install Cloudinary SDK

```bash
npm install @cloudinary/url-gen @cloudinary/react
```

### Step 10.3: Create Upload Service

```typescript
// filepath: src/services/mediaService.ts
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadImage(file: File, folder: string = 'diseases') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('folder', `organic-crop/${folder}`)

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData },
    )

    if (!response.ok) throw new Error('Upload failed')
    return response.json() // { secure_url, public_id, ... }
}

export async function uploadVideo(file: File, folder: string = 'diseases') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('folder', `organic-crop/${folder}`)
    formData.append('resource_type', 'video')

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        { method: 'POST', body: formData },
    )

    if (!response.ok) throw new Error('Upload failed')
    return response.json()
}
```

### Step 10.4: Build Upload Component

Create `ImageUpload.tsx` with:

- Drag & drop zone
- File type validation (JPEG, PNG, WebP for images; MP4 for video)
- Size limit (10MB images, 50MB video)
- Upload progress indicator
- Preview after upload

```bash
git add . && git commit -m "feat: Cloudinary image/video upload integration"
```

> **✅ Checkpoint**: Users can upload disease images/videos stored on Cloudinary CDN.

---

## Phase 11: Custom API Layer (Vercel)

This is the **"Hybrid" piece** — custom serverless functions for complex logic.

### Step 11.1: Configure Vercel for API Routes

```json
// filepath: vercel.json
{
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "framework": "vite",
    "rewrites": [
        { "source": "/api/(.*)", "destination": "/api/$1" },
        { "source": "/(.*)", "destination": "/index.html" }
    ],
    "crons": [
        {
            "path": "/api/cron/check-expiry",
            "schedule": "0 6 * * *"
        }
    ]
}
```

### Step 11.2: Create Auth Middleware

```typescript
// filepath: api/middleware/auth.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export interface AuthUser {
    id: string
    email: string
    role: 'farmer' | 'expert' | 'admin'
}

export async function authenticateRequest(
    req: Request,
): Promise<AuthUser | null> {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return null

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser(token)
    if (error || !user) return null

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    return {
        id: user.id,
        email: user.email!,
        role: profile?.role ?? 'farmer',
    }
}

export function requireRole(...roles: string[]) {
    return async (req: Request): Promise<AuthUser | Response> => {
        const user = await authenticateRequest(req)
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            })
        }
        if (!roles.includes(user.role)) {
            return new Response(JSON.stringify({ error: 'Forbidden' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            })
        }
        return user
    }
}
```

### Step 11.3: Create Validation Middleware

```typescript
// filepath: api/middleware/validate.ts
import { z, type ZodSchema } from 'zod'

export async function validateBody<T>(
    req: Request,
    schema: ZodSchema<T>,
): Promise<T | Response> {
    try {
        const body = await req.json()
        return schema.parse(body)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify({ errors: error.issues }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }
        return new Response(JSON.stringify({ error: 'Invalid request body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
```

### Step 11.4: Create Disease API Route (Expert/Admin only)

```typescript
// filepath: api/diseases/route.ts
import { z } from 'zod'
import { requireRole } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const createDiseaseSchema = z.object({
    slug: z
        .string()
        .min(3)
        .max(100)
        .regex(/^[a-z0-9-]+$/),
    affected_crops: z.array(z.string()).min(1),
    land_type_ids: z.array(z.number()).min(1),
    translations: z
        .array(
            z.object({
                language: z.enum(['en', 'te']),
                title: z.string().min(3),
                description: z.string().min(10),
                symptoms: z.string().optional(),
                organic_solutions: z.string().optional(),
                aliases: z.array(z.string()).optional(),
            }),
        )
        .min(1),
})

export async function POST(req: Request) {
    // 1. Auth + Role check
    const auth = await requireRole('expert', 'admin')(req)
    if (auth instanceof Response) return auth

    // 2. Validate
    const data = await validateBody(req, createDiseaseSchema)
    if (data instanceof Response) return data

    // 3. Create disease
    const { data: disease, error: diseaseError } = await supabase
        .from('diseases')
        .insert({
            slug: data.slug,
            affected_crops: data.affected_crops,
            land_type_ids: data.land_type_ids,
            created_by: auth.id,
        })
        .select()
        .single()

    if (diseaseError) {
        return new Response(JSON.stringify({ error: diseaseError.message }), {
            status: 500,
        })
    }

    // 4. Create translations
    const translations = data.translations.map((t) => ({
        disease_id: disease.id,
        ...t,
    }))

    await supabase.from('disease_translations').insert(translations)

    // 5. Audit log
    await supabase.from('audit_logs').insert({
        user_id: auth.id,
        action: 'disease_created',
        resource_type: 'disease',
        resource_id: disease.id,
        metadata: { slug: data.slug },
    })

    return new Response(JSON.stringify({ data: disease }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    })
}
```

### Step 11.5: Create API Client on Frontend

```typescript
// filepath: src/services/api.ts
const API_BASE = '/api'

async function getAccessToken(): Promise<string> {
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? ''
}

async function fetchAPI(path: string, options: RequestInit = {}) {
    const token = await getAccessToken()
    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'API request failed')
    }

    return response.json()
}

// Disease operations (expert/admin only)
export const createDisease = (data: CreateDiseaseInput) =>
    fetchAPI('/diseases', { method: 'POST', body: JSON.stringify(data) })

// Preparation operations (authenticated users)
export const createPreparation = (data: CreatePreparationInput) =>
    fetchAPI('/preparations', { method: 'POST', body: JSON.stringify(data) })

export const getExpiringPreparations = () => fetchAPI('/preparations/expiring')
```

```bash
git add . && git commit -m "feat: Vercel API routes with auth middleware and validation"
```

> **✅ Checkpoint**: Custom API layer running with role-based access and server-side validation.

---

## Phase 12: Preparation Lifecycle Tracking

### Step 12.1: Create Preparation API Route

```typescript
// filepath: api/preparations/route.ts
// Handles:
// - POST: Create preparation with auto-calculated expiry date
// - GET: List user's preparations with status
// - PUT: Update preparation (mark as used, edit notes)
// - DELETE: Remove preparation
```

Key business logic (server-side):

```typescript
// Auto-calculate expiry date
const expiryDate = new Date(data.preparedDate)
expiryDate.setDate(expiryDate.getDate() + shelfLifeDays)

// Determine status based on current date
const today = new Date()
const status = expiryDate < today ? 'expired' : 'active'
```

### Step 12.2: Build Preparation Components

| #   | Component         | Description                                                 |
| --- | ----------------- | ----------------------------------------------------------- |
| 1   | `PreparationForm` | Form to add new preparation (select remedy, date, quantity) |
| 2   | `PreparationList` | List all preparations with status badges                    |
| 3   | `PreparationCard` | Individual prep card with expiry countdown                  |
| 4   | `ExpiryTimeline`  | Visual timeline showing upcoming expirations                |
| 5   | `AlertBanner`     | Top banner for expiring/expired items                       |

### Step 12.3: Expiry Status Logic

```typescript
// filepath: src/utils/expiryCalculator.ts
import { differenceInDays, isPast } from 'date-fns'

export function getExpiryStatus(expiryDate: Date) {
    const today = new Date()
    const daysLeft = differenceInDays(expiryDate, today)

    if (isPast(expiryDate))
        return { status: 'expired', daysLeft: 0, color: 'red' }
    if (daysLeft <= 3)
        return { status: 'expiring-soon', daysLeft, color: 'amber' }
    if (daysLeft <= 7) return { status: 'warning', daysLeft, color: 'yellow' }
    return { status: 'active', daysLeft, color: 'green' }
}
```

```bash
git add . && git commit -m "feat: preparation lifecycle tracking with expiry calculation"
```

> **✅ Checkpoint**: Users can log preparations, see expiry countdowns, and manage batches.

---

## Phase 13: Notification & Expiry Alert System

### Step 13.1: Create Cron Job API Route

```typescript
// filepath: api/cron/check-expiry/route.ts
import { createClient } from '@supabase/supabase-js'

export async function GET(req: Request) {
    // Verify cron secret
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 })
    }

    const supabase = createClient(
        process.env.VITE_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)

    // Find preparations expiring within 3 days that haven't been alerted
    const { data: expiring } = await supabase
        .from('preparations')
        .select(
            'id, user_id, expiry_date, remedy_id, remedies(slug, remedy_translations(name, language))',
        )
        .lte('expiry_date', threeDaysFromNow.toISOString())
        .eq('status', 'active')
        .eq('alert_sent', false)

    let alertCount = 0

    for (const prep of expiring ?? []) {
        const isExpired = new Date(prep.expiry_date) <= new Date()
        const enName = prep.remedies?.remedy_translations?.find(
            (t: any) => t.language === 'en',
        )?.name
        const teName = prep.remedies?.remedy_translations?.find(
            (t: any) => t.language === 'te',
        )?.name

        await supabase.from('notifications').insert({
            user_id: prep.user_id,
            type: isExpired ? 'expired' : 'expiring_soon',
            title_en: isExpired
                ? `${enName} has expired`
                : `${enName} is expiring soon`,
            title_te: isExpired
                ? `${teName} గడువు ముగిసింది`
                : `${teName} గడువు దగ్గరలో ఉంది`,
            related_id: prep.id,
        })

        // Update preparation
        await supabase
            .from('preparations')
            .update({
                alert_sent: true,
                status: isExpired ? 'expired' : 'active',
            })
            .eq('id', prep.id)

        alertCount++
    }

    return new Response(
        JSON.stringify({
            processed: alertCount,
            timestamp: new Date().toISOString(),
        }),
    )
}
```

### Step 13.2: Build Notification Bell Component

```typescript
// filepath: src/components/common/NotificationBell.tsx
// - Shows unread count badge
// - Dropdown with notification list
// - Click marks as read
// - Uses Supabase Realtime for live updates
```

### Step 13.3: Enable Realtime Notifications

```typescript
// Subscribe to new notifications
useEffect(() => {
    const channel = supabase
        .channel('notifications')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
                // Show toast and update notification count
            },
        )
        .subscribe()

    return () => {
        supabase.removeChannel(channel)
    }
}, [user.id])
```

```bash
git add . && git commit -m "feat: notification system with cron-based expiry alerts"
```

> **✅ Checkpoint**: Daily cron checks expiry, creates notifications, users see alerts in real-time.

---

## Phase 14: Search System

### Step 14.1: Implement Full-Text Search

```typescript
// filepath: src/services/searchService.ts
import { supabase } from './supabase'

export async function searchDiseases(query: string, language: string = 'en') {
    return supabase
        .from('disease_translations')
        .select(
            `
      *,
      diseases(*, disease_media(*))
    `,
        )
        .eq('language', language)
        .or(
            `title.ilike.%${query}%,description.ilike.%${query}%,aliases.cs.{${query}}`,
        )
        .limit(20)
}

export async function searchRemedies(query: string, language: string = 'en') {
    return supabase
        .from('remedy_translations')
        .select(
            `
      *,
      remedies(*)
    `,
        )
        .eq('language', language)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(20)
}

export async function unifiedSearch(query: string, language: string = 'en') {
    const [diseases, remedies] = await Promise.all([
        searchDiseases(query, language),
        searchRemedies(query, language),
    ])
    return { diseases: diseases.data, remedies: remedies.data }
}
```

### Step 14.2: Build Search UI

- Debounced search input in Header (300ms)
- Dropdown with categorized results (Diseases / Remedies)
- Keyboard navigation support
- "No results" state with suggestions

```bash
git add . && git commit -m "feat: unified search across diseases, remedies, and aliases"
```

> **✅ Checkpoint**: Users can search by disease name, alias, crop, or remedy.

---

## Phase 15: User Dashboard

### Step 15.1: My Preparations Page

Complete dashboard showing:

- Active preparations with expiry countdown
- Expiring soon (highlighted)
- Expired preparations
- "Add New Preparation" button
- Filter by status (active/expired/used)

### Step 15.2: Settings Page

| Setting       | Description              |
| ------------- | ------------------------ |
| Profile       | Edit name, phone         |
| Land Type     | Change default land type |
| Language      | Set preferred language   |
| Notifications | Toggle alerts on/off     |

```bash
git add . && git commit -m "feat: user dashboard with preparations and settings"
```

> **✅ Checkpoint**: Full user dashboard with preparation management and settings.

---

## Phase 16: Admin Panel

### Step 16.1: Admin Routes (Server-Side)

```typescript
// filepath: api/admin/route.ts
// GET /api/admin/stats — Dashboard statistics
// GET /api/admin/users — List all users
// PUT /api/admin/users/:id/role — Change user role
// PUT /api/admin/diseases/:id/verify — Verify a disease
// DELETE /api/admin/diseases/:id — Delete a disease
```

### Step 16.2: Admin Frontend

| Page             | Route             | Access     |
| ---------------- | ----------------- | ---------- |
| `AdminDashboard` | `/admin`          | Admin only |
| `AdminUsers`     | `/admin/users`    | Admin only |
| `AdminDiseases`  | `/admin/diseases` | Admin only |
| `AdminRemedies`  | `/admin/remedies` | Admin only |

Dashboard shows:

- Total users, diseases, remedies
- Unverified disease submissions
- Recent activity log

```bash
git add . && git commit -m "feat: admin panel with user management and content moderation"
```

> **✅ Checkpoint**: Admins can manage users, verify diseases, and view analytics.

---

## Phase 17: PWA & Offline Support

### Step 17.1: Install PWA Plugin

```bash
npm install -D vite-plugin-pwa
```

### Step 17.2: Configure PWA

```typescript
// filepath: vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
            manifest: {
                name: 'Organic Crop Health',
                short_name: 'CropHealth',
                description:
                    'Identify crop diseases and discover organic remedies',
                theme_color: '#16a34a',
                background_color: '#ffffff',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: '/icons/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/icons/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/.*supabase\.co\/rest/,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            expiration: { maxEntries: 50 },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/res\.cloudinary\.com/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'image-cache',
                            expiration: { maxEntries: 100 },
                        },
                    },
                ],
            },
        }),
    ],
})
```

```bash
git add . && git commit -m "feat: PWA support with offline caching"
```

> **✅ Checkpoint**: App installable on mobile, works offline for cached content.

---

## Phase 18: Testing

### Step 18.1: Configure Vitest

```typescript
// filepath: vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        css: true,
    },
    resolve: {
        alias: { '@': '/src' },
    },
})
```

### Step 18.2: Write Tests

| Category       | Files                                              | Priority |
| -------------- | -------------------------------------------------- | -------- |
| **Utils**      | `expiryCalculator.test.ts`, `dateUtils.test.ts`    | High     |
| **Hooks**      | `useDiseases.test.ts`, `useAuth.test.ts`           | High     |
| **Components** | `DiseaseCard.test.tsx`, `PreparationForm.test.tsx` | Medium   |
| **Services**   | `diseaseService.test.ts`, `searchService.test.ts`  | Medium   |
| **Pages**      | `Home.test.tsx`, `DiseaseDetail.test.tsx`          | Low      |

### Step 18.3: Add Test Scripts

```json
// package.json scripts
{
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
}
```

```bash
npm run test
git add . && git commit -m "test: unit and component tests"
```

> **✅ Checkpoint**: Core logic covered with tests, CI will run them on every push.

---

## Phase 19: CI/CD & Deployment

### Step 19.1: GitHub Actions CI

```yaml
# filepath: .github/workflows/ci.yml
name: CI

on:
    push:
        branches: [main, develop]
    pull_request:
        branches: [main]

jobs:
    quality:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4

            - name: Setup Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: '20'
                  cache: 'npm'

            - name: Install dependencies
              run: npm ci

            - name: Lint
              run: npm run lint

            - name: Type check
              run: npx tsc --noEmit

            - name: Run tests
              run: npm run test -- --run

            - name: Build
              run: npm run build
              env:
                  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
                  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
                  VITE_CLOUDINARY_CLOUD_NAME: ${{ secrets.VITE_CLOUDINARY_CLOUD_NAME }}
```

### Step 19.2: Connect Vercel to GitHub

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Set environment variables:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY`
    - `VITE_CLOUDINARY_CLOUD_NAME`
    - `VITE_CLOUDINARY_UPLOAD_PRESET`
    - `VITE_SENTRY_DSN`
    - `CRON_SECRET` (generate a random string)
4. Deploy

### Step 19.3: Setup Cloudflare DNS (Optional)

1. Add custom domain in Vercel
2. Point DNS to Vercel in Cloudflare
3. Enable proxy mode for CDN + DDoS protection

### Step 19.4: Branch Strategy

```
main ───────────────────────► Production (vercel.app)
  │
  └── develop ──────────────► Staging (staging.vercel.app)
       │
       └── feature/* ───────► Preview (preview-xxx.vercel.app)
```

```bash
git add . && git commit -m "ci: GitHub Actions pipeline + Vercel deployment"
git push origin main
```

> **✅ Checkpoint**: Auto-deploy on every push. Preview URLs for PRs.

---

## Phase 20: Monitoring & Launch

### Step 20.1: Setup Sentry

```bash
npm install @sentry/react
```

```typescript
// filepath: src/main.tsx (add before ReactDOM.createRoot)
import * as Sentry from '@sentry/react'

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
    environment: import.meta.env.MODE,
})
```

### Step 20.2: Enable Vercel Analytics

```bash
npm install @vercel/analytics @vercel/speed-insights
```

```typescript
// filepath: src/App.tsx (add inside Router)
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

// Inside App return:
<>
  <Routes>...</Routes>
  <Analytics />
  <SpeedInsights />
</>
```

### Step 20.3: Pre-Launch Checklist

| #   | Check                                               | Status |
| --- | --------------------------------------------------- | ------ |
| 1   | All pages render correctly in English and Telugu    | ☐      |
| 2   | Authentication flow works (signup, login, logout)   | ☐      |
| 3   | Disease listing with land type filter works         | ☐      |
| 4   | Disease detail with linked remedies shows correctly | ☐      |
| 5   | Remedy detail with preparation steps renders        | ☐      |
| 6   | Image/video upload to Cloudinary works              | ☐      |
| 7   | Preparation tracking with expiry works              | ☐      |
| 8   | Notifications appear for expiring preparations      | ☐      |
| 9   | Search returns results for diseases and remedies    | ☐      |
| 10  | Mobile responsive on small screens (360px+)         | ☐      |
| 11  | PWA installable on Android/iOS                      | ☐      |
| 12  | Admin panel accessible only to admin role           | ☐      |
| 13  | No console errors in production build               | ☐      |
| 14  | Lighthouse scores > 90 (performance, a11y)          | ☐      |
| 15  | Error tracking in Sentry working                    | ☐      |
| 16  | Cron job firing daily for expiry check              | ☐      |
| 17  | Environment variables set in Vercel                 | ☐      |
| 18  | Custom domain configured (if applicable)            | ☐      |

### Step 20.4: Launch

```bash
git tag v1.0.0
git push origin v1.0.0
```

> **✅ Checkpoint**: App live in production with monitoring.

---

## Post-Launch: AI Integration Roadmap

These features plug into the existing Hybrid architecture with **zero changes to existing code**.

### Phase 2A: Image-Based Disease Detection (Month 6)

```bash
# Add to existing project
mkdir -p api/ai/detect
# Create api/ai/detect/route.ts
# Add @huggingface/inference to package.json
# Create src/components/ai/DiseaseScanner.tsx
```

See [architecture-AI-integration.md](architecture-AI-integration.md) for complete implementation.

### Phase 2B: AI-Powered Smart Search (Month 8)

```bash
mkdir -p api/ai/search
# Create api/ai/search/route.ts using Google Gemini
# Enhance SearchBar with natural language understanding
```

### Phase 2C: AI Chatbot (Month 10)

```bash
mkdir -p api/ai/chat
# Create api/ai/chat/route.ts
# Create src/components/ai/AIChatbot.tsx
# Add @google/generative-ai to package.json
```

### Phase 2D: Voice Input (Month 12)

```bash
# Uses Web Speech API — browser-native, no backend changes
# Create src/components/ai/VoiceInput.tsx
# Integrate with SmartSearch
```

---

## Quick Reference: Git Commit History

```
chore: initial project setup with Vite + React + TypeScript
feat: database schema, RLS policies, and seed data
feat: authentication with Supabase Auth + user profiles
feat: layout, navigation, and routing
feat: disease module — listing, detail, and filtering
feat: remedy module — listing, detail, and categories
feat: disease-remedy cross-linking
feat: land type system with persistent selection
feat: multi-language support (English + Telugu)
feat: Cloudinary image/video upload integration
feat: Vercel API routes with auth middleware and validation
feat: preparation lifecycle tracking with expiry calculation
feat: notification system with cron-based expiry alerts
feat: unified search across diseases, remedies, and aliases
feat: user dashboard with preparations and settings
feat: admin panel with user management and content moderation
feat: PWA support with offline caching
test: unit and component tests
ci: GitHub Actions pipeline + Vercel deployment
chore: Sentry + Vercel Analytics monitoring
release: v1.0.0 🚀
```

---

## Free Tier Resource Budget

| Service              | Phase 1 Usage | Free Limit  | Headroom |
| -------------------- | ------------- | ----------- | -------- |
| **Supabase DB**      | ~50 MB        | 500 MB      | 90%      |
| **Supabase API**     | ~50K/day      | Unlimited   | ∞        |
| **Supabase Auth**    | ~500 users    | 50K MAU     | 99%      |
| **Cloudinary**       | ~2 GB         | 25 GB       | 92%      |
| **Vercel Bandwidth** | ~10 GB        | 100 GB      | 90%      |
| **GitHub Actions**   | ~200 min      | 2,000 min   | 90%      |
| **Sentry**           | ~500 events   | 5,000/month | 90%      |

**Total Monthly Cost: $0.00**

export const districts = [
"Adilabad",
"Bhadradri Kothagudem",
"Hyderabad",
"Jagtial",
"Jangaon",
"Jayashankar Bhupalpally",
"Jogulamba Gadwal",
"Kamareddy",
"Karimnagar",
"Khammam",
"Komaram Bheem Asifabad",
"Mahabubabad",
"Mahabubnagar (Mahbubnagar)",
"Mancherial",
"Medak",
"Medchal-Malkajgiri",
"Mulugu",
"Nagarkurnool",
"Nalgonda",
"Narayanpet",
"Nirmal",
"Nizamabad",
"Peddapalli",
"Rajanna Sircilla",
"Ranga Reddy",
"Sangareddy",
"Siddipet",
"Suryapet",
"Vikarabad",
"Wanaparthy",
"Warangal Rural",
"Warangal Urban",
"Yadadri Bhuvanagiri",
];

export interface LandType {
id: string; // UUID
name: string;
isVerified: boolean;
phRange?: [string, string];
organicMatter?: [string, string]; // Low to Medium (0.3-0.7%)
waterRetention?: [string, string]; // Low to Moderate
districts: string[];
majorCrops: string[];
characteristics: string;
}

export interface Crop {
id: string; // UUID
name: string;
scientificName?: string;
type: "vegetable" | "fruit" | "cereal" | "pulse" | "cash_crop" | "spice";
isVerified: boolean;
suitableLandTypes: string[]; // List of LandType IDs
image_url?: string;
seasons?: [
{
name: string; // e.g., "Kharif", "Rabi", "Zaid"
months: string[]; // e.g., ["June", "July", "August"]
},
];
districts: string[];
popularVarieties?: string[]; // BPT 5204, MTU 1010, RNR 15048, Telangana Sona, etc.
aliases?: string[]; // Local names, synonyms
}

export interface Disease {
[key: string]: [
// Crop name as key
{
id: string; // UUID
name: string;
type: string; // e.g., "fungal", "bacterial", "viral", "pest"
isVerified: boolean;
severity: "low" | "moderate" | "high";
symptoms: string[];
primaryCause: string; // pathogen
favorableConditions?: string[]; // e.g., "high humidity", "poor drainage", "insect vectors" // favorableConditions
prevention: string[]; // e.g., "crop rotation", "resistant varieties", "proper spacing"
treatment: string[]; // e.g., "organic methods" // organicRemedies
aliases?: string[]; // Local names, synonyms
},
];
}

// Organic Remedies (hand made)
export interface Remedy {
id: string; // UUID
name: string;
isVerified: boolean;
type: string; // e.g., "Bio-fungicide", "Bio-bactericide", "Bio-insecticide", "Organic Spray", "Cultural Practice"
target?: string;
modeOfAction?: string | null; // e.g., "Neem oil disrupts insect hormones, reducing feeding and reproduction."
application?: string | null; // e.g., "Spray neem oil solution on affected plants every 7-14 days."
preparation?: string | null; // e.g., "Mix 1 part neem oil with 10 parts water and a few drops of mild soap."
ingredients?: string[] | null;
effectiveness: string; // e.g., "High", "Moderate", "Low"
aliases?: string[]; // Local names, synonyms
}

// This is my primitive data model for the RythuNetra app. It includes a list of districts in Telangana, and four main interfaces: LandType, Crop, Disease, and Remedy.
// How to design the data model that promotes scalability, maintainability, and ease of use is a complex topic. Here are some considerations for the current design:

TASKS:

- Preview images
- Play videos

The app divided by two major parts:

1. Knowledge based
2. User specific

Knowledge based:

- Currently, Crops, Remedies, and Diseases are accessible for "any" user.
  User specific:
- My preparations is accessible for 'farmer' users along with Crops, Remedies, and Diseases.

What more (ONLY most important) features can be implement for farmers?.

The full creation order is:
**Soil Types → Crops → Crop Varieties → Diseases → Remedies**
