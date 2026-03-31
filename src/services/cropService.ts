import { supabase } from './supabase'
import type { CropRow, CropVarietyRow } from '@/types/crop'

/** Select for crops — JSONB columns */
const CROP_SELECT = `*`

/** Select for crop varieties — JSONB columns, junction only */
const CROP_VARIETY_SELECT = `*, crop_variety_diseases(disease_id)`

/**
 * Fetch all crops.
 */
export async function getCrops() {
    return supabase
        .from('crops')
        .select(CROP_SELECT)
        .order('created_at', { ascending: true })
}

/**
 * Fetch a single crop by ID.
 */
export async function getCropById(id: string) {
    return supabase
        .from('crops')
        .select(CROP_SELECT)
        .eq('id', id)
        .single<CropRow>()
}

/**
 * Fetch all varieties for a given crop.
 */
export async function getCropVarieties(cropId: string) {
    return supabase
        .from('crop_varieties')
        .select(CROP_VARIETY_SELECT)
        .eq('major_crop', cropId)
        .order('created_at', { ascending: true })
}

/**
 * Fetch a single crop variety by ID.
 */
export async function getCropVarietyById(id: string) {
    return supabase
        .from('crop_varieties')
        .select(CROP_VARIETY_SELECT)
        .eq('id', id)
        .single<CropVarietyRow>()
}

/**
 * Fetch crops suitable for a given soil type + subType.
 */
export async function getCropsBySoilType(type: string, subType: string) {
    return supabase
        .from('crops')
        .select(CROP_SELECT)
        .contains('suitable_soil_types', [{ type, subType }])
        .order('created_at', { ascending: true })
}
