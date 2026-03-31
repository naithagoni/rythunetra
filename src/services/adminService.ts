import { supabase } from './supabase'
import { ADMIN_PAGE_SIZE, STORAGE_CACHE_CONTROL } from '@/config/env'
import type { LocalizedText, LocalizedTextArray } from '@/types/i18n'

// ─── DUPLICATE CHECKS ────────────────────────────────────

export async function checkDuplicateCrop(name: string, excludeId?: string) {
    const { data } = await supabase
        .from('crops')
        .select('id')
        .ilike('name->>en', name.trim())
    if (!data?.length) return false
    if (excludeId) return data.some((d) => d.id !== excludeId)
    return true
}

export async function checkDuplicateDisease(name: string, excludeId?: string) {
    const { data } = await supabase
        .from('diseases')
        .select('id')
        .ilike('name->>en', name.trim())
    if (!data?.length) return false
    if (excludeId) return data.some((d) => d.id !== excludeId)
    return true
}

export async function checkDuplicateRemedy(name: string, excludeId?: string) {
    const { data } = await supabase
        .from('remedies')
        .select('id')
        .ilike('name->>en', name.trim())
    if (!data?.length) return false
    if (excludeId) return data.some((d) => d.id !== excludeId)
    return true
}

// ─── DISEASES ─────────────────────────────────────────────

const DISEASE_LIST_SELECT = `*`

const DISEASE_DETAIL_SELECT = `
    *,
    crop_variety_diseases(crop_variety_id),
    disease_remedies(remedy_id)
`

export async function adminGetDiseases(page = 1, limit = ADMIN_PAGE_SIZE) {
    const from = (page - 1) * limit
    const to = from + limit - 1

    return supabase
        .from('diseases')
        .select(DISEASE_LIST_SELECT, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)
}

export async function adminGetDisease(id: string) {
    return supabase
        .from('diseases')
        .select(DISEASE_DETAIL_SELECT)
        .eq('id', id)
        .single()
}

export async function adminCreateDisease(disease: {
    name: LocalizedText
    type?: LocalizedText | null
    severity?: string
    image_urls?: string[]
    symptoms?: LocalizedText[]
    primary_cause?: LocalizedText | null
    favorable_conditions?: LocalizedText[]
    preventions?: LocalizedText[]
    treatments?: LocalizedText[]
    aliases?: LocalizedTextArray
}) {
    return supabase.from('diseases').insert(disease).select().single()
}

export async function adminUpdateDisease(
    id: string,
    updates: {
        name?: LocalizedText
        type?: LocalizedText | null
        severity?: string
        image_urls?: string[]
        symptoms?: LocalizedText[]
        primary_cause?: LocalizedText | null
        favorable_conditions?: LocalizedText[]
        preventions?: LocalizedText[]
        treatments?: LocalizedText[]
        aliases?: LocalizedTextArray
    },
) {
    return supabase
        .from('diseases')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
}

export async function adminDeleteDisease(id: string) {
    return supabase.from('diseases').delete().eq('id', id)
}

// ─── DISEASE JUNCTION TABLES ──────────────────────────────

export async function adminReplaceDiseaseCropVarieties(
    diseaseId: string,
    cropVarietyIds: string[],
) {
    await supabase
        .from('crop_variety_diseases')
        .delete()
        .eq('disease_id', diseaseId)
    if (cropVarietyIds.length > 0) {
        const rows = cropVarietyIds.map((crop_variety_id) => ({
            crop_variety_id,
            disease_id: diseaseId,
        }))
        const { error } = await supabase
            .from('crop_variety_diseases')
            .insert(rows)
        if (error) throw error
    }
}

export async function adminReplaceDiseaseRemedies(
    diseaseId: string,
    remedyIds: string[],
) {
    await supabase.from('disease_remedies').delete().eq('disease_id', diseaseId)
    if (remedyIds.length > 0) {
        const rows = remedyIds.map((remedy_id) => ({
            disease_id: diseaseId,
            remedy_id,
        }))
        const { error } = await supabase.from('disease_remedies').insert(rows)
        if (error) throw error
    }
}

