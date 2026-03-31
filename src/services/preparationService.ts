import { supabase } from './supabase'
import { STORAGE_BUCKET, STORAGE_CACHE_CONTROL } from '@/config/env'
import type { Preparation, CreatePreparationInput } from '@/types/preparation'

// ─── File Upload ───────────────────────────────────

export async function uploadPreparationFile(
    userId: string,
    file: File,
    folder: 'images' | 'videos',
) {
    const ext = file.name.split('.').pop() ?? 'bin'
    const path = `preparations/${userId}/${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, {
            cacheControl: STORAGE_CACHE_CONTROL,
            upsert: false,
        })
    if (error) throw error

    const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(data.path)

    return urlData.publicUrl
}

// ─── Read ──────────────────────────────────────────

export async function getPreparations(userId: string) {
    return supabase
        .from('preparations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
}

// ─── Create ────────────────────────────────────────

export async function createPreparation(
    userId: string,
    data: CreatePreparationInput,
) {
    return supabase
        .from('preparations')
        .insert({
            user_id: userId,
            remedy_name: data.remedy_name,
            quantity: data.quantity || null,
            preparation_notes: data.preparation_notes || null,
            image_urls: data.image_urls ?? [],
            video_url: data.video_url || null,
        })
        .select('*')
        .single<Preparation>()
}

// ─── Update ────────────────────────────────────────

export async function updatePreparation(
    id: string,
    data: CreatePreparationInput,
) {
    return supabase
        .from('preparations')
        .update({
            remedy_name: data.remedy_name,
            quantity: data.quantity || null,
            preparation_notes: data.preparation_notes || null,
            image_urls: data.image_urls ?? [],
            video_url: data.video_url || null,
        })
        .eq('id', id)
        .select('*')
        .single<Preparation>()
}

// ─── Delete ────────────────────────────────────────

export async function deletePreparation(id: string) {
    return supabase.from('preparations').delete().eq('id', id)
}
