import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { GoogleIcon } from '@/components/common/GoogleIcon'
import { CustomDropdown } from '@/components/common/CustomDropdown'
import { DISTRICT_KEYS } from '@/config/districts'
import { getMandalsForDistrict } from '@/config/mandals'
import { Mail, Lock, User, UserPlus, MapPin } from 'lucide-react'

export function RegisterPage() {
    const { t } = useTranslation()
    const { signUp, signInWithGoogle } = useAuth()
    const { currentLanguage } = useLanguage()
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [district, setDistrict] = useState('')
    const [mandal, setMandal] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const districtOptions = useMemo(
        () =>
            DISTRICT_KEYS.map((d) => ({
                value: d,
                label: t(`districts.${d}`),
            })),
        [t],
    )

    const mandalOptions = useMemo(
        () =>
            getMandalsForDistrict(district).map((m) => ({
                value: m.key,
                label: currentLanguage === 'te' ? m.te : m.en,
            })),
        [district, currentLanguage],
    )

    const handleDistrictChange = (value: string) => {
        setDistrict(value)
        setMandal('') // Reset mandal when district changes
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        if (!district) {
            setError(t('settings.selectDistrict'))
            return
        }
        setError('')
        setLoading(true)
        try {
            await signUp(email, password, name, district, mandal)
            navigate('/')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : t('errors.generic'))
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignUp = async () => {
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
                            <UserPlus className="h-6 w-6 text-primary-600" />
                        </div>
                        <h1 className="page-title">
                            {t('auth.registerTitle')}
                        </h1>
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
                                {t('auth.name')}{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input pl-10"
                                    placeholder={t('auth.name')}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                {t('auth.email')}{' '}
                                <span className="text-red-500">*</span>
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
                                {t('auth.password')}{' '}
                                <span className="text-red-500">*</span>
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

                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4" />
                                    {t('settings.district')}{' '}
                                    <span className="text-red-500">*</span>
                                </span>
                            </label>
                            <CustomDropdown
                                options={districtOptions}
                                value={district}
                                onChange={handleDistrictChange}
                                placeholder={t('settings.selectDistrict')}
                                ariaLabel={t('settings.district')}
                                variant="form"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4" />
                                    {t('settings.mandal')}{' '}
                                    <span className="text-red-500">*</span>
                                </span>
                            </label>
                            <CustomDropdown
                                options={mandalOptions}
                                value={mandal}
                                onChange={setMandal}
                                placeholder={
                                    district
                                        ? t('settings.selectMandal')
                                        : t('settings.selectDistrictFirst')
                                }
                                ariaLabel={t('settings.mandal')}
                                variant="form"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !name.trim() ||
                                !email.trim() ||
                                !password ||
                                !district ||
                                !mandal
                            }
                            className="btn-primary w-full"
                        >
                            {loading
                                ? t('common.loading')
                                : t('auth.registerTitle')}
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
                        onClick={handleGoogleSignUp}
                        className="btn-secondary w-full flex items-center justify-center gap-2"
                    >
                        <GoogleIcon />
                        Google
                    </button>

                    <p className="text-center text-sm text-neutral-500 mt-6">
                        {t('auth.hasAccount')}{' '}
                        <Link
                            to="/login"
                            className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            {t('auth.loginTitle')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
