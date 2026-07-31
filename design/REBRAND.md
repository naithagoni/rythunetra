# Rebrand: Rythunetra → Namruth

This document records the rebranding decision, rationale, and availability checks for moving the platform from **Rythunetra** to **Namruth**.

---

## The name

**Namruth** (pronounced **NA-mruth**, 2 syllables)

- Telugu: **నామృత్**
- A blend of two roots:
    - **NA** — from **Naresh Aithagoni** (నరేష్), the founder's name — a personal story baked into the brand
    - **Amruth** — from **Amrutham** (అమృతం) = "nectar," evoking **Jeevamrutham / Beejamrutham**, the core preparations of natural farming
- **Meaning:** "Naresh's nectar" — a nod to the natural-farming remedies (amrutham) the app teaches.
- **Why this name:** Easy for village farmers to say (no hard consonant cluster), carries the founder's name, and ties directly to natural-farming remedies. Chosen over _Shrusya_ — which was strong but the "Shr-" (శ్రు) cluster is a tongue-twister for casual/village speech.

---

## Tagline

**Primary (recommended):**

> **Namruth — Wisdom in every field.**

**Name explainer** (for About page / logo lockup):

> "Nectar for the farmer" — _Na_ (Naresh) + _Amruth_ (amrutham / nectar)

> Note: The explainer describes the name's meaning; the working tagline should sell a benefit or feeling, not just define the word.

---

## Codebase rebrand checklist (TODO — not yet applied)

Files currently referencing "Rythunetra" (from grep, excluding node_modules/dist):

- [ ] `index.html` — `<title>`, meta tags
- [ ] `README.md`
- [ ] `package.json` — name field
- [ ] `public/manifest.json` — app name, short_name
- [ ] `src/config/env.ts`
- [ ] `src/components/common/LogoMark.tsx` — logo text/mark
- [ ] `src/hooks/usePageTitle.ts`
- [ ] `src/i18n/locales/en.json` — brand strings
- [ ] `src/i18n/locales/te.json` — brand strings (add నామృత్)
- [ ] `src/i18n/locales/hi.json` — brand strings
- [ ] `src/services/translateService.ts`
- [ ] `api/ai/recommend.ts`, `api/ai/chat.ts` — prompt/brand references
- [ ] `design/DESIGN.md`, `AGENTS.md`, `CLAUDE.md` — docs
- [ ] Data guides in `data/` (lower priority — content docs)

> Regenerate `dist/` via build; do not hand-edit built files.
