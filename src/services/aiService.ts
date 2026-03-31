import { supabase } from './supabase'
import type { LocalizedText } from '@/types/i18n'

/** Get the current user's access token for authenticated API calls */
async function getAccessToken(): Promise<string | null> {
    const {
        data: { session },
    } = await supabase.auth.getSession()
    return session?.access_token ?? null
}

// ─── Types ────────────────────────────────────────────────

export interface ScanRemedyItem {
    type: 'organic' | 'biological' | 'cultural'
    description: string
}

/** DB remedy returned from cross-reference */
export interface DBRemedyMatch {
    id: string
    name: LocalizedText
    type: LocalizedText | null
    how_it_works: LocalizedText | null
    usage_instructions: LocalizedText[] | null
    preparation_instructions: LocalizedText[] | null
    ingredients: LocalizedText[] | null
    effectiveness: string | null
}

/** DB disease match returned from cross-reference */
export interface DBDiseaseMatch {
    id: string
    name: LocalizedText
    type: LocalizedText | null
    severity: string | null
    imageUrls: string[]
    symptoms: LocalizedText[]
    primaryCause: LocalizedText | null
    preventions: LocalizedText[]
    treatments: LocalizedText[]
    remedies: DBRemedyMatch[]
}

export interface ScanResult {
    isPlant: boolean
    cropName: string
    diseaseDetected: boolean
    diseaseName: string
    severity: 'low' | 'moderate' | 'high' | 'critical' | 'none'
    confidence: number
    symptoms: string[]
    causes: string[]
    remedies: ScanRemedyItem[]
    preventions: string[]
    summary: string
    summaryTe: string
    dbMatch?: DBDiseaseMatch | null
}

export interface ScanHistoryRow {
    id: string
    user_id: string
    image_url: string | null
    crop_name: string | null
    disease_name: string | null
    severity: string | null
    confidence: number | null
    result: ScanResult
    created_at: string
}

export interface ChatSession {
    id: string
    user_id: string
    title: string
    created_at: string
    updated_at: string
}

export interface ChatMessage {
    id: string
    session_id: string
    role: 'user' | 'assistant'
    content: string
    created_at: string
}

// ─── Disease Scanner ──────────────────────────────────────

export async function scanImage(imageFile: File): Promise<ScanResult> {
    const formData = new FormData()
    formData.append('image', imageFile)

    const token = await getAccessToken()
    const response = await fetch('/api/ai/scan', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to scan image')
    }

    return response.json()
}

export async function saveScanResult(
    userId: string,
    result: ScanResult,
    imageUrl?: string,
) {
    return supabase.from('scan_results').insert({
        user_id: userId,
        image_url: imageUrl ?? null,
        crop_name: result.cropName || null,
        disease_name: result.diseaseName || null,
        severity: result.severity,
        confidence: result.confidence,
        result,
    })
}

export async function getScanHistory(userId: string) {
    return supabase
        .from('scan_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)
}

export async function deleteScanResult(id: string) {
    return supabase.from('scan_results').delete().eq('id', id)
}

// ─── Chat ─────────────────────────────────────────────────

export async function createChatSession(userId: string, title?: string) {
    return supabase
        .from('chat_sessions')
        .insert({ user_id: userId, title: title ?? 'New Chat' })
        .select()
        .single()
}

export async function getChatSessions(userId: string) {
    return supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(50)
}

export async function getChatMessages(sessionId: string) {
    return supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
}

export async function saveChatMessage(
    sessionId: string,
    role: 'user' | 'assistant',
    content: string,
) {
    // Save message
    const { error } = await supabase
        .from('chat_messages')
        .insert({ session_id: sessionId, role, content })

    if (error) throw error

    // Update session timestamp + auto-title from first user message
    const updates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
    }
    if (role === 'user') {
        updates.title = content.slice(0, 80)
    }

    await supabase.from('chat_sessions').update(updates).eq('id', sessionId)
}

export async function deleteChatSession(id: string) {
    return supabase.from('chat_sessions').delete().eq('id', id)
}
