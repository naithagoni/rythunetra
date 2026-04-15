/**
 * Auth service — centralises ALL auth-provider calls.
 *
 * This is the ONLY file (together with supabase.ts) that imports the Supabase
 * auth SDK. Swapping auth providers means rewriting this single file.
 */

import { supabase } from './supabase'
import type { AppUser, AppSession } from '@/types/auth'
import { DEFAULT_LANGUAGE, OAUTH_CALLBACK_PATH } from '@/config/env'

// ─── Internal mappers (Supabase → App types) ─────────────

function toAppUser(supabaseUser: {
    id: string
    email?: string
    user_metadata?: Record<string, unknown>
}): AppUser {
    const meta = supabaseUser.user_metadata ?? {}
    return {
        id: supabaseUser.id,
        email: supabaseUser.email ?? '',
        name: (meta.name as string) ?? null,
        district: (meta.district as string) ?? null,
        mandal: (meta.mandal as string) ?? null,
        preferredLanguage: (meta.preferred_language as string) ?? null,
    }
}

function toAppSession(supabaseSession: {
    access_token: string
}): AppSession {
    return { accessToken: supabaseSession.access_token }
}

// ─── Session ──────────────────────────────────────────────

export async function getCurrentAuth(): Promise<{
    user: AppUser | null
    session: AppSession | null
}> {
    const {
        data: { session },
    } = await supabase.auth.getSession()
    return {
        user: session?.user ? toAppUser(session.user) : null,
        session: session ? toAppSession(session) : null,
    }
}

export function onAuthStateChange(
    callback: (user: AppUser | null, session: AppSession | null) => void,
) {
    const {
        data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(
            session?.user ? toAppUser(session.user) : null,
            session ? toAppSession(session) : null,
        )
    })
    return { unsubscribe: () => subscription.unsubscribe() }
}

export async function getAccessToken(): Promise<string | null> {
    const {
        data: { session },
    } = await supabase.auth.getSession()
    return session?.access_token ?? null
}

// ─── Sign up / sign in / sign out ─────────────────────────

export async function signUp(
    email: string,
    password: string,
    metadata: { name: string; district: string; mandal: string },
) {
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                ...metadata,
                preferred_language: DEFAULT_LANGUAGE,
            },
        },
    })
    if (error) throw error
}

export async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    if (error) throw error
}

export async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}${OAUTH_CALLBACK_PATH}`,
        },
    })
    if (error) throw error
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

// ─── Profile ──────────────────────────────────────────────

export async function getUserRole(
    userId: string,
): Promise<'farmer' | 'admin'> {
    const { data } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single()
    return (data?.role as 'farmer' | 'admin') ?? 'farmer'
}

export async function updateUserProfile(
    userId: string,
    updates: {
        name: string
        district: string
        mandal: string
    },
    preferredLanguage: string,
) {
    const { error: authError } = await supabase.auth.updateUser({
        data: updates,
    })
    if (authError) throw authError

    const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
            name: updates.name,
            district: updates.district || null,
            mandal: updates.mandal || null,
            preferred_language: preferredLanguage,
        })
        .eq('id', userId)
    if (profileError) throw profileError
}
