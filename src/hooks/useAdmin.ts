import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { getUserRole } from '@/services/authService'
import { ADMIN_CHECK_STALE_TIME } from '@/config/env'

export function useAdmin() {
    const { user } = useAuth()

    const { data: isAdmin = false, isLoading } = useQuery({
        queryKey: ['admin-check', user?.id],
        queryFn: async () => {
            if (!user) return false
            const role = await getUserRole(user.id)
            return role === 'admin'
        },
        enabled: !!user,
        staleTime: ADMIN_CHECK_STALE_TIME,
    })

    return { isAdmin, isLoading }
}
