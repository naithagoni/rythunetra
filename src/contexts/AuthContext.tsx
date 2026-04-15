import { useEffect, useState, type ReactNode } from 'react'
import type { AppUser, AppSession } from '@/types/auth'
import * as authService from '@/services/authService'
import { AuthContext } from './definitions'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null)
    const [session, setSession] = useState<AppSession | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        authService.getCurrentAuth().then(({ user, session }) => {
            setSession(session)
            setUser(user)
            setLoading(false)
        })

        const subscription = authService.onAuthStateChange((user, session) => {
            setSession(session)
            setUser(user)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signUp = async (
        email: string,
        password: string,
        name: string,
        district: string,
        mandal: string,
    ) => {
        await authService.signUp(email, password, { name, district, mandal })
    }

    const signIn = async (email: string, password: string) => {
        await authService.signIn(email, password)
    }

    const signInWithGoogle = async () => {
        await authService.signInWithGoogle()
    }

    const signOut = async () => {
        await authService.signOut()
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                loading,
                signUp,
                signIn,
                signInWithGoogle,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
