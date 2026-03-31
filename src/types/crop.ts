/**
 * Crop — matches sample-data.ts → majorCrop.
 * JSONB-based schema: no translation tables.
 */
import type { LocalizedText, LocalizedTextArray } from './i18n'

// ─── App-level models ─────────────────────────────────────

export interface SoilTypeEntry {
    type: string
    subType: string
}

export interface Crop {
    id: string
    name: LocalizedText
    cropType: LocalizedText
    suitableSoilTypes: SoilTypeEntry[]
    imageUrl: string | null
    aliases: LocalizedTextArray
    created_at?: string
}

export interface RecommendedSeason {
    name: LocalizedText
    durationInDays: number[]
    months: LocalizedTextArray
}

export interface CropVariety {
    id: string
    name: LocalizedText
    majorCrop: string // crop ID
    imageUrl: string | null
    recommendedSeasons: RecommendedSeason[]
    districts: string[]
    grainCharacter: LocalizedTextArray | null
    specialCharacteristics: LocalizedText[]
    diseases: string[] // disease IDs (via junction)
    created_at?: string
}

// ─── DB row shapes (JSONB columns) ────────────────────────

export interface CropRow {
    id: string
    name: LocalizedText
    crop_type: LocalizedText | null
    image_url: string | null
    aliases: LocalizedTextArray | null
    suitable_soil_types: SoilTypeEntry[] | null
    created_at?: string
}

export interface CropVarietyRow {
    id: string
    name: LocalizedText
    major_crop: string
    image_url: string | null
    recommended_seasons: RecommendedSeason[] | null
    districts: string[] | null
    grain_character: LocalizedTextArray | null
    special_characteristics: LocalizedText[] | null
    created_at?: string
    crop_variety_diseases?: { disease_id: string }[]
}

// ─── Transformers ─────────────────────────────────────────

export function toCrop(row: CropRow): Crop {
    return {
        id: row.id,
        name: row.name ?? { en: '', te: '' },
        cropType: row.crop_type ?? { en: '', te: '' },
        suitableSoilTypes: row.suitable_soil_types ?? [],
        imageUrl: row.image_url,
        aliases: row.aliases ?? { en: [], te: [] },
        created_at: row.created_at,
    }
}

export function toCropVariety(row: CropVarietyRow): CropVariety {
    return {
        id: row.id,
        name: row.name ?? { en: '', te: '' },
        majorCrop: row.major_crop,
        imageUrl: row.image_url,
        recommendedSeasons: row.recommended_seasons ?? [],
        districts: row.districts ?? [],
        grainCharacter: row.grain_character ?? null,
        specialCharacteristics: row.special_characteristics ?? [],
        diseases: row.crop_variety_diseases?.map((d) => d.disease_id) ?? [],
        created_at: row.created_at,
    }
}
