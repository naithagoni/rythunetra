import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/services/supabase'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function AuthCallbackPage() {
    const navigate = useNavigate()

    useEffect(() => {
        const handleCallback = async () => {
            const { error } = await supabase.auth.getSession()
            if (error) {
                console.error('Auth callback error:', error)
                navigate('/login')
            } else {
                navigate('/')
            }
        }

        handleCallback()
    }, [navigate])

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <LoadingSpinner />
        </div>
    )
}
