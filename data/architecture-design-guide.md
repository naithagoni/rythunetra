# RythuNetra — Architecture & System Design Guide

> **Organic Farming Knowledge Platform**
> Designed for maintainability, scalability, observability, and robustness.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Layered Architecture](#2-layered-architecture)
3. [User Experience Tiers](#3-user-experience-tiers)
4. [Project Structure](#4-project-structure)
5. [Service Layer Design](#5-service-layer-design)
6. [State Management Strategy](#6-state-management-strategy)
7. [Routing & Access Control](#7-routing--access-control)
8. [Error Handling & Resilience](#8-error-handling--resilience)
9. [Observability & Monitoring](#9-observability--monitoring)
10. [Scalability Patterns](#10-scalability-patterns)
11. [Database & Security](#11-database--security)
12. [Implementation Roadmap](#12-implementation-roadmap)

---

## 1. System Overview

### Tech Stack

| Layer            | Technology                              | Purpose                        |
| ---------------- | --------------------------------------- | ------------------------------ |
| **Frontend**     | React 19 + TypeScript 5.9               | UI framework                   |
| **Build**        | Vite 7.3                                | Dev server + bundler           |
| **Styling**      | Tailwind CSS v4                         | Utility-first CSS              |
| **Routing**      | React Router DOM v7                     | Client-side routing            |
| **Server State** | TanStack React Query v5                 | Caching, pagination, mutations |
| **Forms**        | React Hook Form + Zod                   | Validation + type-safe forms   |
| **Backend**      | Supabase (PostgreSQL + Auth + Realtime) | BaaS                           |
| **Media**        | Cloudinary                              | Image/video CDN + uploads      |
| **i18n**         | i18next (EN + TE)                       | Bilingual support              |
| **Icons**        | Lucide React                            | Icon library                   |
| **API Routes**   | Vercel Serverless Functions             | Write operations + admin       |

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (SPA)                          │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Pages   │  │Components│  │  Hooks   │  │ Contexts │     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│       │              │             │              │           │
│       └──────────────┴─────────────┘              │           │
│                      │                            │           │
│              ┌───────▼────────┐           ┌──────▼──────┐    │
│              │ Service Layer  │           │ Auth/State  │    │
│              │ (Supabase SDK) │           │ (Context)   │    │
│              └───────┬────────┘           └──────┬──────┘    │
└──────────────────────┼───────────────────────────┼───────────┘
                       │                           │
          ┌────────────▼────────────┐   ┌─────────▼──────────┐
          │     Supabase Cloud      │   │  Vercel Functions   │
          │  ┌─────────────────┐    │   │  /api/preparations  │
          │  │   PostgreSQL    │    │   │  /api/diseases      │
          │  │   + PostgREST   │    │   │  /api/admin         │
          │  ├─────────────────┤    │   └────────────────────┘
          │  │   Auth (GoTrue) │    │
          │  ├─────────────────┤    │   ┌────────────────────┐
          │  │   Realtime      │    │   │    Cloudinary       │
          │  ├─────────────────┤    │   │  Images + Videos    │
          │  │   Storage       │    │   └────────────────────┘
          │  └─────────────────┘    │
          └─────────────────────────┘
```

---

## 2. Layered Architecture

Every layer has a single responsibility. Dependencies flow **downward only**.

```
┌─────────────────────────────────────────────────────────┐
│                     UI Layer                             │
│   Pages → Feature Components → Common Components         │
│   • Renders data, handles user interactions              │
│   • Never imports supabase directly                      │
├─────────────────────────────────────────────────────────┤
│                  Hook Layer                               │
│   useAuth │ useDiseases │ useRemedies │ usePreparations  │
│   • Wraps React Query (useQuery / useMutation)           │
│   • Provides loading/error states to UI                  │
│   • Calls service functions                              │
├─────────────────────────────────────────────────────────┤
│                Service Layer                              │
│   diseaseService │ remedyService │ preparationService    │
│   mediaService   │ searchService │ userService           │
│   • Pure async functions (no React)                      │
│   • Single source of truth for all data operations       │
│   • Handles query building, error mapping                │
├─────────────────────────────────────────────────────────┤
│              Infrastructure Layer                         │
│   Supabase Client │ Cloudinary │ Sentry │ i18n │ Logger  │
│   • Singleton instances                                  │
│   • Configuration + initialization                       │
└─────────────────────────────────────────────────────────┘
```

### Why This Matters

| Concern               | How It's Addressed                                   |
| --------------------- | ---------------------------------------------------- |
| **Testing**           | Services are pure functions — testable without React |
| **Reuse**             | Hooks compose services; multiple pages share hooks   |
| **Swapping backends** | Only service layer changes if you move off Supabase  |
| **Debugging**         | Clear stack: Page → Hook → Service → Supabase        |

---

## 3. User Experience Tiers

### Anonymous User (Public Tier)

```
┌─────────────────────────────────────────────────┐
│                  NAVIGATION                      │
│  Home │ Diseases │ Remedies │ Media │ Login      │
└─────────────────────────────────────────────────┘

   Home (/)
     └── Diseases (/diseases)
     │     └── Disease Detail (/diseases/:slug)
     │           └── Linked Remedies (view only)
     │
     └── Remedies (/remedies)
     │     └── Remedy Detail (/remedies/:slug)
     │           └── Related Diseases (view only)
     │
     └── Media (/media)
           └── Videos / Images gallery
```

**Capabilities:**

- Browse all diseases, remedies, and media
- Read detailed information including symptoms, organic solutions, preparation steps
- Filter by land type, search by name/keyword
- Switch language (English / Telugu)
- No data creation, no personalization

**Design goal:** Educate users and build trust → drive signups.

---

### Logged-in User (Authenticated Tier)

```
┌───────────────────────────────────────────────────────────────┐
│                       NAVIGATION                               │
│  Diseases │ Remedies │ Media │ My Preparations │ ⚙ Settings   │
└───────────────────────────────────────────────────────────────┘

   Diseases (/diseases)
     └── Disease Detail
           └── Linked Remedies → "Prepare This" action

   Remedies (/remedies)
     └── Remedy Detail → "Prepare This" action

   Media (/media)
     └── Videos / Images gallery

   My Preparations (/my-preparations)    ← AUTHENTICATED ONLY
     ├── Add preparation (remedy + date + quantity)
     ├── Track active / expired / used
     ├── Edit / Delete own preparations
     └── Expiry alert banners

   Settings (/settings)                  ← AUTHENTICATED ONLY
     ├── Profile (name, phone)
     ├── Preferred language
     ├── Land type preference
     └── Notification preferences
```

**Additional capabilities over anonymous:**

- Full CRUD on own preparations
- Personalized land type filtering (persisted)
- Notification preferences and alerts
- Profile management
- "Prepare This" contextual actions on remedy pages

---

### Role-Based Access (Future)

| Role                 | Capabilities                                          |
| -------------------- | ----------------------------------------------------- |
| **Farmer** (default) | All authenticated features above                      |
| **Expert**           | + Create/edit diseases and remedies, + Upload media   |
| **Admin**            | + User management, + Verify content, + View analytics |

The `user_profiles.role` column already supports `'farmer' | 'expert' | 'admin'`.

---

## 4. Project Structure

### Current Structure (~67 files)

```
src/
├── components/
│   ├── common/          # Shared UI: Header, Footer, Layout, Dropdowns
│   ├── disease/         # DiseaseCard, DiseaseGrid, DiseaseDetail
│   ├── remedy/          # RemedyCard, RemedyDetailView, CategoryFilter
│   └── preparation/     # PreparationCard, PreparationForm, AlertBanner
├── contexts/            # AuthContext, LandTypeContext, definitions.ts
├── hooks/               # useAuth, useDiseases, useRemedies, etc.
├── i18n/                # config.ts + locales/en.json, te.json
├── pages/               # Route-level page components
├── services/            # Supabase query functions
├── types/               # TypeScript interfaces
└── utils/               # cn(), dateUtils, expiryCalculator
```

### Recommended Additions

```
src/
├── services/
│   ├── preparationService.ts   ← NEW: extract from MyPreparations page
│   ├── userService.ts          ← NEW: profile + preferences operations
│   └── notificationService.ts  ← NEW: notification CRUD
├── hooks/
│   ├── usePreparations.ts      ← NEW: React Query for preparations
│   └── useNotifications.ts     ← NEW: React Query for notifications
├── components/
│   └── common/
│       ├── ErrorBoundary.tsx    ← NEW: global error boundary
│       └── Toast.tsx            ← NEW: feedback notifications
└── utils/
    └── logger.ts               ← NEW: structured logging
```

### Scaling to Feature-Based Structure (100+ files)

When the project grows beyond ~100 files, reorganize into feature modules:

```
src/
├── features/
│   ├── diseases/
│   │   ├── components/     # DiseaseCard, DiseaseGrid, DiseaseDetail
│   │   ├── hooks/          # useDiseases.ts
│   │   ├── services/       # diseaseService.ts
│   │   └── types/          # disease.ts
│   ├── remedies/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── preparations/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── media/
│   └── auth/
├── shared/
│   ├── components/         # Header, Footer, Layout, ErrorBoundary
│   ├── hooks/              # useLanguage, useLandType
│   ├── utils/              # cn, dateUtils, logger
│   └── i18n/
└── pages/                  # Thin wrappers importing from features
```

**Rule:** Each feature is self-contained. Cross-feature imports go through `shared/`.

---

## 5. Service Layer Design

### Principle: One Service Per Domain

Every data operation flows through the service layer. Components and hooks **never** import `supabase` directly.

```
Component → Hook → Service → Supabase
                            → Cloudinary
                            → Vercel API
```

### Service Pattern

```typescript
// src/services/preparationService.ts
import { supabase } from './supabase'

const PREPARATION_SELECT = `
  *,
  remedy:remedies(
    id, slug, category,
    remedy_translations(name, language)
  )
`

export async function getPreparations(userId: string) {
  return supabase
    .from('preparations')
    .select(PREPARATION_SELECT)
    .eq('user_id', userId)
    .order('expiry_date', { ascending: true })
}

export async function createPreparation(input: CreatePreparationInput) {
  return supabase
    .from('preparations')
    .insert(input)
    .select(PREPARATION_SELECT)
    .single()
}

export async function updatePreparation(id: string, input: Partial<...>) {
  return supabase
    .from('preparations')
    .update(input)
    .eq('id', id)
    .select(PREPARATION_SELECT)
    .single()
}

export async function deletePreparation(id: string) {
  return supabase
    .from('preparations')
    .delete()
    .eq('id', id)
}
```

### Hook Pattern (wrapping React Query)

```typescript
// src/hooks/usePreparations.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as prepService from '@/services/preparationService'

export function usePreparations(userId: string) {
    return useQuery({
        queryKey: ['preparations', userId],
        queryFn: () => prepService.getPreparations(userId),
        staleTime: 60 * 1000, // 1 minute
    })
}

export function useCreatePreparation() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: prepService.createPreparation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['preparations'] })
        },
    })
}
```

### Service Inventory

| Service               | Read Operations               | Write Operations                    |
| --------------------- | ----------------------------- | ----------------------------------- |
| `diseaseService`      | getDiseases, getDiseaseBySlug | — (future: expert create)           |
| `remedyService`       | getRemedies, getRemedyBySlug  | — (future: expert create)           |
| `preparationService`  | getPreparations               | create, update, delete, markAsUsed  |
| `mediaService`        | getAllMedia                   | uploadToCloudinary, saveMediaRecord |
| `searchService`       | unifiedSearch                 | —                                   |
| `userService`         | getProfile, getPreferences    | updateProfile, updatePreferences    |
| `notificationService` | getNotifications              | markAsRead, dismiss                 |

---

## 6. State Management Strategy

### What Goes Where

| State Type                 | Solution                     | Examples                                |
| -------------------------- | ---------------------------- | --------------------------------------- |
| **Server state** (DB data) | React Query                  | Diseases, remedies, preparations, media |
| **Auth state**             | React Context                | User session, login/logout methods      |
| **UI preferences**         | React Context + localStorage | Land type selection, language           |
| **Form state**             | React Hook Form              | Preparation form, login form            |
| **Transient UI**           | Component `useState`         | Modal open/close, filter tabs           |

### React Query Configuration

```typescript
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 min default
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
})
```

#### Per-Query Stale Times

| Data                | Stale Time | Rationale                           |
| ------------------- | ---------- | ----------------------------------- |
| Diseases / Remedies | 30 minutes | Rarely change, public content       |
| Media               | 30 minutes | Rarely change                       |
| Preparations        | 1 minute   | User's own data, changes frequently |
| Notifications       | 30 seconds | Time-sensitive                      |
| User profile        | 5 minutes  | Infrequent changes                  |

### Provider Hierarchy

```tsx
<StrictMode>
    <ErrorBoundary fallback={<ErrorPage />}>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <LandTypeProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </LandTypeProvider>
            </AuthProvider>
        </QueryClientProvider>
    </ErrorBoundary>
</StrictMode>
```

**Note:** `zustand` is currently installed but unused. Remove it unless you plan to use it for client-only state that doesn't fit Context (e.g., complex multi-step form wizard state).

---

## 7. Routing & Access Control

### Route Table

| Path               | Component          | Guard          | Description                                   |
| ------------------ | ------------------ | -------------- | --------------------------------------------- |
| `/`                | HomePage           | GuestRoute     | Landing page (redirects authed → `/diseases`) |
| `/login`           | LoginPage          | GuestRoute     | Email/password + Google OAuth                 |
| `/register`        | RegisterPage       | GuestRoute     | Account creation                              |
| `/auth/callback`   | AuthCallbackPage   | —              | OAuth redirect handler                        |
| `/diseases`        | DiseaseListPage    | —              | Browse all diseases                           |
| `/diseases/:slug`  | DiseaseDetailPage  | —              | Disease info + linked remedies                |
| `/remedies`        | RemedyListPage     | —              | Browse all remedies                           |
| `/remedies/:slug`  | RemedyDetailPage   | —              | Remedy info + preparation steps               |
| `/media`           | MediaPage          | —              | Video/image gallery                           |
| `/my-preparations` | MyPreparationsPage | ProtectedRoute | User's preparation tracker                    |
| `/settings`        | SettingsPage       | ProtectedRoute | Profile & preferences                         |

### Route Guards

```typescript
// GuestRoute — redirects authenticated users away
function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner />
  if (user) return <Navigate to="/diseases" replace />
  return children
}

// ProtectedRoute — redirects unauthenticated users to login
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner />
  if (!user) return <Navigate to="/login" replace />
  return children
}
```

### Navigation Logic

```typescript
// Header navigation adapts based on auth state
const navLinks = [
    // Home only for anonymous users
    ...(!user ? [{ to: '/', label: t('common.home') }] : []),

    // Always visible
    { to: '/diseases', label: t('diseases.title') },
    { to: '/remedies', label: t('remedies.title') },
    { to: '/media', label: t('media.title') },

    // Only for authenticated users
    ...(user
        ? [{ to: '/my-preparations', label: t('preparations.title') }]
        : []),
]
```

---

## 8. Error Handling & Resilience

### Error Handling Strategy

```
┌───────────────────────────────────────────────────────────────┐
│  Layer 1: ErrorBoundary (catches React render errors)         │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Layer 2: React Query (retries, error states)           │  │
│  │  ┌───────────────────────────────────────────────────┐  │  │
│  │  │  Layer 3: Service Functions (error mapping)       │  │  │
│  │  │  ┌─────────────────────────────────────────────┐  │  │  │
│  │  │  │  Layer 4: Supabase SDK (network, auth)      │  │  │  │
│  │  │  └─────────────────────────────────────────────┘  │  │  │
│  │  └───────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

### Layer 1: Global Error Boundary

```typescript
// src/components/common/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    logger.error('React Error Boundary', { error, info })
    // Sentry.captureException(error, { extra: info })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallbackPage onRetry={() => this.setState({ hasError: false })} />
    }
    return this.props.children
  }
}
```

### Layer 2: React Query Error Handling

```typescript
// Global error handler for all queries
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            // Show toast on query failures
            onError: (error) => toast.error(error.message),
        },
        mutations: {
            // Show toast on mutation failures
            onError: (error) => toast.error(error.message),
        },
    },
})
```

### Layer 3: Service Error Mapping

```typescript
// Consistent error handling in services
export async function createPreparation(input) {
    const { data, error } = await supabase
        .from('preparations')
        .insert(input)
        .select()
        .single()

    if (error) {
        logger.error('Failed to create preparation', { error, input })
        throw new AppError('preparations.createFailed', error)
    }
    return data
}
```

### Layer 4: Auth Resilience

```typescript
// Handle auth state changes gracefully
supabase.auth.onAuthStateChange((event, session) => {
    switch (event) {
        case 'TOKEN_REFRESHED':
            // Session refreshed automatically — no action needed
            break
        case 'SIGNED_OUT':
            queryClient.clear() // Clear all cached data
            navigate('/login')
            break
        case 'SIGNED_IN':
            queryClient.invalidateQueries() // Refresh all data for new user
            break
    }
})
```

### User-Facing Feedback: Toast System

Install a lightweight toast library (e.g., `sonner`):

```typescript
// Success feedback
toast.success(t('preparations.created'))

// Error feedback
toast.error(t('common.errorOccurred'))

// Warning feedback
toast.warning(t('preparations.expiringSoon'))
```

---

## 9. Observability & Monitoring

### Monitoring Stack

```
┌──────────────────────────────────────────────┐
│              Observability                    │
│                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────┐ │
│  │   Sentry   │  │  Supabase  │  │ Custom │ │
│  │  Errors +  │  │ Dashboard  │  │ Logger │ │
│  │ Performance│  │ DB + Auth  │  │        │ │
│  └────────────┘  └────────────┘  └────────┘ │
│                                              │
│  ┌────────────┐  ┌────────────┐              │
│  │ Cloudinary │  │  React     │              │
│  │ Analytics  │  │  Query     │              │
│  │            │  │  DevTools  │              │
│  └────────────┘  └────────────┘              │
└──────────────────────────────────────────────┘
```

### Sentry Integration

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react'

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.1, // 10% of transactions
    replaysSessionSampleRate: 0, // No session replays in production
    replaysOnErrorSampleRate: 1, // 100% replays when errors occur
})
```

### Structured Logger

```typescript
// src/utils/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
    [key: string]: unknown
}

