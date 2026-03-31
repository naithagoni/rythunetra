/**
 * Remedy — matches sample-data.ts → remedy.
 * JSONB-based schema: no translation tables or child item tables.
 */
import type { LocalizedText, LocalizedTextArray } from './i18n'

// ─── App-level model ──────────────────────────────────────

export interface Remedy {
    id: string
    name: LocalizedText
    type: LocalizedText
    howItWorks: LocalizedText
    usageInstructions: LocalizedText[]
    preparationInstructions: LocalizedText[]
    ingredients: LocalizedText[]
    effectiveness: 'High' | 'Moderate' | 'Low'
    aliases: LocalizedTextArray
    created_at?: string
}

// ─── DB row shape (JSONB columns) ─────────────────────────

export interface RemedyRow {
    id: string
    name: LocalizedText
    type: LocalizedText | null
    how_it_works: LocalizedText | null
    usage_instructions: LocalizedText[] | null
    preparation_instructions: LocalizedText[] | null
    ingredients: LocalizedText[] | null
    effectiveness: string | null
    aliases: LocalizedTextArray | null
    created_at?: string
}

// ─── Transformer ──────────────────────────────────────────

export function toRemedy(row: RemedyRow): Remedy {
    return {
        id: row.id,
        name: row.name ?? { en: '', te: '' },
        type: row.type ?? { en: '', te: '' },
        howItWorks: row.how_it_works ?? { en: '', te: '' },
        usageInstructions: row.usage_instructions ?? [],
        preparationInstructions: row.preparation_instructions ?? [],
        ingredients: row.ingredients ?? [],
        effectiveness:
            (row.effectiveness as Remedy['effectiveness']) ?? 'Moderate',
        aliases: row.aliases ?? { en: [], te: [] },
        created_at: row.created_at,
    }
}
