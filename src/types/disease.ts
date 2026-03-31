/**
 * Disease — matches sample-data.ts → disease.
 * JSONB-based schema: no translation tables or child item tables.
 */
import type { LocalizedText, LocalizedTextArray } from './i18n'

// ─── App-level model ──────────────────────────────────────

export type DiseaseSeverity = 'low' | 'moderate' | 'high' | 'critical'

export interface Disease {
    id: string
    name: LocalizedText
    type: LocalizedText
    cropVarieties: string[] // crop variety IDs (via junction)
    severity: DiseaseSeverity
    imageUrl: string[]
    symptoms: LocalizedText[]
    primaryCause: LocalizedText
    favorableConditions: LocalizedText[]
    preventions: LocalizedText[]
    treatments: LocalizedText[]
    aliases: LocalizedTextArray
    remedies: string[] // remedy IDs (via junction)
    created_at?: string
}

// ─── DB row shape (JSONB columns) ─────────────────────────

export interface DiseaseRow {
    id: string
    name: LocalizedText
    type: LocalizedText | null
    severity: DiseaseSeverity | null
    image_urls: string[] | null
    symptoms: LocalizedText[] | null
    primary_cause: LocalizedText | null
    favorable_conditions: LocalizedText[] | null
    preventions: LocalizedText[] | null
    treatments: LocalizedText[] | null
    aliases: LocalizedTextArray | null
    created_at?: string
    crop_variety_diseases?: { crop_variety_id: string }[]
    disease_remedies?: { remedy_id: string }[]
}

// ─── Transformer ──────────────────────────────────────────

export function toDisease(row: DiseaseRow): Disease {
    return {
        id: row.id,
        name: row.name ?? { en: '', te: '' },
        type: row.type ?? { en: '', te: '' },
        cropVarieties:
            row.crop_variety_diseases?.map((cvd) => cvd.crop_variety_id) ?? [],
        severity: row.severity ?? 'moderate',
        imageUrl: row.image_urls ?? [],
        symptoms: row.symptoms ?? [],
        primaryCause: row.primary_cause ?? { en: '', te: '' },
        favorableConditions: row.favorable_conditions ?? [],
        preventions: row.preventions ?? [],
        treatments: row.treatments ?? [],
        aliases: row.aliases ?? { en: [], te: [] },
        remedies: row.disease_remedies?.map((dr) => dr.remedy_id) ?? [],
        created_at: row.created_at,
    }
}

/**
 * Convenience alias used by list / card components.
 * Now uses the same DiseaseRow since all data is on one table.
 */
export type DiseaseListItem = DiseaseRow
