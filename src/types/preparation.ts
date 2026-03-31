/**
 * Preparation — user-saved remedy preparations.
 * Simple tracking: remedy name, quantity, notes, images, and video.
 */

export interface Preparation {
    id: string
    user_id: string
    remedy_name: string | null
    quantity: string | null
    preparation_notes: string | null
    image_urls: string[]
    video_url: string | null
    created_at: string
}

export interface CreatePreparationInput {
    remedy_name: string
    quantity?: string
    preparation_notes?: string
    image_urls?: string[]
    video_url?: string
}
