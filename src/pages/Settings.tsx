import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { useAdmin } from '@/hooks/useAdmin'
import { useLanguage } from '@/hooks/useLanguage'
import { usePageTitle } from '@/hooks/usePageTitle'
import { supabase } from '@/services/supabase'
import { LanguageToggle } from '@/components/common/LanguageToggle'
import { CustomDropdown } from '@/components/common/CustomDropdown'
import { DISTRICT_KEYS } from '@/config/districts'
import { getMandalsForDistrict } from '@/config/mandals'
import {
    User,
    Globe,
    Shield,
    LogOut,
    FlaskConical,
    ChevronRight,
    MapPin,
} from 'lucide-react'

export function SettingsPage() {
    const { t } = useTranslation()
    const { user, signOut } = useAuth()
    const { isAdmin } = useAdmin()
    const { currentLanguage } = useLanguage()
    usePageTitle('Settings')
    const navigate = useNavigate()
    const [name, setName] = useState(user?.user_metadata?.name || '')
    const [district, setDistrict] = useState(
        user?.user_metadata?.district || '',
    )
    const [mandal, setMandal] = useState(user?.user_metadata?.mandal || '')
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

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

    const handleUpdateProfile = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage('')
        try {
            await supabase.auth.updateUser({ data: { name, district, mandal } })
            await supabase
                .from('user_profiles')
                .update({
                    name,
                    district: district || null,
                    mandal: mandal || null,
                    preferred_language: currentLanguage,
                })
                .eq('id', user?.id)
            setMessage(t('settings.saved'))
        } catch {
            setMessage(t('errors.generic'))
        } finally {
            setSaving(false)
        }
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header Banner */}
            <div className="page-header-banner rounded-2xl mb-8">
                <div className="relative">
                    <h1 className="page-title">{t('settings.title')}</h1>
                </div>
            </div>

            <div className="space-y-5">
                {/* Quick Links — My Preparations & Admin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link
                        to="/my-preparations"
                        className="bg-white rounded-2xl border border-neutral-200 p-4 flex items-center justify-between hover:border-neutral-300 transition-all duration-200 shadow-card hover:shadow-card-hover hover:-translate-y-0.5"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-violet-50">
                                <FlaskConical className="h-5 w-5 text-violet-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">
                                    {t('common.myPreparations')}
                                </p>
                                <p className="text-xs text-neutral-500">
                                    {t('settings.myPrepsDesc')}
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                    </Link>

                    {isAdmin && (
                        <Link
                            to="/admin"
                            className="bg-white rounded-2xl border border-neutral-200 p-4 flex items-center justify-between hover:border-neutral-300 transition-all duration-200 shadow-card hover:shadow-card-hover hover:-translate-y-0.5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-amber-50">
                                    <Shield className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-amber-800">
                                        {t('common.admin')}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        {t('settings.adminDesc')}
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-neutral-400" />
                        </Link>
                    )}
                </div>

                {/* Profile Section */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-card">
                    <div className="flex items-center gap-3 mb-4">
                        <User className="h-5 w-5 text-primary-600" />
                        <h2 className="text-h4">{t('settings.profile')}</h2>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                {t('auth.name')}
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                {t('auth.email')}
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                className="input bg-neutral-50"
                                disabled
                            />
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
                            <p className="text-xs text-neutral-500 mt-1">
                                {t('settings.districtDesc')}
                            </p>
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

                        {message && (
                            <p
                                className={`text-sm ${message === t('settings.saved') ? 'text-green-600' : 'text-red-600'}`}
                            >
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={saving || !district || !mandal}
                            className="btn-primary"
                        >
                            {saving ? t('common.loading') : t('common.save')}
                        </button>
                    </form>
                </div>

                {/* Language Section */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-card">
                    <div className="flex items-center gap-3 mb-4">
                        <Globe className="h-5 w-5 text-primary-600" />
                        <h2 className="text-h4">{t('settings.language')}</h2>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-neutral-500">
                            {t('settings.languageDesc')}
                        </p>
                        <LanguageToggle />
                    </div>
                </div>

                {/* Account Section */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-card">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="h-5 w-5 text-primary-600" />
                        <h2 className="text-h4">{t('settings.account')}</h2>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="btn-danger inline-flex items-center gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        {t('auth.signOut')}
                    </button>
                </div>
            </div>
        </div>
    )
}
