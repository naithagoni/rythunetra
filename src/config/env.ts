/**
 * Centralised environment-variable & app-configuration module.
 *
 * This module provides a single source of truth for all environment variables and configuration constants used across the RythuNetra application.
 */

function requireEnv(key: string): string {
    const value = import.meta.env[key] as string | undefined
    if (!value) {
        throw new Error(
            `Missing required environment variable: ${key}. ` +
                'Check your .env file against .env.example.',
        )
    }
    return value
}

function optionalEnv(key: string, fallback: string): string {
    return (import.meta.env[key] as string | undefined) ?? fallback
}

function optionalEnvNumber(key: string, fallback: number): number {
    const raw = import.meta.env[key] as string | undefined
    if (!raw) return fallback
    const parsed = Number(raw)
    return Number.isNaN(parsed) ? fallback : parsed
}

export const SUPABASE_URL = requireEnv('VITE_SUPABASE_URL')
export const VITE_SUPABASE_ANON_KEY = requireEnv('VITE_SUPABASE_ANON_KEY')

export const STORAGE_BUCKET = optionalEnv(
    'VITE_STORAGE_BUCKET',
    'disease-media',
)
export const STORAGE_CACHE_CONTROL = optionalEnv(
    'VITE_STORAGE_CACHE_CONTROL',
    '3600',
)

export const TRANSLATION_API_URL = optionalEnv(
    'VITE_TRANSLATION_API_URL',
    'https://translate.googleapis.com/translate_a/single',
)

export const OAUTH_CALLBACK_PATH = optionalEnv(
    'OAUTH_CALLBACK_PATH',
    '/auth/callback',
)

export const DEFAULT_LANGUAGE = optionalEnv('VITE_DEFAULT_LANGUAGE', 'en')

/** Default stale time for TanStack Query (ms) */
export const DEFAULT_STALE_TIME = optionalEnvNumber(
    'VITE_DEFAULT_STALE_TIME',
    5 * 60 * 1000,
)

/** Default retry count for TanStack Query */
export const DEFAULT_QUERY_RETRY = optionalEnvNumber(
    'VITE_DEFAULT_QUERY_RETRY',
    1,
)

/** Stale time for admin-check query (ms) */
export const ADMIN_CHECK_STALE_TIME = optionalEnvNumber(
    'VITE_ADMIN_CHECK_STALE_TIME',
    10 * 60 * 1000,
)

export const ADMIN_PAGE_SIZE = optionalEnvNumber('VITE_ADMIN_PAGE_SIZE', 20)
export const DISEASE_PAGE_SIZE = optionalEnvNumber('VITE_DISEASE_PAGE_SIZE', 12)

/** Whether AI features (Chat, Crop Recommender, Scanner) are enabled */
export const AI_ENABLED = optionalEnv('VITE_AI_ENABLED', 'true') === 'true'
