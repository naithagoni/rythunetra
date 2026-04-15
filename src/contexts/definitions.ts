import { createContext } from 'react'
import type { AppUser, AppSession } from '@/types/auth'

export interface AuthContextType {
    user: AppUser | null
    session: AppSession | null
    loading: boolean
    signUp: (
        email: string,
        password: string,
        name: string,
        district: string,
        mandal: string,
    ) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
