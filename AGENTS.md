# AGENTS.md — RythuNetra

Portable, tool-agnostic context for any AI coding assistant (Claude Code, Cursor, Copilot, Windsurf, etc.). Committed to the repo so it travels across tools and machines. Claude Code also reads `CLAUDE.md`; this file is the shared, cross-tool source.

## What this project is

**RythuNetra** — an organic-agriculture advisory platform for Telangana farmers: AI disease scanning, crop recommendations, and a curated bilingual (English + Telugu) knowledge base.

**Stack:** React 19 + TypeScript + Vite, Tailwind CSS v4, TanStack Query, React Hook Form + Zod, i18next, Supabase (Postgres + RLS), Vercel serverless functions (`api/`), AI provider factory (`api/_lib/config.ts`).

See `CLAUDE.md` for build commands, architecture, environment variables, and code style. Key commands: `npm run dev`, `npm run build`, `npm run lint`, `npm run format`.

## Design system — SOURCE OF TRUTH

**`design/DESIGN.md` is the authoritative design spec** (supported by `design/tailwind-v4.css` for the raw token export and `design/design-tokens.json`). Read it before any styling, color, token, or component-appearance work.

- The app implements the spec through **semantic tokens in `src/index.css`** (`:root` holds the values; `@theme` / `@theme inline` expose Tailwind utilities). Components consume semantic utilities (`bg-primary`, `text-foreground`, `border-border`, `text-link`, `bg-destructive`, …) — **not raw hex**. Change a token once in `src/index.css` and it propagates everywhere.
- **Keep spec and code in sync:** when a token changes, update **both** `design/DESIGN.md` and `src/index.css` (and `design/tailwind-v4.css` if the raw export is affected) in the same change. When they disagree, reconcile toward `design/DESIGN.md`.
- **Do NOT reintroduce superseded systems:** "Fresh Harvest Light" (green-primary Geist) or the pure-Geist ink/blue redesign.

### Active system: "Specimen Journal" (Material-style palette)

- **Surfaces:** warm Linen canvas (`--background` #f8f9f5), surface-low cards (`--card` #f1f3ef), Slate Hollow dark footer/scrims. Flat by design — no drop shadows on on-page surfaces; only floating overlays (dropdown/dialog/popover) get soft warm-ink shadows.
- **Roles:** `--primary` = sage green **#4a6d47** (filled CTAs, active nav pill, focus ring); `--link` = tertiary **#b14eaa** (navigation links — deliberately NOT the error color); `--destructive`/`--error` = aux-accent-2 **#c23934** (delete / remove / logout / error messages). Borders use `outline` #e1e6df / `outline-strong` #c4cbc2.
- **Status chips** (severity/effectiveness/etc.) use the `aux-accent-*` families via `src/utils/statusColors.ts` — the single helper for status colors; don't hardcode status hex in components.
- **Type:** Inter (sans workhorse), Newsreader (serif, hero headline only), Fragment Mono (field-note tags/labels). Anek Telugu MUST stay in the sans stack for Telugu content.
- **Radii:** cards 10px, buttons pill (rounded-full), inputs 4px, badges/toggles fully rounded.
- **Icons:** lucide-react. The brand mark is the custom A|N circle logo in `src/components/common/LogoMark.tsx` (shown without the "RythuNetra" wordmark in chrome).

## Working conventions

- **Bilingual content** is stored as JSONB `{ "en": "...", "te": "..." }`; never force mono/uppercase on components that render dynamic Telugu (e.g. badges).
- **Service layer:** components never call Supabase directly — go through `src/services/`.
- **UI:** shadcn/ui components live as copied source in `src/components/ui/` (the `shadcn` package provides `@import "shadcn/tailwind.css"` + the `add` CLI). Forms use `Field`/`FieldLabel`/`FieldGroup`; selects use `CustomDropdown`/`Select`; multi-select uses `MultiSelectDropdown`.
- **Known pre-existing lint:** `react-refresh/only-export-components` in `ui/badge.tsx`, `ui/button.tsx`, `ui/tabs.tsx` (stock shadcn `*Variants` exports) — not errors to "fix".
- After nontrivial changes, run `npm run build` and `npm run lint` before considering the work done.
