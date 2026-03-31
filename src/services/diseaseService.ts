import { supabase } from './supabase'
import { DISEASE_PAGE_SIZE } from '@/config/env'

/** Select for diseases — JSONB columns + junction tables only */
const DISEASE_SELECT = `
    *,
    crop_variety_diseases(crop_variety_id),
    disease_remedies(remedy_id)
`

/**
 * Fetch diseases with pagination, search, and filter.
 */
export async function getDiseases(options?: {
    language?: string
    page?: number
    limit?: number
    search?: string
    severity?: string
}) {
    const {
        page = 1,
        limit = DISEASE_PAGE_SIZE,
        search,
        severity,
    } = options ?? {}
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
        .from('diseases')
        .select(DISEASE_SELECT, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

    if (search) {
        // Search inside the JSONB name field (English)
        query = query.ilike('name->>en', `%${search}%`)
    }

    if (severity) {
        query = query.eq('severity', severity)
    }

    return query
}

/**
 * Fetch a single disease with all details.
 */
export async function getDiseaseById(id: string) {
    return supabase
        .from('diseases')
        .select(DISEASE_SELECT)
        .eq('id', id)
        .single()
}
