/**
 * Backend-agnostic auth types.
 *
 * These decouple the app from any specific auth provider (Supabase, Firebase, etc.).
 * Only src/services/authService.ts should map provider-specific types to these.
 */

export interface AppUser {
    id: string
    email: string
    name: string | null
    district: string | null
    mandal: string | null
    preferredLanguage: string | null
}

export interface AppSession {
    accessToken: string
}