// ─── REMEDIES ─────────────────────────────────────────────

const REMEDY_LIST_SELECT = `*`

const REMEDY_DETAIL_SELECT = `*`

export async function adminGetRemedies(page = 1, limit = ADMIN_PAGE_SIZE) {
    const from = (page - 1) * limit
    const to = from + limit - 1

    return supabase
        .from('remedies')
        .select(REMEDY_LIST_SELECT, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)
}

export async function adminGetRemedy(id: string) {
    return supabase
        .from('remedies')
        .select(REMEDY_DETAIL_SELECT)
        .eq('id', id)
        .single()
}

export async function adminCreateRemedy(remedy: {
    name: LocalizedText
    type?: LocalizedText | null
    how_it_works?: LocalizedText | null
    usage_instructions?: LocalizedText[]
    preparation_instructions?: LocalizedText[]
    ingredients?: LocalizedText[]
    effectiveness?: string
    aliases?: LocalizedTextArray
}) {
    return supabase.from('remedies').insert(remedy).select().single()
}

export async function adminUpdateRemedy(
    id: string,
    updates: {
        name?: LocalizedText
        type?: LocalizedText | null
        how_it_works?: LocalizedText | null
        usage_instructions?: LocalizedText[]
        preparation_instructions?: LocalizedText[]
        ingredients?: LocalizedText[]
        effectiveness?: string
        aliases?: LocalizedTextArray
    },
) {
    return supabase
        .from('remedies')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
}

export async function adminDeleteRemedy(id: string) {
    return supabase.from('remedies').delete().eq('id', id)
}

// ─── REMEDY ↔ DISEASE LINKING ─────────────────────────────

export async function adminReplaceRemedyDiseases(
    remedyId: string,
    diseaseIds: string[],
) {
    await supabase.from('disease_remedies').delete().eq('remedy_id', remedyId)
    if (diseaseIds.length > 0) {
        const rows = diseaseIds.map((disease_id) => ({
            disease_id,
            remedy_id: remedyId,
        }))
        const { error } = await supabase.from('disease_remedies').insert(rows)
        if (error) throw error
    }
}

export async function adminLinkRemedyToDisease(link: {
    disease_id: string
    remedy_id: string
}) {
    return supabase
        .from('disease_remedies')
        .upsert(link, { onConflict: 'disease_id,remedy_id' })
        .select()
        .single()
}

export async function adminUnlinkRemedyFromDisease(
    diseaseId: string,
    remedyId: string,
) {
    return supabase
        .from('disease_remedies')
        .delete()
        .eq('disease_id', diseaseId)
        .eq('remedy_id', remedyId)
}

// ─── STORAGE (file uploads) ──────────────────────────────

const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif']
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_UPLOAD_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
]

/** Validate and sanitize the file extension from a filename */
export function getSafeExtension(filename: string): string {
    const ext = (filename.split('.').pop() || '').toLowerCase()
    return ALLOWED_IMAGE_EXTENSIONS.includes(ext) ? ext : 'jpg'
}

export async function adminUploadFile(
    bucket: string,
    path: string,
    file: File,
) {
    // Server-side validation
    if (file.size > MAX_UPLOAD_SIZE) {
        throw new Error('File exceeds maximum size of 10 MB')
    }
    if (!ALLOWED_UPLOAD_MIME_TYPES.includes(file.type)) {
        throw new Error('Invalid file type. Allowed: JPEG, PNG, WebP, GIF')
    }

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            cacheControl: STORAGE_CACHE_CONTROL,
            contentType: file.type,
            upsert: true,
        })
    if (error) throw error
    const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)
    return urlData.publicUrl
}

// ─── CROPS ────────────────────────────────────────────────

const CROP_LIST_SELECT = `*`

const CROP_DETAIL_SELECT = `*`

export async function adminGetCrops(page = 1, limit = ADMIN_PAGE_SIZE) {
    const from = (page - 1) * limit
    const to = from + limit - 1

    return supabase
        .from('crops')
        .select(CROP_LIST_SELECT, { count: 'exact' })
        .order('created_at', { ascending: true })
        .range(from, to)
}

