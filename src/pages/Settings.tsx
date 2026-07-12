import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { useAdmin } from '@/hooks/useAdmin'
import { useLanguage } from '@/hooks/useLanguage'
import { usePageTitle } from '@/hooks/usePageTitle'
import { updateUserProfile } from '@/services/authService'
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
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'

export function SettingsPage() {
    const { t } = useTranslation()
    const { user, signOut } = useAuth()
    const { isAdmin } = useAdmin()
    const { currentLanguage } = useLanguage()
    usePageTitle('Settings')
    const navigate = useNavigate()
    const [name, setName] = useState(user?.name || '')
    const [district, setDistrict] = useState(user?.district || '')
    const [mandal, setMandal] = useState(user?.mandal || '')
    const [saving, setSaving] = useState(false)

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
        setMandal('')
    }

    const handleUpdateProfile = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            await updateUserProfile(
                user!.id,
                { name, district, mandal },
                currentLanguage,
            )
            toast.success(t('settings.saved'))
        } catch {
            toast.error(t('errors.generic'))
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
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">
                    {t('settings.title')}
                </h1>
            </div>

            <div className="flex flex-col gap-5">
                {/* Quick Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link to="/my-preparations">
                        <Card className="hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-lg bg-violet-950/50">
                                        <FlaskConical className="size-5 text-violet-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">
                                            {t('common.myPreparations')}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {t('settings.myPrepsDesc')}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="size-4 text-muted-foreground" />
                            </CardContent>
                        </Card>
                    </Link>

                    {isAdmin && (
                        <Link to="/admin">
                            <Card className="hover:border-amber-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-lg bg-[#D4A72C]/10">
                                            <Shield className="size-5 text-[#D4A72C]" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-[#D4A72C]">
                                                {t('common.admin')}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {t('settings.adminDesc')}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="size-4 text-muted-foreground" />
                                </CardContent>
                            </Card>
                        </Link>
                    )}
                </div>

                {/* Profile */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <User className="size-5 text-primary" />
                            <h2 className="text-lg font-semibold">
                                {t('settings.profile')}
                            </h2>
                        </div>

                        <form onSubmit={handleUpdateProfile}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="settings-name">
                                        {t('auth.name')}
                                    </FieldLabel>
                                    <Input
                                        id="settings-name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="settings-email">
                                        {t('auth.email')}
                                    </FieldLabel>
                                    <Input
                                        id="settings-email"
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="settings-district">
                                        <MapPin className="size-4" />
                                        {t('settings.district')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FieldLabel>
                                    <CustomDropdown
                                        options={districtOptions}
                                        value={district}
                                        onChange={handleDistrictChange}
                                        placeholder={t(
                                            'settings.selectDistrict',
                                        )}
                                        ariaLabel={t('settings.district')}
                                        variant="form"
                                    />
                                    <FieldDescription>
                                        {t('settings.districtDesc')}
                                    </FieldDescription>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="settings-mandal">
                                        <MapPin className="size-4" />
                                        {t('settings.mandal')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FieldLabel>
                                    <CustomDropdown
                                        options={mandalOptions}
                                        value={mandal}
                                        onChange={setMandal}
                                        placeholder={
                                            district
                                                ? t('settings.selectMandal')
                                                : t(
                                                      'settings.selectDistrictFirst',
                                                  )
                                        }
                                        ariaLabel={t('settings.mandal')}
                                        variant="form"
                                    />
                                </Field>

                                <Button
                                    type="submit"
                                    disabled={saving || !district || !mandal}
                                >
                                    {saving
                                        ? t('common.loading')
                                        : t('common.save')}
                                </Button>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>

                {/* Language */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Globe className="size-5 text-primary" />
                            <h2 className="text-lg font-semibold">
                                {t('settings.language')}
                            </h2>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                {t('settings.languageDesc')}
                            </p>
                            <LanguageToggle />
                        </div>
                    </CardContent>
                </Card>

                {/* Account */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="size-5 text-primary" />
                            <h2 className="text-lg font-semibold">
                                {t('settings.account')}
                            </h2>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={handleSignOut}
                            className="gap-2"
                        >
                            <LogOut className="size-4" />
                            {t('auth.signOut')}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
