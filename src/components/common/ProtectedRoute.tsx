import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from './LoadingSpinner'

export function ProtectedRoute() {
    const { user, loading } = useAuth()

    if (loading) {
        return <LoadingSpinner text="Loading..." />
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}
