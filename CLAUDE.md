# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Vite dev server (localhost:5173, frontend only)
npm run dev:api      # Vercel dev (includes /api serverless endpoints)
npm run build        # tsc -b && vite build → dist/
npm run lint         # ESLint check
npm run format       # Prettier write
npm run format:check # Prettier check only
npm run preview      # Preview production build locally
```

No test framework is configured. Database migrations are applied manually via Supabase Dashboard SQL Editor or `supabase db push`.

## Architecture

**RythuNetra** is an organic agriculture advisory platform for Telangana farmers. It combines AI-powered disease scanning, crop recommendations, and a curated knowledge base — all bilingual (English + Telugu).

### Frontend (src/)
- **React 19 + TypeScript + Vite** with Tailwind CSS v4
- **Routing**: React Router DOM in `src/App.tsx` — admin pages are lazy-loaded via `React.lazy()`
- **State**: TanStack React Query for server state, React Context for auth (`AuthContext`) and soil type
- **Forms**: React Hook Form + Zod validation
- **i18n**: i18next with locale files at `src/i18n/locales/{en,te}.json`
- **Service layer** (`src/services/`): All Supabase calls go through service functions — components never call Supabase directly

### Backend (api/)
- **Vercel serverless functions** — not Next.js API routes
- **AI endpoints** (`api/ai/`): scan (vision), chat (streaming SSE), recommend (structured output)
- **AI provider factory** (`api/ai/config.ts`): Supports Google Gemini, OpenAI, Azure, Anthropic, Mistral, Perplexity via `AI_PROVIDER` env var
- **Middleware** (`api/middleware/`): JWT auth, Zod validation, rate limiting

### Database (supabase/)
- **Supabase (PostgreSQL)** with Row-Level Security (RLS)
- **Bilingual content** stored as JSONB: `{"en": "...", "te": "..."}`
- **Schema**: `supabase/migrations/001_schema.sql` — crops, crop_varieties, diseases, remedies, junction tables, user_profiles, scan_results, chat_sessions/messages, preparations
- **Two roles**: `farmer` (default), `admin` — enforced via RLS policies and a `prevent_role_change()` trigger
- **`is_admin()` helper function** used across RLS policies

### Key Relationships
```
crops → crop_varieties → (crop_variety_diseases) → diseases → (disease_remedies) → remedies
auth.users → user_profiles (role, district, mandal, language)
auth.users → scan_results, chat_sessions → chat_messages, preparations
```

## Code Style

- **Prettier**: 4-space indent, no semicolons, single quotes
- **TypeScript strict mode** enabled
- **ESLint**: Flat config with React Hooks + React Refresh rules
- Type definitions in `src/types/`, config constants in `src/config/`

## Environment Variables

Frontend vars are prefixed `VITE_`. Server-only vars (AI keys, weather API) have no prefix. See `.env.example` for the full list. Key ones:

- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — Supabase connection
- `AI_PROVIDER` / `AI_API_KEY` / `AI_MODEL` — AI provider config
- `WEATHER_API_KEY` — OpenWeatherMap (optional, features degrade gracefully)

## Deployment

Vercel deployment via GitHub Actions (`.github/workflows/deploy.yml`). Pushes to `main` deploy to production; PRs get preview deployments. Security headers (CSP, HSTS) configured in `vercel.json`.