function log(level: LogLevel, message: string, context?: LogContext) {
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...context,
    }

    if (import.meta.env.DEV) {
        console[level](message, context)
    }

    if (level === 'error') {
        Sentry.captureMessage(message, {
            level: 'error',
            extra: context,
        })
    }
}

export const logger = {
    debug: (msg: string, ctx?: LogContext) => log('debug', msg, ctx),
    info: (msg: string, ctx?: LogContext) => log('info', msg, ctx),
    warn: (msg: string, ctx?: LogContext) => log('warn', msg, ctx),
    error: (msg: string, ctx?: LogContext) => log('error', msg, ctx),
}
```

### Key Metrics to Track

| Metric                    | Source               | Alert Threshold             |
| ------------------------- | -------------------- | --------------------------- |
| JS runtime errors         | Sentry               | > 5 per hour                |
| API response time (p95)   | Sentry Performance   | > 2 seconds                 |
| Auth failures             | Supabase Dashboard   | > 10 per hour               |
| Database query count      | Supabase Dashboard   | > 1000 per hour (free tier) |
| Cloudinary bandwidth      | Cloudinary Dashboard | > 80% of monthly limit      |
| Preparation expiry misses | Custom logger        | Any                         |

---

## 10. Scalability Patterns

### Data Fetching Optimization

| Pattern                   | Implementation                                           | Benefit                       |
| ------------------------- | -------------------------------------------------------- | ----------------------------- |
| **Per-query stale times** | `staleTime: 30min` for diseases, `1min` for preparations | Fewer unnecessary refetches   |
| **Keep previous data**    | `placeholderData: keepPreviousData`                      | Smooth pagination transitions |
| **Prefetch on hover**     | `queryClient.prefetchQuery` on card hover                | Instant detail page loads     |
| **Optimistic updates**    | `onMutate` → update cache immediately                    | Instant UI feedback           |
| **Infinite queries**      | `useInfiniteQuery` for disease/remedy lists              | Better mobile scroll UX       |

### Optimistic Mutation Example

```typescript
export function useDeletePreparation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => preparationService.deletePreparation(id),

        // Optimistic: remove from cache immediately
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['preparations'] })
            const previous = queryClient.getQueryData(['preparations'])

            queryClient.setQueryData(['preparations'], (old) =>
                old?.filter((p) => p.id !== id),
            )

            return { previous }
        },

        // Rollback on error
        onError: (err, id, context) => {
            queryClient.setQueryData(['preparations'], context.previous)
            toast.error(t('common.errorOccurred'))
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['preparations'] })
        },
    })
}
```

### Code Splitting

Lazy-load pages that aren't needed on initial render:

```typescript
// src/App.tsx
import { lazy, Suspense } from 'react'

