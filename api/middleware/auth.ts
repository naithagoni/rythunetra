import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export interface AuthUser {
    id: string
    email: string
    role: 'farmer' | 'admin'
}

export async function authenticateRequest(
    req: Request,
): Promise<AuthUser | null> {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return null

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser(token)
    if (error || !user) return null

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    return {
        id: user.id,
        email: user.email!,
        role: profile?.role ?? 'farmer',
    }
}

export function requireRole(...roles: string[]) {
    return async (req: Request): Promise<AuthUser | Response> => {
        const user = await authenticateRequest(req)
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            })
        }
        if (!roles.includes(user.role)) {
            return new Response(JSON.stringify({ error: 'Forbidden' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            })
        }
        return user
    }
}
