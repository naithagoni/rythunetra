import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { supabase } from '@/services/supabase'
import { ADMIN_CHECK_STALE_TIME } from '@/config/env'

export function useAdmin() {
    const { user } = useAuth()

    const { data: isAdmin = false, isLoading } = useQuery({
        queryKey: ['admin-check', user?.id],
        queryFn: async () => {
            if (!user) return false
            const { data } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', user.id)
                .single()
            return data?.role === 'admin'
        },
        enabled: !!user,
        staleTime: ADMIN_CHECK_STALE_TIME,
    })

    return { isAdmin, isLoading }
}
