# RythuNetra — Organic Agriculture Advisory Platform

> A comprehensive web platform for organic farmers in Telangana, India — featuring AI-powered disease scanning, crop recommendations, bilingual support (English + Telugu), and a curated knowledge base of diseases, remedies, and crops.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [AI Integration](#ai-integration)
- [Internationalization (i18n)](#internationalization-i18n)
- [Authentication & Authorization](#authentication--authorization)
- [Weather Integration](#weather-integration)
- [Frontend Architecture](#frontend-architecture)
- [Admin Panel](#admin-panel)
- [Configuration](#configuration)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Author](#author)

---

## Overview

RythuNetra is an **organic-first agricultural advisory platform** built specifically for small-scale farmers in **Telangana, India**. It combines a curated knowledge base of crops, diseases, and organic remedies with AI-powered tools to help farmers identify plant diseases, get personalized crop recommendations, and access expert advice — all in their native language (Telugu).

### Philosophy

- **Organic only** — No chemical pesticides, synthetic fungicides, or chemical fertilizers are ever recommended. All remedies use neem-based solutions, bio-agents (Trichoderma, Pseudomonas), botanical extracts, and cultural practices.
- **Bilingual** — All UI text and database content is available in both English and Telugu.
- **Region-specific** — Tailored for Telangana's 33 districts and 520+ mandals with local crop varieties, soil types, and weather data.

---

## Key Features

| Feature                 | Description                                                                                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Crop Browser**        | Browse crops by type, view varieties with detailed seasons, districts, and characteristics                                                               |
| **Disease Library**     | Searchable, filterable disease database with symptoms, causes, preventions, and treatments                                                               |
| **AI Disease Scanner**  | Upload or capture a plant photo → AI identifies the disease, severity, and suggests organic remedies. Cross-references results with the curated database |
| **AI Crop Recommender** | Input soil type, pH, season, district → get ranked crop suggestions with suitability scores and yield estimates                                          |
| **AI Chat Advisor**     | Conversational AI assistant for farming advice — weather-aware, context-aware, with persistent chat history                                              |
| **My Preparations**     | Track organic remedy batches with quantities, notes, photos, and videos                                                                                  |
| **Weather Context**     | Real-time weather data from OpenWeatherMap integrated into AI features for actionable advice                                                             |
| **Admin Panel**         | Full CRUD for diseases, remedies, crops, and crop varieties with auto-translation (EN → TE)                                                              |
| **Bilingual UI**        | Toggle between English and Telugu throughout — both UI strings and database content                                                                      |

---

## Tech Stack

### Frontend

| Technology      | Version | Purpose                   |
| --------------- | ------- | ------------------------- |
| React           | 19.x    | UI framework              |
| TypeScript      | 5.9.x   | Type safety               |
| Vite            | 7.x     | Build tool & dev server   |
| Tailwind CSS    | 4.x     | Utility-first styling     |
| TanStack Query  | 5.x     | Server state management   |
| React Router    | 7.x     | Client-side routing       |
| React Hook Form | 7.x     | Form management           |
| Zod             | 4.x     | Schema validation         |
| i18next         | 25.x    | Internationalization      |
| Lucide React    | 0.575.x | Icon library              |
| React Markdown  | 10.x    | Markdown rendering (chat) |

### Backend / Infrastructure

| Technology     | Purpose                                                   |
| -------------- | --------------------------------------------------------- |
| Supabase       | PostgreSQL database, authentication, storage, RLS         |
| Vercel         | Hosting & serverless API functions                        |
| Vercel AI SDK  | 6.x — AI model integration (streaming, structured output) |
| OpenWeatherMap | Real-time weather data                                    |

### AI Provider Support

RythuNetra supports **multiple AI providers** through a single configuration switch:

- Google Gemini
- OpenAI (GPT)
- Azure OpenAI
- Anthropic (Claude)
- Mistral
- Perplexity

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Frontend                         │
│  React + TypeScript + Tailwind CSS + TanStack Query  │
│                                                      │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐            │
│  │  Pages   │ │Components│ │  Hooks    │            │
│  │          │ │          │ │           │            │
│  │ Landing  │ │ Layout   │ │ useAuth   │            │
│  │ CropHome │ │ Header   │ │ useCrops  │            │
│  │ Diseases │ │ BottomNav│ │ useDiseases│           │
│  │ Scanner  │ │ ChatWidg.│ │ useAdmin  │            │
│  │ Chat     │ │ Forms    │ │ useLanguage│           │
│  │ Recomm.  │ │ Cards    │ │           │            │
│  │ Settings │ │          │ │           │            │
│  │ Admin/*  │ │          │ │           │            │
│  └──────────┘ └──────────┘ └───────────┘            │
│       │              │             │                 │
│       └──────────────┴─────────────┘                 │
│                      │                               │
│              ┌───────┴───────┐                       │
│              │   Services    │                       │
│              │               │                       │
│              │ cropService   │                       │
│              │ diseaseService│                       │
│              │ aiService     │                       │
│              │ adminService  │                       │
│              │ prepService   │                       │
│              └───────┬───────┘                       │
└──────────────────────┼───────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌───────────┐ ┌──────────────┐
│   Supabase   │ │ Vercel API│ │ OpenWeather  │
│              │ │ Functions │ │     Map      │
│ • PostgreSQL │ │           │ │              │
│ • Auth       │ │ /ai/scan  │ │ • Current    │
│ • Storage    │ │ /ai/chat  │ │ • Forecast   │
│ • RLS        │ │ /ai/rec.  │ │              │
└──────────────┘ └─────┬─────┘ └──────────────┘
                       │
                       ▼
                ┌──────────────┐
                │  AI Provider │
                │              │
                │ Google/OpenAI│
                │ Azure/Claude │
                │ Mistral/etc. │
                └──────────────┘
```

---

## Project Structure

```
rythunetra/
├── api/                          # Vercel serverless API functions
│   ├── ai/
│   │   ├── chat.ts               # Streaming AI chat endpoint
│   │   ├── config.ts             # Multi-provider AI model factory
│   │   ├── recommend.ts          # Soil-to-crop recommendation endpoint
│   │   ├── scan.ts               # Disease scanner endpoint + DB cross-ref
│   │   └── weather.ts            # OpenWeatherMap integration module
│   ├── diseases/
│   │   └── route.ts              # Admin disease creation endpoint
│   ├── preparations/
│   │   └── route.ts              # Farmer preparations CRUD endpoint
│   └── middleware/
│       ├── auth.ts               # JWT auth + role-based access control
│       └── validate.ts           # Zod schema validation middleware
│
├── data/                         # Reference datasets & documentation
│   ├── telangana_ap_*.json       # Agricultural datasets for the region
│   ├── list-of-mandals.json      # Official mandal data source
│   └── *.md                      # Architecture & data guides
│
├── public/icons/                 # App icons (PWA)
│
├── scripts/
│   └── generate-mandals.cjs      # Script to regenerate mandals.ts config
│
├── src/
│   ├── App.tsx                   # Root component with routing
│   ├── main.tsx                  # Entry point
│   ├── index.css                 # Global styles + Tailwind
│   │
│   ├── components/
│   │   ├── common/               # Shared UI components
│   │   │   ├── Layout.tsx        # App shell (Header + content + BottomNav)
│   │   │   ├── Header.tsx        # Desktop navigation header
│   │   │   ├── MobileHeader.tsx  # Mobile header with hamburger
│   │   │   ├── BottomNav.tsx     # Mobile bottom tab navigation
│   │   │   ├── Footer.tsx        # Page footer
│   │   │   ├── ChatWidget.tsx    # Floating chat button
│   │   │   ├── LanguageToggle.tsx# EN/TE language switcher
│   │   │   ├── ProtectedRoute.tsx# Auth guard (login required)
│   │   │   ├── AdminRoute.tsx    # Admin role guard
│   │   │   ├── GuestRoute.tsx    # Redirect if already logged in
│   │   │   ├── LoadingSpinner.tsx# Loading state component
│   │   │   ├── EmptyState.tsx    # Empty data placeholder
│   │   │   ├── CustomDropdown.tsx# Styled select dropdown
│   │   │   ├── MultiSelectDropdown.tsx # Multi-value select
│   │   │   └── GoogleIcon.tsx    # Google OAuth icon
│   │   ├── disease/              # Disease-specific components
│   │   └── preparation/          # Preparation components
│   │       ├── PreparationForm.tsx # Add/edit form with media upload
│   │       ├── PreparationCard.tsx # Card with lightbox & video modal
│   │       └── PreparationList.tsx # Grid of preparation cards
│   │
│   ├── config/                   # Frontend configuration
│   │   ├── env.ts                # Environment variable management
│   │   ├── cropTypes.ts          # 8 crop type definitions
│   │   ├── diseaseTypes.ts       # 4 disease type definitions
│   │   ├── districts.ts          # 33 Telangana districts
│   │   ├── mandals.ts            # 520 mandals with coordinates
│   │   ├── remedyTypes.ts        # 8 remedy type definitions
│   │   ├── seasons.ts            # 3 seasons (Kharif, Rabi, Zaid)
│   │   └── soilTypes.ts          # 4 soil types with sub-types
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx        # Supabase auth state provider
│   │   ├── definitions.ts        # Auth context type definitions
│   │   └── SoilTypeContext.tsx    # Soil type state provider
│   │
│   ├── hooks/
│   │   ├── useAuth.ts            # Auth state & actions
│   │   ├── useAdmin.ts           # Admin role check
│   │   ├── useCrops.ts           # Crop data queries
│   │   ├── useDiseases.ts        # Disease data queries
│   │   ├── useLanguage.ts        # Language management
│   │   └── useSoilType.ts        # Soil type state
│   │
│   ├── i18n/
│   │   ├── config.ts             # i18next initialization
│   │   └── locales/
│   │       ├── en.json           # English translations (~615 lines)
│   │       └── te.json           # Telugu translations (~615 lines)
│   │
│   ├── pages/
│   │   ├── Landing.tsx           # Marketing landing page
│   │   ├── CropHome.tsx          # Crop browser with search
│   │   ├── CropDetail.tsx        # Single crop view
│   │   ├── DiseaseList.tsx       # Disease listing with filters
│   │   ├── DiseaseDetail.tsx     # Single disease view
│   │   ├── Scanner.tsx           # AI disease scanner
│   │   ├── Chat.tsx              # AI chat advisor
│   │   ├── SoilRecommender.tsx   # AI crop recommender
│   │   ├── MyPreparations.tsx    # Farmer preparations CRUD
│   │   ├── Settings.tsx          # User settings
│   │   ├── Login.tsx             # Login page
│   │   ├── Register.tsx          # Registration page
│   │   ├── AuthCallback.tsx      # OAuth callback
│   │   └── admin/                # Admin panel pages
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminCropList.tsx
│   │       ├── AdminCropForm.tsx
│   │       ├── AdminCropVarietyList.tsx
│   │       ├── AdminCropVarietyForm.tsx
│   │       ├── AdminVarietyList.tsx
│   │       ├── AdminDiseaseList.tsx
│   │       ├── AdminDiseaseForm.tsx
│   │       ├── AdminRemedyList.tsx
│   │       └── AdminRemedyForm.tsx
│   │
│   ├── services/
│   │   ├── supabase.ts           # Supabase client instance
│   │   ├── cropService.ts        # Crop CRUD operations
│   │   ├── diseaseService.ts     # Disease queries
│   │   ├── aiService.ts          # AI scanner & chat client
│   │   ├── adminService.ts       # Admin CRUD (438 lines)
│   │   ├── preparationService.ts # Farmer preparations + file upload
│   │   └── translateService.ts   # EN→TE auto-translation
│   │
│   ├── types/
│   │   ├── crop.ts               # Crop & variety types
│   │   ├── disease.ts            # Disease types + transformer
│   │   ├── remedy.ts             # Remedy types + transformer
│   │   ├── preparation.ts        # Preparation types
│   │   ├── soilType.ts           # Soil type definitions
│   │   └── i18n.ts               # Localized text types
│   │
│   └── utils/
│       ├── cn.ts                 # Tailwind class merging (clsx + twMerge)
│       ├── cropImages.ts         # Crop image fallbacks
│       ├── dateUtils.ts          # Date formatting helpers
│       └── expiryCalculator.ts   # Remedy expiry calculation
│
├── supabase/
│   └── migrations/
│       ├── 001_schema.sql        # Full database schema + RLS policies
│       └── 002_seed.sql          # Seed data
│
├── vite.config.ts                # Vite configuration
├── vite-api-plugin.ts            # Custom plugin for local API dev
├── vercel.json                   # Vercel deployment config
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.js              # ESLint configuration
├── package.json                  # Dependencies & scripts
└── .env                          # Environment variables (not committed)
```

---

## Database Schema

RythuNetra uses **Supabase (PostgreSQL)** with a JSONB-based schema for bilingual content. All translatable fields are stored as `{en: "...", te: "..."}` objects.

### Entity Relationship Diagram

```
┌─────────────────┐     ┌────────────────────────┐     ┌──────────────────┐
│     crops       │     │    crop_varieties       │     │    diseases      │
│─────────────────│     │────────────────────────│     │──────────────────│
│ id (UUID, PK)   │◄───┤ major_crop (FK)         │     │ id (UUID, PK)    │
│ name (JSONB)    │     │ id (UUID, PK)           │     │ name (JSONB)     │
│ crop_type(JSONB)│     │ name (JSONB)            │     │ type (JSONB)     │
│ image_url       │     │ image_url               │     │ severity         │
│ aliases (JSONB) │     │ recommended_seasons     │     │ image_urls       │
│ suitable_soil_  │     │ districts (TEXT[])       │     │ symptoms (JSONB) │
│  types (JSONB)  │     │ grain_character (JSONB)  │     │ primary_cause    │
│ created_at      │     │ special_characteristics  │     │ preventions      │
└─────────────────┘     │ created_at              │     │ treatments       │
                        └───────────┬─────────────┘     │ aliases (JSONB)  │
                                    │                    └────────┬─────────┘
                                    │                             │
                        ┌───────────┴─────────────┐   ┌──────────┴──────────┐
                        │ crop_variety_diseases    │   │  disease_remedies   │
                        │ (junction)               │   │  (junction)         │
                        │──────────────────────────│   │─────────────────────│
                        │ crop_variety_id (FK, PK) │   │ disease_id (FK, PK) │
                        │ disease_id (FK, PK)      │   │ remedy_id (FK, PK)  │
                        └──────────────────────────┘   └──────────┬──────────┘
                                                                  │
                                                       ┌──────────┴──────────┐
                                                       │     remedies        │
                                                       │─────────────────────│
                                                       │ id (UUID, PK)       │
                                                       │ name (JSONB)        │
                                                       │ type (JSONB)        │
                                                       │ how_it_works (JSONB)│
                                                       │ usage_instructions  │
                                                       │ preparation_instr.  │
                                                       │ ingredients (JSONB) │
                                                       │ effectiveness       │
                                                       │ aliases (JSONB)     │
                                                       └─────────────────────┘

┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────┐
│   user_profiles      │   │    scan_results      │   │  preparations    │
│──────────────────────│   │──────────────────────│   │──────────────────│
│ id (FK→auth.users)   │   │ id (UUID, PK)        │   │ id (UUID, PK)    │
│ name                 │   │ user_id (FK)          │   │ user_id (FK)     │
│ phone                │   │ image_url             │   │ remedy_name      │
│ district             │   │ crop_name             │   │ quantity         │
│ mandal               │   │ disease_name          │   │ preparation_notes│
│ role (farmer/admin)  │   │ severity              │   │ image_urls[]     │
│ preferred_language   │   │ confidence            │   │ video_url        │
└──────────────────────┘   │ result (JSONB)        │   │ created_at       │
                           └──────────────────────┘   └──────────────────┘

┌──────────────────────┐   ┌──────────────────────┐
│   chat_sessions      │   │    chat_messages      │
│──────────────────────│   │──────────────────────│
│ id (UUID, PK)        │◄──┤ session_id (FK)       │
│ user_id (FK)          │   │ id (UUID, PK)        │
│ title                 │   │ role (user/assistant) │
│ created_at            │   │ content              │
│ updated_at            │   │ created_at           │
└──────────────────────┘   └──────────────────────┘
```

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

| Table                                          | SELECT               | INSERT     | UPDATE     | DELETE     |
| ---------------------------------------------- | -------------------- | ---------- | ---------- | ---------- |
| Content (crops, diseases, remedies, junctions) | Public (auth + anon) | Admin only | Admin only | Admin only |
| `user_profiles`                                | Own + admin          | Own        | Own        | —          |
| `scan_results`                                 | Own                  | Own        | —          | Own        |
| `chat_sessions` / `chat_messages`              | Own                  | Own        | Own        | Own        |
| `preparations`                                 | Own                  | Own        | Own        | Own        |

---

## API Endpoints

All API routes are Vercel serverless functions in the `api/` directory.

### AI Endpoints

| Method | Route               | Auth | Description                                                                                                                                                            |
| ------ | ------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/ai/scan`      | None | Upload a plant image → returns AI diagnosis with disease name, severity (low/moderate/high/critical), confidence %, symptoms, organic remedies, and matched DB records |
| POST   | `/api/ai/chat`      | None | Streaming AI chat. Sends `messages[]`, `language`, `district`, `mandal`. Returns Server-Sent Events stream                                                             |
| POST   | `/api/ai/recommend` | None | Soil-to-crop recommendation. Sends soil type, pH, season, district, irrigation → returns 4-6 ranked crops with suitability scores                                      |

### Data Endpoints

| Method | Route               | Auth  | Description                           |
| ------ | ------------------- | ----- | ------------------------------------- |
| POST   | `/api/diseases`     | Admin | Create a new disease record           |
| GET    | `/api/preparations` | User  | Get authenticated user's preparations |
| POST   | `/api/preparations` | User  | Create a preparation record           |

---

## AI Integration

RythuNetra uses the **Vercel AI SDK v6** for all AI features.

### Multi-Provider Support

The AI provider is configured via environment variables — switch between providers by changing `AI_PROVIDER`:

```env
AI_PROVIDER=google          # google | openai | azure | anthropic | mistral | perplexity
AI_API_KEY=your-api-key
AI_MODEL=gemini-2.5-flash   # Model name for the chosen provider
```

### AI Features

#### 1. Disease Scanner (`/api/ai/scan`)

- Accepts a plant image (multipart form upload)
- Converts to base64 and sends to AI vision model
- Returns **structured JSON** using `Output.object()` with Zod schema:
    - `isPlant`, `cropName`, `diseaseDetected`, `diseaseName`
    - `severity`, `confidence`, `symptoms[]`, `causes[]`
    - `remedies[]` (typed as organic/biological/cultural)
    - `preventions[]`, `summary`, `summaryTe` (Telugu translation)
- **DB cross-reference**: After AI analysis, queries the `diseases` table by name. If a match is found, returns linked remedies from the curated database alongside AI-generated remedies.

#### 2. AI Chat Advisor (`/api/ai/chat`)

- Uses `streamText()` for real-time streaming responses
- Injects **weather context** (current conditions + 24h forecast) into system prompt
- Context includes: user's district/mandal, language preference
- System prompt enforces organic-only advice for Telangana farmers
- Chat sessions and messages are persisted in Supabase

#### 3. Crop Recommender (`/api/ai/recommend`)

- Uses `generateText()` with `Output.object()` for structured output
- Input: soil type, sub-type, pH level, season, district, mandal, irrigation
- Output: 4–6 crop recommendations, each with:
    - Crop name (EN + TE), suitability score (0–100)
    - Expected yield, growing tips, why it's suitable
- Results include weather-adaptive suggestions

### Model Configuration

```typescript
// api/ai/config.ts — factory pattern for AI models
export async function createModel(): Promise<LanguageModel> {
    // Returns the appropriate provider based on AI_PROVIDER env var
    // Supports: google, openai, azure, anthropic, mistral, perplexity
}
```

---

## Internationalization (i18n)

### Setup

- **Framework**: i18next + react-i18next + browser language detector
- **Languages**: English (`en`) and Telugu (`te`)
- **Detection**: localStorage → browser navigator
- **Fallback**: English

### UI Translations

Locale files at `src/i18n/locales/{en,te}.json` (~615 lines each) with 26 top-level sections:

`common`, `diseases`, `diseaseTypes`, `remedyTypes`, `remedies`, `preparations`, `auth`, `home`, `settings`, `errors`, `nav`, `admin`, `languages`, `districts`, `cropTypes`, `soilTypes`, `soilSubTypes`, `seasons`, `months`, `cropHome`, `cropDetail`, `scanner`, `recommend`, `chat`, `landing`

### Database Content

All database content uses **JSONB bilingual fields**:

```sql
name JSONB NOT NULL DEFAULT '{"en":"","te":""}'
-- Example: {"en": "Powdery Mildew", "te": "పౌడరీ మిల్డ్యూ"}
```

### Auto-Translation

Admin forms include an **auto-translate** button that translates English content to Telugu using Google Translate, with manual override capability.

---

## Authentication & Authorization

### Authentication

- **Provider**: Supabase Auth
- **Methods**:
    - Email/password sign-up with profile creation (name, district, mandal)
    - Google OAuth (redirect flow)
- **Session management**: Handled by Supabase client with auto-refresh

### Authorization

- **Two roles**: `farmer` (default) and `admin`
- **Frontend guards**:
    - `<ProtectedRoute />` — requires authentication
    - `<AdminRoute />` — requires admin role
    - `<GuestRoute />` — redirects authenticated users away from login/register
- **API middleware**: `requireRole('admin')` — validates JWT token and checks user role
- **Database**: RLS policies enforce data access at the PostgreSQL level

---

## Weather Integration

RythuNetra integrates real-time weather data from **OpenWeatherMap** to provide context-aware AI advice.

### How It Works

1. Weather is fetched based on the user's **district** or **mandal** (520 mandals with precise lat/lon coordinates)
2. Current conditions + 24-hour forecast are injected into AI system prompts
3. The AI uses weather data to provide actionable advice:
    - "Don't spray if rain is expected in the next 6 hours"
    - "High humidity — watch for fungal diseases"
    - "Apply mulch to protect from expected high temperatures"

### Data Points

- Temperature (current + feels like)
- Humidity percentage
- Wind speed (km/h)
- Weather description
- Rain probability (boolean)
- 24-hour forecast entries

### Non-Blocking

Weather fetch failures are silently handled — all features continue to work normally without weather data.

---

## Frontend Architecture

### Routing

| Path                             | Page                | Access        |
| -------------------------------- | ------------------- | ------------- |
| `/`                              | Landing page        | Public        |
| `/crops`                         | Crop browser        | Public        |
| `/crops/:id`                     | Crop detail         | Public        |
| `/diseases`                      | Disease listing     | Public        |
| `/diseases/:id`                  | Disease detail      | Public        |
| `/recommend`                     | AI crop recommender | Public (AI)   |
| `/login`                         | Login               | Guest only    |
| `/register`                      | Registration        | Guest only    |
| `/my-preparations`               | My Preparations     | Authenticated |
| `/settings`                      | User settings       | Authenticated |
| `/admin`                         | Admin dashboard     | Admin only    |
| `/admin/diseases`                | Disease management  | Admin only    |
| `/admin/remedies`                | Remedy management   | Admin only    |
| `/admin/crops`                   | Crop management     | Admin only    |
| `/admin/crops/:cropId/varieties` | Variety management  | Admin only    |

### State Management

- **Server state**: TanStack Query (React Query) with configurable stale time and retry
- **Auth state**: React Context (`AuthContext`)
- **Form state**: React Hook Form + Zod validation
- **Language state**: i18next with `useLanguage` hook

### Code Splitting

Admin pages are **lazy-loaded** using `React.lazy()` + `Suspense` to keep the main bundle small.

### Responsive Design

- Desktop: Header navigation bar
- Mobile: Bottom tab navigation (`BottomNav`)
- Mobile header with hamburger menu

---

## Admin Panel

The admin panel provides full CRUD management for all content:

### Dashboard (`/admin`)

Overview cards showing counts of diseases, remedies, crops, and crop varieties.

### Disease Management (`/admin/diseases`)

- List view with pagination, edit, and delete
- Create/edit form: name (EN/TE), type, severity, symptoms, primary cause, favorable conditions, preventions, treatments, image upload
- Link diseases to crop varieties and remedies via junction tables

### Remedy Management (`/admin/remedies`)

- List view with pagination, edit, and delete
- Create/edit form: name, type, how it works, usage instructions, preparation instructions, ingredients, effectiveness, aliases
- All fields bilingual with auto-translate

### Crop Management (`/admin/crops`)

- List view with pagination
- Create/edit form: name, crop type, soil types (multi-select), image upload, aliases
- Duplicate checking by name

### Crop Variety Management (`/admin/crops/:cropId/varieties`)

- List view per crop
- Create/edit form: name, seasons, districts (multi-select), grain character, special characteristics, image upload
- Link varieties to diseases

---

## Configuration

### Frontend Config (`src/config/`)

| Config            | Content                                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Crop Types**    | 8 types: Cereal, Flower, Fruit, Grain, Oilseed, Pulse, Spice, Vegetable                                                                        |
| **Disease Types** | 4 types: Bacterial, Fungal, Nutritional, Viral                                                                                                 |
| **Remedy Types**  | 8 types: Bio-Fungicide, Bio-Pesticide, Botanical Extract, Cultural Practice, Homemade Spray, Mineral Supplement, Organic Fertilizer, Trap/Lure |
| **Districts**     | 33 Telangana districts                                                                                                                         |
| **Mandals**       | 520 mandals with EN/TE names and GPS coordinates                                                                                               |
| **Seasons**       | 3 seasons: Kharif (Jun–Oct), Rabi (Nov–Mar), Zaid (Mar–Jun)                                                                                    |
| **Soil Types**    | 4 major types (Red, Black, Calcareous, Alluvio-Colluvial) with sub-types                                                                       |

---

## Environment Variables

Create a `.env` file in the project root:

```env
# ─── Required ─────────────────────────────────────
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# ─── AI Configuration ────────────────────────────
AI_PROVIDER=google                    # google | openai | azure | anthropic | mistral | perplexity
AI_API_KEY=your-ai-api-key
AI_MODEL=gemini-2.5-flash             # Model name for the chosen provider
AI_MAX_RETRIES=1                      # Retry count for AI calls
# AI_API_VERSION=                     # Required for Azure OpenAI
# AI_BASE_URL=                        # Custom base URL (Azure, self-hosted)

# ─── Weather (server-side only — no VITE_ prefix) ─
WEATHER_API_KEY=your-openweathermap-key
WEATHER_API_URL=https://api.openweathermap.org/data/2.5

# ─── Optional ─────────────────────────────────────
VITE_AI_ENABLED=true                  # Toggle AI features on/off
VITE_STORAGE_BUCKET=disease-media     # Supabase storage bucket name
VITE_STORAGE_CACHE_CONTROL=3600       # Storage cache TTL (seconds)
VITE_DEFAULT_LANGUAGE=en              # Default language (en | te)
OAUTH_CALLBACK_PATH=/auth/callback
VITE_ADMIN_PAGE_SIZE=20               # Admin list page size
VITE_DISEASE_PAGE_SIZE=12             # Disease list page size
VITE_DEFAULT_STALE_TIME=300000        # TanStack Query stale time (ms)
VITE_DEFAULT_QUERY_RETRY=1            # TanStack Query retry count

# ─── Supabase Service Role (API only) ────────────
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- A **Supabase** project (free tier works)
- An **AI provider** API key (Google Gemini recommended)
- An **OpenWeatherMap** API key (optional, for weather features)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/rythunetra.git
cd rythunetra

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
# Apply supabase/migrations/001_schema.sql and 002_seed.sql via Supabase dashboard or CLI

# Start development server
npm run dev
```

### Development with API Functions

```bash
# Run with Vercel dev (for serverless API functions)
npm run dev:api
```

---

## Scripts

| Script         | Command                | Description                                    |
| -------------- | ---------------------- | ---------------------------------------------- |
| `dev`          | `vite`                 | Start Vite dev server                          |
| `dev:api`      | `vercel dev`           | Start with Vercel dev (includes API functions) |
| `build`        | `tsc -b && vite build` | Type-check + production build                  |
| `lint`         | `eslint .`             | Run ESLint                                     |
| `format`       | `prettier --write .`   | Format all files with Prettier                 |
| `format:check` | `prettier --check .`   | Check formatting                               |
| `preview`      | `vite preview`         | Preview production build locally               |

---

## Deployment

RythuNetra is configured for **Vercel** deployment:

```json
// vercel.json
{
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "framework": "vite",
    "rewrites": [
        { "source": "/api/ai/scan", "destination": "/api/ai/scan" },
        { "source": "/api/ai/chat", "destination": "/api/ai/chat" },
        { "source": "/api/ai/recommend", "destination": "/api/ai/recommend" },
        { "source": "/(.*)", "destination": "/index.html" }
    ]
}
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# All variables from .env must be added to Vercel project settings
```

---

## Author

**Naresh Aithagoni**

---

## License

This project is private and proprietary.
