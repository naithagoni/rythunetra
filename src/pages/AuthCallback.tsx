import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentAuth } from '@/services/authService'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function AuthCallbackPage() {
    const navigate = useNavigate()

    useEffect(() => {
        const handleCallback = async () => {
            const { user } = await getCurrentAuth()
            if (!user) {
                console.error('Auth callback: no session found')
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