const DiseaseDetailPage = lazy(() => import('./pages/DiseaseDetail'))
const RemedyDetailPage = lazy(() => import('./pages/RemedyDetail'))
const MyPreparationsPage = lazy(() => import('./pages/MyPreparations'))
const SettingsPage = lazy(() => import('./pages/Settings'))
const MediaPage = lazy(() => import('./pages/Media'))

// Wrap in Suspense
<Route path="/diseases/:slug" element={
  <Suspense fallback={<LoadingSpinner />}>
    <DiseaseDetailPage />
  </Suspense>
} />
```

### Image Optimization

```typescript
// Cloudinary transformations for responsive images
const getOptimizedUrl = (publicId: string, width: number) =>
  `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},f_auto,q_auto/${publicId}`

// Usage in components
<img
  src={getOptimizedUrl(media.public_id, 400)}
  srcSet={`
    ${getOptimizedUrl(media.public_id, 400)} 400w,
    ${getOptimizedUrl(media.public_id, 800)} 800w
  `}
  sizes="(max-width: 640px) 400px, 800px"
  loading="lazy"
/>
```

---

## 11. Database & Security

### Row Level Security (RLS)

Every table has RLS enabled. Policies follow this pattern:

| Table                  | SELECT      | INSERT       | UPDATE       | DELETE      |
| ---------------------- | ----------- | ------------ | ------------ | ----------- |
| `diseases`             | Public ✅   | Expert/Admin | Expert/Admin | Admin       |
| `disease_translations` | Public ✅   | Expert/Admin | Expert/Admin | Admin       |
| `disease_media`        | Public ✅   | Expert/Admin | Expert/Admin | Admin       |
| `remedies`             | Public ✅   | Expert/Admin | Expert/Admin | Admin       |
| `remedy_translations`  | Public ✅   | Expert/Admin | Expert/Admin | Admin       |
| `disease_remedies`     | Public ✅   | Expert/Admin | Expert/Admin | Admin       |
| `preparations`         | Own only 🔒 | Own only 🔒  | Own only 🔒  | Own only 🔒 |
| `user_profiles`        | Own only 🔒 | Own only 🔒  | Own only 🔒  | —           |
| `user_preferences`     | Own only 🔒 | Own only 🔒  | Own only 🔒  | —           |
| `notifications`        | Own only 🔒 | —            | Own only 🔒  | —           |
| `land_types`           | Public ✅   | Admin        | Admin        | Admin       |

### Database Schema Relationships

```
┌──────────────┐     ┌────────────────────┐     ┌──────────────┐
│   diseases   │────<│ disease_translations│     │   remedies   │
│              │     └────────────────────┘     │              │
│   id (PK)    │────<┌────────────────────┐     │   id (PK)    │
│   slug       │     │   disease_media    │     │   slug       │
│              │     └────────────────────┘     │              │
│              │                                │              │
│              │────<┌────────────────────┐>────│              │
│              │     │  disease_remedies  │     │              │
│              │     │  (junction table)  │     │              │
└──────────────┘     └────────────────────┘     └──────┬───────┘
                                                       │
                                                       │>───┌──────────────────┐
                                                       │    │remedy_translations│
                                                       │    └──────────────────┘
                                                       │
