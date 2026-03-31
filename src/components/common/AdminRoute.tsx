import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { useAdmin } from '@/hooks/useAdmin'
import {
    adminGetDiseases,
    adminGetRemedies,
    adminGetCrops,
} from '@/services/adminService'
import { LoadingSpinner } from './LoadingSpinner'

export function AdminRoute() {
    const { user, loading: authLoading } = useAuth()
    const { isAdmin, isLoading: adminLoading } = useAdmin()
    const queryClient = useQueryClient()

    // Prefetch dashboard counts only after admin is confirmed
    useEffect(() => {
        if (!isAdmin) return
        queryClient.prefetchQuery({
            queryKey: ['admin-dashboard-counts'],
            queryFn: async () => {
                const [diseases, remedies, crops] = await Promise.all([
                    adminGetDiseases(1, 1),
                    adminGetRemedies(1, 1),
                    adminGetCrops(1, 1),
                ])
                return {
                    diseases: diseases?.count ?? 0,
                    remedies: remedies?.count ?? 0,
                    crops: crops?.count ?? 0,
                }
            },
            staleTime: 5 * 60 * 1000,
        })
    }, [queryClient, isAdmin])

    if (authLoading || adminLoading) {
        return <LoadingSpinner text="Loading..." />
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}
