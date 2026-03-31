import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { GoogleIcon } from '@/components/common/GoogleIcon'
import { Mail, Lock, LogIn } from 'lucide-react'

export function LoginPage() {
    const { t } = useTranslation()
    const { signIn, signInWithGoogle } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await signIn(email, password)
            navigate('/')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : t('errors.generic'))
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : t('errors.generic'))
        }
    }

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="page-header-banner rounded-2xl mb-6">
                    <div className="relative text-center">
                        <div className="page-header-icon">
                            <LogIn className="h-6 w-6 text-primary-600" />
                        </div>
                        <h1 className="page-title">{t('auth.loginTitle')}</h1>
                        <p className="page-subtitle">
                            {t('home.heroSubtitle')}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-card">
                    {error && (
                        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                {t('auth.email')}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input pl-10"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                {t('auth.password')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="input pl-10"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading
                                ? t('common.loading')
                                : t('auth.loginTitle')}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-neutral-400">
                                {t('auth.orContinueWith')}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="btn-secondary w-full flex items-center justify-center gap-2"
                    >
                        <GoogleIcon />
                        Google
                    </button>

                    <p className="text-center text-sm text-neutral-500 mt-6">
                        {t('auth.noAccount')}{' '}
                        <Link
                            to="/register"
                            className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            {t('auth.registerTitle')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