┌──────────────┐     ┌────────────────────┐            │
│  auth.users  │────<│  user_profiles     │            │
│              │     └────────────────────┘            │
│              │────<┌────────────────────┐            │
│              │     │  user_preferences  │            │
│              │     └────────────────────┘            │
│              │────<┌────────────────────┐>───────────┘
│              │     │   preparations     │
│              │     └────────────────────┘
│              │────<┌────────────────────┐
│              │     │   notifications    │
└──────────────┘     └────────────────────┘
```

### Auth Trigger

On signup, a database trigger automatically creates a `user_profiles` row:

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_profiles (id, name, preferred_language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Farmer'),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;  -- Don't block signup on profile creation failure
END;
$$ LANGUAGE plpgsql;
```

---

## 12. Implementation Roadmap

### Phase A: Foundation Hardening (Do Now)

| #   | Task                            | Impact          | Effort  | Files                            |
| --- | ------------------------------- | --------------- | ------- | -------------------------------- |
| 1   | Add `ErrorBoundary` component   | Robustness      | Low     | `ErrorBoundary.tsx`, `main.tsx`  |
| 2   | Add toast system (`sonner`)     | UX feedback     | Low     | `npm install`, `main.tsx`, pages |
| 3   | Add `logger.ts` utility         | Observability   | Low     | `utils/logger.ts`                |
| 4   | Extract `preparationService.ts` | Maintainability | Medium  | New service + refactor page      |
| 5   | Create `usePreparations` hook   | Maintainability | Medium  | New hook + refactor page         |
| 6   | Remove unused `zustand`         | Cleanliness     | Trivial | `package.json`                   |