export async function adminGetCrop(id: string) {
    return supabase
        .from('crops')
        .select(CROP_DETAIL_SELECT)
        .eq('id', id)
        .single()
}

export async function adminCreateCrop(crop: {
    name: LocalizedText
    crop_type?: LocalizedText | null
    image_url?: string | null
    aliases?: LocalizedTextArray
    suitable_soil_types?: { type: string; subType: string }[]
}) {
    return supabase.from('crops').insert(crop).select().single()
}

export async function adminUpdateCrop(
    id: string,
    updates: {
        name?: LocalizedText
        crop_type?: LocalizedText | null
        image_url?: string | null
        aliases?: LocalizedTextArray
        suitable_soil_types?: { type: string; subType: string }[]
    },
) {
    return supabase.from('crops').update(updates).eq('id', id).select().single()
}

export async function adminDeleteCrop(id: string) {
    return supabase.from('crops').delete().eq('id', id)
}

// ─── CROP VARIETIES ───────────────────────────────────────

const CROP_VARIETY_DETAIL_SELECT = `*, crop_variety_diseases(disease_id)`

export async function adminGetCropVarieties(cropId: string) {
    return supabase
        .from('crop_varieties')
        .select(CROP_VARIETY_DETAIL_SELECT)
        .eq('major_crop', cropId)
        .order('created_at', { ascending: true })
}

export async function adminGetCropVariety(id: string) {
    return supabase
        .from('crop_varieties')
        .select(CROP_VARIETY_DETAIL_SELECT)
        .eq('id', id)
        .single()
}

export async function adminCreateCropVariety(variety: {
    name: LocalizedText
    major_crop: string
    image_url?: string | null
    recommended_seasons?: object[]
    districts?: string[]
    grain_character?: LocalizedTextArray | null
    special_characteristics?: LocalizedText[]
}) {
    return supabase.from('crop_varieties').insert(variety).select().single()
}

export async function adminUpdateCropVariety(
    id: string,
    updates: {
        name?: LocalizedText
        image_url?: string | null
        recommended_seasons?: object[]
        districts?: string[]
        grain_character?: LocalizedTextArray | null
        special_characteristics?: LocalizedText[]
    },
) {
    return supabase
        .from('crop_varieties')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
}

export async function adminDeleteCropVariety(id: string) {
    return supabase.from('crop_varieties').delete().eq('id', id)
}

// ─── CROP VARIETY ↔ DISEASE JUNCTION ──────────────────────

export async function adminReplaceCropVarietyDiseases(
    varietyId: string,
    diseaseIds: string[],
) {
    await supabase
        .from('crop_variety_diseases')
        .delete()
        .eq('crop_variety_id', varietyId)
    if (diseaseIds.length > 0) {
        const rows = diseaseIds.map((disease_id) => ({
            crop_variety_id: varietyId,
            disease_id,
        }))
        const { error } = await supabase
            .from('crop_variety_diseases')
            .insert(rows)
        if (error) throw error
    }
}

// ─── LOOKUP HELPERS (unpaginated, for dropdowns) ──────────

export async function adminGetAllCrops() {
    return supabase
        .from('crops')
        .select('id, name')
        .order('created_at', { ascending: true })
}

export async function adminGetAllDiseases() {
    return supabase
        .from('diseases')
        .select('id, name')
        .order('created_at', { ascending: true })
}

export async function adminGetAllRemedies() {
    return supabase
        .from('remedies')
        .select('id, name')
        .order('created_at', { ascending: true })
}

export async function adminGetAllCropVarieties(cropId?: string) {
    let query = supabase
        .from('crop_varieties')
        .select('id, name, major_crop')
        .order('created_at', { ascending: true })
    if (cropId) query = query.eq('major_crop', cropId)
    return query
}

export async function adminGetCropVarietyCount() {
    return supabase
        .from('crop_varieties')
        .select('id', { count: 'exact', head: true })
}