### Phase B: Observability (Next Sprint)

| #   | Task                                | Impact           | Effort  |
| --- | ----------------------------------- | ---------------- | ------- |
| 7   | Install + configure Sentry          | Error tracking   | Low     |
| 8   | Add React Query DevTools (dev only) | Debug tooling    | Trivial |
| 9   | Instrument key user flows           | Performance data | Medium  |

### Phase C: Scalability (Following Sprint)

| #   | Task                                    | Impact             | Effort |
| --- | --------------------------------------- | ------------------ | ------ |
| 10  | Lazy-load detail pages + preparations   | Bundle size        | Low    |
| 11  | Add optimistic updates for preparations | UX speed           | Medium |
| 12  | Per-query stale time tuning             | Network efficiency | Low    |
| 13  | Prefetch disease/remedy on card hover   | Perceived speed    | Low    |

### Phase D: Quality (Ongoing)

| #   | Task                                       | Impact                    | Effort |
| --- | ------------------------------------------ | ------------------------- | ------ |
| 14  | Install Vitest + write first service tests | Reliability               | Medium |
| 15  | Add E2E test for critical flows            | Confidence                | High   |
| 16  | Feature-based folder restructure           | Long-term maintainability | High   |

---

## Appendix: Design Decisions Log

| Decision               | Chosen          | Rationale                                           |
| ---------------------- | --------------- | --------------------------------------------------- |
| BaaS vs custom backend | Supabase        | Zero cost, built-in auth, PostgREST, realtime       |
| CSS framework          | Tailwind v4     | Utility-first, no runtime, CSS-native @theme        |
| Server state           | React Query v5  | Caching, pagination, mutations, devtools            |
| Form handling          | RHF + Zod       | Type-safe validation, minimal re-renders            |
| i18n                   | i18next         | Mature, React integration, browser language detect  |
| Media CDN              | Cloudinary      | Free tier, on-the-fly transforms, video support     |
| Client state           | React Context   | Sufficient for auth + preferences; zustand overkill |
| Icons                  | Lucide React    | Tree-shakeable, consistent design, huge library     |
| Routing                | React Router v7 | Layout/Outlet pattern, route guards                 |
